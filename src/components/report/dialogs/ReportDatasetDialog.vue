<script setup lang="ts" name="ReportDatasetDialog">
/**
 * 报表数据集管理弹窗
 * 强制使用 star-horse-dialog
 */
import {computed, ref, watch} from "vue";
import {i18n} from "@/lang";
import StarHorseDialog from "@/components/comp/StarHorseDialog.vue";
import type {DatasetField, ReportDataset} from "../types";
import {StarHorsePanel} from "@/components/comp";

const props = defineProps<{
  visible: boolean;
  datasets: ReportDataset[];
  dialogType?:"dialog"|"drawer";
}>();

const emits = defineEmits<{
  (e: "update:visible", v: boolean): void;
  (e: "save", list: ReportDataset[]): void;
}>();

const innerVisible = computed({
  get: () => props.visible,
  set: (v) => emits("update:visible", v),
});

const localList = ref<ReportDataset[]>([]);
const activeId = ref<string>("");
const editing = ref<ReportDataset | null>(null);

watch(
    () => props.visible,
    (v) => {
      if (v) {
        localList.value = JSON.parse(JSON.stringify(props.datasets));
        if (localList.value.length && !activeId.value) {
          activeId.value = localList.value[0].id;
          editing.value = localList.value[0];
        }
      }
    },
    {immediate: true},
);

const selectDs = (id: string) => {
  activeId.value = id;
  editing.value = localList.value.find((d) => d.id === id) || null;
};

const addDs = () => {
  const newDs: ReportDataset = {
    id: `ds_${Date.now()}`,
    name: i18n("report.dataset.newName"),
    type: "sql",
    sql: "",
    fields: [],
  };
  localList.value.push(newDs);
  selectDs(newDs.id);
};

const deleteDs = (id: string) => {
  const idx = localList.value.findIndex((d) => d.id === id);
  if (idx < 0) return;
  localList.value.splice(idx, 1);
  if (activeId.value === id) {
    activeId.value = localList.value[0]?.id || "";
    editing.value = localList.value[0] || null;
  }
};

const addField = () => {
  if (!editing.value) return;
  editing.value.fields.push({
    name: `field_${editing.value.fields.length + 1}`,
    label: i18n("report.dataset.newField"),
    type: "string",
  });
};

const deleteField = (idx: number) => {
  if (!editing.value) return;
  editing.value.fields.splice(idx, 1);
};

const handleSave = () => {
  emits("save", JSON.parse(JSON.stringify(localList.value)));
  innerVisible.value = false;
};

const fieldTypes: Array<{ label: string; value: DatasetField["type"] }> = [
  {label: i18n("report.field.type.string"), value: "string"},
  {label: i18n("report.field.type.number"), value: "number"},
  {label: i18n("report.field.type.date"), value: "date"},
  {label: i18n("report.field.type.datetime"), value: "datetime"},
  {label: i18n("report.field.type.boolean"), value: "boolean"},
];
</script>

<template>
  <star-horse-panel
      :type="dialogType"
      v-model="innerVisible"
      :title="i18n('report.dataset.title')"
      box-width="70%"
      box-height="70%"
      :is-show-reset="false"
      :self-func="true"
      @merge="handleSave"
  >
    <div class="ds-dialog">
      <div class="ds-list">
        <div class="ds-list-header">
          <span>{{ i18n('report.dataset.listTitle') }}</span>
          <el-button type="primary" @click="addDs" plain>+</el-button>
        </div>
        <div class="ds-list-body">
          <div
              v-for="ds in localList"
              :key="ds.id"
              class="ds-item"
              :class="{ active: activeId === ds.id }"
              @click="selectDs(ds.id)"
          >
            <div class="ds-name">{{ ds.name }}</div>
            <div class="ds-meta">{{ ds.type }} · {{ ds.fields.length }} {{ i18n('report.dataset.fields') }}</div>
            <el-button type="danger" link @click.stop="deleteDs(ds.id)">×</el-button>
          </div>
        </div>
      </div>
      <div class="ds-edit" v-if="editing">
        <el-form label-width="100px">
          <el-form-item :label="i18n('report.dataset.name')">
            <el-input v-model="editing.name"/>
          </el-form-item>
          <el-form-item :label="i18n('report.dataset.type')">
            <el-select v-model="editing.type">
              <el-option :label="i18n('report.dataset.type.sql')" value="sql"/>
              <el-option :label="i18n('report.dataset.type.api')" value="api"/>
              <el-option :label="i18n('report.dataset.type.static')" value="static"/>
              <el-option :label="i18n('report.dataset.type.json')" value="json"/>
            </el-select>
          </el-form-item>
          <el-form-item v-if="editing.type === 'sql'" :label="i18n('report.dataset.sql')">
            <el-input v-model="editing.sql" type="textarea" :rows="3"/>
          </el-form-item>
          <el-form-item v-if="editing.type === 'api'" :label="i18n('report.dataset.apiUrl')">
            <el-input v-model="editing.apiUrl"/>
          </el-form-item>

          <el-divider content-position="left">
            <span>{{ i18n('report.dataset.fields') }}</span>
            <el-button type="primary" link @click="addField">+</el-button>
          </el-divider>
          <el-table :data="editing.fields" border>
            <el-table-column :label="i18n('report.dataset.fieldName')" prop="name" width="120">
              <template #default="{ row }">
                <el-input v-model="row.name"/>
              </template>
            </el-table-column>
            <el-table-column :label="i18n('report.dataset.fieldLabel')" prop="label" width="120">
              <template #default="{ row }">
                <el-input v-model="row.label"/>
              </template>
            </el-table-column>
            <el-table-column :label="i18n('report.dataset.fieldType')" prop="type" width="120">
              <template #default="{ row }">
                <el-select v-model="row.type">
                  <el-option v-for="ft in fieldTypes" :key="ft.value" :label="ft.label" :value="ft.value"/>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column :label="i18n('report.dataset.operation')" width="60">
              <template #default="{ $index }">
                <el-button type="danger" link @click="deleteField($index)">×</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </div>
    </div>
    <template #footer>
      <el-button @click="innerVisible = false">{{ i18n('dialog.close') }}</el-button>
    </template>
  </star-horse-panel>
</template>

<style lang="scss" scoped>
.ds-dialog {
  display: flex;
  height: 100%;
  gap: 8px;

  .ds-list {
    width: 220px;
    border-right: 1px solid var(--el-border-color-lighter);

    .ds-list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px;
      font-size: 13px;
      font-weight: 600;
      border-bottom: 1px solid var(--el-border-color-lighter);
    }

    .ds-list-body {
      padding: 4px;
      overflow-y: auto;
    }

    .ds-item {
      display: flex;
      align-items: center;
      padding: 8px;
      border-radius: 4px;
      cursor: pointer;
      gap: 4px;

      &:hover {
        background: var(--el-fill-color-light);
      }

      &.active {
        background: var(--el-color-primary-light-9);
      }

      .ds-name {
        flex: 1;
        font-size: 13px;
      }

      .ds-meta {
        font-size: 11px;
        color: var(--el-text-color-secondary);
      }
    }
  }

  .ds-edit {
    flex: 1;
    overflow-y: auto;
    padding: 8px 12px;
  }
}
</style>
