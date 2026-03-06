<script setup lang="ts" name="StarHorseFormItem">
import StarHorseDialog from "@/components/comp/StarHorseDialog.vue";
import FieldList from "@/components/formcomp/utils/FieldList.vue";
import { ItemPreps } from "@/components/types/ItemPreps";
import { i18n } from "@/lang";
import {
  dynamicFormContextMenuData,
  getParentComp,
  moveDownItem,
  moveUpItem,
  removeItem,
} from "@/plugins/AblesPlugin";
import piniaInstance from "@/store";
import { useDesignFormStore } from "@/store/DesignForm";
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { warning } from "@/utils/message";

const props = withDefaults(defineProps<ItemPreps>(), {
  isDesign: false,
  showFormItem: false,
  disabled: false,
  //是否需要css 修饰
  bareFlag: false,
});
let designForm = useDesignFormStore(piniaInstance);
let isEdit = computed(() => props.isDesign);
let editUserInfo = computed(() => {
  let userInfo = designForm.getCurrentCompEditUserInfo(
    props.field?.id || props.field?.preps.id,
  );
  return userInfo ? userInfo.name + "正在编辑中" : "";
});
// Use shallowRef for better performance
let currentItemId = computed(() => designForm.currentItemId);
const itemId = computed(() => props.field?.id || props.field?.preps?.id);
const isDisabled = computed(() => props.disabled);

let componentVisible = computed(() => {
  return designForm.componentVisible && currentItemId.value == itemId.value;
});
const selectParentContainer = () => {
  if (!isEdit.value || isDisabled.value) return;
  designForm.selectItem(props.parentField, "", "container");
};
// Add debounce control
let selectDebounceTimer: any = null;
// Add refresh flag for component
const refreshFlag = ref(0);

const selectData = (data: any) => {
  if (!isEdit.value || isDisabled.value) return;
  if (editUserInfo.value.length > 0) {
    warning("该属性正被他人编辑中...");
    return;
  }
  // Check for duplicate selection to avoid unnecessary updates
  if (currentItemId.value === itemId.value) {
    return;
  }

  // Clear previous timer
  if (selectDebounceTimer) {
    clearTimeout(selectDebounceTimer);
  }

  // Debounce mechanism with reduced delay
  selectDebounceTimer = setTimeout(() => {
    designForm.selectItem(
      props.field,
      data.itemType,
      getParentComp(props.parentField),
    );
    // Force component refresh after selection
    nextTick(() => {
      refreshFlag.value++;
    });
  }, 50); // Reduced delay for better responsiveness
};

const exchangeItem = () => {
  designForm.setComponentVisible(true);
};
const close = () => {
  designForm.setComponentVisible(false);
};
const changeItem = (item: any) => {
  props.field["itemType"] = item["itemType"];
  if (item.category == 2) {
    props.field["compType"] = "container";
  }
  props.field["preps"] = {
    ...props.field["preps"],
    itemNameLabel: item.itemName,
  };
  close();
  selectData(props.field);
};
const itemContextMenuRef = ref();
const itemContextMenu = (evt: MouseEvent | any) => {
  if (!isEdit.value || isDisabled.value) return;
  evt.stopPropagation();
  evt.preventDefault();
  evt.props = props;
  itemContextMenuRef.value?.show(evt);
};

// Cleanup debounce timer on unmount
onBeforeUnmount(() => {
  if (selectDebounceTimer) {
    clearTimeout(selectDebounceTimer);
    selectDebounceTimer = null;
  }
});

onMounted(() => {});
</script>
<template>
  <star-horse-dialog
    box-width="450px"
    box-height="70%"
    :source="3"
    :full-screen="false"
    :title="i18n('form.changeComponent')"
    :self-func="true"
    :dialog-visible="componentVisible"
    @closeAction="close"
  >
    <template #footer>
      <el-button type="primary" size="default" @click="close"
        >{{ i18n("form.confirm") }}
      </el-button>
    </template>
    <field-list @selectData="changeItem" />
  </star-horse-dialog>
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
    <div
      class="w-fill"
      :class="{
        'design-star-horse': isEdit && !disabled,
        'field-item': true,
        'active-item': currentItemId == itemId && isEdit && !disabled,
      }"
      @click="selectData(field)"
      @contextmenu="itemContextMenu"
    >
      <el-form-item
        :size="field?.preps?.size || 'default'"
        v-if="
          showFormItem &&
          parentField?.itemType != 'table' &&
          field.preps?.itemType != 'divider' &&
          field?.preps?.headerFlag != 'Y' &&
          !field.preps?.statusData
        "
        :style="{
          marginBottom: isEdit && !disabled ? '1px' : '18px',
        }"
        class="flex items-center w-full h-full"
        :label="field?.preps['hideLabel'] ? '' : field?.preps['label']"
        :prop="field?.preps['name']"
        :rules="
          field?.preps['required']
            ? [
                {
                  required: true,
                  trigger: 'blur',
                  message: i18n('form.requiredField'),
                },
              ]
            : []
        "
      >
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
        @click.stop="selectData(field)"
      >
        <help :message="field.preps?.helpMsg" v-if="field.preps?.helpMsg" />
        <slot></slot>
      </div>
      <div
        class="component-header-actions"
        v-if="isEdit && currentItemId == itemId"
        :key="`header-actions-${currentItemId}-${refreshFlag}`"
      >
        <div class="drag-handler">
          <el-tooltip :content="i18n('form.drag')">
            <star-horse-icon
              icon-class="drag"
              style="cursor: move; color: var(--star-horse-white)"
            />
          </el-tooltip>
          <el-tooltip :content="field?.preps['itemNameLabel']">
            <span
              style="color: var(--star-horse-white); cursor: pointer"
              @click="selectData(field)"
              >{{ field?.preps["itemNameLabel"] }}</span
            >
          </el-tooltip>
        </div>
        <div v-if="editUserInfo.length > 0" class="field-action">
          {{ editUserInfo }}
        </div>
        <div class="field-action" v-else-if="!disabled">
          <el-tooltip
            :content="i18n('form.selectParentContainer')"
            v-if="parentField?.itemType"
          >
            <star-horse-icon
              @click.stop="selectParentContainer()"
              icon-class="select-parent"
              cursor="pointer"
              style="color: var(--star-horse-white)"
            />
          </el-tooltip>
          <el-tooltip :content="i18n('form.changeComponent')">
            <star-horse-icon
              @click.stop="exchangeItem"
              icon-class="exchange"
              cursor="pointer"
              style="color: var(--star-horse-white)"
            />
          </el-tooltip>
          <el-tooltip :content="i18n('form.moveUp')">
            <star-horse-icon
              @click.stop="moveUpItem(isEdit, field?.preps, parentField)"
              icon-class="move-up"
              cursor="pointer"
              style="color: var(--star-horse-white)"
            />
          </el-tooltip>
          <el-tooltip :content="i18n('form.moveDown')">
            <star-horse-icon
              @click.stop="moveDownItem(isEdit, field?.preps, parentField)"
              icon-class="move-down"
              cursor="pointer"
              style="color: var(--star-horse-white)"
            />
          </el-tooltip>
          <el-tooltip :content="i18n('form.deleteComponent')">
            <star-horse-icon
              @click.stop="removeItem(isEdit, field?.preps, parentField)"
              icon-class="clear-all"
              cursor="pointer"
              style="color: var(--star-horse-white)"
            />
          </el-tooltip>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <ContentMenu
        ref="itemContextMenuRef"
        :menu-data="dynamicFormContextMenuData(field, parentField, 'item')"
      />
    </Teleport>
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

.active-item {
  border: 1px dashed var(--star-horse-style);
}

.design-star-horse {
  width: 100%;
  display: flex;
  justify-content: center;
  vertical-align: middle;
  align-items: center;
  min-height: 50px;
  z-index: 0;
}

.el-form-item {
  //margin-bottom: 0 !important;
  //margin-bottom: 6px;
  //margin-top: 2px;
  position: relative;

  :deep(.el-form-item__label) {
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  span.custom-label i {
    margin: 0 3px;
  }

  /* 隐藏Chrome浏览器中el-input数字输入框右侧的上下调整小箭头 */
  :deep(.hide-spin-button) input::-webkit-outer-spin-button,
  :deep(.hide-spin-button) input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
  }

  /* 隐藏Firefox浏览器中el-input数字输入框右侧的上下调整小箭头 */
  :deep(.hide-spin-button) input[type="number"] {
    -moz-appearance: textfield;
  }
}

.required :deep(.el-form-item__label)::before {
  content: "*";
  color: #f56c6c;
  margin-right: 4px;
}

.static-content-item {
  min-height: 20px;
  display: flex;
  /* 垂直居中 */
  align-items: center;

  /* 垂直居中 */
  :deep(.el-divider--horizontal) {
    margin: 0;
  }
}

.el-form-item.selected,
.static-content-item.selected {
  outline: 2px solid var(--star-horse-style);
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
