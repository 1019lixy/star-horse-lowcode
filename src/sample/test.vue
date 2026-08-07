<script setup lang="ts" name="Areainfo">
import {defineAsyncComponent, onMounted, ref} from "vue";
// 全部改为异步组件：ES 模块仅在 tab 首次激活时才加载，避免 Monaco/CodeMirror/pcas-code.json 等重型库常驻内存
const NormalFormValid = defineAsyncComponent(() => import("@/sample/NormalFormValid.vue"));

const visible = ref<boolean>(false);
const actName = ref<string>("component");
const categories = ref<Array<any>>([
  {id: "dashboard", name: "首页", icon: "home"},
  {id: "production", name: "生产管理", icon: "production"},
  {id: "quality", name: "质量管理", icon: "quality"},
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
    <!--    <AdvancedComponentsDemo />-->
    <!--   <NormalFormValid />   <DytableContainerViewValid/>-->
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
    <!--    <ValidDialogFormRelation/>-->
    <!--    <el-tabs v-model="actName" class="h-full">
      <el-tab-pane name="component" label="IDE">
        <CodeEditorTest/>
      </el-tab-pane>
      <el-tab-pane name="2" label="对比">
        <CodeDiffEditorTest/>
      </el-tab-pane>
      <el-tab-pane name="3" label="编辑器">
&lt;!&ndash;        <EditorTest/>&ndash;&gt;
        <NormalFormValid/>
      </el-tab-pane>
      <el-tab-pane name="4" label="图片预览">
        <ImagePreviewTest/>
      </el-tab-pane>
      <el-tab-pane name="5" label="数据选择器">
        <DataPickerDemo/>
      </el-tab-pane>
    </el-tabs>-->
    <!--    <barcode-test/>-->
    <NormalFormValid/>
    <!--    <el-tabs v-model="actName" class="h-full">
          <el-tab-pane name="component" label="组件测试">
            <ComponentTester v-if="actName === 'component'" />
          </el-tab-pane>
          <el-tab-pane name="a" label="动态列表实例">
            <DytableContainerInstanceValid v-if="actName === 'a'" />
          </el-tab-pane>

          <el-tab-pane name="d" label="动态实例Box">
            <BoxContainerInstanceDemo v-if="actName === 'd'" />
          </el-tab-pane>
          <el-tab-pane name="e" label="动态列表查看视图">
            <DytableContainerViewValid v-if="actName === 'e'" />
          </el-tab-pane>
          <el-tab-pane name="f" label="动态栅格查看视图">
            <BoxContainerViewDemo v-if="actName === 'f'" />
          </el-tab-pane>

          <el-tab-pane name="h" label="数据选择器">
            <ComplexFormValid v-if="actName === 'h'" />
          </el-tab-pane>
          <el-tab-pane name="h1" label="数据选择器2">
            <DataPickerDemo v-if="actName === 'h1'" />
          </el-tab-pane>
          <el-tab-pane name="h2" label="正常表单">
            <NormalFormValid v-if="actName === 'h2'" />
          </el-tab-pane>
          <el-tab-pane name="i" label="验证容器">
            <ComplexFormAnalysis v-if="actName === 'i'" />
          </el-tab-pane>
          <el-tab-pane name="j" label="代码编辑器">
            <CodeEditorTest v-if="actName === 'j'" />
          </el-tab-pane>
          <el-tab-pane name="k" label="高级组件库">
            <AdvancedComponentsDemo v-if="actName === 'k'" />
          </el-tab-pane>
          <el-tab-pane name="l" label="容器控制验证">
            <CronTaskUiDemo v-if="actName === 'l'" />
          </el-tab-pane>
        </el-tabs>-->
  </div>
</template>
<style lang="scss" scoped>
svg {
  border: 1px solid blue;
}
</style>
