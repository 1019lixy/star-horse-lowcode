<template>
  <starhorse-form-item
      :showFormItem="showFormItem"
      :isDesign="isDesign"
      :disabled="disabled"
      :bareFlag="bareFlag"
      :field="field"
      :parentField="parentField"
  >
    <div class="location-wrapper w-full">
      <el-input
          v-model="formData[field.fieldName]"
          :disabled="checkIsDisabled(props)"
          v-bind="prepsFilter(field.preps)"
          :placeholder="field.preps?.placeholder"
          readonly
          @click="openMap"
      >
        <template #prefix>
          <el-icon>
            <Location/>
          </el-icon>
        </template>
      </el-input>
    </div>
  </starhorse-form-item>
</template>
<script setup lang="ts">
import {allAction, checkIsDisabled, prepsFilter,} from "@/components/formcomp/utils/ItemRelationEventUtils";
import {ItemPreps} from "@/components/types/ItemPreps";
import {Location} from "@element-plus/icons-vue";

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

const openMap = () => {
  if (checkIsDisabled(props)) return;
  // 地图选点由宿主应用通过 preps.mapClick 回调实现
  if (typeof props.field.preps?.mapClick === "function") {
    props.field.preps.mapClick(formData.value?.[props.field.fieldName], (result: any) => {
      if (result) {
        formData.value[props.field.fieldName] = typeof result === "string" ? result : `${result.lng},${result.lat}`;
        itemAction("change");
      }
    });
  }
};
</script>
<style lang="scss" scoped>
.location-wrapper {
  :deep(.el-input__wrapper) {
    cursor: pointer;
  }
}
</style>
