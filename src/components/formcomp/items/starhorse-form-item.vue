<script setup lang="ts" name="StarHorseFormItem">
import { ItemPreps } from "@/components/types/ItemPreps";
import { computed, nextTick, ref } from "vue";
import { labelVisibleCheck, validMsg } from "@/api/form_utils";
import { isMobile } from "@/api/device";

const props = withDefaults(defineProps<ItemPreps>(), {
  isDesign: false,
  showFormItem: false,
  disabled: false,
  bareFlag: false,
});

const isEdit = computed(() => props.isDesign);

const editingLabel = ref(false);
const editingLabelText = ref("");
const labelInputRef = ref();

const startEditLabel = () => {
  editingLabelText.value = props.field?.label || props.field?.preps?.label;
  editingLabel.value = true;
  nextTick(() => {
    labelInputRef.value?.focus();
  });
};

const finishEditLabel = () => {
  editingLabel.value = false;
  if (
    props.field &&
    (editingLabelText.value !== props.field.label ||
      editingLabelText.value !== props.field.preps?.label)
  ) {
    props.field.label = editingLabelText.value;
    if (props.field.preps) {
      props.field.preps.label = editingLabelText.value;
    }
  }
};
</script>

<template>
  <div
    class="w-fill"
    :class="{ 'item-info': field?.preps?.itemType != 'usercomp' }"
    :style="{
      margin: field?.preps?.itemType === 'button' ? '5px auto' : 'unset',
    }"
    v-if="bareFlag === true"
  >
    <help :message="field?.preps?.helpMsg" v-if="field?.preps?.helpMsg" />
    <slot></slot>
  </div>
  <div v-else class="form-item-operation">
    <div class="w-full" :class="{ 'field-item': true }">
      <el-form-item
        :size="field?.preps?.size || 'default'"
        v-if="
          showFormItem &&
          parentField?.itemType != 'table' &&
          field.preps?.itemType != 'divider' &&
          field?.preps?.headerFlag != 'Y' &&
          !field.preps?.staticData
        "
        :style="{
          marginBottom: isEdit && !disabled ? '1px' : '18px',
        }"
        class="flex items-center w-full h-full"
        :prop="field?.preps['name']"
        :label="isEdit ? undefined : labelVisibleCheck(field)"
        :labelPosition="field?.preps['labelPosition']"
        :rules="validMsg(field, null)"
      >
        <template #label v-if="isEdit">
          <span
            v-if="!editingLabel"
            @click.stop="isMobile ? startEditLabel() : null"
            @dblclick.stop="!isMobile ? startEditLabel() : null"
            style="cursor: text"
            >{{ labelVisibleCheck(field) }}</span
          >
          <el-input
            v-else
            ref="labelInputRef"
            v-model="editingLabelText"
            @blur="finishEditLabel"
            @keyup.enter="finishEditLabel"
            @click.stop
            style="width: 120px"
          />
        </template>

        <help :message="field.preps?.helpMsg" v-if="field.preps?.helpMsg" />
        <slot></slot>
      </el-form-item>
      <div
        v-else
        :class="{
          'item-info': field?.preps?.itemType != 'usercomp',
        }"
        :style="{
          margin: field?.itemType === 'button' ? '5px auto' : 'unset',
        }"
      >
        <help :message="field.preps?.helpMsg" v-if="field.preps?.helpMsg" />
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.form-item-operation {
  display: flex;
  width: 100%;
  flex: 1;
  height: 100%;
}

.item-info {
  display: flex;
  width: 100%;
  flex: 1;
  height: 100%;
  justify-content: start;
}

.el-form-item {
  position: relative;

  :deep(.el-form-item__label) {
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  span.custom-label i {
    margin: 0 3px;
  }

  :deep(.hide-spin-button) input::-webkit-outer-spin-button,
  :deep(.hide-spin-button) input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
  }

  :deep(.hide-spin-button) input[type="number"] {
    -moz-appearance: textfield;
  }
}

.required :deep(.el-form-item__label)::before {
  content: "*";
  color: #f56c6c;
  margin-right: 4px;
}

:deep(.label-left-align) .el-form-item__label {
  text-align: left;
  justify-content: flex-start !important;
}

:deep(.label-center-align) .el-form-item__label {
  text-align: center;
  justify-content: center !important;
}

:deep(.label-right-align) .el-form-item__label {
  text-align: right;
  justify-content: flex-end !important;
}
</style>
