/**
 * 单元格地址工具
 *
 * 职责：A1/B2/AA10 等地址与 {row,col} 互转、区域解析、地址生成
 * 单一职责：纯函数，无状态
 */

/** 列号转字母（1→A, 27→AA） */
export const colToLetter = (col: number): string => {
    let result = "";
    let n = col;
    while (n > 0) {
        const rem = (n - 1) % 26;
        result = String.fromCharCode(65 + rem) + result;
        n = Math.floor((n - 1) / 26);
    }
    return result;
};

/** 字母转列号（A→1, AA→27） */
export const letterToCol = (letter: string): number => {
    let result = 0;
    for (let i = 0; i < letter.length; i++) {
        result = result * 26 + (letter.charCodeAt(i) - 64);
    }
    return result;
};

/** 行列号转地址（1,1 → "A1"） */
export const toAddress = (row: number, col: number): string => {
    return `${colToLetter(col)}${row}`;
};

/** 地址转行列号（"A1" → {row:1, col:1}） */
export const fromAddress = (address: string): { row: number; col: number } => {
    const match = address.match(/^([A-Za-z]+)(\d+)$/);
    if (!match) throw new Error(`Invalid cell address: ${address}`);
    return {
        row: parseInt(match[2], 10),
        col: letterToCol(match[1].toUpperCase()),
    };
};

/** 解析区域字符串（"A1:B10" → {start, end}） */
export const parseRange = (range: string): { startRow: number; startCol: number; endRow: number; endCol: number } => {
    const parts = range.split(":");
    if (parts.length !== 2) throw new Error(`Invalid range: ${range}`);
    const start = fromAddress(parts[0]);
    const end = fromAddress(parts[1]);
    return {
        startRow: Math.min(start.row, end.row),
        startCol: Math.min(start.col, end.col),
        endRow: Math.max(start.row, end.row),
        endCol: Math.max(start.col, end.col),
    };
};

/** 区域转地址数组 */
export const rangeToAddresses = (range: string): string[] => {
    const { startRow, startCol, endRow, endCol } = parseRange(range);
    const addresses: string[] = [];
    for (let r = startRow; r <= endRow; r++) {
        for (let c = startCol; c <= endCol; c++) {
            addresses.push(toAddress(r, c));
        }
    }
    return addresses;
};

/** 获取区域内所有单元格地址（行列范围版） */
export const getRangeAddresses = (
    startRow: number,
    startCol: number,
    endRow: number,
    endCol: number,
): string[] => {
    const addresses: string[] = [];
    for (let r = startRow; r <= endRow; r++) {
        for (let c = startCol; c <= endCol; c++) {
            addresses.push(toAddress(r, c));
        }
    }
    return addresses;
};

/** 检查地址是否在区域内 */
export const isAddressInRange = (
    address: string,
    startRow: number,
    startCol: number,
    endRow: number,
    endCol: number,
): boolean => {
    const { row, col } = fromAddress(address);
    return (
        row >= startRow &&
        row <= endRow &&
        col >= startCol &&
        col <= endCol
    );
};

/** 生成区域字符串 */
export const toRange = (
    startRow: number,
    startCol: number,
    endRow: number,
    endCol: number,
): string => {
    const start = toAddress(startRow, startCol);
    const end = toAddress(endRow, endCol);
    return start === end ? start : `${start}:${end}`;
};

/** 偏移地址 */
export const offsetAddress = (
    address: string,
    rowOffset: number,
    colOffset: number,
): string => {
    const { row, col } = fromAddress(address);
    return toAddress(row + rowOffset, col + colOffset);
};
