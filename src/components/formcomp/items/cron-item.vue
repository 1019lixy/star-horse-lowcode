<template>
  <star-horse-dialog
      :title="'Crontab 配置器'"
      box-width="45%"
      :self-func="true"
      @resetForm="resetForm"
      @closeAction="close"
      @merge="submit"
      :dialog-visible="cronVisible"
  >
    <Crontab ref="cronTabRef" v-model="cronDataValue"/>
  </star-horse-dialog>
  <starhorse-form-item
      :isDesign="isDesign"
      :disabled="disabled"
      :bareFlag="bareFlag"
      :formItem="field"
      :parentField="parentField"
  >
    <el-input
        :fid="field.preps['name']"
        :size="formInfo?.size || field?.preps['size'] || 'default'"
        readonly
        @change="itemAction('change')"
        @input="itemAction('input')"
        @keydown.enter="itemAction('enter')"
        @focus="itemAction('focus')"
        @blur="itemAction('blur')"
        v-model="formData[field.preps['name']]"
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
import {onMounted, ref, shallowRef} from 'vue';
import Crontab from '@/components/cron/Crontab.vue';
import StarHorseDialog from '@/components/comp/StarHorseDialog.vue';
import {allAction, checkIsDisabled} from '@/components/formcomp/utils/ItemRelationEventUtils.ts';


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


let cronDataValue = ref<any>('');
let cronVisible = ref(false);
const cronTabRef = ref();
let actionName = shallowRef('change');
const itemAction = (prep: any) => {
  allAction(props, emits, formData, prep);
};
const resetForm = () => {
  // formData[field.preps['name']] = defaultExpress;
  if (cronTabRef.value) {
    cronTabRef.value.clearCron();
  }
};
const close = () => {
  cronVisible.value = false;
};
const open = () => {
  cronDataValue.value = formData[props.field.preps['name']];
  console.log(cronDataValue.value);
  cronVisible.value = true;
};
const submit = () => {
  formData[props.field.preps['name']] = cronDataValue.value;
  close();
};
resetForm();
onMounted(() => {
  actionName.value = props.field.preps?.actionName || 'normal';
  if (!props.isSearch) {
    allAction(props, emits, formData, actionName.value, true);
  }
});

</script>
<style lang="scss" scoped>
:deep(.el-input-group__append) {
  padding: 0 20px !important;
}
</style>
