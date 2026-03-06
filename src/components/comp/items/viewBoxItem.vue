<script setup lang="ts">
import {computed, ModelRef, onMounted, PropType, unref} from "vue";
import {FieldInfo} from "@/components/types/PageFieldInfo";
import {compKey} from "@/api/system";

const props = defineProps({
  item: {type: Array as PropType<Array<FieldInfo> | any>, required: true},
  commonFormat: {type: Function, required: true},
  compSize: {type: String, default: "default"},
});
const rowHeight = computed(() => {
  if(props.compSize=="large"){
    return "45px";
  }else if(props.compSize=="small"){
    return "35px";
  }else{
    return "40px";
  }
});
const dataForm: ModelRef<any> = defineModel("dataForm");
const dataFormat = (item: any) => {
  let name = item["hideName"] || item["fieldName"];
  let tempForm = unref(dataForm);
  if (!tempForm) {
    return "--";
  }
  let val = tempForm[name];
  try {
    return props.commonFormat(name, val, tempForm);
  } catch (e) {
    return val || "--";
  }
};
const init = () => {
};
onMounted(() => {
  init();
});
</script>

<template>
  <el-row v-if="Array.isArray(item)" :gutter="5">
    <el-col
        :span="sitem.colspan || sitem.preps?.colspan || 24 / item.length"
        v-for="(sitem, ind) in item"
        :key="compKey(sitem, ind)"
        v-bind="sitem.preps"
        :style="{
              border: '1px solid var(--star-horse-border—color',
              width: sitem.preps?.colWidth || 'auto',
              height: sitem.preps?.colHeight || rowHeight,
              'text-align': sitem.preps?.textAlign ?? 'left',
              'white-space': 'nowrap',
              display: 'flex',
              'align-items': 'center',
              'justify-content': 'center',
              'word-break': !!sitem.preps?.wordBreak ? 'break-all' : 'keep-all',
            }"
    >
      <div class=" w-full h-full  overflow-hidden" v-if="sitem.type=='html'||sitem.type=='text'">
        <star-horse-item
            :compSize="compSize"
            v-model:dataForm="dataForm"
            :item="sitem"
            :dataIndex="1"
            :source="5"
        />
      </div>
      <div
          class=" h-full w-full "
          v-else-if="sitem.formVisible || sitem.listVisible || sitem.viewVisible"
      >
        <label v-if="!sitem.preps.hideLabel&&sitem.label">{{ sitem.label }} :</label>
        <div :class="{content:!sitem.preps.hideLabel}">
           <pre v-if="sitem.type == 'textarea' || sitem.type == 'markdown'">{{
               dataFormat(sitem)
             }}</pre>
          <el-tooltip :content="dataFormat(sitem)" v-else>
            {{ dataFormat(sitem) }}
          </el-tooltip>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<style scoped lang="scss"></style>
