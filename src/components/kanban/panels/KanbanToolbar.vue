<script setup lang="ts" name="KanbanToolbar">
import { i18n } from "@/lang";
import type { KanbanDesigner } from "../composables/useKanbanDesigner";

defineProps<{
    designer: KanbanDesigner;
    readonly?: boolean;
}>();

const emit = defineEmits<{
    (e: "save"): void;
    (e: "preview"): void;
}>();
</script>

<template>
    <div class="kanban-toolbar">
        <div class="left-group">
            <el-button-group>
                <el-button  :disabled="readonly" @click="designer.undo()">
                    <el-icon><Back/></el-icon>
                    {{ i18n("kanban.btn.undo") }}
                </el-button>
                <el-button  :disabled="readonly" @click="designer.redo()">
                    <el-icon><Right/></el-icon>
                    {{ i18n("kanban.btn.redo") }}
                </el-button>
            </el-button-group>

            <el-button

                :disabled="readonly"
                @click="designer.addColumn()"
            >
                <el-icon><Plus/></el-icon>
                {{ i18n("kanban.btn.addColumn") }}
            </el-button>
        </div>

        <div class="right-group">
            <el-tooltip :content="i18n('kanban.btn.showAvatar')">
                <el-button

                    :type="designer.state.config.showAvatar ? 'primary' : 'default'"
                    @click="designer.updateConfig({ showAvatar: !designer.state.config.showAvatar })"
                >
                    <el-icon><User/></el-icon>
                </el-button>
            </el-tooltip>

            <el-tooltip :content="i18n('kanban.btn.showLabels')">
                <el-button

                    :type="designer.state.config.showLabels ? 'primary' : 'default'"
                    @click="designer.updateConfig({ showLabels: !designer.state.config.showLabels })"
                >
                    <el-icon><PriceTag/></el-icon>
                </el-button>
            </el-tooltip>

            <el-tooltip :content="i18n('kanban.btn.showPriority')">
                <el-button

                    :type="designer.state.config.showPriority ? 'primary' : 'default'"
                    @click="designer.updateConfig({ showPriority: !designer.state.config.showPriority })"
                >
                    <el-icon><Warning/></el-icon>
                </el-button>
            </el-tooltip>

            <el-button  @click="emit('preview')">
                <el-icon><View/></el-icon>
                {{ i18n("kanban.btn.preview") }}
            </el-button>

            <el-button  type="primary" :disabled="readonly" @click="emit('save')">
                <el-icon><Check/></el-icon>
                {{ i18n("dialog.save") }}
            </el-button>
        </div>
    </div>
</template>

<script lang="ts">
import { Back, Right, Plus, User, PriceTag, Warning, View, Check } from "@element-plus/icons-vue";
export default { components: { Back, Right, Plus, User, PriceTag, Warning, View, Check } };
</script>

<style lang="scss" scoped>
.kanban-toolbar {
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
}
</style>
