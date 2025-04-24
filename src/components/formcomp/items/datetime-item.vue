<template>
  <starhorse-form-item
      :isDesign="context.attrs['isDesign']"
      :disabled="context.attrs['disabled']"
      :bareFlag="context.attrs['bareFlag']"
      :form-item="field"
      :parentField="parentField"
  >
    <el-date-picker
        :fid="field.preps['name']"
        :clear-icon="field.preps['clearIcon']"
        :clearable="field.preps['clearable'] == 'Y'"
        :default-time="field.preps['defaultTime']"
        :default-value="field.preps['defaultValue'] || new Date()"
        :disabled="checkIsDisabled(context)"
        :editable="field.preps['editable'] == 'Y'"
        :end-placeholder="field.preps['endPlaceholder'] || '请选择结束日期'"
        :format="field.preps['format'] || 'YYYY-MM-DD HH:mm:ss'"
        :value-format="field.preps['valueFormat']"
        date-format="YYYY-MM-DD"
        time-format="HH:mm"
        :type="field.preps['type']"
        :placeholder="field.preps['placeholder'] || '请选择' + field.preps['label']"
        :range-separator="field.preps['rangeSeparator']"
        :readonly="field.preps['readonly'] == 'Y'"
        :size="context.attrs.formInfo?.size || field?.preps['size'] || 'default'"
        :start-placeholder="field.preps['startPlaceholder'] || '请选择开始日期'"
        @change="itemAction('change')"
        @input="itemAction('input')"
        @keydown.enter="itemAction('enter')"
        @focus="itemAction('focus')"
        @blur="itemAction('blur')"
        v-model="context.attrs['formData'][field.preps['name']]"
    ></el-date-picker>
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
    let actionName = shallowRef("normal");
    const itemAction = (prep: any) => {
      if (prep == "change" && field.preps["type"]?.includes("range")) {
        let val = context.attrs["formData"][field.preps["name"]];
        // console.log(field.preps, val);
        if (field.preps["needSplitName"] == "Y") {
          context.attrs["formData"][field.preps["name"] + "Start"] = val[0];
          context.attrs["formData"][field.preps["name"] + "End"] = val[1];
        }
      }
      // console.log(context.attrs['formData']);
      allAction(context, prep);
    };
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
      itemAction,
      actionName
    };
  }
});
</script>
<style lang="scss" scoped>
:deep(.el-input) {
  width: unset !important;
}
</style>
