// build-icons.js
import fs from 'node:fs';
import { SVGIcons2SVGFontStream } from 'svgicons2svgfont';

const fontStream = new SVGIcons2SVGFontStream({ fontName: 'my-icons' });
// fontStream.pipe(fs.createWriteStream('public/icons-font.svg'))
//     .on('finish', () => {
//         // 后续转换TTF/WOFF格式
//     });
// 遍历SVG文件并添加至字体流
fs.readdirSync('../icons/flow').forEach((file,index) => {
    const glyph = fs.createReadStream(`../icons/flow/${file}`);
    glyph.metadata = {
        name: file.replace('.svg', ''),
        unicode: [String.fromCharCode(0xe000 + index)] };
    fontStream.write(glyph);
});
// 添加字体流结束处理和格式转换（需要取消注释并补充）
fontStream.pipe(fs.createWriteStream('../../public/icons-font.svg'))
    .on('finish', () => {
        // 生成CSS文件
        const cssContent = [
            `@font-face {`,
            `  font-family: 'my-icons';`,
            `  src: url('./icons-font.svg#my-icons') format('svg');`,
            `}`,
            `.icon {`,
            `  font-family: 'my-icons';`,
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
        fs.readdirSync('../icons/flow').forEach((file, index) => {
            const iconName = file.replace('.svg', '');
            const unicode = String.fromCharCode(0xe000 + index);
            cssContent.push(`.icon-${iconName}::before { content: "\\${unicode.charCodeAt(0).toString(16)}"; }`);
        });

        fs.writeFileSync('../../public/icons.css', cssContent.join('\n'));
        console.log('CSS文件已生成');
    })
    .on('error', err => console.error(err));

// 结束字体流
fontStream.end();
