<script setup lang="ts" name="EtlPropertyPanel">
import {computed} from "vue";
import {i18n} from "@/lang";
import type {EtlDesignerState} from "../composables/useEtlDesigner";
import {
  AGGREGATION_FUNCTIONS,
  FILE_FORMATS,
  HTTP_METHODS,
  JOIN_TYPES,
  SORT_DIRECTIONS,
  WRITE_MODES,
} from "../constants";
import type {EtlNode} from "../types";

const props = defineProps<{
  designer: EtlDesignerState;
}>();

const selected = computed<EtlNode | null>(() => props.designer.selectedNode.value);

const updateConfig = (key: string, value: any) => {
  if (!selected.value) return;
  props.designer.updateNodeConfig(selected.value.id, {[key]: value});
};

const updateName = (value: string) => {
  if (!selected.value) return;
  props.designer.updateNode(selected.value.id, {name: value});
};

/** 内联 SVG 图标（替代 Element Plus 图标，减少依赖） */
const icons: Record<string, string> = {
  delete: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4h8v2M5 6v14a2 2 0 002 2h10a2 2 0 002-2V6M10 11v6M14 11v6"/></svg>',
};

/** 字段映射操作 */
const addMapping = () => {
  if (!selected.value) return;
  const mappings = [...(selected.value.config.mappings ?? []), {source: "", target: "", expression: ""}];
  updateConfig("mappings", mappings);
};
const updateMapping = (index: number, key: string, value: string | number) => {
  if (!selected.value) return;
  const mappings = [...(selected.value.config.mappings ?? [])];
  mappings[index] = {...mappings[index], [key]: String(value)};
  updateConfig("mappings", mappings);
};
const removeMapping = (index: number) => {
  if (!selected.value) return;
  const mappings = [...(selected.value.config.mappings ?? [])];
  mappings.splice(index, 1);
  updateConfig("mappings", mappings);
};

/** 聚合配置操作 */
const addAggregation = () => {
  if (!selected.value) return;
  const aggregations = [...(selected.value.config.aggregations ?? []), {field: "", func: "sum", alias: ""}];
  updateConfig("aggregations", aggregations);
};
const updateAggregation = (index: number, key: string, value: string | number) => {
  if (!selected.value) return;
  const aggregations = [...(selected.value.config.aggregations ?? [])];
  aggregations[index] = {...aggregations[index], [key]: String(value)};
  updateConfig("aggregations", aggregations);
};
const removeAggregation = (index: number) => {
  if (!selected.value) return;
  const aggregations = [...(selected.value.config.aggregations ?? [])];
  aggregations.splice(index, 1);
  updateConfig("aggregations", aggregations);
};

/** 排序字段操作 */
const addSortField = () => {
  if (!selected.value) return;
  const sortFields = [...(selected.value.config.sortFields ?? []), {field: "", direction: "asc"}];
  updateConfig("sortFields", sortFields);
};
const updateSortField = (index: number, key: string, value: string | number) => {
  if (!selected.value) return;
  const sortFields = [...(selected.value.config.sortFields ?? [])];
  sortFields[index] = {...sortFields[index], [key]: String(value)};
  updateConfig("sortFields", sortFields);
};
const removeSortField = (index: number) => {
  if (!selected.value) return;
  const sortFields = [...(selected.value.config.sortFields ?? [])];
  sortFields.splice(index, 1);
  updateConfig("sortFields", sortFields);
};

/** 字符串数组操作（groupBy/keys/branches） */
const addStringItem = (key: string) => {
  if (!selected.value) return;
  const arr = [...(selected.value.config[key] ?? [])];
  arr.push(key === "branches" ? {label: "", condition: ""} : "");
  updateConfig(key, arr);
};
const updateStringItem = (key: string, index: number, value: string | number) => {
  if (!selected.value) return;
  const arr = [...(selected.value.config[key] ?? [])];
  arr[index] = String(value);
  updateConfig(key, arr);
};
const removeStringItem = (key: string, index: number) => {
  if (!selected.value) return;
  const arr = [...(selected.value.config[key] ?? [])];
  arr.splice(index, 1);
  updateConfig(key, arr);
};

/** 分支配置操作 */
const addBranch = () => {
  if (!selected.value) return;
  const branches = [...(selected.value.config.branches ?? []), {label: "", condition: ""}];
  updateConfig("branches", branches);
};
const updateBranch = (index: number, key: string, value: string | number) => {
  if (!selected.value) return;
  const branches = [...(selected.value.config.branches ?? [])];
  branches[index] = {...branches[index], [key]: String(value)};
  updateConfig("branches", branches);
};
const removeBranch = (index: number) => {
  if (!selected.value) return;
  const branches = [...(selected.value.config.branches ?? [])];
  branches.splice(index, 1);
  updateConfig("branches", branches);
};

const handleRemoveNode = () => {
  if (!selected.value) return;
  props.designer.removeNode(selected.value.id);
};
</script>

<template>
  <div class="etl-property-panel">
    <div class="panel-title">{{ i18n("etl.property.title") }}</div>
    <div class="panel-body">
      <div v-if="!selected" class="empty-tip">{{ i18n("etl.property.empty") }}</div>
      <el-form v-else label-width="90px" class="prop-form">
        <el-divider content-position="left">{{ i18n("etl.property.basic") }}</el-divider>
        <el-form-item :label="i18n('etl.property.name')">
          <el-input :model-value="selected.name" @change="(v) => updateName(v)"/>
        </el-form-item>
        <el-form-item :label="i18n('etl.property.position')">
          <div class="pos-row">
            <el-input-number :model-value="Math.round(selected.x)" :step="10"
                             @change="(v) => designer.moveNode(selected!.id, v ?? 0, selected!.y)"/>
            <el-input-number :model-value="Math.round(selected.y)" :step="10"
                             @change="(v) => designer.moveNode(selected!.id, selected!.x, v ?? 0)"/>
          </div>
        </el-form-item>

        <el-divider content-position="left">{{ i18n("etl.property.config") }}</el-divider>

        <!-- source.database -->
        <template v-if="selected.type === 'source.database'">
          <el-form-item :label="i18n('etl.property.source.database.connection')">
            <el-input :model-value="selected.config.connection" @change="(v) => updateConfig('connection', v)"
                      placeholder="mysql://user:pass@host:3306/db"/>
          </el-form-item>
          <el-form-item :label="i18n('etl.property.source.database.sql')">
            <el-input :model-value="selected.config.sql" @change="(v) => updateConfig('sql', v)" type="textarea"
                      :rows="4"/>
          </el-form-item>
        </template>

        <!-- source.api -->
        <template v-else-if="selected.type === 'source.api'">
          <el-form-item :label="i18n('etl.property.source.api.url')">
            <el-input :model-value="selected.config.url" @change="(v) => updateConfig('url', v)"/>
          </el-form-item>
          <el-form-item :label="i18n('etl.property.source.api.method')">
            <el-select :model-value="selected.config.method" @change="(v) => updateConfig('method', v)"
                       style="width: 100%">
              <el-option v-for="m in HTTP_METHODS" :key="m.value" :label="m.label" :value="m.value"/>
            </el-select>
          </el-form-item>
        </template>

        <!-- source.file -->
        <template v-else-if="selected.type === 'source.file'">
          <el-form-item :label="i18n('etl.property.source.file.path')">
            <el-input :model-value="selected.config.path" @change="(v) => updateConfig('path', v)"/>
          </el-form-item>
          <el-form-item :label="i18n('etl.property.source.file.format')">
            <el-select :model-value="selected.config.format" @change="(v) => updateConfig('format', v)"
                       style="width: 100%">
              <el-option v-for="f in FILE_FORMATS" :key="f.value" :label="f.label" :value="f.value"/>
            </el-select>
          </el-form-item>
        </template>

        <!-- source.json -->
        <template v-else-if="selected.type === 'source.json'">
          <el-form-item :label="i18n('etl.property.source.json.data')">
            <el-input :model-value="selected.config.data" @change="(v) => updateConfig('data', v)" type="textarea"
                      :rows="6"/>
          </el-form-item>
        </template>

        <!-- source.csv -->
        <template v-else-if="selected.type === 'source.csv'">
          <el-form-item :label="i18n('etl.property.source.csv.content')">
            <el-input :model-value="selected.config.content" @change="(v) => updateConfig('content', v)" type="textarea"
                      :rows="6"/>
          </el-form-item>
          <el-form-item :label="i18n('etl.property.source.csv.delimiter')">
            <el-input :model-value="selected.config.delimiter" @change="(v) => updateConfig('delimiter', v)"
                      style="width: 80px"/>
          </el-form-item>
        </template>

        <!-- transform.filter -->
        <template v-else-if="selected.type === 'transform.filter'">
          <el-form-item :label="i18n('etl.property.transform.filter.condition')">
            <el-input :model-value="selected.config.condition" @change="(v) => updateConfig('condition', v)"
                      type="textarea" :rows="3" placeholder="age > 18 && status === 'active'"/>
          </el-form-item>
        </template>

        <!-- transform.map -->
        <template v-else-if="selected.type === 'transform.map'">
          <el-form-item :label="i18n('etl.property.transform.map.mappings')">
            <div class="list-editor">
              <div v-for="(m, idx) in (selected.config.mappings ?? [])" :key="idx" class="list-row">
                <el-input :model-value="m.source" :placeholder="i18n('etl.property.transform.map.sourceField')"
                          @change="(v) => updateMapping(Number(idx), 'source', v)"/>
                <span class="arrow">→</span>
                <el-input :model-value="m.target" :placeholder="i18n('etl.property.transform.map.targetField')"
                          @change="(v) => updateMapping(Number(idx), 'target', v)"/>
                <el-button text type="danger" @click="removeMapping(Number(idx))">×</el-button>
              </div>
              <el-button @click="addMapping">+ {{ i18n("etl.btn.addRow") }}</el-button>
            </div>
          </el-form-item>
        </template>

        <!-- transform.join -->
        <template v-else-if="selected.type === 'transform.join'">
          <el-form-item :label="i18n('etl.property.transform.join.joinType')">
            <el-select :model-value="selected.config.joinType" @change="(v) => updateConfig('joinType', v)"
                       style="width: 100%">
              <el-option v-for="j in JOIN_TYPES" :key="j.value" :label="j.label" :value="j.value"/>
            </el-select>
          </el-form-item>
          <el-form-item :label="i18n('etl.property.transform.join.leftKey')">
            <el-input :model-value="selected.config.leftKey" @change="(v) => updateConfig('leftKey', v)"/>
          </el-form-item>
          <el-form-item :label="i18n('etl.property.transform.join.rightKey')">
            <el-input :model-value="selected.config.rightKey" @change="(v) => updateConfig('rightKey', v)"/>
          </el-form-item>
        </template>

        <!-- transform.aggregate -->
        <template v-else-if="selected.type === 'transform.aggregate'">
          <el-form-item :label="i18n('etl.property.transform.aggregate.groupBy')">
            <div class="list-editor">
              <div v-for="(g, idx) in (selected.config.groupBy ?? [])" :key="idx" class="list-row">
                <el-input :model-value="g" @change="(v) => updateStringItem('groupBy', Number(idx), v)"
                          placeholder="fieldName"/>
                <el-button text type="danger" @click="removeStringItem('groupBy', Number(idx))">×</el-button>
              </div>
              <el-button @click="addStringItem('groupBy')">+ {{ i18n("etl.btn.addRow") }}</el-button>
            </div>
          </el-form-item>
          <el-form-item :label="i18n('etl.property.transform.aggregate.aggregations')">
            <div class="list-editor">
              <div v-for="(a, idx) in (selected.config.aggregations ?? [])" :key="idx" class="list-row agg-row">
                <el-input :model-value="a.field" :placeholder="i18n('etl.property.transform.aggregate.field')"
                          @change="(v) => updateAggregation(Number(idx), 'field', v)"/>
                <el-select :model-value="a.func" @change="(v) => updateAggregation(Number(idx), 'func', v)"
                           style="width: 90px">
                  <el-option v-for="f in AGGREGATION_FUNCTIONS" :key="f.value" :label="f.label" :value="f.value"/>
                </el-select>
                <el-input :model-value="a.alias" :placeholder="i18n('etl.property.transform.aggregate.alias')"
                          @change="(v) => updateAggregation(Number(idx), 'alias', v)"/>
                <el-button text type="danger" @click="removeAggregation(Number(idx))">×</el-button>
              </div>
              <el-button @click="addAggregation">+ {{ i18n("etl.btn.addRow") }}</el-button>
            </div>
          </el-form-item>
        </template>

        <!-- transform.sort -->
        <template v-else-if="selected.type === 'transform.sort'">
          <el-form-item :label="i18n('etl.property.transform.sort.sortFields')">
            <div class="list-editor">
              <div v-for="(s, idx) in (selected.config.sortFields ?? [])" :key="idx" class="list-row">
                <el-input :model-value="s.field" :placeholder="i18n('etl.property.transform.sort.field')"
                          @change="(v) => updateSortField(Number(idx), 'field', v)"/>
                <el-select :model-value="s.direction" @change="(v) => updateSortField(Number(idx), 'direction', v)"
                           style="width: 100px">
                  <el-option v-for="d in SORT_DIRECTIONS" :key="d.value" :label="d.label" :value="d.value"/>
                </el-select>
                <el-button text type="danger" @click="removeSortField(Number(idx))">×</el-button>
              </div>
              <el-button @click="addSortField">+ {{ i18n("etl.btn.addRow") }}</el-button>
            </div>
          </el-form-item>
        </template>

        <!-- transform.deduplicate -->
        <template v-else-if="selected.type === 'transform.deduplicate'">
          <el-form-item :label="i18n('etl.property.transform.deduplicate.keys')">
            <div class="list-editor">
              <div v-for="(k, idx) in (selected.config.keys ?? [])" :key="idx" class="list-row">
                <el-input :model-value="k" @change="(v) => updateStringItem('keys', Number(idx), v)"
                          placeholder="fieldName"/>
                <el-button text type="danger" @click="removeStringItem('keys', Number(idx))">×</el-button>
              </div>
              <el-button @click="addStringItem('keys')">+ {{ i18n("etl.btn.addRow") }}</el-button>
            </div>
          </el-form-item>
        </template>

        <!-- transform.formula -->
        <template v-else-if="selected.type === 'transform.formula'">
          <el-form-item :label="i18n('etl.property.transform.formula.field')">
            <el-input :model-value="selected.config.field" @change="(v) => updateConfig('field', v)"/>
          </el-form-item>
          <el-form-item :label="i18n('etl.property.transform.formula.formula')">
            <el-input :model-value="selected.config.formula" @change="(v) => updateConfig('formula', v)" type="textarea"
                      :rows="3" placeholder="price * quantity"/>
          </el-form-item>
        </template>

        <!-- destination.database -->
        <template v-else-if="selected.type === 'destination.database'">
          <el-form-item :label="i18n('etl.property.destination.database.connection')">
            <el-input :model-value="selected.config.connection" @change="(v) => updateConfig('connection', v)"/>
          </el-form-item>
          <el-form-item :label="i18n('etl.property.destination.database.table')">
            <el-input :model-value="selected.config.table" @change="(v) => updateConfig('table', v)"/>
          </el-form-item>
          <el-form-item :label="i18n('etl.property.destination.database.mode')">
            <el-select :model-value="selected.config.mode" @change="(v) => updateConfig('mode', v)" style="width: 100%">
              <el-option v-for="m in WRITE_MODES" :key="m.value" :label="m.label" :value="m.value"/>
            </el-select>
          </el-form-item>
        </template>

        <!-- destination.api -->
        <template v-else-if="selected.type === 'destination.api'">
          <el-form-item :label="i18n('etl.property.destination.api.url')">
            <el-input :model-value="selected.config.url" @change="(v) => updateConfig('url', v)"/>
          </el-form-item>
          <el-form-item :label="i18n('etl.property.destination.api.method')">
            <el-select :model-value="selected.config.method" @change="(v) => updateConfig('method', v)"
                       style="width: 100%">
              <el-option v-for="m in HTTP_METHODS" :key="m.value" :label="m.label" :value="m.value"/>
            </el-select>
          </el-form-item>
        </template>

        <!-- destination.file -->
        <template v-else-if="selected.type === 'destination.file'">
          <el-form-item :label="i18n('etl.property.destination.file.path')">
            <el-input :model-value="selected.config.path" @change="(v) => updateConfig('path', v)"/>
          </el-form-item>
          <el-form-item :label="i18n('etl.property.destination.file.format')">
            <el-select :model-value="selected.config.format" @change="(v) => updateConfig('format', v)"
                       style="width: 100%">
              <el-option v-for="f in FILE_FORMATS" :key="f.value" :label="f.label" :value="f.value"/>
            </el-select>
          </el-form-item>
        </template>

        <!-- destination.webhook -->
        <template v-else-if="selected.type === 'destination.webhook'">
          <el-form-item :label="i18n('etl.property.destination.webhook.url')">
            <el-input :model-value="selected.config.url" @change="(v) => updateConfig('url', v)"/>
          </el-form-item>
        </template>

        <!-- control.branch -->
        <template v-else-if="selected.type === 'control.branch'">
          <el-form-item :label="i18n('etl.property.control.branch.branches')">
            <div class="list-editor">
              <div v-for="(b, idx) in (selected.config.branches ?? [])" :key="idx" class="list-row branch-row">
                <el-input :model-value="b.label" :placeholder="i18n('etl.property.control.branch.label')"
                          @change="(v) => updateBranch(Number(idx), 'label', v)"/>
                <el-input :model-value="b.condition" :placeholder="i18n('etl.property.control.branch.condition')"
                          @change="(v) => updateBranch(Number(idx), 'condition', v)"/>
                <el-button text type="danger" @click="removeBranch(Number(idx))">×</el-button>
              </div>
              <el-button @click="addBranch">+ {{ i18n("etl.btn.addRow") }}</el-button>
            </div>
          </el-form-item>
        </template>

        <!-- control.merge: 无配置 -->
        <template v-else-if="selected.type === 'control.merge'">
          <div class="empty-tip">{{ i18n("etl.property.config") }}</div>
        </template>

        <el-form-item>
          <el-button type="danger" plain @click="handleRemoveNode">
            <span class="svg-icon" v-html="icons.delete"></span>
            {{ i18n("btn.delete") }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.etl-property-panel {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-left: 1px solid var(--el-border-color);
  background: var(--el-bg-color);
  overflow: hidden;

  .panel-title {
    padding: 8px 12px;
    font-weight: 600;
    border-bottom: 1px solid var(--el-border-color);
  }

  .panel-body {
    flex: 1;
    overflow: auto;
    padding: 8px;
  }

  .empty-tip {
    padding: 40px 12px;
    text-align: center;
    color: var(--el-text-color-secondary);
    font-size: 13px;
  }

  .pos-row {
    display: flex;
    gap: 4px;

    :deep(.el-input-number) {
      flex: 1;
    }
  }

  .list-editor {
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 100%;

    .list-row {
      display: flex;
      align-items: center;
      gap: 4px;

      .arrow {
        color: var(--el-text-color-secondary);
        font-size: 12px;
        flex-shrink: 0;
      }

      :deep(.el-input) {
        flex: 1;
      }

      &.agg-row,
      &.branch-row {
        flex-wrap: wrap;
      }
    }
  }
}

.svg-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1em;
  height: 1em;
  margin-right: 4px;
}

.svg-icon :deep(svg) {
  width: 100%;
  height: 100%;
}
</style>
