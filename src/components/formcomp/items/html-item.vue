<template>
  <starhorse-form-item
      :isDesign="context.attrs['isDesign']"
      :disabled="context.attrs['disabled']"
      :bareFlag="context.attrs['bareFlag']"
      :formItem="field"
      :parentField="parentField"
  >
    <div class="user_html" v-html="field.preps['content']"/>
  </starhorse-form-item>
</template>
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
    context.attrs["formData"][field.preps["name"]] = field.preps["content"];
    const itemAction = (prep: any) => {
      allAction(context, prep);
    };
    return {parentField, context, field, formItem, dataField, itemAction};
  }
});
</script>
<style lang="scss" scoped>
.user_html {
  width: 100%;
  min-height: 30px;
  height: auto;
}
</style>
