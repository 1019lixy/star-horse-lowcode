import {defineConfig} from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import {fileURLToPath} from "url";
import {dirname, resolve} from "path";
import Components from "unplugin-vue-components/vite";
import {ElementPlusResolver} from "unplugin-vue-components/resolvers";
import AutoImport from "unplugin-auto-import/vite";
import fs from "fs";
//生产types文件插件
import dts from "vite-plugin-dts";
import {execSync} from "child_process";
// import {copy} from "vite-plugin-copy";
// https://vitejs.dev/config/
const baseHost: string = "http://localhost:7719/";
const systemHost: string = "http://localhost:8749/";
const userDbHost: string = "http://localhost:7758/";
const gatewayHost: string = "http://localhost:7780/";
const workflowHost: string = "http://localhost:8999/";
const isGateway: boolean = true;
const env: string = "-dev";
const rewrite = (path: string, name: string) => {
    if (isGateway) {
        return path.replace(new RegExp(`^\/${name}`), `/${name}${env}/${name}`);
    }
    return path;
};
/**
 * 此配置文件，非必需不要随便做修改，特别是打包相关的参数
 */
export default defineConfig((mode) => {
    let optimizeDepsList: string[] = ["vue", "vue-router", "pinia", "axios"];
    if (mode.mode === "development") {
        //
        optimizeDepsList = [];
        fs.readdirSync("node_modules/element-plus/es/components").map(
            async (dirname) => {
                try {
                    fs.accessSync(
                        `node_modules/element-plus/es/components/${dirname}/style/css.mjs`,
                        fs.constants.F_OK,
                    );
                    optimizeDepsList.push(
                        `element-plus/es/components/${dirname}/style/css`,
                    );
                } catch (e) {
                    console.log(`1,将强制对${dirname}进行依赖预构建异常`);
                }
                //注意，一定要包含下面这部分
                try {
                    fs.accessSync(
                        `node_modules/element-plus/es/components/${dirname}/style/index.mjs`,
                        fs.constants.F_OK,
                    );
                    optimizeDepsList.push(
                        `element-plus/es/components/${dirname}/style/index`,
                    );
                } catch (e) {
                    console.log(`2,将强制对${dirname}进行依赖预构建异常`);
                }
            },
        );
    }
    return {
        base: "/",
        server: {
            port: 4000,
            host: true,
            open: true,
            hmr: true,
            proxy: {
                "/system-config": {
                    target: isGateway ? gatewayHost : systemHost,
                    changeOrigin: true,
                    rewrite: (path: string) => rewrite(path, "system-config"),
                    ws: true,
                },

                "/userdb-manage": {
                    target: isGateway ? gatewayHost : userDbHost,
                    changeOrigin: true,
                    rewrite: (path: string) => rewrite(path, "userdb-manage"),
                    ws: true,
                },
                "/quantity-manage": {
                    target: isGateway ? gatewayHost : baseHost,
                    changeOrigin: true,
                    rewrite: (path: string) => rewrite(path, "quantity-manage"),
                    ws: true,
                },
                "/flow-engine": {
                    target: isGateway ? gatewayHost : workflowHost,
                    changeOrigin: true,
                    rewrite: (path: string) => rewrite(path, "flow-engine"),
                    ws: true,
                },
            },
        },
        optimizeDeps: {
            // force: true,
            include: optimizeDepsList,
        },
        plugins: [
            tailwindcss(),
            vue({
                script: {
                    // 开启 defineModel
                    defineModel: true,
                },
            }),
          /*  copy({
                targets: [
                    { src: 'public/pcas-code.json', dest: 'dist/' }
                ]
            }),*/
            dts({
                entryRoot: "./src",
                outDir: "dist/types",
                insertTypesEntry: true,
                rollupTypes: false,
                tsconfigPath: "./tsconfig.build.json",
                exclude: ["**/*.svg", "**/sample/**", "**/views/**"],
                // 显式配置别名，确保 .d.ts 中的 @/ 被正确替换为相对路径
                aliases: {
                    "@": resolve(dirname(fileURLToPath(import.meta.url)), "./src"),
                },
                async afterBuild() {
                    // vue-tsc 在有类型错误时默认不生成声明文件，需要显式传入 --noEmitOnError false
                    console.log("[dts] Running vue-tsc to generate type declarations...");
                    try {
                        execSync(
                            "npx vue-tsc -p tsconfig.build.json --noEmitOnError false",
                            {stdio: "pipe", cwd: process.cwd()},
                        );
                        console.log("[dts] Type declarations generated successfully.");
                    } catch {
                        console.log(
                            "[dts] Type declarations generated (with type warnings).",
                        );
                    }

                    // 后备修复：如果 aliases 选项未完全生效，手动替换 @/ 为相对路径
                    console.log("[dts] Fixing path aliases in declaration files...");
                    const fs = await import("fs");
                    const path = await import("path");
                    const typesDir = resolve(__dirname, "dist/types");

                    function fixPathsInFile(filePath: string) {
                        let content = fs.readFileSync(filePath, "utf-8");
                        if (!content.includes("@/")) return;

                        // 计算从当前文件到 types 根目录的相对路径
                        const relToRoot = path
                            .relative(path.dirname(filePath), typesDir)
                            .replace(/\\/g, "/");
                        const prefix = relToRoot ? relToRoot + "/" : "./";

                        // 替换 "@/xxx" 为 "./xxx" 或 "../xxx"
                        content = content.replace(/"@\//g, `"${prefix}`);
                        content = content.replace(/'@\//g, `'${prefix}`);

                        fs.writeFileSync(filePath, content, "utf-8");
                    }

                    function walkDir(dir: string) {
                        const entries = fs.readdirSync(dir, {withFileTypes: true});
                        for (const entry of entries) {
                            const fullPath = path.join(dir, entry.name);
                            if (entry.isDirectory()) {
                                walkDir(fullPath);
                            } else if (entry.name.endsWith(".d.ts")) {
                                fixPathsInFile(fullPath);
                            }
                        }
                    }

                    walkDir(typesDir);
                    console.log("[dts] Path aliases fixed successfully.");
                },
            }),
            AutoImport({
                imports: [
                    "vue",
                    {
                        "element-plus/es/locale/lang/zh-cn": [
                            ["default", "zhCn"], // 别名导入中文包
                        ],
                    },
                ],
                vueTemplate: true,
                dts: "./auto-imports.d.ts",
                eslintrc: {
                    enabled: true,
                },
                resolvers: [
                    ElementPlusResolver({
                        importStyle: "sass",
                    }),
                ],
            }),
            Components({
                dirs: ["src/components", "src/views"],
                // 这里就是相关ui库的解析工具, 里面的选项有是否使用自动导入样式 如果需要通过 var 变量改变主题 需要注意一下
                resolvers: [ElementPlusResolver({importStyle: "sass"})],
            }),
        ],
        css: {
            //解决 Deprecation Warning: The legacy JS API is deprecated and will be removed in Dart Sass 2.0.0.
            preprocessorOptions: {
                scss: {
                    api: "modern-compiler", // or 'modern'
                },
            },
        },
        resolve: {
            alias: {
                "@": resolve(dirname(fileURLToPath(import.meta.url)), "./src"),
            },
            extensions: [".js", ".vue", ".json", ".ts", ".jsx"],
        },

        cacheDir: "node_modules/.vite",
        build: {
            //  告诉打包工具 "vue-demi" 也是外部依赖项
            rollupOptions: {
                external: [
                    "vue",
                    "pinia",
                   // "element-plus",
                    "@element-plus/icons-vue",
                    "@vueuse/core",
                    "axios",
                    "vue-router",
                    "md-editor-v3",
                    "@wangeditor/editor",
                    "@wangeditor/editor-for-vue",
                    "smooth-signature",
                    "qrcode.vue",
                    "vanilla-jsoneditor",
                    "vue3-barcode",
                    "vue3-ts-jsoneditor",
                    "vue3-signature",
                    "json5",
                    "vue-m-message",
                    "sql-formatter",
                    "tailwindcss",
                    "uuid",
                    "vuedraggable-es",
                    "sortablejs",
                    "preview-image-js",
                    "monaco-editor",
                    "@monaco-editor/react",
                    "@codemirror/lang-cpp",
                    "@codemirror/lang-css",
                    "@codemirror/lang-go",
                    "@codemirror/lang-java",
                    "@codemirror/lang-javascript",
                    "@codemirror/lang-json",
                    "@codemirror/lang-markdown",
                    "@codemirror/lang-python",
                    "@codemirror/lang-sql",
                    "@codemirror/lang-vue",
                    "@codemirror/lang-xml",
                    "@codemirror/lang-yaml",
                    "@codemirror/theme-one-dark",
                    "@replit/codemirror-minimap",
                    "codemirror",
                    "@codemirror/view",
                    "@codemirror/state",
                    "@codemirror/commands",
                    "@codemirror/autocomplete",
                    "@codemirror/*",
                    "thememirror",
                    "markdown-it",
                    "camelcase",
                    "sample/**/*",
                ],
                output: {
                    exports: "named",
                    assetFileNames: "assets/[name][extname]", // 修正资源输出路径
                    // 禁用代码分割
                    codeSplitting: false,
                    // 合并所有chunk到单个文件
                    manualChunks: undefined,
                    // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
                    globals: {
                        vue: "Vue",
                        pinia: "Pinia",
                    },
                },
            },
            terserOptions: {
                compress: {
                    keep_infinity: true,
                    drop_console: true,
                    drop_debugger: true,
                },
                format: {
                    comments: false,
                },
            },
            lib: {
                entry: "src/index.ts", //指定组件编译入口文件
                name: "star-horse-lowcode",
                fileName: (format) => `index.${format}.js`,
                //'cjs', 'umd'
                formats: ["es"],
            }, //库编译模式配置
            // 开启并行压缩
            parallel: true,
            //chunk 大小警告的限制（以 kbs 为单位）
            chunkSizeWarningLimit: 2000,
            //浏览器兼容性  "esnext"|"modules",升级后用modules 报错
            target: "esnext",
            //指定输出路径
            outDir: "dist",
            //生成静态资源的存放路径
            assetsDir: "assets",
            //小于此阈值的导入或引用资源将内联为 base64 编码，以避免额外的 http 请求。设置为 0 可以完全禁用此项
            assetsInlineLimit: 0,
            //启用/禁用 CSS 代码拆分
            cssCodeSplit: true,
            //构建后是否生成 source map 文件
            sourcemap: mode.mode === "development",
            //自定义底层的 Rollup 打包配置
            //@rollup/plugin-commonjs 插件的选项
            commonjsOptions: {},
            //构建的库
            //当设置为 true，构建后将会生成 manifest.json 文件
            manifest: false,
            // 设置为 false 可以禁用最小化混淆，
            // 或是用来指定使用哪种混淆器
            // boolean | 'terser' | 'esbuild'
            minify: "terser", //terser 构建后文件体积更小
            //传递给 Terser 的更多 minify 选项。
            //设置为 false 来禁用将构建后的文件写入磁盘
            write: true,
            //默认情况下，若 outDir 在 root 目录下，则 Vite 会在构建时清空该目录。
            emptyOutDir: true,
        },
    };
});
