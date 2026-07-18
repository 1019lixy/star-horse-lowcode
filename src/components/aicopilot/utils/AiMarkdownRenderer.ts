/**
 * AI Copilot - 简易 Markdown 渲染器
 *
 * aiRenderMarkdown: 将 Markdown 字符串渲染为 HTML
 * 支持：标题 / 粗体 / 斜体 / 代码块 / 行内代码 / 无序/有序列表 / 链接 / 段落 / 引用
 * 包含 XSS 防护：先转义 < > & 再处理
 */

/** 转义 HTML 特殊字符 */
const aiEscapeHtml = (text: string): string => {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
};

/** 反转义单/双引号（仅在生成属性时使用，保持安全） */
const aiEscapeAttr = (text: string): string => {
    return aiEscapeHtml(text)
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
};

/** 处理行内格式：粗体、斜体、行内代码、链接 */
const aiRenderInline = (text: string): string => {
    let out = text;
    // 行内代码：`code`
    out = out.replace(/`([^`]+?)`/g, (_m, code: string) => {
        return `<code class="md-inline-code">${aiEscapeHtml(code)}</code>`;
    });
    // 粗体：**text**
    out = out.replace(/\*\*([^*]+?)\*\*/g, "<strong>$1</strong>");
    // 斜体：*text*
    out = out.replace(/\*([^*]+?)\*/g, "<em>$1</em>");
    // 链接：[text](url)
    out = out.replace(
        /\[([^\]]+?)\]\(([^)\s]+)\)/g,
        (_m, label: string, url: string) => {
            return `<a href="${aiEscapeAttr(url)}" target="_blank" rel="noopener noreferrer">${label}</a>`;
        },
    );
    return out;
};

/**
 * 渲染 Markdown 为 HTML
 *
 * @param md Markdown 字符串
 * @returns HTML 字符串
 */
export const aiRenderMarkdown = (md: string): string => {
    if (!md) return "";
    // 统一换行
    const text = md.replace(/\r\n/g, "\n");
    const lines = text.split("\n");
    const html: string[] = [];

    let i = 0;
    while (i < lines.length) {
        const line = lines[i];

        // 代码块
        const fenceMatch = line.match(/^```(\w*)\s*$/);
        if (fenceMatch) {
            const lang = fenceMatch[1] || "";
            const codeLines: string[] = [];
            i++;
            while (i < lines.length && !/^```\s*$/.test(lines[i])) {
                codeLines.push(lines[i]);
                i++;
            }
            i++; // 跳过结束 ```
            const langClass = lang ? ` lang-${lang}` : "";
            const code = aiEscapeHtml(codeLines.join("\n"));
            html.push(
                `<pre class="md-code-block${langClass}"><code>${code}</code></pre>`,
            );
            continue;
        }

        // 标题
        const headerMatch = line.match(/^(#{1,6})\s+(.*)$/);
        if (headerMatch) {
            const level = headerMatch[1].length;
            const content = aiRenderInline(aiEscapeHtml(headerMatch[2]));
            html.push(`<h${level}>${content}</h${level}>`);
            i++;
            continue;
        }

        // 引用
        const quoteMatch = line.match(/^>\s?(.*)$/);
        if (quoteMatch) {
            const quoteLines: string[] = [];
            while (i < lines.length && /^>\s?/.test(lines[i])) {
                quoteLines.push(lines[i].replace(/^>\s?/, ""));
                i++;
            }
            const content = aiRenderInline(aiEscapeHtml(quoteLines.join(" ")));
            html.push(`<blockquote class="md-blockquote">${content}</blockquote>`);
            continue;
        }

        // 无序列表
        if (/^[-*+]\s+/.test(line)) {
            const items: string[] = [];
            while (i < lines.length && /^[-*+]\s+/.test(lines[i])) {
                items.push(lines[i].replace(/^[-*+]\s+/, ""));
                i++;
            }
            const listHtml = items
                .map((it) => `<li>${aiRenderInline(aiEscapeHtml(it))}</li>`)
                .join("");
            html.push(`<ul class="md-ul">${listHtml}</ul>`);
            continue;
        }

        // 有序列表
        if (/^\d+\.\s+/.test(line)) {
            const items: string[] = [];
            while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
                items.push(lines[i].replace(/^\d+\.\s+/, ""));
                i++;
            }
            const listHtml = items
                .map((it) => `<li>${aiRenderInline(aiEscapeHtml(it))}</li>`)
                .join("");
            html.push(`<ol class="md-ol">${listHtml}</ol>`);
            continue;
        }

        // 空行
        if (line.trim() === "") {
            i++;
            continue;
        }

        // 段落（连续非空行合并）
        const paraLines: string[] = [];
        while (
            i < lines.length &&
            lines[i].trim() !== "" &&
            !/^(#{1,6})\s+/.test(lines[i]) &&
            !/^```/.test(lines[i]) &&
            !/^>\s?/.test(lines[i]) &&
            !/^[-*+]\s+/.test(lines[i]) &&
            !/^\d+\.\s+/.test(lines[i])
        ) {
            paraLines.push(lines[i]);
            i++;
        }
        const content = aiRenderInline(aiEscapeHtml(paraLines.join(" ")));
        html.push(`<p>${content}</p>`);
    }

    return html.join("\n");
};

/** 代码块复制按钮的辅助：从 HTML 提取纯文本（用于复制） */
export const aiExtractCodeText = (html: string): string => {
    return html
        .replace(/<[^>]+>/g, "")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
};
