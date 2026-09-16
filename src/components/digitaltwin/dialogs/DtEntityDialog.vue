<script setup lang="ts" name="DtEntityDialog">
/**
 * 数字孪生 - 实体编辑弹窗
 *
 * 新增/编辑实体：类型 / 位置 / 尺寸 / 颜色 / 名称 / 状态
 */
import { computed, ref, watch } from "vue";
import { i18n } from "@/lang";
import { ElMessage } from "element-plus";
import {
  createDtEntity,
  DT_ENTITY_TYPE_PRESETS,
  DT_STATUS_PRESETS,
  dtDefaultSize,
} from "../constants";
import type { DtEntity, DtEntityStatus, DtEntityType } from "../types";
import { StarHorsePanel } from "@/components/comp";

const props = defineProps<{
  visible: boolean;
  /** 编辑时传入实体 ID，新增时为 null */
  entityId?: string | null;
  /** 编辑时传入当前实体列表（用于回填） */
  sourceEntity?: DtEntity | null;
  dialogType?: "dialog" | "drawer";
}>();

const emit = defineEmits<{
  (e: "update:visible", v: boolean): void;
  (e: "submit", entity: DtEntity, isNew: boolean): void;
}>();

const innerVisible = computed({
  get: () => props.visible,
  set: (v) => emit("update:visible", v),
});

const isNew = ref(true);
const form = ref<DtEntity>(createDtEntity("cube", "Entity"));

/** 当类型变化时，重置尺寸为该类型默认值 */
const handleTypeChange = (type: DtEntityType): void => {
  form.value.size = { ...dtDefaultSize(type) };
  const preset = DT_ENTITY_TYPE_PRESETS.find((p) => p.type === type);
  if (preset) {
    form.value.color = preset.color;
  }
};

watch(
  () => [props.visible, props.entityId, props.sourceEntity] as const,
  ([visible, , source]) => {
    if (!visible) return;
    if (source) {
      // 编辑模式：深拷贝源实体
      form.value = JSON.parse(JSON.stringify(source));
      isNew.value = false;
    } else {
      // 新增模式
      form.value = createDtEntity("cube", i18n("digitaltwin.type.cube"));
      isNew.value = true;
    }
  },
  { immediate: true },
);

const handleSubmit = (): void => {
  if (!form.value.name.trim()) {
    ElMessage.warning(i18n("digitaltwin.entity.name"));
    return;
  }
  emit("submit", form.value, isNew.value);
  innerVisible.value = false;
};

const handleClose = (): void => {
  innerVisible.value = false;
};

const dialogTitle = computed(() =>
  isNew.value
    ? i18n("digitaltwin.dialog.addTitle")
    : i18n("digitaltwin.dialog.editTitle"),
);
</script>

<template>
  <star-horse-panel
    :type="dialogType"
    v-model="innerVisible"
    :title="dialogTitle"
    box-width="640px"
    :userAction="true"
    @merge="handleSubmit"
  >
    <el-form :model="form" label-width="90px" size="default">
      <!-- 基本信息 -->
      <el-divider content-position="left">{{
        i18n("digitaltwin.dialog.basic")
      }}</el-divider>
      <el-row :gutter="12">
        <el-col :span="12">
          <el-form-item :label="i18n('digitaltwin.entity.name')">
            <el-input v-model="form.name" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="i18n('digitaltwin.entity.type')">
            <el-select
              :model-value="form.type"
              style="width: 100%"
              :disabled="!isNew"
              @update:model-value="(v) => handleTypeChange(v as DtEntityType)"
            >
              <el-option
                v-for="p in DT_ENTITY_TYPE_PRESETS"
                :key="p.type"
                :label="i18n(p.labelKey as any)"
                :value="p.type"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item :label="i18n('digitaltwin.entity.status')">
        <el-select v-model="form.status as DtEntityStatus" style="width: 100%">
          <el-option
            v-for="s in DT_STATUS_PRESETS"
            :key="s.status"
            :label="i18n(s.labelKey as any)"
            :value="s.status"
          />
        </el-select>
      </el-form-item>

      <!-- 几何信息：位置 -->
      <el-divider content-position="left">{{
        i18n("digitaltwin.dialog.geometry")
      }}</el-divider>
      <el-form-item :label="i18n('digitaltwin.entity.position')">
        <el-row :gutter="8" style="width: 100%">
          <el-col :span="8">
            <el-input-number
              v-model="form.position.x"
              :step="10"
              style="width: 100%"
            />
            <div class="axis-label">X</div>
          </el-col>
          <el-col :span="8">
            <el-input-number
              v-model="form.position.y"
              :step="10"
              style="width: 100%"
            />
            <div class="axis-label">Y</div>
          </el-col>
          <el-col :span="8">
            <el-input-number
              v-model="form.position.z"
              :step="10"
              style="width: 100%"
            />
            <div class="axis-label">Z</div>
          </el-col>
        </el-row>
      </el-form-item>

      <!-- 几何信息：尺寸（按类型显示不同字段） -->
      <el-form-item :label="i18n('digitaltwin.entity.size')">
        <el-row :gutter="8" style="width: 100%">
          <template v-if="form.type === 'cube'">
            <el-col :span="8">
              <el-input-number
                v-model="form.size.width"
                :min="1"
                :step="5"
                style="width: 100%"
              />
              <div class="axis-label">
                {{ i18n("digitaltwin.entity.width") }}
              </div>
            </el-col>
            <el-col :span="8">
              <el-input-number
                v-model="form.size.height"
                :min="1"
                :step="5"
                style="width: 100%"
              />
              <div class="axis-label">
                {{ i18n("digitaltwin.entity.height") }}
              </div>
            </el-col>
            <el-col :span="8">
              <el-input-number
                v-model="form.size.depth"
                :min="1"
                :step="5"
                style="width: 100%"
              />
              <div class="axis-label">
                {{ i18n("digitaltwin.entity.depth") }}
              </div>
            </el-col>
          </template>
          <template v-else-if="form.type === 'cylinder'">
            <el-col :span="12">
              <el-input-number
                v-model="form.size.radius"
                :min="1"
                :step="5"
                style="width: 100%"
              />
              <div class="axis-label">
                {{ i18n("digitaltwin.entity.radius") }}
              </div>
            </el-col>
            <el-col :span="12">
              <el-input-number
                v-model="form.size.height"
                :min="1"
                :step="5"
                style="width: 100%"
              />
              <div class="axis-label">
                {{ i18n("digitaltwin.entity.height") }}
              </div>
            </el-col>
          </template>
          <template v-else-if="form.type === 'plane'">
            <el-col :span="12">
              <el-input-number
                v-model="form.size.width"
                :min="1"
                :step="10"
                style="width: 100%"
              />
              <div class="axis-label">
                {{ i18n("digitaltwin.entity.width") }}
              </div>
            </el-col>
            <el-col :span="12">
              <el-input-number
                v-model="form.size.depth"
                :min="1"
                :step="10"
                style="width: 100%"
              />
              <div class="axis-label">
                {{ i18n("digitaltwin.entity.depth") }}
              </div>
            </el-col>
          </template>
          <template v-else-if="form.type === 'sphere'">
            <el-col :span="24">
              <el-input-number
                v-model="form.size.radius"
                :min="1"
                :step="5"
                style="width: 100%"
              />
              <div class="axis-label">
                {{ i18n("digitaltwin.entity.radius") }}
              </div>
            </el-col>
          </template>
        </el-row>
      </el-form-item>

      <!-- 外观 -->
      <el-divider content-position="left">{{
        i18n("digitaltwin.dialog.appearance")
      }}</el-divider>
      <el-form-item :label="i18n('digitaltwin.entity.color')">
        <el-color-picker v-model="form.color" />
        <span class="color-text">{{ form.color }}</span>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">{{
        i18n("digitaltwin.dialog.close")
      }}</el-button>
      <el-button type="primary" @click="handleSubmit">{{
        i18n("digitaltwin.dialog.confirm")
      }}</el-button>
    </template>
  </star-horse-panel>
</template>

<style lang="scss" scoped>
.axis-label {
  font-size: 11px;
  color: var(--el-text-color-secondary);
  text-align: center;
  margin-top: 2px;
}

.color-text {
  margin-left: 8px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}
</style>
