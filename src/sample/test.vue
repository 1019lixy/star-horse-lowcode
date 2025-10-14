<script setup lang="ts" name="Areainfo">
import {onMounted} from 'vue';
import FormValid from "@/sample/FormValid.vue";

const initData = async () => {
};
onMounted(() => {
  initData();
});

</script>
<template>
  <div class="flex flex-col h-full overflow-hidden">
    <FormValid/>
  </div>
</template>
<style lang="scss" scoped></style>
