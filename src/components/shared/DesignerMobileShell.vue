<script setup lang="ts">
/**
 * 设计器移动端外壳组件
 *
 * 统一封装"Toolbar + 左侧栏 + Canvas + 右侧栏"设计器布局：
 * - PC 端：el-splitter 横向三栏（左面板 | 画布 | 右面板），与原结构等价
 * - App 端：顶部 Toolbar + 全屏 Canvas + 底部 Tab Bar 切换面板抽屉
 *
 * 各设计器模块主入口包一层本组件，把原 el-splitter 的内容挪到对应 slot，
 * 即可在 App 端获得"不溢出、可操作"的布局，PC 端零变化。
 *
 * 用法：
 *   <DesignerMobileShell :panels="[
 *     { key: 'nodes', label: '节点', side: 'left', width: 220 },
 *     { key: 'props', label: '属性', side: 'right', width: 280 },
 *   ]">
 *     <template #toolbar><XxxToolbar /></template>
 *     <template #canvas><XxxCanvas /></template>
 *     <template #panel-nodes><XxxNodePanel /></template>
 *     <template #panel-props><XxxPropertyPanel /></template>
 *   </DesignerMobileShell>
 */
import {computed, ref, watch} from "vue";
import {isMobile, isTablet} from "@/api/device";

interface DesignerPanel {
    /** 面板唯一 key，对应 slot 名 `panel-${key}` */
    key: string;
    /** 面板标题（App 端底部 Tab + 抽屉标题） */
    label: string;
    /** 侧边：left/right，默认 right */
    side?: "left" | "right";
    /** PC 端 splitter panel 尺寸（number 为 px，string 可为 %） */
    width?: number | string;
    /** PC 端 splitter panel 最小尺寸 */
    min?: number | string;
}

const props = withDefaults(
    defineProps<{
        /** 面板配置 */
        panels?: DesignerPanel[];
        /** 顶部标题（可选） */
        title?: string;
        /** App 端画布 Tab 标签文字，默认"画布" */
        canvasLabel?: string;
    }>(),
    {
        panels: () => [],
        title: "",
        canvasLabel: "画布",
    },
);

const isApp = isMobile || isTablet;

// ============ PC 端面板分组 ============
const leftPanels = computed(() => props.panels.filter((p) => p.side === "left"));
const rightPanels = computed(() => props.panels.filter((p) => p.side === "right"));

const normalizeSize = (v?: number | string, fallback = 280): string => {
    if (v == null || v === "") return `${fallback}px`;
    if (typeof v === "number") return `${v}px`;
    return v;
};

const leftSize = computed(() => {
    const w = leftPanels.value[0]?.width;
    return normalizeSize(w, 240);
});
const leftMin = computed(() => normalizeSize(leftPanels.value[0]?.min, 180));
const rightSize = computed(() => {
    const w = rightPanels.value[0]?.width;
    return normalizeSize(w, 280);
});
const rightMin = computed(() => normalizeSize(rightPanels.value[0]?.min, 200));

// PC 端多面板时用 el-tabs 切换
const activeLeft = ref(leftPanels.value[0]?.key || "");
const activeRight = ref(rightPanels.value[0]?.key || "");
watch(
    () => props.panels,
    (list) => {
        if (!leftPanels.value.find((p) => p.key === activeLeft.value)) {
            activeLeft.value = leftPanels.value[0]?.key || "";
        }
        if (!rightPanels.value.find((p) => p.key === activeRight.value)) {
            activeRight.value = rightPanels.value[0]?.key || "";
        }
    },
    {deep: true},
);

// ============ App 端底部 Tab + 抽屉 ============
const CANVAS_TAB = "__canvas__";
const activeTab = ref<string>(CANVAS_TAB);
const drawerVisible = ref(false);

const openPanel = (p: DesignerPanel) => {
    activeTab.value = p.key;
    drawerVisible.value = true;
};

const selectCanvas = () => {
    activeTab.value = CANVAS_TAB;
    drawerVisible.value = false;
};

const activePanel = computed(() => props.panels.find((p) => p.key === activeTab.value));

const drawerDirection = computed<"ltr" | "rtl" | "ttb" | "btt">(() => {
    // left 面板从左滑入，right 面板从右滑入
    return activePanel.value?.side === "left" ? "ltr" : "rtl";
});

const drawerTitle = computed(() => activePanel.value?.label || "");

// 切换 tab 时关闭抽屉
watch(activeTab, (v) => {
    if (v === CANVAS_TAB) drawerVisible.value = false;
});
</script>

<template>
  <div class="designer-shell" :class="{ 'is-mobile': isApp }">
    <!-- 顶部 Toolbar -->
    <div class="designer-shell__toolbar">
      <slot name="toolbar" />
    </div>

    <!-- ============ PC 端：el-splitter 三栏 ============ -->
    <el-splitter
      v-if="!isApp"
      layout="horizontal"
      class="designer-shell__body"
    >
      <!-- 左侧面板组 -->
      <el-splitter-panel
        v-if="leftPanels.length"
        :size="leftSize"
        :min="leftMin"
      >
        <div class="designer-shell__panel-side">
          <!-- 单面板：直接渲染 -->
          <slot v-if="leftPanels.length === 1" :name="`panel-${leftPanels[0].key}`" />
          <!-- 多面板：el-tabs 切换 -->
          <el-tabs v-else v-model="activeLeft" class="designer-shell__panel-tabs">
            <el-tab-pane
              v-for="p in leftPanels"
              :key="p.key"
              :label="p.label"
              :name="p.key"
            >
              <slot :name="`panel-${p.key}`" />
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-splitter-panel>

      <!-- 画布 -->
      <el-splitter-panel>
        <div class="designer-shell__canvas">
          <slot name="canvas" />
        </div>
      </el-splitter-panel>

      <!-- 右侧面板组 -->
      <el-splitter-panel
        v-if="rightPanels.length"
        :size="rightSize"
        :min="rightMin"
      >
        <div class="designer-shell__panel-side">
          <slot v-if="rightPanels.length === 1" :name="`panel-${rightPanels[0].key}`" />
          <el-tabs v-else v-model="activeRight" class="designer-shell__panel-tabs">
            <el-tab-pane
              v-for="p in rightPanels"
              :key="p.key"
              :label="p.label"
              :name="p.key"
            >
              <slot :name="`panel-${p.key}`" />
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-splitter-panel>
    </el-splitter>

    <!-- ============ App 端：全屏画布 + 底部 Tab + 抽屉 ============ -->
    <template v-else>
      <div class="designer-shell__canvas designer-shell__canvas--mobile">
        <slot name="canvas" />
      </div>

      <!-- 底部 Tab Bar -->
      <div class="designer-shell__tabbar">
        <div
          class="tab-item"
          :class="{ active: activeTab === CANVAS_TAB }"
          @click="selectCanvas"
        >
          <span class="tab-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18M9 21V9" />
            </svg>
          </span>
          <span class="tab-label">{{ canvasLabel }}</span>
        </div>
        <div
          v-for="p in panels"
          :key="p.key"
          class="tab-item"
          :class="{ active: activeTab === p.key }"
          @click="openPanel(p)"
        >
          <span class="tab-label">{{ p.label }}</span>
        </div>
      </div>

      <!-- 面板抽屉 -->
      <el-drawer
        v-model="drawerVisible"
        :direction="drawerDirection"
        :size="'85%'"
        :title="drawerTitle"
        :with-header="true"
        class="designer-shell__drawer"
      >
        <div class="designer-shell__drawer-body">
          <slot :name="`panel-${activeTab}`" />
        </div>
      </el-drawer>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.designer-shell {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: var(--el-bg-color);

    &__toolbar {
        flex-shrink: 0;
    }

    &__body {
        flex: 1;
        width: 100%;
        height: 100%;
        min-height: 0;
    }

    &__panel-side {
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }

    &__panel-tabs {
        height: 100%;
        display: flex;
        flex-direction: column;

        :deep(.el-tabs__content) {
            flex: 1;
            overflow: auto;
            min-height: 0;
        }
    }

    &__canvas {
        width: 100%;
        height: 100%;
        overflow: hidden;
        position: relative;
        min-height: 0;

        &--mobile {
            flex: 1;
            min-height: 0;
        }
    }
}

/* ============ App 端 ============ */
.designer-shell.is-mobile {
    .designer-shell__canvas--mobile {
        flex: 1;
    }
}

.designer-shell__tabbar {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: space-around;
    height: 56px;
    background: var(--el-bg-color);
    border-top: 1px solid var(--el-border-color);
    padding-bottom: env(safe-area-inset-bottom);
    z-index: 10;

    .tab-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 2px;
        height: 100%;
        color: var(--el-text-color-secondary);
        font-size: 11px;
        cursor: pointer;
        transition: color 0.2s;
        user-select: none;

        &.active {
            color: var(--el-color-primary);
        }

        .tab-icon {
            display: inline-flex;
            width: 20px;
            height: 20px;

            svg {
                width: 100%;
                height: 100%;
            }
        }

        .tab-label {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 100%;
        }
    }
}

.designer-shell__drawer-body {
    height: 100%;
    overflow: auto;
    padding-bottom: env(safe-area-inset-bottom);
}
</style>

<style lang="scss">
/* el-drawer 全局样式覆盖（App 端抽屉） */
.designer-shell__drawer {
    .el-drawer__body {
        padding: 12px;
    }
}
</style>
