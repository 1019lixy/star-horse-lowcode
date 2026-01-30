<script setup lang="ts" name="Areainfo">
import {onMounted, ref} from 'vue';
import FormRelationOperation from "@/sample/FormRelationOperation.vue";
import {PageConfig} from "@/components/system";
import {langList} from "@/lang";
import SpeakDemo from "@/sample/SpeakDemo.vue";
import BoxContainerDemo from "@/sample/BoxContainerDemo.vue";
const visible = ref<boolean>(false);
const initData = async () => {
};
onMounted(() => {
  initData();
});

</script>
<template>
  <div class="flex flex-col h-full overflow-hidden">
    <!--        <FormValid/>-->
    <!--    <SignatureTest/>-->

    <!--        <StarHorseDraggableValid/>-->
    <!--    <DialogItem/>
        <TransferItem/>-->
    <!--    <dialog-valid/>-->
    <!--    <FormRelationOperation/>
        &lt;!&ndash;    <DataPickerDemo/>&ndash;&gt;
        <el-button @click="visible=true">验证</el-button>
        <PageConfig v-model="visible">
          <template #header="{form}">
            <el-form-item label="语言" prop="lang">
              <el-select v-model="form.lang" :options="langList" :props="{
                label:'name'
              }">

              </el-select>
            </el-form-item>
          </template>
        </PageConfig>-->
    <!--    <SpeakDemo/>-->
    <BoxContainerDemo/>
  </div>

</template>
<style lang="scss" scoped>
svg {
  border: 1px solid blue;
}
</style>
