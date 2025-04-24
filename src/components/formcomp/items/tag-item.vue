<script lang="ts">
import {defineComponent, shallowRef} from "vue";
import {allAction, checkIsDisabled} from "@/components/formcomp/utils/ItemRelationEventUtils.ts";

export default defineComponent({
  methods: {checkIsDisabled},
  setup(_props, context) {
    const parentField = context.attrs["parentField"];
    const field = context.attrs["field"] as any;
    let formItem = shallowRef({label: "input", required: false});
    let dataField = shallowRef("");
    const itemAction = (prep: any) => {
      allAction(context, prep);
    };
    const tagType = (val: any) => {
      let tagMap = field?.preps?.tagMap;
      if (tagMap && Object.keys(tagMap).length > 0) {
        return tagMap[val] || "primary";
      }
      return field?.preps?.tagType || "primary";
    };
    return {parentField, context, field, formItem, dataField, itemAction, tagType};
  }
});
</script>
<template>
  <starhorse-form-item
      :isDesign="context.attrs['isDesign']"
      :disabled="context.attrs['disabled']"
      :bareFlag="context.attrs['bareFlag']"
      :formItem="field"
      :parentField="parentField"
  >
    <el-tag
        :type="tagType(context.attrs['formData'][field.preps['name']])"
        :disable-transitions="field?.preps?.disableTransitions == 'Y'"
        :hit="field?.preps?.hit == 'Y'"
        :color="field?.preps?.color"
        :effect="field?.preps?.effect || 'light'"
        :round="field?.preps?.round == 'Y'"
        :size="context.attrs.formInfo?.size || field?.preps?.size || 'default'"
        @click="itemAction('click')"
    >
      {{
        (context.attrs["callBack"] && context.attrs["callBack"]()) ||
        context.attrs["formData"][field.preps["name"]] ||
        field.preps["placeholder"] ||
        "请赋值" + field.preps["label"]
      }}
    </el-tag>
  </starhorse-form-item>
</template>
<style lang="scss" scoped>
</style>
