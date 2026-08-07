<script setup lang="ts" name="EmailVariableDialog">
import {computed, ref, watch} from "vue";
import {i18n} from "@/lang";
import StarHorseDialog from "@/components/comp/StarHorseDialog.vue";
import type {EmailTemplateDesigner} from "../composables/useEmailTemplateDesigner";
import {createEmailVariable} from "../constants";
import type {EmailVariable} from "../types";

const props = defineProps<{
  visible: boolean;
  designer: EmailTemplateDesigner;
  varId?: string | null;
}>();

const emit = defineEmits<{
  (e: "update:visible", v: boolean): void;
}>();

const innerVisible = computed({
  get: () => props.visible,
  set: (v) => emit("update:visible", v),
});

const form = ref<EmailVariable>(createEmailVariable());
const isNew = ref(true);

watch(
    () => [props.visible, props.varId] as const,
    ([visible]) => {
      if (!visible) return;
      if (props.varId) {
        const v = props.designer.state.variables.find((vv) => vv.id === props.varId);
        if (v) {
          form.value = {...v};
          isNew.value = false;
          return;
        }
      }
      form.value = createEmailVariable();
      isNew.value = true;
    },
    {immediate: true},
);

const handleSubmit = () => {
  if (!form.value.name) return;
  if (isNew.value) {
    props.designer.addVariable(form.value);
  } else {
    props.designer.updateVariable(form.value.id, form.value);
  }
  innerVisible.value = false;
};
</script>

<template>
  <star-horse-dialog
      v-model="innerVisible"
      :title="isNew ? i18n('emailtemplate.dialog.addVar') : i18n('emailtemplate.dialog.editVar')"
      box-width="480px"
      :self-func="true"
      @merge="handleSubmit"
  >
    <el-form :model="form" label-width="100px" size="default">
      <el-form-item :label="i18n('emailtemplate.variable.name')">
        <el-input
            v-model="form.name"
            :disabled="!isNew"
            :placeholder="i18n('emailtemplate.variable.namePlaceholder')"
        />
      </el-form-item>
      <el-form-item :label="i18n('emailtemplate.variable.label')">
        <el-input v-model="form.label"/>
      </el-form-item>
      <el-form-item :label="i18n('emailtemplate.variable.defaultValue')">
        <el-input v-model="form.defaultValue"/>
      </el-form-item>
      <el-form-item :label="i18n('emailtemplate.variable.description')">
        <el-input v-model="form.description" type="textarea" :rows="2"/>
      </el-form-item>
    </el-form>
  </star-horse-dialog>
</template>
