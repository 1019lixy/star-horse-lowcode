<script setup lang="ts" name="Areainfo">
import {onMounted} from 'vue';
import SignatureTest from "@/sample/SignatureTest.vue";

const initData = async () => {
};
onMounted(() => {
  initData();
});

</script>
<template>
  <div class="flex flex-col h-full overflow-hidden">
    <!--        <FormValid/>-->
    <SignatureTest/>

    <!--        <StarHorseDraggableValid/>-->
    <!--    <DialogItem/>
        <TransferItem/>-->
    <!--    <dialog-valid/>-->
    <!--    <FormRelationOperation/>-->
  </div>

</template>
<style lang="scss" scoped>
svg {
  border: 1px solid blue;
}
</style>
