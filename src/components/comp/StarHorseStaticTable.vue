<script lang="ts" setup name="StarHorseStaticTable">
  import { onMounted, reactive, ref, unref } from "vue";
  import { commonParseCodeToName } from "@/api/star_horse_utils.ts";
  import Sortable from "sortablejs";
  import { warning } from "@/utils/message";
  import { Config } from "@/api/settings.ts";
  import {PropType} from "vue/dist/vue";

  const props = defineProps({
    //主键
    primaryKey: {type: [String, Object] as PropType<string | any>,required:true},
    //列名
    fieldList: { type: Object, required: true },
    //格式化方法
    dataFormat: { type: Function, default: null },
    //按钮大小
    compSize: { type: String, default: Config.compSize },
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

    dataList: { type: Array }
  });
  // const emits = defineEmits(["selectItem"]);
  const multipleSelection = ref<any>([]);
  const shStaticTableCompRef = ref();
  let staticDataList = ref<any>([]);
  let toolFields = reactive<Array<any>>([]);
  const getIds = () => {
    let selectDatas = unref(multipleSelection);
    let ids: any = [];
    for (let key in selectDatas) {
      let temp = selectDatas[key];
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
    for (let key in dataList) {
      let temp: any = dataList[key];
      if (temp instanceof Array) {
        toolFields.push(...temp);
      } else if (temp.tabList?.length > 0) {
        for (let skey in temp.tabList) {
          let stemp = temp.tabList[skey];
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
    const tbody = document.querySelector(".sh-columns .el-table__body-wrapper tbody") as HTMLElement | null;
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
        }
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
    for (let i in val) {
      let item = val[i];
      if (item["children"] && item["children"].length > 0) {
        flag = true;
        shStaticTableCompRef.value.toggleRowSelection(item, false);
      }
    }
    if (flag) {
      warning("非叶子节点不能选择");
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
        let ids = multipleSelection.value.map((item: any) => item[props.primaryKey]) as Array<any>;
        let datas = val.filter((item: any) => !ids.includes(item[props.primaryKey]));
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
      for (let i in arr) {
        temp = temp[arr[i]];
      }
      return temp;
    }
    return props.primaryKey ? row[props.primaryKey] : "";
  };
  const dataFormat = (row: any, column: any, cellValue: any, _index: number) => {
    cellValue = commonParseCodeToName(column.property, cellValue);
    return null == props.dataFormat ? cellValue : props.dataFormat(column.property, cellValue, row);
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
    const selected = multipleSelection.value?.some((item: any) => item[props.primaryKey] === row[props.primaryKey]);
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
    setData
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
        <star-horse-icon icon-class="info" size="14px" style="font-weight: bold; color: var(--star-horse-style)" />
        {{ title }}
      </div>
      <div style="display: flex; align-items: center; flex-direction: row-reverse">
        <el-popover trigger="click" :popper-style="{ width: 'unset !important' }" placement="left-end">
          <template #reference>
            <el-icon class="star-page-icon" style="cursor: pointer">
              <el-tooltip content="显示/隐藏列">
                <Tools />
              </el-tooltip>
            </el-icon>
          </template>
          <el-table
            class="sh-columns"
            ref="table"
            :data="toolFields"
            :strip="true"
            :fit="true"
            :highlight-current-row="true"
            max-height="400px"
            row-key="prop"
            style="width: 100%"
            :size="compSize"
            border
          >
            <el-table-column prop="" label="排序" width="60">
              <el-tag class="move" style="cursor: move" :size="compSize">
                <el-icon style="cursor: move">
                  <Sort />
                </el-icon>
              </el-tag>
            </el-table-column>
            <el-table-column prop="label" label="列名" :show-overflow-tooltip="true">
              <template #default="scope">
                <el-tag round :effect="scope.row.listVisible ? 'dark' : 'light'">
                  {{ scope.row.label }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="listVisible" label="显示/隐藏" width="100">
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
        height: '30px'
      }"
      :cell-style="{
        height: '30px',
        'font-size': '12px'
      }"
      :header-cell-style="{
        background: '#f2f2f2',
        color: '#707070',
        'font-size': '13px',
        'background-image': '-webkit-gradient(linear,left 0,left 100%,from(#f8f8f8),to(#ececec))'
      }"
      border
    >
      <el-table-column type="selection" align="center" fixed="left" :reserve-selection="true"> </el-table-column>
      <template v-for="item in fieldList['fieldList']">
        <template v-if="item instanceof Array">
          <star-horse-table-column
            :data-format="dataFormat"
            :cellEditable="fieldList['tableCellEditabled']"
            :item="sitem"
            v-for="sitem in item"
          />
        </template>
        <template v-else-if="item.tabList?.length > 0">
          <star-horse-table-column
            :data-format="dataFormat"
            :cellEditable="fieldList['tableCellEditabled']"
            :item="sitem"
            v-for="sitem in item.tabList.fieldList"
          />
        </template>
        <star-horse-table-column
          v-else
          :cellEditable="fieldList['tableCellEditabled']"
          :data-format="dataFormat"
          :item="item"
        />
      </template>
      <template v-if="showBatchField" v-for="item in fieldList['batchFieldList']">
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
