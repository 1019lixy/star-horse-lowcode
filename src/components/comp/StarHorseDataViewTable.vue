<script setup lang="ts" name="StarHorseDataViewObject">
  import { PropType } from 'vue';
  import { FieldInfo } from '@/components/types/PageFieldInfo';
  import { rowClassName } from '@/api/star_horse_utils.ts';
  import { ModelRef } from 'vue';
  import { Config } from '@/api/settings.ts';

  defineProps({
    item: { type: Array as PropType<Array<FieldInfo>>, required: true },
    batchName: { type: String, required: true },
    compSize: { type: String, default: Config.compSize },
    commonFormat: { type: Function, required: true }
  });
  const dataForm: ModelRef<any> = defineModel('dataForm');
</script>
<template>
  <div
    style="display: flex; justify-content: space-between; width: 100%; border-bottom: var(--star-horse-style) 1px solid"
  >
    <div class="tb_title">
      <star-horse-icon icon-class="info" size="14px" />
      {{ item.title }}
    </div>
    <div style="display: flex; align-items: center; flex-direction: row-reverse"> </div>
  </div>
  <el-table
    :data="dataForm ? dataForm[batchName] : []"
    fit
    border
    :stripe="true"
    :row-class-name="rowClassName"
    :highlight-current-row="true"
    :size="compSize"
    :row-style="{
      height: '30px'
    }"
    :cell-style="{
      height: '30px',
      'font-size': '12px'
    }"
    :header-cell-style="{
      background: '#f2f2f2',
      color: '#707070',
      'font-size': '13px',
      'background-image': '-webkit-gradient(linear,left 0,left 100%,from(#f8f8f8),to(#ececec))'
    }"
  >
    <el-table-column label="序号" fixed align="center" prop="xh" width="60" />
    <template v-for="aitem in item?.fieldList">
      <template v-if="aitem instanceof Array">
        <star-horse-table-view-column :commonFormat="commonFormat" :item="sitem" v-for="sitem in aitem" />
      </template>
      <template v-else-if="aitem.tabList?.length > 0">
        <template v-for="tabItems in aitem.tabList">
          <star-horse-table-view-column
            :commonFormat="commonFormat"
            :item="sitem"
            v-for="sitem in tabItems.fieldList"
          />
        </template>
      </template>
      <template v-else-if="aitem.batchFieldList?.length > 0">
        <template v-for="batchItems in aitem.batchFieldList">
          <star-horse-table-view-column
            :commonFormat="commonFormat"
            :item="sitem"
            v-for="sitem in batchItems.fieldList"
          />
        </template>
      </template>
      <star-horse-table-view-column :commonFormat="commonFormat" :item="aitem" />
    </template>
  </el-table>
</template>
<style lang="scss" scoped>
  .el-table {
    :deep(.cell) {
      color: #000000;
    }
  }
</style>
