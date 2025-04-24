<template>
  <starhorse-form-item
      :isDesign="context.attrs['isDesign']"
      :disabled="context.attrs['disabled']"
      :bareFlag="context.attrs['bareFlag']"
      :formItem="field"
      :parentField="parentField"
  >
    <el-input
        :clearable="field.preps['clearable'] == 'Y'"
        :disabled="checkIsDisabled(context)"
        :max="field.preps['max']"
        :maxlength="field.preps['maxlength']"
        :min="field.preps['min']"
        :autofocus="field.preps['autofocus'] == 'Y'"
        :minlength="field.preps['maxlength']"
        :placeholder="field.preps['placeholder'] || '请输入' + (field.preps['label'] || '')"
        :readonly="field.preps['readonly'] == 'Y'"
        :size="context.attrs.formInfo?.size || field?.preps['size'] || 'default'"
        type="text"
        ref="inputItemRef"
        :fid="field.preps['name']"
        class="input-with-select"
        @change="itemAction('change')"
        @input="itemAction('input')"
        @keydown.enter="itemAction('enter')"
        @focus="itemAction('focus')"
        @blur="itemAction('blur')"
        v-model="context.attrs['formData'][field.preps['name']]"
    >
      <template #prepend v-if="field.preps['prependText']">
        {{ field.preps["prependText"] }}
      </template>
      <template #prepend v-if="field.preps['prependList']">
        <el-select v-model="context.attrs['formData']['pre' + field.preps['name']]">
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
            @click="field.preps['appendAction'].actions(context.attrs['formData'])"
        />
      </template>
      <template #append v-if="field.preps['appendList']">
        <el-select v-model="context.attrs['formData']['app' + field.preps['name']]">
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
<script lang="ts">
import {defineComponent, nextTick, onMounted, shallowRef, ref} from 'vue';
import StarHorseIcon from '@/components/comp/StarHorseIcon.vue';
import {allAction, checkIsDisabled} from '@/components/formcomp/utils/ItemRelationEventUtils.ts';

export default defineComponent({
  components: {StarHorseIcon},
  emits: ['selectItem', 'selfFunc'],
  methods: {checkIsDisabled},
  setup(_props, context) {
    const parentField = context.attrs['parentField'];
    // const formData = context.attrs["formData"];
    const field = context.attrs['field'] as any;
    let formItem = shallowRef({label: 'input', required: false});
    let dataField = shallowRef('');
    let preSelect = shallowRef('');
    let appSelect = shallowRef('');
    const inputItemRef = ref();
    let actionName = shallowRef('normal');
    const dynamicFunction = (_funcName: string, data: any) => {
      if (!data) {
        return;
      }
      try {
        let fun = new Function(data);
        fun.call(this);
      } catch (e) {
        console.error(e);
      }
    };
    const initEvent = async () => {
      await nextTick();
    };
    const itemAction = (prep: any) => {
      allAction(context, prep);
    };
    onMounted(() => {
      actionName.value = field.preps?.actionName || 'normal';
      if (!context.attrs['isSearch']) {
        allAction(context, actionName.value, true);
      }
      initEvent();
    });
    return {
      parentField,
      context,
      field,
      formItem,
      inputItemRef,
      dataField,
      dynamicFunction,
      itemAction,
      actionName,
      preSelect,
      appSelect
    };
  }
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
