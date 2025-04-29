import { SVGIcons2SVGFontStream } from 'svgicons2svgfont';
import fs from 'node:fs';
import path from 'node:path';


const svgFiles = fs.readdirSync('../icons/flow'); // 修改为你的 SVG 文件路径
const icons = svgFiles.map(file => ({
    svg: fs.readFileSync(path.join('../icons/flow', file), 'utf8'),
    id: path.basename(file, path.extname(file)) // 获取文件名作为 ID
}));

const fontStream = new SVGIcons2SVGFontStream({
    fontName: 'MyCustomIcons', // 字体名称
    fontHeight: 1024, // 字体高度
    normalize: true, // 是否标准化路径数据
    fixedWidth: false, // 是否固定宽度
    icons: icons, // SVG 图标数组
    centerHorizontally: true, // 是否水平居中
    round: 10e10 // 小数点后保留位数
});
fontStream.then((result) => {
    fs.writeFileSync('../../public/MyCustomIcons.ttf', result.ttf); // 输出 TTF 文件
    fs.writeFileSync('../../public/MyCustomIcons.woff', result.woff); // 输出 WOFF 文件
    console.log('Fonts generated successfully.');
}).catch((error) => {
    console.error('Error generating fonts:', error);
});
