<template>
  <div class="sh-mobile-wheel-picker">
    <!-- 紧凑顶部栏：预览值 + 范围切换合并为一行 -->
    <div class="sh-mobile-wheel-picker__top">
      <template v-if="isRange">
        <span
            class="sh-mobile-wheel-picker__tab"
            :class="{ 'is-active': activeRange === 'start' }"
            @click="activeRange = 'start'"
        >{{ formatPreview(startValues) }}</span>
        <span class="sh-mobile-wheel-picker__sep">~</span>
        <span
            class="sh-mobile-wheel-picker__tab"
            :class="{ 'is-active': activeRange === 'end' }"
            @click="activeRange = 'end'"
        >{{ formatPreview(endValues) }}</span>
      </template>
      <template v-else>
        <span class="sh-mobile-wheel-picker__single">{{ formatPreview(currentValues) }}</span>
      </template>
    </div>

    <!-- 滚轮列：ref 用于 ResizeObserver 获取实际渲染尺寸 -->
    <div ref="columnsRef" class="sh-mobile-wheel-picker__columns" :style="{ height: columnHeight + 'px' }">
      <div
          v-for="col in columns"
          :key="col.key"
          class="sh-mobile-wheel-picker__column"
          :class="[`col-${col.key}`]"
          @touchstart="onTouchStart(col.key, $event)"
          @touchmove.prevent="onTouchMove(col.key, $event)"
          @touchend="onTouchEnd(col.key)"
          @mousedown="onMouseDown(col.key, $event)"
          @wheel.prevent="onWheelScroll(col.key, $event)"
          @click="onColumnClick(col.key, $event)"
      >
        <!-- 顶部快捷按钮：跳到第一项 -->
        <div
            class="sh-mobile-wheel-picker__btn sh-mobile-wheel-picker__btn--top"
            @click.stop="jumpToFirst(col.key)"
            @touchstart.stop="jumpToFirst(col.key)"
        >
          <span>▲</span>
        </div>
        <!-- 底部快捷按钮：跳到最后一项 -->
        <div
            class="sh-mobile-wheel-picker__btn sh-mobile-wheel-picker__btn--bottom"
            @click.stop="jumpToLast(col.key)"
            @touchstart.stop="jumpToLast(col.key)"
        >
          <span>▼</span>
        </div>
        <div class="sh-mobile-wheel-picker__track" :style="trackStyle(col.key)">
          <div
              v-for="(item, i) in col.items"
              :key="i"
              class="sh-mobile-wheel-picker__item"
              :style="{ height: ITEM_HEIGHT + 'px', lineHeight: ITEM_HEIGHT + 'px' }"
              :class="{ 'is-selected': i === getActiveIndex(col.key) }"
          >{{ item.label }}
          </div>
        </div>
        <div class="sh-mobile-wheel-picker__mask sh-mobile-wheel-picker__mask--top"/>
        <div class="sh-mobile-wheel-picker__mask sh-mobile-wheel-picker__mask--bottom"/>
      </div>
      <div class="sh-mobile-wheel-picker__indicator"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, nextTick, onBeforeUnmount, onMounted, ref, watch} from "vue";

type WheelType =
    | "year" | "month" | "date" | "datetime" | "time"
    | "yearrange" | "monthrange" | "daterange" | "datetimerange" | "timerange";

interface WheelValues {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}

interface ColumnItem {
  label: string;
  value: number;
}

interface Column {
  key: string;
  items: ColumnItem[];
}

const props = withDefaults(
    defineProps<{
      modelValue: any;
      type: WheelType;
      valueFormat?: string;
      minYear?: number;
      maxYear?: number;
      showSecond?: boolean;
    }>(),
    {
      valueFormat: "",
      minYear: 1900,
      maxYear: 2099,
      showSecond: false,
    },
);

const emit = defineEmits<{
  (e: "update:modelValue", val: any): void;
  (e: "change", val: any): void;
}>();

const ITEM_HEIGHT = 36;
const visibleCount = 5;
const columnHeight = ref(ITEM_HEIGHT * visibleCount);
const indicatorTop = ref(Math.floor(visibleCount / 2) * ITEM_HEIGHT);

const columnsRef = ref<HTMLElement | null>(null);
let resizeObserver: ResizeObserver | null = null;

function measureColumns() {
  const el = columnsRef.value;
  if (!el) return;
  const h = el.clientHeight;
  if (h > 0) {
    columnHeight.value = h;
    indicatorTop.value = h / 2 - ITEM_HEIGHT / 2;
  }
}

onMounted(() => {
  nextTick(() => {
    measureColumns();
    if (columnsRef.value) {
      resizeObserver = new ResizeObserver(() => measureColumns());
      resizeObserver.observe(columnsRef.value);
    }
  });
});

onBeforeUnmount(() => {
  if (resizeObserver && columnsRef.value) {
    resizeObserver.unobserve(columnsRef.value);
    resizeObserver = null;
  }
});

const now = new Date();

const isRange = computed(() => props.type.endsWith("range"));
const baseType = computed(() => props.type.replace("range", ""));

const hasYear = computed(() => ["year", "month", "date", "datetime"].includes(baseType.value));
const hasMonth = computed(() => ["month", "date", "datetime"].includes(baseType.value));
const hasDay = computed(() => ["date", "datetime"].includes(baseType.value));
const hasTime = computed(() => ["datetime", "time"].includes(baseType.value));
const hasSecond = computed(() => {
  if (props.showSecond) return true;
  const fmt = props.valueFormat || getDefaultFormat();
  return fmt.includes("ss");
});

function initValues(): WheelValues {
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
    hour: now.getHours(),
    minute: now.getMinutes(),
    second: now.getSeconds(),
  };
}

const currentValues = ref<WheelValues>(initValues());
const startValues = ref<WheelValues>(initValues());
const endValues = ref<WheelValues>({
  ...initValues(),
  hour: now.getHours() + 1,
  minute: 0,
  second: 0,
});
const activeRange = ref<"start" | "end">("start");

const activeValues = computed<WheelValues>(() => {
  if (isRange.value) {
    return activeRange.value === "start" ? startValues.value : endValues.value;
  }
  return currentValues.value;
});

// ===== 列定义 =====
const yearItems = computed<ColumnItem[]>(() => {
  const items: ColumnItem[] = [];
  for (let y = props.minYear; y <= props.maxYear; y++) {
    items.push({label: `${y}年`, value: y});
  }
  return items;
});

// 循环列：数据重复3份实现无限滚动
const CYCLE_REPEAT = 3;

type MakeCyclicOpts = {
  padZero?: boolean;
  startAtOne?: boolean;
  suffix?: string;
};

function makeCyclicItems(count: number, opts: MakeCyclicOpts = {}): ColumnItem[] {
  const {padZero = false, startAtOne = false, suffix = ""} = opts;
  const result: ColumnItem[] = [];
  for (let r = 0; r < CYCLE_REPEAT; r++) {
    for (let i = 0; i < count; i++) {
      const display = startAtOne ? i + 1 : i;
      const label = padZero
          ? `${String(display).padStart(2, "0")}${suffix}`
          : `${display}${suffix}`;
      result.push({label, value: startAtOne ? i + 1 : i});
    }
  }
  return result;
}

// 月：1-12，不补0，后缀"月"
const monthItems: ColumnItem[] = makeCyclicItems(12, {startAtOne: true, suffix: "月"});

// 日：1-当月天数，不补0，后缀"日"，动态生成
const dayItems = computed<ColumnItem[]>(() => {
  const v = activeValues.value;
  const days = new Date(v.year, v.month, 0).getDate();
  return makeCyclicItems(days, {startAtOne: true, suffix: "日"});
});

// 时：0-23，补0，后缀"时"
const hourItems: ColumnItem[] = makeCyclicItems(24, {padZero: true, suffix: "时"});
// 分：0-59，补0，后缀"分"
const minuteItems: ColumnItem[] = makeCyclicItems(60, {padZero: true, suffix: "分"});
// 秒：0-59，补0，后缀"秒"
const secondItems: ColumnItem[] = makeCyclicItems(60, {padZero: true, suffix: "秒"});

// 哪些列是循环列
function isCyclic(key: string): boolean {
  return key === "month" || key === "day" || key === "hour" || key === "minute" || key === "second";
}

// 循环列的基础长度（单组）
function getCycleBaseLen(key: string): number {
  switch (key) {
    case "month":
      return 12;
    case "day":
      return new Date(activeValues.value.year, activeValues.value.month, 0).getDate();
    case "hour":
      return 24;
    case "minute":
      return 60;
    case "second":
      return 60;
    default:
      return 0;
  }
}

const columns = computed<Column[]>(() => {
  const cols: Column[] = [];
  if (hasYear.value) cols.push({key: "year", items: yearItems.value});
  if (hasMonth.value) cols.push({key: "month", items: monthItems});
  if (hasDay.value) cols.push({key: "day", items: dayItems.value});
  if (hasTime.value) {
    cols.push({key: "hour", items: hourItems});
    cols.push({key: "minute", items: minuteItems});
    if (hasSecond.value) cols.push({key: "second", items: secondItems});
  }
  return cols;
});

// ===== 选中索引 =====
function getActiveIndex(key: string): number {
  const v = activeValues.value as any;
  const col = columns.value.find((c) => c.key === key);
  if (!col) return 0;
  const actualValue = v[key];

  if (isCyclic(key)) {
    // 循环列：定位到中间组
    const baseLen = getCycleBaseLen(key);
    const baseIdx = col.items.slice(0, baseLen).findIndex((it) => it.value === actualValue);
    if (baseIdx < 0) return baseLen;
    return baseLen + baseIdx;
  }

  const idx = col.items.findIndex((it) => it.value === actualValue);
  return idx >= 0 ? idx : 0;
}

// 跳回中间组时关闭动画
const skipTransition = ref(false);

function trackStyle(key: string): Record<string, string> {
  if (dragState.value && dragState.value.key === key) {
    return {
      transform: `translate3d(0, ${dragState.value.currentOffset}px, 0)`,
      transition: "none",
    };
  }
  const idx = getActiveIndex(key);
  const offset = indicatorTop.value - idx * ITEM_HEIGHT;
  return {
    transform: `translate3d(0, ${offset}px, 0)`,
    transition: skipTransition.value ? "none" : "transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)",
  };
}

function clampIndex(key: string, idx: number): number {
  const col = columns.value.find((c) => c.key === key);
  if (!col) return 0;
  // 循环列不限制范围
  if (isCyclic(key)) return idx;
  return Math.max(0, Math.min(col.items.length - 1, idx));
}

function setValue(key: string, idx: number) {
  const col = columns.value.find((c) => c.key === key);
  if (!col) return;

  let actualIdx = idx;
  if (isCyclic(key)) {
    // 循环列：取模获取实际值
    const baseLen = getCycleBaseLen(key);
    actualIdx = ((idx % baseLen) + baseLen) % baseLen;
  } else {
    actualIdx = clampIndex(key, idx);
  }

  const item = col.items[actualIdx];
  if (!item) return;

  const target = activeValues.value;
  (target as any)[key] = item.value;

  if (key === "year" || key === "month") {
    const days = new Date(target.year, target.month, 0).getDate();
    if (target.day > days) target.day = days;
  }

  if (isRange.value) {
    syncEndIfNeeded();
  }
}

// 循环列拖拽结束后：静默跳回中间组，无闪烁
function normalizeCyclePosition(key: string) {
  if (!isCyclic(key)) return;
  skipTransition.value = true;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      skipTransition.value = false;
    });
  });
}

// 当 start 日期/时间 > end 时，将 end 自动调整为 start + 1 单位
function syncEndIfNeeded() {
  const s = startValues.value;
  const e = endValues.value;
  const sd = new Date(s.year, s.month - 1, s.day, s.hour, s.minute, s.second);
  const ed = new Date(e.year, e.month - 1, e.day, e.hour, e.minute, e.second);

  if (ed >= sd) return;

  const baseType = props.type.replace("range", "");
  const newEnd = new Date(sd);

  switch (baseType) {
    case "year":
      newEnd.setFullYear(sd.getFullYear() + 1);
      break;
    case "month":
      newEnd.setMonth(sd.getMonth() + 1);
      break;
    case "date":
      newEnd.setDate(sd.getDate() + 1);
      break;
    case "datetime":
      newEnd.setDate(sd.getDate() + 1);
      break;
    case "time":
      newEnd.setHours(sd.getHours() + 1);
      break;
    default:
      newEnd.setDate(sd.getDate() + 1);
  }

  // 范围不能超过最大值
  const now = new Date();
  const maxEnd = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
  if (newEnd > maxEnd) return;

  endValues.value = {
    year: newEnd.getFullYear(),
    month: newEnd.getMonth() + 1,
    day: newEnd.getDate(),
    hour: newEnd.getHours(),
    minute: newEnd.getMinutes(),
    second: newEnd.getSeconds(),
  };
}

// ===== 拖拽 =====
const dragState = ref<{
  key: string;
  startY: number;
  startOffset: number;
  currentOffset: number;
} | null>(null);

// 拖拽判断：区分"点击"和"拖拽"
const wasDragging = ref(false);
let dragStartY = 0;
const DRAG_THRESHOLD = 5;

function onTouchStart(key: string, e: TouchEvent) {
  const idx = getActiveIndex(key);
  dragStartY = e.touches[0].clientY;
  wasDragging.value = false;
  dragState.value = {
    key,
    startY: e.touches[0].clientY,
    startOffset: indicatorTop.value - idx * ITEM_HEIGHT,
    currentOffset: indicatorTop.value - idx * ITEM_HEIGHT,
  };
}

function onTouchMove(key: string, e: TouchEvent) {
  if (!dragState.value || dragState.value.key !== key) return;
  const delta = e.touches[0].clientY - dragState.value.startY;
  if (Math.abs(delta) > DRAG_THRESHOLD) wasDragging.value = true;
  dragState.value.currentOffset = dragState.value.startOffset + delta;
}

function onTouchEnd(key: string) {
  if (!dragState.value || dragState.value.key !== key) return;
  const offset = dragState.value.currentOffset;
  const idx = Math.round((indicatorTop.value - offset) / ITEM_HEIGHT);
  setValue(key, idx);
  dragState.value = null;
  normalizeCyclePosition(key);
}

function onMouseDown(key: string, e: MouseEvent) {
  const idx = getActiveIndex(key);
  const startY = e.clientY;
  dragStartY = startY;
  wasDragging.value = false;
  const startOffset = indicatorTop.value - idx * ITEM_HEIGHT;
  let currentOffset = startOffset;

  const onMove = (ev: MouseEvent) => {
    const delta = ev.clientY - startY;
    if (Math.abs(delta) > DRAG_THRESHOLD) wasDragging.value = true;
    currentOffset = startOffset + delta;
    dragState.value = {key, startY, startOffset, currentOffset};
  };

  const onUp = () => {
    const idx2 = Math.round((indicatorTop.value - currentOffset) / ITEM_HEIGHT);
    setValue(key, idx2);
    dragState.value = null;
    normalizeCyclePosition(key);
    document.removeEventListener("mousemove", onMove);
    document.removeEventListener("mouseup", onUp);
  };

  document.addEventListener("mousemove", onMove);
  document.addEventListener("mouseup", onUp);
}

// ===== 点击选中：点击选中区域上方/下方直接选中最近的数字 =====
function onColumnClick(key: string, e: MouseEvent) {
  if (wasDragging.value) return;
  const column = e.currentTarget as HTMLElement;
  const rect = column.getBoundingClientRect();
  const clickY = e.clientY - rect.top;
  const centerY = rect.height / 2;
  // 点击位置距离中心的格数
  const offset = Math.round((centerY - clickY) / ITEM_HEIGHT);
  if (offset === 0) return;
  const newIndex = getActiveIndex(key) - offset;
  setValue(key, newIndex);
  normalizeCyclePosition(key);
}

// ===== 快捷跳转：跳到第一项/最后一项 =====
function jumpToFirst(key: string) {
  const col = columns.value.find((c) => c.key === key);
  if (!col) return;
  if (isCyclic(key)) {
    // 循环列：跳到中间组的第一项
    const baseLen = getCycleBaseLen(key);
    setValue(key, baseLen);
  } else {
    setValue(key, 0);
  }
  normalizeCyclePosition(key);
}

function jumpToLast(key: string) {
  const col = columns.value.find((c) => c.key === key);
  if (!col) return;
  if (isCyclic(key)) {
    // 循环列：跳到中间组的最后一项
    const baseLen = getCycleBaseLen(key);
    setValue(key, baseLen + baseLen - 1);
  } else {
    setValue(key, col.items.length - 1);
  }
  normalizeCyclePosition(key);
}

function onWheelScroll(key: string, e: WheelEvent) {
  const delta = e.deltaY > 0 ? 1 : -1;
  setValue(key, getActiveIndex(key) + delta);
  normalizeCyclePosition(key);
}

// ===== 格式化 =====
function getDefaultFormat(): string {
  switch (baseType.value) {
    case "year":
      return "YYYY";
    case "month":
      return "YYYY-MM";
    case "date":
      return "YYYY-MM-DD";
    case "datetime":
      return "YYYY-MM-DD HH:mm:ss";
    case "time":
      return hasSecond.value ? "HH:mm:ss" : "HH:mm";
    default:
      return "YYYY-MM-DD";
  }
}

function formatValue(v: WheelValues): string {
  const fmt = props.valueFormat || getDefaultFormat();
  return fmt
      .replace("YYYY", String(v.year))
      .replace("MM", String(v.month).padStart(2, "0"))
      .replace("DD", String(v.day).padStart(2, "0"))
      .replace("HH", String(v.hour).padStart(2, "0"))
      .replace("mm", String(v.minute).padStart(2, "0"))
      .replace("ss", String(v.second).padStart(2, "0"));
}

function formatPreview(v: WheelValues): string {
  const parts: string[] = [];
  if (hasYear.value) parts.push(`${v.year}年`);
  if (hasMonth.value) parts.push(`${v.month}月`);
  if (hasDay.value) parts.push(`${v.day}日`);
  if (hasTime.value) {
    const h = String(v.hour).padStart(2, "0");
    const m = String(v.minute).padStart(2, "0");
    if (hasSecond.value) {
      const s = String(v.second).padStart(2, "0");
      parts.push(`${h}时${m}分${s}秒`);
    } else {
      parts.push(`${h}时${m}分`);
    }
  }
  return parts.join("");
}

function getFormattedValue(): any {
  if (isRange.value) {
    return [formatValue(startValues.value), formatValue(endValues.value)];
  }
  return formatValue(currentValues.value);
}

// ===== 值解析 =====
function parseSingle(str: any): WheelValues {
  const v = initValues();
  if (!str) return v;
  const s = String(str);
  // 日期时间: 2026-01-15 14:30:00
  const dtMatch = s.match(/(\d{4})[-/](\d{1,2})[-/](\d{1,2})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/);
  if (dtMatch) {
    v.year = parseInt(dtMatch[1]);
    v.month = parseInt(dtMatch[2]);
    v.day = parseInt(dtMatch[3]);
    if (dtMatch[4]) v.hour = parseInt(dtMatch[4]);
    if (dtMatch[5]) v.minute = parseInt(dtMatch[5]);
    if (dtMatch[6]) v.second = parseInt(dtMatch[6]);
    return v;
  }
  // 年月: 2026-01
  const ymMatch = s.match(/^(\d{4})[-/](\d{1,2})$/);
  if (ymMatch) {
    v.year = parseInt(ymMatch[1]);
    v.month = parseInt(ymMatch[2]);
    return v;
  }
  // 年: 2026
  const yMatch = s.match(/^(\d{4})$/);
  if (yMatch) {
    v.year = parseInt(yMatch[1]);
    return v;
  }
  // 时间: 14:30:00 或 14:30
  const tMatch = s.match(/(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?/);
  if (tMatch) {
    v.hour = parseInt(tMatch[1]);
    v.minute = parseInt(tMatch[2]);
    if (tMatch[3]) v.second = parseInt(tMatch[3]);
    return v;
  }
  return v;
}

watch(
    () => props.modelValue,
    (val) => {
      if (val === undefined || val === null || val === "") {
        currentValues.value = initValues();
        startValues.value = initValues();
        endValues.value = {...initValues(), hour: now.getHours() + 1, minute: 0, second: 0};
        return;
      }
      if (isRange.value && Array.isArray(val)) {
        startValues.value = parseSingle(val[0]);
        endValues.value = parseSingle(val[1] || val[0]);
        // 初始化时也确保 end >= start
        syncEndIfNeeded();
      } else if (!isRange.value) {
        if (Array.isArray(val)) {
          currentValues.value = parseSingle(val[0]);
        } else {
          currentValues.value = parseSingle(val);
        }
      }
    },
    {immediate: true},
);

defineExpose({
  getFormattedValue,
  activeRange,
});
</script>

<style lang="scss" scoped>
.sh-mobile-wheel-picker {
  position: relative;
  width: 100%;
  height: 100%;
  user-select: none;
  -webkit-user-select: none;
  touch-action: none;
  display: flex;
  flex-direction: column;
}

/* 紧凑顶部栏：合并了预览值和范围切换 */
.sh-mobile-wheel-picker__top {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  font-size: 13px;
  min-height: 32px;
}

.sh-mobile-wheel-picker__tab {
  flex: 1;
  padding: 3px 6px;
  border-radius: 6px;
  color: var(--el-text-color-secondary, #909399);
  cursor: pointer;
  transition: all 0.2s;
  background: var(--el-fill-color-light, #f5f7fa);
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
  font-size: 13px;
  font-weight: 500;

  &.is-active {
    background: var(--el-color-primary, #409eff);
    color: #fff;
    font-weight: 600;
  }
}

.sh-mobile-wheel-picker__sep {
  color: var(--el-text-color-placeholder, #c0c4cc);
  font-weight: 400;
  font-size: 12px;
  flex-shrink: 0;
}

.sh-mobile-wheel-picker__single {
  color: var(--el-color-primary, #409eff);
  font-size: 16px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sh-mobile-wheel-picker__columns {
  display: flex;
  position: relative;
  padding: 0 4px;
  flex: 1;
}

.sh-mobile-wheel-picker__column {
  flex: 1;
  position: relative;
  overflow: hidden;
  text-align: center;
  min-width: 0;
}

/* 年份列更宽，因为"2026年"是最长的文本 */
.sh-mobile-wheel-picker__column.col-year {
  flex: 1.5;
}

/* 月份、日期列稍宽 */
.sh-mobile-wheel-picker__column.col-month,
.sh-mobile-wheel-picker__column.col-day {
  flex: 1.1;
}

.sh-mobile-wheel-picker__track {
  will-change: transform;
}

.sh-mobile-wheel-picker__item {
  font-size: 15px;
  color: var(--el-text-color-regular, #606266);
  transition: color 0.15s;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sh-mobile-wheel-picker__item.is-selected {
  color: var(--el-color-primary, #409eff);
  font-weight: 600;
  font-size: 16px;
}

.sh-mobile-wheel-picker__mask {
  position: absolute;
  left: 0;
  right: 0;
  pointer-events: none;
  z-index: 1;
}

.sh-mobile-wheel-picker__mask--top {
  top: 0;
  height: calc(50% - 18px);
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.4));
}

.sh-mobile-wheel-picker__mask--bottom {
  bottom: 0;
  height: calc(50% - 18px);
  background: linear-gradient(to top, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.4));
}

/* 头尾快捷按钮：点击跳到第一/最后一项 */
.sh-mobile-wheel-picker__btn {
  position: absolute;
  left: 0;
  right: 0;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
  cursor: pointer;
  pointer-events: auto;
  font-size: 10px;
  color: var(--el-text-color-placeholder, #c0c4cc);
  transition: color 0.15s, background 0.15s;
  user-select: none;
  -webkit-user-select: none;

  &:hover {
    color: var(--el-color-primary, #409eff);
    background: var(--el-fill-color-light, #f5f7fa);
  }

  &:active {
    color: var(--el-color-primary, #409eff);
    background: var(--el-color-primary-light-9, #ecf5ff);
  }

  &--top {
    top: 0;
    border-bottom: 1px dashed var(--el-border-color-extra-light, #f0f0f0);
  }

  &--bottom {
    bottom: 0;
    border-top: 1px dashed var(--el-border-color-extra-light, #f0f0f0);
  }
}

/* 选中指示线——使用 calc 确保任何屏幕尺寸精确居中于中间行 */
.sh-mobile-wheel-picker__indicator {
  position: absolute;
  left: 0;
  right: 0;
  top: calc(50% - 18px);
  height: 36px;
  border-top: 1px solid var(--el-color-primary, #409eff);
  border-bottom: 1px solid var(--el-color-primary, #409eff);
  pointer-events: none;
  z-index: 0;
}
</style>
