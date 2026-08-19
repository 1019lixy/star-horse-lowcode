<template>
  <starhorse-form-item
    :showFormItem="showFormItem"
    :isDesign="isDesign"
    :disabled="disabled"
    :bareFlag="bareFlag"
    :field="field"
    :parentField="parentField"
  >
    <el-divider
      :direction="field.preps?.direction || 'horizontal'"
      v-on="getDynamicEvents(props, itemAction, formData)"
      :content-position="field.preps?.contentPosition || 'center'"
    >
      {{ field.preps?.content }}
    </el-divider>
  </starhorse-form-item>
</template>
<script setup lang="ts">
import { onMounted } from "vue";
import { allAction } from "@/components/formcomp/utils/ItemRelationEventUtils";
import { getDynamicEvents } from "@/api/system";

import { ItemPreps } from "@/components/types/ItemPreps";

const props = withDefaults(defineProps<ItemPreps>(), {
  isDesign: false,
  disabled: false,
  showFormItem: false,
  bareFlag: false,
  isSearch: false,
});
const emits = defineEmits(["selfFunc", "selectItem"]);
const formData = defineModel("formData");

const itemAction = (prep: any) => {
  allAction(props, emits, formData, prep);
};
onMounted(() => {
  formData.value[props.field.fieldName] = props.field.preps?.content;
});
</script>
<style scoped></style>
