<template>
  <starhorse-form-item
      :isDesign="context.attrs['isDesign']"
      :disabled="context.attrs['disabled']"
      :bareFlag="context.attrs['bareFlag']"
      :form-item="field"
      :parentField="parentField"
  >
    <el-slider
        :fid="field.preps['name']"
        :disabled="checkIsDisabled(context)"
        :format-tooltip="field.preps['formatTooltip'] == 'Y'"
        :format-value-text="field.preps['formatValueText']"
        :height="field.preps['height']"
        :input-size="field.preps['inputSize']"
        :aria-label="field.preps['label']"
        :marks="field.preps['marks']"
        :max="field.preps['max']"
        :min="field.preps['min']"
        :range="field.preps['range'] == 'Y'"
        :range-end-label="field.preps['rangeEndLabel']"
        :range-start-label="field.preps['rangeStartLabel']"
        :show-input="field.preps['showInput'] == 'Y'"
        :show-input-controls="field.preps['showInputControls'] == 'Y'"
        :show-stops="field.preps['showStops'] == 'Y'"
        :show-tooltip="field.preps['showTooltip'] == 'Y'"
        :size="context.attrs.formInfo?.size || field?.preps['size'] || 'default'"
        :step="field.preps['step']"
        @change="itemAction"
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
    const itemAction = () => {
      allAction(context, "change");
    };
    onMounted(() => {
      allAction(context, "change", true);
    });
    return {parentField, context, field, formItem, dataField, itemAction};
  }
});
</script>
<style scoped></style>
