<template>
  <div class="sh-mobile-grid-picker">
    <!-- 已选数量提示 -->
    <div class="sh-mobile-grid-picker__bar">
      <span class="sh-mobile-grid-picker__count">{{ i18n('item.selectedData') }}({{ selected.length }})</span>
      <span class="sh-mobile-grid-picker__clear" @click="clearAll">{{ i18n('message.clear') }}</span>
    </div>

    <!-- 年份选择 -->
    <template v-if="mode === 'year'">
      <div class="sh-mobile-grid-picker__year-nav">
        <span class="sh-mobile-grid-picker__nav-btn" @click="prevYear">‹</span>
        <span class="sh-mobile-grid-picker__nav-title">{{ yearRangeStart }}-{{ yearRangeEnd }}</span>
        <span class="sh-mobile-grid-picker__nav-btn" @click="nextYear">›</span>
      </div>
      <div class="sh-mobile-grid-picker__grid">
        <div
            v-for="item in yearPageItems"
            :key="item.value"
            class="sh-mobile-grid-picker__cell"
            :class="{ 'is-selected': isSelected(item.value) }"
            @click="toggleItem(item.value)"
        >{{ item.label }}
        </div>
      </div>
    </template>

    <!-- 月份选择 -->
    <template v-else-if="mode === 'month'">
      <div class="sh-mobile-grid-picker__nav">
        <div class="sh-mobile-grid-picker__nav-left">
          <template v-if="!isEveryYear">
            <span class="sh-mobile-grid-picker__nav-btn" @click="prevYear">‹</span>
            <span class="sh-mobile-grid-picker__nav-title">{{ curYear }}{{ i18n('cron.year') }}</span>
            <span class="sh-mobile-grid-picker__nav-btn" @click="nextYear">›</span>
          </template>
          <span v-else class="sh-mobile-grid-picker__nav-title">{{ i18n('cron.everyYear') }}</span>
        </div>
        <span
            class="sh-mobile-grid-picker__nav-toggle"
            :class="{ 'is-active': isEveryYear }"
            @click="toggleEveryYear"
        >{{ i18n('cron.everyYear') }}</span>
      </div>
      <div class="sh-mobile-grid-picker__grid">
        <div
            v-for="item in monthItems"
            :key="item.value"
            class="sh-mobile-grid-picker__cell"
            :class="{ 'is-selected': isSelected(item.value) }"
            @click="toggleItem(item.value)"
        >{{ item.label }}
        </div>
      </div>
    </template>

    <!-- 日期日历 -->
    <template v-else-if="mode === 'date'">
      <div class="sh-mobile-grid-picker__cal">
        <div class="sh-mobile-grid-picker__cal-nav">
          <span class="sh-mobile-grid-picker__cal-btn" @click="prevMonth">‹</span>
          <span class="sh-mobile-grid-picker__cal-title">{{ calYear }}{{ i18n('cron.year') }}{{
              calMonth + 1
            }}{{ i18n('cron.month') }}</span>
          <span class="sh-mobile-grid-picker__cal-btn" @click="nextMonth">›</span>
        </div>
        <div class="sh-mobile-grid-picker__cal-weekdays">
          <span v-for="(w, i) in weekdays" :key="i">{{ w }}</span>
        </div>
        <div class="sh-mobile-grid-picker__cal-days">
          <div
              v-for="(day, i) in calDays"
              :key="i"
              class="sh-mobile-grid-picker__cal-day"
              :class="{
              'is-other-month': !day.currentMonth,
              'is-selected': day.currentMonth && isSelected(day.value)
            }"
              @click="day.currentMonth && toggleItem(day.value)"
          >
            <span class="sh-mobile-grid-picker__cal-day-inner">{{ day.label }}</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import {computed, ref, watch} from "vue";
import {i18n} from "@/lang";

type GridMode = "year" | "month" | "date";

const props = withDefaults(
    defineProps<{
      modelValue: any[];
      mode: GridMode;
      valueFormat?: string;
      minYear?: number;
      maxYear?: number;
      /** 月份多选时是否为"每年"模式（不绑定年份，值仅为 MM） */
      everyYear?: boolean;
    }>(),
    {
      valueFormat: "",
      minYear: 1900,
      maxYear: 2099,
      everyYear: false,
    },
);

const emit = defineEmits<{
  (e: "update:modelValue", val: any[]): void;
  (e: "change", val: any[]): void;
  (e: "update:everyYear", val: boolean): void;
  (e: "everyYearChange", val: boolean): void;
}>();

const selected = ref<any[]>([]);

/** 内部每年模式状态（可由用户在界面切换） */
const isEveryYear = ref(props.everyYear);

/** 切换每年模式：清空已选（值格式不同），通知父组件 */
const toggleEveryYear = () => {
  isEveryYear.value = !isEveryYear.value;
  // 切换模式时清空已选，防止 YYYY-MM 与 MM 格式混淆
  selected.value = [];
  emit("update:modelValue", []);
  emit("change", []);
  emit("update:everyYear", isEveryYear.value);
  emit("everyYearChange", isEveryYear.value);
};

watch(
    () => props.modelValue,
    (val) => {
      if (Array.isArray(val)) {
        selected.value = [...val];
      } else if (val && !Array.isArray(val)) {
        selected.value = [val];
      } else {
        selected.value = [];
      }
    },
    {immediate: true},
);

const weekdays = computed(() => i18n('comp.weekdays').split(','));

// ===== 年份导航 =====
const yearRangeStart = ref(0);
const yearRangeEnd = ref(0);

// 初始化年份范围
watch(
    () => props.mode,
    () => {
      if (props.mode === "year") {
        // 初始化为当前年份所在的十年
        const now = new Date().getFullYear();
        yearRangeStart.value = Math.floor(now / 10) * 10;
        yearRangeEnd.value = yearRangeStart.value + 9;
      }
    },
    {immediate: true},
);

const prevYear = () => {
  if (props.mode === "year") {
    yearRangeStart.value -= 10;
    yearRangeEnd.value -= 10;
  } else {
    curYear.value--;
  }
};

const nextYear = () => {
  if (props.mode === "year") {
    yearRangeStart.value += 10;
    yearRangeEnd.value += 10;
  } else {
    curYear.value++;
  }
};

// ===== 年份页项目 =====
const yearPageItems = computed(() => {
  const items: { label: string; value: string }[] = [];
  for (let y = yearRangeStart.value; y <= yearRangeEnd.value; y++) {
    items.push({label: `${y}${i18n('cron.year')}`, value: String(y)});
  }
  return items;
});

// ===== 月份模式：当前年份 =====
const curYear = ref(new Date().getFullYear());

// 根据已选值推断起始年份
watch(
    () => selected.value,
    (val) => {
      if (props.mode === "year" && val.length > 0) {
        // 年份模式：selected 存的是 "2024" 这样的字符串
        const nums = val.map((v: any) => parseInt(String(v))).filter((n: number) => !isNaN(n));
        if (nums.length) {
          const minY = Math.min(...nums);
          yearRangeStart.value = Math.floor(minY / 10) * 10;
          yearRangeEnd.value = yearRangeStart.value + 9;
        }
      } else if (props.mode === "month" && val.length > 0 && !isEveryYear.value) {
        // 月份模式（非每年）：selected 存的是 "2024-01" 这样的格式
        const nums = val
            .map((v: any) => {
              const parts = String(v).split("-");
              return parseInt(parts[0]);
            })
            .filter((n: number) => !isNaN(n));
        if (nums.length) {
          curYear.value = nums[0];
        }
      } else if (props.mode === "date" && val.length > 0) {
        // 日期模式：selected 存的是 "2024-01-15" 这样的格式
        const nums = val
            .map((v: any) => {
              const parts = String(v).split("-");
              return parseInt(parts[0]);
            })
            .filter((n: number) => !isNaN(n));
        if (nums.length) {
          calYear.value = nums[0];
          calMonth.value = parseInt(String(selected.value[0]).split("-")[1]) - 1;
        }
      }
    },
    {immediate: true},
);

const monthItems = computed(() => {
  if (isEveryYear.value) {
    // 每年模式：值仅为 MM，不绑定年份
    return Array.from({length: 12}, (_, i) => ({
      label: `${i + 1}${i18n('cron.month')}`,
      value: String(i + 1).padStart(2, "0"),
    }));
  }
  // 正常模式：月份值格式 YYYY-MM
  return Array.from({length: 12}, (_, i) => ({
    label: `${i + 1}${i18n('cron.month')}`,
    value: `${curYear.value}-${String(i + 1).padStart(2, "0")}`,
  }));
});

// ===== 日历 =====
const calYear = ref(new Date().getFullYear());
const calMonth = ref(new Date().getMonth());

const calDays = computed(() => {
  const firstDay = new Date(calYear.value, calMonth.value, 1);
  const startWeekday = firstDay.getDay();
  const daysInMonth = new Date(calYear.value, calMonth.value + 1, 0).getDate();
  const prevDaysInMonth = new Date(calYear.value, calMonth.value, 0).getDate();

  const days: { label: number; value: string; currentMonth: boolean }[] = [];

  for (let i = startWeekday - 1; i >= 0; i--) {
    const d = prevDaysInMonth - i;
    const pm = calMonth.value === 0 ? 11 : calMonth.value - 1;
    const py = calMonth.value === 0 ? calYear.value - 1 : calYear.value;
    days.push({
      label: d,
      value: formatDateValue(py, pm + 1, d),
      currentMonth: false,
    });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    days.push({
      label: d,
      value: formatDateValue(calYear.value, calMonth.value + 1, d),
      currentMonth: true,
    });
  }

  const remaining = 42 - days.length;
  for (let d = 1; d <= remaining; d++) {
    const nm = calMonth.value === 11 ? 0 : calMonth.value + 1;
    const ny = calMonth.value === 11 ? calYear.value + 1 : calYear.value;
    days.push({
      label: d,
      value: formatDateValue(ny, nm + 1, d),
      currentMonth: false,
    });
  }

  return days;
});

function formatDateValue(y: number, m: number, d: number): string {
  const fmt = props.valueFormat || "YYYY-MM-DD";
  return fmt
      .replace("YYYY", String(y))
      .replace("MM", String(m).padStart(2, "0"))
      .replace("DD", String(d).padStart(2, "0"));
}

function prevMonth() {
  if (calMonth.value === 0) {
    calMonth.value = 11;
    calYear.value--;
  } else {
    calMonth.value--;
  }
}

function nextMonth() {
  if (calMonth.value === 11) {
    calMonth.value = 0;
    calYear.value++;
  } else {
    calMonth.value++;
  }
}

function isSelected(value: string): boolean {
  return selected.value.includes(value);
}

function toggleItem(value: string) {
  const idx = selected.value.indexOf(value);
  if (idx >= 0) {
    selected.value.splice(idx, 1);
  } else {
    selected.value.push(value);
  }
  emit("update:modelValue", [...selected.value]);
  emit("change", [...selected.value]);
}

function clearAll() {
  selected.value = [];
  emit("update:modelValue", []);
  emit("change", []);
}

function getSelectedValues(): any[] {
  return [...selected.value];
}

defineExpose({getSelectedValues});
</script>

<style lang="scss" scoped>
.sh-mobile-grid-picker {
  width: 100%;
  user-select: none;
  -webkit-user-select: none;
  display: flex;
  flex-direction: column;
}

.sh-mobile-grid-picker__bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 14px;
  border-bottom: 1px solid var(--el-border-color-lighter, #ebeef5);
  flex-shrink: 0;
}

.sh-mobile-grid-picker__count {
  font-size: 13px;
  color: var(--el-text-color-secondary, #909399);
}

.sh-mobile-grid-picker__clear {
  font-size: 13px;
  color: var(--el-color-danger, #f56c6c);
  cursor: pointer;
}

/* ===== 年份/月份 网格通用 ===== */
.sh-mobile-grid-picker__nav,
.sh-mobile-grid-picker__year-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 14px;
  flex-shrink: 0;
}

.sh-mobile-grid-picker__nav-left {
  display: flex;
  align-items: center;
  gap: 4px;
}

.sh-mobile-grid-picker__nav-toggle {
  padding: 4px 12px;
  font-size: 13px;
  border-radius: 14px;
  border: 1px solid var(--el-border-color, #dcdfe6);
  color: var(--el-text-color-regular, #606266);
  background: #fff;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.15s;

  &:active {
    transform: scale(0.95);
  }

  &.is-active {
    background: var(--el-color-primary, #409eff);
    border-color: var(--el-color-primary, #409eff);
    color: #fff;
    font-weight: 600;
  }
}

.sh-mobile-grid-picker__nav-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary, #303133);
}

.sh-mobile-grid-picker__nav-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  color: var(--el-text-color-regular, #606266);
  cursor: pointer;
  border-radius: 50%;
  flex-shrink: 0;

  &:active {
    background: var(--el-fill-color, #f0f2f5);
  }
}

.sh-mobile-grid-picker__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  padding: 10px 14px;
  flex: 1;
  overflow-y: auto;
}

.sh-mobile-grid-picker__cell {
  padding: 12px 0;
  text-align: center;
  font-size: 15px;
  border: 1px solid var(--el-border-color-lighter, #ebeef5);
  border-radius: 8px;
  background: #fff;
  color: var(--el-text-color-regular, #606266);
  transition: all 0.15s;
  cursor: pointer;

  &:active {
    transform: scale(0.95);
  }

  &.is-selected {
    background: var(--el-color-primary, #409eff);
    border-color: var(--el-color-primary, #409eff);
    color: #fff;
    font-weight: 600;
  }
}

/* ===== 日历 ===== */
.sh-mobile-grid-picker__cal {
  display: flex;
  flex-direction: column;
  padding: 0 14px 10px;
  flex: 1;
  overflow: hidden;
}

.sh-mobile-grid-picker__cal-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0 10px;
  flex-shrink: 0;
}

.sh-mobile-grid-picker__cal-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  color: var(--el-text-color-regular, #606266);
  cursor: pointer;
  border-radius: 50%;

  &:active {
    background: var(--el-fill-color, #f0f2f5);
  }
}

.sh-mobile-grid-picker__cal-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary, #303133);
}

.sh-mobile-grid-picker__cal-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  margin-bottom: 4px;
  flex-shrink: 0;

  span {
    font-size: 12px;
    color: var(--el-text-color-secondary, #909399);
    padding: 2px 0;
  }
}

.sh-mobile-grid-picker__cal-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  flex: 1;
  align-content: start;
}

.sh-mobile-grid-picker__cal-day {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  font-size: 14px;
  color: var(--el-text-color-regular, #606266);
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.12s;
  position: relative;

  &.is-other-month {
    color: var(--el-text-color-placeholder, #c0c4cc);
  }

  &:active {
    transform: scale(0.92);
  }

  &.is-selected {
    color: #fff;
    font-weight: 600;

    /* 小圆点背景，不是整个单元格 */
    .sh-mobile-grid-picker__cal-day-inner {
      position: relative;
      z-index: 1;
    }

    &::before {
      content: "";
      position: absolute;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--el-color-primary, #409eff);
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 0;
    }
  }
}

.sh-mobile-grid-picker__cal-day-inner {
  position: relative;
  z-index: 1;
  line-height: 32px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
