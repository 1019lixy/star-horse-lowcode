<script setup lang="ts">
import { computed, onMounted, PropType, ref, watch } from "vue";
import { tableAction } from "@/components/formcomp/container/dytableUtils";
import { StarHorseDialog } from "@/components/comp";

const props = defineProps({
  parentField: { type: Object as PropType<any> },
  disabled: { type: Object as PropType<Boolean | String> },
  field: { type: Object as PropType<any> },
  isFirstRow: { type: Boolean, default: false },
  isLastRow: { type: Boolean, default: false },
  isFirstCol: { type: Boolean, default: false },
  isLastCol: { type: Boolean, default: false },
  size: { type: String, default: "small" },
  rowIndex: { type: Number, default: -1 },
  colIndex: { type: Number, default: -1 },
  type: { type: String },
});
const emits = defineEmits(["command"]);
let buttonControl = computed(() => {
  const moveFlag = !props.field.items?.length;
  const elements = props.parentField.preps.elements;
  const lastRow = props.isFirstRow
    ? 0
    : elements[props.rowIndex - 1]?.columns.length;
  const currentRow = elements[props.rowIndex].columns.length;
  const nextRow = props.isLastRow
    ? null
    : elements[props.rowIndex + 1]?.columns.length;
  return {
    mergeLeftColDisabled: props.isFirstCol,
    mergeRightColDisabled: props.isLastCol,
    mergeWholeRowDisabled: false,
    mergeWholeColDisabled: false,
    mergeAboveRowDisabled: props.isFirstRow || lastRow != currentRow,
    mergeBelowRowDisabled: props.isLastRow || nextRow != currentRow,
    undoMergeRowDisabled: props.field.rowspan == 1,
    undoMergeColDisabled: props.field.colspan == 1,
    //第一行,或者没有数据禁用
    moveRowUpDisabled: props.isFirstRow || moveFlag,
    moveRowDownDisabled: props.isLastRow || moveFlag,
    moveColLeftDisabled: props.isFirstCol || moveFlag,
    moveColRightDisabled: props.isLastCol || moveFlag,
    moveRowUpFirstDisabled: props.isFirstRow || moveFlag,
    moveRowDownLastDisabled: props.isLastRow || moveFlag,
    moveColLeftFirstDisabled: props.isFirstCol || moveFlag,
    moveColRightLastDisabled: props.isLastCol || moveFlag,
    deleteWholeColDisabled: false,
    deleteWholeRowDisabled: false,
  };
});
const configDialog = ref<boolean>(false);
const handleTableCellCommand = (command: string) => {
  if (command.includes("Config")) {
    configDialog.value = true;
  } else {
    emits("command", command);
  }
};
const close = () => {
  configDialog.value = false;
};
const submitAction = () => {
  close();
};
const init = () => {
  tableAction(props, buttonControl.value, props.type);
};
onMounted(() => {
  init();
});
watch(
  () => props.parentField,
  () => tableAction(props, buttonControl.value, props.type),
  {
    immediate: false,
    deep: true,
  },
);
</script>

<template>
  <star-horse-dialog
    title="操作"
    :self-func="true"
    :hide-full-screen-icon="true"
    @merge="submitAction"
    @closeAction="close"
    :dialog-visible="configDialog"
    box-width="40%"
  >
    待涉及业务时添加
  </star-horse-dialog>
  <el-dropdown
    trigger="click"
    :disabled="disabled"
    @command="handleTableCellCommand"
    :size="size"
  >
    <star-horse-icon icon-class="menu" style="color: var(--star-horse-white)" />
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="insertLeftCol">左边插入列 </el-dropdown-item>
        <el-dropdown-item command="insertRightCol"
          >右边插入列
        </el-dropdown-item>
        <el-dropdown-item command="insertAboveRow"
          >插入上方行
        </el-dropdown-item>
        <el-dropdown-item command="insertBelowRow"
          >插入下方行
        </el-dropdown-item>

        <el-dropdown-item
          command="mergeLeftCol"
          :disabled="buttonControl.mergeLeftColDisabled"
          divided
          >合并左边单元格
        </el-dropdown-item>
        <el-dropdown-item
          command="mergeRightCol"
          :disabled="buttonControl.mergeRightColDisabled"
          >合并右单元格
        </el-dropdown-item>
        <el-dropdown-item
          command="mergeWholeRow"
          :disabled="buttonControl.mergeWholeRowDisabled"
          >合并整行
        </el-dropdown-item>
        <el-dropdown-item
          command="mergeAboveRow"
          v-if="type != 'box'"
          :disabled="buttonControl.mergeAboveRowDisabled"
          divided
          >合并上边单元格
        </el-dropdown-item>
        <el-dropdown-item
          command="mergeBelowRow"
          v-if="type != 'box'"
          :disabled="buttonControl.mergeBelowRowDisabled"
          >合并下边单元格
        </el-dropdown-item>
        <el-dropdown-item
          command="mergeWholeCol"
          v-if="type != 'box'"
          :disabled="buttonControl.mergeWholeColDisabled"
          >合并整列
        </el-dropdown-item>

        <el-dropdown-item
          command="undoMergeRow"
          v-if="type != 'box'"
          :disabled="buttonControl.undoMergeRowDisabled"
          divided
          >撤销行合并
        </el-dropdown-item>
        <el-dropdown-item
          command="undoMergeCol"
          :disabled="buttonControl.undoMergeColDisabled"
          >撤销列合并
        </el-dropdown-item>
        <el-dropdown-item
          command="moveRowUp"
          :disabled="buttonControl.moveRowUpDisabled"
          divided
          >上移一行
        </el-dropdown-item>
        <el-dropdown-item
          command="moveRowDown"
          :disabled="buttonControl.moveRowDownDisabled"
          >下移一行
        </el-dropdown-item>
        <el-dropdown-item
          command="moveColLeft"
          :disabled="buttonControl.moveColLeftDisabled"
          >左移一列
        </el-dropdown-item>
        <el-dropdown-item
          command="moveColRight"
          :disabled="buttonControl.moveColRightDisabled"
          >右移一列
        </el-dropdown-item>
        <el-dropdown-item
          command="moveRowUpFirst"
          :disabled="buttonControl.moveRowUpFirstDisabled"
          >上移到最上面
        </el-dropdown-item>
        <el-dropdown-item
          command="moveRowDownLast"
          :disabled="buttonControl.moveRowDownLastDisabled"
          >下移到最下面
        </el-dropdown-item>
        <el-dropdown-item
          command="moveColLeftFirst"
          :disabled="buttonControl.moveColLeftFirstDisabled"
          >左移到最左边
        </el-dropdown-item>
        <el-dropdown-item
          command="moveColRightLast"
          :disabled="buttonControl.moveColRightLastDisabled"
          >右移到最右边
        </el-dropdown-item>
        <el-dropdown-item
          command="deleteWholeCol"
          v-if="type != 'box'"
          :disabled="buttonControl.deleteWholeColDisabled"
          divided
          >删除整列
        </el-dropdown-item>
        <el-dropdown-item
          command="deleteWholeRow"
          :disabled="buttonControl.deleteWholeRowDisabled"
          >删除整行
        </el-dropdown-item>
        <el-dropdown-item command="colConfig" divided>
          列设置
        </el-dropdown-item>
        <el-dropdown-item command="rowConfig"> 行设置 </el-dropdown-item>
        <el-dropdown-item command="cellConfig"> 单元格设置 </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style scoped lang="scss"></style>
