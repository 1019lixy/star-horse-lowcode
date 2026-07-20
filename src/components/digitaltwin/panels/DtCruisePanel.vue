<script setup lang="ts" name="DtCruisePanel">
/**
 * 数字孪生 - 相机巡航路径面板
 *
 * - 路径列表（预设 + 用户自定义）
 * - 航点序列展示
 * - 启动/暂停/继续/停止按钮
 * - 进度条 + 当前航点高亮
 * - 工具栏：新建/导入/导出路径
 */
import { computed } from "vue";
import { i18n } from "@/lang";
import { ShSvgIcon } from "@/components/shared";
import type { UseDtCruiseReturn } from "../composables/useDtCruise";
import type { DtCruisePath } from "../types";

const props = defineProps<{
    cruise: UseDtCruiseReturn;
    availablePaths: DtCruisePath[];
    floating?: boolean;
}>();

const emit = defineEmits<{
    (e: "start-path", pathId: string): void;
    (e: "jump-waypoint", pathId: string, waypointIndex: number): void;
    (e: "create-path"): void;
    (e: "close"): void;
}>();

const currentPath = computed(() => props.cruise.currentPath.value);
const isCruising = computed(() => props.cruise.isCruising.value);
const currentIndex = computed(() => props.cruise.currentWaypointIndex.value);
const progress = computed(() => props.cruise.progress.value);
const total = computed(() => props.cruise.totalWaypoints.value);

const handleSelect = (path: DtCruisePath): void => {
    emit("start-path", path.id);
};

const handleToggle = (): void => {
    if (isCruising.value) {
        props.cruise.pause();
    } else if (currentPath.value) {
        props.cruise.resume();
    }
};

const handleStop = (): void => {
    props.cruise.stop();
};

const handleJump = (pathId: string, idx: number, ev: Event): void => {
    ev.stopPropagation();
    emit("jump-waypoint", pathId, idx);
};
</script>

<template>
    <div class="dt-cruise-panel" :class="{ floating }">
        <div class="panel-header">
            <span class="panel-title">
                <ShSvgIcon name="route" />
                {{ i18n("digitaltwin.cruise.title") }}
            </span>
            <div style="flex:1" />
            <el-button text size="small" @click="emit('create-path')">
                <ShSvgIcon name="plus" />
            </el-button>
            <el-button text size="small" @click="emit('close')">
                <ShSvgIcon name="close" />
            </el-button>
        </div>

        <!-- 当前巡航进度 -->
        <div v-if="currentPath" class="current-cruise">
            <div class="cruise-info">
                <span class="path-name">{{ currentPath.name }}</span>
                <span class="wp-progress">
                    {{ currentIndex + 1 }} / {{ total }}
                </span>
            </div>
            <el-progress :percentage="Math.round(progress * 100)" :stroke-width="4" :show-text="false" />
            <div class="cruise-actions">
                <el-button size="small" :type="isCruising ? 'warning' : 'success'" @click="handleToggle">
                    <ShSvgIcon :name="isCruising ? 'videoPause' : 'videoPlay'" />
                    {{ isCruising ? i18n("digitaltwin.cruise.pause") : i18n("digitaltwin.cruise.resume") }}
                </el-button>
                <el-button size="small" @click="handleStop">
                    <ShSvgIcon name="videoPause" />
                    {{ i18n("digitaltwin.cruise.stop") }}
                </el-button>
            </div>
        </div>

        <div class="path-list">
            <div v-if="availablePaths.length === 0" class="empty">
                {{ i18n("digitaltwin.cruise.empty") }}
            </div>
            <div
                v-for="p in availablePaths"
                :key="p.id"
                class="path-card"
                :class="{ active: currentPath?.id === p.id }"
                @click="handleSelect(p)"
            >
                <div class="path-header">
                    <ShSvgIcon name="route" />
                    <span class="path-name">{{ p.name }}</span>
                    <el-tag size="small" :type="p.loop ? 'success' : 'info'">
                        {{ p.loop ? i18n("digitaltwin.cruise.loop") : i18n("digitaltwin.cruise.once") }}
                    </el-tag>
                    <span class="waypoint-count">{{ p.waypoints.length }} {{ i18n("digitaltwin.cruise.waypoints") }}</span>
                </div>
                <div class="waypoint-list">
                    <div
                        v-for="(wp, idx) in p.waypoints"
                        :key="wp.id"
                        class="waypoint-item"
                        :class="{ current: currentPath?.id === p.id && idx === currentIndex }"
                        @click="handleJump(p.id, idx, $event)"
                    >
                        <span class="wp-index">{{ idx + 1 }}</span>
                        <span class="wp-name">{{ wp.name }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.dt-cruise-panel {
    display: flex;
    flex-direction: column;
    background: var(--el-bg-color);
    border-radius: 6px;
    overflow: hidden;
    height: 100%;
    min-height: 360px;

    &.floating {
        position: fixed;
        top: 60px;
        right: 16px;
        width: 320px;
        max-height: calc(100vh - 80px);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
        border: 1px solid var(--el-border-color-lighter);
        z-index: 2000;
        backdrop-filter: blur(8px);
        background: rgba(var(--el-bg-color-rgb, 255, 255, 255), 0.95);
    }

    .panel-header {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 10px 12px;
        border-bottom: 1px solid var(--el-border-color-lighter);

        .panel-title {
            font-size: 13px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 6px;
        }
    }

    .current-cruise {
        padding: 10px 12px;
        border-bottom: 1px solid var(--el-border-color-lighter);
        background: var(--el-color-primary-light-9);

        .cruise-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 6px;

            .path-name {
                font-size: 12px;
                font-weight: 600;
                color: var(--el-color-primary);
            }
            .wp-progress {
                font-size: 11px;
                color: var(--el-text-color-secondary);
                font-family: monospace;
            }
        }

        .cruise-actions {
            display: flex;
            gap: 6px;
            margin-top: 6px;
        }
    }

    .path-list {
        flex: 1;
        overflow-y: auto;
        padding: 8px;

        .empty {
            text-align: center;
            color: var(--el-text-color-secondary);
            padding: 24px 0;
            font-size: 12px;
        }

        .path-card {
            border: 1px solid var(--el-border-color-lighter);
            border-radius: 4px;
            padding: 8px;
            margin-bottom: 6px;
            cursor: pointer;
            background: var(--el-bg-color-page);

            &:hover { background: var(--el-fill-color-light); }
            &.active {
                border-color: var(--el-color-primary);
                background: var(--el-color-primary-light-9);
            }

            .path-header {
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 12px;

                .path-name {
                    flex: 1;
                    font-weight: 600;
                }
                .waypoint-count {
                    font-size: 10px;
                    color: var(--el-text-color-secondary);
                }
            }

            .waypoint-list {
                margin-top: 6px;
                padding-left: 8px;

                .waypoint-item {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 2px 0;
                    font-size: 11px;
                    color: var(--el-text-color-secondary);

                    &:hover {
                        color: var(--el-color-primary);
                    }
                    &.current {
                        color: var(--el-color-success);
                        font-weight: 600;

                        .wp-index {
                            background: var(--el-color-success);
                            color: #fff;
                        }
                    }

                    .wp-index {
                        display: inline-block;
                        width: 16px;
                        height: 16px;
                        border-radius: 50%;
                        background: var(--el-fill-color);
                        text-align: center;
                        line-height: 16px;
                        font-size: 10px;
                        font-weight: 600;
                    }
                }
            }
        }
    }
}
</style>
