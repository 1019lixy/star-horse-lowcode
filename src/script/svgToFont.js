import fs from 'node:fs';
import {SVGIcons2SVGFontStream} from 'svgicons2svgfont';
import svg2ttf from "svg2ttf";
import ttf2woff from "ttf2woff";
import path from "path";
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fontName = 'star-horse-icons';
const fontStream = new SVGIcons2SVGFontStream({
    fontName: fontName,
    normalize: true,
    fixedWidth: false,  // 统一宽度
    centerVertically: true,
    centerHorizontally: true,
    preserveAspectRatio: true
});

// 新增递归收集SVG文件函数
const collectSVGFiles = (dirPath) => {
    const entries = fs.readdirSync(dirPath);
    return entries.flatMap(entry => {
        const fullPath = path.join(dirPath, entry);
        if (fs.statSync(fullPath).isDirectory()) {
            return collectSVGFiles(fullPath); // 递归子目录
        }
        return path.extname(entry) === '.svg' ? fullPath : [];
    });
};
const allSVGs = [];
console.log(__dirname);
const svg1 = collectSVGFiles(path.resolve(__dirname, '../icons'));
const svg2 = collectSVGFiles(path.resolve(__dirname, '../assets/icons'));
allSVGs.push(...svg1, ...svg2);
// 遍历SVG文件并添加至字体流
allSVGs.forEach((file, index) => {
    const glyph = fs.createReadStream(file);
    const fileName = path.basename(file, '.svg');
// 添加目录名前缀防止冲突（示例：flow-add-user）
    let dirName = path.basename(path.dirname(file));
    if (dirName !== 'icons') {
        dirName += "-";
    } else {
        dirName = "";
    }
    glyph.metadata = {
        name: `${dirName}${fileName}`,
        unicode: [String.fromCharCode(0xe000 + index)]
    };
    fontStream.write(glyph);
});
const svgPath = path.resolve(__dirname, `../assets/${fontName}.svg`);
// 添加字体流结束处理和格式转换（需要取消注释并补充）
fontStream.pipe(fs.createWriteStream(svgPath))
    .on('finish', () => {
        const svg = fs.readFileSync(svgPath, 'utf8');
        const ttf = svg2ttf(svg).buffer;
        fs.writeFileSync(path.resolve(__dirname, `../assets/${fontName}.woff`), ttf2woff(ttf));
        fs.unlinkSync(svgPath)
        // 生成CSS文件
        const cssContent = [
            `@font-face {`,
            `  font-family: '${fontName}';`,
            `  src: url('./${fontName}.woff') format('woff');`,
            `  font-display: block;`,
            `}`,
            `.sh_icon {`,
            `  font-family: '${fontName}' ;`,
            `  speak: none;`,
            `  font-style: normal;`,
            `  font-weight: normal;`,
            `  text-transform: none;`,
            `  line-height: 1;`,
            `  -webkit-font-smoothing: antialiased;`,
            `}`,
            ``
        ];

        // 遍历图标生成类
        allSVGs.forEach((file, index) => {
            const fileName = path.basename(file, '.svg');
            // 添加目录名前缀防止冲突（示例：flow-add-user）
            let dirName = path.basename(path.dirname(file));
            const unicode = String.fromCharCode(0xe000 + index);
            if (dirName !== 'icons') {
                dirName += "-";
            } else {
                dirName = "";
            }
            // console.log(file);
            cssContent.push(`.sh-${dirName}${fileName}::before { content: "\\${unicode.charCodeAt(0).toString(16)}"; }`);
        });

        fs.writeFileSync(path.resolve(__dirname, '../assets/icons.css'), cssContent.join('\n'));
        console.log('CSS文件已生成');
    })
    .on('error', err => console.error(err));

// 结束字体流
fontStream.end();

