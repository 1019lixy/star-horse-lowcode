import {uuid} from "@/api/system";

/**
 * 定义td 数据
 */
export const colDataInfo = (type: any) => {
    if (type == "dytable") {
        return {id: uuid(), colspan: 1, rowspan: 1, items: [], visible: true};
    } else if (type == "box") {
        return {id: uuid(), columns: [boxCol(8)]};
    }
};
const boxCol = (colspan: number) => {
    return {id: uuid(), colspan: colspan, items: [], visible: true};
};
/**
 * 左方插入列
 */
const insertLeftCol = (props: any, type: any, allCol?: boolean) => {
    const position = props.isFirstCol ? 0 : props.colIndex;
    insertCol(props, position, type, allCol);
};
const insertCol = (
    props: any,
    position: number,
    type: any,
    allCol?: boolean,
) => {
    const rows = props.parentField.preps.elements;
    if (type == "box" && !allCol) {
        const row = rows[props.rowIndex];
        const cols = row.columns;
        const colspan: number = 24 / (cols.length + 1);
        cols?.forEach((item: any) => {
            item.colspan = colspan;
        });
        const newCol = boxCol(colspan);
        cols.splice(position, 0, newCol);
    } else {
        for (let index = 0; index < rows.length; index++) {
            const cols = rows[index].columns;
            if (type == "box" && allCol) {
                const colspan: number = 24 / (cols.length + 1);
                cols.forEach((item: any) => {
                    item.colspan = colspan;
                });
                const newCol = boxCol(colspan);
                cols.splice(position, 0, newCol);
            } else {
                const newCol = colDataInfo(type);
                newCol.visible = true;
                cols.splice(position, 0, newCol);
            }
        }
    }
};
export const insertRightCol = (props: any, type: any, allCol?: boolean) => {
    const position = props.colIndex + 1;
    insertCol(props, position, type, allCol);
};
const insertAboveRow = (props: any, type: any) => {
    const position = props.rowIndex;
    addRow(props, position, type);
};
const addRow = (props: any, position: number, type: any) => {
    const rows = props.parentField.preps.elements;
    const columns = rows[0].columns;
    let len = columns.length;
    let cols: any;
    cols = {
        id: uuid(),
        columns: []
    };
    if (type == "box") {
        for (let index = 0; index < rows.length; index++) {
            const colLen = rows[index].columns.length;
            if (colLen > len) {
                len = colLen;
            }
        }
        const items = [];
        const colspan = parseInt(String(24 / len));
        for (let i = 0; i < len; i++) {
            const newCol = boxCol(colspan);
            newCol.visible = true;
            items.push(newCol);
        }
        cols.columns = items;
    } else {
        const items = [];
        for (let i = 0; i < len; i++) {
            const newCol = colDataInfo(type);
            newCol.visible = true;
            items.push(newCol);
        }
        //还需要判断哪些列是需要隐藏
        //如果有整列合并，则获取到当前的列进行隐藏
        for (let index = 0; index < len; index++) {
            if (columns[index].rowspan == rows.length) {
                items[index].visible = false;
                columns[index].rowspan = columns[index].rowspan + 1;
                break;
            }
        }
        console.log(items);
        cols.columns = items;
    }
    rows.splice(position, 0, cols);
};
export const insertBelowRow = (props: any, type: any) => {
    const position = props.rowIndex + 1;
    addRow(props, position, type);
};
const tableCellInfo = (props: any, type: any) => {
    const rows = props.parentField.preps.elements;
    const row = rows[props.rowIndex];
    const col = row.columns[props.colIndex];
    return {rows, row, col};
};
const mergeLeftCol = (props: any, type: any) => {
    const position = props.colIndex - 1;
    mergeCol(props, position, type);
};
const mergeCol = (props: any, position: number, type: any) => {
    const {row, col} = tableCellInfo(props, type);
    const colInfo = row.columns[position];
    col.colspan = col.colspan + colInfo.colspan;
    if (type == "box") {
        row.columns.splice(position, 1);
    } else {
        colInfo.visible = false;
    }
};
const mergeRightCol = (props: any, type: any) => {
    const position = props.colIndex + 1;
    mergeCol(props, position, type);
};
const mergeWholeCol = (props: any, type: any) => {
    const {rows, col} = tableCellInfo(props, type);
    if (col.rowspan === rows.length) {
        return;
    }
    for (let i = 0; i < rows.length; i++) {
        const row1 = rows[i];
        const cols = row1.columns;
        if (cols[props.colIndex] && i > 0) {
            cols[props.colIndex].visible = false;
        }
    }
    rows[0].columns[props.colIndex].rowspan = rows.length;

};
const mergeAboveRow = (props: any, type: any) => {
    const {rows, row, col} = tableCellInfo(props, type);
    const aboveRow = rows[props.rowIndex - 1];
    const aboveCol = aboveRow.columns[props.colIndex];
    aboveCol.rowspan = aboveCol.rowspan + col.rowspan;
    col.visible = false;
};
const mergeBelowRow = (props: any, type: any) => {
    const {rows, col} = tableCellInfo(props, type);
    const belowRow = rows[props.rowIndex + col.rowspan];
    col.rowspan = col.rowspan + 1;
    if (belowRow.columns[props.colIndex]) {
        belowRow.columns[props.colIndex].visible = false;
    }
};
const mergeWholeRow = (props: any, type: any) => {
    const {row} = tableCellInfo(props, type);
    let totalCols: number = 0;
    for (const index in row.columns) {
        const col = row.columns[index];
        totalCols += col.colspan;
        col.visible = index == 0;
    }
    row.columns[0].colspan = totalCols;
    // row.columns = [col];
};
/**
 * 需要判断需要还原的周边数据
 * @param props
 * @param type
 */
const undoMergeRow = (props: any, type: any) => {
    const {rows, row, col} = tableCellInfo(props, type);
    if (row.columns.length == 1) {
        col.colspan = col.colspan - 1;
        const newCol = colDataInfo(type);
        newCol.visible = true;
        row.columns.splice(props.colIndex, 0, newCol);
    } else {
        col.rowspan = col.rowspan - 1;
        const newCol = colDataInfo(type);
        newCol.visible = true;
        row.columns.splice(props.colIndex, 1, newCol);
        rows[props.rowIndex + 1].columns.splice(props.colIndex, 0, col);
    }
};
/**
 * 需要判断要还原的周边数据
 * @param props
 * @param type
 */
const undoMergeCol = (props: any, type: any) => {
    const {rows, row, col} = tableCellInfo(props, type);
    const position = props.isFirstCol ? props.colIndex + 1 : props.colIndex - 1;
    //如果 列的行合并和整个表格的行相同，则表示已合并的整列
    if (type == "box") {
        //获取当前行最大的colspan
        let maxColspan = 0;
        for (const index in row.columns) {
            const col = row.columns[index];
            if (col.colspan > maxColspan) {
                maxColspan = col.colspan;
            }
        }
        if (maxColspan == 1) {
            return;
        }
        //检查所有的colspan 是否相同，如果相同，则按照24/colspan 插入新的列
        let isSame = true;
        for (const index in row.columns) {
            const col = row.columns[index];
            if (col.colspan != maxColspan) {
                isSame = false;
                break;
            }
        }

        if (isSame) {
            maxColspan = 24 / (row.columns.length + 1);
            row.columns.forEach((ele) => {
                ele.colspan = maxColspan;
            });
            const newCol = boxCol(maxColspan);
            newCol.visible = true;
            row.columns.splice(position, 0, newCol);
        } else {
            maxColspan = maxColspan / 2;
            const newCol = boxCol(type);
            newCol.visible = true;
            row.columns.splice(props.colIndex, 0, newCol);
        }
    } else {
        if (col.rowspan == rows.length) {
            col.rowspan = col.rowspan - 1;
            const newCol = colDataInfo(type);
            newCol.visible = true;
            row.columns.splice(props.colIndex, 1, newCol);
            rows[props.rowIndex + 1].columns.splice(props.colIndex, 0, col);
        } else {
            col.colspan = col.colspan - 1;
            const newCol = colDataInfo(type);
            newCol.visible = true;
            row.columns.splice(props.colIndex, 0, newCol);
        }
    }
};
/**
 * 删除整列，在删除列的同时需要，考虑合并的情况，否则有可能导致整行被删除
 * @param props
 */
const deleteWholeCol = (props: any, type: any) => {
    const rows = props.parentField.preps.elements;
    for (let i = 0; i < rows.length; i++) {
        const cols = rows[i].columns;
        if (cols[props.colIndex]) {
            cols[props.colIndex].visible = false;
        }
    }
};
/**
 * 添加单元格
 * @param props
 * @param type
 * @param isBefore
 */
const addCell = (props: any, type: any, isBefore: boolean) => {
    const rows = props.parentField.preps.elements;
    for (const index in rows) {
        const cols = rows[index].columns;
        for (const sIndex in cols) {
            if (props.colIndex == sIndex && props.rowIndex == index) {
                let tempIndex = parseInt(sIndex);
                if (!isBefore) {
                    tempIndex = parseInt(sIndex) + 1;
                }
                const newCol = colDataInfo(type);
                newCol.visible = true;
                cols.splice(tempIndex, 0, newCol);
                break;
            }
        }
    }
};
/**
 * 删除当前单元格
 * @param props
 * @param type
 */
const deleteCurrentCol = (props: any, type: any) => {
    const rows = props.parentField.preps.elements;
    for (const index in rows) {
        const cols = rows[index].columns;
        for (const sIndex in cols) {
            if (props.colIndex == sIndex && props.rowIndex == index) {
                cols[sIndex].visible = false;
                break;
            }
        }
    }
};
const deleteWholeRow = (props: any, type: any) => {
    const row = props.parentField.preps.elements[props.rowIndex];
    if (row?.columns) {
        row.columns.forEach((col: any) => {
            col.visible = false;
        });
    }
};

const moveRowUp = (props: any, type: any) => {
    const {rows, row} = tableCellInfo(props, type);
    if (props.rowIndex == 0) {
        return;
    }
    rows.splice(props.rowIndex - 1, 0, row);
    rows.splice(props.rowIndex + 1, 1);
};
const moveRowDown = (props: any, type: any) => {
    const {rows, row} = tableCellInfo(props, type);
    if (props.isLastRow) {
        return;
    }
    rows.splice(props.rowIndex + 2, 0, row);
    rows.splice(props.rowIndex, 1);
};
const moveRowUpFirst = (props: any, type: any) => {
    const {rows, row} = tableCellInfo(props, type);
    if (props.isFirstRow) {
        return;
    }
    rows.splice(0, 0, row);
    rows.splice(props.rowIndex + 1, 1);
};
const moveRowDownLast = (props: any, type: any) => {
    const {rows, row} = tableCellInfo(props, type);
    if (props.isLastRow) {
        return;
    }
    rows.splice(rows.length, 0, row);
    rows.splice(props.rowIndex, 1);
};
const moveColLeft = (props: any, type: any) => {
    const {rows, col} = tableCellInfo(props, type);
    if (props.isFirstCol) {
        return;
    }
    rows[props.rowIndex].columns.splice(props.colIndex - 1, 0, col);
    rows[props.rowIndex].columns.splice(props.colIndex + 1, 1);
};
const moveColRight = (props: any, type: any) => {
    const {rows, col} = tableCellInfo(props, type);
    if (props.isLastCol) {
        return;
    }
    rows[props.rowIndex].columns.splice(props.colIndex + 2, 0, col);
    rows[props.rowIndex].columns.splice(props.colIndex, 1);
};
const moveColLeftFirst = (props: any, type: any) => {
    const {rows, col} = tableCellInfo(props, type);
    if (props.isFirstCol) {
        return;
    }
    rows[props.rowIndex].columns.splice(0, 0, col);
    rows[props.rowIndex].columns.splice(props.colIndex + 1, 1);
};
const moveColRightLast = (props: any, type: any) => {
    const {rows, col} = tableCellInfo(props, type);
    if (props.isLastCol) {
        return;
    }
    rows[props.rowIndex].columns.splice(
        rows[props.rowIndex].columns.length,
        0,
        col,
    );
    rows[props.rowIndex].columns.splice(props.colIndex, 1);
};
/**
 * 单元格操作方法
 * @param command
 * @param props
 */
export const tableCellOperation = (
    command: string,
    props: any,
    type?: string,
) => {
    switch (command) {
        case "insertLeftCol":
            insertLeftCol(props, type);
            break;
        case "insertRightCol":
            insertRightCol(props, type);
            break;
        case "insertAboveRow":
            insertAboveRow(props, type);
            break;
        case "insertBelowRow":
            insertBelowRow(props, type);
            break;
        case "mergeLeftCol":
            mergeLeftCol(props, type);
            break;
        case "mergeRightCol":
            mergeRightCol(props, type);
            break;
        case "mergeWholeCol":
            mergeWholeCol(props, type);
            break;
        case "mergeAboveRow":
            mergeAboveRow(props, type);
            break;
        case "mergeBelowRow":
            mergeBelowRow(props, type);
            break;
        case "mergeWholeRow":
            mergeWholeRow(props, type);
            break;
        case "undoMergeRow":
            undoMergeRow(props, type);
            break;
        case "undoMergeCol":
            undoMergeCol(props, type);
            break;
        case "deleteWholeCol":
            deleteWholeCol(props, type);
            break;
        case "deleteWholeRow":
            deleteWholeRow(props, type);
            break;
        case "deleteCurrentCol":
            deleteCurrentCol(props, type);
            break;
        case "moveRowUp":
            moveRowUp(props, type);
            break;
        case "moveRowDown":
            moveRowDown(props, type);
            break;
        case "moveColLeft":
            moveColLeft(props, type);
            break;
        case "moveColRight":
            moveColRight(props, type);
            break;
        case "moveRowUpFirst":
            moveRowUpFirst(props, type);
            break;
        case "moveRowDownLast":
            moveRowDownLast(props, type);
            break;
        case "moveColLeftFirst":
            moveColLeftFirst(props, type);
            break;
        case "moveColRightLast":
            moveColRightLast(props, type);
            break;
        case "addCellAfter":
            addCell(props, type, false);
            break;
        case "addCellBefore":
            addCell(props, type, true);
            break;
        case "colConfig":
            console.log();
    }
    //操作单元格后再次调用控制按钮函数
    // tableAction(props, buttonControl);
};
const mergeLeftColAction = (props: any, type: any) => {
    const {row, col} = tableCellInfo(props, type);
    if (!row || !row.columns?.length) {
        return true;
    }
    const leftCol = row.columns[props.colIndex - 1];
    return col.rowspan > 1 && leftCol
        ? leftCol.rowspan != col.rowspan
        : props.isFirstCol;
};
const mergeRightColAction = (props: any, type: any) => {
    const {row, col} = tableCellInfo(props, type);
    if (!row || !row.columns?.length) {
        return true;
    }
    const rightCol = row.columns[props.colIndex + 1];
    return col.rowspan > 1 && rightCol
        ? rightCol.rowspan != col.rowspan
        : props.isLastCol;
};
const mergeWholeColAction = (props: any, type: any) => {
    return colCommonAction(props, type);
};
const mergeAboveRowAction = (props: any, type: any) => {
    const {rows, col} = tableCellInfo(props, type);
    const aboveRow = rows[props.rowIndex - 1];
    if (!aboveRow?.columns?.length) {
        return true;
    }
    const aboveCol = aboveRow?.columns[props.colIndex];
    if (!aboveCol || col.colspan != aboveCol.colspan) {
        return true;
    }
    return props.isFirstRow;
};
const mergeBelowRowAction = (props: any, type: any) => {
    const {rows, col} = tableCellInfo(props, type);
    const belowRow = rows[props.rowIndex + 1];
    if (!belowRow || !belowRow.columns?.length) {
        return true;
    }
    const belowCol = belowRow?.columns[props.colIndex];
    if (!belowCol || col.colspan != belowCol.colspan) {
        return true;
    }
    return props.isLastRow;
};
const mergeWholeRowAction = (props: any, type: any) => {
    const {col} = tableCellInfo(props, type);
    if (col.colspan == 24 && type == "box") {
        return true;
    }
    return rowCommonAction(props, type);
};
const colCommonAction = (props: any, type: any) => {
    const {rows, col} = tableCellInfo(props, type);
    for (const index in rows) {
        const tempRow = rows[index];
        if (!tempRow || !tempRow.columns?.length) {
            return true;
        }
        const tempCol = tempRow.columns[props.colIndex];
        if (!tempCol || tempCol.colspan != col.colspan) {
            // console.log(tempCol, col);
            return true;
        }
    }
    return false;
};
const rowCommonAction = (props: any, type: any) => {
    const {row, col} = tableCellInfo(props, type);
    for (const index in row.columns) {
        const tempCol = row.columns[index];
        if (col.rowspan != tempCol.rowspan) {
            return true;
        }
    }
    return false;
};
const deleteWholeColAction = (props: any, type: any) => {
    return colCommonAction(props, type);
};
const deleteWholeRowAction = (props: any, type: any) => {
    return rowCommonAction(props, type);
};
const undoMergeRowAction = (props: any, type: any) => {
    const {rows, col} = tableCellInfo(props, type);
    let columns: number = 0;
    for (const index in rows) {
        const len = rows[index].columns?.length;
        if (columns < len) {
            columns = len;
        }
    }
    if (columns == col.colspan && col.colspan > 1) {
        return false;
    }
    return props.field.rowspan == 1;
};
const undoMergeColAction = (props: any, type: any) => {
    const {rows, col} = tableCellInfo(props, type);
    // console.log(rows.length, col);
    if (rows.length == col.rowspan && col.rowspan > 1) {
        return false;
    }
    return props.field.colspan == 1;
};
const moveAction = (props: any, type: any) => {
    return props.field.items?.length > 0;
};
/**
 * 单元格按钮是否可点击控制
 * @param props
 * @param buttonControl 按钮控制
 * @param type
 */
export const tableAction = (props: any, buttonControl: any, type?: any) => {
    buttonControl.mergeLeftColDisabled = mergeLeftColAction(props, type);
    buttonControl.mergeRightColDisabled = mergeRightColAction(props, type);
    buttonControl.mergeWholeColDisabled = mergeWholeColAction(props, type);
    buttonControl.mergeAboveRowDisabled = mergeAboveRowAction(props, type);
    buttonControl.mergeBelowRowDisabled = mergeBelowRowAction(props, type);
    buttonControl.mergeWholeRowDisabled = mergeWholeRowAction(props, type);
    buttonControl.deleteWholeColDisabled = deleteWholeColAction(props, type);
    buttonControl.deleteWholeRowDisabled = deleteWholeRowAction(props, type);
    buttonControl.undoMergeRowDisabled = undoMergeRowAction(props, type);
    buttonControl.undoMergeColDisabled = undoMergeColAction(props, type);
    buttonControl.moveRowUpDisabled = moveAction(props, type);
    buttonControl.moveRowDownDisabled = moveAction(props, type);
    buttonControl.moveColLeftDisabled = moveAction(props, type);
    buttonControl.moveColRightDisabled = moveAction(props, type);
    buttonControl.moveRowUpFirstDisabled = moveAction(props, type);
    buttonControl.moveRowDownLastDisabled = moveAction(props, type);
    buttonControl.moveColLeftFirstDisabled = moveAction(props, type);
    buttonControl.moveColRightLastDisabled = moveAction(props, type);
};
