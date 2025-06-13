<script setup lang="ts">
import StarHorseFormItem from '@/components/comp/StarHorseFormItem.vue';
import {ModelRef, onMounted, PropType} from 'vue';
import {ApiUrls} from '@/components/types/ApiUrls';
import {FieldInfo} from '@/components/types/PageFieldInfo';
import StarHorseFormTable from '@/components/comp/StarHorseFormTable.vue';
import StarHorseIcon from '@/components/comp/StarHorseIcon.vue';
import {Config} from '@/api/settings';
import {getDataIndex, getFormData, getPrefix} from '@/api/form_utils';

const props = defineProps({
  compUrl: {type: Object as PropType<ApiUrls>},
  item: {type: Array as PropType<Array<FieldInfo> | any>, required: true},
  // 数据索引
  dataIndex: {type: Number, default: -1},
  itemKey: {type: Number, default: 0},
  // 父节点名称
  propPrefix: {type: String, default: ''},
  rules: {type: Object},
  compSize: {type: String, default: Config.compSize},
  isView: {type: Boolean, default: false},
  parentType: {type: String, default: ''}
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
  <el-tab-pane
      v-if="item['disVisible']??Object.keys(item).length > 0"
      :label="item['title']"
      :name="item.tabName || 'tab' + itemKey"
      :disabled="item.disabled"
      class="h-full flex flex-col"
  >
    <template #label>
      <div class="custom-tabs-label">
        <star-horse-icon :icon-class="item.icon" v-if="item.icon"/>
        <span>{{ item.title }}</span>
      </div>
    </template>
    <template v-if="(parentType=='tab'&&item.tableFlag!='Y')||item.formFlag=='Y'">
      <el-scrollbar height="100%">
        <star-horse-form-item
            :isView="isView"
            :compUrl="compUrl"
            :compSize="compSize"
            @addRow="addRow"
            @removeRow="removeRow"
            :objectName="item.objectName"
            :dataForm="getFormData(item,dataForm,propPrefix,dataIndex,itemKey)"
            :dataIndex="getDataIndex(item,propPrefix,dataIndex,itemKey)"
            :propPrefix="getPrefix(item,propPrefix,dataIndex,itemKey)"
            :fieldList="{  ...item }"
            :rules="rules"
            :subFormFlag="item.subFormFlag"
            :primaryKey="item.primaryKey"
        />

      </el-scrollbar>
    </template>
    <star-horse-form-table
        v-else-if="parentType=='batch'||item.tableFlag=='Y'"
        :size="compSize"
        @addRow="addRow"
        @removeRow="removeRow"
        :rules="rules"
        :item="item"
        v-model:dataForm="dataForm"
    />
  </el-tab-pane>
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
