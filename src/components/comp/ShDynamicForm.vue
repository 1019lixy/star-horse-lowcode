<script setup lang="ts" name="ShDynamicForm">
import { inject, PropType, ref, ShallowReactive, watch } from 'vue';
import { ApiUrls } from '@/components/types/ApiUrls';
import { error, success, warning } from '@/utils/message';
import { postRequest } from '@/api/star_horse_apis';
import { closeLoad, load, loadById } from '@/api/star_horse_utils';
import { DialogProps } from '@/components/types/DialogProps';
import { compKey, itemCheck } from "@/api/system";

const props = defineProps({
  compUrl: { type: Object as PropType<ApiUrls>, required: true },
  fieldList: { type: Object as PropType<any>, required: true },
  formInfo: { type: Object as PropType<any>, required: true },
  rules: { type: Object },
  typeModel: { type: String, default: 'normal' }
});
const emits = defineEmits(['refresh']);
const starHorseFormRef = ref();
const dataForm = ref<any>({});
const closeDialog = inject('closeDialog') as Function;
const dialogOperation = inject('dialogOperation') as ShallowReactive<any>;
const dialogProps = inject<DialogProps>('dialogProps', {});

const assignDefault = () => {
  dataForm.value = {};
};
const loadData = async () => {
  dataForm.value = await loadById(props.compUrl!.loadByIdUrl!, dialogProps.ids);
  //解决关闭并再次打开不触发watch监听
  dialogProps.ids = -2;
};
const merge = (_type: string) => {
  starHorseFormRef.value.validate((result: boolean) => {
    if (!result) {
      return;
    }
    doMerge();
  });
};
const mergeDraft = (type: string) => {
  console.log('mergeDraft', type);
  doMerge();
};
const doMerge = () => {
  load('数据处理中');
  postRequest(props.compUrl.mergeUrl!, dataForm.value)
    .then((res) => {
      closeLoad();
      if (res.data.code != 0) {
        warning(res.data.cnMessage);
        return;
      } else {
        success(res.data.cnMessage);
      }
      emits('refresh');
      resetForm();
      closeDialog();
      //关闭弹窗
    })
    .catch((err) => {
      error('接口调用异常' + err);
    })
    .finally(() => {
      closeLoad();
    });
};
const resetForm = () => {
  assignDefault();
};
watch(
  () => dialogOperation,
  (val: any) => {
    if (val['funcName'] == 'merge') {
      merge(val['type']);
    } else if (val['funcName'] == 'mergeDraft') {
      mergeDraft(val['type']);
    } else if (val['funcName'] == 'resetForm') {
      resetForm();
    }
    //为了触发多次点击响应
    dialogOperation['funcName'] = '';
    dialogOperation['type'] = '';
  },
  {
    immediate: false,
    deep: true
  }
);
watch(
  () => dialogProps.ids,
  (val) => {
    if (val == -2) {
    } else if (!val || val == -1) {
      assignDefault();
    } else {
      loadData();
    }
  },
  {
    immediate: true
  }
);

defineExpose({
  merge,
  mergeDraft,
  resetForm,
  assignDefault
});
</script>

<template>
  <el-form :model="dataForm" :rules="rules" class="data-form" ref="starHorseFormRef"
    :disabled="formInfo['disabled'] ?? false" :hide-required-asterisk="formInfo['hideRequiredAsterisk'] ?? false"
    :inline="formInfo.inline ?? false" :inline-message="formInfo['inlineMessage'] ?? false"
    :label-position="formInfo['labelPosition']" :label-suffix="formInfo['labelSuffix']"
    :label-width="formInfo['labelWidth']" :require-asterisk-position="formInfo['requireAsteriskPosition']"
    :scroll-to-error="formInfo['scrollToError'] ?? true" :show-message="formInfo['showMessage'] ?? true"
    :size="formInfo['size']" :status-icon="formInfo['statusIcon'] ?? true"
    :validate-on-rule-change="formInfo['validateOnRuleChange'] ?? true">
    <template v-for="(data, key) in fieldList" :key="compKey(data,key,false,'dyform')">
      <component :field="data" :formData="dataForm" :is="itemCheck(data)" />
    </template>
    <el-form-item v-if="typeModel == 'tab'">
      <el-button @click="merge" style="background: var(--star-horse-style); color: var(--star-horse-white)">
        <star-horse-icon icon-class="save" style="color: var(--star-horse-white)" />
        提交
      </el-button>
      <el-button @click="resetForm" link>
        <star-horse-icon icon-class="undo" />
        重置
      </el-button>
    </el-form-item>
  </el-form>
</template>
<style scoped></style>
