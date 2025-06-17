<script setup lang="ts" name="StarHorseTableColumn">
import StarHorseItem from '@/components/comp/StarHorseItem.vue';
import {nextTick, PropType, ref} from 'vue';
import {postRequest} from '@/api/star_horse_apis';
import {closeLoad, commonParseCodeToName} from '@/api/star_horse_utils';
import {error, success, warning} from '@/utils/message';
import {Config} from '@/api/settings';
import {createComponent} from '@/api/system';
import {dateTypes, parseDateByType} from "@/api/date_utils";

const props = defineProps({
  compUrl: {type: Object},
  batchName: {type: String, default: ''},
  item: {type: Object as PropType<any>, required: true},
  dataFormat: {type: Function, required: true},
  cellEditable: {type: Boolean, default: true},
  //全局配置，动态页面使用
  globalConfig: {type: Object as PropType<any>, required: false},
  //是否动态页面
  isDynamic: {type: Boolean, default: false},
  //是否显示排序
  sortable: {type: Boolean, default: true},
  compSize: {type: String, default: Config.compSize}
});
const emits = defineEmits(['focusEvent', 'blurEvent']);
const currentRow = ref();
const focusEvent = (_column: any) => {
  // currentRow.value[column["property"]] = currentRow.value[column["property"]];
};
const blurEvent = (column: any) => {
  currentRow.value['isSelected'] = false;
  let bakeValue = currentRow.value['starHorseBakeValue'];
  delete currentRow.value['selectName'];
  delete currentRow.value['starHorseBakeValue'];
  if ((!bakeValue && bakeValue != 0) || bakeValue == currentRow.value[column['property']]) {
    return;
  }
  let params: any = {};
  if (props.isDynamic) {
    params = {
      dataMap: currentRow.value,
      relationTables: props.globalConfig
    };
  } else {
    params = currentRow.value;
  }
  postRequest(props.compUrl?.mergeUrl!, params)
      .then((res) => {
        if (res.data.code != 0) {
          warning(res.data.cnMessage);
        } else {
          success(res.data.cnMessage);
        }
      })
      .catch((err) => {
        error('接口调用异常' + err);
      })
      .finally(() => {
        closeLoad();
      });
};
const cellClick = (row: any, column: any) => {
  if (!props.cellEditable || props.item['disabled'] || props.item['editDisabled']) {
    return;
  }
  row['isSelected'] = true;
  row['selectName'] = column['property'];
  let bakeValue = row[column['property']];
  //解决空值不能提交问题
  row['starHorseBakeValue'] = bakeValue ? bakeValue : '_';
  currentRow.value = row;
  nextTick(() => {
    setTimeout(() => {
      let obj = $('.' + column['id']).find('input');
      // const elements = document.querySelectorAll(`.${column['id']} input`);
      // let obj = elements.length > 0 ? elements[0] : null;
      obj?.select().focus();
      // obj.unbind().on("blur", () => {
      //   console.log(column);
      //   blurEvent(column);
      // });
    }, 300);
  });
};
const currentDataFormat = (scope: any) => {
  let item = props.item;
  let name = item.hideName || item.fieldName;
  let val: string = scope.row[name];
  //下拉数据,checkbox,radio切换为对应的名称
  let fname: string = '';
  if (dateTypes.includes(item.type)) {
    return parseDateByType(val, item.type)
  }
  if (item.type == 'select' || item.type == 'checkbox' || item.type == 'radio') {
    fname = item.preps?.values?.find((temp: any) => String(temp.value) == val)?.name;
  }
  if (fname) {
    return fname;
  }
  val = commonParseCodeToName(name, val);
  if (typeof props.dataFormat === 'function') {
    return props.dataFormat(name, val, scope.row);
  }
  return val;
};
const popover = ref();
const showOperation = async () => {
  await nextTick();
};
const prototypeCheck = (item: any) => {
  let flag = Object.keys(item).includes('listPrototypeDisplay');
  if (flag) {
    return typeof item.listPrototypeDisplay == 'boolean' ? item.listPrototypeDisplay : true;
  } else {
    flag = Object.keys(item.preps || {}).includes('listPrototypeDisplay');
    if (flag) {
      return typeof item.preps?.listPrototypeDisplay == 'boolean' ? item.preps?.listPrototypeDisplay : true;
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
      name: item.fieldName
    }
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
                :dataForm="scope.row"
                :item="item"
                :column="scope.column"
                :batchName="batchName"
                :bareFlag="true"
                :compSize="compSize"
            />
          </template>
          <component
              :is="
              createComponent({
                ...item.preps.compField,
                props: {
                  data: { type: Object },
                  item: { type: Object }
                }
              },__starHorseHostApp__ )
            "
              :data="scope.row"
              :item="item"
              v-if="item.preps.compField"
          />
        </el-popover>
        <star-horse-item
            :dataForm="scope.row"
            :item="item"
            :column="scope.column"
            :batchName="batchName"
            :compSize="compSize"
            :style="{ ...item.preps.styles }"
            v-on:[item.preps.compAction]="item.preps.compFunc(scope.row)"
            v-else
        />
      </template>
      <template v-else-if="prototypeCheck(item)">
        <component
            :is="
            (item.listPrototypeDisplay === true || item.preps?.listPrototypeDisplay === true
              ? item.type || 'input'
              : item.listPrototypeDisplay || item.preps?.listPrototypeDisplay) + '-item'
          "
            :bareFlag="true"
            :callBack="() => currentDataFormat(scope)"
            :field="createPreps(item)"
            :formData="scope.row"
        />
      </template>
      <template v-else>
        <star-horse-item
            :dataForm="scope.row"
            :item="item"
            :column="scope.column"
            :batchName="batchName"
            @focus="focusEvent"
            :compSize="compSize"
            @blur="blurEvent"
            v-if="
            scope.row.isSelected && (scope.row.selectName == item.hideName || scope.row.selectName == item.fieldName)
          "
        />
        <p @click="cellClick(scope.row, scope.column)" v-else> {{ currentDataFormat(scope) }}</p>
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
