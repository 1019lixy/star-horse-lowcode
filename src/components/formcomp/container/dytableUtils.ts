import { uuid } from "@/api/system";

/**
 * 定义td 数据
 */
export const colDataInfo = () => {
  return { _uuid: uuid(), colspan: 1, rowspan: 1, items: [] };
};
/**
 * 左方插入列
 */
const insertLeftCol = (props: any) => {
  const rows = props.parentField.preps.elements;
  const position = props.isFirstCol ? 0 : props.colIndex - 1;
  for (let index = 0; index < rows.length; index++) {
    const cols = rows[index].columns;
    cols.splice(position, 0, colDataInfo());
  }
};
const insertRightCol = (props: any) => {
  const rows = props.parentField.preps.elements;
  const position = props.isLastCol ? props.colIndex : props.colIndex + 1;
  for (let index = 0; index < rows.length; index++) {
    const cols = rows[index].columns;
    cols.splice(position, 0, colDataInfo());
  }
};
const insertAboveRow = (props: any) => {
  const rows = props.parentField.preps.elements;
  let len = 1;
  const cols: Array<any> = [];
  for (let index = 0; index < rows.length; index++) {
    const colLen = rows[index].columns.length;
    if (colLen > len) {
      len = colLen;
    }
  }
  for (let i = 0; i < len; i++) {
    cols.push(colDataInfo());
  }
  const position = props.isFirstRow ? 0 : props.rowIndex - 1;
  rows.splice(position, 0, cols);
};
const insertBelowRow = (props: any) => {
  const rows = props.parentField.preps.elements;
  let len = 1;
  const cols: Array<any> = [];
  for (let index = 0; index < rows.length; index++) {
    const colLen = rows[index].columns.length;
    if (colLen > len) {
      len = colLen;
    }
  }
  for (let i = 0; i < len; i++) {
    cols.push(colDataInfo());
  }
  const position = props.isLastRow ? props.rowIndex : props.rowIndex + 1;
  rows.splice(position, 0, cols);
};
const tableCellInfo = (props: any) => {
  const rows = props.parentField.preps.elements;
  const row = rows[props.rowIndex];
  const col = row.columns[props.colIndex];
  return { rows, row, col };
};
const mergeLeftCol = (props: any) => {
  const { row, col } = tableCellInfo(props);
  col.colspan = col.colspan + 1;
  row.columns.splice(props.colIndex - 1, 1);
};
const mergeRightCol = (props: any) => {
  const { row, col } = tableCellInfo(props);
  col.colspan = col.colspan + 1;
  row.columns.splice(props.colIndex + 1, 1);
};
const mergeWholeCol = (props: any) => {
  const { rows, col } = tableCellInfo(props);
  // let currentCol: any = {};
  for (const index in rows) {
    const row1 = rows[index];
    const cols = row1.columns;
    for (const cIndex in cols) {
      if (cIndex == props.colIndex) {
        cols.splice(cIndex, 1);
      }
    }
  }
  col.rowspan = rows.length;
  rows[0].columns.splice(props.colIndex, 0, col);
};
const mergeAboveRow = (props: any) => {
  const { rows, row, col } = tableCellInfo(props);
  const aboveRow = rows[props.rowIndex - 1];
  col.rowspan = col.rowspan + 1;
  for (const index in aboveRow.columns) {
    if (index == props.colIndex) {
      aboveRow.columns.splice(index, 1, col);
      break;
    }
  }
  for (const index in row.columns) {
    if (index == props.colIndex) {
      row.columns.splice(index, 1);
      break;
    }
  }
};
const mergeBelowRow = (props: any) => {
  const { rows, col } = tableCellInfo(props);
  col.rowspan = col.rowspan + 1;
  const belowRow = rows[props.rowIndex + 1];
  for (const index in belowRow.columns) {
    if (index == props.colIndex) {
      belowRow.columns.splice(index, 1);
      break;
    }
  }
};
const mergeWholeRow = (props: any) => {
  const { row, col } = tableCellInfo(props);
  let totalCols: number = 0;
  for (const index in row.columns) {
    const col = row.columns[index];
    totalCols += col.colspan;
  }
  col.colspan = totalCols;
  row.columns = [col];
};
/**
 * 需要判断需要还原的周边数据
 * @param props
 */
const undoMergeRow = (props: any) => {
  const { rows, row, col } = tableCellInfo(props);
  if (row.columns.length == 1) {
    //说明是合并了整行
    col.colspan = col.colspan - 1;
    row.columns.splice(props.colIndex, 0, colDataInfo());
  } else {
    col.rowspan = col.rowspan - 1;
    row.columns.splice(props.colIndex, 1, colDataInfo());
    rows[props.rowIndex + 1].columns.splice(props.colIndex, 0, col);
  }
};
/**
 * 需要判断要还原的周边数据
 * @param props
 */
const undoMergeCol = (props: any) => {
  const { rows, row, col } = tableCellInfo(props);
  //如果 列的行合并和整个表格的行相同，则表示已合并的整列
  if (col.rowspan == rows.length) {
    col.rowspan = col.rowspan - 1;
    //在当前位置插入新的单元格
    row.columns.splice(props.colIndex, 1, colDataInfo());
    //将数据移入下一行
    rows[props.rowIndex + 1].columns.splice(props.colIndex, 0, col);
  } else {
    //在同一行合并了单元格
    col.colspan = col.colspan - 1;
    row.columns.splice(props.colIndex, 0, colDataInfo());
  }
};
/**
 * 删除整列，在删除列的同时需要，考虑合并的情况，否则有可能导致整行被删除
 * @param props
 */
const deleteWholeCol = (props: any) => {
  const rows = props.parentField.preps.elements;
  for (const index in rows) {
    const cols = rows[index].columns;
    for (const sIndex in cols) {
      if (props.colIndex == sIndex) {
        cols.splice(sIndex, 1);
      }
    }
  }
};
const deleteWholeRow = (props: any) => {
  props.parentField.preps.elements.splice(props.rowIndex, 1);
};

/**
 * 单元格操作方法
 * @param command
 * @param props
 */
export const tableCellOperation = (command: string, props: any) => {
  switch (command) {
    case "insertLeftCol":
      insertLeftCol(props);
      break;
    case "insertRightCol":
      insertRightCol(props);
      break;
    case "insertAboveRow":
      insertAboveRow(props);
      break;
    case "insertBelowRow":
      insertBelowRow(props);
      break;
    case "mergeLeftCol":
      mergeLeftCol(props);
      break;
    case "mergeRightCol":
      mergeRightCol(props);
      break;
    case "mergeWholeCol":
      mergeWholeCol(props);
      break;
    case "mergeAboveRow":
      mergeAboveRow(props);
      break;
    case "mergeBelowRow":
      mergeBelowRow(props);
      break;
    case "mergeWholeRow":
      mergeWholeRow(props);
      break;
    case "undoMergeRow":
      undoMergeRow(props);
      break;
    case "undoMergeCol":
      undoMergeCol(props);
      break;
    case "deleteWholeCol":
      deleteWholeCol(props);
      break;
    case "deleteWholeRow":
      deleteWholeRow(props);
      break;
    case "colConfig":
      console.log();
  }
  //操作单元格后再次调用控制按钮函数
  // tableAction(props, buttonControl);
};
const mergeLeftColAction = (props: any) => {
  const { row, col } = tableCellInfo(props);
  if (!row || !row.columns?.length) {
    return true;
  }
  const leftCol = row.columns[props.colIndex - 1];
  return col.rowspan > 1 && leftCol
    ? leftCol.rowspan != col.rowspan
    : props.isFirstCol;
};
const mergeRightColAction = (props: any) => {
  const { row, col } = tableCellInfo(props);
  if (!row || !row.columns?.length) {
    return true;
  }
  const rightCol = row.columns[props.colIndex + 1];
  return col.rowspan > 1 && rightCol
    ? rightCol.rowspan != col.rowspan
    : props.isLastCol;
};
const mergeWholeColAction = (props: any) => {
  return colCommonAction(props);
};
const mergeAboveRowAction = (props: any) => {
  const { rows, col } = tableCellInfo(props);
  const aboveRow = rows[props.rowIndex - 1];
  if (!aboveRow || !aboveRow.columns.length) {
    return true;
  }
  const aboveCol = aboveRow?.columns[props.colIndex];
  if (!aboveCol || col.colspan != aboveCol.colspan) {
    return true;
  }
  return props.isFirstRow;
};
const mergeBelowRowAction = (props: any) => {
  const { rows, col } = tableCellInfo(props);
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
const mergeWholeRowAction = (props: any) => {
  return rowCommonAction(props);
};
const colCommonAction = (props: any) => {
  const { rows, col } = tableCellInfo(props);
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
const rowCommonAction = (props: any) => {
  const { row, col } = tableCellInfo(props);

  for (const index in row.columns) {
    const tempCol = row.columns[index];
    if (col.rowspan != tempCol.rowspan) {
      return true;
    }
  }
  return false;
};
const deleteWholeColAction = (props: any) => {
  return colCommonAction(props);
};
const deleteWholeRowAction = (props: any) => {
  return rowCommonAction(props);
};
const undoMergeRowAction = (props: any) => {
  const { rows, col } = tableCellInfo(props);
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
const undoMergeColAction = (props: any) => {
  const { rows, col } = tableCellInfo(props);
  // console.log(rows.length, col);
  if (rows.length == col.rowspan && col.rowspan > 1) {
    return false;
  }
  return props.field.colspan == 1;
};
/**
 * 单元格按钮是否可点击控制
 * @param props
 * @param buttonControl 按钮控制
 */
export const tableAction = (props: any, buttonControl: any) => {
  buttonControl.mergeLeftColDisabled = mergeLeftColAction(props);
  buttonControl.mergeRightColDisabled = mergeRightColAction(props);
  buttonControl.mergeWholeColDisabled = mergeWholeColAction(props);
  buttonControl.mergeAboveRowDisabled = mergeAboveRowAction(props);
  buttonControl.mergeBelowRowDisabled = mergeBelowRowAction(props);
  buttonControl.mergeWholeRowDisabled = mergeWholeRowAction(props);
  buttonControl.deleteWholeColDisabled = deleteWholeColAction(props);
  buttonControl.deleteWholeRowDisabled = deleteWholeRowAction(props);
  buttonControl.undoMergeRowDisabled = undoMergeRowAction(props);
  buttonControl.undoMergeColDisabled = undoMergeColAction(props);
};
