<template>
  <star-horse-panel
    :type="dialogType"
    :title="i18n('item.crontabConfig')"
    box-width="50%"
    :userAction="true"
    @resetForm="resetForm"
    @closeAction="close"
    @merge="submit"
    v-model="cronVisible"
  >
    <el-scrollbar>
      <Crontab ref="cronTabRef" v-model="cronDataValue" />
    </el-scrollbar>
  </star-horse-panel>
  <starhorse-form-item
    :showFormItem="showFormItem"
    :isDesign="isDesign"
    :disabled="disabled"
    :bareFlag="bareFlag"
    :field="field"
    :parentField="parentField"
  >
    <el-input
      :fid="field.fieldName"
      v-on="getDynamicEvents(props, itemAction, formData)"
      :model-value="inputValue"
      @update:model-value="onInputUpdate"
    >
      <template #append>
        <el-button
          icon="Clock"
          @click="open"
          :disabled="checkIsDisabled(props)"
        />
      </template>
    </el-input>
  </starhorse-form-item>
</template>
<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from "vue";
import Crontab from "@/components/cron/Crontab.vue";
import {
  allAction,
  checkIsDisabled,
  initCompCallEvent,
} from "@/components/formcomp/utils/ItemRelationEventUtils";
import { getDynamicEvents } from "@/api/system";

import { ItemPreps } from "@/components/types/ItemPreps";
import { i18n } from "@/lang";
import { StarHorsePanel } from "@/components/comp";

const props = withDefaults(defineProps<ItemPreps>(), {
  isDesign: false,
  disabled: false,
  showFormItem: false,
  bareFlag: false,
  isSearch: false,
});
const emits = defineEmits(["userAction", "selectItem"]);
const formData = defineModel("formData");

let cronDataValue = ref<any>("");
let cronVisible = ref(false);
const cronTabRef = ref();
const inputValue = ref("");
watch(
  () => formData.value?.[props.field.fieldName],
  (val) => {
    inputValue.value = val ?? "";
  },
  { immediate: true }
);
const onInputUpdate = (val: string) => {
  inputValue.value = val;
  if (formData.value) {
    formData.value[props.field.fieldName] = val;
  }
};
const itemAction = (prep: any) => {
  allAction(props, emits, formData, prep);
};
const resetForm = () => {
  // formData[field.fieldName] = defaultExpress;
  if (cronTabRef.value) {
    cronTabRef.value.clearCron();
  }
};
const close = () => {
  cronVisible.value = false;
};
const defaultCron = "* * * * * ?";
const open = () => {
  cronDataValue.value = formData.value?.[props.field.fieldName] || defaultCron;
  cronVisible.value = true;
};
const submit = () => {
  const cronVal = cronDataValue.value || defaultCron;
  if (formData.value) {
    formData.value[props.field.fieldName] = cronVal;
  }
  inputValue.value = cronVal;
  close();
};
onMounted(() => {
  resetForm();
  nextTick(() => {
    initCompCallEvent(props, emits, formData);
  });
});
</script>
<style lang="scss" scoped></style>
