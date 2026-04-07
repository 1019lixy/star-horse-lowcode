<script setup lang="ts">
import {computed, onMounted, PropType, ref, watch} from "vue";
import {tableAction} from "@/components/formcomp/container/dytableUtils";
import {i18n} from "@/lang";
import {StarHorseDialog} from "@/components/comp";
import Help from "@/components/help.vue";

const props = defineProps({
  parentField: {type: Object as PropType<any>},
  disabled: {type: Object as PropType<Boolean | String>},
  field: {type: Object as PropType<any>},
  isFirstRow: {type: Boolean, default: false},
  isLastRow: {type: Boolean, default: false},
  isFirstCol: {type: Boolean, default: false},
  isLastCol: {type: Boolean, default: false},
  size: {type: String, default: "small"},
  rowIndex: {type: Number, default: -1},
  colIndex: {type: Number, default: -1},
  type: {type: String},
  validBox: {type: Boolean, default: false},
});
const emits = defineEmits(["command"]);
const fieldForm = ref<Record<string, any>>({});
const checkMenuStatus = () => {
  const moveFlag = !props.field.items?.length;
  const elements = props.parentField.preps.elements;
  const lastRow = props.isFirstRow
      ? 0
      : elements[props.rowIndex - 1]?.columns.length;
  const currentRow = elements[props.rowIndex].columns.length;
  const nextRow = props.isLastRow
      ? null
      : elements[props.rowIndex + 1]?.columns.length;
  const isFullColumn =
      props.type == "dytable" &&
      elements?.length == parseInt(props.field.rowspan);
  //检查当前列所有小于改列的数据是否存在合并
  const hasMergeCol = () => {
    // const currentCol=elements[props.rowIndex].columns;
    for (let row = 0; row < elements.length; row++) {
      const tempRow = elements[row];
      const tempCols = tempRow.columns;
      if (tempCols[props.colIndex].colspan > 1) {
        return true;
      }
      for (let i = 0; i < props.colIndex; i++) {
        const col = tempCols[i];
        //合并2
        if (col.colspan > 1 && (i + col.colspan) >= props.colIndex) {
          return true;
        }
      }
    }
  };
  const hasMergeRow = () => {
    // const currentCol=elements[props.rowIndex].columns;
    for (let row = 0; row < elements.length; row++) {
      const tempRow = elements[row];
      const tempCols = tempRow.columns;
      //如果有合并整列，不允许使用合并整行
      for (let col = 0; col < tempCols.length; col++) {
        const temp = tempCols[col];
        if (temp.rowspan == elements.length) {
          return true;
        }
      }

      for (let i = 0; i < props.rowIndex; i++) {
        const col = elements[i].columns[props.colIndex];
        //合并2
        if (col.rowspan > 1 && (i + col.rowspan) >= props.rowIndex) {
          return true;
        }
      }
    }
  };
  return {
    mergeLeftColDisabled: props.isFirstCol,
    mergeRightColDisabled: props.isLastCol,
    mergeWholeRowDisabled: hasMergeRow(),
    mergeWholeColDisabled: isFullColumn || hasMergeCol(),
    mergeAboveRowDisabled: props.isFirstRow || lastRow != currentRow,
    mergeBelowRowDisabled: props.isLastRow || nextRow != currentRow,
    undoMergeRowDisabled: props.field.rowspan == 1,
    undoMergeColDisabled: props.field.colspan == 1,
    resetMergeDisabled: !hasMergeCol() && !hasMergeRow(),
    //第一行,或者没有数据禁用
 /*   moveRowUpDisabled: props.isFirstRow,
    moveRowDownDisabled: props.isLastRow,
    moveColLeftDisabled: props.isFirstCol,
    moveColRightDisabled: props.isLastCol,
    moveRowUpFirstDisabled: props.isFirstRow,
    moveRowDownLastDisabled: props.isLastRow,
    moveColLeftFirstDisabled: props.isFirstCol,
    moveColRightLastDisabled: props.isLastCol,*/
    deleteWholeColDisabled: false,
    deleteWholeRowDisabled: false,
    deleteCurrentColDisabled: false,
    addCellAfterDisabled: false,
    addCellBeforeDisabled: false,
  };
};
let buttonControl = computed(() => checkMenuStatus());
const configDialog = ref<boolean>(false);
const currentCommand = ref<string>("");
const handleTableCellCommand = (command: string) => {
  currentCommand.value = command;
  if (command.includes("Config")) {
    configDialog.value = true;
    fieldForm.value["colHeight"] = props.field.colHeight;
    fieldForm.value["colWidth"] = props.field.colWidth;
    fieldForm.value["rowspan"] = props.field.rowspan;
    fieldForm.value["colspan"] = props.field.colspan;
  } else {
    emits("command", command);
  }
};
const close = () => {
  configDialog.value = false;
};
const submitAction = () => {
  const elements = props.parentField.preps.elements;
  const element = elements[props.rowIndex];
  const columns = element.columns;
  const column = columns[props.colIndex];
  if (currentCommand.value === "rowConfig") {
    column["colHeight"] = fieldForm.value["colHeight"];
  } else if (currentCommand.value === "colConfig") {
    column["colWidth"] = fieldForm.value["colWidth"];
  } else if (currentCommand.value === "cellConfig") {
    const newRowspan = fieldForm.value["rowspan"] || 1;
    const newColspan = fieldForm.value["colspan"] || 1;
    const startRow = props.rowIndex;
    const endRow = startRow + newRowspan;
    const endCol = props.colIndex + newColspan;
    column["rowspan"] = newRowspan;
    column["colspan"] = newColspan;
    //将当前行合并的单元格的可见改为false
    console.log((props.colIndex + 1) + "," + endCol, column);
    for (let col = props.colIndex + 1; col < endCol; col++) {
      columns[col].cellVisible = false;
    }
    //将跨行合并的单元格的可见改为false
    for (let row = props.rowIndex + 1; row < endRow; row++) {
      const tempRow = elements[row];
      const tempRows = tempRow.columns;
      for (let col = props.colIndex; col < endCol; col++) {
        tempRows[col].cellVisible = false;
      }
    }
  }
  Object.entries(fieldForm.value ?? {}).forEach(([key, value]) => {
    props.field[key] = value;
  });
  close();
};
const init = () => {
  tableAction(props, buttonControl.value, props.type);
};
onMounted(() => {
  init();
});
watch(
    () => props.field,
    () => {
      checkMenuStatus();
    },
    {deep: true, immediate: true},
);
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
      :title="i18n('ui.operation')"
      :self-func="true"
      :hide-full-screen-icon="true"
      @merge="submitAction"
      @closeAction="close"
      :dialog-visible="configDialog"
      box-width="40%"
  >
    <el-form v-model="fieldForm">
      <el-form-item
          label="行高"
          prop="colHeight"
          v-if="currentCommand == 'rowConfig'"
      >
        <el-input v-model="fieldForm.colHeight"/>
      </el-form-item>
      <el-form-item
          label="列宽"
          prop="colWidth"
          v-if="currentCommand == 'colConfig'"
      >
        <el-input v-model="fieldForm.colWidth"/>
      </el-form-item>
      <el-form-item
          label="跨行数"
          prop="rowspan"
          v-if="type == 'dytable' && currentCommand == 'cellConfig'"
      >
        <el-input-number min="1" step="1" v-model="fieldForm.rowspan"/>
        <help message="大于1的行数,需要手动删除所在行下一行的列数"/>
      </el-form-item>
      <el-form-item
          label="跨列数"
          prop="colspan"
          v-if="currentCommand == 'cellConfig'"
      >
        <el-input-number
            min="1"
            step="1"
            :max="type == 'dytable' ? 100 : 24"
            v-model="fieldForm.colspan"
        />
        <help
            message="大于1的列数,需要手动删除所在行的列数"
            v-if="type == 'dytable'"
        />
      </el-form-item>
    </el-form>
  </star-horse-dialog>
  <el-dropdown
      trigger="click"
      :disabled="disabled"
      @command="handleTableCellCommand"
      :size="size"
  >
    <star-horse-icon icon-class="menu" style="color: var(--star-horse-white)"/>
    <template #dropdown>
      <el-dropdown-menu style="max-height: 400px; overflow-y: auto;">
        <el-dropdown-item command="insertLeftCol"
        >{{ i18n("ui.insertLeftCol") }}
        </el-dropdown-item>
        <el-dropdown-item command="insertRightCol"
        >{{ i18n("ui.insertRightCol") }}
        </el-dropdown-item>
        <el-dropdown-item command="insertAboveRow"
        >{{ i18n("ui.insertAboveRow") }}
        </el-dropdown-item>
        <el-dropdown-item command="insertBelowRow"
        >{{ i18n("ui.insertBelowRow") }}
        </el-dropdown-item>

        <el-dropdown-item
            command="mergeLeftCol"
            :disabled="buttonControl.mergeLeftColDisabled"
            divided
        >{{ i18n("ui.mergeLeftCell") }}
        </el-dropdown-item>
        <el-dropdown-item
            command="mergeRightCol"
            :disabled="buttonControl.mergeRightColDisabled"
        >{{ i18n("ui.mergeRightCell") }}
        </el-dropdown-item>
        <el-dropdown-item
            command="mergeWholeRow"
            :disabled="buttonControl.mergeWholeRowDisabled"
        >{{ i18n("ui.mergeWholeRow") }}
        </el-dropdown-item>
        <el-dropdown-item
            command="mergeAboveRow"
            v-if="type != 'box' || validBox"
            :disabled="buttonControl.mergeAboveRowDisabled"
            divided
        >{{ i18n("ui.mergeAboveCell") }}
        </el-dropdown-item>
        <el-dropdown-item
            command="mergeBelowRow"
            v-if="type != 'box' || validBox"
            :disabled="buttonControl.mergeBelowRowDisabled"
        >{{ i18n("ui.mergeBelowCell") }}
        </el-dropdown-item>
        <el-dropdown-item
            command="mergeWholeCol"
            v-if="type != 'box' || validBox"
            :disabled="buttonControl.mergeWholeColDisabled"
        >{{ i18n("ui.mergeWholeCol") }}
        </el-dropdown-item>

        <el-dropdown-item
            command="undoMergeRow"
            v-if="type != 'box' || validBox"
            :disabled="buttonControl.undoMergeRowDisabled"
            divided
        >{{ i18n("ui.undoMergeRow") }}
        </el-dropdown-item>
        <el-dropdown-item
            command="undoMergeCol"
            :disabled="buttonControl.undoMergeColDisabled"
        >{{ i18n("ui.undoMergeCol") }}
        </el-dropdown-item>
        <el-dropdown-item
            command="resetMerge"
            :disabled="buttonControl.resetMergeDisabled"
        >{{ i18n("ui.resetMerge") }}
        </el-dropdown-item>
        <el-dropdown-item
            command="addCellAfter"
            v-if="type == 'box'"
            :disabled="buttonControl.addCellAfterDisabled"
            divided
        >{{ i18n("ui.addCellAfter") }}
        </el-dropdown-item>
        <el-dropdown-item
            command="addCellBefore"
            v-if="type == 'box'"
            :disabled="buttonControl.addCellBeforeDisabled"
        >{{ i18n("ui.addCellBefore") }}
        </el-dropdown-item>
        <el-dropdown-item
            command="deleteWholeCol"
            v-if="type != 'box'"
            :disabled="buttonControl.deleteWholeColDisabled"
            divided
        >{{ i18n("ui.deleteWholeCol") }}
        </el-dropdown-item>
        <el-dropdown-item
            command="deleteWholeRow"
            :disabled="buttonControl.deleteWholeRowDisabled"
        >{{ i18n("ui.deleteWholeRow") }}
        </el-dropdown-item>
        <el-dropdown-item
            v-if="type == 'box'"
            command="deleteCurrentCol"
            :disabled="buttonControl.deleteWholeColDisabled"
        >{{ i18n("ui.deleteCurrentCol") }}
        </el-dropdown-item>
        <el-dropdown-item command="colConfig" divided>
          {{ i18n("ui.colConfig") }}
        </el-dropdown-item>
        <el-dropdown-item command="rowConfig">
          {{ i18n("ui.rowConfig") }}
        </el-dropdown-item>
        <el-dropdown-item command="cellConfig">
          {{ i18n("ui.cellConfig") }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style scoped lang="scss"></style>
