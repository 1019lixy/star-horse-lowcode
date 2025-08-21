<template>
  {{test}}
  <StarHorseDataSelector
      v-model="test"
      :datas="datas"
      :multiple="false"
      :checkStrictly="false"
  />

  {{ formData }}
<!--  <data-picker-item
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
  />-->
</template>

<script lang="ts" setup>
// import StarHorseJsonEditor from '@/components/comp/StarHorseJsonEditor.vue';
import StarHorseDataSelector from "@/components/comp/StarHorseDataSelector.vue";
import { ref } from "vue";
import DataPickerItem from "@/components/formcomp/items/datapicker-item.vue";

const formData = ref<any>({
  test: "1-2-1",
});
const test = ref("1-2-1");
const datas = ref([
  {
    name: "测试1",
    value: "1",
    children: [
      {
        name: "测试1-1",
        value: "1-1",
      },
      {
        name: "测试1-2",
        value: "1-2",
        children: [
          {
            name: "测试1-2-1",
            value: "1-2-1",
          },
          {
            name: "测试1-2-2",
            value: "1-2-2",
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
        name: "测试2-1",
        value: "2-1",
        children: [
          {
            name: "测试2-1-1",
            value: "2-1-1",
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
        name: "测试3-1",
        value: "3-1",
      },
    ],
  },
]);
</script>

<style lang="scss" scoped></style>
