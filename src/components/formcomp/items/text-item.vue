<script setup lang="ts">
import {allAction} from "@/components/formcomp/utils/ItemRelationEventUtils";

import {ItemPreps} from "@/components/types/ItemPreps";

const props = withDefaults(defineProps<ItemPreps>(), {
  isDesign: false,
  disabled: false,
  showFormItem: false,
  bareFlag: false,
  isSearch: false,
});
const emits = defineEmits(["selfFunc", "selectItem"]);
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
      <div
          class="flex"
          :style="field.preps?.styles??{
          verticalAlign:  'middle',
          justifyContent: 'left',
          alignItems:  'left',
          wordBreak: 'normal',
          width:  '100%',
          height:  '100%',
          fontWeight:  '600',
          margin: ' 0 5px',
        }"
      >
        {{ field.preps?.textContent || field.preps?.placeholder }}
      </div>
    </div>
  </starhorse-form-item>
</template>
<style lang="scss" scoped></style>
