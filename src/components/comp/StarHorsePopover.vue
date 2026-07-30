<script lang="ts" setup name="StarHorsePopover">
import { onMounted, ref } from "vue";
import { postRequest } from "@/api/star_horse_apis";
import { warning } from "@/utils/message";
import { compKey } from "@/api/system";
import { isMobile } from "@/api/device";
import { useMobilePicker } from "@/components/formcomp/utils/useMobilePicker";
import ShMobilePicker from "@/components/formcomp/utils/ShMobilePicker.vue";

const props = defineProps({
  menuIcon: { type: String },
  iconUrl: { type: String },
  iconSize: { type: Number, default: 48 },
  icons: { type: Array, default: () => [] },
  // 抽屉标题（移动端）
  title: { type: String, default: "" },
});
const emits = defineEmits(["selectIcon"]);
let iconList = ref<Array<any>>([]);
const menuIconSelect = (corn: any) => {
  emits("selectIcon", corn);
  // 移动端选择后关闭抽屉
  if (isMobile) {
    closePicker();
  }
};
const init = () => {
  if (props.iconUrl) {
    postRequest(props.iconUrl, {}).then((res) => {
      const resData = res.data;
      if (resData.code) {
        warning(resData.cnMessage);
        return;
      }
      iconList.value = resData.data;
    });
  } else {
    iconList.value = props.icons;
  }
};

// 移动端抽屉
const {
  pickerVisible,
  placement,
  size: pickerSize,
  openPicker,
  closePicker,
} = useMobilePicker(() => ({ preps: {} } as any));

const pickerTitle = props.title || "选择图标";

onMounted(() => {
  init();
});
</script>
<template>
  <!-- PC 端：保留原 el-popover -->
  <el-popover
    v-if="!isMobile"
    placement="bottom"
    :popper-style="{ width: 'unset !important' }"
    trigger="click"
  >
    <template #reference>
      <slot></slot>
    </template>
    <ul class="system-icon">
      <li
        v-for="(sdata, key) in iconList"
        :key="compKey(sdata, key)"
        @click="menuIconSelect(sdata.menuIcon)"
        :class="menuIcon == sdata.menuIcon ? 'icon-active' : ''"
      >
        <el-tooltip :content="sdata.label">
          <star-horse-icon
            :icon-class="sdata.menuIcon"
            style="color: var(--star-horse-style); vertical-align: middle; font-size: 48px;"
          />
        </el-tooltip>
      </li>
    </ul>
  </el-popover>

  <!-- APP 端：触发器 + 抽屉图标网格 -->
  <template v-else>
    <div @click="openPicker">
      <slot></slot>
    </div>
    <ShMobilePicker
      v-model="pickerVisible"
      :title="pickerTitle"
      :placement="placement"
      :size="pickerSize"
      :show-footer="false"
    >
      <div class="mobile-icon-grid">
        <div
          v-for="(sdata, key) in iconList"
          :key="compKey(sdata, key)"
          class="mobile-icon-grid__item"
          :class="{ 'is-active': menuIcon == sdata.menuIcon }"
          @click="menuIconSelect(sdata.menuIcon)"
        >
          <star-horse-icon
            :icon-class="sdata.menuIcon"
            class="mobile-icon-grid__icon"
          />
          <div class="mobile-icon-grid__label">{{ sdata.label }}</div>
        </div>
      </div>
    </ShMobilePicker>
  </template>
</template>
<style scoped lang="scss">
.mobile-icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(72px, 1fr));
  gap: 8px;
  padding: 8px;
  height: 100%;
  overflow-y: auto;

  &__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 8px 4px;
    border-radius: 8px;
    border: 1px solid transparent;
    cursor: pointer;
    transition: background 0.15s;

    &:active {
      background: var(--el-fill-color, #f5f7fa);
    }

    &.is-active {
      border-color: var(--el-color-primary, #409eff);
      background: var(--el-color-primary-light-9, #ecf5ff);
    }
  }

  &__icon {
    font-size: 36px !important;
    color: var(--star-horse-style);
  }

  &__label {
    font-size: 12px;
    color: var(--el-text-color-regular, #606266);
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
  }
}
</style>
