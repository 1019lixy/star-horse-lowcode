import {defineConfig} from "vite";
import vue from "@vitejs/plugin-vue";
import progress from "vite-plugin-progress";
import vueJsx from "@vitejs/plugin-vue-jsx";
import inject from "@rollup/plugin-inject";
import topLevelAwait from "vite-plugin-top-level-await";
import {resolve} from "path";
import {createSvgIconsPlugin} from "vite-plugin-svg-icons";
import Components from "unplugin-vue-components/vite";
import {ElementPlusResolver} from "unplugin-vue-components/resolvers";
import AutoImport from "unplugin-auto-import/vite";
//此插件是处理外部依赖 比如cdn引入的js
import tailwindcss from "@tailwindcss/vite";
import dts from 'vite-plugin-dts';
import {visualizer} from "rollup-plugin-visualizer";
// https://vitejs.dev/config/
/**
 * 此配置文件，非必需不要随便做修改，特别是打包相关的参数
 */
export default defineConfig((mode) => {
    let optimizeDepsList: string[] = [ 'vue',
        'vue-router',
        'pinia',
        'axios'];
    return {
        base: "/",

        optimizeDeps: {
            // force: true,
            include: optimizeDepsList
            // exclude:[]
        },
        plugins: [
            tailwindcss(),
            // vueDevTools(),
            vue({
                script: {
                    // 开启 defineModel
                    defineModel: true
                }
            }),
            dts({
                insertTypesEntry: true,
                copyDtsFiles: true
            }),
            AutoImport({
                imports: ["vue"],
                resolvers: [ElementPlusResolver()]
            }),
            Components({
                dirs: ["src/components", "src/views"],
                // 这里就是相关ui库的解析工具, 里面的选项有是否使用自动导入样式 如果需要通过 var 变量改变主题 需要注意一下
                resolvers: [ElementPlusResolver({importStyle: "sass"})]
            }),
            progress(),
            topLevelAwait(),
            // viteCommonjs(),
            vueJsx({}),
            inject({
                $: "jquery", // 这里会自动载入 node_modules 中的 jquery
                jQuery: "jquery",
                "windows.jQuery": "jquery",
                "windows.$": "jquery"
            }),
            createSvgIconsPlugin({
                iconDirs: [resolve(process.cwd(), "src/icons"),
                    resolve(process.cwd(), "src/assets/icons/svg")],
                symbolId: "icon-[dir]-[name]",
                svgoOptions: {
                    plugins: [
                        {name: 'removeTitle'}, // 删除<title>标签
                        {name: 'removeDesc'}, // 删除<desc>标签
                        {name: 'removeAttrs', params: {attrs: ['fill', 'stroke', 'class']}}, // 删除指定属性
                        {name: 'collapseGroups'}, // 合并重复分组
                        {name: 'convertPathData'} // 优化路径数据
                    ]
                }
            }),
            visualizer({
                open: false, // 构建完成后自动打开分析页面
                gzipSize: true,
                brotliSize: true
            })
        ],
        css: {
            //解决 Deprecation Warning: The legacy JS API is deprecated and will be removed in Dart Sass 2.0.0.
            preprocessorOptions: {
                scss: {
                    api: "modern-compiler" // or 'modern'
                }
            }
        },
        resolve: {
            alias: {
                "@": resolve(__dirname, "./src"),
            },
            extensions: [".js", ".vue", ".json", ".ts", ".jsx"]
        },
        cacheDir: "node_modules/.vite",
        build: {
            //  告诉打包工具 "vue-demi" 也是外部依赖项
            rollupOptions: {
                external: ["vue", 'pinia', 'core-js', 'regenerator-runtime'],
                output: {
                    assetFileNames: 'assets/[name][extname]', // 修正资源输出路径
                    // 禁用代码分割
                    inlineDynamicImports: true,
                    // 合并所有chunk到单个文件
                    manualChunks: undefined,
                    // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
                    globals: {
                        vue: 'Vue',
                        pinia: 'Pinia'
                    },
                },
            },
            terserOptions: {
                compress: {
                    drop_console: mode.mode === "production",
                    drop_debugger: mode.mode === "production"
                }
            },
            lib: {
                entry: "src/index.ts", //指定组件编译入口文件
                name: "star-horse-lowcode",
                fileName: (format) => `index.${format}.js`,
                formats: ['es', 'cjs', 'umd']
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
            assetsInlineLimit: 4096,
            //启用/禁用 CSS 代码拆分
            cssCodeSplit: true,
            //构建后是否生成 source map 文件
            sourcemap: mode.mode === "development",
            //自定义底层的 Rollup 打包配置
            //@rollup/plugin-commonjs 插件的选项
            commonjsOptions: {},
            //构建的库
            // Vite项目 build打包后浏览器中可直接使用的方法 https://blog.csdn.net/weixin_54898878/article/details/129730628
            // lib: {},
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
            emptyOutDir: true
        }
    };
});
