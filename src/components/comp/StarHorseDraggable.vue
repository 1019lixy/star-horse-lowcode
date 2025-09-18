<script lang="ts" setup>
import {computed, onMounted, PropType, ref} from "vue";
import {DynamicNode} from "@/components/types/DynamicNode";
import {dynamicPageContextMenuData} from "@/plugins/AblesPlugin";
import {compKey} from "@/api/system";

const props = defineProps({
  msg: {
    type: String,
    required: true,
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
    default: false,
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
  },
});
const nodeRef = ref<HTMLDivElement>();
const nodeStyles = computed(() => {
  let styles = props.node.styles;
  if (!styles) {
    props.node.styles = {};
    styles = {};
  }
  let temp = {...styles};
  if (props.isActive && props.isDesign) {
    temp["cursor"] = "move";
    temp["position"] = "relative";
  }
  if (!styles["width"]) {
    //获取节点宽度
    const parentWidth = nodeRef.value?.parentElement?.clientWidth || 1;
    styles["width"] = props.sizeControlType === "percent"
        ? (100 * (nodeRef.value?.offsetWidth || 0) / parentWidth)
        : nodeRef.value?.offsetWidth || nodeRef.value?.clientWidth;
  }
  if (!styles["height"]) {
    //获取节点高度
    const parentHeight = nodeRef.value?.parentElement?.clientHeight || 1;
    styles["height"] = props.sizeControlType === "percent"
        ? (100 * (nodeRef.value?.offsetHeight || 0) / parentHeight)
        : nodeRef.value?.offsetHeight || nodeRef.value?.clientHeight;
  }
  //将所有数字转换为px
  for (let key in temp) {
    //在css 中哪些属性值是数字，但不需要转换为px
    if (typeof temp[key] === "number" && !["flex", "zIndex"].includes(key)) {
      if (props.sizeControlType === "percent" && ["width", "height"].includes(key)) {
        temp[key] = temp[key] + "%";
      } else {
        temp[key] = temp[key] + "px";
      }
    }
  }
  return temp;
});
const emits = defineEmits(["selectNode"]);
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
  handleClear();
};
const handleMouseDown = (e: MouseEvent) => {
  moveActive.value = true;
};
let moveActive = ref(false);
let rangeActive = ref(false);
const handleMouseUp = () => {
  moveActive.value = false;
  rangeActive.value = false;
  isDragging.value = false;
};
let step = ref(1);
const handleClear = () => {
  window.onmouseup = function () {
    document.onmousemove = null;
    document.onmouseup = null;
    handleMouseUp();
  };
};
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
  // 声明有意义的变量名
  let shouldAdjustWidth = false;
  let shouldAdjustHeight = false;
  let adjustLeft = false;
  let adjustTop = false;
  let invertWidthDirection = false;
  let invertHeightDirection = false;
  rangeActive.value = true;
  handleMouseDown(evt);
  // 初始化鼠标起始坐标
  let startX = evt.clientX;
  let startY = evt.clientY;
  const parentWidth = nodeRef.value?.parentElement?.clientWidth || 1;
  const parentHeight = nodeRef.value?.parentElement?.clientHeight || 1;
  document.onmousemove = (e: MouseEvent) => {
    moveActive.value = true;
    // 根据方向设置调整逻辑
    switch (direction) {
      case "right":
        shouldAdjustWidth = true;
        break;
      case "left":
        shouldAdjustWidth = true;
        invertWidthDirection = true;
        break;
      case "top":
        shouldAdjustHeight = true;
        adjustTop = true;
        invertHeightDirection = true;
        break;
      case "bottom":
        shouldAdjustHeight = true;
        break;
      case "bottom-right":
        shouldAdjustWidth = true;
        shouldAdjustHeight = true;
        break;
      case "bottom-left":
        shouldAdjustWidth = true;
        shouldAdjustHeight = true;
        invertWidthDirection = true;
        break;
      case "top-right":
        shouldAdjustWidth = true;
        shouldAdjustHeight = true;
        adjustTop = true;
        invertHeightDirection = true;
        break;
      case "top-left":
        shouldAdjustWidth = true;
        shouldAdjustHeight = true;
        invertWidthDirection = true;
        invertHeightDirection = true;
        break;
    }
    // 计算鼠标移动增量
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    startX = e.clientX;
    startY = e.clientY;
    // 新增灵敏度系数（可根据需要调整）
    const sensitivity = 3.55;
    // 宽度调整逻辑
    if (props.sizeControlType === "percent") {
      // 修改后的百分比计算（增加灵敏度系数）
      if (shouldAdjustWidth) {
        const widthDelta = (deltaX / parentWidth) * 100 * step.value * sensitivity;
        const finalWidthDelta = invertWidthDirection ? -widthDelta : widthDelta;

        if (adjustLeft) {
          props.node.styles.left = (props.node.styles.left || 0) - (finalWidthDelta * parentWidth / 100);
        }
        // 强制更新元素尺寸
        const currentWidth = nodeRef.value?.offsetWidth || 0;
        props.node.styles.width = (parseFloat(props.node.styles.width) || (100 * currentWidth / parentWidth)) + finalWidthDelta;
      }

      // 修改后的高度计算（增加灵敏度系数）
      if (shouldAdjustHeight) {
        const heightDelta = (deltaY / parentHeight) * 100 * step.value;
        const finalHeightDelta = invertHeightDirection ? -heightDelta : heightDelta;

        if (adjustTop) {
          props.node.styles.top = (props.node.styles.top || 0) - (finalHeightDelta * parentHeight / 100);
        }
        // 强制更新元素尺寸
        const currentHeight = nodeRef.value?.offsetHeight || 0;
        props.node.styles.height = (parseFloat(props.node.styles.height) || (100 * currentHeight / parentHeight)) + finalHeightDelta;
      }
    } else {
      if (shouldAdjustWidth) {
        const widthDelta = deltaX * step.value;
        const finalWidthDelta = invertWidthDirection ? -widthDelta : widthDelta;

        if (adjustLeft) {
          props.node.styles.left = (props.node.styles.left || 0) - finalWidthDelta;
        }
        props.node.styles.width = (props.node.styles.width || 100) + finalWidthDelta;
      }

      // 高度调整逻辑
      if (shouldAdjustHeight) {
        const heightDelta = deltaY * step.value;
        const finalHeightDelta = invertHeightDirection
            ? -heightDelta
            : heightDelta;

        if (adjustTop) {
          props.node.styles.top = (props.node.styles.top || 0) - finalHeightDelta;
        }

        props.node.styles.height = (props.node.styles.height || 50) + finalHeightDelta;
      }
    }
  };
  handleClear();
};
let isDragging = ref(false);
let initialX = ref(0);
let initialY = ref(0);
let nodeStartX = ref(0);
let nodeStartY = ref(0);
const dragStart = (evt: MouseEvent) => {
  if (!props.isActive || !props.isDesign) {
    return;
  }
  if (!props.node.styles) {
    props.node.styles = {};
  }
  isDragging.value = true;
  initialX.value = evt.clientX;
  initialY.value = evt.clientY;
  nodeStartX.value = props.node.styles.left || 0;
  nodeStartY.value = props.node.styles.top || 0;
  // 锁定鼠标样式
  document.body.style.cursor = "grabbing";
};
const dragAction = (evt: MouseEvent) => {
  if (!props.node.styles) {
    props.node.styles = {};
  }
  if (isDragging.value && props.isActive) {
    const deltaX = evt.clientX - initialX.value;
    const deltaY = evt.clientY - initialY.value;
    props.node.styles.left = nodeStartX.value + deltaX;
    props.node.styles.top = nodeStartY.value + deltaY;
  }
};
const endAction = (evt: MouseEvent) => {
  isDragging.value = false;
  document.body.style.cursor = ""; // 恢复默认鼠标样式
};
const contentMenuRef = ref();
const contextmenu = (e: MouseEvent) => {
  e.preventDefault();
  contentMenuRef.value?.show(e);
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
      @mouseup="endAction"
      @mousemove="dragAction"
      v-if="isDesign"
      ref="nodeRef"
  >

    <div class="w-full h-full">
      <div
          v-if="isActive&&showLine"
          class="node-line node-line-left"
          :style="{ 'border-width': '1px', 'border-color': 'red' }"
      ></div>
      <div
          v-if="isActive&&showLine"
          class="node-line node-line-top"
          :style="{ 'border-width': '3px', 'border-color': 'red' }"
      ></div>
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
      class="node"
      :style="nodeStyles" v-else>
    <slot></slot>
  </div>
  <Teleport to="body">
    <ContentMenu
        ref="contentMenuRef"
        :menu-data="dynamicPageContextMenuData(node)"
    />
  </Teleport>
</template>

<style scoped lang="scss">
.node {
  border: 1px solid #cecece;
  -webkit-tap-highlight-color: transparent;
  -moz-user-select: none;
  user-select: none;
  height: 100%;
}

.node.active {
  border: 1px dotted #09f;
  box-shadow: 0 0 10px #09f;
}

.node-point {
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 100%;
  z-index: 100;
  background-color: #09f;
}

.node-line-left {
  position: absolute;
  border-top: 1px dashed #09f;
  width: 10000px;
  height: 0;
  top: 0;
  -webkit-transform: translateX(-100%);
  transform: translateX(-100%);
}

.node-line-top {
  position: absolute;
  border-left: 1px dashed #09f;
  width: 0;
  height: 10000px;
  left: 0;
  -webkit-transform: translateY(-100%);
  transform: translateY(-100%);
}

.node-line-label {
  top: -5px;
  left: -8px;
  position: absolute;
  padding: 5px;
  -webkit-transform: translate(-100%, -100%);
  transform: translate(-100%, -100%);
  color: #09f;
  font-size: 18px;
  white-space: nowrap;
  cursor: move;
}

.node-menu {
  position: absolute;
  top: 0;
  left: 0;
  background-color: #409eff;
  font-size: 25px;
  color: #fff;
  z-index: 9999;
  cursor: pointer;
}

.node-mask {
  width: 100%;
  height: 100%;
  border: 0;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
}

.node-point-left,
.node-point-right {
  top: 50%;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
}

.node-point-left:hover,
.node-point-right:hover {
  cursor: ew-resize;
}

.node-point-left {
  left: -6px;
}

.node-point-right {
  right: -6px;
}

.node-point-bottom,
.node-point-top {
  left: 50%;
  -webkit-transform: translateX(-50%);
  transform: translateX(-50%);
}

.node-point-bottom:hover,
.node-point-top:hover {
  cursor: ns-resize;
}

.node-point-top {
  top: -6px;
}

.node-point-bottom {
  bottom: -6px;
}

.node-point-bottom-right:hover,
.node-point-top-left:hover {
  cursor: nwse-resize;
}

.node-point-bottom-left:hover,
.node-point-top-right:hover {
  cursor: nesw-resize;
}

.node-point-top-right {
  top: -6px;
  right: -6px;
}

.node-point-top-left {
  top: -6px;
  left: -6px;
}

.node-point-bottom-right {
  bottom: -6px;
  right: -6px;
}

.node-point-bottom-left {
  bottom: -6px;
  left: -6px;
}
</style>
