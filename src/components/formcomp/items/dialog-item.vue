<script setup lang="ts">
import { onMounted, shallowRef } from "vue";
import {
  allAction,
  checkIsDisabled,
  convertData,
  prepsFilter,
} from "@/components/formcomp/utils/ItemRelationEventUtils";

import { ItemPreps } from "@/components/types/ItemPreps";
import {
  StarHorseDialog,
  StarHorseFormItem,
  StarHorseIcon,
} from "@/components/comp";
import StarhorseFormItem from "@/components/formcomp/items/starhorse-form-item.vue";
import { i18n } from "@/lang";

const props = withDefaults(defineProps<ItemPreps>(), {
  isDesign: false,
  disabled: false,
  showFormItem: false,
  bareFlag: false,
  isSearch: false,
});
const emits = defineEmits(["selfFunc", "selectItem"]);
const formData = defineModel("formData");
let dialogInputVisible = shallowRef(false);
const itemAction = (prep: any) => {
  allAction(props, emits, formData, prep);
};
const selectItem = (row: any) => {
  itemAction("merge");
  closeAction();
};
const closeAction = () => {
  dialogInputVisible.value = false;
};
const showVisible = () => {
  dialogInputVisible.value = true;
};

onMounted(() => {
  let fieldInfo = formData.value[props.field.fieldName];
  if (!fieldInfo) {
    formData.value[props.field.fieldName] = {};
  }
});
</script>
<template>
  <star-horse-dialog
    :title="field.label"
    :self-func="true"
    :boxHeight="field.preps?.boxHeight ?? '60%'"
    :boxWidth="field.preps?.boxWidth ?? '50%'"
    v-model="dialogInputVisible"
    @merge="selectItem"
    @closeAction="closeAction"
  >
    <div class="flex flex-col h-full overflow-hidden">
      <template v-if="field.preps?.compName || field.preps?.fieldList">
        <Component
          v-if="field.preps?.compName"
          :is="field.preps?.compName"
          v-bind="prepsFilter(convertData(field.preps?.params))"
          v-model="formData[field.fieldName]"
          v-model:dataForm="formData[field.fieldName]"
        />
        <template v-if="field.preps?.fieldList">
          <star-horse-form-item
            :field-list="{ fieldList: convertData(field.preps?.fieldList) }"
            :compSize="field.preps?.compSize ?? 'default'"
            v-bind="prepsFilter(convertData(field.preps?.params))"
            :source="1"
            v-model:dataForm="formData[field.fieldName]"
          />
        </template>
      </template>
      <el-empty v-else :description="i18n('item.noContentSet')" />
    </div>
  </star-horse-dialog>
  <starhorse-form-item
    :showFormItem="showFormItem"
    :isDesign="isDesign"
    :disabled="disabled"
    :bareFlag="bareFlag"
    :field="field"
    :parentField="parentField"
  >
    <el-button @click="showVisible" :disabled="checkIsDisabled(props)">
      <star-horse-icon icon-class="setting" />
      {{ field.label }}
    </el-button>
  </starhorse-form-item>
</template>
<style lang="scss" scoped>
.cell.el-tooltip {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
