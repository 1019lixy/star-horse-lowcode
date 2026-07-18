/**
 * 报表设计器 - 状态管理 composable
 *
 * 职责：管理选中、复制、合并、行列操作、历史等
 */

import { computed, reactive } from "vue";
import { colToLetter, toAddress } from "../CellUtils";
import type {
    ReportCell,
    ReportDesignerState,
    ReportTemplate,
} from "../types";

const DEFAULT_ROW_COUNT = 50;
const DEFAULT_COL_COUNT = 20;
const DEFAULT_ROW_HEIGHT = 28;
const DEFAULT_COL_WIDTH = 100;

const createInitialTemplate = (): ReportTemplate => ({
    id: `rpt_${Date.now()}`,
    name: "",
    code: "",
    rowCount: DEFAULT_ROW_COUNT,
    colCount: DEFAULT_COL_COUNT,
    defaultRowHeight: DEFAULT_ROW_HEIGHT,
    defaultColWidth: DEFAULT_COL_WIDTH,
    cells: {},
    rows: Array.from({ length: DEFAULT_ROW_COUNT }, (_, i) => ({
        index: i + 1,
        height: DEFAULT_ROW_HEIGHT,
    })),
    columns: Array.from({ length: DEFAULT_COL_COUNT }, (_, i) => ({
        index: i + 1,
        width: DEFAULT_COL_WIDTH,
    })),
    datasets: [],
    parameters: [],
    paper: {
        name: "A4",
        width: 210,
        height: 297,
        orientation: "portrait",
        margin: [10, 10, 10, 10],
        showGrid: true,
    },
    version: 1,
});

const createInitialState = (tpl?: Partial<ReportTemplate>): ReportDesignerState => {
    const template = { ...createInitialTemplate(), ...tpl };
    return {
        template,
        selectedAddresses: [],
        clipboard: [],
        history: [JSON.parse(JSON.stringify(template))],
        historyIndex: 0,
        zoom: 1,
        showGrid: true,
        showFormula: false,
        readonly: false,
        editingAddress: null,
    };
};

export function useReportDesigner(initialTemplate?: Partial<ReportTemplate>) {
    const state = reactive<ReportDesignerState>(createInitialState(initialTemplate));

    // ============ 选中 ============
    const selectedCells = computed<ReportCell[]>(() =>
        state.selectedAddresses
            .map((addr) => state.template.cells[addr])
            .filter(Boolean),
    );

    const selectedCell = computed<ReportCell | null>(() =>
        selectedCells.value.length === 1 ? selectedCells.value[0] : null,
    );

    const selectCell = (address: string, multi = false) => {
        if (multi) {
            const idx = state.selectedAddresses.indexOf(address);
            if (idx >= 0) state.selectedAddresses.splice(idx, 1);
            else state.selectedAddresses.push(address);
        } else {
            state.selectedAddresses = [address];
        }
        state.editingAddress = null;
    };

    const selectRange = (startAddr: string, endAddr: string) => {
        // 计算区域内所有地址
        const start = parseAddr(startAddr);
        const end = parseAddr(endAddr);
        const list: string[] = [];
        for (let r = start.row; r <= end.row; r++) {
            for (let c = start.col; c <= end.col; c++) {
                list.push(toAddress(r, c));
            }
        }
        state.selectedAddresses = list;
    };

    const clearSelection = () => {
        state.selectedAddresses = [];
        state.editingAddress = null;
    };

    // ============ 单元格操作 ============
    const getCell = (address: string): ReportCell | undefined => {
        return state.template.cells[address];
    };

    const ensureCell = (address: string): ReportCell => {
        if (!state.template.cells[address]) {
            const { row, col } = parseAddr(address);
            state.template.cells[address] = {
                address,
                row,
                col,
                rowSpan: 1,
                colSpan: 1,
                value: "",
            };
        }
        return state.template.cells[address];
    };

    const setCellValue = (address: string, value: any) => {
        if (state.readonly) return;
        const cell = ensureCell(address);
        cell.value = value;
        // 自动识别公式
        if (typeof value === "string" && value.startsWith("=")) {
            cell.formula = {
                type: "expression",
                expression: value,
            };
        } else if (typeof value === "string" && value.startsWith("${")) {
            cell.formula = {
                type: "dataset",
                expression: value,
            };
        } else {
            cell.formula = {
                type: "static",
                expression: String(value ?? ""),
            };
        }
    };

    const setCellFormula = (address: string, formula: ReportCell["formula"]) => {
        if (state.readonly) return;
        const cell = ensureCell(address);
        cell.formula = formula;
    };

    const setCellStyle = (address: string, style: Partial<ReportCell["style"]>) => {
        if (state.readonly) return;
        const cell = ensureCell(address);
        cell.style = { ...(cell.style || {}), ...style };
    };

    const applyStyleToSelection = (style: Partial<ReportCell["style"]>) => {
        if (state.readonly) return;
        state.selectedAddresses.forEach((addr) => setCellStyle(addr, style));
    };

    const deleteCells = (addresses: string[] = state.selectedAddresses) => {
        if (state.readonly) return;
        addresses.forEach((addr) => {
            delete state.template.cells[addr];
        });
    };

    // ============ 合并单元格 ============
    const mergeCells = () => {
        if (state.readonly || state.selectedAddresses.length < 2) return;
        const rows = state.selectedAddresses.map((a) => parseAddr(a).row);
        const cols = state.selectedAddresses.map((a) => parseAddr(a).col);
        const minRow = Math.min(...rows);
        const maxRow = Math.max(...rows);
        const minCol = Math.min(...cols);
        const maxCol = Math.max(...cols);
        const topLeft = toAddress(minRow, minCol);
        const cell = ensureCell(topLeft);
        cell.rowSpan = maxRow - minRow + 1;
        cell.colSpan = maxCol - minCol + 1;
        // 删除其它单元格
        state.selectedAddresses
            .filter((a) => a !== topLeft)
            .forEach((a) => delete state.template.cells[a]);
        state.selectedAddresses = [topLeft];
        pushHistory();
    };

    const unmergeCells = () => {
        if (state.readonly) return;
        state.selectedAddresses.forEach((addr) => {
            const cell = state.template.cells[addr];
            if (cell && (cell.rowSpan > 1 || cell.colSpan > 1)) {
                cell.rowSpan = 1;
                cell.colSpan = 1;
            }
        });
        pushHistory();
    };

    // ============ 行列操作 ============
    const insertRow = (beforeRow: number, count = 1) => {
        if (state.readonly) return;
        // 移动后续行单元格
        const newCells: Record<string, ReportCell> = {};
        Object.entries(state.template.cells).forEach(([addr, cell]) => {
            if (cell.row >= beforeRow) {
                cell.row += count;
                const newAddr = toAddress(cell.row, cell.col);
                cell.address = newAddr;
                newCells[newAddr] = cell;
            } else {
                newCells[addr] = cell;
            }
        });
        state.template.cells = newCells;
        // 行配置
        for (let i = 0; i < count; i++) {
            state.template.rows.splice(beforeRow - 1 + i, 0, {
                index: beforeRow + i,
                height: state.template.defaultRowHeight,
            });
        }
        state.template.rows.forEach((r, i) => (r.index = i + 1));
        state.template.rowCount += count;
        pushHistory();
    };

    const insertCol = (beforeCol: number, count = 1) => {
        if (state.readonly) return;
        const newCells: Record<string, ReportCell> = {};
        Object.entries(state.template.cells).forEach(([addr, cell]) => {
            if (cell.col >= beforeCol) {
                cell.col += count;
                const newAddr = toAddress(cell.row, cell.col);
                cell.address = newAddr;
                newCells[newAddr] = cell;
            } else {
                newCells[addr] = cell;
            }
        });
        state.template.cells = newCells;
        for (let i = 0; i < count; i++) {
            state.template.columns.splice(beforeCol - 1 + i, 0, {
                index: beforeCol + i,
                width: state.template.defaultColWidth,
            });
        }
        state.template.columns.forEach((c, i) => (c.index = i + 1));
        state.template.colCount += count;
        pushHistory();
    };

    const deleteRow = (row: number) => {
        if (state.readonly) return;
        const newCells: Record<string, ReportCell> = {};
        Object.entries(state.template.cells).forEach(([addr, cell]) => {
            if (cell.row === row) return; // 删除
            if (cell.row > row) {
                cell.row -= 1;
                const newAddr = toAddress(cell.row, cell.col);
                cell.address = newAddr;
                newCells[newAddr] = cell;
            } else {
                newCells[addr] = cell;
            }
        });
        state.template.cells = newCells;
        state.template.rows.splice(row - 1, 1);
        state.template.rows.forEach((r, i) => (r.index = i + 1));
        state.template.rowCount -= 1;
        pushHistory();
    };

    const deleteCol = (col: number) => {
        if (state.readonly) return;
        const newCells: Record<string, ReportCell> = {};
        Object.entries(state.template.cells).forEach(([addr, cell]) => {
            if (cell.col === col) return;
            if (cell.col > col) {
                cell.col -= 1;
                const newAddr = toAddress(cell.row, cell.col);
                cell.address = newAddr;
                newCells[newAddr] = cell;
            } else {
                newCells[addr] = cell;
            }
        });
        state.template.cells = newCells;
        state.template.columns.splice(col - 1, 1);
        state.template.columns.forEach((c, i) => (c.index = i + 1));
        state.template.colCount -= 1;
        pushHistory();
    };

    const setRowHeight = (row: number, height: number) => {
        const r = state.template.rows[row - 1];
        if (r) r.height = Math.max(10, height);
    };

    const setColWidth = (col: number, width: number) => {
        const c = state.template.columns[col - 1];
        if (c) c.width = Math.max(20, width);
    };

    // ============ 复制粘贴 ============
    const copyCells = () => {
        state.clipboard = state.selectedAddresses.map((addr) => {
            const cell = state.template.cells[addr];
            return cell ? JSON.parse(JSON.stringify(cell)) : null;
        }).filter(Boolean);
    };

    const pasteCells = (targetAddr: string) => {
        if (state.readonly || !state.clipboard.length) return;
        const target = parseAddr(targetAddr);
        state.clipboard.forEach((cell, idx) => {
            const offsetRow = Math.floor(idx / 1);
            const offsetCol = idx % 1;
            const addr = toAddress(target.row + offsetRow, target.col + offsetCol);
            const newCell = JSON.parse(JSON.stringify(cell));
            newCell.address = addr;
            newCell.row = target.row + offsetRow;
            newCell.col = target.col + offsetCol;
            state.template.cells[addr] = newCell;
        });
        pushHistory();
    };

    // ============ 历史 ============
    const pushHistory = () => {
        state.history = state.history.slice(0, state.historyIndex + 1);
        state.history.push(JSON.parse(JSON.stringify(state.template)));
        if (state.history.length > 50) {
            state.history.shift();
        } else {
            state.historyIndex++;
        }
    };

    const undo = () => {
        if (state.historyIndex <= 0) return;
        state.historyIndex--;
        state.template = JSON.parse(JSON.stringify(state.history[state.historyIndex]));
        state.selectedAddresses = [];
    };

    const redo = () => {
        if (state.historyIndex >= state.history.length - 1) return;
        state.historyIndex++;
        state.template = JSON.parse(JSON.stringify(state.history[state.historyIndex]));
        state.selectedAddresses = [];
    };

    const canUndo = computed(() => state.historyIndex > 0);
    const canRedo = computed(() => state.historyIndex < state.history.length - 1);

    // ============ 模板 ============
    const loadTemplate = (tpl: ReportTemplate) => {
        state.template = JSON.parse(JSON.stringify(tpl));
        state.selectedAddresses = [];
        state.history = [JSON.parse(JSON.stringify(state.template))];
        state.historyIndex = 0;
    };

    const getTemplate = (): ReportTemplate => JSON.parse(JSON.stringify(state.template));

    return {
        state,
        // 选中
        selectedCells,
        selectedCell,
        selectCell,
        selectRange,
        clearSelection,
        // 单元格
        getCell,
        ensureCell,
        setCellValue,
        setCellFormula,
        setCellStyle,
        applyStyleToSelection,
        deleteCells,
        mergeCells,
        unmergeCells,
        // 行列
        insertRow,
        insertCol,
        deleteRow,
        deleteCol,
        setRowHeight,
        setColWidth,
        // 复制
        copyCells,
        pasteCells,
        // 历史
        undo,
        redo,
        canUndo,
        canRedo,
        pushHistory,
        // 模板
        loadTemplate,
        getTemplate,
    };
}

/** 简易地址解析（避免循环依赖） */
const parseAddr = (address: string): { row: number; col: number } => {
    const match = address.match(/^([A-Za-z]+)(\d+)$/);
    if (!match) throw new Error(`Invalid address: ${address}`);
    let col = 0;
    for (let i = 0; i < match[1].length; i++) {
        col = col * 26 + (match[1].toUpperCase().charCodeAt(i) - 64);
    }
    return { row: parseInt(match[2], 10), col };
};

export type UseReportDesignerReturn = ReturnType<typeof useReportDesigner>;
