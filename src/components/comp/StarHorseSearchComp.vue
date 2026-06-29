<script setup lang="ts" name="StarHorseSearchComp">
import { isMobile } from "@/api/device";
import StarHorseSearchForm from "@/components/comp/StarHorseSearchForm.vue";
import { i18n } from "@/lang";
import { ref } from "vue";
import StarHorseDialog from "@/components/comp/StarHorseDialog.vue";
import MenuShot from "@/components/comp/app/MenuShot.vue";

const searchFormRef = ref<InstanceType<typeof StarHorseSearchForm> | null>(
  null,
);
const dialogVisible = ref(false);

const emits = defineEmits(["searchData"]);
const props = defineProps({
  dialogInput: { type: Boolean, default: false },
  mutComp: { type: Boolean, default: false },
  compUrl: { type: Object },
  formData: { type: Object, required: true },
  defaultCondition: { type: Array },
});

const handleSearchData = (searchData: any) => {
  emits("searchData", searchData);
  if (isMobile) {
    handleClose();
  }
};

const handleMobileSearch = () => {
  dialogVisible.value = true;
};

const handleClose = () => {
  dialogVisible.value = false;
};
</script>
<template>
  <div v-if="!isMobile">
    <StarHorseSearchForm
      ref="searchFormRef"
      v-bind="props"
      @searchData="handleSearchData"
    />
  </div>
  <MenuShot
    v-if="isMobile"
    icon="search"
    :position="{
      top: '50px',
      right: '20px',
      bottom: 'unset',
    }"
    @change="handleMobileSearch"
  />
  <star-horse-dialog
    :dialog-visible="dialogVisible"
    :title="i18n('search.query')"
    :full-screen="false"
    :source="3"
    :box-height="'100%'"
    :box-width="'100%'"
    @closeAction="handleClose"
    :hide-full-screen-icon="true"
  >
    <StarHorseSearchForm
      ref="searchFormRef"
      v-bind="props"
      @searchData="handleSearchData"
    />
  </star-horse-dialog>
</template>
<style lang="scss" scoped>
// Styles are now handled by StarHorseSearchForm component
</style>
