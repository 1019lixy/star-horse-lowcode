<template>
  <starhorse-form-item
    :isDesign="context.attrs['isDesign']"
    :bareFlag="context.attrs['bareFlag']"
    :form-item="field"
    :parentField="parentField"
  >
    <el-color-picker
      :fid="field.preps['name']"
      :color-format="field.preps['colorFormat']"
      :disabled="!context.attrs['formData']['_' + field.preps['name'] + 'Editable'] && field.preps['disabled'] == 'Y'"
      :show-alpha="field.preps['showAlpha'] == 'Y'"
      :size="context.attrs.formInfo?.size || field?.preps['size'] || 'default'"
      @change="itemAction('change')"
      @keydown.enter="itemAction('enter')"
      @focus="itemAction('focus')"
      @blur="itemAction('blur')"
      v-model="context.attrs['formData'][field.preps['name']]"
    />
  </starhorse-form-item>
</template>
<script lang="ts">
  import { defineComponent, onMounted, shallowRef } from "vue";
  import { allAction } from "@/components/formcomp/utils/ItemRelationEventUtils.ts";

  export default defineComponent({
    setup(_props, context) {
      const parentField = context.attrs["parentField"];
      const field = context.attrs["field"] as any;
      let formItem = shallowRef({ label: "input", required: false });
      let dataField = shallowRef("");
      let actionName = shallowRef("change");
      const itemAction = (prep: any) => {
        allAction(context, prep);
      };
      onMounted(() => {
        actionName.value = field.preps?.actionName || "normal";
        if (!context.attrs["isSearch"]) {
          allAction(context, actionName.value, true);
        }
      });
      return { parentField, context, field, formItem, dataField, itemAction, actionName };
    }
  });
</script>
<style scoped></style>
