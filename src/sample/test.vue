<script setup lang="ts" name="Areainfo">
import {onMounted, ref} from 'vue';
import DytableContainerValid from "@/sample/DytableContainerValid.vue";
import DytableContainerInstanceValid from "@/sample/DytableContainerInstanceValid.vue";
import BoxContainerDemo from "@/sample/BoxContainerDemo.vue";
import BoxContainerInstanceDemo from "@/sample/BoxContainerInstanceDemo.vue";

const visible = ref<boolean>(false);
const actName = ref<string>("a");
const initData = async () => {
};
onMounted(() => {
  initData();
});

</script>
<template>
  <div class="flex flex-col h-full overflow-auto">
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
    <!--    <BoxContainerDemo/>-->
    <el-tabs v-model="actName">
      <el-tab-pane name="a" label="设计">
        <DytableContainerValid/>
      </el-tab-pane>
      <el-tab-pane name="b" label="实例">
        <DytableContainerInstanceValid/>
      </el-tab-pane>
    </el-tabs>
<!--    <el-tabs v-model="actName">
      <el-tab-pane name="a" label="设计">
        <BoxContainerDemo/>
      </el-tab-pane>
      <el-tab-pane name="b" label="实例">
        <BoxContainerInstanceDemo/>
      </el-tab-pane>
    </el-tabs>-->

  </div>

</template>
<style lang="scss" scoped>
svg {
  border: 1px solid blue;
}
</style>
