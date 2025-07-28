<script setup lang="ts" name="StarHorseTableColumn">
import {computed, ComputedRef, nextTick, PropType, ref, unref} from "vue";
import {postRequest} from "@/api/star_horse_apis";
import {closeLoad, commonParseCodeToName} from "@/api/star_horse_utils";
import {error, success, warning} from "@/utils/message";
import {Config} from "@/api/settings";
import {createComponent} from "@/api/system";
import {dateTypes, parseDateByType} from "@/api/date_utils";
import {DyCompField} from "@/components/types";
import $ from "jquery";

const props = defineProps({
  compUrl: {type: Object},
  batchName: {type: String, default: ""},
  item: {type: Object as PropType<any>, required: true},
  dataFormat: {type: Function, required: true},
  cellEditable: {type: Boolean, default: true},
  //全局配置，动态页面使用
  globalConfig: {type: Object as PropType<any>, required: false},
  //是否动态页面
  isDynamic: {type: Boolean, default: false},
  //是否显示排序
  sortable: {type: Boolean, default: true},
  compSize: {type: String, default: Config.compSize},
  source: {type: Number, default: 5},
});
const emits = defineEmits(["focusEvent", "blurEvent"]);
const compInfo: ComputedRef<DyCompField> = computed(() => {
  return {
    ...unref(props.item.preps?.compInfo),
    props: {
      data: {type: Object},
      item: {type: Object},
    },
  };
});
const currentRow = ref();
const focusEvent = (_column: any) => {
};
const blurEvent = (column: any, params: any) => {
  const data = Array.isArray(params) ? params[0] : params;
  let bakeValue = data["starHorseBakeValue"];
  delete data["starHorseBakeValue"];
  delete data["isSelected"];
  if ((!bakeValue && bakeValue != 0) || bakeValue == data[column["property"]]) {
    return;
  }
  let reqParams: any = {};
  if (props.isDynamic) {
    reqParams = {
      dataMap: data,
      relationTables: props.globalConfig,
    };
  } else {
    reqParams = data;
  }
  postRequest(props.compUrl?.mergeUrl!, reqParams)
      .then((res) => {
        if (res.data.code != 0) {
          warning(res.data.cnMessage);
        } else {
          success(res.data.cnMessage);
        }
      })
      .catch((err) => {
        error("接口调用异常" + err);
      })
      .finally(() => {
        closeLoad();
      });
};
const cellClick = (row: any, column: any) => {
  if (
      !props.cellEditable ||
      props.item.preps?.["disabled"] ||
      props.item.preps?.["editDisabled"]
  ) {
    return;
  }
  row["isSelected"] = true;
  row["selectName"] = column["property"];
  let bakeValue = row[column["property"]];
  //解决空值不能提交问题
  row["starHorseBakeValue"] = bakeValue ? bakeValue : "_";
  currentRow.value = row;
  nextTick(() => {
    setTimeout(() => {
      let obj = $("." + column["id"]).find("input");
      obj?.select().focus();
    }, 300);
  });
};
const currentDataFormat = (scope: any) => {
  let item = props.item;
  let name = item.hideName || item.fieldName;
  let val: string = scope.row[name];
  //下拉数据,checkbox,radio切换为对应的名称
  let fname: string = "";
  if (dateTypes.includes(item.type)) {
    return parseDateByType(val, item.type);
  }
  if (
      item.type == "select" ||
      item.type == "checkbox" ||
      item.type == "radio"
  ) {
    fname = item.preps?.values?.find(
        (temp: any) => String(temp.value) == val,
    )?.name;
  }
  if (fname) {
    return fname;
  }
  val = commonParseCodeToName(name, val);
  if (typeof props.dataFormat === "function") {
    return props.dataFormat(name, val, scope.row);
  }
  return val;
};
const popover = ref();
const showOperation = async () => {
  await nextTick();
};
const prototypeCheck = (item: any) => {
  let flag = Object.keys(item).includes("listPrototypeDisplay");
  if (flag) {
    return typeof item.listPrototypeDisplay == "boolean"
        ? item.listPrototypeDisplay
        : true;
  } else {
    flag = Object.keys(item.preps || {}).includes("listPrototypeDisplay");
    if (flag) {
      return typeof item.preps?.listPrototypeDisplay == "boolean"
          ? item.preps?.listPrototypeDisplay
          : true;
    }
  }
  return false;
};
const createPreps = (item: any) => {
  return {
    preps: {
      ...item,
      ...item.preps,
      size: props.compSize,
      name: item.fieldName,
    },
  };
};
</script>
<template>
  <el-table-column
      :prop="item.hideName || item.fieldName"
      :label="item.label"
      :min-width="(item.minWidth || Config.defaultColumnWidth) + 'px'"
      :formatter="dataFormat"
      v-if="item.listVisible"
      :sortable="sortable"
      :show-overflow-tooltip="true"
  >
    <template #default="scope">
      <template v-if="item.preps?.showComp">
        <el-popover
            ref="popover"
            :placement="item.preps.placement || 'left'"
            :width="'auto'"
            v-if="item.preps.popover"
            @show="showOperation"
        >
          <template #reference>
            <star-horse-item
                v-model:dataForm="scope.row"
                :item="item"
                :column="scope.column"
                :batchName="batchName"
                :bareFlag="true"
                :compSize="compSize"
            />
          </template>
          <component
              :is="createComponent(compInfo)"
              :item="item"
              :data="scope.row"
              v-if="compInfo.name"
          />
        </el-popover>
        <star-horse-item
            v-model:dataForm="scope.row"
            :item="item"
            :column="scope.column"
            :batchName="batchName"
            :compSize="compSize"
            v-else
        />
      </template>
      <template v-else-if="prototypeCheck(item)">
        <component
            :is="
            (item.listPrototypeDisplay === true ||
            item.preps?.listPrototypeDisplay === true
              ? item.type || 'input'
              : item.listPrototypeDisplay || item.preps?.listPrototypeDisplay) +
            '-item'
          "
            :bareFlag="true"
            :callBack="() => currentDataFormat(scope)"
            :field="createPreps(item)"
            :formData="scope.row"
        />
      </template>
      <template v-else>
        <star-horse-item
            v-model:dataForm="scope.row"
            :item="item"
            :column="scope.column"
            :batchName="batchName"
            @focus="focusEvent"
            :compSize="compSize"
            @blur="blurEvent"
            :source="source"
            v-if="
            scope.row.isSelected && (scope.row.selectName == scope.column.property)
          "
        />
        <p @click="cellClick(scope.row, scope.column)" v-else>
          {{ currentDataFormat(scope) }}
        </p>
      </template>
    </template>
  </el-table-column>
</template>
<style lang="scss" scoped>
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
