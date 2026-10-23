<script setup name="StarHorseFormListApp" lang="ts">
import { computed, ref } from "vue";
import { i18n } from "@/lang";
import { ArrowDown, ArrowRight } from "@element-plus/icons-vue";
import { compKey } from "@/api/system";
import ShTableListColumn from "@/components/comp/ShTableListColumn.vue";
import StarHorseIcon from "@/components/comp/StarHorseIcon.vue";

/**
 * StarHorseFormList 的 APP 端渲染(卡片列表风格):
 * - 卡片 = 一行数据,卡片内**直接渲染该行全部字段的输入控件**(可编辑录入,非只读展示),
 *   字段渲染复用 ShTableListColumn(staticColumn="N" 分支 -> el-form-item + star-horse-item)
 * - 新增/编辑**不弹窗**:新增直接追加一张可编辑空卡片,编辑直接在卡片字段上改
 * - 每字段 label 在控件顶部(含必填 *)
 * 增删逻辑统一由父组件 StarHorseFormList 处理,避免重复实现。
 */
const props = withDefaults(
  defineProps<{
    fieldList: Array<any>;
    dataList: Array<any>;
    subTableName?: string;
    primaryKey?: any;
    rules?: any;
    size?: string;
    source?: number;
    staticColumn?: string;
    enableSubNode?: boolean;
    showCheckBox?: boolean;
    commonFormat?: Function;
  }>(),
  {
    subTableName: "subDataList",
    size: "default",
    source: 1,
    staticColumn: "Y",
    enableSubNode: false,
    showCheckBox: false,
  },
);
const emits = defineEmits([
  "add",
  "remove",
  "addChild",
  "editChild",
  "removeChild",
]);

/**
 * 卡片交互:每行数据一张卡片,默认展示该行全部属性;操作按钮常驻(表单录入需高频增删改)
 * 点击卡片头部可折叠/展开内容;点击卡片仅高亮选中,不影响按钮显隐
 */
const selectedKeys = ref<Set<string>>(new Set());
const collapsedCards = ref<Set<string>>(new Set());
const keyOf = (row: any, index: number | string): string =>
    row?.__nodeId || row?.id || String(index);


const toggleCard = (row: any, index: number) => {
  const key = keyOf(row, index);
  const next = new Set(collapsedCards.value);
  next.has(key) ? next.delete(key) : next.add(key);
  collapsedCards.value = next;
};

const isCardCollapsed = (row: any, index: number) =>
    collapsedCards.value.has(keyOf(row, index));
const isSelected = (row: any, index: number | string) =>
    selectedKeys.value.has(keyOf(row, index));

const exclusionFields = ["divider", "button", "usercomp"];

/** 扁平化列定义(支持二维数组行;过滤不可展示类型) */
const flatFields = computed(() => {
  const list: Array<any> = [];
  for (const field of props.fieldList || []) {
    if (Array.isArray(field)) {
      for (const sub of field) {
        if (sub && !exclusionFields.includes(sub.type)) list.push(sub);
      }
    } else if (field && !exclusionFields.includes(field.type)) {
      list.push(field);
    }
  }
  return list;
});

/** 卡片标题:取首个字段的值作概览(属性区仍展示全部字段),无值回退"第 N 行" */
const cardTitle = (row: any, index: number | string) => {
  index = Number(index);
  const first = flatFields.value[0];
  if (first) {
    const value = row?.[first.fieldName];
    if (value !== undefined && value !== null && value !== "") {
      return String(value);
    }
  }
  return i18n("starHorseFormList.rowTitle", index + 1);
};

const emitRemove = (row: any) => emits("remove", row);
const emitAddChild = (row: any) => emits("addChild", row);
const emitEditChild = (row: any) => emits("editChild", row);
const emitRemoveChild = (row: any) => emits("removeChild", row);
</script>

<template>
  <div class="form-list-app">
    <div
        v-if="!dataList || dataList.length === 0"
        class="app-list-empty"
    >{{ i18n("table.noData") }}</div>
    <div
        v-for="(row, index) in dataList"
        :key="keyOf(row, index)"
        class="app-card"
        :class="{'app-card-selected': isSelected(row, index)}"
    >
      <div class="app-card-head" @click.stop="toggleCard(row, index)">
        <el-icon class="app-card-arrow">
          <ArrowRight v-if="isCardCollapsed(row, index)"/>
          <ArrowDown v-else/>
        </el-icon>
        <span class="app-card-index">{{ Number(index) + 1 }}</span>
        <span class="app-card-title">{{ cardTitle(row, index) }}</span>
        <div
            v-if="source != 3 && !isCardCollapsed(row, index)"
            class="app-card-actions"
            @click.stop
        >
          <star-horse-icon
              v-if="enableSubNode"
              icon-class="add"
              size="16px"
              :title="i18n('ui.addSubData')"
              @click="emitAddChild(row)"
          />
          <star-horse-icon
              icon-class="delete"
              size="16px"
              color="var(--el-color-danger)"
              :title="i18n('ui.deleteRow')"
              @click="emitRemove(row)"
          />
        </div>
      </div>
      <el-descriptions
          v-show="!isCardCollapsed(row, index)"
          :column="1"
          border
          direction="vertical"
          size="small"
          class="app-card-desc"
      >
        <el-descriptions-item
            v-for="(field, fkey) in flatFields"
            :key="compKey(field, fkey)"
        >
          <template #label>
            {{ field.label }}<span v-if="field.required" class="app-card-required">*</span>
          </template>
          <sh-table-list-column
              :item="field"
              :dataForm="row"
              :index="Number(index)"
              :subTableName="subTableName"
              :primaryKey="primaryKey"
              :rules="rules"
              :size="size"
              :source="source"
              :staticColumn="'N'"
          />
        </el-descriptions-item>
      </el-descriptions>
      <!-- 无限级子节点(缩进递归渲染) -->
      <div
          v-if="enableSubNode && row.children && row.children.length > 0"
          class="app-card-children"
      >
        <div
            v-for="(child, cidx) in row.children"
            :key="keyOf(child, cidx)"
            class="app-child-card"
        >
          <div class="app-card-head">
            <span class="app-card-index">{{ Number(index) + 1 }}.{{ Number(cidx) + 1 }}</span>
            <span class="app-card-title">{{ cardTitle(child, cidx) }}</span>
            <div
                v-if="source != 3"
                class="app-card-actions"
                @click.stop
            >
              <star-horse-icon
                  icon-class="edit"
                  size="16px"
                  :title="i18n('ui.edit')"
                  @click="emitEditChild(child)"
              />
              <star-horse-icon
                  icon-class="delete"
                  size="16px"
                  color="var(--el-color-danger)"
                  :title="i18n('ui.deleteRow')"
                  @click="emitRemoveChild(child)"
              />
            </div>
          </div>
          <el-descriptions
              :column="1"
              border
              direction="vertical"
              size="small"
              class="app-card-desc"
          >
            <el-descriptions-item
                v-for="(field, fkey) in flatFields"
                :key="compKey(field, fkey)"
                :label="field.label + (field.required ? ' *' : '')"
            >
              <sh-table-list-column
                  :item="field"
                  :dataForm="child"
                  :index="Number(cidx)"
                  :subTableName="subTableName"
                  :primaryKey="primaryKey"
                  :rules="rules"
                  :size="size"
                  :source="source"
                  :staticColumn="'N'"
              />
            </el-descriptions-item>
          </el-descriptions>
          </div>
        </div>
      </div>
    </div>
    <div
        v-if="source != 3"
        class="app-list-add"
        @click="emits('add')"
    >
      <star-horse-icon
          icon-class="plus"
          color="var(--star-horse-style)"
          size="16px"
      />
      {{ staticColumn == "Y" ? i18n("ui.addData") : i18n("ui.addRow") }}
    </div>
</template>

<style lang="scss" scoped>
.form-list-app {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.app-list-empty {
  text-align: center;
  color: #98a1aa;
  font-size: 13px;
  padding: 20px 0;
}

.app-card {
  cursor: pointer;
  border: 1px solid #e4e7ed;
  border-radius: 10px;
  background: #fff;
  overflow: hidden;
  transition: border-color 0.15s, box-shadow 0.15s;

  &.app-card-selected {
    border-color: var(--star-horse-style, #2563eb);
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.08);
  }
}

/* 卡片头:序号 + 关键信息 + 常驻操作按钮 */
.app-card-head {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background-color: #f5f7fa;
  border-left: 3px solid var(--el-color-primary);
  border-radius: 4px;
  margin-bottom: 4px;
}

.app-card-index {
  flex: none;
  min-width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  border-radius: 50%;
  background: var(--star-horse-style, #2563eb);
  color: #fff;
  font-size: 11px;
  font-weight: 600;
}

.app-card-title {
  flex: 1;
  font-size: 13px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.app-card-actions {
  flex: none;
  display: flex;
  align-items: center;
  gap: 14px;
}

/* 属性区:每字段 label 在上(顶部)、可编辑控件在下 */
.app-card-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
}

.app-card-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.app-card-label {
  font-size: 12px;
  color: #8a919c;
  line-height: 1.5;
  word-break: break-all;
}

.app-card-required {
  color: var(--el-color-danger);
  margin-left: 2px;
}

.app-card-control {
  width: 100%;

  :deep(.el-form-item) {
    margin-bottom: 0;
  }

  :deep(.el-form-item__label) {
    display: none;
  }
}

.app-card-children {
  margin: 0 10px 10px 20px;
  padding-left: 8px;
  border-left: 2px solid #f0f1f3;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.app-child-card {
  border: 1px dashed #e4e7ed;
  border-radius: 8px;
  overflow: hidden;
  background: #fafbfc;
}

.app-list-add {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 40px;
  border: 1px dashed var(--star-horse-style, #2563eb);
  border-radius: 10px;
  color: var(--star-horse-style, #2563eb);
  font-size: 13px;
  cursor: pointer;

  &:active {
    background: rgba(37, 99, 235, 0.04);
  }
}
</style>
