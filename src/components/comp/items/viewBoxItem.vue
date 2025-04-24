<script setup lang="ts">
  import { onMounted, PropType, unref } from 'vue';
  import { FieldInfo } from '@/components/types/PageFieldInfo';
  import { ModelRef } from 'vue';

  const props = defineProps({
    item: { type: Array as PropType<Array<FieldInfo>>, required: true },
    commonFormat: { type: Function, required: true }
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
  const init = () => {};
  onMounted(() => {
    init();
  });
</script>

<template>
  <el-row v-if="item instanceof Array" :gutter="0">
    <el-col :span="sitem.colspan || sitem.preps?.colspan || 24 / item.length" v-for="sitem in item">
      <div class="item" v-if="sitem.formVisible || sitem.listVisible || sitem.viewVisible">
        <label>{{ sitem.label }} :</label>
        <div class="content">
          <pre v-if="sitem.type == 'textarea' || sitem.type == 'markdown'">{{ dataFormat(sitem) }}</pre>
          <el-tooltip :content="dataFormat(sitem)" v-else>
            {{ dataFormat(sitem) }}
          </el-tooltip>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<style scoped lang="scss"></style>
