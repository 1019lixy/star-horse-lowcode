<script setup lang="ts" name="DtSceneTreePanel">
/**
 * 数字孪生 - 场景层级树面板
 *
 * el-tree 展示 DtSceneNode 层级
 * 节点类型图标 / 点击节点选中对应实体 / 右键菜单（添加子节点 / 删除 / 重命名）
 */
import { computed, ref } from "vue";
import { i18n } from "@/lang";
import { ElMessage, ElMessageBox } from "element-plus";
import type { DtSceneNode, DtSceneNodeType } from "../types";

const props = defineProps<{
    /** 场景层级根节点列表 */
    nodes: DtSceneNode[];
}>();

const emit = defineEmits<{
    (e: "select-entity", id: string | null): void;
    (e: "add-child", parent: DtSceneNode, type: DtSceneNodeType): void;
    (e: "delete-node", node: DtSceneNode): void;
    (e: "rename-node", node: DtSceneNode, name: string): void;
}>();

/** el-tree props 配置 */
const treeProps = {
    label: (data: DtSceneNode) => data.name ?? (data.labelKey ? i18n(data.labelKey as any) : data.type),
    children: "children",
};

const currentNode = ref<DtSceneNode | null>(null);
const contextMenuVisible = ref(false);
const contextMenuStyle = ref({ left: "0px", top: "0px" });
const renameDialogVisible = ref(false);
const renameValue = ref("");
const addChildDialogVisible = ref(false);
const newChildType = ref<DtSceneNodeType>("equipment");
const newChildName = ref("");

/** 节点类型 → 图标颜色 */
const nodeIconColor = (type: DtSceneNodeType): string => {
    switch (type) {
        case "site": return "#1890FF";
        case "building": return "#722ED1";
        case "floor": return "#13C2C2";
        case "zone": return "#FAAD14";
        case "equipment": return "#52C41A";
        default: return "#8C8C8C";
    }
};

const nodeTypeLabel = (type: DtSceneNodeType): string =>
    i18n(`digitaltwin.hierarchy.${type}` as any);

/** 树节点点击 */
const handleNodeClick = (data: DtSceneNode): void => {
    currentNode.value = data;
    if (data.type === "equipment" && data.entityId) {
        emit("select-entity", data.entityId);
    }
};

/** 右键 */
const handleNodeContextmenu = (e: MouseEvent, data: DtSceneNode): void => {
    e.preventDefault();
    currentNode.value = data;
    contextMenuVisible.value = true;
    contextMenuStyle.value = {
        left: `${e.clientX}px`,
        top: `${e.clientY}px`,
    };
};

const closeContextMenu = (): void => {
    contextMenuVisible.value = false;
};

const handleAddChild = (): void => {
    if (!currentNode.value) return;
    newChildType.value = "equipment";
    newChildName.value = "";
    addChildDialogVisible.value = true;
    closeContextMenu();
};

const confirmAddChild = (): void => {
    if (!currentNode.value) return;
    if (!newChildName.value.trim()) {
        ElMessage.warning(i18n("digitaltwin.entity.name"));
        return;
    }
    emit("add-child", currentNode.value, newChildType.value);
    // 本地直接挂载子节点
    if (!currentNode.value.children) currentNode.value.children = [];
    currentNode.value.children.push({
        id: `node_${Date.now()}`,
        type: newChildType.value,
        name: newChildName.value,
        children: [],
        expanded: true,
    });
    addChildDialogVisible.value = false;
};

const handleRename = (): void => {
    if (!currentNode.value) return;
    renameValue.value = currentNode.value.name ?? "";
    renameDialogVisible.value = true;
    closeContextMenu();
};

const confirmRename = (): void => {
    if (!currentNode.value) return;
    if (!renameValue.value.trim()) {
        ElMessage.warning(i18n("digitaltwin.entity.name"));
        return;
    }
    emit("rename-node", currentNode.value, renameValue.value);
    currentNode.value.name = renameValue.value;
    renameDialogVisible.value = false;
};

const handleDelete = (): void => {
    if (!currentNode.value) return;
    ElMessageBox.confirm(i18n("digitaltwin.entity.confirmDelete"), i18n("digitaltwin.entity.delete"), {
        type: "warning",
    })
        .then(() => {
            emit("delete-node", currentNode.value as DtSceneNode);
            // 从父节点 children 中删除
            const removeFromList = (list: DtSceneNode[]): boolean => {
                const idx = list.findIndex((n) => n.id === currentNode.value?.id);
                if (idx >= 0) {
                    list.splice(idx, 1);
                    return true;
                }
                return list.some((n) => n.children && removeFromList(n.children));
            };
            removeFromList(props.nodes);
            ElMessage.success(i18n("digitaltwin.message.deleted"));
        })
        .catch(() => {})
        .finally(() => closeContextMenu());
};

const isEmpty = computed(() => props.nodes.length === 0);

const childTypeOptions = [
    { value: "site", labelKey: "digitaltwin.hierarchy.site" },
    { value: "building", labelKey: "digitaltwin.hierarchy.building" },
    { value: "floor", labelKey: "digitaltwin.hierarchy.floor" },
    { value: "zone", labelKey: "digitaltwin.hierarchy.zone" },
    { value: "equipment", labelKey: "digitaltwin.hierarchy.equipment" },
] as const;
</script>

<template>
    <div class="dt-scene-tree" @click="closeContextMenu">
        <div class="panel-header">
            <span class="panel-title">{{ i18n("digitaltwin.hierarchy.title") }}</span>
        </div>
        <div class="tree-body">
            <template v-if="isEmpty">
                <div class="empty-text">{{ i18n("digitaltwin.hierarchy.empty") }}</div>
            </template>
            <el-tree
                v-else
                :data="nodes"
                :props="treeProps"
                node-key="id"
                default-expand-all
                @node-click="handleNodeClick"
                @node-contextmenu="handleNodeContextmenu"
            >
                <template #default="{ data }">
                    <span class="tree-node">
                        <span class="node-dot" :style="{ background: nodeIconColor(data.type) }" />
                        <span class="node-label">{{ treeProps.label(data) }}</span>
                        <span class="node-type">[{{ nodeTypeLabel(data.type) }}]</span>
                    </span>
                </template>
            </el-tree>
        </div>

        <!-- 右键菜单 -->
        <teleport to="body">
            <ul
                v-if="contextMenuVisible"
                class="context-menu"
                :style="contextMenuStyle"
                @click.stop
            >
                <li @click="handleAddChild">{{ i18n("digitaltwin.hierarchy.addChild") }}</li>
                <li @click="handleRename">{{ i18n("digitaltwin.hierarchy.rename") }}</li>
                <li class="danger" @click="handleDelete">{{ i18n("digitaltwin.entity.delete") }}</li>
            </ul>
        </teleport>

        <!-- 重命名弹窗 -->
        <el-dialog
            v-model="renameDialogVisible"
            :title="i18n('digitaltwin.hierarchy.rename')"
            width="360px"
            append-to-body
        >
            <el-input v-model="renameValue" />
            <template #footer>
                <el-button @click="renameDialogVisible = false">{{ i18n("digitaltwin.dialog.close") }}</el-button>
                <el-button type="primary" @click="confirmRename">{{ i18n("digitaltwin.dialog.confirm") }}</el-button>
            </template>
        </el-dialog>

        <!-- 添加子节点弹窗 -->
        <el-dialog
            v-model="addChildDialogVisible"
            :title="i18n('digitaltwin.hierarchy.addChild')"
            width="380px"
            append-to-body
        >
            <el-form label-width="80px">
                <el-form-item :label="i18n('digitaltwin.entity.type')">
                    <el-select v-model="newChildType" style="width: 100%">
                        <el-option
                            v-for="opt in childTypeOptions"
                            :key="opt.value"
                            :label="i18n(opt.labelKey as any)"
                            :value="opt.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item :label="i18n('digitaltwin.entity.name')">
                    <el-input v-model="newChildName" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="addChildDialogVisible = false">{{ i18n("digitaltwin.dialog.close") }}</el-button>
                <el-button type="primary" @click="confirmAddChild">{{ i18n("digitaltwin.dialog.confirm") }}</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<style lang="scss" scoped>
.dt-scene-tree {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;

    .panel-header {
        padding: 8px 12px;
        border-bottom: 1px solid var(--el-border-color-lighter);

        .panel-title {
            font-size: 13px;
            font-weight: 600;
        }
    }

    .tree-body {
        flex: 1;
        overflow: auto;
        padding: 4px 8px;
    }

    .empty-text {
        padding: 24px 12px;
        text-align: center;
        color: var(--el-text-color-secondary);
        font-size: 12px;
    }

    .tree-node {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 12px;

        .node-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            flex-shrink: 0;
        }

        .node-label {
            color: var(--el-text-color-primary);
        }

        .node-type {
            color: var(--el-text-color-secondary);
            font-size: 11px;
        }
    }
}

.context-menu {
    position: fixed;
    z-index: 3000;
    list-style: none;
    margin: 0;
    padding: 4px 0;
    background: var(--el-bg-color);
    border: 1px solid var(--el-border-color-light);
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    min-width: 120px;

    li {
        padding: 6px 16px;
        font-size: 12px;
        cursor: pointer;

        &:hover {
            background: var(--el-fill-color-light);
        }

        &.danger {
            color: var(--el-color-danger);
        }
    }
}
</style>
