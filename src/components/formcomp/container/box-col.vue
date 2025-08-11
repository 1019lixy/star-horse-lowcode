<script setup lang="ts" name="box-container">
import {computed, onMounted, PropType} from "vue";
import {warning} from "@/utils/message";
import {useDesignFormStore} from "@/store/DesignForm";
import piniaInstance from "@/store/index";
import {tableCellOperation,} from "@/components/formcomp/container/dytableUtils";
import {itemCheck, uuid} from "@/api/system";
import ContainerDropDown from "@/components/formcomp/utils/ContainerDropDown.vue";

const props = defineProps({
  parentField: {type: Object as PropType<any>},
  formInfo: {type: Object as PropType<any>},
  parentComp: {type: Object as PropType<any>},
  isDesign: {type: Boolean, default: false},
  showFormItem: {type: Boolean, default: false},
  disabled: {type: Object as PropType<Boolean | String>},
  field: {type: Object as PropType<any>},
  isFirstRow: {type: Boolean, default: false},
  isLastRow: {type: Boolean, default: false},
  isFirstCol: {type: Boolean, default: false},
  isLastCol: {type: Boolean, default: false},
  rowIndex: {type: Number, default: -1},
  colIndex: {type: Number, default: -1},
});
let designForm = useDesignFormStore(piniaInstance);
let draggingItem = computed(() => designForm.draggingItem);
let excludeContainerType: Array<string> = [
  "box",
  "tab",
  "table",
  "dytable",
  "collapse",
  "card",
];
let currentSubItemId = computed(() => designForm.currentSubItemId);
let isEdit = computed(() => designForm.isEdit);
const formData = defineModel("formData");

const onDragAdd = (evt: Event | any, dataList: any) => {
  selectCurrentTd();
  let newIndex = evt.newIndex;
  if (excludeContainerType.includes(draggingItem.value.itemType)) {
    warning("栅格容器不允许嵌套其他容器");
    let elements = props.field.preps.elements;
    for (let inde in elements) {
      let element = elements[inde];
      for (let sind in element?.columns) {
        let column = element.columns[sind];
        for (let i in column?.items) {
          let item = column.items[i];
          if (draggingItem.value.id == item.id) {
            column.items.splice(i, 1);
          }
        }
      }
    }
    return false;
  }
  if (newIndex != null && newIndex != "undefined") {
    let dataInfo = dataList[newIndex];
    designForm.selectItem(dataInfo, dataInfo.itemType, "");
  }
};

const handleTableCellCommand = (command: string) => {
  tableCellOperation(command, props, "box");
};
const selectCurrentTd = () => {
  console.log(props.field);
  designForm.setSubItemId(props.field._uuid);
};
const checkItem = (items: any) => {
  if (!items["items"]) {
    items["items"] = [];
  }
};
onMounted(() => {

});
//监控数据
</script>
<template>
  <el-col
      class="edit_col"
      :span="field.colspan || 24"
      @click="selectCurrentTd"
  >
    {{rowIndex}}
    <draggable
        @add="(evt: Event) => onDragAdd(evt, field.items)"
        @dragover="checkItem(field)"
        class="smain-design"
        tag="div"
        :disabled="!isEdit"
        :item-key="uuid()"
        group="starHorseGroup"
        ghostClass="ghost"
        animation="200"
        :list="field.items"
    >
      <template #item="{ element: data }">
        <div class="comp-item">
          <component
              :key="data?.id"
              :field="data"
              :formInfo="formInfo"
              :isDesign="isDesign"
              :showFormItem="showFormItem"
              :disabled="disabled"
              :is="itemCheck(data)"
              :parentField="parentField"
              v-model:formData="formData"
          />
        </div>
      </template>
    </draggable>
    <div
        class="table-cell-action"
        v-if="isEdit && isDesign && currentSubItemId == field._uuid"
    >
      <ContainerDropDown
          :field="field"
          :parentField="parentField"
          :isFirstCol="isFirstCol"
          :isLastCol="isLastCol"
          :isFirstRow="isFirstRow"
          :isLastRow="isLastRow"
          :disabled="disabled"
          :rowIndex="rowIndex"
          :colIndex="colIndex"
          :type="'box'"
          @command="handleTableCellCommand"
      />
    </div>
  </el-col>
</template>
<style lang="scss" scoped>
.smain-design {
  width: 100%;
  background: var(--star-horse-background);
  border-radius: 3px;
  height: 100%;
  display: flex;
  //pointer-events: none; // 禁止内部元素拦截事件
  flex-direction: column;
  vertical-align: middle;
  justify-content: center;
  align-items: center;

  .comp-item {
    margin: unset;
  }

  .bare-item {
    width: 100%;
    height: 100%;

    div {
      width: 100%;
      height: 100%;
    }
  }
}

.edit_col {
  display: table-cell;
  min-height: 50px;
  position: relative;
  user-select: none;
  transition: width 0.2s,
  height 0.2s;
  border: 1px solid var(--star-horse-border—color);

  .table-cell-action {
    position: absolute;
    //bottom: -30px;
    pointer-events: auto; // 恢复操作按钮的点击
    bottom: 0;
    right: -2px;
    height: 28px;
    line-height: 28px;
    background: var(--star-horse-style);
    z-index: 999;

    display: flex;
    align-items: center;

    svg {
      font-size: 14px;
      color: #fff;
      margin: 0 5px;
      cursor: pointer;
    }
  }
}


</style>
