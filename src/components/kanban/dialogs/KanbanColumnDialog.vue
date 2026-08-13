<script setup lang="ts" name="KanbanColumnDialog">
import { computed, ref, watch } from "vue";
import { i18n } from "@/lang";
import type { KanbanDesigner } from "../composables/useKanbanDesigner";
import { createColumn } from "../constants";
import type { KanbanColumn } from "../types";
import { StarHorsePanel } from "@/components/comp";

const props = defineProps<{
  visible: boolean;
  designer: KanbanDesigner;
  columnId?: string | null;
  dialogType?: "dialog" | "drawer";
}>();

const emit = defineEmits<{
  (e: "update:visible", v: boolean): void;
}>();

const innerVisible = computed({
  get: () => props.visible,
  set: (v) => emit("update:visible", v),
});

const form = ref<KanbanColumn>(createColumn());
const isNew = ref(true);

watch(
  () => [props.visible, props.columnId] as const,
  ([visible]) => {
    if (!visible) return;
    if (props.columnId) {
      const col = props.designer.state.columns.find(
        (c) => c.id === props.columnId,
      );
      if (col) {
        form.value = { ...col, wipLimit: { ...col.wipLimit } };
        isNew.value = false;
        return;
      }
    }
    form.value = createColumn();
    isNew.value = true;
  },
  { immediate: true },
);

const handleSubmit = () => {
  if (isNew.value) {
    props.designer.addColumn(form.value);
  } else {
    props.designer.updateColumn(form.value.id, form.value);
  }
  innerVisible.value = false;
};
</script>

<template>
  <star-horse-panel
    :type="dialogType"
    v-model="innerVisible"
    :title="
      isNew ? i18n('kanban.dialog.addColumn') : i18n('kanban.dialog.editColumn')
    "
    box-width="500px"
    :self-func="true"
    @merge="handleSubmit"
  >
    <el-form :model="form" label-width="100px" size="default">
      <el-form-item :label="i18n('kanban.column.name')">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item :label="i18n('kanban.column.color')">
        <el-color-picker v-model="form.color" />
      </el-form-item>
      <el-form-item :label="i18n('kanban.column.isDone')">
        <el-switch v-model="form.isDone" />
      </el-form-item>
      <el-form-item :label="i18n('kanban.column.wipEnabled')">
        <el-switch v-model="form.wipLimit!.enabled" />
      </el-form-item>
      <el-form-item
        v-if="form.wipLimit!.enabled"
        :label="i18n('kanban.column.wipMax')"
      >
        <el-input-number v-model="form.wipLimit!.max" :min="1" />
      </el-form-item>
      <el-form-item
        v-if="form.wipLimit!.enabled"
        :label="i18n('kanban.column.wipStrategy')"
      >
        <el-radio-group v-model="form.wipLimit!.strategy">
          <el-radio value="warn">{{
            i18n("kanban.column.wipStrategyWarn")
          }}</el-radio>
          <el-radio value="block">{{
            i18n("kanban.column.wipStrategyBlock")
          }}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </star-horse-panel>
</template>
