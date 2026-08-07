<script setup lang="ts" name="IotDeviceDetailDialog">
import {computed} from "vue";
import {i18n} from "@/lang";
import StarHorseDialog from "@/components/comp/StarHorseDialog.vue";
import {
  ALARM_LEVEL_COLORS,
  ALARM_LEVEL_LABELS,
  findDevicePreset,
  IOT_STATUS_COLORS,
  STATUS_LABELS,
} from "../constants";
import type {IotAlarm, IotDevice} from "../types";

const props = defineProps<{
  visible: boolean;
  device: IotDevice | null;
  /** 该设备的最近告警（可选，由外部传入） */
  alarms?: IotAlarm[];
}>();

const emit = defineEmits<{
  (e: "update:visible", v: boolean): void;
}>();

const innerVisible = computed({
  get: () => props.visible,
  set: (v) => emit("update:visible", v),
});

/** 设备类型标签 */
const typeLabel = computed(() =>
    props.device ? findDevicePreset(props.device.type)?.label ?? props.device.type : "",
);

/** 状态标签与颜色 */
const statusInfo = computed(() => {
  if (!props.device) return {label: "", color: "#909399"};
  return {
    label: STATUS_LABELS[props.device.status] ?? props.device.status,
    color: IOT_STATUS_COLORS[props.device.status] ?? "#909399",
  };
});

/** 属性表格数据 */
const propertyRows = computed(() => {
  if (!props.device) return [];
  return Object.entries(props.device.properties).map(([k, v], idx) => ({
    key: k,
    value: typeof v === "object" ? JSON.stringify(v) : String(v),
    id: idx,
  }));
});

/** 指标列表 */
const metricRows = computed(() => props.device?.metrics ?? []);

/** 最近告警 */
const recentAlarms = computed(() => props.alarms ?? []);

/** 格式化时间 */
const formatTime = (ts: number): string => {
  if (!ts) return "-";
  const d = new Date(ts);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

/** 相对时间（最后在线） */
const relativeTime = (ts: number): string => {
  if (!ts) return "-";
  const diff = Date.now() - ts;
  if (diff < 60_000) return `${Math.floor(diff / 1000)}s`;
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}min`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h`;
  return `${Math.floor(diff / 86_400_000)}d`;
};
</script>

<template>
  <star-horse-dialog
      v-model="innerVisible"
      :title="i18n('iot.btn.detail')"
      box-width="60%"
      box-height="70%"
      :is-show-reset="false"
      :is-show-save="false"
      :self-func="true"
  >
    <div class="iot-device-detail">
      <template v-if="device">
        <!-- 基本信息 -->
        <div class="section">
          <div class="section-title">{{ i18n("iot.btn.detail") }}</div>
          <el-descriptions :column="2" border>
            <el-descriptions-item :label="i18n('iot.device.name')">
              {{ device.name }}
            </el-descriptions-item>
            <el-descriptions-item :label="i18n('iot.device.type')">
              {{ typeLabel }}
            </el-descriptions-item>
            <el-descriptions-item :label="i18n('iot.device.status')">
              <el-tag :style="{ color: statusInfo.color, borderColor: statusInfo.color }">
                {{ statusInfo.label }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item :label="i18n('iot.device.location')">
              {{ device.location || "-" }}
            </el-descriptions-item>
            <el-descriptions-item :label="i18n('iot.device.lastSeen')">
              {{ formatTime(device.lastSeen) }} ({{ relativeTime(device.lastSeen) }})
            </el-descriptions-item>
            <el-descriptions-item label="ID">
              {{ device.id }}
            </el-descriptions-item>
          </el-descriptions>
        </div>
        <!-- 设备属性 -->
        <div class="section">
          <div class="section-title">{{ i18n("iot.device.properties") }}</div>
          <el-table :data="propertyRows" border max-height="160">
            <el-table-column prop="key" label="Key" min-width="120"/>
            <el-table-column prop="value" label="Value" min-width="160"/>
          </el-table>
        </div>
        <!-- 实时指标 -->
        <div class="section">
          <div class="section-title">{{ i18n("iot.device.metrics") }}</div>
          <div v-if="metricRows.length === 0" class="empty-cell">
            {{ i18n("iot.chart.noData") }}
          </div>
          <div v-else class="metric-grid">
            <div
                v-for="m in metricRows"
                :key="m.name"
                class="metric-card"
            >
              <div class="metric-name">{{ m.name }}</div>
              <div class="metric-value">
                {{ m.value }}<span class="metric-unit">{{ m.unit }}</span>
              </div>
              <div class="metric-time">{{ formatTime(m.timestamp) }}</div>
            </div>
          </div>
        </div>
        <!-- 最近告警 -->
        <div class="section">
          <div class="section-title">{{ i18n("iot.alarm.title") }}</div>
          <div v-if="recentAlarms.length === 0" class="empty-cell">
            {{ i18n("iot.message.noAlarms") }}
          </div>
          <el-table v-else :data="recentAlarms" border max-height="160">
            <el-table-column :label="i18n('iot.alarm.level')" width="90">
              <template #default="{ row }">
                <el-tag

                    :style="{ color: ALARM_LEVEL_COLORS[row.level], borderColor: ALARM_LEVEL_COLORS[row.level] }"
                >
                  {{ ALARM_LEVEL_LABELS[row.level as keyof typeof ALARM_LEVEL_LABELS] }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="message" :label="i18n('iot.alarm.message')" min-width="200"/>
            <el-table-column :label="i18n('iot.alarm.time')" width="160">
              <template #default="{ row }">{{ formatTime(row.timestamp) }}</template>
            </el-table-column>
            <el-table-column :label="i18n('iot.alarm.resolve')" width="80">
              <template #default="{ row }">
                <el-tag v-if="row.resolved" type="success">
                  {{ i18n("iot.alarm.resolved") }}
                </el-tag>
                <el-tag v-else type="warning">
                  {{ i18n("iot.alarm.active") || "active" }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </template>
      <div v-else class="empty-cell">{{ i18n("iot.message.noDevices") }}</div>
    </div>
    <template #footer>
      <el-button @click="innerVisible = false">{{ i18n("dialog.close") }}</el-button>
    </template>
  </star-horse-dialog>
</template>

<script lang="ts">
export default {name: "IotDeviceDetailDialog"};
</script>

<style lang="scss" scoped>
.iot-device-detail {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
  overflow-y: auto;
  padding: 4px;

  .section {
    .section-title {
      font-weight: 600;
      font-size: 13px;
      margin-bottom: 6px;
      padding-left: 8px;
      border-left: 3px solid var(--el-color-primary);
    }
  }

  .empty-cell {
    padding: 20px;
    text-align: center;
    color: var(--el-text-color-placeholder);
    font-size: 13px;
    border: 1px dashed var(--el-border-color-lighter);
    border-radius: 4px;
  }

  .metric-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 8px;

    .metric-card {
      padding: 8px 10px;
      background: var(--el-fill-color-light);
      border: 1px solid var(--el-border-color-lighter);
      border-radius: 4px;

      .metric-name {
        font-size: 12px;
        color: var(--el-text-color-secondary);
      }

      .metric-value {
        font-size: 20px;
        font-weight: 700;
        color: var(--el-color-primary);
        line-height: 1.4;

        .metric-unit {
          font-size: 12px;
          font-weight: normal;
          color: var(--el-text-color-secondary);
          margin-left: 4px;
        }
      }

      .metric-time {
        font-size: 11px;
        color: var(--el-text-color-placeholder);
      }
    }
  }
}
</style>
