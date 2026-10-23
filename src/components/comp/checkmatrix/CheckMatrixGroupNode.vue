<script setup lang="ts" name="CheckMatrixGroupNode">
import {ArrowDown, ArrowRight} from "@element-plus/icons-vue";
import {i18n} from "@/lang";

/**
 * checkmatrix APP 端分组卡片节点(递归组件,支持任意层级嵌套分类)
 * node: { title, level, children: Node[], items: CheckItem[] }
 * api: 由 checkmatrixItem 注入的交互函数集合(避免重复实现与 props 爆炸)
 */
const props = withDefaults(
    defineProps<{
        node: any;
        depth?: number;
        readonly?: boolean;
        api: any;
    }>(),
    {depth: 0, readonly: false},
);
</script>

<template>
  <div
      class="cm-mobile-card"
      :class="{'cm-mobile-card-sub': depth > 0}"
  >
    <div
        class="cm-mobile-card-head"
        @click="api.toggleGroup(node.key)"
    >
      <el-icon class="cm-mobile-collapse-icon">
        <ArrowRight v-if="api.isCollapsed(node.key)"/>
        <ArrowDown v-else/>
      </el-icon>
      <span class="cm-mobile-card-title">{{ node.title }}</span>
      <span
          v-if="api.isCollapsed(node.key)"
          class="cm-mobile-card-stat"
          :class="api.groupStatClass(node)"
      >{{ i18n("checkmatrix.statFilled") }}{{ api.groupStats(node).filled }} / {{ i18n("checkmatrix.statEmpty") }}{{ api.groupStats(node).empty }}</span>
      <span class="cm-mobile-card-actions" @click.stop>
        <el-dropdown
            v-if="!readonly && api.groupOptions(node).length > 0"
            trigger="click"
            @command="(cmd: string) => api.fillGroup(node, cmd)"
        >
          <el-button link type="primary" size="small">
            {{ i18n("checkmatrix.groupSet") }}
            <el-icon class="el-icon--right"><ArrowDown/></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                  v-for="(opt, oi) in api.groupOptions(node)"
                  :key="oi"
                  :command="opt.value"
              >{{ i18n("checkmatrix.fillAllPrefix") }}{{ opt.name }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </span>
    </div>
    <template v-if="!api.isCollapsed(node.key)">
      <!-- 本级检查项 -->
      <div
          v-for="(item, ri) in node.items"
          :key="'i' + ri"
          class="cm-mobile-item"
          @click="api.openDrawer(item)"
      >
        <div class="cm-mobile-content">{{ item.content }}</div>
        <div
            v-if="item.freq"
            class="cm-mobile-freq"
        >{{ i18n("checkmatrix.freq") }}: {{ item.freq }}</div>
        <div class="cm-mobile-stat">
          <span
              v-for="(block, bi) in api.blockSummary(item)"
              :key="bi"
              class="cm-mobile-stat-chip"
              :class="block.cls"
              @click.stop="api.chipCycle(item, Number(bi))"
          >#{{ Number(bi) + 1 }} {{ block.text }}</span>
          <span
              v-if="!readonly"
              class="cm-mobile-stat-action"
          >{{ i18n("checkmatrix.tapToFill") }}</span>
        </div>
      </div>
      <!-- 递归子分组 -->
      <check-matrix-group-node
          v-for="(child, ci) in node.children"
          :key="'g' + ci"
          :node="child"
          :depth="depth + 1"
          :readonly="readonly"
          :api="api"
      />
    </template>
  </div>
</template>

<style scoped lang="scss">
.cm-mobile-card {
  background: #fff;
  border-radius: 10px;
  padding: 12px 14px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  margin-bottom: 10px;
}

/* 子级分组:缩进 + 顶部细分隔线,体现层级 */
.cm-mobile-card-sub {
  margin-left: 12px;
  border-left: 3px solid #e4e7ed;
  border-radius: 8px;
  padding-left: 10px;
}

.cm-mobile-card-head {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  margin-bottom: 6px;
}

.cm-mobile-card-title {
  flex: 1;
  font-size: 16px;
  font-weight: 600;
  color: #1f2329;
}

.cm-mobile-card-sub .cm-mobile-card-title {
  font-size: 14px;
}

.cm-mobile-collapse-icon {
  flex: none;
  font-size: 14px;
  color: #8a919c;
}

.cm-mobile-card-stat {
  font-size: 11px;
  margin-left: 8px;
  white-space: nowrap;

  &.stat-complete { color: #16a34a; }
  &.stat-partial { color: #d97706; }
  &.stat-pending { color: #dc2626; }
}

.cm-mobile-card-actions {
  margin-left: auto;
  flex: none;
  display: flex;
  align-items: center;
}

.cm-mobile-item {
  cursor: pointer;
  padding: 10px 0;
  border-bottom: 1px solid #f0f1f3;

  &:last-of-type { border-bottom: none; }
}

.cm-mobile-content {
  font-size: 14px;
  line-height: 1.5;
  color: #1f2329;
}

.cm-mobile-freq {
  font-size: 12px;
  color: #8a919c;
  margin: 4px 0;
}

.cm-mobile-stat {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
  margin: 6px 0 2px;
}

.cm-mobile-stat-chip {
  cursor: pointer;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
  background: #f3f4f6;
  color: #4e5560;

  &.opt-1 { background: #e8f6ee; color: #16a34a; font-weight: 600; }
  &.opt-2 { background: #fdecec; color: #dc2626; font-weight: 600; }
  &.opt-3 { background: #fdf3e3; color: #d97706; font-weight: 600; }
  &.opt-4 { background: #eef2fb; color: #4b5bab; font-weight: 600; }
  &.opt-5 { background: #f3eefb; color: #7c4bb0; font-weight: 600; }
}

.cm-mobile-stat-action {
  font-size: 12px;
  color: #2563eb;
}
</style>