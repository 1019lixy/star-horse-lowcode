<template>
  <star-horse-dialog
    :title="'Crontab 配置器'"
    box-width="50%"
    :self-func="true"
    @resetForm="resetForm"
    @closeAction="close"
    @merge="submit"
    :dialog-visible="cronVisible"
  >
    <el-scrollbar>
      <Crontab ref="cronTabRef" v-model="cronDataValue" />
    </el-scrollbar>
  </star-horse-dialog>
  <starhorse-form-item
    :showFormItem="showFormItem"
    :isDesign="isDesign"
    :disabled="disabled"
    :bareFlag="bareFlag"
    :formItem="field"
    :parentField="parentField"
  >
    <el-input
      :fid="field.fieldName"
      v-on="getDynamicEvents(props, itemAction)"
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
import {nextTick, onMounted, PropType, ref} from "vue";
import Crontab from "@/components/cron/Crontab.vue";
import {
  allAction,
  checkIsDisabled,
  initCompCallEvent,
} from "@/components/formcomp/utils/ItemRelationEventUtils";
import { getDynamicEvents } from "@/api/system";

const props = defineProps({
  isDesign: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  showFormItem: {
    type: Boolean,
    default: false,
  },
  bareFlag: {
    type: Boolean,
    default: false,
  },
  isSearch: {
    type: Boolean,
    default: false,
  },
  field: {
    type: Object as PropType<any>,
    required: true,
  },
  parentField: {
    type: Object as PropType<any>,
  },
  formInfo: {
    type: Object as PropType<any>,
  },
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
resetForm();
onMounted(() => {
  nextTick(() => {
    initCompCallEvent(props, emits, formData);
  });
});
</script>
<style lang="scss" scoped>
:deep(.el-input-group__append) {
  padding: 0 20px !important;
}
</style>
