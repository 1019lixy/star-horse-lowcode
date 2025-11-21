<script setup lang="ts">
import {ref} from 'vue';
import {StarHorseDialog} from "@/components/comp";

defineOptions({
  name: "DialogValid",
});
const pageStyle = ref<string>("normal");
const visible = ref(false);

</script>

<template>
  <star-horse-dialog
      :dialogVisible="visible"
      @closeAction="visible = false"
      box-height="80%"
      :selfFunc="true"
      :compSize="'default'"
      :title="'验证'"
      :source="3"
  >

    <el-select class="w-[240px]!" v-model="pageStyle" :options="[
        {label:'默认',value:'normal',key:'normal'},
        {label:'表单',value:'form',key:'form'},
        {label:'表单列表',value:'form-table',key:'form-table'},
        {label:'Tab',value:'tab',key:'tab'},
        {label:'查看',value:'view',key:'view'},
    ]">
    </el-select>
    <div class="w-full h-full relative">
      <NormalPage v-if="pageStyle=='normal'"/>
      <FormPage v-if="pageStyle=='form'"/>
      <FormTablePage v-if="pageStyle=='form-table'"/>
      <TabPage v-if="pageStyle=='tab'"/>
      <!--    <ViewPage v-if="pageStyle=='view'"/>-->
    </div>
  </star-horse-dialog>
  <el-button @click="visible=true">Valid</el-button>
</template>

<style scoped lang="scss"></style>
