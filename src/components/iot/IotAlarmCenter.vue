<script setup lang="ts" name="IotAlarmCenter">
import { computed, nextTick, ref, watch } from "vue";
import { i18n } from "@/lang";
import { useAlarmCenter } from "./composables/useAlarmCenter";
import { ALARM_LEVEL_COLORS, ALARM_LEVEL_LABELS } from "./constants";
import type { IotAlarm, IotAlarmLevel } from "./types";

const props = defineProps<{
    alarms?: IotAlarm[];
    height?: number;
}>();

const center = useAlarmCenter(props.alarms ?? []);

const listRef = ref<HTMLDivElement | null>(null);
const panelHeight = computed(() => props.height ?? 420);

/** 级别过滤选项 */
const levelOptions = computed(() => [
    { value: "", label: i18n("iot.alarm.all") },
    { value: "info", label: ALARM_LEVEL_LABELS.info },
    { value: "warning", label: ALARM_LEVEL_LABELS.warning },
    { value: "error", label: ALARM_LEVEL_LABELS.error },
    { value: "critical", label: ALARM_LEVEL_LABELS.critical },
]);

/** 确认状态过滤选项 */
const ackOptions = computed(() => [
    { value: "", label: i18n("iot.alarm.all") },
    { value: "unack", label: i18n("iot.alarm.unacknowledged") },
    { value: "ack", label: i18n("iot.alarm.acknowledged") },
]);

/** 级别过滤的双向绑定（el-select 用字符串） */
const levelFilterValue = computed({
    get: () => (center.filterLevel.value ?? "") as string,
    set: (v: string) => {
        center.filterLevel.value = (v || null) as IotAlarmLevel | null;
    },
});

/** 确认过滤的双向绑定 */
const ackFilterValue = computed({
    get: () => {
        if (center.filterAcknowledged.value === null) return "";
        return center.filterAcknowledged.value ? "ack" : "unack";
    },
    set: (v: string) => {
        if (v === "") center.filterAcknowledged.value = null;
        else if (v === "ack") center.filterAcknowledged.value = true;
        else center.filterAcknowledged.value = false;
    },
});

/** 统计信息 */
const stats = computed(() => center.getStats());

/** 统计摘要卡片 */
const statCards = computed(() => [
    {
        key: "total",
        label: i18n("iot.alarm.stats.total"),
        value: stats.value.total,
        color: "#909399",
    },
    {
        key: "active",
        label: i18n("iot.alarm.stats.active"),
        value: stats.value.active,
        color: ALARM_LEVEL_COLORS.critical,
    },
    {
        key: "acknowledged",
        label: i18n("iot.alarm.stats.acknowledged"),
        value: stats.value.acknowledged,
        color: ALARM_LEVEL_COLORS.warning,
    },
    {
        key: "resolved",
        label: i18n("iot.alarm.stats.resolved"),
        value: stats.value.resolved,
        color: "#67C23A",
    },
]);

/** 级别统计徽章 */
const levelBadges = computed(() =>
    (["critical", "error", "warning", "info"] as IotAlarmLevel[]).map((lv) => ({
        level: lv,
        count: stats.value.byLevel[lv],
        color: ALARM_LEVEL_COLORS[lv],
        label: ALARM_LEVEL_LABELS[lv],
    })),
);

/** 格式化时间 */
const formatTime = (ts: number): string => {
    const d = new Date(ts);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

/** 自动滚动到最新 */
const scrollToLatest = () => {
    nextTick(() => {
        const el = listRef.value;
        if (el) el.scrollTop = 0;
    });
};

// 监听告警数量变化，自动滚动
watch(
    () => center.alarms.length,
    () => scrollToLatest(),
);
</script>

<template>
    <div class="iot-alarm-center">
        <!-- 统计摘要 -->
        <div class="stats-bar">
            <div
                v-for="card in statCards"
                :key="card.key"
                class="stat-card"
            >
                <span class="stat-value" :style="{ color: card.color }">{{ card.value }}</span>
                <span class="stat-label">{{ card.label }}</span>
            </div>
            <div class="level-badges">
                <span
                    v-for="b in levelBadges"
                    :key="b.level"
                    class="level-badge"
                    :style="{ borderColor: b.color, color: b.color }"
                    :title="b.label"
                >
                    {{ b.label }} {{ b.count }}
                </span>
            </div>
        </div>
        <!-- 过滤栏 -->
        <div class="filter-bar">
            <span class="filter-title">{{ i18n("iot.alarm.title") }}</span>
            <div class="filter-controls">
                <el-select
                    v-model="levelFilterValue"

                    style="width: 120px"
                >
                    <el-option
                        v-for="opt in levelOptions"
                        :key="opt.value"
                        :label="opt.label"
                        :value="opt.value"
                    />
                </el-select>
                <el-select
                    v-model="ackFilterValue"

                    style="width: 130px"
                >
                    <el-option
                        v-for="opt in ackOptions"
                        :key="opt.value"
                        :label="opt.label"
                        :value="opt.value"
                    />
                </el-select>
                <el-tag  type="info">
                    {{ center.filteredAlarms.value.length }}
                </el-tag>
            </div>
        </div>
        <!-- 告警列表 -->
        <div
            ref="listRef"
            class="alarm-list"
            :style="{ maxHeight: `${panelHeight - 120}px` }"
        >
            <div
                v-if="center.filteredAlarms.value.length === 0"
                class="empty"
            >
                {{ i18n("iot.message.noAlarms") }}
            </div>
            <div
                v-for="alarm in center.filteredAlarms.value"
                :key="alarm.id"
                class="alarm-item"
                :class="[`level-${alarm.level}`, { resolved: alarm.resolved }]"
            >
                <div class="alarm-level" :style="{ background: ALARM_LEVEL_COLORS[alarm.level] }">
                    {{ ALARM_LEVEL_LABELS[alarm.level] }}
                </div>
                <div class="alarm-body">
                    <div class="alarm-head">
                        <span class="alarm-device">{{ alarm.deviceName }}</span>
                        <span class="alarm-time">{{ formatTime(alarm.timestamp) }}</span>
                    </div>
                    <div class="alarm-message">{{ alarm.message }}</div>
                    <div class="alarm-tags">
                        <el-tag v-if="alarm.acknowledged"  type="warning">
                            {{ i18n("iot.alarm.acknowledged") }}
                        </el-tag>
                        <el-tag v-if="alarm.resolved"  type="success">
                            {{ i18n("iot.alarm.resolved") }}
                        </el-tag>
                    </div>
                </div>
                <div class="alarm-actions">
                    <el-button
                        v-if="!alarm.acknowledged"

                        type="warning"
                        plain
                        @click="center.acknowledgeAlarm(alarm.id)"
                    >
                        {{ i18n("iot.alarm.acknowledge") }}
                    </el-button>
                    <el-button
                        v-if="!alarm.resolved"

                        type="success"
                        plain
                        @click="center.resolveAlarm(alarm.id)"
                    >
                        {{ i18n("iot.alarm.resolve") }}
                    </el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
export default { name: "IotAlarmCenter" };
</script>

<style lang="scss" scoped>
.iot-alarm-center {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: var(--el-bg-color);
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
    overflow: hidden;

    .stats-bar {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 8px 12px;
        background: var(--el-fill-color-light);
        border-bottom: 1px solid var(--el-border-color-lighter);
        flex-wrap: wrap;

        .stat-card {
            display: flex;
            flex-direction: column;
            align-items: center;
            min-width: 60px;

            .stat-value {
                font-size: 18px;
                font-weight: 700;
                line-height: 1.2;
            }
            .stat-label {
                font-size: 11px;
                color: var(--el-text-color-secondary);
            }
        }

        .level-badges {
            display: flex;
            gap: 6px;
            margin-left: auto;
            flex-wrap: wrap;

            .level-badge {
                font-size: 11px;
                padding: 2px 8px;
                border: 1px solid;
                border-radius: 10px;
                background: var(--el-bg-color);
            }
        }
    }

    .filter-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 12px;
        border-bottom: 1px solid var(--el-border-color-lighter);

        .filter-title {
            font-weight: 600;
            font-size: 13px;
        }
        .filter-controls {
            display: flex;
            align-items: center;
            gap: 8px;
        }
    }

    .alarm-list {
        flex: 1;
        overflow-y: auto;
        padding: 6px 0;

        .empty {
            padding: 40px;
            text-align: center;
            color: var(--el-text-color-placeholder);
            font-size: 13px;
        }
    }

    .alarm-item {
        display: flex;
        gap: 8px;
        padding: 8px 12px;
        border-bottom: 1px solid var(--el-border-color-lighter);
        transition: background 0.15s;

        &:hover {
            background: var(--el-fill-color-light);
        }
        &.resolved {
            opacity: 0.6;
        }
        &.level-critical {
            border-left: 3px solid #b71c1c;
        }
        &.level-error {
            border-left: 3px solid #f56c6c;
        }
        &.level-warning {
            border-left: 3px solid #e6a23c;
        }
        &.level-info {
            border-left: 3px solid #909399;
        }

        .alarm-level {
            flex-shrink: 0;
            width: 36px;
            height: 36px;
            border-radius: 4px;
            color: #fff;
            font-size: 11px;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            line-height: 1.1;
            padding: 2px;
            align-self: flex-start;
        }

        .alarm-body {
            flex: 1;
            min-width: 0;
            display: flex;
            flex-direction: column;
            gap: 2px;

            .alarm-head {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 8px;

                .alarm-device {
                    font-weight: 600;
                    font-size: 13px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .alarm-time {
                    font-size: 11px;
                    color: var(--el-text-color-secondary);
                    flex-shrink: 0;
                }
            }
            .alarm-message {
                font-size: 12px;
                color: var(--el-text-color-regular);
                word-break: break-all;
            }
            .alarm-tags {
                display: flex;
                gap: 4px;
                margin-top: 2px;
            }
        }

        .alarm-actions {
            flex-shrink: 0;
            display: flex;
            flex-direction: column;
            gap: 4px;
            justify-content: center;
        }
    }
}
</style>
