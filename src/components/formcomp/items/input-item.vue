<template>
  <EditDataDialog
  v-model="dialogInputVisible"
  :disabled="checkIsDisabled(props)"
  :initial-content="formData[field.fieldName]"
  @confirm="handleContentConfirm"
/>
  <starhorse-form-item
      :isDesign="isDesign"
      :disabled="disabled"
      :bareFlag="bareFlag"
      :formItem="field"
      :parentField="parentField"
  >
    <el-input
        :disabled="checkIsDisabled(props)"
        v-bind="field.preps"
        type="text"
        ref="inputItemRef"
        :fid="field.fieldName"
        class="input-with-select"
        @change="itemAction('change')"
        @input="itemAction('input')"
        @keydown.enter="itemAction('enter')"
        @focus="itemAction('focus')"
        @blur="itemAction('blur')"
        @dblclick="editContent"
        v-model="formData[field.fieldName]"
    >
      <template #prepend v-if="field.preps?.prependText">
        {{ field.preps?.prependText }}
      </template>
      <template #prepend v-if="field.preps?.prependList">
        <el-select v-model="formData['pre' + field.fieldName]">
          <el-option
              v-for="item in field.preps?.prependList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
          />
        </el-select>
      </template>
      <template #append v-if="field.preps?.appendText">
        {{ field.preps?.appendText }}
      </template>
      <template #append v-if="field.preps?.appendAction">
        <star-horse-icon
            :title="field.preps?.appendAction?.actionTitle"
            style="cursor: pointer"
            :icon-class="field.preps?.appendAction?.icon || 'document'"
            @click="field.preps?.appendAction?.actions(formData)"
        />
      </template>
      <template #append v-if="field.preps?.appendList">
        <el-select v-model="formData['app' + field.fieldName]">
          <el-option
              v-for="item in field.preps?.appendList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
          />
        </el-select>
      </template>
    </el-input>
  </starhorse-form-item>
</template>
<script setup lang="ts">
import {nextTick, onMounted, ref, shallowRef} from 'vue';
import {allAction, checkIsDisabled} from '@/components/formcomp/utils/ItemRelationEventUtils';
import EditDataDialog from "@/components/formcomp/utils/EditDataDialog.vue";

defineOptions({
  name: 'InputItem'
})
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
const inputItemRef = ref();
let actionName = shallowRef('normal');
const dialogInputVisible=ref<boolean>(false);
const initEvent = async () => {
  await nextTick();
};
const itemAction = (prep: any) => {
  allAction(props, emits, formData, prep);
};
const handleContentConfirm=(newContent:string)=>{
  formData.value[props.field.fieldName]=newContent;
  dialogInputVisible.value=false;
}
const editContent=()=>{
  dialogInputVisible.value=true;
}
onMounted(() => {
  actionName.value = props.field.actionName || 'normal';
  if (!props.isSearch) {
    allAction(props, emits, formData, actionName.value, true);
  }
  initEvent();
});
</script>
<style lang="scss" scoped>
.input-with-select .el-input-group__prepend {
  background-color: var(--el-fill-color-blank);
}

:deep(.el-input-group__prepend) {
  min-width: 100px;
  padding: 0;
}
</style>
