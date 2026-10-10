// 修复 vite-plugin-dts 产出的 d.ts 中相对导入无扩展名的问题：
// 消费端 tsconfig 若使用 moduleResolution:"nodenext"(或 node16)，且本包声明了 "type":"module"，
// TypeScript 会按 Node ESM 规则解析包内 d.ts 的相对导入 —— 不做 ./x -> x.d.ts 的扩展名推断，
// 导致 export * 链全部断裂（被消费端 skipLibCheck 静默吞掉），表现为 IDE 报
// "Module 'star-horse-lowcode' has no exported member 'XXX'"，而 bundler 模式正常。
// 修复规则（均利用 TS 官方的 .js -> .ts/.d.ts 后缀替换，bundler/nodenext/node10 三种模式通吃）：
//   './x'        -> './x.js'         (存在 x.d.ts)
//   './x'        -> './x/index.js'   (存在 x/index.d.ts，目录导入)
//   './x.vue'    -> './x.vue.js'     (存在 x.vue.d.ts，Vue SFC 声明)
// 脚本幂等：重复执行不会二次改写；非相对导入(包名)、css 等无法识别的目标保持原样。
import fs from "node:fs";
import path from "node:path";
// 只处理以 ./ 或 ../ 开头的相对导入；兼容单双引号；from 涵盖 import/export 的所有再导出形式
const STATIC = /(\bfrom\s*)(['"])(\.{1,2}\/[^'"\n]+)\2/g;
// typeof import('./x') 动态类型引用
const DYNAMIC = /(\bimport\s*\(\s*)(['"])(\.{1,2}\/[^'"\n]+)\2/g;
const typesDir = path.resolve(process.cwd(), "dist/types");
// 根据磁盘上实际存在的声明文件，决定改写后的 specifier
const rewrite = (file, spec) => {
  const base = path.resolve(path.dirname(file), spec);
  if (fs.existsSync(base + ".d.ts")) return spec + ".js";
  if (fs.existsSync(path.join(base, "index.d.ts"))) return spec + "/index.js";
  return spec;
};
let scanned = 0, changed = 0;
const walk = (dir) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith(".d.ts")) {
      scanned++;
      const src = fs.readFileSync(p, "utf8");
      const fix = (m, kw, q, s) => `${kw}${q}${rewrite(p, s)}${q}`;
      const out = src.replace(STATIC, fix).replace(DYNAMIC, fix);
      if (out !== src) { fs.writeFileSync(p, out); changed++; }
    }
  }
};
if (!fs.existsSync(typesDir)) { console.error("[fix-dts-extensions] dist/types 不存在，请先执行 vite build"); process.exit(1); }
walk(typesDir);
console.log(`[fix-dts-extensions] 扫描 ${scanned} 个 d.ts，改写 ${changed} 个文件中的相对导入为 ESM 扩展名形式`);
