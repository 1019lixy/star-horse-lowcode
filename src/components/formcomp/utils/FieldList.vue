<script setup lang="ts">
  import { useDesignFormStore } from '@/store/DesignForm.ts';
  import piniaInstance from '@/store';
  import {computed, ComputedRef, ref} from 'vue';

  defineOptions({
    name: 'FieldList'
  });
  const containerRef = ref();
  const emits = defineEmits(['selectData']);
  let designForm = useDesignFormStore(piniaInstance);
  let formDataList:ComputedRef = computed(() => designForm.formDataList);
  let containerList:ComputedRef = computed(() => designForm.containerList);
  let selfFormDataList:ComputedRef = computed(() => designForm.selfFormDataList);
  const selectData = (item: any) => {
    emits('selectData', item);
  };
</script>

<template>
  <div class="component-list">
    <div class="title">
      <el-anchor type="underline" :container="containerRef" :offset="70">
        <el-anchor-link :href="`#container`"> 容器 </el-anchor-link>
        <el-anchor-link :href="`#basic`"> 基础组件 </el-anchor-link>
        <el-anchor-link :href="`#self`"> 自定义组件 </el-anchor-link>
      </el-anchor>
    </div>
    <div class="content" ref="containerRef">
      <el-scrollbar>
        <el-divider content-position="left">容器</el-divider>
        <ul id="container">
          <template v-for="item in containerList">
            <li class="field-item" @click="selectData(item)"
              >&nbsp;&nbsp;
              <div><star-horse-icon :icon-class="item.itemIcon" /> &nbsp;{{ item.itemName }}</div>
            </li>
          </template>
        </ul>
        <el-divider content-position="left">基础组件</el-divider>
        <ul id="basic">
          <template v-for="item in formDataList">
            <li class="field-item" @click="selectData(item)"
              >&nbsp;&nbsp;
              <div><star-horse-icon :icon-class="item.itemIcon" /> &nbsp;{{ item.itemName }}</div>
            </li>
          </template>
        </ul>
        <el-divider content-position="left">自定义组件</el-divider>
        <ul id="self">
          <template v-for="item in selfFormDataList">
            <li class="field-item" @click="selectData(item)"
              >&nbsp;&nbsp;
              <div><star-horse-icon :icon-class="item.itemIcon" /> &nbsp;{{ item.itemName }}</div>
            </li>
          </template>
        </ul>
      </el-scrollbar>
    </div>
  </div>
</template>

<style scoped lang="scss">
  :deep(.el-divider) {
    margin: 15px auto;
  }

  .component-list {
    display: flex;
    flex-direction: row;
    height: inherit;
    width: 100%;
    overflow: hidden;

    .title {
      width: 100px;
      overflow: hidden;
    }

    .content {
      margin-left: 10px;
      height: 100%;
      overflow: hidden;
      flex: 1;
      ul {
        list-style: none;
        margin-top: 0 !important;
        padding-top: 0 !important;
        li {
          cursor: pointer;
          display: block;
          height: 30px;
          padding: 0 !important;
          margin: 0;
          &:hover {
            background-color: #f5f7fa;
          }
          div {
            display: inline-flex;
            height: 100%;
            align-items: center;
            margin-top: 0 !important;
            padding-top: 0 !important;
          }
        }
      }
    }
  }
</style>
