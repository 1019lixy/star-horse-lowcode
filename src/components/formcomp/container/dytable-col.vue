<script setup lang="ts" name="box-container">
import {computed, onMounted, PropType, ref} from "vue";
import {warning} from "@/utils/message";
import {useDesignFormStore} from "@/store/DesignForm";
import piniaInstance from "@/store/index";
import {tableCellOperation} from "@/components/formcomp/container/dytableUtils";
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
  actionColIndex: {type: Number, default: -1},
  compSize: {type: String, default: "default"},
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
const isDragging = computed(() => designForm.isDragging);
const formData = defineModel("formData");
const rowHeight = computed(() => {
  if (props.compSize == "large") {
    return "45px";
  } else if (props.compSize == "small") {
    return "35px";
  } else {
    return "40px";
  }
});
const isResizing = ref(false);
const resizeDirection = ref<"height" | null>(null);
const startY = ref(0);
const startHeight = ref(0);

const onDragAdd = (evt: Event | any, dataList: any) => {
  selectCurrentTd();
  let newIndex = evt.newIndex;
  if (excludeContainerType.includes(draggingItem.value.itemType)) {
    warning("动态表格容器不允许嵌套其他容器");
    let columns = props.field?.columns;
    for (let sind in columns) {
      let column = columns[sind];
      for (let i in column?.items) {
        let item = column.items[i];
        if (draggingItem.value.id == item.id) {
          column.items.splice(i, 1);
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
  // console.log("command", command, props);
  tableCellOperation(command, props, "dytable");
};
const selectCurrentTd = () => {
  designForm.setSubItemId(props.field.id);
};
// 修正事件处理逻辑，只处理高度调整
const handleResizeStart = (e: MouseEvent) => {
  const target = e.currentTarget as HTMLElement;
  const rect = target.getBoundingClientRect();

  const isHeightResize = e.clientY > rect.bottom - 8;

  if (isHeightResize) {
    e.preventDefault();
    isResizing.value = true;
    resizeDirection.value = "height";
    startY.value = e.clientY;
    startHeight.value = rect.height;

    document.addEventListener("mousemove", handleResizeMove);
    document.addEventListener("mouseup", handleResizeEnd);
  }
};

const handleResizeMove = (e: MouseEvent) => {
  if (!isResizing.value || resizeDirection.value !== "height") return;

  const delta = e.clientY - startY.value;
  const newHeight = startHeight.value + delta;
  props.field.colHeight = `${Math.max(20, newHeight)}px`;
};

const handleResizeEnd = () => {
  isResizing.value = false;
  resizeDirection.value = null;
  document.removeEventListener("mousemove", handleResizeMove);
  document.removeEventListener("mouseup", handleResizeEnd);
};

onMounted(() => {
});
//监控数据
</script>
<template>
  <td
      class="edit_col"
      :class="{
      'dragging-area': isDragging,
      'no-drag': !isDesign,
    }"
      :colspan="field.colspan || 1"
      :rowspan="field.rowspan || 1"
      :style="{
      width: field.colWidth || '100%',
      height: field.colHeight || rowHeight,
      'word-break': !!field.wordBreak ? 'break-all' : 'normal',
      'text-overflow': 'ellipsis'
    }"
      @click="selectCurrentTd"
      @mousedown="handleResizeStart"
  >

    <!--    {{rowIndex}},{{colIndex}}  {{field.id}}-->
    <!--{{actionColIndex}},{{rowIndex}}-->
    <draggable
        @add="(evt: Event) => onDragAdd(evt, field.items)"
        class="smain-design"
        tag="div"
        :item-key="uuid()"
        group="starHorseGroup"
        ghostClass="container_ghost"
        animation="200"
        :list="field.items"
    >
      <template #item="{ element: data }">
        <div
            :class="{
            'comp-item': data?.preps?.headerFlag != 'Y',
            'bare-item': data?.preps?.headerFlag,
          }"
            style="height: 100%"
        >

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
        v-if="isDesign && currentSubItemId == field.id"
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
          :type="'dytable'"
          @command="handleTableCellCommand"
      />
    </div>
  </td>
</template>
<style lang="scss" scoped>
.edit_col {
  &::before {
    z-index: 1000;
    pointer-events: none;
  }

  &::before {
    content: "";
    position: absolute;
    left: 10%;
    right: 0;
    bottom: -3px;
    height: 6px;
    pointer-events: auto;
    cursor: row-resize;
    width: 80%;
    background: var(--star-horse-style);
    opacity: 0;
    transition: opacity 0.3s,
    bottom 0.1s;
  }

  &:hover {
    &::before {
      opacity: 0.5;
    }
  }

  &.is-resizing {
    background: rgba(64, 158, 255, 0.1);
  }

  &.no-drag {
    &::before {
      display: none !important;
      pointer-events: none !important;
    }

    &:hover {
      &::before {
        opacity: 0 !important;
      }
    }
  }
}
</style>
