<script setup lang="ts">
import {onMounted, PropType, unref} from 'vue';
import {FieldInfo} from '@/components/types/PageFieldInfo';
import {ModelRef} from 'vue';

const props = defineProps({
  item: {type: Object as PropType<FieldInfo>, required: true},
  commonFormat: {type: Function, required: true}
});
const dataForm: ModelRef<any> = defineModel('dataForm');
const dataFormat = (item: any) => {
  let name = item['hideName'] || item['fieldName'];
  let tempForm = unref(dataForm);
  if (!tempForm) {
    return '--';
  }
  let val = tempForm[name];
  try {
    return props.commonFormat(name, val, tempForm);
  } catch (e) {
    return val || '--';
  }
};
const init = () => {
};
onMounted(() => {
  init();
});
</script>

<template>
  <template v-if="item.type == 'usercomp'">
    <star-horse-item
        v-if="item.formVisible || item.listVisible || item.viewVisible"
        :primaryKey="'id'"
        v-model:dataForm="dataForm"
        :item="item"
        :isView="true"
    />
  </template>
  <div class="item" v-if="item.formVisible || item.listVisible || item.viewVisible">
    <label>{{ item.label }} :</label>
    <div class="content">
      <pre v-if="item.type == 'textarea' || item.type == 'markdown'">{{ dataFormat(item) }}</pre>
      <el-tooltip :content="dataFormat(item)" v-else>
        {{ dataFormat(item) }}
      </el-tooltip>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
