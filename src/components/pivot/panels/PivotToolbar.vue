<script setup lang="ts" name="PivotToolbar">
import {i18n} from "@/lang";
import {ShSvgIcon} from "@/components/shared";
import {ElMessage} from "element-plus";
import type {PivotDesigner} from "../composables/usePivotDesigner";
import {PIVOT_NUMBER_FORMAT_PRESETS} from "../constants";

const props = defineProps<{
  designer: PivotDesigner;
  readonly?: boolean;
}>();

const emit = defineEmits<{
  (e: "save"): void;
  (e: "preview"): void;
}>();

/** 导出为 CSV */
const handleExportCsv = () => {
  const d = props.designer;
  const rows = d.state.records;
  if (!rows.length) {
    ElMessage.warning(i18n("pivot.message.noData"));
    return;
  }
  const fields = d.state.fields;
  const headers = fields.map(f => f.label || f.name).join(",");
  const lines = rows.map(r =>
      fields.map(f => {
        const v = (r as any)[f.name];
        if (v == null) return "";
        const s = String(v);
        return s.includes(",") || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s;
      }).join(","),
  );
  const csv = "\uFEFF" + [headers, ...lines].join("\n");
  const blob = new Blob([csv], {type: "text/csv;charset=utf-8;"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${d.state.name || "pivot"}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  ElMessage.success(i18n("pivot.message.exported"));
};
</script>

<template>
  <div class="pivot-toolbar">
    <div class="left-group">
      <el-tooltip :content="i18n('pivot.btn.toggleTotal')" :show-after="500">
        <el-button
            size="small"
            :type="designer.state.config.showTotal ? 'primary' : 'default'"
            @click="designer.updateConfig({ showTotal: !designer.state.config.showTotal })"
        >
          <ShSvgIcon name="total" size="14px"/>
        </el-button>
      </el-tooltip>
      <el-tooltip :content="i18n('pivot.btn.toggleRowSubtotal')" :show-after="500">
        <el-button
            size="small"
            :type="designer.state.config.showRowSubtotal ? 'primary' : 'default'"
            @click="designer.updateConfig({ showRowSubtotal: !designer.state.config.showRowSubtotal })"
        >
          <ShSvgIcon name="rowSubtotal" size="14px"/>
        </el-button>
      </el-tooltip>
      <el-tooltip :content="i18n('pivot.btn.toggleColSubtotal')" :show-after="500">
        <el-button
            size="small"
            :type="designer.state.config.showColSubtotal ? 'primary' : 'default'"
            @click="designer.updateConfig({ showColSubtotal: !designer.state.config.showColSubtotal })"
        >
          <ShSvgIcon name="colSubtotal" size="14px"/>
        </el-button>
      </el-tooltip>
    </div>

    <div class="right-group">
      <div class="number-format-group">
        <span class="label">{{ i18n("pivot.label.numberFormat") }}:</span>
        <el-select
            :model-value="designer.state.config.numberFormat"
            size="small"
            style="width: 140px"
            @update:model-value="(v) => designer.updateConfig({ numberFormat: v })"
        >
          <el-option
              v-for="opt in PIVOT_NUMBER_FORMAT_PRESETS"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
          />
        </el-select>
      </div>

      <el-tooltip :content="i18n('pivot.btn.exportCsv')" :show-after="500">
        <el-button size="small" @click="handleExportCsv">
          <ShSvgIcon name="export" size="14px"/>
        </el-button>
      </el-tooltip>

      <el-tooltip :content="i18n('pivot.btn.toggleChart')" :show-after="500">
        <el-button
            size="small"
            :type="designer.showChart ? 'primary' : 'default'"
            @click="designer.toggleChart()"
        >
          <ShSvgIcon name="chart" size="14px"/>
        </el-button>
      </el-tooltip>

      <el-tooltip :content="i18n('pivot.btn.preview')" :show-after="500">
        <el-button size="small" @click="emit('preview')">
          <ShSvgIcon name="preview" size="14px"/>
        </el-button>
      </el-tooltip>

      <el-button type="primary" size="small" :disabled="readonly" @click="emit('save')">
        <ShSvgIcon name="save" size="14px"/>
        {{ i18n("dialog.save") }}
      </el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.pivot-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 12px;
  background: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color);
  flex-wrap: wrap;
  gap: 8px;

  .left-group,
  .right-group {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .right-group {
    flex-wrap: nowrap;
  }

  .number-format-group {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
  }

  .label {
    font-size: 12px;
    color: var(--el-text-color-secondary);
    white-space: nowrap;
    flex-shrink: 0;
  }
}
</style>
