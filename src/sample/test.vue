<template>

  <el-form :model="formData">
    <el-form-item prop="jsonArray">
      <input-item :field="{
        fieldName: 'jsonArray',
        label: 'jsonArray',
        actionName: 'keyup.enter'
      }" :form-data="formData" />
    </el-form-item>
    <el-form-item prop="cron">
      <cron-item :field="{
        fieldName: 'cron',
        label: 'cron',
      }" :form-data="formData" />

    </el-form-item>

  </el-form>
  <!--  <Crontab v-model="formData.cron"/>-->
</template>

<script setup>
import NumberRangeItem from "@/components/formcomp/items/number-range-item.vue";
import { validMsg } from "@/api/form_utils.js";
import CronItem from "@/components/formcomp/items/cron-item.vue";
import Crontab from "@/components/cron/Crontab.vue";

const preps = {
  'type': 'daterange',
  'placeholder': '',
  'rangeSeparator': 'to',
  'startPlaceholder': '',
  'endPlaceholder': '',
  'editable': false,
  'disabledDate': '1,2,5',
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
  jsonArray: "xx",
  cron: '0 0 12 * * ?'
});
</script>

<style lang="scss" scoped></style>
