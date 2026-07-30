<script setup lang="ts" name="StarHorseStaticTable">
import { commonParseCodeToName } from "@/api/star_horse_utils";
import { compKey } from "@/api/system";
import { i18n } from "@/lang";
import { warning } from "@/utils/message";
import Sortable from "sortablejs";
import {
  onMounted,
  PropType,
  provide,
  reactive,
  ref,
  unref,
} from "vue";
import { Sort, Tools } from "@element-plus/icons-vue";
import { isMobile } from "@/api/device";
import { useMobilePicker } from "@/components/formcomp/utils/useMobilePicker";
import ShMobilePicker from "@/components/formcomp/utils/ShMobilePicker.vue";
const props = defineProps({
  //主键
  primaryKey: {
    type: [String, Object] as PropType<string | any>,
    required: true,
  },
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

// APP 端列显隐抽屉
const {
  pickerVisible: columnPickerVisible,
  placement: columnPlacement,
  size: columnSize,
  openPicker: openColumnPicker,
  closePicker: closeColumnPicker,
} = useMobilePicker(() => ({ preps: {} } as any));
let staticDataList = ref<any>([]);
let toolFields = reactive<Array<any>>([]);
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
    setData(props.dataList);
  }
};
//监听外面传入数据的变化
const assignData = (dataList: Array<any>) => {
  for (const temp of dataList) {
    if (temp instanceof Array) {
      toolFields.push(...temp);
    } else if (temp.tabList?.length > 0) {
      for (const stemp of temp.tabList) {
        if (stemp["fieldList"]) {
          toolFields.push(...stemp["fieldList"]);
        }
      }
    } else {
      toolFields.push(temp);
    }
  }
};
const reCreateData = () => {
  toolFields = [];
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
/**
 * 列表赋值
 * @param data
 */
const setData = (data: any) => {
  staticDataList.value = data;
};
//导出方法和变量
defineExpose({
  getIds,
  setData,
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
        <!-- PC 端：el-popover -->
        <el-popover
          v-if="!isMobile"
          trigger="click"
          :popper-style="{ width: 'unset !important' }"
          placement="left-end"
        >
          <template #reference>
            <el-icon class="star-page-icon" style="cursor: pointer">
              <el-tooltip :content="i18n('comp.showHideColumns')">
                <Tools />
              </el-tooltip>
            </el-icon>
          </template>
          <el-table
            class="sh-columns"
            ref="shColumnsTableRef"
            :data="toolFields"
            :strip="true"
            :fit="true"
            :highlight-current-row="true"
            max-height="400px"
            row-key="prop"
            style="width: 100%"
            :size="compSize"
            :border="true"
          >
            <el-table-column prop="" :label="i18n('comp.sort')" width="60">
              <el-tag class="move" style="cursor: move" :size="compSize">
                <el-icon style="cursor: move">
                  <Sort />
                </el-icon>
              </el-tag>
            </el-table-column>
            <el-table-column
              prop="label"
              :label="i18n('comp.columnName')"
              :show-overflow-tooltip="true"
            >
              <template #default="scope">
                <el-tag
                  round
                  :effect="scope.row.listVisible ? 'dark' : 'light'"
                >
                  {{ scope.row.label }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="listVisible"
              :label="i18n('comp.showHide')"
              width="100"
            >
              <template #default="scope">
                <el-switch
                  v-model="scope.row.listVisible"
                  :size="compSize"
                  :active-value="true"
                  :inactive-value="false"
                />
              </template>
            </el-table-column>
          </el-table>
        </el-popover>
        <!-- APP 端：触发器 + 抽屉 -->
        <el-icon
          v-else
          class="star-page-icon"
          style="cursor: pointer"
          @click="openColumnPicker"
        >
          <Tools />
        </el-icon>
        <ShMobilePicker
          v-if="isMobile"
          v-model="columnPickerVisible"
          :title="i18n('comp.showHideColumns')"
          :placement="columnPlacement"
          :size="columnSize"
          :show-footer="false"
        >
          <el-table
            class="sh-columns"
            ref="shColumnsTableRef"
            :data="toolFields"
            :strip="true"
            :fit="true"
            :highlight-current-row="true"
            max-height="100%"
            row-key="prop"
            style="width: 100%"
            :size="compSize"
            :border="true"
          >
            <el-table-column prop="" :label="i18n('comp.sort')" width="60">
              <el-tag class="move" style="cursor: move" :size="compSize">
                <el-icon style="cursor: move">
                  <Sort />
                </el-icon>
              </el-tag>
            </el-table-column>
            <el-table-column
              prop="label"
              :label="i18n('comp.columnName')"
              :show-overflow-tooltip="true"
            >
              <template #default="scope">
                <el-tag
                  round
                  :effect="scope.row.listVisible ? 'dark' : 'light'"
                >
                  {{ scope.row.label }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="listVisible"
              :label="i18n('comp.showHide')"
              width="100"
            >
              <template #default="scope">
                <el-switch
                  v-model="scope.row.listVisible"
                  :size="compSize"
                  :active-value="true"
                  :inactive-value="false"
                />
              </template>
            </el-table-column>
          </el-table>
        </ShMobilePicker>
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
        :Key="compKey(item, item.id)"
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
        <template v-else-if="item.tabList?.length > 0">
          <star-horse-table-column
            :data-format="dataFormat"
            :cellEditable="fieldList['tableCellEditabled']"
            :item="sitem"
            :key="compKey(sitem, key)"
            v-for="(sitem, key) in item.tabList.fieldList"
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
        v-for="item in fieldList['batchFieldList']"
        :key="compKey(item, item.batchName)"
      >
        <star-horse-table-column :data-format="dataFormat" :item="item" />
      </template>
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
