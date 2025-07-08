<script lang="ts" setup name="StarHorsePopover">
import { onMounted, ref } from 'vue';
import { postRequest } from "@/api/star_horse_apis";
import { warning } from "@/utils/message";
import { compKey } from "@/api/system";

const props = defineProps({
  menuIcon: { type: String },
  iconUrl: { type: String },
  iconSize: { type: Number, default: 48 },
  icons: { type: Array, default: () => [] }
});
const emits = defineEmits(['selectIcon']);
let iconList = ref<Array<any>>([]);
const menuIconSelect = (corn: any) => {
  emits('selectIcon', corn);
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
    })
  } else {
    iconList.value = props.icons;
  }
}
onMounted(() => {
  init();
});
</script>
<template>
  <el-popover placement="bottom" :popper-style="{ width: 'unset !important' }" trigger="click">
    <template #reference>
      <slot></slot>
    </template>
    <ul class="system-icon">
      <li v-for="(sdata, key) in iconList" :key="compKey(sdata, key)" @click="menuIconSelect(sdata.menuIcon)"
        :class="menuIcon == sdata.menuIcon ? 'icon-active' : ''">
        <el-tooltip :content="sdata.label">
          <star-horse-icon :icon-class="sdata.menuIcon"
            style="color: var(--star-horse-style); vertical-align: middle; font-size: 48px" />
        </el-tooltip>
      </li>
    </ul>
  </el-popover>
</template>
<style scoped></style>
