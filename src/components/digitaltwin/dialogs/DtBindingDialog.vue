<script setup lang="ts" name="DtBindingDialog">
/**
 * 数字孪生 - 数据绑定编辑弹窗
 *
 * 新增/编辑数据绑定配置（名称/数据源/地址/路径/目标属性/变换/告警阈值/采样间隔）
 */
import { computed, ref, watch } from "vue";
import { i18n } from "@/lang";
import { ElMessage } from "element-plus";
import { dtGenId } from "../constants";
import type {
  DtAlarmLevel,
  DtAlarmOp,
  DtBindingSourceType,
  DtDataBinding,
} from "../types";
import { StarHorsePanel } from "@/components/comp";

const props = defineProps<{
  visible: boolean;
  /** 编辑时传入绑定 ID，新增时为 null */
  bindingId?: string | null;
  /** 编辑时传入源绑定 */
  sourceBinding?: DtDataBinding | null;
  /** 关联实体 ID（生成绑定 id 时使用） */
  entityId?: string;
  dialogType?: "dialog" | "drawer";
}>();

const emit = defineEmits<{
  (e: "update:visible", v: boolean): void;
  (e: "submit", binding: DtDataBinding, isNew: boolean): void;
}>();

const innerVisible = computed({
  get: () => props.visible,
  set: (v) => emit("update:visible", v),
});

const isNew = ref(true);
const form = ref<DtDataBinding>(createEmptyBinding());

function createEmptyBinding(): DtDataBinding {
  return {
    id: dtGenId(`binding_${props.entityId ?? "entity"}`),
    name: "",
    source: "mock",
    address: "",
    path: "value",
    targetProperty: "status",
    transform: "",
    interval: 1000,
  };
}

const sourceOptions: { value: DtBindingSourceType; labelKey: string }[] = [
  { value: "mqtt", labelKey: "digitaltwin.binding.sourceType.mqtt" },
  { value: "http", labelKey: "digitaltwin.binding.sourceType.http" },
  { value: "websocket", labelKey: "digitaltwin.binding.sourceType.websocket" },
  { value: "iot", labelKey: "digitaltwin.binding.sourceType.iot" },
  { value: "mock", labelKey: "digitaltwin.binding.sourceType.mock" },
];

const targetOptions = [
  { value: "status", labelKey: "digitaltwin.binding.target.status" },
  {
    value: "sensorData.temperature",
    labelKey: "digitaltwin.binding.target.sensor",
  },
  {
    value: "sensorData.pressure",
    labelKey: "digitaltwin.binding.target.sensor",
  },
  { value: "sensorData.speed", labelKey: "digitaltwin.binding.target.sensor" },
  { value: "sensorData.power", labelKey: "digitaltwin.binding.target.sensor" },
  {
    value: "sensorData.efficiency",
    labelKey: "digitaltwin.binding.target.sensor",
  },
];

const opOptions: DtAlarmOp[] = [">", "<", ">=", "<=", "=="];
const levelOptions: { value: DtAlarmLevel; labelKey: string }[] = [
  { value: "warning", labelKey: "digitaltwin.status.warning" },
  { value: "alarm", labelKey: "digitaltwin.status.alarm" },
];

const enableAlarm = ref(false);

watch(
  () => [props.visible, props.bindingId, props.sourceBinding] as const,
  ([visible, , source]) => {
    if (!visible) return;
    if (source) {
      form.value = JSON.parse(JSON.stringify(source));
      isNew.value = false;
      enableAlarm.value = !!source.alarmThreshold;
    } else {
      form.value = createEmptyBinding();
      isNew.value = true;
      enableAlarm.value = false;
    }
  },
  { immediate: true },
);

const handleSubmit = (): void => {
  if (!form.value.name.trim()) {
    ElMessage.warning(i18n("digitaltwin.binding.name"));
    return;
  }
  if (!form.value.address.trim()) {
    ElMessage.warning(i18n("digitaltwin.binding.address"));
    return;
  }
  // 处理告警阈值
  if (enableAlarm.value && form.value.alarmThreshold) {
    // 保留
  } else if (!enableAlarm.value) {
    form.value.alarmThreshold = undefined;
  }
  emit("submit", form.value, isNew.value);
  innerVisible.value = false;
};

const dialogTitle = computed(() =>
  isNew.value
    ? i18n("digitaltwin.binding.add")
    : i18n("digitaltwin.binding.edit"),
);
</script>

<template>
  <star-horse-panel
    :type="dialogType"
    v-model="innerVisible"
    :title="dialogTitle"
    box-width="560px"
    :self-func="true"
    @merge="handleSubmit"
  >
    <el-form :model="form" label-width="100px" size="default">
      <el-form-item :label="i18n('digitaltwin.binding.name')">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item :label="i18n('digitaltwin.binding.source')">
        <el-select v-model="form.source" style="width: 100%">
          <el-option
            v-for="opt in sourceOptions"
            :key="opt.value"
            :label="i18n(opt.labelKey as any)"
            :value="opt.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="i18n('digitaltwin.binding.address')">
        <el-input
          v-model="form.address"
          placeholder="mqtt://broker:1883/topic / http://api/... / ws://..."
        />
      </el-form-item>
      <el-form-item :label="i18n('digitaltwin.binding.path')">
        <el-input v-model="form.path" placeholder="value.temperature" />
      </el-form-item>
      <el-form-item :label="i18n('digitaltwin.binding.targetProperty')">
        <el-select v-model="form.targetProperty" style="width: 100%">
          <el-option
            v-for="opt in targetOptions"
            :key="opt.value"
            :label="i18n(opt.labelKey as any) + ' (' + opt.value + ')'"
            :value="opt.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="i18n('digitaltwin.binding.transform')">
        <el-input v-model="form.transform" placeholder="x * 0.01" />
      </el-form-item>
      <el-form-item :label="i18n('digitaltwin.binding.interval')">
        <el-input-number
          v-model="form.interval"
          :min="100"
          :step="500"
          style="width: 100%"
        />
      </el-form-item>

      <el-divider content-position="left">{{
        i18n("digitaltwin.binding.alarmThreshold")
      }}</el-divider>
      <el-form-item :label="i18n('digitaltwin.binding.alarmThreshold')">
        <el-switch v-model="enableAlarm" />
      </el-form-item>
      <template v-if="enableAlarm">
        <el-form-item :label="i18n('digitaltwin.binding.alarm.op')">
          <el-select v-model="form.alarmThreshold.op" style="width: 100%">
            <el-option
              v-for="op in opOptions"
              :key="op"
              :label="op"
              :value="op"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="i18n('digitaltwin.binding.alarm.value')">
          <el-input-number
            v-model="form.alarmThreshold.value"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item :label="i18n('digitaltwin.binding.alarm.level')">
          <el-select v-model="form.alarmThreshold.level" style="width: 100%">
            <el-option
              v-for="opt in levelOptions"
              :key="opt.value"
              :label="i18n(opt.labelKey as any)"
              :value="opt.value"
            />
          </el-select>
        </el-form-item>
      </template>
    </el-form>

    <template #footer>
      <el-button @click="innerVisible = false">{{
        i18n("digitaltwin.dialog.close")
      }}</el-button>
      <el-button type="primary" @click="handleSubmit">{{
        i18n("digitaltwin.dialog.confirm")
      }}</el-button>
    </template>
  </star-horse-panel>
</template>
