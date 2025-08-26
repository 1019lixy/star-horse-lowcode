<template>
  <EditDataDialog
    v-model="dialogInputVisible"
    :disabled="checkIsDisabled(props)"
    :initial-content="String(formData[field.fieldName])"
    @confirm="handleContentConfirm"
  />
  <starhorse-form-item
    :showFormItem="showFormItem"
    :isDesign="isDesign"
    :disabled="disabled"
    :bareFlag="bareFlag"
    :field="field"
    :parentField="parentField"
  >
    <el-input
      :disabled="checkIsDisabled(props)"
      v-bind="prepsFilter(field.preps)"
      type="text"
      ref="inputItemRef"
      :fid="field.fieldName"
      class="input-with-select"
      v-on="getDynamicEvents(props, itemAction)"
      @dblclick="editContent"
      v-model="formData[field.fieldName]"
    >
      <template #prepend v-if="field.preps?.prependText">
        {{ field.preps?.prependText }}
      </template>
      <template #prepend v-if="field.preps?.prependList">
        <el-select v-model="formData[preName]">
          <el-option
            v-for="item in field.preps?.prependList"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
      </template>
      <template #append v-if="field.preps?.appendText">
        {{ field.preps?.appendText }}
      </template>
      <template #append v-if="field.preps?.appendAction">
        <star-horse-icon
          :title="field.preps?.appendAction?.actionTitle"
          style="cursor: pointer"
          :icon-class="field.preps?.appendAction?.icon || 'document'"
          @click="field.preps?.appendAction?.actions?.(formData)"
        />
      </template>
      <template #append v-if="field.preps?.appendList">
        <el-select v-model="formData[appName]">
          <el-option
            v-for="item in field.preps?.appendList"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
      </template>
    </el-input>
  </starhorse-form-item>
</template>
<script setup lang="ts">
import { getDynamicEvents } from "@/api/system";
import {
  allAction,
  checkIsDisabled,
  initCompCallEvent,
  prepsFilter,
} from "@/components/formcomp/utils/ItemRelationEventUtils";
import { ItemPreps } from "@/components/types/ItemPreps";
import { computed, nextTick, onMounted, ref } from "vue";

defineOptions({
  name: "InputItem",
});
const props = defineProps<ItemPreps>();
const emits = defineEmits(["selfFunc", "selectItem"]);
const formData = defineModel("formData");
const inputItemRef = ref();
const dialogInputVisible = ref<boolean>(false);
const initEvent = async () => {
  await nextTick();
};
const preName = computed(() => {
  return props.field?.preps.preName ?? "pre" + props.field.fieldName;
});
const appName = computed(() => {
  return props.field?.preps.appName ?? "app" + props.field.fieldName;
});
const itemAction = (prep: any) => {
  allAction(props, emits, formData, prep);
};
const handleContentConfirm = (newContent: string) => {
  formData.value[props.field.fieldName] = newContent;
  dialogInputVisible.value = false;
};
const editContent = () => {
  dialogInputVisible.value = true;
};
onMounted(() => {
  nextTick(() => {
    initCompCallEvent(props, emits, formData);
  });
  initEvent();
});
</script>
<style lang="scss" scoped>
.input-with-select .el-input-group__prepend,
.input-with-select .el-input-group__append {
  background-color: var(--el-fill-color-blank);
}

:deep {
  .el-input-group__prepend,
  .el-input-group__append {
    min-width: 30%;
    max-width: 100px;
    padding: 0;
  }
}
</style>
