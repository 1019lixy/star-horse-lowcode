<script setup lang="ts" name="StarHorseStaticTable">
import { commonParseCodeToName } from "@/api/star_horse_utils";
import { compKey } from "@/api/system";
import { i18n } from "@/lang";
import { operationConfirm, warning } from "@/utils/message";
import Sortable from "sortablejs";
import { computed, onMounted, PropType, provide, ref, unref } from "vue";
import StarHorseIcon from "@/components/comp/StarHorseIcon.vue";
import { ApiUrls } from "@/components/types";
import DataImport from "@/components/comp/utils/DataImport.vue";
import FieldVisibleControl from "@/components/comp/utils/FieldVisibleControl.vue";

const props = defineProps({
  //主键
  primaryKey: {
    type: [String, Object] as PropType<string | any>,
    required: true,
  },
  importInfo: { type: Object as PropType<ApiUrls> },
  //列名
  fieldList: { type: Object, required: true },
  //格式化方法
  dataFormat: { type: Function, default: null },
  //按钮大小
  compSize: { type: String, default: "default" },
  //弹窗模式
  dialogInput: { type: Boolean, default: false },
  //默认表格高度
  height: { type: String, default: "100%" },
  //默认是否展开所有子节点
  expand: { type: Boolean, default: false },
  showBatchField: { type: Boolean, default: false },
  //是否运行选择父级节点
  allowSelectParent: { type: Boolean, default: true },
  //标题
  title: { type: String },
  dataList: { type: Array },
  hideAction: { type: Boolean, default: false },
});
const batchFieldContainers = computed(() => {
  const fl: any = props.fieldList;
  return Array.isArray(fl?.containerFields)
    ? fl.containerFields.filter((c: any) => c?.containerType === "table")
    : [];
});
// const emits = defineEmits(["selectItem"]);
const multipleSelection = ref<any>([]);
const shStaticTableCompRef = ref();
// 当前正在编辑的行引用（编辑互斥：仅允许一行处于编辑状态）
const editingRow = ref<any>(null);
// 取消当前编辑行的编辑状态（O(1)，不遍历 dataList）
const cancelAllEdit = () => {
  const row = editingRow.value;
  if (!row) return;
  const originalValue =
    row.starHorseBakeValue === "_" ? null : row.starHorseBakeValue;
  if (row.selectName) row[row.selectName] = originalValue;
  delete row.isSelected;
  delete row.selectName;
  delete row.starHorseBakeValue;
  editingRow.value = null;
};
provide("starHorseCancelAllEdit", cancelAllEdit);
provide("starHorseSetEditingRow", (row: any) => {
  editingRow.value = row;
});
// 字段配置表（.sh-columns）的 ref，替代 document.querySelector 全局查询
const shColumnsTableRef = ref<any>(null);

let staticDataList = ref<any>([]);
let toolFields = ref<Array<any>>([]);
const getIds = () => {
  let selectDatas = unref(multipleSelection);
  let ids: any = [];
  for (const temp of selectDatas) {
    ids.push(temp[props.primaryKey]);
  }
  return ids;
};
const init = async () => {
  moveColumn();
  reCreateData();
  if (props.dataList) {
    initData(props.dataList);
  }
};
//监听外面传入数据的变化
const assignData = (dataList: Array<any>) => {
  for (const temp of dataList) {
    if (temp instanceof Array) {
      toolFields.value.push(...temp);
    } else if (temp.containerFields?.length > 0) {
      for (const stemp of temp.containerFields) {
        if (stemp["fieldList"]) {
          toolFields.value.push(...stemp["fieldList"]);
        }
      }
    } else {
      toolFields.value.push(temp);
    }
  }
};
const reCreateData = () => {
  toolFields.value = [];
  let tempList = props.fieldList["fieldList"];
  if (tempList) {
    assignData(tempList);
  }
};

const moveColumn = () => {
  // 优先通过 ref 定位表格实例，避免全局 querySelector 误匹配多实例
  const tableEl: HTMLElement | null =
    shColumnsTableRef.value?.$el ??
    (document.querySelector(".sh-columns") as HTMLElement | null);
  const tbody = tableEl?.querySelector(
    ".el-table__body-wrapper tbody",
  ) as HTMLElement | null;
  if (tbody) {
    Sortable.create(tbody, {
      handle: ".move",
      animation: 200,
      ghostClass: "ghost",
      onEnd(event: any) {
        const { oldIndex, newIndex } = event;
        //删除并获取当前行
        const currRow = props.fieldList?.fieldList.splice(oldIndex, 1)[0];
        //再拖动结束位置插入当前行
        props.fieldList?.fieldList.splice(newIndex, 0, currRow);
      },
    });
  }
};

/**
 * 检查是否可以选择父节点
 * @param val
 */
const checkParent = (val: any) => {
  if (props.allowSelectParent) {
    return true;
  }
  let flag = false;
  for (const item of val) {
    if (item["children"] && item["children"].length > 0) {
      flag = true;
      shStaticTableCompRef.value.toggleRowSelection(item, false);
    }
  }
  if (flag) {
    warning(i18n("comp.nonLeafNodeCannotBeSelected"));
    return false;
  }
  return true;
};
const handleSelectionChange = (val: any) => {
  if (!checkParent(val)) {
    return;
  }
  //如果是弹出选择，只能选择一条数据
  if (props.dialogInput) {
    if (val.length <= 1) {
      multipleSelection.value = val;
    } else {
      let ids = multipleSelection.value.map(
        (item: any) => item[props.primaryKey],
      ) as Array<any>;
      let datas = val.filter(
        (item: any) => !ids.includes(item[props.primaryKey]),
      );
      let data = multipleSelection.value[0];
      shStaticTableCompRef.value?.toggleRowSelection(data, true);
      multipleSelection.value = datas;
    }
  } else {
    multipleSelection.value = val;
  }
};
onMounted(() => {
  init();
});

const getRowIdentity = (row: any) => {
  let arr = props.primaryKey?.split(".");
  if (arr?.length > 1) {
    let temp = row;
    for (const k of arr) {
      temp = temp[k];
    }
    return temp;
  }
  return props.primaryKey ? row[props.primaryKey] : "";
};
const dataFormat = (row: any, column: any, cellValue: any, _index: number) => {
  cellValue = commonParseCodeToName(column.property, cellValue);
  return null == props.dataFormat
    ? cellValue
    : props.dataFormat(column.property, cellValue, row);
};
/**
 * 单选选择行
 * @param row
 * @param _column
 * @param _evt
 */
const selectRow = (row: any, _column: any, _evt: any) => {
  if (!checkParent(row)) {
    return;
  }
  if (multipleSelection.value.length > 0) {
    for (let valueElement of multipleSelection.value) {
      shStaticTableCompRef.value.toggleRowSelection(valueElement);
    }
  }
  const selected = multipleSelection.value?.some(
    (item: any) => item[props.primaryKey] === row[props.primaryKey],
  );
  if (!selected) {
    multipleSelection.value.push(row);
    shStaticTableCompRef.value?.toggleRowSelection(row);
  } else {
    multipleSelection.value = multipleSelection.value.filter((item: any) => {
      return item[props.primaryKey] !== row[props.primaryKey];
    });
    shStaticTableCompRef.value?.toggleRowSelection(row, false);
  }
};
const clearAllDatas = () => {
  if (!staticDataList.value?.length) return;
  operationConfirm(i18n("ui.confirm")).then((result) => {
    staticDataList.value = [];
  });
};

/**
 * 列表赋值
 * @param data
 */
const initData = (data: any) => {
  staticDataList.value = data;
};
//将数据添加到第一条
const addData = (data: any) => {
  if (!staticDataList.value?.length) {
    staticDataList.value = [];
  }
  if (!data) {
    return;
  }
  if (Array.isArray(data)) {
    staticDataList.value.splice(0, 0, ...data);
  } else {
    staticDataList.value.splice(0, 0, data);
  }
};
const deleteRow = (index: number, row: any) => {
  if (props.primaryKey) {
    if (typeof props.primaryKey === "string") {
      staticDataList.value = staticDataList.value.filter(
        (item: any) => item[props.primaryKey] !== row[props.primaryKey],
      );
    }
  }
};
//导出方法和变量
defineExpose({
  getIds,
  initData,
  addData,
});
</script>
<template>
  <div class="table-comp">
    <div
      style="
        display: flex;
        justify-content: space-between;
        width: 100%;
        border-bottom: var(--star-horse-style) 1px solid;
      "
      v-if="!dialogInput"
    >
      <div class="tb_title">
        <star-horse-icon
          icon-class="info"
          size="14px"
          style="font-weight: bold; color: var(--star-horse-style)"
        />
        {{ title }}
      </div>
      <div class="flex items-center flex-row-reverse">
        <star-horse-icon
          :title="i18n('context.clear')"
          @click.stop="clearAllDatas"
          icon-class="delete"
          v-if="staticDataList?.length > 0"
          style="cursor: pointer; color: var(--el-color-danger)"
        />
        <data-import :importInfo="importInfo" v-model="staticDataList" />
        <field-visible-control :fields="toolFields" />
      </div>
    </div>

    <el-table
      ref="shStaticTableCompRef"
      :data="staticDataList"
      @selection-change="handleSelectionChange"
      @row-click="selectRow"
      :row-key="getRowIdentity"
      :stripe="true"
      :fit="true"
      :max-height="height"
      :highlight-current-row="true"
      :default-expand-all="expand"
      :row-style="{
        height: '30px',
      }"
      :cell-style="{
        height: '30px',
        'font-size': '12px',
      }"
      :header-cell-style="{
        background: '#f2f2f2',
        color: '#707070',
        'font-size': '13px',
        'background-image':
          '-webkit-gradient(linear,left 0,left 100%,from(#f8f8f8),to(#ececec))',
      }"
      :border="true"
    >
      <el-table-column
        type="selection"
        :align="'center'"
        fixed="left"
        :reserve-selection="true"
      >
      </el-table-column>
      <template
        v-for="item in fieldList['fieldList']"
        :key="compKey(item, item.id)"
      >
        <template v-if="Array.isArray(item)">
          <star-horse-table-column
            :data-format="dataFormat"
            :cellEditable="fieldList['tableCellEditabled']"
            :item="sitem"
            :key="compKey(sitem, key)"
            v-for="(sitem, key) in item"
          />
        </template>
        <template v-else-if="item.containerFields?.length > 0">
          <star-horse-table-column
            :data-format="dataFormat"
            :cellEditable="fieldList['tableCellEditabled']"
            :item="sitem"
            :key="compKey(sitem, key)"
            v-for="(sitem, key) in item.containerFields.fieldList"
          />
        </template>
        <star-horse-table-column
          v-else
          :cellEditable="fieldList['tableCellEditabled']"
          :data-format="dataFormat"
          :item="item"
        />
      </template>
      <template
        v-if="showBatchField"
        v-for="item in batchFieldContainers"
        :key="compKey(item, item.subTablePrimaryKey)"
      >
        <star-horse-table-column :data-format="dataFormat" :item="item" />
      </template>
      <el-table-column
        v-if="!hideAction"
        :label="i18n('table.operation')"
        fixed="right"
        width="60"
      >
        <template #default="scope">
          <star-horse-icon
            icon-class="delete"
            color="var(--el-color-danger)"
            cursor="pointer"
            :title="i18n('api.btn.delete')"
            @click.stop="deleteRow(scope.$index, scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<style lang="scss" scoped>
.warning-row {
  background: #8f8f8f;
}

.table-comp {
  height: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: auto;

  .el-table {
    flex: 1;
    overflow: auto;
  }
}

:deep(.el-table__cell) {
  padding: 0;
}

:deep(th.el-table__cell:first-child) {
  padding: 5px 0;
}

.tb_title {
  display: flex;
  align-items: center;
  flex: 1;
  color: var(--star-horse-style);
}
</style>
