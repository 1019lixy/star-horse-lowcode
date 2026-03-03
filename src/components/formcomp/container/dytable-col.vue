<script setup lang="ts" name="box-container">
import { computed, onMounted, PropType, ref } from "vue";
import { warning } from "@/utils/message";
import { useDesignFormStore } from "@/store/DesignForm";
import piniaInstance from "@/store/index";
import { tableCellOperation } from "@/components/formcomp/container/dytableUtils";
import { itemCheck, uuid } from "@/api/system";
import ContainerDropDown from "@/components/formcomp/utils/ContainerDropDown.vue";

const props = defineProps({
  parentField: { type: Object as PropType<any> },
  formInfo: { type: Object as PropType<any> },
  parentComp: { type: Object as PropType<any> },
  isDesign: { type: Boolean, default: false },
  showFormItem: { type: Boolean, default: false },
  disabled: { type: Object as PropType<Boolean | String> },
  field: { type: Object as PropType<any> },
  isFirstRow: { type: Boolean, default: false },
  isLastRow: { type: Boolean, default: false },
  isFirstCol: { type: Boolean, default: false },
  isLastCol: { type: Boolean, default: false },
  rowIndex: { type: Number, default: -1 },
  colIndex: { type: Number, default: -1 },
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
const isResizing = ref(false);
const resizeDirection = ref<"width" | "height" | null>(null);
const startX = ref(0);
const startY = ref(0);
const startWidth = ref(0);
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
  console.log("command", command, props);
  tableCellOperation(command, props, "dytable");
};
const selectCurrentTd = () => {
  designForm.setSubItemId(props.field.id);
};
// 修正事件处理逻辑
const handleResizeStart = (e: MouseEvent) => {
  const target = e.currentTarget as HTMLElement; // 使用 currentTarget 替代 target
  const rect = target.getBoundingClientRect();

  // 计算相对位置时考虑边框
  const isWidthResize = e.clientX > rect.right - 8;
  const isHeightResize = e.clientY > rect.bottom - 8;

  if (isWidthResize || isHeightResize) {
    e.preventDefault();
    isResizing.value = true;
    resizeDirection.value = isWidthResize ? "width" : "height";
    startX.value = e.clientX;
    startY.value = e.clientY;
    startWidth.value = rect.width;
    startHeight.value = rect.height;

    document.addEventListener("mousemove", handleResizeMove);
    document.addEventListener("mouseup", handleResizeEnd);
  }
};

const handleResizeMove = (e: MouseEvent) => {
  if (!isResizing.value) return;

  if (resizeDirection.value === "width") {
    const delta = e.clientX - startX.value;
    const newWidth = startWidth.value + delta;
    // 同步更新所有关联行中相同列索引的宽度
    props.parentField?.preps.elements.forEach((row) => {
      const targetCol = row.columns[props.colIndex];
      if (targetCol) {
        targetCol.colWidth = `${Math.max(20, newWidth)}px`;
      }
    });
  } else {
    const delta = e.clientY - startY.value;
    const newHeight = startHeight.value + delta;
    props.field.colHeight = `${Math.max(20, newHeight)}px`; // 最小20px
  }
};

const handleResizeEnd = () => {
  isResizing.value = false;
  resizeDirection.value = null;
  document.removeEventListener("mousemove", handleResizeMove);
  document.removeEventListener("mouseup", handleResizeEnd);
};

onMounted(() => {});
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
      height: field.colHeight || '40px',
      'word-break': !!field.wordBreak ? 'break-all' : 'normal',
    }"
    @click="selectCurrentTd"
    @mousedown="handleResizeStart"
  >
    <draggable
      @add="(evt: Event) => onDragAdd(evt, field.items)"
      class="smain-design"
      tag="div"
      :item-key="uuid()"
      group="starHorseGroup"
      ghostClass="ghost"
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
  &::after,
  &::before {
    z-index: 1000; // 提升到最高层级
    pointer-events: none; // 允许穿透点击
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    right: -3px !important; // 扩展右侧触发区域
    width: 6px; // 加宽触发范围
    pointer-events: auto !important; // 允许响应鼠标事件
    cursor: col-resize;
    background: var(--star-horse-style);
    opacity: 0;
    z-index: 1001;
    transition:
      opacity 0.3s,
      right 0.1s; // 添加手柄位置过渡
  }

  &.no-transition {
    transition: none !important;
  }

  &:hover {
    &::after,
    &::before {
      opacity: 1; // 提高可见度
      transition-delay: 0.1s; // 添加悬停延迟避免误触发
    }
  }

  // 修正事件处理逻辑
  &[colspan]::after {
    top: 10%;
    height: 80%; // 跨行合并时保持拖拽区域
  }

  // 保证后续列可操作
  &[colspan] + .edit_col::after {
    z-index: 1002;
  }

  &::before {
    content: "";
    position: absolute;
    left: 10%;
    right: 0;
    bottom: -3px; // 扩展底部触发区域
    height: 6px; // 加高触发范围
    pointer-events: auto; // 允许响应鼠标事件
    cursor: row-resize;
    width: 80%;
    background: var(--star-horse-style);
    opacity: 0;
    transition:
      opacity 0.3s,
      bottom 0.1s;
  }

  &:hover {
    &::after,
    &::before {
      opacity: 0.5;
    }
  }

  &.is-resizing {
    background: rgba(64, 158, 255, 0.1);
  }

  &.no-drag {
    &::after,
    &::before {
      display: none !important; // 禁用拖拽手柄
      pointer-events: none !important;
    }

    &:hover {
      &::after,
      &::before {
        opacity: 0 !important;
      }
    }
  }
}
</style>
