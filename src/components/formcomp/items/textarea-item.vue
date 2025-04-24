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
      :isDesign="context.attrs['isDesign']"
      :disabled="context.attrs['disabled']"
      :bareFlag="context.attrs['bareFlag']"
      :form-item="field"
      :parentField="parentField"
  >
    <el-input
        @dblclick="maxEdit"
        :fid="field.preps['name']"
        :clearable="field.preps['clearable'] == 'Y'"
        :disabled="checkIsDisabled(context)"
        :max="field.preps['max']"
        :maxlength="field.preps['maxlength']"
        :min="field.preps['min']"
        :minlength="field.preps['maxlength']"
        :placeholder="field.preps['placeholder'] || '请输入' + field.preps['label']"
        :readonly="field.preps['readonly'] == 'Y'"
        :rows="field.preps['rows']"
        :show-word-limit="field.preps['showWordLimit'] == 'Y'"
        :size="context.attrs.formInfo?.size || field?.preps['size'] || 'default'"
        type="textarea"
        :resize="field?.preps['resize'] || '--'"
        @change="itemAction('change')"
        @input="itemAction('input')"
        @keydown.enter="itemAction('enter')"
        @focus="itemAction('focus')"
        @blur="itemAction('blur')"
        v-model="context.attrs['formData'][field.preps['name']]"
    />
  </starhorse-form-item>
</template>
<script lang="ts">
import {defineComponent, onMounted, shallowRef} from "vue";
import {allAction, checkIsDisabled} from "@/components/formcomp/utils/ItemRelationEventUtils.ts";
import StarHorseDialog from "@/components/comp/StarHorseDialog.vue";

export default defineComponent({
  components: {StarHorseDialog},
  methods: {checkIsDisabled},
  setup(_props, context) {
    const parentField = context.attrs["parentField"];
    const field = context.attrs["field"] as any;
    let formItem = shallowRef({label: "input", required: false});
    let dataField = shallowRef("");
    const editorDialogVisible = shallowRef(false);
    const dynamicFunction = (data: any) => {
      if (!data) {
        return;
      }
      let fun = new Function(data);
      fun();
    };
    let actionName = shallowRef("normal");
    const itemAction = (prep: any) => {
      allAction(context, prep);
    };
    const maxEdit = () => {
      if (!context.attrs['formData']['_' + field.preps['name'] + 'Editable'] && field.preps['disabled'] == 'Y') {
        return;
      }
      dataField.value = context.attrs['formData'][field.preps['name']];
      editorDialogVisible.value = true;
    }
    const dataMerge = () => {
      context.attrs['formData'][field.preps['name']] = dataField.value;
    }
    onMounted(() => {
      actionName.value = field.preps?.actionName || "normal";
      if (!context.attrs["isSearch"]) {
        allAction(context, actionName.value, true);
      }
    });
    return {
      parentField,
      context,
      field,
      formItem,
      dataField,
      dynamicFunction,
      itemAction,
      actionName,
      editorDialogVisible,
      dataMerge,
      maxEdit
    };
  }
});
</script>
<style scoped></style>
