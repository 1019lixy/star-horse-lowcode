import fs from 'fs/promises';
import path from 'path';

const projectDir = '../../src'; // Project directory
const chineseTexts = new Set();

async function traverseDirectory(dir) {
    const files = await fs.readdir(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = await fs.stat(filePath);
        if (stat.isDirectory()) {
            await traverseDirectory(filePath);
        } else if (file.endsWith('.vue')) {
            //|| file.endsWith('.ts')
            const content = await fs.readFile(filePath, 'utf8');
            const regex = /[\u4e00-\u9fa5]+/g;
            let match;
            while ((match = regex.exec(content)) !== null) {
                chineseTexts.add(match[0]);
            }
        }
    }
}

async function main() {
    await traverseDirectory(projectDir);

    const zh_CN = {};
    let index = 1;
    chineseTexts.forEach((text) => {
        const key = `text_${index}`;
        zh_CN[key] = text;
        index++;
    });

    const output = `const zh_CN = ${JSON.stringify(zh_CN, null, 2)};

export default zh_CN;`;

    await fs.writeFile('./zh_CN_test.ts', output);
}

main().catch((error) => {
    console.error('An error occurred:', error);
});
