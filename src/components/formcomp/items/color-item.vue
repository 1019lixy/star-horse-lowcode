<template>
  <starhorse-form-item
      :showFormItem="showFormItem"
      :isDesign="isDesign"
      :disabled="disabled"
      :bareFlag="bareFlag"
      :field="field"
      :parentField="parentField"
  >
    <!-- PC 端：保持原逻辑 -->
    <el-color-picker
        v-if="!isSeparate"
        :fid="field.fieldName"
        :disabled="checkIsDisabled(props)"
        v-bind="prepsFilter(field.preps)"
        v-on="getDynamicEvents(props, itemAction, formData)"
        v-model="formData[field.fieldName]"
    />

    <!-- APP 端：触发器 + 抽屉色盘 -->
    <template v-else>
      <div class="color-trigger" @click="openPicker">
        <span
            class="color-trigger__swatch"
            :style="{ background: formData[field.fieldName] || 'transparent' }"
        >
          <el-icon v-if="!formData[field.fieldName]"><Plus/></el-icon>
        </span>
        <span class="color-trigger__text">
          {{ formData[field.fieldName] || "" }}
        </span>
      </div>

      <ShMobilePicker
          v-model="pickerVisible"
          :title="title"
          :placement="placement"
          :size="size"
          :show-footer="false"
          @confirm="handleConfirm"
          @cancel="handleCancel"
      >
        <div class="color-mobile-panel">
          <!-- 颜色预览 + hex 输入 -->
          <div class="color-mobile-panel__preview">
            <span
                class="color-mobile-panel__swatch"
                :style="{ background: tempColor || 'transparent' }"
            />
            <el-input
                v-model="tempColor"
                :placeholder="i18n('comp.colorHexPlaceholder')"
                size="default"
                class="color-mobile-panel__hex"
            >
              <template #prepend>#</template>
            </el-input>
          </div>

          <!-- 系统色板 -->
          <div class="color-mobile-panel__section">
            <div class="color-mobile-panel__label">{{ i18n('comp.presetColors') || '预设颜色' }}</div>
            <div class="color-mobile-panel__grid">
              <div
                  v-for="color in presetColors"
                  :key="color"
                  class="color-mobile-panel__cell"
                  :class="{ 'is-selected': tempColor.toLowerCase() === color.toLowerCase() }"
                  :style="{ background: color }"
                  @click="selectColor(color)"
              >
                <el-icon v-if="tempColor.toLowerCase() === color.toLowerCase()">
                  <Check/>
                </el-icon>
              </div>
            </div>
          </div>

          <!-- 自定义色板 -->
          <div class="color-mobile-panel__section">
            <div class="color-mobile-panel__label">{{ i18n('comp.customColor') || '自定义颜色' }}</div>
            <input
                type="color"
                v-model="tempColor"
                class="color-mobile-panel__native-picker"
            />
          </div>
        </div>
      </ShMobilePicker>
    </template>
  </starhorse-form-item>
</template>
<script setup lang="ts">
import {Check, Plus} from "@element-plus/icons-vue";
import {nextTick, onMounted, ref, watch} from "vue";
import {
  allAction,
  checkIsDisabled,
  initCompCallEvent,
  prepsFilter,
} from "@/components/formcomp/utils/ItemRelationEventUtils";
import {getDynamicEvents} from "@/api/system";
import {ItemPreps} from "@/components/types/ItemPreps";
import {i18n} from "@/lang";
import {useMobilePicker} from "@/components/formcomp/utils/useMobilePicker";
import ShMobilePicker from "@/components/formcomp/utils/ShMobilePicker.vue";

const props = withDefaults(defineProps<ItemPreps>(), {
  isDesign: false,
  disabled: false,
  showFormItem: false,
  bareFlag: false,
  isSearch: false,
});
const emits = defineEmits(["selfFunc", "selectItem"]);
const formData = defineModel("formData");
const itemAction = (prep: any) => {
  allAction(props, emits, formData, prep);
};

// APP 端分离逻辑
const {
  isSeparate,
  pickerVisible,
  placement,
  size,
  title,
  openPicker,
  closePicker,
} = useMobilePicker(() => props.field,props.source);

// 临时颜色
const tempColor = ref("");

// 预设色板
const presetColors = [
  "#409EFF", "#67C23A", "#E6A23C", "#F56C6C", "#909399",
  "#00C1CE", "#13C2C2", "#722ED1", "#EB2F96", "#FA8C16",
  "#A0D911", "#36CFC9", "#40A9FF", "#9254DE", "#F759AB",
  "#FFFFFF", "#EAEAEA", "#BFBFBF", "#8C8C8C", "#595959",
  "#262626", "#000000", "#FF7777", "#FFB400", "#FFFF00",
  "#00FF00", "#00FFFF", "#0000FF", "#FF00FF", "#FF0000",
];

function selectColor(color: string) {
  tempColor.value = color;
}

function handleClear() {
  tempColor.value = "";
  formData.value[props.field.fieldName] = "";
  itemAction("change");
  closePicker();
}

function handleConfirm() {
  let color = tempColor.value.trim();
  if (color && !color.startsWith("#")) {
    color = "#" + color;
  }
  formData.value[props.field.fieldName] = color;
  itemAction("change");
  closePicker();
}

function handleCancel() {
  closePicker();
}

// 打开时回显当前颜色
watch(pickerVisible, (val) => {
  if (val) {
    tempColor.value = formData.value?.[props.field.fieldName] || "";
  }
});

onMounted(() => {
  nextTick(() => {
    initCompCallEvent(props, emits, formData);
  });
});
</script>
<style lang="scss" scoped>
/* APP 端触发器 */
.color-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border: 1px solid var(--el-border-color, #dcdfe6);
  border-radius: 4px;
  min-height: 32px;

  &:active {
    border-color: var(--el-color-primary, #409eff);
  }

  &__swatch {
    width: 24px;
    height: 24px;
    border-radius: 4px;
    border: 1px solid var(--el-border-color-light, #e4e7ed);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    background-image: linear-gradient(45deg, #eee 25%, transparent 25%),
    linear-gradient(-45deg, #eee 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #eee 75%),
    linear-gradient(-45deg, transparent 75%, #eee 75%);
    background-size: 8px 8px;
    background-position: 0 0, 0 4px, 4px -4px, -4px 0;

    .el-icon {
      color: var(--el-text-color-placeholder, #c0c4cc);
      font-size: 14px;
    }
  }

  &__text {
    font-size: 14px;
    color: var(--el-text-color-regular, #606266);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

/* APP 端色盘面板 */
.color-mobile-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 12px;
  height: 100%;
  overflow-y: auto;

  &__preview {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
  }

  &__swatch {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    border: 1px solid var(--el-border-color, #dcdfe6);
    flex-shrink: 0;
    background-image: linear-gradient(45deg, #eee 25%, transparent 25%),
    linear-gradient(-45deg, #eee 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #eee 75%),
    linear-gradient(-45deg, transparent 75%, #eee 75%);
    background-size: 12px 12px;
    background-position: 0 0, 0 6px, 6px -6px, -6px 0;
  }

  &__hex {
    flex: 1;
  }

  &__section {
    flex-shrink: 0;
  }

  &__label {
    font-size: 14px;
    color: var(--el-text-color-primary, #303133);
    font-weight: 600;
    margin-bottom: 8px;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(36px, 1fr));
    gap: 6px;
  }

  &__cell {
    aspect-ratio: 1;
    border-radius: 6px;
    border: 2px solid transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.1s;
    width: 36px;

    &:active {
      transform: scale(0.9);
    }

    &.is-selected {
      border-color: var(--el-color-primary, #409eff);

      .el-icon {
        color: #fff;
        font-size: 12px;
        filter: drop-shadow(0 0 1px rgba(0, 0, 0, 0.5));
      }
    }
  }

  &__native-picker {
    width: 100%;
    height: 48px;
    border: 1px solid var(--el-border-color, #dcdfe6);
    border-radius: 8px;
    cursor: pointer;
    background: transparent;
    padding: 0;

    &::-webkit-color-swatch-wrapper {
      padding: 4px;
    }

    &::-webkit-color-swatch {
      border: none;
      border-radius: 4px;
    }
  }

  &__actions {
    display: flex;
    gap: 12px;
    margin-top: auto;
    padding-top: 12px;
    border-top: 1px solid var(--el-border-color-lighter, #ebeef5);
    flex-shrink: 0;

    .el-button {
      flex: 1;
    }
  }
}
</style>
