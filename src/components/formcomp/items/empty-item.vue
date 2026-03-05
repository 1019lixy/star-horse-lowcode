<template>
  <starhorse-form-item
      :showFormItem="showFormItem"
      :isDesign="isDesign"
      :disabled="disabled"
      :bareFlag="bareFlag"
      :field="field"
      :parentField="parentField"
  >
    <div class="empty_comp">
      <span class="empty_text">{{ i18n('form.empty') }}</span>
    </div>
  </starhorse-form-item>
</template>
<script setup lang="ts">
import {ItemPreps} from "@/components/types/ItemPreps";
import {i18n} from "@/lang";

withDefaults(defineProps<ItemPreps>(), {
  isDesign: false,
  disabled: false,
  showFormItem: false,
  bareFlag: false,
  isSearch: false,
});
const emits = defineEmits(["selfFunc", "selectItem"]);
</script>
<style scoped>
.empty_comp {
  width: 100%;
  height: 100%;
  min-height: 25px;
  background: linear-gradient(135deg, #f5f7fa 25%, transparent 25%) -10px 0,
  linear-gradient(225deg, #f5f7fa 25%, transparent 25%) -10px 0,
  linear-gradient(315deg, #f5f7fa 25%, transparent 25%),
  linear-gradient(45deg, #f5f7fa 25%, transparent 25%);
  background-size: 10px 10px;
  background-color: #f0f2f5;
  border: 2px dashed #c0c4cc;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty_text {
  color: #303133;
  font-size: 13px;
  font-weight: 500;
  pointer-events: none;
  padding: 2px 4px;
  border-radius: 3px;
  opacity: 0.5;
}
</style>
