<script setup lang="ts" name="Areainfo">
import { onMounted,ref,nextTick } from 'vue';
import LangTest from './LangTest.vue';
import ValidRelation from "@/sample/ValidRelation.vue";
import DytableContainer from "@/components/formcomp/container/dytable-container.vue";
import DytableContainerValid from "@/sample/DytableContainerValid.vue";
const initData = async () => {
};
const switchVal = ref(false);
onMounted(() => {
  initData();
});
const switchRef = ref(); // 添加Switch组件引用

const handleSwitchToggle = () => {
  switchVal.value = !switchVal.value;
  // 手动触发Switch的change事件
  nextTick(() => {
    switchRef.value?.$emit('change', switchVal.value);
  });
};
const changeData = (val: boolean) => {
  console.log(val);
};
</script>
<template>
  <div class="flex flex-col h-full overflow-hidden">
<!--   <LangTest/>-->
<!--    <el-button @click="handleSwitchToggle" type="primary">
      切换
    </el-button>
    <el-switch v-model="switchVal" @change="changeData" ref="switchRef"/>
    <ValidRelation/>-->
    <DytableContainerValid/>
  </div>
</template>
<style lang="scss" scoped></style>
