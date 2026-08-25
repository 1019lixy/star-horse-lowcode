const fs = require("fs");
const path = require("path");

// 提取一个 vue 文件的 script setup 部分的接口定义概要
function extract(file) {
  const c = fs.readFileSync(file, "utf8");
  const out = { file: path.basename(file), props: [], emits: [], expose: [], models: [] };

  // defineProps<{...}> 多行捕获
  let m = c.match(/defineProps<([\s\S]*?)>\(\)/) || c.match(/defineProps\(\{([\s\S]*?)\n\}\)/);
  if (m && c.match(/defineProps\s*\(\s*\{/)) {
    // 对象式 props
    const body = m[1];
    for (const pm of body.matchAll(/^\s{2}(\w+)\s*:\s*\{?\s*type:?[^,\n]*/gm)) {
      out.props.push(pm[1]);
    }
    for (const pm of body.matchAll(/^\s{2}(\w+):/gm)) out.props.push(pm[1]);
  } else if (m) {
    // 类型式 props: 抓取属性名行
    for (const pm of m[1].matchAll(/^\s*(\w+)[?]?:/gm)) out.props.push(pm[1]);
    // withDefaults(defineProps<X>(), {...})
  }
  const wdm = c.match(/withDefaults\(\s*defineProps<([\s\S]*?)>\s*,\s*\{([\s\S]*?)\}\s*\)/);
  if (wdm) {
    out.props = [];
    for (const pm of wdm[1].matchAll(/^\s*(\w+)[?]?:/gm)) {
      const name = pm[1];
      // 找默认值
      const dv = new RegExp("\\b" + name + "\\s*:\\s*([^,}]+)").exec(wdm[2]);
      const tstr = wdm[1].slice(pm.index, pm.index + 120);
      const tm = /:\s*([^\n]+?);/.exec(tstr);
      out.props.push(name + " :: " + (tm ? tm[1].trim().replace(/\s+/g, " ").slice(0, 60) : "?") + (dv ? " = " + dv[1].trim().slice(0, 30) : ""));
    }
  }
  const em = c.match(/defineEmits\(\[([^\]]*)\]\)/);
  if (em) for (const x of em[1].matchAll(/["'](\w+)["']/g)) out.emits.push(x[1]);
  const exm = c.match(/defineExpose\(\{([\s\S]*?)\}\)/);
  if (exm) {
    for (const x of exm[1].matchAll(/(\w+)\s*[,:]/g)) out.expose.push(x[1]);
  }
  for (const mm of c.matchAll(/defineModel(?:<[^>]*>)?\(?\s*["']?(\w*)["']?/g)) out.models.push(mm[1] || "modelValue");
  return out;
}

const dir = process.argv[2];
for (const f of fs.readdirSync(dir).filter((f) => f.endsWith(".vue")).sort()) {
  const r = extract(path.join(dir, f));
  console.log("=== " + f);
  console.log("props: " + r.props.join(" | "));
  console.log("models: " + r.models.join(", ") + "  emits: " + r.emits.join(", "));
  console.log("expose: " + r.expose.join(", "));
}