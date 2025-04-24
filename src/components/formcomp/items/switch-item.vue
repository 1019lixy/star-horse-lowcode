<template>
  <starhorse-form-item
      :isDesign="context.attrs['isDesign']"
      :disabled="context.attrs['disabled']"
      :bareFlag="context.attrs['bareFlag']"
      :form-item="field"
      :parentField="parentField"
  >
    <el-switch
        :fid="field.preps['name']"
        :active-color="field.preps['activeColor']"
        :active-text="field.preps['activeText']"
        :active-value="field.preps['activeValue']"
        :before-change="field.preps['beforeChange']"
        :disabled="checkIsDisabled(context)"
        :inactive-color="field.preps['inactiveColor']"
        :inactive-text="field.preps['inactiveText']"
        :inactive-value="field.preps['inactiveValue']"
        :size="context.attrs.formInfo?.size || field?.preps['size'] || 'default'"
        :width="field.preps['width']"
        @change="itemAction('change')"
        v-model="context.attrs['formData'][field.preps['name']]"
    />
  </starhorse-form-item>
</template>
<script lang="ts">
import {defineComponent, onMounted, shallowRef} from "vue";
import {allAction, checkIsDisabled} from "@/components/formcomp/utils/ItemRelationEventUtils.ts";

export default defineComponent({
  methods: {checkIsDisabled},
  setup(_props, context) {
    const parentField = context.attrs["parentField"];

    const field = context.attrs["field"] as any;
    let formItem = shallowRef({label: "input", required: false});
    let dataField = shallowRef("");
    let actionName = shallowRef("change");
    const itemAction = (prep: any) => {
      allAction(context, prep);
    };
    onMounted(() => {
      actionName.value = field.preps?.actionName || "normal";
      if (!context.attrs["isSearch"]) {
        allAction(context, actionName.value, false);
      }
    });
    return {
      parentField,
      context,
      field,
      formItem,
      dataField,
      itemAction,
      actionName
    };
  }
});
</script>
<style scoped></style>
