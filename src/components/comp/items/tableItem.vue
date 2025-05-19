<script setup lang="ts">
import {ModelRef, onMounted, PropType} from 'vue';
import {ApiUrls} from '@/components/types/ApiUrls';
import {PageFieldInfo} from '@/components/types/PageFieldInfo';
import StarHorseFormTable from '@/components/comp/StarHorseFormTable.vue';
import {Config} from '@/api/settings';

const props = defineProps({
    compUrl: { type: Object as PropType<ApiUrls> },
    item: { type: Object as PropType<PageFieldInfo|any>, required: true },
    objectName: { type: String },
    // 数据索引
    dataIndex: {type: Number, default: -1},
    subFormFlag: { type: String, default: 'N' },
    batchName: { type: String, default: 'batchDataList' },
    batchFieldName: { type: String, default: 'batchFieldList' },
    primaryKey: {type: [String, Object] as PropType<string | any>,required:true},
    rules: { type: Object },
    compSize: { type: String, default: Config.compSize },
    isView: { type: Boolean, default: false }
  });
  const emits = defineEmits(['addRow', 'removeRow']);
  const dataForm: ModelRef<any> = defineModel('dataForm');
  const init = () => {

  };
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
  onMounted(() => {
    init();
  });
</script>

<template>
  <template v-if="item[batchFieldName]?.length > 1 && (!item.displayStyle || item.displayStyle == 'tab')">
    <el-tabs v-model="item.fieldName">
      <template v-for="(temp, key) in item[batchFieldName]">
        <el-tab-pane
          :label="temp['title']"
          v-if="Object.keys(temp).includes('disVisible') ? temp['disVisible'] : true"
          :name="temp.tabName || 'sub_tab' + key"
          :disabled="temp.disabled"
        >
          <star-horse-form-table
            :size="compSize"
            @addRow="addRow"
            @removeRow="removeRow"
            :rules="rules"
            :item="temp"
            v-model:dataForm="dataForm"
          />
        </el-tab-pane>
      </template>
    </el-tabs>
  </template>
  <template v-else v-for="temp in item[batchFieldName]">
    <star-horse-form-table
      :size="compSize"
      :rules="rules"
      @addRow="addRow"
      @removeRow="removeRow"
      :item="temp"
      v-model:dataForm="dataForm"
    />
  </template>
</template>

<style scoped lang="scss"></style>
