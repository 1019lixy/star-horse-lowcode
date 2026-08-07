<template>
  <star-horse-dialog
      :title="i18n('item.crontabConfig')"
      box-width="50%"
      :self-func="true"
      @resetForm="resetForm"
      @closeAction="close"
      @merge="submit"
      v-model="cronVisible"
  >
    <el-scrollbar>
      <Crontab ref="cronTabRef" v-model="cronDataValue"/>
    </el-scrollbar>
  </star-horse-dialog>
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
        v-model="formData[field.fieldName]"
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
import {nextTick, onMounted, ref} from "vue";
import Crontab from "@/components/cron/Crontab.vue";
import {allAction, checkIsDisabled, initCompCallEvent,} from "@/components/formcomp/utils/ItemRelationEventUtils";
import {getDynamicEvents} from "@/api/system";

import {ItemPreps} from "@/components/types/ItemPreps";
import {i18n} from "@/lang";

const props = withDefaults(defineProps<ItemPreps>(), {
  isDesign: false,
  disabled: false,
  showFormItem: false,
  bareFlag: false,
  isSearch: false,
});
const emits = defineEmits(["selfFunc", "selectItem"]);
const formData = defineModel("formData");

let cronDataValue = ref<any>("");
let cronVisible = ref(false);
const cronTabRef = ref();
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
const open = () => {
  cronDataValue.value = formData.value[props.field.fieldName];
  cronVisible.value = true;
};
const submit = () => {
  formData.value[props.field.fieldName] = cronDataValue.value;
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
