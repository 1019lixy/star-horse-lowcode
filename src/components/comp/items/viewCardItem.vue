<script setup lang="ts">
import { ModelRef, onMounted, PropType } from "vue";
import { FieldInfo } from "@/components/types/PageFieldInfo";
import { compKey } from "@/api/system";

const props = defineProps({
  item: { type: Array as PropType<Array<FieldInfo> | any>, required: true },
  primaryKey: { type: [String, Object] as PropType<string | any> },
  commonFormat: { type: Function, required: true },
});
const dataForm: ModelRef<any> = defineModel("dataForm");
const init = () => {};
onMounted(() => {
  init();
});
</script>

<template>
  <template
    v-for="(cardItem, key) in item.cardList"
    :key="compKey(cardItem, key)"
  >
    <el-card shadow="hover" v-if="Object.keys(cardItem).length > 0">
      <template #header>
        <div class="card-header">
          <span>{{ cardItem.title || cardItem.tabName }}</span>
        </div>
      </template>
      <star-horse-data-view-items
        :objectName="cardItem.objectName"
        :subFormFlag="cardItem.subFormFlag"
        v-model:data-form="dataForm"
        :commonFormat="commonFormat"
        :primaryKey="primaryKey"
        :fieldList="cardItem"
      />
    </el-card>
  </template>
</template>

<style scoped lang="scss">
.el-card:nth-child(n + 1) {
  margin-top: 10px;
}
</style>
