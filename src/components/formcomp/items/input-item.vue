<template>
  <starhorse-form-item
      :isDesign="isDesign"
      :disabled="disabled"
      :bareFlag="bareFlag"
      :formItem="field"
      :parentField="parentField"
  >
    <el-input
        :clearable="field.preps['clearable'] == 'Y'"
        :disabled="checkIsDisabled(props)"
        :max="field.preps['max']"
        :maxlength="field.preps['maxlength']"
        :min="field.preps['min']"
        :autofocus="field.preps['autofocus'] == 'Y'"
        :minlength="field.preps['maxlength']"
        :placeholder="field.preps['placeholder'] || '请输入' + (field.preps['label'] || '')"
        :readonly="field.preps['readonly'] == 'Y'"
        :size="formInfo?.size || field?.preps['size'] || 'default'"
        type="text"
        ref="inputItemRef"
        :fid="field.preps['name']"
        class="input-with-select"
        @change="itemAction('change')"
        @input="itemAction('input')"
        @keydown.enter="itemAction('enter')"
        @focus="itemAction('focus')"
        @blur="itemAction('blur')"
        v-model="formData[field.preps['name']]"
    >
      <template #prepend v-if="field.preps['prependText']">
        {{ field.preps["prependText"] }}
      </template>
      <template #prepend v-if="field.preps['prependList']">
        <el-select v-model="formData['pre' + field.preps['name']]">
          <el-option
              v-for="item in field.preps['prependList']"
              :key="item.value"
              :label="item.name"
              :value="item.value"
          />
        </el-select>
      </template>
      <template #append v-if="field.preps['appendText']">
        {{ field.preps["appendText"] }}
      </template>
      <template #append v-if="field.preps['appendAction']">
        <star-horse-icon
            :title="field.preps['appendAction'].actionTitle"
            style="cursor: pointer"
            :icon-class="field.preps['appendAction'].icon || 'document'"
            @click="field.preps['appendAction'].actions(formData)"
        />
      </template>
      <template #append v-if="field.preps['appendList']">
        <el-select v-model="formData['app' + field.preps['name']]">
          <el-option
              v-for="item in field.preps['appendList']"
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
import {allAction, checkIsDisabled} from '@/components/formcomp/utils/ItemRelationEventUtils.ts';

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
const initEvent = async () => {
  await nextTick();
};
const itemAction = (prep: any) => {
  allAction(props, emits, formData, prep);
};
onMounted(() => {
  actionName.value = props.field.preps?.actionName || 'normal';
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
