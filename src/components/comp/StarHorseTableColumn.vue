<script setup lang="ts" name="StarHorseTableColumn">
import {
  computed,
  ComputedRef,
  inject,
  nextTick,
  onMounted,
  PropType,
  ref,
  unref,
} from "vue";
import { postRequest } from "@/api/star_horse_apis";
import { closeLoad, commonParseCodeToName } from "@/api/star_horse_utils";
import { error, success, warning } from "@/utils/message";
import { i18n } from "@/lang";
import { Config } from "@/api/settings";
import { createComponent, uuid } from "@/api/system";
import { dateTypes, parseDateByType } from "@/api/date_utils";
import { ApiUrls, DyCompField, FieldInfo } from "@/components/types";
import StarHorseItem from "@/components/comp/StarHorseItem.vue";
import { processFieldList } from "@/api/form_utils";

const props = defineProps({
  compUrl: { type: Object as PropType<ApiUrls> },
  batchName: { type: String, default: "" },
  item: { type: Object as PropType<FieldInfo>, required: true },
  dataFormat: { type: Function, required: true },
  cellEditable: { type: Boolean, default: true },
  //全局配置，动态页面使用
  globalConfig: { type: Object as PropType<any>, required: false },
  //是否动态页面
  isDynamic: { type: Boolean, default: false },
  //是否显示批量属性
  showBatchField: { type: Boolean, default: false },
  //是否显示排序
  sortable: { type: Boolean, default: true },
  compSize: { type: String, default: "default" },
  source: { type: Number, default: 5 },
  commonFormat: {
    type: Function,
    default: () => {},
  },
});
const emits = defineEmits(["focusEvent", "blurEvent"]);
const compInfo: ComputedRef<DyCompField> = computed(() => {
  return {
    ...unref(props.item.preps?.compInfo),
    props: {
      data: { type: Object },
      item: { type: Object },
    },
  };
});
const currentRow = ref<any>({});
const columnId = ref<string>(uuid());
// 父组件提供的取消当前编辑行的方法（O(1) 编辑互斥）
const cancelAllEdit = inject<() => void>("starHorseCancelAllEdit", () => {});
// 父组件提供的设置当前编辑行引用的方法
const setEditingRow = inject<(row: any) => void>(
  "starHorseSetEditingRow",
  () => {},
);
const focusEvent = (_column: any) => {};
const blurEvent = (column: any, params: any) => {
  const data = Array.isArray(params) ? params[0] : params;
  let bakeValue = data["starHorseBakeValue"];
  delete data["starHorseBakeValue"];
  delete data["isSelected"];
  setEditingRow(null);
  changeStyle("hidden");
  if ((!bakeValue && bakeValue != 0) || bakeValue == data[column["property"]]) {
    return;
  }
  let reqParams: any = {};
  if (props.isDynamic) {
    reqParams = {
      dataMap: data,
      relationTables: props.globalConfig,
    };
  } else {
    reqParams = data;
  }
  postRequest(props.compUrl?.mergeUrl!, reqParams)
    .then((res) => {
      if (res?.data?.code != 0) {
        warning(res?.data?.cnMessage);
      } else {
        success(res?.data?.cnMessage);
      }
    })
    .catch((err) => {
      error(i18n("api.interfaceCallError2") + err);
    })
    .finally(() => {
      closeLoad();
    });
};
// 在script部分添加取消方法
const cancelEdit = (row: any) => {
  const originalValue =
    row.starHorseBakeValue === "_" ? null : row.starHorseBakeValue;
  row[row.selectName] = originalValue;
  delete row.isSelected;
  delete row.selectName;
  delete row.starHorseBakeValue;
  setEditingRow(null);
  changeStyle("hidden");
};
const changeStyle = (type: string) => {
  nextTick(() => {
    // 通过当前列的唯一 columnId 精确定位，避免全局查询误匹配其他表格实例
    const container = document.getElementById(columnId.value);
    if (!container) return;
    const cell = container.closest(".cell") as HTMLElement | null;
    if (cell) {
      cell.style.overflow = type;
    }
    // 自动聚焦第一个表单元素
    const input = container.querySelector(
      "input, select, textarea",
    ) as HTMLElement | null;
    if (input) {
      // select 元素调用 select() 选中全部文本，其他元素调用 focus()
      if (typeof (input as HTMLInputElement).select === "function") {
        (input as HTMLInputElement).select();
      }
      input.focus();
    }
  });
};
const cellClick = (row: any, column: any) => {
  if (
    !props.cellEditable ||
    props.item.preps?.["disabled"] ||
    props.item.preps?.["editDisabled"]
  ) {
    warning(i18n("api.columnNotEditable"));
    return;
  }
  // 激活新单元格编辑前，先取消表格内所有其他正在编辑的单元格（编辑互斥）
  cancelAllEdit();
  row["isSelected"] = true;
  row["selectName"] = column["property"];
  let bakeValue = row[column["property"]];
  //解决空值不能提交问题
  row["starHorseBakeValue"] = bakeValue ? bakeValue : "_";
  currentRow.value = row;
  // 登记当前编辑行引用，供下次切换时 O(1) 清理
  setEditingRow(row);
  changeStyle("visible");
};
const currentDataFormat = (scope: any) => {
  let item = props.item;
  let name = item?.hideFieldName || item?.fieldName;
  let val: string = scope?.row?.[name];
  //下拉数据,checkbox,radio切换为对应的名称
  let fname: string = "";
  if (dateTypes.includes(item?.type)) {
    return parseDateByType(val, item.type, item.preps?.type);
  }
  if (
    item?.type == "select" ||
    item?.type == "checkbox" ||
    item?.type == "radio"
  ) {
    fname = item?.preps?.values?.find(
      (temp: any) => String(temp.value) == val,
    )?.name;
  }
  if (fname) {
    return fname;
  }
  val = commonParseCodeToName(name, val);
  if (typeof props.dataFormat === "function") {
    return props.dataFormat(name, val, scope?.row);
  }
  return val;
};
const popover = ref();
const showOperation = async () => {
  await nextTick();
};
const prototypeCheck = (item: any) => {
  let flag = Object.keys(item).includes("listPrototypeDisplay");
  if (flag) {
    return typeof item.listPrototypeDisplay == "boolean"
      ? item.listPrototypeDisplay
      : true;
  } else {
    flag = Object.keys(item.preps || {}).includes("listPrototypeDisplay");
    if (flag) {
      return typeof item.preps?.listPrototypeDisplay == "boolean"
        ? item.preps?.listPrototypeDisplay
        : true;
    }
  }
  return false;
};
const createPreps = (item: any) => {
  return {
    preps: {
      ...item,
      ...item.preps,
      size: props.compSize,
      name: item.fieldName,
    },
  };
};
const loadInnerFields = (data: any) => {
  const result: any = [];
  processFieldList(data, "inner", result);
  return result?.map((temp) => {
    return { ...temp.item };
  });
};
onMounted(() => {
  columnId.value = uuid();
});
</script>
<template>
  <el-table-column
    :prop="item.hideFieldName || item.fieldName"
    :label="item.label"
    :min-width="(item.minWidth || Config.defaultColumnWidth) + 'px'"
    :formatter="dataFormat"
    v-if="
      item.listVisible &&
      !item.preps?.staticData &&
      (!item.children || item.children?.length == 0)
    "
    :sortable="sortable"
    :show-overflow-tooltip="!currentRow.isSelected"
  >
    <template #default="scope">
      <template v-if="item.preps?.showComp">
        <el-popover
          ref="popover"
          :placement="item.preps.placement || 'left'"
          :width="'auto'"
          v-if="item.preps.popover"
          @show="showOperation"
        >
          <template #reference>
            <star-horse-item
              v-model:dataForm="scope.row"
              :item="item"
              :column="scope.column"
              :batchName="batchName"
              :bareFlag="true"
              :compSize="compSize"
            />
          </template>
          <component
            :is="createComponent(compInfo)"
            :item="item"
            :data="scope.row"
            v-if="compInfo.name"
          />
        </el-popover>
        <star-horse-item
          v-model:dataForm="scope.row"
          :item="item"
          :column="scope.column"
          :batchName="batchName"
          :compSize="compSize"
          v-else
        />
      </template>
      <template v-else-if="prototypeCheck(item)">
        <component
          :is="
            (item.listPrototypeDisplay === true ||
            item.preps?.listPrototypeDisplay === true
              ? item.type || 'input'
              : item.listPrototypeDisplay || item.preps?.listPrototypeDisplay) +
            '-item'
          "
          :bareFlag="true"
          :callBack="() => currentDataFormat(scope)"
          :field="createPreps(item)"
          :formData="scope.row"
        />
      </template>
      <template v-else>
        <div
          class="edit-container"
          :id="columnId"
          v-if="
            scope.row.isSelected &&
            scope.row.selectName == scope.column.property
          "
        >
          <div class="action-buttons">
            <el-button
              type="primary"
              size="small"
              @click.stop="blurEvent(scope.column, scope.row)"
              >✔
            </el-button>
            <el-button size="small" @click.stop="cancelEdit(scope.row)"
              >✖
            </el-button>
          </div>
          <star-horse-item
            v-model:dataForm="scope.row"
            :item="item"
            :column="scope.column"
            :batchName="batchName"
            @focus="focusEvent"
            :compSize="compSize"
            :commonFormat="commonFormat"
            @blur="blurEvent"
            :source="source"
            :autofocus="true"
          />
        </div>
        <p @click.stop="cellClick(scope.row, scope.column)" v-else>
          {{ currentDataFormat(scope) }}
        </p>
      </template>
    </template>
  </el-table-column>
  <!--多表头的情况-->
  <template v-else-if="item.children?.length > 0">
    <el-table-column :label="item.label" header-align="center">
      <StarHorseTableColumn
        v-for="temp in loadInnerFields(item.children)"
        :item="temp"
        :compSize="compSize"
        :cellEditable="cellEditable"
        :compUrl="compUrl"
        :dataFormat="dataFormat"
        :commonFormat="commonFormat"
        :globalConfig="globalConfig"
        :sortable="sortable"
        :isDynamic="isDynamic"
        :showBatchField="showBatchField"
      />
    </el-table-column>
  </template>
</template>
<style lang="scss" scoped>
.edit-container {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  z-index:999;

  .action-buttons {
    .el-button {
      padding: 4px 8px;

      & + .el-button {
        margin-left: 4px;
      }
    }
  }
}

:deep(.comp-info) {
  display: unset !important;
}

tbody {
  .cell {
    display: flex;
    flex-direction: row;

    .el-table__expand-icon {
      margin-top: 5px;
    }

    p {
      display: block;
    }
  }
}
</style>
