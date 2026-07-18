<script setup lang="ts" name="PivotToolbar">
import { i18n } from "@/lang";
import type { PivotDesigner } from "../composables/usePivotDesigner";
import { PIVOT_NUMBER_FORMAT_PRESETS } from "../constants";

defineProps<{
    designer: PivotDesigner;
    readonly?: boolean;
}>();

const emit = defineEmits<{
    (e: "save"): void;
    (e: "preview"): void;
}>();
</script>

<template>
    <div class="pivot-toolbar">
        <div class="left-group">
            <el-tooltip :content="i18n('pivot.btn.toggleTotal')">
                <el-button

                    :type="designer.state.config.showTotal ? 'primary' : 'default'"
                    @click="designer.updateConfig({ showTotal: !designer.state.config.showTotal })"
                >
                    <el-icon><Coin/></el-icon>
                </el-button>
            </el-tooltip>
            <el-tooltip :content="i18n('pivot.btn.toggleRowSubtotal')">
                <el-button

                    :type="designer.state.config.showRowSubtotal ? 'primary' : 'default'"
                    @click="designer.updateConfig({ showRowSubtotal: !designer.state.config.showRowSubtotal })"
                >
                    {{ i18n("pivot.btn.rowSubtotal") }}
                </el-button>
            </el-tooltip>
            <el-tooltip :content="i18n('pivot.btn.toggleColSubtotal')">
                <el-button

                    :type="designer.state.config.showColSubtotal ? 'primary' : 'default'"
                    @click="designer.updateConfig({ showColSubtotal: !designer.state.config.showColSubtotal })"
                >
                    {{ i18n("pivot.btn.colSubtotal") }}
                </el-button>
            </el-tooltip>
        </div>

        <div class="right-group">
            <span class="label">{{ i18n("pivot.label.numberFormat") }}:</span>
            <el-select
                :model-value="designer.state.config.numberFormat"

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

            <el-button  @click="designer.toggleChart()">
                <el-icon><DataAnalysis/></el-icon>
                {{ designer.showChart ? i18n("pivot.btn.hideChart") : i18n("pivot.btn.showChart") }}
            </el-button>

            <el-button  @click="emit('preview')">
                <el-icon><View/></el-icon>
                {{ i18n("pivot.btn.preview") }}
            </el-button>

            <el-button  type="primary" :disabled="readonly" @click="emit('save')">
                <el-icon><Check/></el-icon>
                {{ i18n("dialog.save") }}
            </el-button>
        </div>
    </div>
</template>

<script lang="ts">
import { Coin, DataAnalysis, View, Check } from "@element-plus/icons-vue";
export default { components: { Coin, DataAnalysis, View, Check } };
</script>

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

    .label {
        font-size: 12px;
        color: var(--el-text-color-secondary);
    }
}
</style>
