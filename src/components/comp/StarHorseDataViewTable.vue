<script setup lang="ts" name="StarHorseDataViewObject">
import { ModelRef, PropType } from "vue";
import { FieldInfo } from "@/components/types/PageFieldInfo";
import { rowClassName } from "@/api/star_horse_utils";
import { compKey } from "@/api/system";
import { i18n } from "@/lang";

defineProps({
  item: { type: Array as PropType<Array<FieldInfo> | any>, required: true },
  batchName: { type: String, required: true },
  compSize: { type: String, default: "default" },
  commonFormat: { type: Function, required: true },
});
const dataForm: ModelRef<any> = defineModel("dataForm");
</script>
<template>
  <div
    class="flex justify-between w-full"
    style="border-bottom: var(--star-horse-style) 1px solid"
  >
    <div class="tb_title flex flex-row items-center">
      <star-horse-icon icon-class="info" size="14px" />
      {{ item.title }}
    </div>
    <div class="flex items-center flex-row-reverse"></div>
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
      height: '30px',
    }"
    :cell-style="{
      height: '30px',
      'font-size': '12px',
    }"
    :header-cell-style="{
      background: '#f2f2f2',
      color: '#707070',
      'font-size': '13px',
      'background-image':
        '-webkit-gradient(linear,left 0,left 100%,from(#f8f8f8),to(#ececec))',
    }"
  >
    <el-table-column
      :label="i18n('comp.serialNumber')"
      fixed
      align="center"
      prop="xh"
      width="60"
    />
    <template
      v-for="(aitem, index) in item?.fieldList"
      :key="compKey(aitem, index)"
    >
      <template v-if="Array.isArray(aitem)">
        <star-horse-table-view-column
          :commonFormat="commonFormat"
          :item="sitem"
          v-for="(sitem, key) in aitem"
          :key="compKey(sitem, key)"
        />
      </template>
      <template v-else-if="aitem.tabList?.length > 0">
        <template
          v-for="(tabItems, key) in aitem.tabList"
          :key="compKey(tabItems, key)"
        >
          <star-horse-table-view-column
            :commonFormat="commonFormat"
            :item="sitem"
            :key="compKey(sitem, skey)"
            v-for="(sitem, skey) in tabItems.fieldList"
          />
        </template>
      </template>
      <template v-else-if="aitem.batchFieldList?.length > 0">
        <template
          v-for="(batchItems, bkey) in aitem.batchFieldList"
          :key="compKey(batchItems, bkey)"
        >
          <star-horse-table-view-column
            :commonFormat="commonFormat"
            :item="sitem"
            :key="compKey(sitem, skey)"
            v-for="(sitem, skey) in batchItems.fieldList"
          />
        </template>
      </template>
      <star-horse-table-view-column
        :commonFormat="commonFormat"
        :item="aitem"
      />
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
