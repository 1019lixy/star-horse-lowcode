<template>
  <StarHorseDataSelector
    v-model="test"
    :datas="datas"
    :multiple="false"
    :checkStrictly="false"
  />

  {{ formData }}
  <data-picker-item
    :field="{
      label: '测试',
      fieldName: 'test',
      preps: {
        datas,
        collapseTags: true,
        collapseTagsTooltip: true,
        multiple: true,
        disabled: false,
        displayName: 'name',
        displayValue: 'value',
      },
    }"
    :formData="formData"
  />
  <data-picker-item
      :field="{
      label: '测试2',
      fieldName: 'test2',
      preps: {
        datas,
        collapseTags: true,
        collapseTagsTooltip: true,
        multiple: false,
        disabled: false,
        displayName: 'name',
        displayValue: 'value',
      },
    }"
      :formData="formData"
  />

</template>

<script lang="ts" setup>
// import StarHorseJsonEditor from '@/components/comp/StarHorseJsonEditor.vue';
import StarHorseDataSelector from "@/components/comp/StarHorseDataSelector.vue";
import { ref } from "vue";
import DataPickerItem from "@/components/formcomp/items/datapicker-item.vue";

const formData = ref<any>({
  test: "121",
});
const test = ref("121");
const datas = ref([
  {
    name: "测试1",
    value: "1",
    children: [
      {
        name: "测试11",
        value: "11",
      },
      {
        name: "测试12",
        value: "12",
        children: [
          {
            name: "测试121",
            value: "121",
          },
          {
            name: "测试122",
            value: "122",
          },
        ],
      },
    ],
  },
  {
    name: "测试2",
    value: "2",
    children: [
      {
        name: "测试21",
        value: "21",
        children: [
          {
            name: "测试211",
            value: "211",
          },
        ],
      },
    ],
  },
  {
    name: "测试3",
    value: "3",
    children: [
      {
        name: "测试31",
        value: "31",
      },
    ],
  },
]);
</script>

<style lang="scss" scoped></style>
