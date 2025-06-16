<template>
  <datetime-item :field="{
   fieldName: 'jsonArray',
   label: 'jsonArray',
  preps:preps
 }" :form-data="formData"/>
</template>

<script setup>
const preps = {
  'type': 'daterange',
  'placeholder': '',
  'rangeSeparator': 'to',
  'startPlaceholder': '',
  'endPlaceholder': '',
  'editable': false,
  'disabledDate':'1,2,5',
  'id': 'Idshe269ce8c-f644-408a-a477-c0c96c606d15',
  'label': '日期选择器',
  'itemNameLabel': '日期选择器',
  'name': 'datetime1',
  'maxLength': 100,
  'rules': [],
  'formVisible': true,
  'listVisible': true,
  'viewVisible': true,
  'clearable': true,
  'listPrototypeDisplay': false
};
const formData = ref({
  jsonArray: `2024-08-01`
});
</script>

<style lang="scss" scoped>

</style>

