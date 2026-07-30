<template>
  <starhorse-form-item
    :showFormItem="showFormItem"
    :isDesign="isDesign"
    :disabled="disabled"
    :bareFlag="bareFlag"
    :field="field"
    :parentField="parentField"
  >
    <!-- PC 端：完全保持原逻辑 -->
    <el-popover
      v-if="!isSeparate"
      :popper-style="{ width: 'inherit !important' }"
      ref="popoverRef"
      :placement="field.preps?.placement ?? 'bottom-start'"
      :disabled="checkIsDisabled(props) || field.preps?.listView"
      trigger="click"
    >
      <template #reference>
        <el-avatar
          v-if="iconType == 'system'"
          fit="fill"
          shape="square"
          @dblclick.stop="formData[field.fieldName]=''"
          :style="{
            'font-size': field.preps?.listView ? '22px' : '24px',
            background: field.preps?.listView
              ? 'unset'
              : 'var(--el-avatar-bg-color)',
          }"
          :icon="formData[field.fieldName]"
        />
        <star-horse-icon
          :icon-class="formData[field.fieldName]"
          v-else
          @dblclick.stop="formData[field.fieldName]=''"
          size="30px"
          style="
            color: var(--star-horse-style);
            border-radius: 3px;
            border: 1px solid var(--star-horse-light-gray);
          "
          cursor="pointer"
        />
      </template>
      <div class="icon-items">
        <div class="search-box">
          <el-input
            v-model="searchName"
            @keydown.enter="dataSearch"
            clearable
            :placeholder="i18n('item.searchIconPlaceholder')"
          >
            <template #prefix>
              <star-horse-icon icon-class="search" @click="dataSearch" />
            </template>
          </el-input>
        </div>
        <ul class="system-icon">
          <li
            v-for="sdata in iconList"
            @click="assignIcon(sdata.value)"
            :title="sdata.name"
            :key="sdata.value"
            :class="{ 'icon-active': sdata.value == formData[field.fieldName] }"
          >
            <el-icon
              class="star-icon"
              style="font-size: 35px; color: var(--star-horse-style)"
              v-if="iconType == 'system'"
            >
              <component :is="sdata.value" :key="sdata.value + '_comp'" />
            </el-icon>
            <star-horse-icon
              :icon-class="sdata.value"
              v-else
              size="30px"
              width="30px"
              height="30px"
              style="color: var(--star-horse-style)"
              cursor="pointer"
            />
          </li>
        </ul>
      </div>
    </el-popover>

    <!-- APP 端分离模式：只读触发器 + 抽屉式图标选择 -->
    <template v-else>
      <div class="icon-app-trigger" @click="openPicker">
        <el-avatar
          v-if="iconType == 'system'"
          fit="fill"
          shape="square"
          :style="{
            'font-size': field.preps?.listView ? '22px' : '24px',
            background: field.preps?.listView
              ? 'unset'
              : 'var(--el-avatar-bg-color)',
          }"
          :icon="formData[field.fieldName]"
        />
        <star-horse-icon
          :icon-class="formData[field.fieldName]"
          v-else
          size="30px"
          style="
            color: var(--star-horse-style);
            border-radius: 3px;
            border: 1px solid var(--star-horse-light-gray);
          "
          cursor="pointer"
        />
      </div>

      <ShMobilePicker
        v-model="pickerVisible"
        :title="title"
        :placement="placement"
        :size="size"
        :show-footer="false"
        @cancel="handleCancel"
      >
        <div class="sh-mobile-icon-panel">
          <!-- 搜索框 -->
          <el-input
            v-model="searchName"
            class="sh-mobile-icon-panel__search"
            :placeholder="i18n('item.searchIconPlaceholder')"
            clearable
            @input="dataSearch"
          >
            <template #prefix>
              <star-horse-icon icon-class="search" />
            </template>
          </el-input>

          <!-- 图标网格 -->
          <el-scrollbar tag="div" class="sh-mobile-icon-panel__grid-scroll">
            <ul class="sh-mobile-icon-panel__grid">
              <li
                v-for="sdata in iconList"
                @click="assignIcon(sdata.value)"
                :title="sdata.name"
                :key="sdata.value"
                :class="{
                  'icon-active': sdata.value == formData[field.fieldName],
                }"
              >
                <el-icon
                  class="star-icon"
                  v-if="iconType == 'system'"
                >
                  <component :is="sdata.value" :key="sdata.value + '_comp'" />
                </el-icon>
                <star-horse-icon
                  :icon-class="sdata.value"
                  v-else
                  size="30px"
                  width="30px"
                  height="30px"
                  cursor="pointer"
                />
              </li>
              <li
                v-if="!iconList.length"
                class="sh-mobile-icon-panel__empty"
              >
                {{ i18n("pivot.empty.noData") || "暂无数据" }}
              </li>
            </ul>
          </el-scrollbar>
        </div>
      </ShMobilePicker>
    </template>
  </starhorse-form-item>
</template>
<script setup lang="ts">
import { nextTick, onMounted, ref, shallowRef, unref, watch } from "vue";
import {
  checkIsDisabled,
  initCompCallEvent,
} from "@/components/formcomp/utils/ItemRelationEventUtils";
import StarHorseIcon from "@/components/comp/StarHorseIcon.vue";
import StarhorseFormItem from "@/components/formcomp/items/starhorse-form-item.vue";
import { compDynamicData } from "@/api/star_horse_utils";
import {
  useMobilePicker,
} from "@/components/formcomp/utils/useMobilePicker";
import ShMobilePicker from "@/components/formcomp/utils/ShMobilePicker.vue";

import { ItemPreps } from "@/components/types/ItemPreps";
import { i18n } from "@/lang";
const props = withDefaults(defineProps<ItemPreps>(), {
  isDesign: false,
  disabled: false,
  showFormItem: false,
  bareFlag: false,
  isSearch: false,
});
const emits = defineEmits(["selfFunc", "selectItem"]);
const formData = defineModel("formData");

let searchName = ref<string>("");
let iconList = ref<any>([]);
let allIconList = ref<any>([]);
let iconType = ref<string>("system");
const popoverRef = shallowRef();
const assignIcon = (iconName: string) => {
  formData.value[props.field.fieldName] = iconName;
  unref(popoverRef)?.popperRef?.delayHide?.();
  itemAction("blur");
  if (isSeparate.value) {
    closePicker();
  }
};
const dataSearch = () => {
  if (!searchName.value) {
    iconList.value = allIconList.value;
  } else {
    iconList.value = allIconList.value.filter((item: any) => {
      return (
        item.name.toLowerCase().indexOf(searchName.value.toLowerCase()) > -1
      );
    });
  }
};
const itemAction = (prep: any) => {
  if (Object.keys(props.field.actions ?? {}).includes("change")) {
    emits("selfFunc", prep, formData.value);
  }
};
const init = async () => {
  const dataa = await compDynamicData(props.field);
  if (dataa?.length) {
    allIconList.value = dataa;
  }
  iconType.value = props.field.preps?.iconType ?? "system";
  iconList.value = allIconList.value;
};
onMounted(() => {
  init();
  nextTick(() => {
    initCompCallEvent(props, emits, formData);
  });
});
watch(
  () => formData.value[props.field.fieldName],
  (newVal, oldVal) => {
    itemAction("change");
  },
);

// ============ APP 端分离逻辑 ============
const {
  isSeparate,
  pickerVisible,
  placement,
  size,
  title,
  openPicker,
  closePicker,
} = useMobilePicker(() => props.field);

const handleCancel = () => {
  searchName.value = "";
  dataSearch();
  closePicker();
};
</script>
<style scoped>
.icon-items {
  width: 100%;
  display: flex;
  flex-direction: column;

  .system-icon {
    margin-top: 5px;
    justify-content: center;

    li {
      margin: 1px;
    }
  }
}

.search-box {
  width: 90%;
  margin: 0 auto;
}

/* APP 端触发器 */
.icon-app-trigger {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
}
</style>

<style lang="scss" scoped>
.sh-mobile-icon-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 8px;

  &__search {
    flex-shrink: 0;
  }

  &__grid-scroll {
    flex: 1;
    overflow: hidden;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(56px, 1fr));
    gap: 6px;
    padding: 4px;
    margin: 0;
    list-style: none;

    li {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 56px;
      border: 1px solid var(--el-border-color-lighter);
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;

      &:active {
        background: var(--el-color-primary-light-9);
        border-color: var(--el-color-primary);
      }

      &.icon-active {
        background: var(--el-color-primary-light-9);
        border-color: var(--el-color-primary);
        color: var(--el-color-primary);
      }
    }
  }

  &__empty {
    grid-column: 1 / -1;
    padding: 24px;
    text-align: center;
    color: var(--el-text-color-secondary);
    border: none !important;
    cursor: default !important;
  }
}
</style>
