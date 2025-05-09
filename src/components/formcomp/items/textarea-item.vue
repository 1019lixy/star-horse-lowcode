<template>
  <star-horse-dialog
      :selfFunc="true"
      :dialogVisible="editorDialogVisible"
      title="编辑数据"
      :box-width="'50%'"
      @merge="dataMerge"
      @resetForm="dataField=''"
      :hideFullScreenIcon="true"
      @closeAction="editorDialogVisible=false"
  >
    <el-input
        :clearable="field.preps['clearable'] == 'Y'"
        :max="field.preps['max']"
        :maxlength="field.preps['maxlength']"
        :min="field.preps['min']"
        :minlength="field.preps['maxlength']"
        :placeholder="field.preps['placeholder'] || '请输入' + field.preps['label']"
        :readonly="field.preps['readonly'] == 'Y'"
        rows="20"
        show-word-limit
        resize="both"
        type="textarea"
        v-model="dataField"
    />
  </star-horse-dialog>
  <starhorse-form-item
      :isDesign="isDesign"
      :disabled="disabled"
      :bareFlag="bareFlag"
      :formItem="field"
      :parentField="parentField"
  >
    <el-input
        @dblclick="maxEdit"
        :fid="field.preps['name']"
        :clearable="field.preps['clearable'] == 'Y'"
        :disabled="checkIsDisabled(props)"
        :max="field.preps['max']"
        :maxlength="field.preps['maxlength']"
        :min="field.preps['min']"
        :minlength="field.preps['maxlength']"
        :placeholder="field.preps['placeholder'] || '请输入' + field.preps['label']"
        :readonly="field.preps['readonly'] == 'Y'"
        :rows="field.preps['rows']"
        :show-word-limit="field.preps['showWordLimit'] == 'Y'"
        :size="formInfo?.size || field?.preps['size'] || 'default'"
        type="textarea"
        :resize="field?.preps['resize'] || '--'"
        @change="itemAction('change')"
        @input="itemAction('input')"
        @keydown.enter="itemAction('enter')"
        @focus="itemAction('focus')"
        @blur="itemAction('blur')"
        v-model="formData[field.preps['name']]"
    />
  </starhorse-form-item>
</template>
<script setup lang="ts">
import {onMounted, shallowRef} from 'vue';
import {allAction, checkIsDisabled} from '@/components/formcomp/utils/ItemRelationEventUtils.ts';
import StarHorseDialog from '@/components/comp/StarHorseDialog.vue';

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
const editorDialogVisible = shallowRef(false);
const dataField = shallowRef('');
const dynamicFunction = (data: any) => {
  if (!data) {
    return;
  }
  let fun = new Function(data);
  fun();
};
let actionName = shallowRef('normal');
const itemAction = (prep: any) => {
  allAction(props, emits, formData, prep);
};
const maxEdit = () => {
  if (!formData['_' + props.field.preps['name'] + 'Editable'] && props.field.preps['disabled'] == 'Y') {
    return;
  }
  dataField.value = formData[props.field.preps['name']];
  editorDialogVisible.value = true;
};
const dataMerge = () => {
  formData[props.field.preps['name']] = dataField.value;
};
onMounted(() => {
  actionName.value =props.field.preps?.actionName || 'normal';
  if (!props.isSearch) {
    allAction(props, emits, formData, actionName.value, true);
  }
});
</script>
<style scoped></style>
