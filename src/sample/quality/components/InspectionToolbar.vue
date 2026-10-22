<script setup lang="ts">
import {computed} from "vue";

export interface ToolbarOptionStat {
    value: string;
    name: string;
    count: number;
}

export interface ToolbarStats {
    /** 各备选项计数(按当前表配置动态,不硬编码 OK/NG/NA) */
    byOption: ToolbarOptionStat[];
    empty: number;
    total: number;
    /** 前两个非空选项的显示名(批量按钮文案用,按当前表配置) */
    firstOptionName?: string;
    secondOptionName?: string;
}

const props = defineProps<{
    title: string;
    stats: ToolbarStats;
    kind: "matrix" | "rowEdit";
    formOptions: Array<{key: string; title: string}>;
    currentKey: string;
    saving?: boolean;
}>();
const emits = defineEmits([
    "update:currentKey",
    "fill-option",
    "clear",
    "copy-last",
    "save",
]);

const percent = computed(() => {
    if (!props.stats.total) return 0;
    const filled = props.stats.total - props.stats.empty;
    return Math.round((filled / props.stats.total) * 100);
});
</script>

<template>
  <div class="it-toolbar">
    <h1 class="it-title">{{ title }}</h1>
    <el-select
        v-if="formOptions.length > 0"
        :model-value="currentKey"
        class="it-select"
        size="default"
        filterable
        @update:model-value="emits('update:currentKey', $event)"
    >
      <el-option
          v-for="option in formOptions"
          :key="option.key"
          :label="option.title"
          :value="option.key"
      />
    </el-select>
    <span
        v-if="kind === 'matrix'"
        class="it-stat"
    >
      稽核结果
      <template v-for="(opt, oi) in stats.byOption" :key="oi">
        {{ opt.name }} <b :class="'opt' + (oi + 1)">{{ opt.count }}</b> ·
      </template>
      未填 <b class="ng">{{ stats.empty }}</b> · 完成 {{ percent }}%
    </span>
    <span
        v-else
        class="it-stat"
    >共 {{ stats.total }} 项待确认</span>
    <div class="it-actions">
      <template v-if="kind === 'matrix'">
        <el-button
            v-if="stats.firstOptionName"
            @click="emits('fill-option', 0)"
        >全部填 {{ stats.firstOptionName }}</el-button>
        <el-button
            v-if="stats.secondOptionName"
            @click="emits('fill-option', 1)"
        >全部填 {{ stats.secondOptionName }}</el-button>
        <el-button
            type="danger"
            plain
            @click="emits('clear')"
        >清空稽核</el-button>
      </template>
      <el-button @click="emits('copy-last')">复制上次记录</el-button>
      <el-button
          type="primary"
          :loading="saving"
          @click="emits('save')"
      >校验并保存</el-button>
    </div>
  </div>
  <div
      v-if="kind === 'matrix'"
      class="it-hint"
  >
    <span><b>稽核格</b>: 单击按本项配置的备选项循环</span>
    <span><b>快捷键</b>(按配置生成,表格上方实时显示): 选中<b>单元格</b>按数字键设置该格;选中<b>行号</b>按数字键设置整行</span>
    <span>点击<b>列头时段</b>整列填第一项</span>
    <span>点击<b>行号</b>整行按本项备选项循环</span>
    <span>NG 行自动标红并提示登记问题点</span>
    <span>App 端: 分组卡片 → 点检查项 → 抽屉按块填写</span>
  </div>
</template>

<style scoped lang="scss">
.it-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  background: #fff;
  border: 1px solid var(--sh-cm-bd, #c9cdd3);
  border-radius: 8px;
  padding: 10px 12px;
  position: sticky;
  top: 0;
  z-index: 50;
  margin-bottom: 10px;
}

.it-title {
  font-size: 16px;
  font-weight: 600;
  margin-right: auto;
  white-space: nowrap;
}

.it-select {
  width: 220px;
}

.it-stat {
  font-size: 12px;
  color: #687078;
  white-space: nowrap;

  b {
    color: #16a34a;

    &.opt2 {
      color: #dc2626;
    }

    &.opt3 {
      color: #d97706;
    }

    &.opt4 {
      color: #4b5bab;
    }

    &.opt5 {
      color: #7c4bb0;
    }

    &.ng {
      color: #dc2626;
    }
  }
}

.it-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;

  :deep(.el-button) {
    margin: 0;
  }
}

.it-hint {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 16px;
  font-size: 12px;
  color: #57606a;
  background: #fff;
  border: 1px solid var(--sh-cm-bd, #c9cdd3);
  border-radius: 8px;
  padding: 8px 12px;
  margin-bottom: 12px;

  kbd {
    background: #f4f5f7;
    border: 1px solid #d0d3d9;
    border-bottom-width: 2px;
    border-radius: 4px;
    padding: 1px 6px;
    font-size: 11px;
    font-family: inherit;
  }
}
</style>