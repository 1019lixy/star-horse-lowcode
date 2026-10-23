import {computed, type ComputedRef, type Ref, ref} from "vue";
import {i18n} from "@/lang";
import {
    buildKeyMapHints,
    keyToOptionValue,
    nextOptionValue,
    normalizeOptions,
    optionIndex,
    optionName,
    type KeyHint,
} from "@/components/comp/checkmatrix/useCheckMatrixState";

/**
 * checkmatrix 容器项交互状态机(无 UI 依赖)
 * 与 useCheckMatrixState 的差异:本模块面向 containerFields[0].fieldList 二维表,
 * 每个检查项字段独立绑定 dataForm[fieldName](非 CheckMatrixValue 聚合对象),
 * 复用 useCheckMatrixState 的选项解析/循环/快捷键映射等纯函数
 */

export interface CheckItemStats {
    filled: number;
    empty: number;
    custom: number;
    total: number;
}

/**
 * 从单元格提取 checkitem 字段(数组取首元素;仅 type === "checkitem" 且有 fieldName 返回)
 */
export function extractCheckItem(cell: any): any | null {
    if (!cell) return null;
    // cell 可能是字段本身(与 boxDytableAnalysis 产物一致) 或数组
    let item: any;
    if (Array.isArray(cell)) {
        item = cell[0];
    } else {
        item = cell;
    }
    if (item && item.type === "checkitem" && item.fieldName) return item;
    return null;
}

export function useCheckMatrixItemState(options: {
    dataForm: Ref<any>;
    rows: ComputedRef<any[][]>;
    readonly: ComputedRef<boolean>;
    allowKeyboard?: ComputedRef<boolean>;
}) {
    const {dataForm, rows, readonly, allowKeyboard} = options;

    const resolveOptions = (field: any) => normalizeOptions(field?.preps?.options);

    const cellValue = (field: any): string => {
        if (!field?.fieldName) return "";
        return dataForm.value?.[field.fieldName] ?? "";
    };

    const setCellValue = (field: any, val: string) => {
        if (!field?.fieldName || !dataForm.value) return;
        dataForm.value[field.fieldName] = val;
    };

    const cellText = (field: any): string =>
        optionName(resolveOptions(field), cellValue(field));

    const cellClass = (field: any): string => {
        const idx = optionIndex(resolveOptions(field), cellValue(field));
        return idx >= 0 ? `opt-${idx}` : "";
    };

    const isCustom = (field: any): boolean => {
        const val = cellValue(field);
        return !!val && optionIndex(resolveOptions(field), val) < 0;
    };

    const focusedField = ref("");
    const editingField = ref("");

    const findFieldByName = (name: string): any | null => {
        for (const row of rows.value) {
            for (const cell of row) {
                const field = extractCheckItem(cell);
                if (field?.fieldName === name) return field;
            }
        }
        return null;
    };

    const findColumnCheckItem = (colIndex: number): any | null => {
        for (const row of rows.value) {
            const field = extractCheckItem(row?.[colIndex]);
            if (field) return field;
        }
        return null;
    };

    /** 单元格点击:首次选中,再次点击循环切换选项(自定义文本不参与循环) */
    const onCellClick = (field: any) => {
        if (readonly.value) return;
        const name = field?.fieldName;
        if (!name) return;
        if (focusedField.value === name) {
            const opts = resolveOptions(field);
            const cur = cellValue(field);
            if (cur && optionIndex(opts, cur) < 0) return;
            setCellValue(field, nextOptionValue(opts, cur));
        } else {
            focusedField.value = name;
        }
    };

    /** 双击进入文本编辑 */
    const onCellDblClick = (field: any) => {
        if (readonly.value) return;
        if (!field?.fieldName) return;
        focusedField.value = field.fieldName;
        editingField.value = field.fieldName;
    };

    /** 整列循环:以该列首个 checkitem 当前值为基准循环,跳过自定义文本格 */
    const cycleColumn = (colIndex: number) => {
        if (readonly.value) return;
        const first = findColumnCheckItem(colIndex);
        if (!first) return;
        const next = nextOptionValue(resolveOptions(first), cellValue(first));
        for (const row of rows.value) {
            const field = extractCheckItem(row?.[colIndex]);
            if (!field) continue;
            const cur = cellValue(field);
            if (cur && optionIndex(resolveOptions(field), cur) < 0) continue;
            setCellValue(field, next);
        }
    };

    /** 整行循环:以该行首个 checkitem 当前值为基准循环,跳过自定义文本格 */
    const cycleRow = (rowIndex: number) => {
        if (readonly.value) return;
        const row = rows.value[rowIndex];
        if (!row) return;
        const first = row.map(extractCheckItem).find(Boolean);
        if (!first) return;
        const next = nextOptionValue(resolveOptions(first), cellValue(first));
        for (const cell of row) {
            const field = extractCheckItem(cell);
            if (!field) continue;
            const cur = cellValue(field);
            if (cur && optionIndex(resolveOptions(field), cur) < 0) continue;
            setCellValue(field, next);
        }
    };

    /** 快捷键:数字键设值,空格循环,Enter 进入编辑 */
    const handleKeydown = (e: KeyboardEvent) => {
        if (readonly.value) return;
        if (allowKeyboard?.value === false) return;
        if (document.activeElement?.tagName === "INPUT") return;
        if (!focusedField.value) return;
        const field = findFieldByName(focusedField.value);
        if (!field) return;
        const mapped = keyToOptionValue(resolveOptions(field), e.key);
        if (mapped !== null) {
            e.preventDefault();
            setCellValue(field, mapped);
            return;
        }
        if (e.key === " ") {
            e.preventDefault();
            const opts = resolveOptions(field);
            const cur = cellValue(field);
            if (cur && optionIndex(opts, cur) < 0) return;
            setCellValue(field, nextOptionValue(opts, cur));
        } else if (e.key === "Enter") {
            e.preventDefault();
            editingField.value = focusedField.value;
        }
    };

    const onEditInput = (field: any, event: Event) => {
        setCellValue(field, (event.target as HTMLInputElement).value);
    };

    const onEditDone = () => {
        editingField.value = "";
    };

    /** 容器级统计:遍历所有 checkitem 字段,统计已填/未填/自定义 */
    const stats = computed<CheckItemStats>(() => {
        const result: CheckItemStats = {
            filled: 0,
            empty: 0,
            custom: 0,
            total: 0,
        };
        for (const row of rows.value) {
            for (const cell of row) {
                const field = extractCheckItem(cell);
                if (!field) continue;
                result.total++;
                const val = cellValue(field);
                if (!val) {
                    result.empty++;
                } else if (optionIndex(resolveOptions(field), val) < 0) {
                    result.custom++;
                    result.filled++;
                } else {
                    result.filled++;
                }
            }
        }
        return result;
    });

    /** 按键提示(按当前选中字段的选项生成,无选中时为空) */
    const keyHints = computed<KeyHint[]>(() => {
        const field = findFieldByName(focusedField.value);
        return buildKeyMapHints(field ? resolveOptions(field) : []);
    });

    /** 当前选中单元格描述(字段名 + 当前值) */
    const selectedInfo = computed(() => {
        const field = findFieldByName(focusedField.value);
        if (!field) return "";
        const valueText =
            cellText(field) || i18n("checkmatrix.empty");
        return `${field.fieldName} = ${valueText}`;
    });

    return {
        resolveOptions,
        cellValue,
        setCellValue,
        cellText,
        cellClass,
        isCustom,
        focusedField,
        editingField,
        onCellClick,
        onCellDblClick,
        cycleColumn,
        cycleRow,
        handleKeydown,
        onEditInput,
        onEditDone,
        stats,
        keyHints,
        selectedInfo,
        optionName,
        optionIndex,
        nextOptionValue,
        findColumnCheckItem,
    };
}