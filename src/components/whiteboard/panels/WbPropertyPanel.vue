<script setup lang="ts" name="WbPropertyPanel">
import { computed } from "vue";
import { i18n } from "@/lang";
import type { UseWhiteboardDesignerReturn } from "../composables/useWhiteboardDesigner";
import {
  WB_COLOR_PRESETS,
  WB_FONT_SIZE_PRESETS,
  WB_LINE_WIDTH_PRESETS,
  WB_OPACITY_PRESETS,
} from "../constants";
import type {
  LineElement,
  PenElement,
  ShapeElement,
  TextElement,
} from "../types";

const props = defineProps<{
  designer: UseWhiteboardDesignerReturn;
  readonly?: boolean;
}>();

const designer = props.designer;

const element = computed(() => designer.selectedElement.value);

const isShape = computed(() => element.value?.type === "shape");
const isPen = computed(() => element.value?.type === "pen");
const isLine = computed(() => element.value?.type === "line");
const isText = computed(() => element.value?.type === "text");

const presetColors = WB_COLOR_PRESETS.filter(
  (p) => p.value !== "transparent",
).map((p) => p.value);

const update = (patch: Record<string, any>) => {
  if (!element.value || props.readonly) return;
  designer.updateElement(element.value.id, patch);
};

const commit = () => {
  if (!props.readonly) designer.pushHistory();
};
</script>

<template>
  <div class="wb-property-panel">
    <div class="panel-header">
      <span class="panel-title">{{ i18n("whiteboard.property.title") }}</span>
    </div>

    <div class="panel-body" v-if="element">
      <!-- 通用：透明度 -->
      <el-form label-width="70px">
        <el-form-item :label="i18n('whiteboard.opacity')">
          <el-select
            :model-value="element.opacity ?? 1"
            @change="
              (v: number) => {
                update({ opacity: v });
                commit();
              }
            "
            style="width: 100%"
          >
            <el-option
              v-for="o in WB_OPACITY_PRESETS"
              :key="o.value"
              :label="o.label"
              :value="o.value"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <!-- pen 属性 -->
      <template v-if="isPen">
        <div class="group-title">{{ i18n("whiteboard.tool.pen") }}</div>
        <el-form label-width="70px">
          <el-form-item :label="i18n('whiteboard.color.stroke')">
            <el-color-picker
              :model-value="(element as PenElement).stroke"
              @change="
                (v: string | null) => {
                  update({ stroke: v || '#000' });
                  commit();
                }
              "
              :predefine="presetColors"
            />
          </el-form-item>
          <el-form-item :label="i18n('whiteboard.lineWidth')">
            <el-select
              :model-value="(element as PenElement).strokeWidth"
              @change="
                (v: number) => {
                  update({ strokeWidth: v });
                  commit();
                }
              "
              style="width: 100%"
            >
              <el-option
                v-for="w in WB_LINE_WIDTH_PRESETS"
                :key="w.value"
                :label="w.label"
                :value="w.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </template>

      <!-- shape 属性 -->
      <template v-if="isShape">
        <div class="group-title">{{ i18n("whiteboard.property.size") }}</div>
        <el-form label-width="70px">
          <el-form-item :label="i18n('whiteboard.property.position')">
            <div class="inline-form">
              <el-input-number
                :model-value="(element as ShapeElement).x"
                @change="(v: number) => update({ x: v })"
                @blur="commit"
                :controls="false"
                placeholder="X"
              />
              <el-input-number
                :model-value="(element as ShapeElement).y"
                @change="(v: number) => update({ y: v })"
                @blur="commit"
                :controls="false"
                placeholder="Y"
              />
            </div>
          </el-form-item>
          <el-form-item :label="i18n('whiteboard.property.size')">
            <div class="inline-form">
              <el-input-number
                :model-value="(element as ShapeElement).width"
                @change="(v: number) => update({ width: v })"
                @blur="commit"
                :controls="false"
                placeholder="W"
              />
              <el-input-number
                :model-value="(element as ShapeElement).height"
                @change="(v: number) => update({ height: v })"
                @blur="commit"
                :controls="false"
                placeholder="H"
              />
            </div>
          </el-form-item>
          <el-form-item :label="i18n('whiteboard.property.rotation')">
            <el-slider
              :model-value="element.rotation ?? 0"
              @change="
                (v: number) => {
                  update({ rotation: v });
                  commit();
                }
              "
              :min="0"
              :max="360"
              style="width: 100%"
            />
          </el-form-item>
        </el-form>
        <div class="group-title">{{ i18n("whiteboard.color.stroke") }}</div>
        <el-form label-width="70px">
          <el-form-item :label="i18n('whiteboard.color.stroke')">
            <el-color-picker
              :model-value="(element as ShapeElement).stroke"
              @change="
                (v: string | null) => {
                  update({ stroke: v || '#000' });
                  commit();
                }
              "
              :predefine="presetColors"
            />
          </el-form-item>
          <el-form-item :label="i18n('whiteboard.color.fill')">
            <el-color-picker
              :model-value="
                (element as ShapeElement).fill === 'transparent'
                  ? null
                  : (element as ShapeElement).fill
              "
              @change="
                (v: string | null) => {
                  update({ fill: v || 'transparent' });
                  commit();
                }
              "
              show-alpha
              :predefine="presetColors"
            />
          </el-form-item>
          <el-form-item :label="i18n('whiteboard.lineWidth')">
            <el-select
              :model-value="(element as ShapeElement).strokeWidth"
              @change="
                (v: number) => {
                  update({ strokeWidth: v });
                  commit();
                }
              "
              style="width: 100%"
            >
              <el-option
                v-for="w in WB_LINE_WIDTH_PRESETS"
                :key="w.value"
                :label="w.label"
                :value="w.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </template>

      <!-- line / arrow 属性 -->
      <template v-if="isLine">
        <div class="group-title">{{ i18n("whiteboard.tool.line") }}</div>
        <el-form label-width="70px">
          <el-form-item :label="i18n('whiteboard.property.position')">
            <div class="inline-form">
              <el-input-number
                :model-value="(element as LineElement).x1"
                @change="(v: number) => update({ x1: v })"
                @blur="commit"
                :controls="false"
                placeholder="X1"
              />
              <el-input-number
                :model-value="(element as LineElement).y1"
                @change="(v: number) => update({ y1: v })"
                @blur="commit"
                :controls="false"
                placeholder="Y1"
              />
            </div>
          </el-form-item>
          <el-form-item :label="i18n('whiteboard.property.size')">
            <div class="inline-form">
              <el-input-number
                :model-value="(element as LineElement).x2"
                @change="(v: number) => update({ x2: v })"
                @blur="commit"
                :controls="false"
                placeholder="X2"
              />
              <el-input-number
                :model-value="(element as LineElement).y2"
                @change="(v: number) => update({ y2: v })"
                @blur="commit"
                :controls="false"
                placeholder="Y2"
              />
            </div>
          </el-form-item>
          <el-form-item :label="i18n('whiteboard.color.stroke')">
            <el-color-picker
              :model-value="(element as LineElement).stroke"
              @change="
                (v: string | null) => {
                  update({ stroke: v || '#000' });
                  commit();
                }
              "
              :predefine="presetColors"
            />
          </el-form-item>
          <el-form-item :label="i18n('whiteboard.lineWidth')">
            <el-select
              :model-value="(element as LineElement).strokeWidth"
              @change="
                (v: number) => {
                  update({ strokeWidth: v });
                  commit();
                }
              "
              style="width: 100%"
            >
              <el-option
                v-for="w in WB_LINE_WIDTH_PRESETS"
                :key="w.value"
                :label="w.label"
                :value="w.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </template>

      <!-- text 属性 -->
      <template v-if="isText">
        <div class="group-title">{{ i18n("whiteboard.tool.text") }}</div>
        <el-form label-width="70px">
          <el-form-item :label="i18n('whiteboard.property.position')">
            <div class="inline-form">
              <el-input-number
                :model-value="(element as TextElement).x"
                @change="(v: number) => update({ x: v })"
                @blur="commit"
                :controls="false"
                placeholder="X"
              />
              <el-input-number
                :model-value="(element as TextElement).y"
                @change="(v: number) => update({ y: v })"
                @blur="commit"
                :controls="false"
                placeholder="Y"
              />
            </div>
          </el-form-item>
          <el-form-item :label="i18n('whiteboard.property.size')">
            <div class="inline-form">
              <el-input-number
                :model-value="(element as TextElement).width"
                @change="(v: number) => update({ width: v })"
                @blur="commit"
                :controls="false"
                placeholder="W"
              />
              <el-input-number
                :model-value="(element as TextElement).height"
                @change="(v: number) => update({ height: v })"
                @blur="commit"
                :controls="false"
                placeholder="H"
              />
            </div>
          </el-form-item>
          <el-form-item :label="i18n('whiteboard.property.text')">
            <el-input
              :model-value="(element as TextElement).text"
              @change="
                (v: string) => {
                  update({ text: v });
                  commit();
                }
              "
              type="textarea"
              :rows="3"
              :placeholder="i18n('whiteboard.text.placeholder')"
            />
          </el-form-item>
          <el-form-item :label="i18n('whiteboard.fontSize')">
            <el-select
              :model-value="(element as TextElement).fontSize"
              @change="
                (v: number) => {
                  update({ fontSize: v });
                  commit();
                }
              "
              style="width: 100%"
            >
              <el-option
                v-for="s in WB_FONT_SIZE_PRESETS"
                :key="s.value"
                :label="s.label"
                :value="s.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="i18n('whiteboard.color.stroke')">
            <el-color-picker
              :model-value="(element as TextElement).color"
              @change="
                (v: string | null) => {
                  update({ color: v || '#000' });
                  commit();
                }
              "
              :predefine="presetColors"
            />
          </el-form-item>
        </el-form>
      </template>
    </div>

    <div class="panel-body empty" v-else>
      <span>{{ i18n("whiteboard.property.empty") }}</span>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "WbPropertyPanel",
};
</script>

<style lang="scss" scoped>
.wb-property-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  border-left: 1px solid var(--el-border-color-lighter);
  background: var(--el-bg-color);

  .panel-header {
    padding: 8px 12px;
    border-bottom: 1px solid var(--el-border-color-lighter);
    font-weight: 600;
    font-size: 13px;

    .panel-title {
      color: var(--el-text-color-primary);
    }
  }

  .panel-body {
    flex: 1;
    overflow: auto;
    padding: 8px 12px;

    &.empty {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--el-text-color-placeholder);
      font-size: 12px;
    }

    .group-title {
      font-size: 12px;
      color: var(--el-text-color-secondary);
      margin: 8px 0 4px;
      padding-bottom: 4px;
      border-bottom: 1px solid var(--el-border-color-lighter);
      font-weight: 600;
    }

    .inline-form {
      display: flex;
      gap: 4px;

      :deep(.el-input-number) {
        flex: 1;
        width: 0;
      }
    }
  }
}
</style>
