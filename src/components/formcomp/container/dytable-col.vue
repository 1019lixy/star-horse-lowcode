<script setup lang="ts" name="box-container">
import {computed, onMounted, PropType, reactive, watch, ref} from "vue";
import {warning} from "@/utils/message";
import {useDesignFormStore} from "@/store/DesignForm.ts";
import piniaInstance from "@/store/index.ts";
import StarHorseIcon from "@/components/comp/StarHorseIcon.vue";
import {tableAction, tableCellOperation} from "@/components/formcomp/container/dytableUtils.ts";
import {Config} from "@/api/settings.ts";

const props = defineProps({
  parentField: {type: Object as PropType<any>},
  formInfo: {type: Object as PropType<any>},
  formData: {type: Object as PropType<any>},
  parentComp: {type: Object as PropType<any>},
  field: {type: Object as PropType<any>},
  isFirstRow: {type: Boolean, default: false},
  isLastRow: {type: Boolean, default: false},
  isFirstCol: {type: Boolean, default: false},
  isLastCol: {type: Boolean, default: false},
  rowIndex: {type: Number, default: -1},
  colIndex: {type: Number, default: -1}
});
let designForm = useDesignFormStore(piniaInstance);
let draggingItem = computed(() => designForm.draggingItem);
let excludeContainerType: Array<string> = ["box", "tab", "table", "dytable", "collapse", "card"];
let currentSubItemId = computed(() => designForm.currentSubItemId);
let isEdit = computed(() => designForm.isEdit);
const isDragging = computed(() => designForm.isDragging);
const isResizing = ref(false);
const resizeDirection = ref<'width' | 'height' | null>(null);
const startX = ref(0);
const startY = ref(0);
const startWidth = ref(0);
const startHeight = ref(0);

let buttonControl = reactive<any>({
  mergeLeftColDisabled: props.isFirstCol,
  mergeRightColDisabled: props.isLastCol,
  mergeWholeRowDisabled: false,
  mergeWholeColDisabled: false,
  mergeAboveRowDisabled: props.isFirstRow,
  mergeBelowRowDisabled: props.isLastRow,
  undoMergeRowDisabled: props.field.rowspan == 1,
  undoMergeColDisabled: props.field.colspan == 1,
  deleteWholeColDisabled: false,
  deleteWholeRowDisabled: false
});
const getComponentName = (data: any) => {
  return data?.itemType + "-item";
};

const onDragAdd = (evt: Event, dataList: any) => {
  selectCurrentTd();
  let newIndex = evt.newIndex;
  if (excludeContainerType.includes(draggingItem.value.itemType)) {
    warning("动态表格容器不允许嵌套其他容器");
    let columns = props.fields?.columns;
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
  tableCellOperation(command, props);
};
const selectCurrentTd = () => {
  designForm.setSubItemId(props.field._uuid);
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
    resizeDirection.value = isWidthResize ? 'width' : 'height';
    startX.value = e.clientX;
    startY.value = e.clientY;
    startWidth.value = rect.width;
    startHeight.value = rect.height;

    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
  }
};

const handleResizeMove = (e: MouseEvent) => {
  if (!isResizing.value) return;

  if (resizeDirection.value === 'width') {
    const delta = e.clientX - startX.value;
    const newWidth = startWidth.value + delta;
    // 同步更新所有关联行中相同列索引的宽度
    console.log(props.parentField?.preps.elements);
    props.parentField?.preps.elements.forEach(row => {
      const targetCol = row.columns[props.colIndex];
      if (targetCol) {
        console.log(targetCol);
        targetCol.colWidth = `${Math.max(20, newWidth)}px`;
      }
    });
    // props.field.colWidth = `${Math.max(20, newWidth)}px`; // 最小20px
  } else {
    const delta = e.clientY - startY.value;
    const newHeight = startHeight.value + delta;
    props.field.colHeight = `${Math.max(20, newHeight)}px`; // 最小20px
  }
};

const handleResizeEnd = () => {
  isResizing.value = false;
  resizeDirection.value = null;
  document.removeEventListener('mousemove', handleResizeMove);
  document.removeEventListener('mouseup', handleResizeEnd);
};
const init = () => {
  tableAction(props, buttonControl);
};
onMounted(() => {
  init();
});
//监控数据
watch(
    () => props.parentField,
    () => tableAction(props, buttonControl),
    {
      immediate: false,
      deep: true
    }
);
</script>
<template>
  <td
      class="edit_col"
      :class="{'dragging-area':isDragging}"
      :colspan="field.colspan || 1"
      :rowspan="field.rowspan || 1"
      :style="{
      width: field.colWidth  || '100%',
      height: field.colHeight  || '40px',
      'word-break': !!field.wordBreak ? 'break-all' : 'normal'
    }"
      @click="selectCurrentTd"
      @mousedown="handleResizeStart"
  >

    <draggable
        @add="(evt: Event) => onDragAdd(evt, field.items)"
        class="smain-design"
        tag="div"
        group="starHorseGroup"
        ghostClass="ghost"
        animation="200"
        :list="field.items"
    >
      <template #item="{ element: data }">
        <div :class="{ 'comp-item': data?.preps['headerFlag'] != 'Y', 'bare-item': data?.preps['headerFlag'] == 'Y' }">
          <component
              :key="data?.id"
              :field="data"
              :formInfo="formInfo"
              :is="getComponentName(data)"
              :parentField="parentField"
              :formData="formData"
          />
        </div>
      </template>
    </draggable>
    <div class="table-cell-action" v-if="isEdit && currentSubItemId == field._uuid">
      <el-dropdown trigger="click" @command="handleTableCellCommand" :size="Config.compSize">
        <star-horse-icon icon-class="menu"/>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="insertLeftCol">左边插入列</el-dropdown-item>
            <el-dropdown-item command="insertRightCol">右边插入列</el-dropdown-item>
            <el-dropdown-item command="insertAboveRow">插入上方行</el-dropdown-item>
            <el-dropdown-item command="insertBelowRow">插入下方行</el-dropdown-item>

            <el-dropdown-item command="mergeLeftCol" :disabled="buttonControl.mergeLeftColDisabled" divided
            >合并左边单元格
            </el-dropdown-item>
            <el-dropdown-item command="mergeRightCol" :disabled="buttonControl.mergeRightColDisabled"
            >合并右单元格
            </el-dropdown-item>
            <el-dropdown-item command="mergeWholeRow" :disabled="buttonControl.mergeWholeRowDisabled"
            >合并整行
            </el-dropdown-item>

            <el-dropdown-item command="mergeAboveRow" :disabled="buttonControl.mergeAboveRowDisabled" divided
            >合并上边单元格
            </el-dropdown-item>
            <el-dropdown-item command="mergeBelowRow" :disabled="buttonControl.mergeBelowRowDisabled"
            >合并下边单元格
            </el-dropdown-item>
            <el-dropdown-item command="mergeWholeCol" :disabled="buttonControl.mergeWholeColDisabled"
            >合并整列
            </el-dropdown-item>

            <el-dropdown-item command="undoMergeRow" :disabled="buttonControl.undoMergeRowDisabled" divided
            >撤销行合并
            </el-dropdown-item>
            <el-dropdown-item command="undoMergeCol" :disabled="buttonControl.undoMergeColDisabled"
            >撤销列合并
            </el-dropdown-item>

            <el-dropdown-item command="deleteWholeCol" :disabled="buttonControl.deleteWholeColDisabled" divided
            >删除整列
            </el-dropdown-item>
            <el-dropdown-item command="deleteWholeRow" :disabled="buttonControl.deleteWholeRowDisabled"
            >删除整行
            </el-dropdown-item>
            <el-dropdown-item command="colConfig" divided>列设置</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </td>
</template>
<style lang="scss" scoped>
.smain-design {
  width: 100%;
  background: var(--star-horse-background);
  border-radius: 3px;
  height: 100%;
  display: flex;
  pointer-events: none; // 禁止内部元素拦截事件
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
  transition: width 0.2s, height 0.2s;
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

  &::after, &::before {
    z-index: 1000; // 提升到最高层级
    pointer-events: none; // 允许穿透点击
  }

  &::after {
    content: '';
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
    transition: opacity 0.3s, right 0.1s; // 添加手柄位置过渡
  }

  &.no-transition {
    transition: none !important;
  }

  &:hover {
    &::after, &::before {
      opacity: 1; // 提高可见度
      transition-delay: 0.1s; // 添加悬停延迟避免误触发
    }
  }


  // 修正事件处理逻辑
  &[colspan]::after {
    top:10%;
    height: 80%; // 跨行合并时保持拖拽区域
  }

  // 保证后续列可操作
  &[colspan] + .edit_col::after {
    z-index: 1002;
  }

  &::before {
    content: '';
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
    transition: opacity 0.3s, bottom 0.1s;
  }

  &:hover {
    &::after, &::before {
      opacity: 0.5;
    }
  }

  &.is-resizing {
    background: rgba(64, 158, 255, 0.1);
  }
}
</style>
