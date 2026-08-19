<script setup lang="ts" name="PdfPropertyPanel">
import { computed } from "vue";
import { i18n } from "@/lang";
import type { PdfDesigner } from "../composables/usePdfDesigner";
import { PDF_FONT_FAMILY_PRESETS } from "../constants";

const props = defineProps<{
  designer: PdfDesigner;
  readonly?: boolean;
}>();

const el = computed(() => props.designer.selectedElement.value as any);

const isTextLike = computed(
  () =>
    el.value &&
    ["text", "heading", "paragraph", "date"].includes(el.value.type),
);

const isImageLike = computed(
  () => el.value && ["image", "signature"].includes(el.value.type),
);

const isTable = computed(() => el.value?.type === "table");

const isDivider = computed(() => el.value?.type === "divider");

const isBarcode = computed(
  () => el.value?.type === "barcode" || el.value?.type === "qrcode",
);

const isCheckbox = computed(() => el.value?.type === "checkbox");

const handleAddColumn = () => {
  if (!el.value) return;
  el.value.columns.push({
    field: `col${el.value.columns.length + 1}`,
    label: i18n("pdf.table.column") + (el.value.columns.length + 1),
    width: 50,
    align: "left",
  });
};

const handleRemoveColumn = (idx: number) => {
  el.value.columns.splice(idx, 1);
};
</script>

<template>
  <div class="pdf-property-panel">
    <div class="panel-header">{{ i18n("pdf.property.title") }}</div>
    <div class="panel-body" v-if="el">
      <el-form label-width="80px" :disabled="readonly">
        <el-form-item :label="i18n('pdf.property.x')">
          <el-input-number v-model="el.x" :min="0" :precision="1" />
        </el-form-item>
        <el-form-item :label="i18n('pdf.property.y')">
          <el-input-number v-model="el.y" :min="0" :precision="1" />
        </el-form-item>
        <el-form-item :label="i18n('pdf.property.width')">
          <el-input-number v-model="el.width" :min="1" :precision="1" />
        </el-form-item>
        <el-form-item :label="i18n('pdf.property.height')">
          <el-input-number v-model="el.height" :min="1" :precision="1" />
        </el-form-item>
        <el-form-item :label="i18n('pdf.property.rotation')">
          <el-input-number
            v-model="el.rotation"
            :min="-360"
            :max="360"
            :step="15"
            :precision="0"
          />
        </el-form-item>
        <el-form-item :label="i18n('pdf.property.zIndex')">
          <el-input-number v-model="el.zIndex" :min="0" :precision="0" />
        </el-form-item>

        <template v-if="isTextLike">
          <el-form-item :label="i18n('pdf.property.text')">
            <el-input v-model="el.text" type="textarea" :rows="3" />
          </el-form-item>
          <el-form-item :label="i18n('pdf.property.dataField')">
            <el-input
              v-model="el.dataField"
              :placeholder="i18n('pdf.property.dataFieldPlaceholder')"
            />
          </el-form-item>
          <el-form-item :label="i18n('pdf.property.align')">
            <el-radio-group v-model="el.align">
              <el-radio-button value="left">L</el-radio-button>
              <el-radio-button value="center">C</el-radio-button>
              <el-radio-button value="right">R</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="i18n('pdf.property.fontFamily')">
            <el-select v-model="el.font.family" style="width: 100%">
              <el-option
                v-for="f in PDF_FONT_FAMILY_PRESETS"
                :key="f"
                :label="f"
                :value="f"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="i18n('pdf.property.fontSize')">
            <el-input-number v-model="el.font.size" :min="6" :max="72" />
          </el-form-item>
          <el-form-item :label="i18n('pdf.property.fontWeight')">
            <el-switch
              v-model="el.font.weight"
              active-value="bold"
              inactive-value="normal"
            />
          </el-form-item>
          <el-form-item :label="i18n('pdf.property.fontStyle')">
            <el-switch
              v-model="el.font.style"
              active-value="italic"
              inactive-value="normal"
            />
          </el-form-item>
          <el-form-item :label="i18n('pdf.property.color')">
            <el-color-picker v-model="el.font.color" />
          </el-form-item>
        </template>

        <template v-if="isImageLike">
          <el-form-item :label="i18n('pdf.property.src')">
            <el-input
              v-model="el.src"
              :placeholder="i18n('pdf.property.srcPlaceholder')"
            />
          </el-form-item>
          <el-form-item :label="i18n('pdf.property.fit')">
            <el-select v-model="el.fit" style="width: 100%">
              <el-option
                :label="i18n('pdf.property.fitContain')"
                value="contain"
              />
              <el-option :label="i18n('pdf.property.fitCover')" value="cover" />
              <el-option :label="i18n('pdf.property.fitFill')" value="fill" />
            </el-select>
          </el-form-item>
          <el-form-item :label="i18n('pdf.property.dataField')">
            <el-input v-model="el.dataField" />
          </el-form-item>
        </template>

        <template v-if="isTable">
          <el-form-item :label="i18n('pdf.property.dataSource')">
            <el-input v-model="el.dataSource" />
          </el-form-item>
          <el-form-item :label="i18n('pdf.property.headerBgColor')">
            <el-color-picker v-model="el.headerBgColor" />
          </el-form-item>
          <el-divider>{{ i18n("pdf.property.columns") }}</el-divider>
          <div v-for="(col, idx) in el.columns" :key="idx" class="col-row">
            <el-input
              v-model="col.label"
              :placeholder="i18n('pdf.property.columnLabel')"
            />
            <el-input-number
              v-model="col.width"
              :min="10"
              style="width: 80px"
            />
            <el-button text @click="handleRemoveColumn(Number(idx))">
              <el-icon>
                <Delete />
              </el-icon>
            </el-button>
          </div>
          <el-button
            @click="handleAddColumn"
            style="width: 100%; margin-top: 4px"
          >
            <el-icon>
              <Plus />
            </el-icon>
            {{ i18n("pdf.property.addColumn") }}
          </el-button>
        </template>

        <template v-if="isDivider">
          <el-form-item :label="i18n('pdf.property.dividerColor')">
            <el-color-picker v-model="el.color" />
          </el-form-item>
          <el-form-item :label="i18n('pdf.property.dividerThickness')">
            <el-input-number v-model="el.thickness" :min="1" :max="10" />
          </el-form-item>
          <el-form-item :label="i18n('pdf.property.dividerStyle')">
            <el-select v-model="el.style" style="width: 100%">
              <el-option value="solid" label="Solid" />
              <el-option value="dashed" label="Dashed" />
              <el-option value="dotted" label="Dotted" />
            </el-select>
          </el-form-item>
        </template>

        <template v-if="isBarcode">
          <el-form-item :label="i18n('pdf.property.barcodeValue')">
            <el-input v-model="el.value" />
          </el-form-item>
          <el-form-item :label="i18n('pdf.property.barcodeFormat')">
            <el-select v-model="el.format" style="width: 100%">
              <el-option value="CODE128" label="CODE128" />
              <el-option value="EAN13" label="EAN13" />
              <el-option value="QR" label="QR" />
            </el-select>
          </el-form-item>
          <el-form-item :label="i18n('pdf.property.dataField')">
            <el-input v-model="el.dataField" />
          </el-form-item>
        </template>

        <template v-if="isCheckbox">
          <el-form-item :label="i18n('pdf.property.checkboxLabel')">
            <el-input v-model="el.label" />
          </el-form-item>
          <el-form-item :label="i18n('pdf.property.checkboxChecked')">
            <el-switch v-model="el.checked" />
          </el-form-item>
          <el-form-item :label="i18n('pdf.property.dataField')">
            <el-input v-model="el.dataField" />
          </el-form-item>
        </template>
      </el-form>
    </div>
    <div class="panel-empty" v-else>
      <el-empty :description="i18n('pdf.property.empty')" />
    </div>
  </div>
</template>

<script lang="ts">
import { Delete, Plus } from "@element-plus/icons-vue";

export default { components: { Delete, Plus } };
</script>

<style lang="scss" scoped>
.pdf-property-panel {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-left: 1px solid var(--el-border-color);
  background: var(--el-bg-color);
  overflow: hidden;

  .panel-header {
    padding: 8px 12px;
    font-weight: 600;
    border-bottom: 1px solid var(--el-border-color);
  }

  .panel-body {
    flex: 1;
    overflow: auto;
    padding: 12px;
  }

  .panel-empty {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .col-row {
    display: flex;
    gap: 4px;
    margin-bottom: 4px;
  }
}
</style>
