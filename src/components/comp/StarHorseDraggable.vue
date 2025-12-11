<script lang="ts" setup>
import {computed, onMounted, PropType, ref} from "vue";
import {DynamicNode} from "@/components/types/DynamicNode";
import {dynamicPageContextMenuData} from "@/plugins/AblesPlugin";
import {compKey} from "@/api/system";

const props = defineProps({
  msg: {
    type: String
  },
  node: {
    type: Object as PropType<DynamicNode>,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  showLine: {
    type: Boolean,
    default: true,
  },
  /**
   * 大小控制类型，percent：百分比，px：像素
   */
  sizeControlType: {
    type: String,
    default: "percent",
  },
  isDesign: {
    type: Boolean,
    default: false,
  }
});

// 用于显示宽高信息的ref
const sizeInfoRef = ref<HTMLElement | null>(null);
const sizeInfoContent = ref<string>("");
const sizeInfoPosition = ref<any>({x: 0, y: 0});
const nodeRef = ref<HTMLDivElement>();
const nodeStyles = computed(() => {
  let styles = props.node.styles;
  if (!styles) {
    props.node.styles = {};
    styles = props.node.styles;
  }
  if (props.isDesign) {
    styles["position"] = "absolute";
  }
  let temp = {...styles};
  // 设计态统一使用 absolute，避免相对定位造成边界和基线混乱
  const parentWidth = nodeRef.value?.parentElement?.clientWidth || 1;
  const parentHeight = nodeRef.value?.parentElement?.clientHeight || 1;
  if (props.isDesign) {
    if (props.isActive) {
      temp["cursor"] = "move";
    }
    if (typeof styles.left !== "number") styles.left = props.sizeControlType === "percent" ? 50 : parentWidth / 2;
    if (typeof styles.top !== "number") styles.top = props.sizeControlType === "percent" ? 50 : parentHeight / 2;
    temp["left"] = styles.left;
    temp["top"] = styles.top;
  }
  // if (!styles["width"]) {
  //获取节点宽度
  // const parentWidth = nodeRef.value?.parentElement?.clientWidth || 1;
  // styles["width"] = props.sizeControlType === "percent"
  //     ? (100 * (nodeRef.value?.offsetWidth || 0) / parentWidth)
  //     : nodeRef.value?.offsetWidth || nodeRef.value?.clientWidth;
  if (!styles["width"]) {
    styles["width"] = props.sizeControlType === "percent" ? 20 : 120;
    temp["width"] = styles["width"];
  }
  // }
  // if (!styles["height"]) {
  // //获取节点高度
  // const parentHeight = nodeRef.value?.parentElement?.clientHeight || 1;
  // styles["height"] = props.sizeControlType === "percent"
  //     ? (100 * (nodeRef.value?.offsetHeight || 0) / parentHeight)
  //     : nodeRef.value?.offsetHeight || nodeRef.value?.clientHeight;
  if (!styles["height"]) {
    styles["height"] = props.sizeControlType === "percent" ? 15 : 100;
    temp["height"] = styles["height"];
  }
  // }
  //将所有数字转换为px或百分比
  for (let key in temp) {
    if (typeof temp[key] === "number" && !["flex", "zIndex"].includes(key)) {
      if (props.sizeControlType === "percent" && ["width", "height"].includes(key)) {
        temp[key] = temp[key] + "%";
      } else {
        temp[key] = temp[key] + "px";
      }
    }
  }
  if (props.isDesign) {
    temp["border"] = "1px solid var(--star-horse-style)";
  }
  return temp;
});
const emits = defineEmits(["contextAction", "selectNode"]);
const pointList = ref<Array<string>>([
  "left",
  "right",
  "top",
  "bottom",
  "bottom-right",
  "bottom-left",
  "top-right",
  "top-left",
]);

const init = async () => {
  // handleClear();
};
// 移除不必要的全局状态变量
// let moveActive = ref(false);
// let rangeActive = ref(false);
const selectItem = () => {
  emits("selectNode", props.node);
};
/**
 * 改变div的大小
 * @param evt
 * @param direction
 */
const rangeMove = (evt: MouseEvent, direction: string) => {
  evt.preventDefault();
  evt.stopPropagation();
  if (!props.isActive || !props.isDesign) {
    return;
  }
  if (!props.node.styles) {
    props.node.styles = {};
  }

  const parentEl = nodeRef.value?.parentElement as HTMLElement | null;
  const parentRect = parentEl?.getBoundingClientRect();
  const nodeRect = nodeRef.value?.getBoundingClientRect();
  const parentWidth = parentEl?.clientWidth || 1;
  const parentHeight = parentEl?.clientHeight || 1;

  // 元素起始边缘（相对父容器坐标）
  const initialLeftEdge = (nodeRect?.left || 0) - (parentRect?.left || 0);
  const initialTopEdge = (nodeRect?.top || 0) - (parentRect?.top || 0);
  const initialWidthPx = nodeRect?.width || 0;
  const initialHeightPx = nodeRect?.height || 0;
  const initialRightEdge = initialLeftEdge + initialWidthPx;
  const initialBottomEdge = initialTopEdge + initialHeightPx;

  // 当前样式偏移（relative 模式下，left/top 是相对正常流位置的偏移量）
  const initialLeftOffset = props.node.styles.left || 0;
  const initialTopOffset = props.node.styles.top || 0;
  // baseline：正常流位置坐标 = 当前边缘坐标 - 当前偏移量
  const baselineLeft = initialLeftEdge - initialLeftOffset;
  const baselineTop = initialTopEdge - initialTopOffset;

  const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

  // 使用事件监听器替代直接赋值，避免覆盖其他实例的事件
  const handleMouseMove = (e: MouseEvent) => {
    const pointerX = e.clientX - (parentRect?.left || 0);
    const pointerY = e.clientY - (parentRect?.top || 0);

    // 基于起始边缘的位移量（dx/dy），更直观稳定
    const dxLeft = pointerX - initialLeftEdge;
    const dxRight = pointerX - initialRightEdge;
    const dyTop = pointerY - initialTopEdge;
    const dyBottom = pointerY - initialBottomEdge;

    // 结果值初始化为起始值
    let newLeftOffset = initialLeftOffset;
    let newTopOffset = initialTopOffset;
    let newWidth = initialWidthPx;
    let newHeight = initialHeightPx;

    switch (direction) {
      case "right": {
        // 右边缘随鼠标，宽度=初始宽度+右侧位移
        const targetRight = clamp(initialRightEdge + dxRight, initialLeftEdge + 1, parentWidth);
        newWidth = Math.max(1, targetRight - initialLeftEdge);
        break;
      }
      case "left": {
        // 左边缘随鼠标
        let targetLeft = initialLeftEdge + dxLeft; // = pointerX
        targetLeft = clamp(targetLeft, 0, initialRightEdge - 1);
        // 更新left偏移量，使边缘=baselineLeft+offset
        newLeftOffset = targetLeft - baselineLeft;
        // 宽度=右边缘-左边缘
        newWidth = Math.max(1, initialRightEdge - targetLeft);
        break;
      }
      case "bottom": {
        const targetBottom = clamp(initialBottomEdge + dyBottom, initialTopEdge + 1, parentHeight);
        newHeight = Math.max(1, targetBottom - initialTopEdge);
        break;
      }
      case "top": {
        let targetTop = initialTopEdge + dyTop; // = pointerY
        targetTop = clamp(targetTop, 0, initialBottomEdge - 1);
        newTopOffset = targetTop - baselineTop;
        newHeight = Math.max(1, initialBottomEdge - targetTop);
        break;
      }
      case "bottom-right": {
        const targetRight = clamp(initialRightEdge + dxRight, initialLeftEdge + 1, parentWidth);
        const targetBottom = clamp(initialBottomEdge + dyBottom, initialTopEdge + 1, parentHeight);
        newWidth = Math.max(1, targetRight - initialLeftEdge);
        newHeight = Math.max(1, targetBottom - initialTopEdge);
        break;
      }
      case "bottom-left": {
        let targetLeft = initialLeftEdge + dxLeft;
        targetLeft = clamp(targetLeft, 0, initialRightEdge - 1);
        newLeftOffset = targetLeft - baselineLeft;
        newWidth = Math.max(1, initialRightEdge - targetLeft);

        const targetBottom = clamp(initialBottomEdge + dyBottom, initialTopEdge + 1, parentHeight);
        newHeight = Math.max(1, targetBottom - initialTopEdge);
        break;
      }
      case "top-right": {
        const targetRight = clamp(initialRightEdge + dxRight, initialLeftEdge + 1, parentWidth);
        newWidth = Math.max(1, targetRight - initialLeftEdge);

        let targetTop = initialTopEdge + dyTop;
        targetTop = clamp(targetTop, 0, initialBottomEdge - 1);
        newTopOffset = targetTop - baselineTop;
        newHeight = Math.max(1, initialBottomEdge - targetTop);
        break;
      }
      case "top-left": {
        let targetLeft = initialLeftEdge + dxLeft;
        targetLeft = clamp(targetLeft, 0, initialRightEdge - 1);
        newLeftOffset = targetLeft - baselineLeft;
        newWidth = Math.max(1, initialRightEdge - targetLeft);

        let targetTop = initialTopEdge + dyTop;
        targetTop = clamp(targetTop, 0, initialBottomEdge - 1);
        newTopOffset = targetTop - baselineTop;
        newHeight = Math.max(1, initialBottomEdge - targetTop);
        break;
      }
    }

    // 仅更新被拖拽轴向
    const setWidth = (wPx: number) => {
      if (props.sizeControlType === "percent") {
        props.node.styles.width = (wPx / parentWidth) * 100;
      } else {
        props.node.styles.width = wPx;
      }
    };
    const setHeight = (hPx: number) => {
      if (props.sizeControlType === "percent") {
        props.node.styles.height = (hPx / parentHeight) * 100;
      } else {
        props.node.styles.height = hPx;
      }
    };

    if (direction === "right") {
      setWidth(newWidth);
    } else if (direction === "left") {
      props.node.styles.left = newLeftOffset;
      setWidth(newWidth);
    } else if (direction === "bottom") {
      setHeight(newHeight);
    } else if (direction === "top") {
      props.node.styles.top = newTopOffset;
      setHeight(newHeight);
    } else if (direction === "bottom-right") {
      setWidth(newWidth);
      setHeight(newHeight);
    } else if (direction === "bottom-left") {
      props.node.styles.left = newLeftOffset;
      setWidth(newWidth);
      setHeight(newHeight);
    } else if (direction === "top-right") {
      setWidth(newWidth);
      props.node.styles.top = newTopOffset;
      setHeight(newHeight);
    } else if (direction === "top-left") {
      props.node.styles.left = newLeftOffset;
      setWidth(newWidth);
      props.node.styles.top = newTopOffset;
      setHeight(newHeight);
    }

    // 更新宽高信息
    sizeInfoContent.value = `${Math.round(newWidth)}px × ${Math.round(newHeight)}px`;
    sizeInfoPosition.value = {x: e.clientX + 10, y: e.clientY + 10};
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    // 隐藏宽高信息
    sizeInfoContent.value = "";
  };

  // 添加事件监听器
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);
};
let isDragging = ref(false);
let initialX = ref(0);
let initialY = ref(0);
let nodeStartX = ref(0);
let nodeStartY = ref(0);
const dragStart = (evt: MouseEvent) => {
  // 确保在设计模式下才允许拖动
  if (!props.isDesign) {
    return;
  }
  if (!props.node.styles) {
    props.node.styles = {};
  }
  // 阻止事件冒泡，避免多个实例同时响应
  evt.stopPropagation();

  // 自动激活节点（如果未激活）
  if (!props.isActive) {
    selectItem();
  }

  isDragging.value = true;
  initialX.value = evt.clientX;
  initialY.value = evt.clientY;
  nodeStartX.value = props.node.styles.left || 0;
  nodeStartY.value = props.node.styles.top || 0;
  // 锁定鼠标样式
  document.body.style.cursor = "grabbing";

  // 使用document级别的事件监听器
  const handleMouseMove = (e: MouseEvent) => {
    e.preventDefault();
    if (!props.node.styles) {
      props.node.styles = {};
    }
    if (isDragging.value) {
      const deltaX = e.clientX - initialX.value;
      const deltaY = e.clientY - initialY.value;
      // 直接更新样式
      props.node.styles.left = nodeStartX.value + deltaX;
      props.node.styles.top = nodeStartY.value + deltaY;
    }
  };

  const handleMouseUp = (e: MouseEvent) => {
    e.preventDefault();
    isDragging.value = false;
    document.body.style.cursor = "";
    // 确保移除事件监听器
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  // 添加事件监听器
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);
};
// const dragAction = (evt: MouseEvent) => {
//   if (!props.node.styles) {
//     props.node.styles = {};
//   }
//   if (isDragging.value && props.isActive) {
//     const deltaX = evt.clientX - initialX.value;
//     const deltaY = evt.clientY - initialY.value;
//     props.node.styles.left = nodeStartX.value + deltaX;
//     props.node.styles.top = nodeStartY.value + deltaY;
//   }
// };
// const endAction = (evt: MouseEvent) => {
//   isDragging.value = false;
//   document.body.style.cursor = ""; // 恢复默认鼠标样式
// };
const contentMenuRef = ref();
const contextmenu = (e: MouseEvent) => {
  e.preventDefault();
  contentMenuRef.value?.show(e);
};
const recallFunction = (actionName: string, nodeInfo: DynamicNode) => {
  emits("contextAction", actionName, nodeInfo);
};
onMounted(() => {
  init();
});
</script>

<template>
  <div
      class="node"
      :class="{ active: isActive&&isDesign }"
      :style="nodeStyles"
      @contextmenu="contextmenu"
      @mousedown="dragStart"
      @click.stop="selectItem"
      v-if="isDesign"
      ref="nodeRef"
  >
    <div class="w-full h-full">
      <div v-if="isActive&&showLine"
           style="position: fixed;border-top: 1px dashed var(--star-horse-style);width: 100%;left:0"/><!--顶部辅助线-->
      <div v-if="isActive&&showLine"
           style="position: fixed;border-right: 1px dashed var(--star-horse-style);height:100%;top:0"/><!--左侧辅助线-->
      <div
          class="node-point"
          :class="'node-point-' + item"
          v-for="(item, key) in pointList"
          :key="compKey(item, key)"
          @mousedown="rangeMove($event, item)"
          v-if="isActive"
      ></div>
      <div class="w-full h-full">
        <slot></slot>
      </div>
    </div>
  </div>
  <div
      class="node-preview"
      :style="nodeStyles" v-else>
    <div class="w-full h-full">
      <slot></slot>
    </div>
  </div>
  <Teleport to="body">
    <ContentMenu
        ref="contentMenuRef"
        :menu-data="dynamicPageContextMenuData(node,recallFunction)"
    />
    <!-- 显示宽高信息的元素 -->
    <div
        v-if="sizeInfoContent"
        ref="sizeInfoRef"
        class="size-info-tooltip"
        :style="{
        left: `${sizeInfoPosition.x}px`,
        top: `${sizeInfoPosition.y}px`
      }"
    >
      {{ sizeInfoContent }}
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
.node, .node-preview {
  -webkit-tap-highlight-color: transparent;
  -moz-user-select: none;
  user-select: none;
  height: 100%;
}

.node {
  border: none;
}

.node.active {
  border: 1px dotted var(--star-horse-style);
}

.node-point {
  position: absolute;

  border-radius: 1px;
  z-index: 2000;
  background-color: var(--star-horse-style);
  //border: 1px solid white; /* 添加白色边框以增强对比度 */
  //box-shadow: 0 0 2px rgba(0, 0, 0, 0.3); /* 添加轻微阴影 */
}

.node-point-left,
.node-point-right {
  top: 50%;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  width: 6px;
  height: 12px;
}

.node-point-left:hover,
.node-point-right:hover {
  cursor: ew-resize;
}

.node-point-left {
  left: -3px;
}

.node-point-right {
  right: -3px;
}

.node-point-bottom,
.node-point-top {
  left: 50%;
  -webkit-transform: translateX(-50%);
  transform: translateX(-50%);
  border: solid 3px var(--star-horse-style);
  width: 12px;
  height: 6px;
}

.node-point-bottom:hover,
.node-point-top:hover {
  cursor: ns-resize;
}

.node-point-top {
  top: -3px;
}

.node-point-bottom {
  bottom: -3px;
}

.node-point-bottom-right:hover,
.node-point-top-left:hover {
  cursor: nwse-resize;
}

.node-point-bottom-left:hover,
.node-point-top-right:hover {
  cursor: nesw-resize;
}

/* 右上角转角 - 只显示上边框和右边框 */
.node-point-top-right {
  top: -2px;
  right: -1px;
  width: 8px;
  height: 8px;
  background: transparent;
  border: 3px solid var(--star-horse-style);
  border-left: none;
  border-bottom: none;
  border-radius: 0 0 1px 0;
}

/* 左上角转角 - 只显示上边框和左边框 */
.node-point-top-left {
  top: -2px;
  left: -1px;
  width: 8px;
  height: 8px;
  background: transparent;
  border: 3px solid var(--star-horse-style);
  border-right: none;
  border-bottom: none;
  border-radius: 0 0 1px 0;
}

/* 右下角转角 - 只显示下边框和右边框 */
.node-point-bottom-right {
  bottom: -2px;
  right: -1px;
  width: 8px;
  height: 8px;
  background: transparent;
  border: 3px solid var(--star-horse-style);
  border-left: none;
  border-top: none;
  border-radius: 0 0 1px 0;
}

/* 左下角转角 - 只显示下边框和左边框 */
.node-point-bottom-left {
  bottom: -2px;
  left: -1px;
  width: 8px;
  height: 8px;
  background: transparent;
  border: 3px solid var(--star-horse-style);
  border-right: none;
  border-top: none;
  border-radius: 0 0 1px 0;
}

/* 宽高信息提示框样式 */
.size-info-tooltip {
  position: fixed;
  background-color: var(--star-horse-style);
  color: white;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-family: Arial, sans-serif;
  z-index: 9999;
  pointer-events: none;
  user-select: none;
  white-space: nowrap;
}
</style>
