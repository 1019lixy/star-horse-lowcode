<template>
  <star-horse-dialog
      :title="field.preps['label'] + 'JSON数组编辑'"
      :self-func="true"
      :dialog-visible="dialogInputVisible"
      @merge="selectItem"
      @resetForm="resetForm"
      @closeAction="closeAction"
  >
    <star-horse-json-editor v-if="field.preps['devType'] == 'Y'" v-model:modelValue="jsonArray" style="height: 100vh"/>
    <star-horse-form v-else :field-list="jsonTableField" ref="jsonFormRef"/>
  </star-horse-dialog>
  <starhorse-form-item
      :isDesign="isDesign"
      :disabled="disabled"
      :bareFlag="bareFlag"
      :formItem="field"
      :parentField="parentField"
  >
    <div class="json-comp">
      <div class="json-box">
        <el-input
            :fid="field.preps['name']"
            :clearable="field.preps['clearable'] == 'Y'"
            :disabled="checkIsDisabled(props)"
            :max="field.preps['max']"
            :maxlength="field.preps['maxlength']"
            :min="field.preps['min']"
            :minlength="field.preps['minlength']"
            :placeholder="field.preps['placeholder'] || '请输入' + field.preps['label']"
            :readonly="field.preps['readonly'] == 'Y'"
            :rows="field.preps['rows'] || 3"
            :show-word-limit="field.preps['showWordLimit'] == 'Y'"
            :size="formInfo?.size || field?.preps['size'] || 'default'"
            type="textarea"
            resize="none"
            @change="itemAction('change')"
            @input="itemAction('input')"
            @normal="itemAction('enter')"
            @focus="itemAction('focus')"
            @blur="itemAction('blur')"
            v-model="formData[field.preps['name']]"
        />
      </div>
      <div class="json-btn" @click="editJsonData" title="编辑数据">
        <star-horse-icon icon-class="edit" style="cursor: pointer"/>
      </div>
    </div>
  </starhorse-form-item>
</template>
<script setup lang="ts">
import {nextTick, onMounted, reactive, shallowRef} from 'vue';
import StarHorseIcon from '@/components/comp/StarHorseIcon.vue';
import {PageFieldInfo} from '@/components/types/PageFieldInfo';
import StarHorseForm from '@/components/comp/StarHorseForm.vue';
import {allAction, checkIsDisabled} from '@/components/formcomp/utils/ItemRelationEventUtils.ts';
import StarHorseJsonEditor from '@/components/comp/StarHorseJsonEditor.vue';

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
let dialogInputVisible = shallowRef<boolean>(false);
let jsonFormRef = shallowRef();
let jsonArray = shallowRef<Array<any>>([]);
let jsonTableField = reactive<PageFieldInfo>({
  batchFieldList: [
    {
      batchName: 'jsonDatas',
      fieldList: [
        {
          label: 'Name/名称',
          fieldName: 'name',
          type: 'input',
          required: true,
          formVisible: true
        },
        {
          label: 'Value/值',
          fieldName: 'value',
          type: 'input',
          required: true,
          formVisible: true
        }
      ]
    }
  ]
});
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
const editJsonData = async () => {
  let jsonStr = formData[props.field.preps['name']];
  let formData: any = {};
  if (jsonStr) {
    formData['jsonDatas'] = JSON.parse(jsonStr);
    jsonArray.value = formData['jsonDatas'];
  }
  dialogInputVisible.value = true;
  await nextTick();
  if (props.field.preps['devType'] != 'Y') {
    jsonFormRef.value.setFormData(formData);
  }
};
const selectItem = async () => {
  if (props.field.preps['devType'] == 'Y') {
    formData[props.field.preps['name']] = JSON.stringify(jsonArray.value, null, 4);
  } else {
    let flag = false;
    await jsonFormRef.value.$refs.starHorseFormRef.validate((res: boolean) => {
      flag = res;
    });
    if (!flag) {
      return;
    }
    let formData = jsonFormRef.value.getFormData().value;
    let dataList = formData['jsonDatas'];
    formData[props.field.preps['name']] = JSON.stringify(dataList, null, 4);
  }
  closeAction();
};
const resetForm = () => {
  jsonFormRef.value.setFormData({jsonDatas: [{}]});
};
const closeAction = () => {
  dialogInputVisible.value = false;
};
onMounted(() => {
  actionName.value = props.field.preps?.actionName || 'normal';
  if (!props.isSearch) {
    allAction(props, emits, formData, actionName.value, true);
  }
});
</script>
<style lang="scss" scoped>
.json-comp {
  width: 100%;
  display: flex;
  align-items: center;

  .json-box {
    flex: 1;
    margin-right: 5px;

    :deep(.el-input) {
      height: 60px !important;
    }
  }

  .json-btn {
    cursor: pointer;
    border: 1px solid var(--star-horse-style);
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
  }
}
</style>
