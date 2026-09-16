<script setup lang="ts">
import { allAction } from "@/components/formcomp/utils/ItemRelationEventUtils";

import { ItemPreps } from "@/components/types/ItemPreps";
import StarhorseFormItem from "@/components/formcomp/items/starhorse-form-item.vue";
import { computed } from "vue";
import JSON5 from "json5";

const props = withDefaults(defineProps<ItemPreps>(), {
  isDesign: false,
  disabled: false,
  showFormItem: false,
  bareFlag: false,
  isSearch: false,
});
const styles = computed(() => {
  const style = props.field.preps?.styles;
  if (!style) return {};
  if (typeof style == "string") {
    return JSON5.parse(style);
  }
  return style;
});
const emits = defineEmits(["userAction", "selectItem"]);
const formData = defineModel<any>("formData");
const itemAction = (prep: any) => {
  allAction(props, emits, formData, prep);
};
</script>
<template>
  <starhorse-form-item
    :showFormItem="showFormItem"
    :isDesign="isDesign"
    :disabled="disabled"
    :bareFlag="bareFlag"
    :field="field"
    :parentField="parentField"
  >
    <div class="h-full w-full" @click="itemAction('click')">
      <div class="user_html" :style="styles">
        {{
          field.preps?.staticData
            ? field.preps?.textContent
            : formData[field.fieldName]
        }}
      </div>
    </div>
  </starhorse-form-item>
</template>
<style lang="scss" scoped></style>
