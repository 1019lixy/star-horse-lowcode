<script setup lang="ts" name="Areainfo">
import { onMounted, ref } from "vue";
import DytableContainerValid from "@/sample/DytableContainerValid.vue";
import DytableContainerInstanceValid from "@/sample/DytableContainerInstanceValid.vue";
import BoxContainerDemo from "@/sample/BoxContainerDemo.vue";
import BoxContainerInstanceDemo from "@/sample/BoxContainerInstanceDemo.vue";
import FormValid from "@/sample/FormValid.vue";
import ComponentTester from "@/sample/ComponentTester.vue";
import DytableContainer from "@/components/formcomp/container/dytable-container.vue";

const visible = ref<boolean>(false);
const actName = ref<string>("component");
const initData = async () => {};
onMounted(() => {
  initData();
});
</script>
<template>
  <div class="flex flex-col h-full overflow-auto">
    <el-tabs v-model="actName" class="h-full">
      <el-tab-pane name="component" label="组件测试">
        <ComponentTester />
      </el-tab-pane>
      <el-tab-pane name="a" label="动态列表实例">
       <DytableContainerInstanceValid />
      </el-tab-pane>
      <el-tab-pane name="b" label="动态列表">
        <DytableContainerValid />
      </el-tab-pane>
      <el-tab-pane name="c" label="动态Box">
        <BoxContainerDemo />
      </el-tab-pane>
      <el-tab-pane name="d" label="动态实例Box">
        <BoxContainerInstanceDemo />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<style lang="scss" scoped>
svg {
  border: 1px solid blue;
}
</style>
