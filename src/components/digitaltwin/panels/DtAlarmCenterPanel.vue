<script setup lang="ts" name="DtAlarmCenterPanel">
/**
 * 数字孪生 - 告警事件中心
 *
 * - 顶部统计卡片（info/warning/alarm/critical）
 * - 过滤工具栏（级别/状态/来源/关键字）
 * - 事件列表（带级别色条、确认/解决按钮）
 * - 实体联动：点击事件 → 通过 emit('locate-entity') 跳转到对应设备
 */
import { computed } from "vue";
import { i18n } from "@/lang";
import { ShSvgIcon } from "@/components/shared";
import type { UseDtAlarmStreamReturn } from "../composables/useDtAlarmStream";
import type {
  DtAlarmEvent,
  DtAlarmEventLevel,
  DtAlarmEventStatus,
} from "../types";

const props = defineProps<{
  alarmStream: UseDtAlarmStreamReturn;
  /** 浮动模式 */
  floating?: boolean;
}>();

const emit = defineEmits<{
  (e: "locate-entity", entityId: string): void;
  (e: "close"): void;
}>();

const stats = computed(() => props.alarmStream.stats.value);
const filteredEvents = computed(() => props.alarmStream.filteredEvents.value);
const filter = computed(() => props.alarmStream.filter.value);

const levelOptions = [
  { value: "all", labelKey: "digitaltwin.alarm.level.all" },
  { value: "info", labelKey: "digitaltwin.alarm.level.info" },
  { value: "warning", labelKey: "digitaltwin.alarm.level.warning" },
  { value: "alarm", labelKey: "digitaltwin.alarm.level.alarm" },
  { value: "critical", labelKey: "digitaltwin.alarm.level.critical" },
];
const statusOptions = [
  { value: "all", labelKey: "digitaltwin.alarm.status.all" },
  { value: "active", labelKey: "digitaltwin.alarm.status.active" },
  { value: "acknowledged", labelKey: "digitaltwin.alarm.status.acknowledged" },
  { value: "resolved", labelKey: "digitaltwin.alarm.status.resolved" },
];

const levelColorMap: Record<DtAlarmEventLevel, string> = {
  info: "#409EFF",
  warning: "#E6A23C",
  alarm: "#F56C6C",
  critical: "#AD0E0E",
};

const levelLabelMap: Record<DtAlarmEventLevel, string> = {
  info: "digitaltwin.alarm.level.info",
  warning: "digitaltwin.alarm.level.warning",
  alarm: "digitaltwin.alarm.level.alarm",
  critical: "digitaltwin.alarm.level.critical",
};

const statusLabelMap: Record<DtAlarmEventStatus, string> = {
  active: "digitaltwin.alarm.status.active",
  acknowledged: "digitaltwin.alarm.status.acknowledged",
  resolved: "digitaltwin.alarm.status.resolved",
};

const formatTime = (ts: number): string => {
  const d = new Date(ts);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
};

const handleLocate = (e: DtAlarmEvent): void => {
  if (e.entityId) emit("locate-entity", e.entityId);
};

const handleAck = (e: DtAlarmEvent, ev: Event): void => {
  ev.stopPropagation();
  props.alarmStream.acknowledge(e.id);
};

const handleResolve = (e: DtAlarmEvent, ev: Event): void => {
  ev.stopPropagation();
  props.alarmStream.resolve(e.id);
};

const handleAckAll = (): void => props.alarmStream.acknowledgeAll();
const handleClearResolved = (): void => props.alarmStream.clearResolved();
</script>

<template>
  <div class="dt-alarm-center" :class="{ floating }">
    <div class="panel-header">
      <span class="panel-title">
        <ShSvgIcon name="alarm" />
        {{ i18n("digitaltwin.alarm.title") }}
      </span>
      <span v-if="alarmStream.activeCount.value > 0" class="active-badge">
        {{ alarmStream.activeCount.value }}
      </span>
      <div style="flex: 1" />
      <el-button text size="small" @click="emit('close')">
        <ShSvgIcon name="close" />
      </el-button>
    </div>

    <div class="stats-cards">
      <div
        v-for="lv in [
          'critical',
          'alarm',
          'warning',
          'info',
        ] as DtAlarmEventLevel[]"
        :key="lv"
        class="stat-card"
        :class="`stat-${lv}`"
      >
        <div class="stat-num">{{ stats[lv] }}</div>
        <div class="stat-name">{{ i18n(levelLabelMap[lv] as any) }}</div>
      </div>
    </div>

    <div class="filter-bar">
      <el-select v-model="filter.level" size="small" style="width: 90px">
        <el-option
          v-for="o in levelOptions"
          :key="o.value"
          :label="i18n(o.labelKey as any)"
          :value="o.value"
        />
      </el-select>
      <el-select v-model="filter.status" size="small" style="width: 100px">
        <el-option
          v-for="o in statusOptions"
          :key="o.value"
          :label="i18n(o.labelKey as any)"
          :value="o.value"
        />
      </el-select>
      <el-input
        v-model="filter.keyword"
        size="small"
        :placeholder="i18n('digitaltwin.alarm.keywordPlaceholder')"
        clearable
        style="flex: 1"
      />
    </div>

    <div class="action-bar">
      <el-button
        size="small"
        type="primary"
        :disabled="alarmStream.activeCount.value === 0"
        @click="handleAckAll"
      >
        {{ i18n("digitaltwin.alarm.ackAll") }}
      </el-button>
      <el-button size="small" @click="handleClearResolved">
        {{ i18n("digitaltwin.alarm.clearResolved") }}
      </el-button>
    </div>

    <div class="event-list">
      <div v-if="filteredEvents.length === 0" class="empty">
        {{ i18n("digitaltwin.alarm.empty") }}
      </div>
      <div
        v-for="e in filteredEvents"
        :key="e.id"
        class="event-row"
        :class="{ clickable: e.entityId }"
        @click="handleLocate(e)"
      >
        <div
          class="level-bar"
          :style="{ background: levelColorMap[e.level] }"
        />
        <div class="event-content">
          <div class="event-header">
            <span
              class="event-level-tag"
              :style="{
                background: levelColorMap[e.level] + '22',
                color: levelColorMap[e.level],
              }"
            >
              {{ i18n(levelLabelMap[e.level] as any) }}
            </span>
            <span class="event-time">{{ formatTime(e.timestamp) }}</span>
            <span class="event-status" :class="`status-${e.status}`">
              {{ i18n(statusLabelMap[e.status] as any) }}
            </span>
          </div>
          <div class="event-title">{{ e.title }}</div>
          <div v-if="e.entityName" class="event-entity">
            <ShSvgIcon name="location" />
            {{ e.entityName }}
          </div>
          <div v-if="e.metric" class="event-metric">{{ e.metric }}</div>
          <div class="event-actions">
            <el-button
              v-if="e.status === 'active'"
              size="small"
              link
              @click="handleAck(e, $event)"
            >
              {{ i18n("digitaltwin.alarm.ack") }}
            </el-button>
            <el-button
              v-if="e.status !== 'resolved'"
              size="small"
              link
              @click="handleResolve(e, $event)"
            >
              {{ i18n("digitaltwin.alarm.resolve") }}
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dt-alarm-center {
  display: flex;
  flex-direction: column;
  background: var(--el-bg-color);
  border-radius: 6px;
  overflow: hidden;
  height: 100%;
  min-height: 400px;

  &.floating {
    position: fixed;
    top: 60px;
    right: 16px;
    width: 380px;
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
    gap: 8px;
    padding: 10px 12px;
    border-bottom: 1px solid var(--el-border-color-lighter);

    .panel-title {
      font-size: 13px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .active-badge {
      background: var(--el-color-danger);
      color: #fff;
      font-size: 11px;
      padding: 1px 8px;
      border-radius: 10px;
      font-weight: 600;
    }
  }

  .stats-cards {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 6px;
    padding: 10px;

    .stat-card {
      padding: 8px 4px;
      border-radius: 4px;
      text-align: center;
      background: var(--el-fill-color-light);

      .stat-num {
        font-size: 18px;
        font-weight: 700;
      }

      .stat-name {
        font-size: 10px;
        color: var(--el-text-color-secondary);
        margin-top: 2px;
      }

      &.stat-critical .stat-num {
        color: #ad0e0e;
      }

      &.stat-alarm .stat-num {
        color: #f56c6c;
      }

      &.stat-warning .stat-num {
        color: #e6a23c;
      }

      &.stat-info .stat-num {
        color: #409eff;
      }
    }
  }

  .filter-bar {
    display: flex;
    gap: 6px;
    padding: 0 10px 6px;
  }

  .action-bar {
    display: flex;
    gap: 6px;
    padding: 0 10px 8px;
  }

  .event-list {
    flex: 1;
    overflow-y: auto;
    padding: 0 10px 10px;

    .empty {
      text-align: center;
      color: var(--el-text-color-secondary);
      padding: 24px 0;
      font-size: 12px;
    }

    .event-row {
      display: flex;
      border: 1px solid var(--el-border-color-lighter);
      border-radius: 4px;
      margin-bottom: 6px;
      overflow: hidden;
      background: var(--el-bg-color-page);

      &.clickable {
        cursor: pointer;

        &:hover {
          background: var(--el-fill-color);
        }
      }

      .level-bar {
        width: 3px;
        flex-shrink: 0;
      }

      .event-content {
        flex: 1;
        padding: 6px 8px;
        min-width: 0;

        .event-header {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 4px;

          .event-level-tag {
            font-size: 10px;
            padding: 1px 5px;
            border-radius: 3px;
            font-weight: 600;
          }

          .event-time {
            font-size: 10px;
            color: var(--el-text-color-secondary);
            margin-left: auto;
          }

          .event-status {
            font-size: 10px;

            &.status-active {
              color: var(--el-color-danger);
            }

            &.status-acknowledged {
              color: var(--el-color-warning);
            }

            &.status-resolved {
              color: var(--el-color-success);
            }
          }
        }

        .event-title {
          font-size: 12px;
          font-weight: 500;
          color: var(--el-text-color-primary);
          margin-bottom: 2px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .event-entity {
          font-size: 11px;
          color: var(--el-text-color-secondary);
          display: flex;
          align-items: center;
          gap: 4px;
          margin-bottom: 2px;
        }

        .event-metric {
          font-size: 11px;
          color: var(--el-color-primary);
          font-family: monospace;
        }

        .event-actions {
          display: flex;
          gap: 8px;
          margin-top: 4px;
        }
      }
    }
  }
}
</style>
