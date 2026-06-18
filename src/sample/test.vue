<script setup lang="ts" name="Areainfo">
import {onMounted, ref} from "vue";
import DytableContainerInstanceValid from "@/sample/DytableContainerInstanceValid.vue";
import BoxContainerInstanceDemo from "@/sample/BoxContainerInstanceDemo.vue";
import ComponentTester from "@/sample/ComponentTester.vue";
import DytableContainerViewValid from "@/sample/DytableContainerViewValid.vue";
import BoxContainerViewDemo from "@/sample/BoxContainerViewDemo.vue";
import ComplexFormValid from "@/sample/ComplexFormValid.vue";
import ComplexFormAnalysis from "@/sample/ComplexFormAnalysis.vue";
import DataPickerDemo from "@/sample/DataPickerDemo.vue";
import FormValid from "@/sample/FormValid.vue";
import NormalFormValid from "@/sample/NormalFormValid.vue";
import CodeEditorTest from "@/sample/CodeEditorTest.vue";
import CodeDiffEditorTest from "@/sample/CodeDiffEditorTest.vue";
import EditorTest from "@/sample/EditorTest.vue";
import ImagePreviewTest from "@/sample/ImagePreviewTest.vue";

const visible = ref<boolean>(false);
const actName = ref<string>("component");
const categories = ref<Array<any>>([
  {id: 'dashboard', name: '首页', icon: 'home'},
  {id: 'production', name: '生产管理', icon: 'production'},
  {id: 'quality', name: '质量管理', icon: 'quality'},
]);
const initData = async () => {
};

const handleSelect = (item: any) => {
  console.log(item);
};

onMounted(() => {
  initData();
});
</script>
<template>
  <!--  <template v-if="isMobile">
     <MainContainer :categories="categories" position="bottom" systemConfigName="系统配置" @select="handleSelect"/>
    </template>-->
  <div class="flex flex-col h-full overflow-auto">
    <!--    <DytableContainerViewValid/>-->
    <!--    <Dashboard/>-->
    <!--    <FormValid/>-->
    <!--    <el-tabs v-model="actName" class="h-full">
          <el-tab-pane name="component" label="解析">
            <DytableContainerInstanceValid/>
          </el-tab-pane>
          <el-tab-pane name="2" label="实例">
            <NormalFormValid/>
          </el-tab-pane>
        </el-tabs>-->
    <el-tabs v-model="actName" class="h-full">
      <el-tab-pane name="component" label="IDE">
        <CodeEditorTest/>
      </el-tab-pane>
      <el-tab-pane name="2" label="对比">
        <CodeDiffEditorTest/>
      </el-tab-pane>
      <el-tab-pane name="3" label="编辑器">
<!--        <EditorTest/>-->
        <NormalFormValid/>
      </el-tab-pane>
      <el-tab-pane name="4" label="图片预览">
        <ImagePreviewTest/>
      </el-tab-pane>
      <el-tab-pane name="5" label="数据选择器">
        <DataPickerDemo/>
      </el-tab-pane>
    </el-tabs>
    <!--    <el-tabs v-model="actName" class="h-full">
          <el-tab-pane name="component" label="组件测试">
            <ComponentTester/>
          </el-tab-pane>
          <el-tab-pane name="a" label="动态列表实例">
            <DytableContainerInstanceValid/>
          </el-tab-pane>

          <el-tab-pane name="d" label="动态实例Box">
            <BoxContainerInstanceDemo/>
          </el-tab-pane>
          <el-tab-pane name="e" label="动态列表查看视图">
            <DytableContainerViewValid/>
          </el-tab-pane>
          <el-tab-pane name="f" label="动态栅格查看视图">
            <BoxContainerViewDemo/>
          </el-tab-pane>

          <el-tab-pane name="h" label="数据选择器">
            &lt;!&ndash;      <DataPickerDemo />&ndash;&gt;
            &lt;!&ndash;      <InformationsUi/>&ndash;&gt;
            <ComplexFormValid/>
          </el-tab-pane>
          <el-tab-pane name="h1" label="数据选择器2">
            <DataPickerDemo/>

          </el-tab-pane>
          <el-tab-pane name="h2" label="正常表单">
            <NormalFormValid/>
          </el-tab-pane>
          <el-tab-pane name="i" label="验证容器">
            <ComplexFormAnalysis/>
          </el-tab-pane>
          <el-tab-pane name="j" label="代码编辑器">
            <CodeEditorTest/>
          </el-tab-pane>
        </el-tabs>-->
  </div>
</template>
<style lang="scss" scoped>
svg {
  border: 1px solid blue;
}
</style>
