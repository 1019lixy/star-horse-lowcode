<script setup lang="ts" name="PivotFieldDialog">
import { computed, ref, watch } from "vue";
import { i18n } from "@/lang";
import type { PivotDesigner } from "../composables/usePivotDesigner";
import {
  createField,
  PIVOT_AGGREGATION_PRESETS,
  PIVOT_FIELD_TYPE_PRESETS,
} from "../constants";
import type { PivotField } from "../types";
import { StarHorsePanel } from "@/components/comp";

const props = defineProps<{
  visible: boolean;
  designer: PivotDesigner;
  fieldName?: string | null;
  dialogType?: "dialog" | "drawer";
}>();

const emit = defineEmits<{
  (e: "update:visible", v: boolean): void;
}>();

const innerVisible = computed({
  get: () => props.visible,
  set: (v) => emit("update:visible", v),
});

const form = ref<PivotField>(createField());
const isNew = ref(true);

watch(
  () => [props.visible, props.fieldName] as const,
  ([visible]) => {
    if (!visible) return;
    if (props.fieldName) {
      const field = props.designer.state.fields.find(
        (f) => f.name === props.fieldName,
      );
      if (field) {
        form.value = { ...field };
        isNew.value = false;
        return;
      }
    }
    form.value = createField();
    isNew.value = true;
  },
  { immediate: true },
);

const handleSubmit = () => {
  if (isNew.value) {
    props.designer.addField(form.value);
  } else {
    props.designer.updateField(form.value.name, form.value);
  }
  innerVisible.value = false;
};
</script>

<template>
  <star-horse-panel
    :type="dialogType"
    v-model="innerVisible"
    :title="
      isNew ? i18n('pivot.dialog.addField') : i18n('pivot.dialog.editField')
    "
    box-width="500px"
    :userAction="true"
    @merge="handleSubmit"
  >
    <el-form :model="form" label-width="100px" size="default">
      <el-form-item :label="i18n('pivot.field.name')">
        <el-input v-model="form.name" :disabled="!isNew" />
      </el-form-item>
      <el-form-item :label="i18n('pivot.field.label')">
        <el-input v-model="form.label" />
      </el-form-item>
      <el-form-item :label="i18n('pivot.field.type')">
        <el-select v-model="form.type" style="width: 100%">
          <el-option
            v-for="opt in PIVOT_FIELD_TYPE_PRESETS"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        :label="i18n('pivot.field.aggregation')"
        v-if="form.type === 'number'"
      >
        <el-select v-model="form.aggregation" style="width: 100%">
          <el-option
            v-for="opt in PIVOT_AGGREGATION_PRESETS"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="i18n('pivot.field.format')">
        <el-input
          v-model="form.format"
          :placeholder="i18n('pivot.field.formatPlaceholder')"
        />
      </el-form-item>
    </el-form>
  </star-horse-panel>
</template>
