<template>
  <div
      class="screen-title"
      :class="`style-${styleType}`"
      :style="{
      width: width,
      '--main-color': mainColor,
      '--container-radius': containerRadius + 'px',
      '--decor-left-radius': decorLeftRadius + 'px',
      '--bg-color-left': bgColorLeft,
      '--bg-color-right': bgColorRight,
      '--arc-position': arcPosition + '%',
    }"
  >
    <!-- 完全使用SVG实现双拼色背景和S形过渡 -->
    <svg class="bg-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
      <!-- 左侧背景 -->
      <rect x="0" y="0" width="100" height="100" fill="var(--bg-color-left)"/>
      <!-- 右侧背景 + Z字去角曲线过渡 -->
      <path
          :d="`M${arcPosition} 0 C${arcPosition + 40} 0, ${arcPosition + 20} 40, ${arcPosition + 50} 50 C${arcPosition + 20} 60, ${arcPosition + 40} 100, ${arcPosition} 100 L100 100 L100 0 Z`"
          fill="var(--bg-color-right)"
      />
    </svg>

    <!-- 左侧装饰（圆角可配置） -->
    <div class="decor-left"></div>
    <!-- 标题内容 -->
    <h2 class="title-text">
      <slot>{{ title }}</slot>
    </h2>
    <!-- 右侧装饰容器 -->
    <div class="decor-right">
      <!-- 样式1：科技光效条 -->
      <svg
          v-if="styleType === 'tech'"
          class="tech-svg"
          viewBox="0 0 100 40"
          preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="techGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop
                offset="0%"
                stop-color="var(--main-color)"
                stop-opacity="0.8"
            />
            <stop
                offset="100%"
                stop-color="var(--main-color)"
                stop-opacity="0"
            />
          </linearGradient>
          <pattern
              id="dashPattern"
              width="10"
              height="40"
              patternUnits="userSpaceOnUse"
          >
            <rect
                x="0"
                y="0"
                width="5"
                height="40"
                fill="rgba(255,255,255,0.2)"
            />
          </pattern>
        </defs>
        <rect x="0" y="10" width="80" height="2" fill="url(#techGrad)"/>
        <rect x="20" y="18" width="60" height="4" fill="url(#dashPattern)">
          <animateTransform
              attributeName="transform"
              type="translate"
              from="0 0"
              to="10 0"
              dur="3s"
              repeatCount="indefinite"
          />
        </rect>
      </svg>
      <!-- 样式2：几何菱形 -->
      <svg
          v-if="styleType === 'geometry'"
          class="geo-svg"
          viewBox="0 0 60 40"
          preserveAspectRatio="none"
      >
        <polygon
            points="0 20, 10 10, 20 20, 10 30"
            fill="var(--main-color)"
            opacity="0.7"
        >
          <animate
              attributeName="opacity"
              values="0.7;0.3;0.7"
              dur="2s"
              repeatCount="indefinite"
          />
        </polygon>
        <polygon
            points="30 20, 40 10, 50 20, 40 30"
            fill="var(--main-color)"
            opacity="0.5"
        >
          <animate
              attributeName="opacity"
              values="0.5;0.2;0.5"
              dur="2.5s"
              repeatCount="indefinite"
          />
        </polygon>
      </svg>
      <!-- 样式3：动态粒子 -->
      <svg
          v-if="styleType === 'particle'"
          class="particle-svg"
          viewBox="0 0 80 40"
          preserveAspectRatio="none"
      >
        <circle
            v-for="i in 8"
            :key="i"
            cx="0"
            cy="20"
            r="1"
            fill="var(--main-color)"
            :transform="`translate(${i * 10}, 0)`"
        >
          <animate
              attributeName="r"
              values="1;2;1"
              dur="1.5s"
              :delay="`${i * 0.2}s`"
              repeatCount="indefinite"
          />
        </circle>
      </svg>
    </div>
  </div>
</template>

<script setup>
import {defineProps} from "vue";

// 外部配置参数
const props = defineProps({
  // 标题文字
  title: {
    type: String,
    default: "数据监控大屏",
  },
  // 装饰样式类型：tech(科技光效)、geometry(几何菱形)、particle(动态粒子)
  styleType: {
    type: String,
    default: "tech",
    validator: (v) => ["tech", "geometry", "particle"].includes(v),
  },
  // 主色调
  mainColor: {
    type: String,
    default: "#00a8ff",
  },
  // 组件宽度
  width: {
    type: String,
    default: "100%",
  },
  // 容器圆角（px）
  containerRadius: {
    type: [Number, String],
    default: 8,
  },
  // 左侧装饰条圆角（px）
  decorLeftRadius: {
    type: [Number, String],
    default: 2,
  },
  // 左侧背景色
  bgColorLeft: {
    type: String,
    default: "rgba(15, 23, 42, 0.8)",
  },
  // 右侧背景色
  bgColorRight: {
    type: String,
    default: "rgba(2, 32, 64, 0.8)",
  },
  // 弧线过渡位置（百分比，0-100）
  arcPosition: {
    type: [Number, String],
    default: 60,
  },
});
</script>

<style scoped>
/* 核心容器 */
.screen-title {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 20px;
  height: 60px;
  border-radius: var(--container-radius); /* 容器圆角变量 */
  margin: 0 0 20px 0;
  overflow: hidden; /* 隐藏背景溢出部分 */
  --main-color: #00a8ff; /* 主色调变量 */
  --container-radius: 8px; /* 默认容器圆角 */
  --decor-left-radius: 2px; /* 默认左侧装饰条圆角 */
  --bg-color-left: rgba(15, 23, 42, 0.8); /* 左侧背景色 */
  --bg-color-right: rgba(2, 32, 64, 0.8); /* 右侧背景色 */
  --arc-position: 60%; /* 弧线过渡位置 */
}

/* SVG背景容器 */
.bg-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  border-radius: var(--container-radius);
  overflow: hidden;
}

/* 左侧装饰（圆角可配置） */
.decor-left {
  position: relative;
  z-index: 1;
  width: 4px;
  height: 24px;
  background-color: var(--main-color);
  border-radius: var(--decor-left-radius); /* 左侧装饰条圆角变量 */
}

/* 标题文字 */
.title-text {
  position: relative;
  z-index: 1;
  flex: 1;
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
  text-shadow: 0 0 4px rgba(0, 168, 255, 0.3);
}

/* 右侧装饰容器 */
.decor-right {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  height: 100%;
}

/* 样式1：科技光效 */
.style-tech .tech-svg {
  width: 100px;
  height: 100%;
}

/* 样式2：几何菱形 */
.style-geometry .geo-svg {
  width: 60px;
  height: 100%;
}

/* 样式3：动态粒子 */
.style-particle .particle-svg {
  width: 80px;
  height: 100%;
}
</style>
