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
      :isDesign="context.attrs['isDesign']"
      :disabled="context.attrs['disabled']"
      :bareFlag="context.attrs['bareFlag']"
      :form-item="field"
      :parentField="parentField"
  >
    <el-input
        :fid="field.preps['name']"
        :size="context.attrs.formInfo?.size || field?.preps['size'] || 'default'"
        readonly
        @change="itemAction('change')"
        @input="itemAction('input')"
        @keydown.enter="itemAction('enter')"
        @focus="itemAction('focus')"
        @blur="itemAction('blur')"
        v-model="context.attrs['formData'][field.preps['name']]"
    >
      <template #append>
        <el-button
            icon="Clock"
            @click="open"
            :disabled="checkIsDisabled(context)"
        />
      </template>
    </el-input>
  </starhorse-form-item>
</template>
<script lang="ts">
import {defineComponent, onMounted, ref, shallowRef} from 'vue';
import Crontab from '@/components/cron/Crontab.vue';
import StarHorseDialog from '@/components/comp/StarHorseDialog.vue';
import {allAction, checkIsDisabled} from '@/components/formcomp/utils/ItemRelationEventUtils.ts';

export default defineComponent({
  components: {Crontab, StarHorseDialog},

  methods: {checkIsDisabled},
  setup(_props, context) {
    // console.log(context);
    // const emit = context.emit;
    const field = context.attrs['field'] as any;
    // let defaultExpress = useVModel(field, 'modelValue', emit);

    const parentField = context.attrs['parentField'];
    let cronDataValue = ref<any>('');
    let dataValue = ref<any>('');
    let formItem = shallowRef({label: 'input', required: false});
    let dataField = shallowRef('');
    let cronVisible = ref(false);
    const cronTabRef = ref();
    let actionName = shallowRef('change');
    const itemAction = (prep: any) => {
      allAction(context, prep);
    };
    const resetForm = () => {
      // context.attrs['formData'][field.preps['name']] = defaultExpress;
      if (cronTabRef.value) {
        cronTabRef.value.clearCron();
      }
    };
    const close = () => {
      cronVisible.value = false;
    };
    const open = () => {
      cronDataValue.value = context.attrs['formData'][field.preps['name']];
      console.log(cronDataValue.value);
      cronVisible.value = true;
    };
    const submit = () => {
      context.attrs['formData'][field.preps['name']] = cronDataValue.value;
      close();
    };
    resetForm();
    onMounted(() => {
      actionName.value = field.preps?.actionName || 'normal';
      if (!context.attrs['isSearch']) {
        allAction(context, actionName.value, true);
      }
    });
    return {
      parentField,
      context,
      field,
      formItem,
      dataField,
      itemAction,
      cronVisible,
      resetForm,
      close,
      submit,
      cronTabRef,
      actionName,
      dataValue,
      cronDataValue,
      open
    };
  }
});
</script>
<style lang="scss" scoped>
:deep(.el-input-group__append) {
  padding: 0 20px !important;
}
</style>
