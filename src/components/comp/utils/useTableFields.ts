import { computed, onUnmounted, reactive, ref } from "vue";
import Sortable from "sortablejs";
import { i18n } from "@/lang";
import { isMobile } from "@/api/device";
import { convertCompToAppComps } from "@/api/form_utils";
import { FieldInfo } from "@/components/types/PageFieldInfo";

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
  const { props } = opts;

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
          const { oldIndex, newIndex } = event;
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
   * 初始化 APP 端 appListVisible 默认值：
   * - 系统公共字段（创建人/创建时间等）默认隐藏
   * - 其余字段按 PC 端 listVisible 决定
   */
  const initAppListVisible = (fields: FieldInfo[]) => {
    fields.forEach((f: any) => {
      if (!f.preps) f.preps = {};
      if (f.preps.appListVisible === undefined) {
        const isSystem = SYSTEM_FIELD_NAMES.some((s) =>
          f.fieldName?.toLowerCase().includes(s.toLowerCase()),
        );
        f.preps.appListVisible = isSystem ? false : !!f.listVisible;
      }
    });
  };

  /**
   * 加载 APP 端字段缓存（同一页面缓存，避免重复解析）
   * 返回按 appListVisible 过滤、dataIndex 排序后的字段列表
   */
  const loadField = (): FieldInfo[] => {
    if (!cacheAppCompList.value.length) {
      const result = convertCompToAppComps(props.fieldList);
      const rawList: any[] = result.fieldList || [];
      const fields: FieldInfo[] = [];
      for (const item of rawList) {
        if (item?.appList && Array.isArray(item.appList)) {
          for (const sub of item.appList) {
            fields.push(reactive(JSON.parse(JSON.stringify(sub))));
          }
        } else if (Array.isArray(item)) {
          for (const sub of item) {
            fields.push(reactive(JSON.parse(JSON.stringify(sub))));
          }
        } else if (item) {
          fields.push(reactive(JSON.parse(JSON.stringify(item))));
        }
      }
      initAppListVisible(fields);
      cacheAppCompList.value = fields;
    }
    if (!cacheAppCompList.value?.length) {
      return [];
    }
    return cacheAppCompList.value
      .filter((item: FieldInfo) => item.preps?.appListVisible)
      .sort(
        (a: FieldInfo, b: FieldInfo) =>
          (a.preps?.dataIndex || 100) - (b.preps?.dataIndex || 100),
      );
  };

  /**
   * 卡片展示字段（computed）：
   * - PC 端：按 listVisible 过滤
   * - APP 端：按 appListVisible 过滤
   * 均按 dataIndex 排序
   */
  const cardFieldList = computed<FieldInfo[]>(() => {
    if (!cacheAppCompList.value?.length) return [];
    return cacheAppCompList.value
      .filter((item: any) => {
        return isMobile ? item.preps?.appListVisible : item.listVisible;
      })
      .sort(
        (a: FieldInfo, b: FieldInfo) =>
          (a.preps?.dataIndex || 100) - (b.preps?.dataIndex || 100),
      );
  });

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
    showType,
  };
}
