<script setup lang="ts" name="ReportPropertyPanel">
/**
 * 报表设计器 - 右侧属性面板
 */
import { computed } from "vue";
import { i18n } from "@/lang";
import type { UseReportDesignerReturn } from "../composables/useReportDesigner";

const props = defineProps<{
    designer: UseReportDesignerReturn;
}>();

const selected = computed(() => props.designer.selectedCell.value);

const updateStyle = (patch: Record<string, any>) => {
    if (!selected.value) return;
    props.designer.setCellStyle(selected.value.address, patch);
};

const updateFormula = (patch: Record<string, any>) => {
    if (!selected.value) return;
    props.designer.setCellFormula(selected.value.address, {
        ...(selected.value.formula || { type: "static", expression: "" }),
        ...patch,
    });
};

const updateValue = (val: string) => {
    if (!selected.value) return;
    props.designer.setCellValue(selected.value.address, val);
};
</script>

<template>
    <div class="report-property-panel">
        <el-tabs class="prop-tabs">
            <el-tab-pane :label="i18n('report.property.cell')" name="cell">
                <div v-if="!selected" class="empty-tip">
                    {{ i18n('report.property.selectFirst') }}
                </div>
                <el-form v-else  label-width="80px" class="prop-form">
                    <el-divider content-position="left">{{ i18n('report.property.value') }}</el-divider>
                    <el-form-item :label="i18n('report.property.content')">
                        <el-input
                            :model-value="selected.value"
                            @change="updateValue"
                            type="textarea"
                            :rows="2"
                            :placeholder="i18n('report.property.valuePlaceholder')"
                        />
                    </el-form-item>

                    <el-divider content-position="left">{{ i18n('report.property.formula') }}</el-divider>
                    <el-form-item :label="i18n('report.property.formulaType')">
                        <el-select
                            :model-value="selected.formula?.type || 'static'"
                            @change="(v) => updateFormula({ type: v })"
                        >
                            <el-option :label="i18n('report.formula.static')" value="static"/>
                            <el-option :label="i18n('report.formula.dataset')" value="dataset"/>
                            <el-option :label="i18n('report.formula.cellRef')" value="cellRef"/>
                            <el-option :label="i18n('report.formula.aggregate')" value="aggregate"/>
                            <el-option :label="i18n('report.formula.function')" value="function"/>
                            <el-option :label="i18n('report.formula.expression')" value="expression"/>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="i18n('report.property.expression')">
                        <el-input
                            :model-value="selected.formula?.expression"
                            @change="(v) => updateFormula({ expression: v })"
                            type="textarea"
                            :rows="3"
                            placeholder="=A1+B2 或 ${ds.field} 或 =SUM(A1:A10)"
                        />
                    </el-form-item>

                    <el-divider content-position="left">{{ i18n('report.property.font') }}</el-divider>
                    <el-form-item :label="i18n('report.property.fontSize')">
                        <el-select
                            :model-value="selected.style?.fontSize"
                            @change="(v) => updateStyle({ fontSize: v })"
                            allow-create
                            filterable
                        >
                            <el-option v-for="s in [8,9,10,11,12,14,16,18,20,24,28,32]" :key="s" :label="s+'pt'" :value="s"/>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="i18n('report.property.color')">
                        <el-color-picker
                            :model-value="selected.style?.color"
                            @change="(v) => updateStyle({ color: v })"
                        />
                    </el-form-item>
                    <el-form-item :label="i18n('report.property.bgColor')">
                        <el-color-picker
                            :model-value="selected.style?.backgroundColor"
                            @change="(v) => updateStyle({ backgroundColor: v })"
                        />
                    </el-form-item>
                    <el-form-item :label="i18n('report.property.align')">
                        <el-radio-group
                            :model-value="selected.style?.textAlign || 'left'"
                            @change="(v) => updateStyle({ textAlign: v })"
                        >
                            <el-radio-button value="left">L</el-radio-button>
                            <el-radio-button value="center">C</el-radio-button>
                            <el-radio-button value="right">R</el-radio-button>
                        </el-radio-group>
                    </el-form-item>

                    <el-divider content-position="left">{{ i18n('report.property.format') }}</el-divider>
                    <el-form-item :label="i18n('report.property.dataType')">
                        <el-select
                            :model-value="selected.dataType || 'text'"
                            @change="(v) => designer.updateCell(selected!.address, { dataType: v })"
                        >
                            <el-option :label="i18n('report.dataType.text')" value="text"/>
                            <el-option :label="i18n('report.dataType.number')" value="number"/>
                            <el-option :label="i18n('report.dataType.date')" value="date"/>
                            <el-option :label="i18n('report.dataType.currency')" value="currency"/>
                            <el-option :label="i18n('report.dataType.percent')" value="percent"/>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="i18n('report.property.formatStr')">
                        <el-input
                            :model-value="selected.style?.format"
                            @change="(v) => updateStyle({ format: v })"
                            placeholder="0.00 / YYYY-MM-DD / currency"
                        />
                    </el-form-item>

                    <el-divider content-position="left">{{ i18n('report.property.expand') }}</el-divider>
                    <el-form-item :label="i18n('report.property.expandDir')">
                        <el-radio-group
                            :model-value="selected.expandDirection || 'none'"
                            @change="(v) => designer.updateCell(selected!.address, { expandDirection: v })"
                        >
                            <el-radio-button value="none">{{ i18n('report.expand.none') }}</el-radio-button>
                            <el-radio-button value="vertical">{{ i18n('report.expand.vertical') }}</el-radio-button>
                            <el-radio-button value="horizontal">{{ i18n('report.expand.horizontal') }}</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item :label="i18n('report.property.groupField')">
                        <el-input
                            :model-value="selected.groupField"
                            @change="(v) => designer.updateCell(selected!.address, { groupField: v })"
                            placeholder="ds.field"
                        />
                    </el-form-item>
                </el-form>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<style lang="scss" scoped>
.report-property-panel {
    width: 300px;
    height: 100%;
    background: var(--el-bg-color);
    border-left: 1px solid var(--el-border-color-lighter);
    flex-shrink: 0;

    .prop-tabs {
        height: 100%;
        display: flex;
        flex-direction: column;

        :deep(.el-tabs__content) {
            flex: 1;
            overflow-y: auto;
            padding: 8px;
        }
    }

    .empty-tip {
        padding: 40px 12px;
        text-align: center;
        color: var(--el-text-color-secondary);
        font-size: 13px;
    }
}
</style>
