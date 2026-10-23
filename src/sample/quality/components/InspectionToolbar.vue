<script setup lang="ts">
import {computed} from "vue";
import {i18n} from "@/lang";
import {isMobile} from "@/api/device";
import Help from "@/components/help.vue";

/** APP 端提示条收缩为 help 气泡的内容 */
const hintText = computed(() =>
    [
        "稽核格: 单击选中,再点循环切换(空→选项1→选项2→...)",
        "快捷键: 1=第1项 2=第2项 3=第3项 0=清空 空格=循环 Enter=输入说明",
        "点击列头时段: 整列循环",
        "点击行号: 整行循环",
        "NG 行自动标红并提示登记问题点",
        "App 端: 分组卡片可折叠,点检查项开抽屉按块填写",
    ].join("\n"),
);

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
    /** 自定义文本数量(不在选项列表里的值,只计数不显示内容) */
    custom?: number;
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
      <template v-if="stats.custom > 0">
        {{ i18n("checkmatrix.statCustom") }} <b class="opt4">{{ stats.custom }}</b> ·
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
  <!-- PC 端:展开显示提示 -->
  <div
      v-if="kind === 'matrix' && !isMobile"
      class="it-hint"
  >
    <span><b>稽核格</b>: 单击选中,再点循环切换(空→选项1→选项2→...)</span>
    <span><b>快捷键</b>: <kbd>1</kbd>第1项 <kbd>2</kbd>第2项 <kbd>3</kbd>第3项 <kbd>0</kbd>清空 <kbd>空格</kbd>循环 <kbd>Enter</kbd>输入说明</span>
    <span>点击<b>列头时段</b>整列循环</span>
    <span>点击<b>行号</b>整行循环</span>
    <span>NG 行自动标红并提示登记问题点</span>
    <span>App 端: 分组卡片 → 点检查项 → 抽屉按块填写</span>
  </div>
  <!-- APP 端:收缩为 help 气泡(不占空间) -->
  <div
      v-if="kind === 'matrix' && isMobile"
      class="it-hint-bubble"
  >
    <help :message="hintText" :width="340" />
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

.it-hint-bubble {
  display: inline-flex;
  align-items: center;
  margin-bottom: 8px;
}
</style>