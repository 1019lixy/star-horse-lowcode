<script setup lang="ts" name="ImagePreviewTest">
import {
  imagesPreview,
  ImagePreviewOptions,
  ImageTransition,
} from "@/api/star_horse_utils";
import { ref } from "vue";

const sampleImages = [
  "https://picsum.photos/id/1018/800/600",
  "https://picsum.photos/id/1015/800/600",
  "https://picsum.photos/id/1019/800/600",
  "https://picsum.photos/id/1020/800/600",
  "https://picsum.photos/id/1024/800/600",
];

const transitionType = ref<ImageTransition>("fade");
const transitionDuration = ref(300);

const openSingle = () => imagesPreview(sampleImages[0]);

const openMulti = () => {
  imagesPreview(sampleImages, {
    transition: transitionType.value,
    transitionDuration: transitionDuration.value,
  });
};

const openWithTransition = (type: ImageTransition) => {
  imagesPreview(sampleImages, {
    transition: type,
    transitionDuration: transitionDuration.value,
  });
};
</script>

<template>
  <div style="padding: 24px; display: flex; flex-direction: column; gap: 16px">
    <h3>图片预览测试</h3>

    <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap">
      <el-button type="primary" @click="openSingle">单图预览</el-button>
      <el-button type="success" @click="openMulti"
        >多图预览（{{ transitionType }}）</el-button
      >
    </div>

    <div style="margin-top: 8px">
      <span style="font-size: 14px; color: #666; margin-right: 8px"
        >过渡动画：</span
      >
      <el-radio-group v-model="transitionType" >
        <el-radio-button value="fade">淡入淡出</el-radio-button>
        <el-radio-button value="slide">滑动</el-radio-button>
        <el-radio-button value="zoom">缩放</el-radio-button>
        <el-radio-button value="flip3d">3D翻转</el-radio-button>
        <el-radio-button value="none">无动画</el-radio-button>
      </el-radio-group>
    </div>

    <div style="display: flex; gap: 8px; align-items: center">
      <span style="font-size: 14px; color: #666">动画时长：</span>
      <el-slider
        v-model="transitionDuration"
        :min="100"
        :max="800"
        :step="50"
        style="width: 200px"
        :format-tooltip="(v: number) => v + 'ms'"
      />
      <span style="font-size: 13px; color: #999"
        >{{ transitionDuration }}ms</span
      >
    </div>

    <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 4px">
      <el-button  @click="openWithTransition('fade')"
        >淡入淡出</el-button
      >
      <el-button  @click="openWithTransition('slide')"
        >滑动</el-button
      >
      <el-button  @click="openWithTransition('zoom')"
        >缩放</el-button
      >
      <el-button

        type="warning"
        @click="openWithTransition('flip3d')"
        >3D翻转</el-button
      >
      <el-button  @click="openWithTransition('none')"
        >无动画</el-button
      >
    </div>

    <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px">
      <img
        v-for="(url, i) in sampleImages"
        :key="i"
        :src="url"
        style="
          width: 120px;
          height: 90px;
          object-fit: cover;
          border-radius: 6px;
          cursor: pointer;
          border: 1px solid #ddd;
        "
        @click="
          imagesPreview(url, { transition: transitionType, transitionDuration })
        "
      />
    </div>

    <div style="margin-top: 12px; color: #888; font-size: 13px">
      <p>快捷键：← → 切换 | +/- 缩放 | R 旋转 | Esc 关闭</p>
      <p>支持：鼠标拖拽平移 | 滚轮缩放 | 点击缩略图跳转</p>
    </div>
  </div>
</template>
