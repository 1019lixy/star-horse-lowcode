<script setup lang="ts">
import { computed, onMounted, PropType, ref, watch } from "vue";
import { tableAction } from "@/components/formcomp/container/dytableUtils";
import { i18n } from "@/lang";
import { StarHorseDialog } from "@/components/comp";
import Help from "@/components/help.vue";

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
  return {
    mergeLeftColDisabled: props.isFirstCol,
    mergeRightColDisabled: props.isLastCol,
    mergeWholeRowDisabled: false,
    mergeWholeColDisabled: isFullColumn,
    mergeAboveRowDisabled: props.isFirstRow || lastRow != currentRow,
    mergeBelowRowDisabled: props.isLastRow || nextRow != currentRow,
    undoMergeRowDisabled: props.field.rowspan == 1,
    undoMergeColDisabled: props.field.colspan == 1,
    //第一行,或者没有数据禁用
    moveRowUpDisabled: isFullColumn || props.isFirstRow || moveFlag,
    moveRowDownDisabled: isFullColumn || props.isLastRow || moveFlag,
    moveColLeftDisabled: isFullColumn || props.isFirstCol || moveFlag,
    moveColRightDisabled: isFullColumn || props.isLastCol || moveFlag,
    moveRowUpFirstDisabled: isFullColumn || props.isFirstRow || moveFlag,
    moveRowDownLastDisabled: isFullColumn || props.isLastRow || moveFlag,
    moveColLeftFirstDisabled: isFullColumn || props.isFirstCol || moveFlag,
    moveColRightLastDisabled: isFullColumn || props.isLastCol || moveFlag,
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
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    const columns = element.columns;
    for (let j = 0; j < columns.length; j++) {
      const column = columns[j];
      if (currentCommand.value === "rowConfig" && i == props.rowIndex) {
        column["colHeight"] = fieldForm.value["colHeight"];
      } else if (currentCommand.value === "colConfig" && j == props.colIndex) {
        column["colWidth"] = fieldForm.value["colWidth"];
      } else if (
        currentCommand.value === "cellConfig" &&
        i == props.rowIndex &&
        j == props.colIndex
      ) {
        column["rowspan"] = fieldForm.value["rowspan"];
        column["colspan"] = fieldForm.value["colspan"];
        if(fieldForm.value["rowspan"]>1){
          //1,4 2
          let len=props.rowIndex + fieldForm.value["rowspan"];
          if(len>elements.length){
            len=elements.length;
          }
        elements.slice(props.rowIndex+1, len).forEach((item) => {
          item.columns.splice(props.colIndex, 1);
        });
        }
        if(fieldForm.value["colspan"]>1){
        
         let len=props.colIndex + fieldForm.value["colspan"];
          if(len>columns.length){
            len=columns.length;
          }
          let rightColumns=columns.slice(props.colIndex+1, len);
          columns.splice(props.colIndex+1, rightColumns?.length??0);
        }
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
  { deep: true, immediate: true },
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
        <el-input v-model="fieldForm.colHeight" />
      </el-form-item>
      <el-form-item
        label="列宽"
        prop="colWidth"
        v-if="currentCommand == 'colConfig'"
      >
        <el-input v-model="fieldForm.colWidth" />
      </el-form-item>
      <el-form-item
        label="跨行数"
        prop="rowspan"
        v-if="type == 'dytable' && currentCommand == 'cellConfig'"
      >
        <el-input-number min="1" step="1" v-model="fieldForm.rowspan" />
        <help message="大于1的行数,需要手动删除所在行下一行的列数" />
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
    <star-horse-icon icon-class="menu" style="color: var(--star-horse-white)" />
    <template #dropdown>
      <el-dropdown-menu>
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
          v-if="type != 'box'"
          :disabled="buttonControl.mergeAboveRowDisabled"
          divided
          >{{ i18n("ui.mergeAboveCell") }}
        </el-dropdown-item>
        <el-dropdown-item
          command="mergeBelowRow"
          v-if="type != 'box'"
          :disabled="buttonControl.mergeBelowRowDisabled"
          >{{ i18n("ui.mergeBelowCell") }}
        </el-dropdown-item>
        <el-dropdown-item
          command="mergeWholeCol"
          v-if="type != 'box'"
          :disabled="buttonControl.mergeWholeColDisabled"
          >{{ i18n("ui.mergeWholeCol") }}
        </el-dropdown-item>

        <el-dropdown-item
          command="undoMergeRow"
          v-if="type != 'box'"
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
          command="moveRowUp"
          :disabled="buttonControl.moveRowUpDisabled"
          divided
          >{{ i18n("ui.moveRowUp") }}
        </el-dropdown-item>
        <el-dropdown-item
          command="moveRowDown"
          :disabled="buttonControl.moveRowDownDisabled"
          >{{ i18n("ui.moveRowDown") }}
        </el-dropdown-item>
        <el-dropdown-item
          command="moveColLeft"
          :disabled="buttonControl.moveColLeftDisabled"
          >{{ i18n("ui.moveColLeft") }}
        </el-dropdown-item>
        <el-dropdown-item
          command="moveColRight"
          :disabled="buttonControl.moveColRightDisabled"
          >{{ i18n("ui.moveColRight") }}
        </el-dropdown-item>
        <el-dropdown-item
          command="moveRowUpFirst"
          :disabled="buttonControl.moveRowUpFirstDisabled"
          >{{ i18n("ui.moveRowUpFirst") }}
        </el-dropdown-item>
        <el-dropdown-item
          command="moveRowDownLast"
          :disabled="buttonControl.moveRowDownLastDisabled"
          >{{ i18n("ui.moveRowDownLast") }}
        </el-dropdown-item>
        <el-dropdown-item
          command="moveColLeftFirst"
          :disabled="buttonControl.moveColLeftFirstDisabled"
          >{{ i18n("ui.moveColLeftFirst") }}
        </el-dropdown-item>
        <el-dropdown-item
          command="moveColRightLast"
          :disabled="buttonControl.moveColRightLastDisabled"
          >{{ i18n("ui.moveColRightLast") }}
        </el-dropdown-item>
        <el-dropdown-item
          command="addCellAfter"
          :disabled="buttonControl.addCellAfterDisabled"
          divided
          >{{ i18n("ui.addCellAfter") }}
        </el-dropdown-item>
        <el-dropdown-item
          command="addCellBefore"
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
