<template>
  <json-array-item :field="{
   fieldName: 'jsonArray',
   label: 'jsonArray',

 }" :form-data="formData"/>
</template>

<script setup>

import JsonArrayItem from "@/components/formcomp/items/json-array-item.vue";

const formData = ref({
  jsonArray: `[{
      name: '张三',
      value: 18,
      sex: '男'
    },
    {
      name: '李四',
      value: 20,
      sex: '女'
    }
  ]`
})
</script>

<style lang="scss" scoped>

</style>

