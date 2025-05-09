<template>
  <starhorse-form-item
      :isDesign="isDesign"
      :disabled="disabled"
      :bareFlag="bareFlag"
      :formItem="field"
      :parentField="parentField"
  >
    <el-transfer
        :fid="field?.preps['name']"
        :button-texts="field?.preps['buttonTexts']"
        :data="field?.preps['values']"
        :props="{
        key: field?.preps['props']?.key || 'value',
        label: field?.preps['props']?.label || 'name'
      }"
        :filter-placeholder="field?.preps['filterPlaceholder'] || '请输入' + field?.preps['label']"
        :filterable="field?.preps['filterable'] == 'Y'"
        :format="{
        noChecked: '${total}',
        hasChecked: '${checked}/${total}'
      }"

        :target-order="field?.preps['targetOrder']"
        :titles="[field?.preps['leftTitle'], field?.preps['rightTitle']]"
        :size="formInfo?.size || field?.preps['size'] || 'default'"
        :left-default-checked="JSON.parse(field?.preps['leftDefaultChecked']||'[]')"
        :right-default-checked="JSON.parse(field?.preps['rightDefaultChecked']||'[]')"
        @change="itemAction('change')"
        @input="itemAction('input')"
        @keydown.enter="itemAction('enter')"
        @focus="itemAction('focus')"
        @blur="itemAction('blur')"
        v-model="formData[field.preps['name']]"
    />
  </starhorse-form-item>
</template>
<script setup lang="ts">
import {onMounted, shallowRef} from 'vue';
import {compDynamicData} from '@/api/star_horse_utils.ts';
import {SelectOption} from '@/components/types/SearchProps';
import {allAction} from '@/components/formcomp/utils/ItemRelationEventUtils.ts';

const props = defineProps({
  isDesign: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  bareFlag: {
    type: Boolean,
    default: false
  }, isSearch: {
    type: Boolean,
    default: false
  },
  field: {
    type: Object,
    default: {}
  },
  parentField: {
    type: Object,
    default: {}
  },
  formInfo: {
    type: Object,
    default: {}
  }
});
const emits = defineEmits(['selfFunc', 'selectItem']);
const formData = defineModel("formData");

let actionName = shallowRef('normal');
let bakeData = shallowRef<SelectOption[]>([]);
const itemAction = (prep: string) => {
  allAction(props, emits, formData, prep);
};
const initData = async () => {
  props.field.preps['values'] = await compDynamicData(props.field.preps);
  bakeData.value = JSON.parse(JSON.stringify(props.field?.preps['values']??[]));
};

// let bakeQueryString
const querySearch = async (_queryString: string, _item: Record<string, any>) => {
  // let temp = field.preps;
  // let dataSource = temp['dataSource'];
  //虽然实现类远程搜索，但是数据没法还原为初始状态
  // if (dataSource == "url") {
  //   console.log(queryString);
  //   if (!queryString) {
  //    field.preps["values"] = JSON.parse(JSON.stringify(bakeData));
  //     return false;
  //   }
  //   if (bakeQueryString == queryString) {
  //     return false;
  //   }
  //   bakeQueryString = queryString;
  //   let searchParams: SearchParams[] = [];
  //   searchParams.push({
  //     propertyName: temp["selectLabel"],
  //     value: queryString,
  //     operation: "lk"
  //   });
  //   temp['values'] = await dynamicUrlOperation(temp, searchParams);
  // } else {
  //temp['values'] = queryString ? temp['values'].filter(createFilter(queryString)) : temp['values'];
  // }
  // return item.initial.toLowerCase().includes(queryString.toLowerCase());
};

onMounted(() => {
  initData();
  actionName.value = props.field.preps?.actionName || 'normal';
  if (!props.isSearch) {
    allAction(props, emits, formData, actionName.value, true);
  }
});
</script>
<style scoped></style>
