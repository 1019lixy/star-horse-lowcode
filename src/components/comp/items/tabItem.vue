<script setup lang="ts">
import {ModelRef, onMounted, PropType} from 'vue';
import {ApiUrls} from '@/components/types/ApiUrls';
import {FieldInfo} from '@/components/types/PageFieldInfo';
import StarHorseFormTable from '@/components/comp/StarHorseFormTable.vue';
import {Config} from '@/api/settings';
import {compKey} from "@/api/system";

const props = defineProps({
  compUrl: {type: Object as PropType<ApiUrls>},
  item: {type: Array as PropType<any>, required: true},
  objectName: {type: String},
  // 数据索引
  dataIndex: {type: Number, default: -1},
  // 父节点名称
  propPrefix: {type: String, default: ''},
  parentPreps: {type: Object, default: {}},
  subFormFlag: {type: String, default: 'N'},
  batchName: {type: String, default: 'batchDataList'},
  batchFieldName: {type: String, default: 'batchFieldList'},
  primaryKey: {type: [String, Object] as PropType<string | any>},
  rules: {type: Object},
  compSize: {type: String, default: Config.compSize},
  isView: {type: Boolean, default: false}
});
const emits = defineEmits(['addRow', 'removeRow']);
const dataForm: ModelRef<any> = defineModel('dataForm');

/**
 * 列表添加行数据
 * @param row
 */
const addRow = (row: any) => {
  emits('addRow', row);
};
const closeOperation = (tabName: any) => {
  props.item.tabList?.forEach((item: any, index: number) => {
    if (item.tabName == tabName) {
      props.item.tabList.splice(index, 1);
      props.item.fieldName = props.item.tabList[0]?.tabName;
      let closeAction = props.item.closeAction;
      closeAction && closeAction(item);
      return false;
    }
  });
};
/**
 * 列表删除行数据
 * @param row
 */
const removeRow = (row: any) => {
  emits('removeRow', row);
};
const init = () => {
};
onMounted(() => {
  init();
});
</script>

<template>
  <template v-if="item.tabList?.length > 0">
    <el-tabs
        v-model="item.fieldName"
        :type="item.type || ''"
        @tabRemove="closeOperation"
        :closable="item.closable"
        :addable="item.addable"
        @tabChange="item.actions"
        @tabAdd="item.addActions"
    >
      <template v-for="(tabItem, key) in item.tabList" :key="compKey(tabItem,key)">
        <tabPanelItem
            :item="tabItem"
            :dataIndex="dataIndex"
            :itemKey="key"
            :isView="isView"
            parentType="tab"
            :compUrl="compUrl"
            :compSize="compSize"
            :propPrefix="propPrefix"
            @addRow="addRow"
            v-model:dataForm="dataForm"
            @removeRow="removeRow"
            :rules="rules"
        />
      </template>
    </el-tabs>
  </template>
  <template v-else-if="item.batchFieldList?.length > 0">
    <template v-if="item.batchFieldList.length > 1 && (!item.displayStyle || item.displayStyle == 'tab')">
      <el-tabs v-model="item.fieldName" :type="item.type || ''">
        <template v-for="(sitem, key) in item.batchFieldList" :key="compKey(sitem,key)">
          <tabPanelItem
              :item="sitem"
              :dataIndex="dataIndex"
              :itemKey="key"
              :isView="isView"
              :compUrl="compUrl"
              :compSize="compSize"
              parentType="batch"
              :propPrefix="propPrefix"
              @addRow="addRow"
              v-model:dataForm="dataForm"
              @removeRow="removeRow"
              :rules="rules"
          />
        </template>
      </el-tabs>
    </template>
    <template v-else v-for="(temp,key) in item.batchFieldList" :key="compKey(temp,key)">
      <star-horse-form-table
          :rules="rules"
          :size="compSize"
          :item="temp"
          @addRow="addRow"
          @removeRow="removeRow"
          v-if="Object.keys(temp).length > 0"
          v-model:dataForm="dataForm"
      />
    </template>
  </template>
</template>

<style scoped lang="scss">
:deep(.el-tabs__content) {
  height: 100% !important;
  flex: 1;
  overflow: auto;
}

:deep(.el-scrollbar__view) {
  display: flex;
  flex-direction: column;
  height: 100%;
}

:deep(.el-tabs) {
  overflow: auto !important;
}
</style>
