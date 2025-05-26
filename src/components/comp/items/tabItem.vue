<script setup lang="ts">
import StarHorseFormItem from '@/components/comp/StarHorseFormItem.vue';
import {ModelRef, onMounted, PropType} from 'vue';
import {ApiUrls} from '@/components/types/ApiUrls';
import {FieldInfo} from '@/components/types/PageFieldInfo';
import StarHorseFormTable from '@/components/comp/StarHorseFormTable.vue';
import StarHorseIcon from '@/components/comp/StarHorseIcon.vue';
import {Config} from '@/api/settings';
import {checkObject, getDataIndex, getFormData, getPrefix} from '@/api/form_utils';

const props = defineProps({
  compUrl: {type: Object as PropType<ApiUrls>},
  item: {type: Array as PropType<Array<FieldInfo> | any>, required: true},
  objectName: {type: String},
  // 数据索引
  dataIndex: {type: Number, default: -1},
  // 父节点名称
  propPrefix: {type: String, default: ''},
  parentPreps: {type: Object, default: {}},
  subFormFlag: {type: String, default: 'N'},
  batchName: {type: String, default: 'batchDataList'},
  batchFieldName: {type: String, default: 'batchFieldList'},
  primaryKey: {type: [String, Object] as PropType<string | any>, required: true},
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
        :closable="item.closable == 'Y'"
        :addable="item.addable == 'Y'"
        @tabChange="item.actions"
        @tabAdd="item.addActions"
    >
      <template v-for="(tabItem, key) in item.tabList">
        <el-tab-pane
            :label="tabItem.title"
            v-if="tabItem['disVisible']??Object.keys(tabItem).length > 0"
            :name="tabItem.tabName || key"
            :disabled="tabItem.disabled"
            :index="checkObject(dataForm,tabItem,key,dataIndex,propPrefix)"
        >
          <template #label>
            <div class="custom-tabs-label">
              <star-horse-icon :icon-class="tabItem.icon" v-if="tabItem.icon"/>
              <span>{{ tabItem.title }}</span>
              <help v-if="tabItem.helpMsg" :message="tabItem.helpMsg"/>
            </div>
          </template>
          <el-scrollbar height="100%">
            <star-horse-form-item
                :isView="isView"
                :compUrl="compUrl"
                :compSize="compSize"
                @addRow="addRow"
                @removeRow="removeRow"

                :objectName="tabItem.objectName"
                :dataForm="getFormData(tabItem,dataForm,propPrefix,dataIndex,key)"
                :dataIndex="getDataIndex(tabItem,propPrefix,dataIndex,key)"
                :propPrefix="getPrefix(tabItem,propPrefix,dataIndex,key)"
                :fieldList="{
                ...tabItem
              }"
                :rules="rules"
                :subFormFlag="tabItem.subFormFlag"
                :primaryKey="primaryKey"
            />

          </el-scrollbar>
        </el-tab-pane>
      </template>
    </el-tabs>
  </template>
  <template v-else-if="item.batchFieldList?.length > 0">
    <template v-if="item.batchFieldList.length > 1 && (!item.displayStyle || item.displayStyle == 'tab')">
      <el-tabs v-model="item.fieldName" :type="item.type || ''">
        <template v-for="(sitem, key) in item.batchFieldList">
          <el-tab-pane
              v-if="sitem['disVisible']??Object.keys(sitem).length > 0"
              :label="sitem['title']"
              :name="sitem.tabName || 'tab' + key"
              :disabled="sitem.disabled"
          >
            <template #label>
              <div class="custom-tabs-label">
                <star-horse-icon :icon-class="sitem.icon" v-if="sitem.icon"/>
                <span>{{ sitem.title }}</span>
              </div>
            </template>
            <star-horse-form-table
                :size="compSize"
                @addRow="addRow"
                @removeRow="removeRow"
                :rules="rules"
                :item="sitem"
                v-model:dataForm="dataForm"
            />
          </el-tab-pane>
        </template>
      </el-tabs>
    </template>
    <template v-else v-for="temp in item.batchFieldList">
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
