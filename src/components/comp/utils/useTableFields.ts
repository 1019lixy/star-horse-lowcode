import {computed, onUnmounted, ref} from "vue";
import Sortable from "sortablejs";
import {i18n} from "@/lang";
import {isMobile} from "@/api/device";
import {FieldInfo} from "@/components/types/PageFieldInfo";

/** useTableFields 入参 */
export interface UseTableFieldsOptions {
    /** 组件 props(defineProps 返回的响应式 proxy) */
    props: any;
}

// APP端系统公共字段名（默认隐藏）
const SYSTEM_FIELD_NAMES = [
    "createdBy",
    "createdTime",
    "updatedBy",
    "updatedTime",
    "remark",
    "createTime",
    "updateTime",
    "editTime",
    "isDel",
];

/**
 * 表格字段管理 composable
 * 封装字段配置解析、APP端卡片字段可见性、列拖拽排序、列表/卡片模式切换
 */
export function useTableFields(opts: UseTableFieldsOptions) {
    const {props} = opts;

    /** 工具字段缓存（扁平化后的字段列表） */
    const toolFields = ref<Array<any>>([]);
    /** APP端字段缓存（卡片模式 + APP popover 数据源） */
    const cacheAppCompList = ref<FieldInfo[]>([]);
    /** 字段配置表 ref，用于替代 document.querySelector */
    const shColumnsTableRef = ref<any>(null);
    /** APP端列显隐弹窗 */
    const mobileFieldVisible = ref(false);
    /** 数据展示模式：list / card */
    let dataShowType = ref<string>("list");
    let typeTitle = ref<string>(i18n("table.switchToCardMode"));
    let typeIcon = ref<string>("card1");

    let sortableInstance: Sortable | null = null;

    /**
     * 将嵌套的字段配置扁平化到 toolFields
     * 支持: 数组 / containerFields(统一容器) / 单个字段对象
     */
    const assignData = (dataList: Array<any>) => {
        for (const temp of dataList) {
            if (Array.isArray(temp)) {
                toolFields.value.push(...temp);
            } else if (temp.containerFields?.length > 0) {
                for (const stemp of temp.containerFields) {
                    if (stemp?.fieldList) {
                        toolFields.value.push(...stemp.fieldList);
                    }
                }
            } else {
                toolFields.value.push(temp);
            }
        }
    };

    /** 重建 toolFields（从 props.fieldList.fieldList 重新解析） */
    const reCreateData = () => {
        toolFields.value = [];
        let tempList = props.fieldList?.fieldList;
        if (tempList) {
            assignData(tempList);
        }
    };

    /** 列拖拽排序 */
    const moveColumn = () => {
        const tableEl: HTMLElement | null =
            shColumnsTableRef.value?.$el ??
            (document.querySelector(".sh-columns") as HTMLElement | null);
        const tbody = tableEl?.querySelector(
            ".el-table__body-wrapper tbody",
        ) as HTMLElement | null;
        if (tbody) {
            if (sortableInstance) {
                sortableInstance.destroy();
            }
            sortableInstance = Sortable.create(tbody, {
                handle: ".move",
                animation: 200,
                ghostClass: "ghost",
                onEnd(event: any) {
                    const {oldIndex, newIndex} = event;
                    if (oldIndex === newIndex) {
                        return;
                    }
                    if (props.fieldList?.fieldList) {
                        let oitem = props.fieldList.fieldList[oldIndex];
                        let nitem = props.fieldList.fieldList[newIndex];
                        if (oitem && nitem) {
                            props.fieldList.fieldList[newIndex] = oitem;
                            props.fieldList.fieldList[oldIndex] = nitem;
                        }
                    }
                    if (cacheAppCompList.value?.length) {
                        let oApp = cacheAppCompList.value[oldIndex];
                        let nApp = cacheAppCompList.value[newIndex];
                        if (oApp && nApp) {
                            cacheAppCompList.value[newIndex] = oApp;
                            cacheAppCompList.value[oldIndex] = nApp;
                        }
                    }
                },
            });
        }
    };

    /**
     * 递归扁平化全部字段（对齐 PC 端 FieldVisibleControl.allColumns 的解析逻辑）
     * 支持：数组 / containerFields(容器，含其 fieldList) / 单字段对象 / 带 fieldList 的分组
     * 仅收集拥有 label 的可见字段，返回的是 props 中原始字段的引用，
     * 因此对 preps.appListVisible 的修改会直接反映到卡片渲染。
     */
    const flattenFields = (
        list: Array<any> | undefined,
        out: Array<any>,
    ): void => {
        if (!Array.isArray(list)) return;
        for (const field of list) {
            if (Array.isArray(field)) {
                flattenFields(field, out);
            } else if (field?.containerFields?.length) {
                for (const container of field.containerFields) {
                    flattenFields(container?.fieldList, out);
                }
            } else if (field?.fieldList?.length) {
                flattenFields(field.fieldList, out);
            } else if (field?.label) {
                out.push(field);
            }
        }
    };

    /** APP 端全部字段（扁平、原始引用），供字段显隐弹窗与卡片共用 */
    const mobileAllFields = computed<FieldInfo[]>(() => {
        const out: Array<any> = [];
        flattenFields(props.fieldList?.fieldList, out);
        return out as FieldInfo[];
    });

    /** 按 dataIndex 排序（缺省 100） */
    const sortByDataIndex = (a: FieldInfo, b: FieldInfo) =>
        ((a as any).preps?.dataIndex ?? 100) -
        ((b as any).preps?.dataIndex ?? 100);

    /**
     * 初始化 APP 端 appListVisible 默认值：
     * 卡片默认只展示「标题 + 2 行 = 3 个」字段——按 dataIndex 顺序取前 3 个非系统字段可见，
     * 其余字段（含系统公共字段）默认隐藏；用户可在字段显隐弹窗中自由勾选。
     * 已显式配置过 appListVisible 的字段保持原值不覆盖。
     */
    const ensureMobileDefaults = () => {
        const ordered = [...mobileAllFields.value].sort(sortByDataIndex);
        let visibleCount = 0;
        ordered.forEach((f: any) => {
            if (!f.preps) f.preps = {};
            const isSystem = SYSTEM_FIELD_NAMES.some((s) =>
                f.fieldName?.toLowerCase().includes(s.toLowerCase()),
            );
            if (f.preps.appListVisible === undefined) {
                const want = !isSystem && visibleCount < 3;
                f.preps.appListVisible = want;
                if (want) visibleCount++;
            } else if (f.preps.appListVisible) {
                visibleCount++;
            }
        });
    };

    /**
     * 加载 APP 端字段：初始化默认显隐并同步 cacheAppCompList（保留列拖拽兼容）
     */
    const loadField = (): FieldInfo[] => {
        ensureMobileDefaults();
        cacheAppCompList.value = mobileAllFields.value as FieldInfo[];
        return cardFieldList.value;
    };

    /**
     * 卡片展示字段（computed）：
     * - PC 端：按 listVisible 过滤
     * - APP 端：按 appListVisible 过滤
     * 均按 dataIndex 排序；解析源为扁平化后的全部字段，保证与字段显隐弹窗一致
     */
    const cardFieldList = computed<FieldInfo[]>(() =>
        mobileAllFields.value
            .filter((item: any) =>
                isMobile.value ? item.preps?.appListVisible : item.listVisible,
            )
            .sort(sortByDataIndex),
    );

    /** 切换列表/卡片模式 */
    const showType = (type: string) => {
        type = type == "card" ? "list" : "card";
        dataShowType.value = type;
        if (type == "card" && !cacheAppCompList.value.length) {
            loadField();
        }
        if (type == "card") {
            typeTitle.value = i18n("table.switchToListMode");
            typeIcon.value = "list";
        } else {
            typeTitle.value = i18n("table.switchToCardMode");
            typeIcon.value = "card1";
        }
    };

    onUnmounted(() => {
        if (sortableInstance) {
            sortableInstance.destroy();
            sortableInstance = null;
        }
    });

    return {
        toolFields,
        cacheAppCompList,
        shColumnsTableRef,
        mobileFieldVisible,
        dataShowType,
        typeTitle,
        typeIcon,
        assignData,
        reCreateData,
        moveColumn,
        loadField,
        cardFieldList,
        mobileAllFields,
        showType,
    };
}
