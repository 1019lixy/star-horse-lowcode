/** 语言扩展映射 */
export const LANG_MAP: Record<string, string> = {
    java: "java", cs: "csharp", cpp: "cpp", js: "javascript", ts: "typescript",
    py: "python", go: "go", sql: "sql", json: "json", yml: "yaml", yaml: "yaml",
    xml: "xml", html: "html", css: "css", md: "markdown", vue: "html",
    jsx: "javascript", tsx: "typescript", rs: "rust", sh: "shell", bat: "batch",
    php: "php", rb: "ruby", swift: "swift", kt: "kotlin", scala: "scala",
};

/** 支持编译的语言 */
export const COMPILABLE_LANGUAGES = new Set(["java", "csharp", "cpp"]);

/** 支持运行的语言 */
export const RUNNABLE_LANGUAGES = new Set(["java", "csharp", "cpp", "python"]);

/** ==================== API 接口配置 ==================== */
export interface IdeApiConfig {
    /**
     * 代码补全服务器接口
     */
    lspServerUrl?: string;
    /** 加载文件树接口 (POST) */
    loadUrl?: string;
    /** 保存文件树接口 (POST) */
    saveUrl?: string;
    /** 编译接口 (POST) */
    compileUrl?: string;
    /** 运行接口 (POST) */
    runUrl?: string;
    /** 模板列表接口 (POST) - 返回 { data: { key: name, ... } } */
    templateUrl?: string;
    /** 加载模板代码接口 (POST) - body: { templateCode, packageName, className } */
    templateLoadUrl?: string;
    /** 编译并注册接口 (POST) - body: { content: sourceCode } */
    compileRegisterUrl?: string;
    /** 注销Bean接口 (POST) - 路径: /unregister/{beanName} */
    unregisterUrl?: string;
    /** 注销全部Bean接口 (POST) */
    unregisterAllUrl?: string;
    /** 已注册Bean列表接口 (GET) */
    registeredListUrl?: string;
    /** 获取Bean源码接口 (GET) - 路径: /source/{beanName} */
    sourceCodeUrl?: string;
    /** 保存草稿接口 (POST) - body: { content: sourceCode } */
    draftSaveUrl?: string;
    /** 草稿列表接口 (GET) */
    draftListUrl?: string;
    /** 获取草稿源码接口 (GET) - 路径: /draft/{beanName} */
    draftSourceUrl?: string;
    /** 健康检查接口 (GET) */
    healthCheckUrl?: string;
    /** 执行方法接口 (POST) - body: { codeId, methodName, params } */
    executeUrl?: string;
    /**加载模块列表接口 (POST)*/
    moduleListUrl?: string;
    /** 创建模块接口 (POST) */
    createModuleUrl?: string;
}

/** ==================== 默认语言模板 ==================== */
export const DEFAULT_TEMPLATES: Record<string, (className: string, packageName: string) => string> = {
    java: (className, packageName) => {
        const pkg = packageName ? `package ${packageName};\n\n` : "";
        return `${pkg}public class ${className} {\n\n    public ${className}() {\n    }\n\n}`;
    },
    csharp: (className, _packageName) => {
        const ns = _packageName ? `namespace ${_packageName};\n\n` : "";
        return `${ns}public class ${className} {\n\n    public ${className}() {\n    }\n\n}`;
    },
    cpp: (className, _packageName) => {
        const ns = _packageName ? `namespace ${_packageName.replace(/\./g, "::")} {\n` : "";
        const nsEnd = _packageName ? `} // namespace ${_packageName.replace(/\./g, "::")}\n` : "";
        return `#include <iostream>\n\n${ns}class ${className} {\npublic:\n    ${className}() {}\n};\n\n${nsEnd}int main() {\n    return 0;\n}\n`;
    },
    python: (className, _packageName) => {
        return `class ${className}:\n\n    def __init__(self):\n        pass\n\n    def __str__(self):\n        return "${className}"\n`;
    },
    typescript: (className, _packageName) => {
        return `export class ${className} {\n\n    constructor() {\n    }\n}\n`;
    },
    javascript: (className, _packageName) => {
        return `class ${className} {\n\n    constructor() {\n    }\n}\n\nexport default ${className};\n`;
    },
    go: (className, packageName) => {
        const pkg = packageName ? `package ${packageName.split(".").pop()}\n\n` : "package main\n\n";
        return `${pkg}import "fmt"\n\ntype ${className} struct {}\n\nfunc main() {\n\tfmt.Println("Hello")\n}\n`;
    },
    kotlin: (className, packageName) => {
        const pkg = packageName ? `package ${packageName}\n\n` : "";
        return `${pkg}class ${className} {\n\n}\n`;
    },
    scala: (className, packageName) => {
        const pkg = packageName ? `package ${packageName}\n\n` : "";
        return `${pkg}class ${className} {\n\n}\n`;
    },
};

/** 根据文件路径推导Java包名（Maven标准：从 src/main/java 之后的路径即为包名） */
export const deriveJavaPackage = (filePath: string): string => {
    // 标准Maven路径：src/main/java 或 src/test/java
    const mavenPatterns = [/src\/main\/java\//, /src\\main\\java\\/, /src\/test\/java\//, /src\\test\\java\\/];
    for (const pattern of mavenPatterns) {
        const idx = filePath.search(pattern);
        if (idx >= 0) {
            const afterSrc = filePath.substring(idx).replace(pattern, "");
            // 去掉最后的文件名部分
            const lastSlash = Math.max(afterSrc.lastIndexOf("/"), afterSrc.lastIndexOf("\\"));
            const pkgPath = lastSlash > 0 ? afterSrc.substring(0, lastSlash) : afterSrc;
            return pkgPath.replace(/[\/\\]/g, ".");
        }
    }
    // 非Maven路径：尝试从路径中提取看起来像包名的部分（com/xxx/yyy 或 com.xxx.yyy）
    const pkgMatch = filePath.match(/(?:^|[\/\\])((?:com|org|net|io|cn)[\/\\][\w]+(?:[\/\\][\w]+)*)(?:[\/\\])(?:[\w]+\.java)?$/);
    if (pkgMatch) {
        return pkgMatch[1].replace(/[\/\\]/g, ".");
    }
    return "";
};

/** 根据文件名推导类名（去掉扩展名） */
export const deriveClassName = (fileName: string): string => {
    const dotIdx = fileName.lastIndexOf(".");
    return dotIdx > 0 ? fileName.substring(0, dotIdx) : fileName;
};

/** 文件图标映射（根据扩展名） */
export const FILE_ICONS: Record<string, string> = {
    java: "☕", js: "📜", ts: "📘", py: "🐍", html: "🌐", css: "🎨",
    json: "📋", md: "📝", sql: "🗃️", go: "🔵", cpp: "⚙️", cs: "💜",
    xml: "📰", yaml: "⚙️", yml: "⚙️", vue: "💚", jsx: "⚛️", tsx: "⚛️",
    rs: "🦀", sh: "💻", bat: "💻", php: "🐘", rb: "💎", swift: "🐦",
};

/** 文件夹图标 */
export const FOLDER_ICONS = {
    open: "📂",
    closed: "📁",
};

/** 获取文件扩展名 */
export const getFileExt = (name: string) =>
    name.includes(".") ? name.split(".").pop()!.toLowerCase() : "";

/** 根据文件名检测语言 */
export const detectLanguage = (name: string) =>
    LANG_MAP[getFileExt(name)] || "plaintext";

/** 获取文件图标 */
export const getFileIcon = (name: string) =>
    FILE_ICONS[getFileExt(name)] || "📄";
