import fs from 'fs/promises';
import path from 'path';
import {pinyin} from 'pinyin-pro';

// 项目根目录
const projectRoot = '../../src';
// 存储中文文本和对应的键
const translationDict = {};

// 获取文件名
function getFileName(filePath) {
    return path.basename(filePath, path.extname(filePath));
}

// Remove comments from the content
function removeComments(content) {
    // Remove single-line comments
    content = content.replace(/\/\/.*$/gm, '');
    // Remove multi-line comments
    content = content.replace(/\/\*[\s\S]*?\*\//g, '');
    return content;
}

// 生成拼音键
function generatePinyinKey(fileName, text) {
    const pinyinArray = pinyin(text, {
        toneType: 'none'
    });
    console.log(pinyinArray);
    let arr = pinyinArray.split(' ');
    arr.forEach((item, index) => {
        if (index > 0) arr[index] = item[0].charAt(0).toUpperCase() + item.slice(1);
    });
    //  let pinyinKey = pinyinArray.replaceAll(" ", "");
    let pinyinKey = arr.join('');
    let key = `${fileName}.${pinyinKey}`;
    let index = 1;
    const originalKey = key;
    while (translationDict[key]) {
        key = `${originalKey}_${index}`;
        index++;
    }
    return key;
}

// 提取中文文本并生成字典
async function extractChineseText(filePath) {
    let content = await fs.readFile(filePath, 'utf-8');
    content = removeComments(content);
    const chinesePattern = /[\u4e00-\u9fa5]+/g;
    const fileName = getFileName(filePath);
    let match;
    while ((match = chinesePattern.exec(content)) !== null) {
        const text = match[0];
        const key = generatePinyinKey(fileName, text);
        translationDict[key] = text;
    }
}

// 替换中文文本
async function replaceChineseText(filePath) {
    let content = await fs.readFile(filePath, 'utf-8');
    for (const [key, value] of Object.entries(translationDict)) {
        const escapedValue = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escapedValue, 'g');
        content = content.replace(regex, `{{i18n("${key}")}}`);
    }
    await fs.writeFile(filePath, content, 'utf-8');
}

// 遍历项目中的所有 .vue 文件
async function traverseDirectory(dir) {
    const files = await fs.readdir(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = await fs.stat(filePath);
        if (stat.isDirectory()) {
            await traverseDirectory(filePath);
        } else if (path.extname(file) === '.vue') {
            await extractChineseText(filePath);
        }
    }
}

// 提取中文文本
async function main() {
    await traverseDirectory(projectRoot);

    // 生成字典内容并保存到 zh_CN.ts 文件
    const dictContent = `export const zh_CN = {
${Object.entries(translationDict)
        .map(([key, value]) => `  "${key}": "${value}",`)
        .join('\n')}
};
`;

    const dictFilePath = path.join(projectRoot, 'zh_CN.ts');
    await fs.writeFile(dictFilePath, dictContent, 'utf-8');
    console.log(`字典已保存到 ${dictFilePath}`);

    // 替换所有 .vue 文件中的中文文本
    async function replaceInDirectory(dir) {
        const files = await fs.readdir(dir);
        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = await fs.stat(filePath);
            if (stat.isDirectory()) {
                await replaceInDirectory(filePath);
            } else if (path.extname(file) === '.vue') {
                await replaceChineseText(filePath);
            }
        }
    }

    await replaceInDirectory(projectRoot);
}

main().catch((error) => {
    console.error('An error occurred:', error);
});
