<template>
  <template v-for="data in fields">
    <component
        :field="data"
        v-model:formData="formData"
        :isDesign="false"
        :formInfo="fields"
        :showFormItem="true"
        :is="data.itemType + '-item'"
    />
  </template>
</template>

<script lang="ts" setup>
import {onMounted, ref} from "vue";

const formData = ref<any>({
  test: "1-2-1",
});
const fields = ref<Array<any>>([
  {
    id: "Idshf8ab7060-129e-4321-9118-b72738fbc734",
    preps: {
      values: [
        {name: "按钮权限", value: "button_authority", xh: 1},
        {name: "白名单过滤类型", value: "white_name_filter_type", xh: 2},
      ],
    },
    compType: "formItem",
    fieldName: "valid1",
    itemType: "select",
    label: "选择器",
    type: "select",
  },
  {
    id: "Idsh8e8d7ecb-6cb7-4656-909f-23c4899fa85b",
    preps: {
      values: [{name: "CC", value: "c", xh: 1}],
    },
    compType: "formItem",
    fieldName: "valid2",
    itemType: "transfer",
    label: "选择器",
    type: "transfer",
  },
]);
onMounted(() => {
});
</script>

<style lang="scss" scoped></style>
