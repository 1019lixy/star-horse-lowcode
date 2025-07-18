<script setup lang="ts" name="StarHorseTableColumn">
import { createDatetime } from "@/api/date_utils";
import { parseListData } from "@/api/form_utils";
import { Config } from "@/api/settings";
import { PropType } from "vue";

const props = defineProps({
  batchName: { type: String, default: "" },
  item: { type: Object as PropType<any>, required: true },
  commonFormat: { type: Function, required: true },
});

const dataFormat = (scope: any) => {
  let item = props.item;
  let val: string = scope.row[item.hideName || item.fieldName];
  if (
    item.type == "select" ||
    item.type == "checkbox" ||
    item.type == "radio"
  ) {
    return parseListData(item, val);
  }
  if (item.type == "date" || item.type == "datetime") {
    return createDatetime(val);
  }
  if (props.commonFormat && scope.column.property) {
    return props.commonFormat(scope.column.property, val, scope.row);
  }
  return val;
};
</script>
<template>
  <el-table-column
    :prop="item.hideName || item.fieldName"
    :label="item.label"
    sortable
    :show-overflow-tooltip="true"
    v-if="item.formVisible || item.listVisible || item.viewVisible"
    :min-width="(item.minWidth || Config.defaultColumnWidth) + 'px'"
  >
    <template #default="scope">
      {{ dataFormat(scope) }}
    </template>
  </el-table-column>
</template>
<style lang="scss">
tbody {
  .cell {
    display: flex;
    flex-direction: row;

    .el-table__expand-icon {
      margin-top: 5px;
    }

    p {
      display: block;
    }
  }
}
</style>
