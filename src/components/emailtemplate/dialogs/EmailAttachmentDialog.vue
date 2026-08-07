<script setup lang="ts" name="EmailAttachmentDialog">
import {computed, ref, watch} from "vue";
import {i18n} from "@/lang";
import StarHorseDialog from "@/components/comp/StarHorseDialog.vue";
import type {EmailTemplateDesigner} from "../composables/useEmailTemplateDesigner";

const props = defineProps<{
  visible: boolean;
  designer: EmailTemplateDesigner;
}>();

const emit = defineEmits<{
  (e: "update:visible", v: boolean): void;
}>();

const innerVisible = computed({
  get: () => props.visible,
  set: (v) => emit("update:visible", v),
});

const form = ref<{ name: string; url: string; size?: number }>({
  name: "",
  url: "",
  size: undefined,
});

watch(
    () => props.visible,
    (v) => {
      if (v) {
        form.value = {name: "", url: "", size: undefined};
      }
    },
);

const handleSubmit = () => {
  if (!form.value.name || !form.value.url) return;
  props.designer.addAttachment({
    name: form.value.name,
    url: form.value.url,
    size: form.value.size,
  });
  innerVisible.value = false;
};
</script>

<template>
  <star-horse-dialog
      v-model="innerVisible"
      :title="i18n('emailtemplate.dialog.addAttachment')"
      box-width="480px"
      :self-func="true"
      @merge="handleSubmit"
  >
    <el-form :model="form" label-width="100px" size="default">
      <el-form-item :label="i18n('emailtemplate.attachment.name')">
        <el-input v-model="form.name" :placeholder="i18n('emailtemplate.attachment.namePlaceholder')"/>
      </el-form-item>
      <el-form-item :label="i18n('emailtemplate.attachment.url')">
        <el-input v-model="form.url" :placeholder="i18n('emailtemplate.attachment.urlPlaceholder')"/>
      </el-form-item>
      <el-form-item :label="i18n('emailtemplate.attachment.size')">
        <el-input-number v-model="form.size" :min="0" style="width: 100%" controls-position="right"/>
      </el-form-item>
    </el-form>
  </star-horse-dialog>
</template>
