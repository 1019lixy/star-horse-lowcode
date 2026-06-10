/** 语言扩展映射 */
export const LANG_MAP: Record<string, string> = {
  java: "java", cs: "csharp", cpp: "cpp", js: "javascript", ts: "typescript",
  py: "python", go: "go", sql: "sql", json: "json", yml: "yaml", yaml: "yaml",
  xml: "xml", html: "html", css: "css", md: "markdown", vue: "html",
  jsx: "javascript", tsx: "typescript", rs: "rust", sh: "shell", bat: "batch",
  php: "php", rb: "ruby", swift: "swift", kt: "kotlin", scala: "scala",
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
