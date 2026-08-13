<script setup lang="ts" name="PrintPropertyPanel">
/**
 * 打印模板设计器 - 右侧属性面板
 * 职责：编辑选中元素 + 纸张配置
 * 按元素类型动态切换编辑表单
 */
import { computed, watch } from "vue";
import { i18n } from "@/lang";
import {
  BARCODE_SYMBOLOGY_OPTIONS,
  FONT_SIZE_PRESETS,
  PRESET_PAPERS,
  SYSTEM_VAR_OPTIONS,
} from "../constants";
import type { PrintDataBinding, PrintElement, PrintPaper } from "../types";
import type { UsePrintDesignerReturn } from "../composables/usePrintDesigner";

const props = defineProps<{
  designer: UsePrintDesignerReturn;
}>();

const selected = computed<PrintElement | null>(
  () => props.designer.selectedElement.value,
);
const paper = computed<PrintPaper>(() => props.designer.state.template.paper);

const updateEl = (patch: Partial<PrintElement>) => {
  if (!selected.value) return;
  props.designer.updateElement(selected.value.id, patch);
};

const updateElStyle = (patch: Record<string, any>) => {
  if (!selected.value) return;
  props.designer.updateElementStyle(selected.value.id, patch);
};

const updatePaper = (patch: Partial<PrintPaper>) => {
  props.designer.updatePaper(patch);
};

const onPaperPresetChange = (name: string) => {
  const preset = PRESET_PAPERS.find((p) => p.name === name);
  if (preset) {
    updatePaper({ ...preset });
  }
};

watch(
  selected,
  () => {
    // 选中变化时无需特殊处理，computed 自动响应
  },
  { deep: true },
);
</script>

<template>
  <div class="print-property-panel">
    <el-tabs class="property-tabs">
      <el-tab-pane :label="i18n('print.property.element')" name="element">
        <div v-if="!selected" class="empty-tip">
          {{ i18n("print.property.selectFirst") }}
        </div>
        <el-form v-else label-width="80px" class="property-form">
          <!-- 基础属性 -->
          <el-divider content-position="left">{{
            i18n("print.property.basic")
          }}</el-divider>
          <el-form-item :label="i18n('print.property.name')">
            <el-input
              v-model="selected.name"
              @change="updateEl({ name: selected!.name })"
            />
          </el-form-item>
          <el-form-item :label="i18n('print.property.position')">
            <div class="pos-row">
              <el-input-number
                v-model="selected.x"
                :min="0"
                :step="0.1"
                :precision="1"
                @change="updateEl({ x: selected!.x })"
              />
              <el-input-number
                v-model="selected.y"
                :min="0"
                :step="0.1"
                :precision="1"
                @change="updateEl({ y: selected!.y })"
              />
            </div>
          </el-form-item>
          <el-form-item :label="i18n('print.property.size')">
            <div class="pos-row">
              <el-input-number
                v-model="selected.width"
                :min="0"
                :step="0.1"
                :precision="1"
                @change="updateEl({ width: selected!.width })"
              />
              <el-input-number
                v-model="selected.height"
                :min="0"
                :step="0.1"
                :precision="1"
                @change="updateEl({ height: selected!.height })"
              />
            </div>
          </el-form-item>

          <!-- 数据绑定 -->
          <el-divider content-position="left">{{
            i18n("print.property.dataBind")
          }}</el-divider>
          <el-form-item :label="i18n('print.property.bindSource')">
            <el-select
              :model-value="selected.dataBinding?.source || 'static'"
              @change="
                (v) =>
                  updateEl({
                    dataBinding: {
                      ...(selected!.dataBinding || {}),
                      source: v,
                    },
                  })
              "
            >
              <el-option :label="i18n('print.bind.static')" value="static" />
              <el-option :label="i18n('print.bind.field')" value="field" />
              <el-option :label="i18n('print.bind.system')" value="system" />
              <el-option :label="i18n('print.bind.formula')" value="formula" />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="i18n('print.property.bindValue')"
            v-if="selected.dataBinding?.source === 'static'"
          >
            <el-input
              v-model="selected.dataBinding.staticValue"
              @change="updateEl({ dataBinding: selected!.dataBinding })"
            />
          </el-form-item>
          <el-form-item
            :label="i18n('print.property.bindValue')"
            v-if="selected.dataBinding?.source === 'field'"
          >
            <el-input
              v-model="selected.dataBinding.fieldName"
              @change="updateEl({ dataBinding: selected!.dataBinding })"
              placeholder="field.path"
            />
          </el-form-item>
          <el-form-item
            :label="i18n('print.property.bindValue')"
            v-if="selected.dataBinding?.source === 'system'"
          >
            <el-select
              :model-value="selected.dataBinding.systemVar"
              @change="
                (v) =>
                  updateEl({
                    dataBinding: {
                      source: 'system',
                      ...(selected!.dataBinding || {}),
                      systemVar: v,
                    } as PrintDataBinding,
                  })
              "
            >
              <el-option
                v-for="opt in SYSTEM_VAR_OPTIONS"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
              />
            </el-select>
          </el-form-item>

          <!-- 文本类样式 -->
          <template
            v-if="
              ['text', 'datetime', 'counter', 'table'].includes(selected.type)
            "
          >
            <el-divider content-position="left">{{
              i18n("print.property.font")
            }}</el-divider>
            <el-form-item :label="i18n('print.property.fontSize')">
              <el-select
                :model-value="selected.style?.fontSize"
                @change="(v) => updateElStyle({ fontSize: v })"
                allow-create
                filterable
              >
                <el-option
                  v-for="size in FONT_SIZE_PRESETS"
                  :key="size"
                  :label="size + 'pt'"
                  :value="size"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="i18n('print.property.fontWeight')">
              <el-select
                :model-value="selected.style?.fontWeight || 'normal'"
                @change="(v) => updateElStyle({ fontWeight: v })"
              >
                <el-option label="Normal" value="normal" />
                <el-option label="Bold" value="bold" />
                <el-option label="Lighter" value="lighter" />
                <el-option label="Bolder" value="bolder" />
              </el-select>
            </el-form-item>
            <el-form-item :label="i18n('print.property.color')">
              <el-color-picker
                :model-value="selected.style?.color || '#000000'"
                @change="(v) => updateElStyle({ color: v })"
              />
            </el-form-item>
            <el-form-item :label="i18n('print.property.textAlign')">
              <el-radio-group
                :model-value="selected.style?.textAlign || 'left'"
                @change="(v) => updateElStyle({ textAlign: v })"
              >
                <el-radio-button value="left">L</el-radio-button>
                <el-radio-button value="center">C</el-radio-button>
                <el-radio-button value="right">R</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </template>

          <!-- 条码专属 -->
          <template v-if="selected.type === 'barcode'">
            <el-divider content-position="left">{{
              i18n("print.property.barcode")
            }}</el-divider>
            <el-form-item :label="i18n('print.property.symbology')">
              <el-select
                :model-value="(selected as any).symbology"
                @change="(v) => updateEl({ symbology: v } as any)"
              >
                <el-option
                  v-for="opt in BARCODE_SYMBOLOGY_OPTIONS"
                  :key="opt.value"
                  :label="opt.label"
                  :value="opt.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="i18n('print.property.displayText')">
              <el-switch
                :model-value="(selected as any).displayText"
                @change="(v) => updateEl({ displayText: v } as any)"
              />
            </el-form-item>
          </template>

          <!-- 二维码专属 -->
          <template v-if="selected.type === 'qrcode'">
            <el-divider content-position="left">{{
              i18n("print.property.qrcode")
            }}</el-divider>
            <el-form-item :label="i18n('print.property.errorCorrection')">
              <el-radio-group
                :model-value="(selected as any).errorCorrectionLevel"
                @change="(v) => updateEl({ errorCorrectionLevel: v } as any)"
              >
                <el-radio-button value="L">L</el-radio-button>
                <el-radio-button value="M">M</el-radio-button>
                <el-radio-button value="Q">Q</el-radio-button>
                <el-radio-button value="H">H</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </template>

          <!-- 表格专属 -->
          <template v-if="selected.type === 'table'">
            <el-divider content-position="left">{{
              i18n("print.property.table")
            }}</el-divider>
            <el-form-item :label="i18n('print.property.dataField')">
              <el-input
                :model-value="(selected as any).dataField"
                @change="(v) => updateEl({ dataField: v } as any)"
              />
            </el-form-item>
            <el-form-item :label="i18n('print.property.rowHeight')">
              <el-input-number
                :model-value="(selected as any).rowHeight"
                :min="1"
                @change="(v) => updateEl({ rowHeight: v } as any)"
              />
            </el-form-item>
            <el-form-item :label="i18n('print.property.showHeader')">
              <el-switch
                :model-value="(selected as any).showHeader"
                @change="(v) => updateEl({ showHeader: v } as any)"
              />
            </el-form-item>
          </template>
        </el-form>
      </el-tab-pane>

      <el-tab-pane :label="i18n('print.property.paper')" name="paper">
        <el-form label-width="80px" class="property-form">
          <el-form-item :label="i18n('print.property.preset')">
            <el-select :model-value="paper.name" @change="onPaperPresetChange">
              <el-option
                v-for="p in PRESET_PAPERS"
                :key="p.name"
                :label="p.name"
                :value="p.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="i18n('print.property.size')">
            <div class="pos-row">
              <el-input-number
                v-model="paper.width"
                :min="10"
                :step="1"
                @change="updatePaper({ width: paper.width })"
              />
              <el-input-number
                v-model="paper.height"
                :min="10"
                :step="1"
                @change="updatePaper({ height: paper.height })"
              />
            </div>
          </el-form-item>
          <el-form-item :label="i18n('print.property.orientation')">
            <el-radio-group
              :model-value="paper.orientation"
              @change="(v) => updatePaper({ orientation: v })"
            >
              <el-radio-button value="portrait">{{
                i18n("print.paper.portrait")
              }}</el-radio-button>
              <el-radio-button value="landscape">{{
                i18n("print.paper.landscape")
              }}</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-divider content-position="left">{{
            i18n("print.property.margin")
          }}</el-divider>
          <el-form-item :label="i18n('print.property.marginTop')">
            <el-input-number
              v-model="paper.margin[0]"
              :min="0"
              :step="0.5"
              :precision="1"
              @change="updatePaper({ margin: [...paper.margin] })"
            />
          </el-form-item>
          <el-form-item :label="i18n('print.property.marginRight')">
            <el-input-number
              v-model="paper.margin[1]"
              :min="0"
              :step="0.5"
              :precision="1"
              @change="updatePaper({ margin: [...paper.margin] })"
            />
          </el-form-item>
          <el-form-item :label="i18n('print.property.marginBottom')">
            <el-input-number
              v-model="paper.margin[2]"
              :min="0"
              :step="0.5"
              :precision="1"
              @change="updatePaper({ margin: [...paper.margin] })"
            />
          </el-form-item>
          <el-form-item :label="i18n('print.property.marginLeft')">
            <el-input-number
              v-model="paper.margin[3]"
              :min="0"
              :step="0.5"
              :precision="1"
              @change="updatePaper({ margin: [...paper.margin] })"
            />
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style lang="scss" scoped>
.print-property-panel {
  width: 280px;
  height: 100%;
  background: var(--el-bg-color);
  border-left: 1px solid var(--el-border-color-lighter);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;

  .property-tabs {
    height: 100%;
    display: flex;
    flex-direction: column;

    :deep(.el-tabs__content) {
      flex: 1;
      overflow-y: auto;
      padding: 8px;
    }
  }

  .empty-tip {
    padding: 40px 12px;
    text-align: center;
    color: var(--el-text-color-secondary);
    font-size: 13px;
  }

  .property-form {
    .pos-row {
      display: flex;
      gap: 4px;

      :deep(.el-input-number) {
        flex: 1;
        width: 100%;
      }
    }
  }
}
</style>
