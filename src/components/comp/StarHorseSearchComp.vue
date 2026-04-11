<script setup lang="ts" name="StarHorseSearchComp">
import {isMobile} from "@/api/device";
import StarHorseSearchForm from "@/components/comp/StarHorseSearchForm.vue";
import StarHorseIcon from "@/components/comp/StarHorseIcon.vue";
import {i18n} from "@/lang";
import {ref} from "vue";
import StarHorseDialog from "@/components/comp/StarHorseDialog.vue";

const searchFormRef = ref<InstanceType<typeof StarHorseSearchForm> | null>(null);
const dialogVisible = ref(false);

const emits = defineEmits(["searchData"]);
const props = defineProps({
  dialogInput: {type: Boolean, default: false},
  mutComp: {type: Boolean, default: false},
  compUrl: {type: Object},
  formData: {type: Object, required: true},
  defaultCondition: {type: Array},
});

const handleSearchData = (searchData: any) => {
  emits("searchData", searchData);
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
  <div v-else class="absolute right-0 top-0 z-1000">
    <star-horse-icon icon-class="search" cursor="pointer" @click="handleMobileSearch"/>
  </div>
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
