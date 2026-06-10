<script setup lang="ts">
import {nextTick, onMounted, PropType, ref, watch} from "vue";

const props = defineProps({
  menus: {type: Array<any>, default: () => []},
  icon: {type: String, default: "menu"},
  prop: {
    type: Object as PropType<Record<string, string>>, default: () => {
      return {
        label: "btnName",
        iconName: "icon",
      };
    }
  },
  position: {type: Object as PropType<Record<string, any>>, default: {}},
});
const emits = defineEmits(["change"]);
let startX = ref<any>(undefined); //判断是否要打开下拉
let endX = ref<any>(undefined);
let startY = ref<any>(undefined);
let endY = ref<any>(undefined);

let active = ref<boolean>(false); //判断当前是否在拖动状态
let currentX = ref<any>(undefined);
let currentY = ref<any>(undefined);
let initialX = ref<any>(undefined);
let initialY = ref<any>(undefined);

let xOffset = ref<number>(0);
let yOffset = ref<number>(0);
let dropDownVisible = ref<boolean>(false);
let show = ref<boolean>(true);
let body = document.querySelectorAll("body")[0];
const screenshot = ref();
const screenshotBtnRef = ref();
const hideDropDown = () => {
  dropDownVisible.value = false;
  body.removeEventListener("click", hideDropDown, false);
  let screenshotBtn = screenshotBtnRef.value.$el;
  if (screenshotBtn) {
    screenshotBtn.style.opacity = 0.2;
  }
};
//展示下拉
const showDropDown = (e) => {
  if (!props.menus || !props.menus.length) {
    emits("change");
    return;
  }
  if (startX.value == endX.value && startY.value == endY.value) {
    dropDownVisible.value = !dropDownVisible.value;
    if (dropDownVisible.value == false) {
      hideDropDown();
    } else {
      body.addEventListener("click", hideDropDown, false);
      let screenshotBtn = screenshotBtnRef.value.$el;
      if (screenshotBtn) {
        screenshotBtn.style.opacity = 1;
      }
    }
  }
};
const setTranslate = (xPos: number, yPos: number, el: any) => {
  el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
};
const drag = ($event) => {
  if (active.value) {
    if ($event.type === "touchmove") {
      currentX.value = $event.touches[0].clientX - initialX.value;
      currentY.value = $event.touches[0].clientY - initialY.value;
    } else {
      currentX.value = $event.clientX - initialX.value;
      currentY.value = $event.clientY - initialY.value;
    }

    xOffset.value = currentX.value;
    yOffset.value = currentY.value;
    setTranslate(currentX.value, currentY.value, screenshot.value);
  }
  return false;
};
const dragEnd = ($event) => {
  initialX.value = currentX.value;
  initialY.value = currentY.value;
  //判断是否手机touch事件
  if ($event.type === "touchstart") {
    //记录结束的位置 当开始和结束的位置一样的时候，需要触发下拉菜单展示
    endX.value = $event.touches[0].clientX;
    endY.value = $event.touches[0].clientY;
  } else {
    //记录结束的位置 当开始和结束的位置一样的时候，需要触发下拉菜单展示
    endX.value = $event.clientX;
    endY.value = $event.clientY;
  }
  let screenshotBtn = screenshotBtnRef.value.$el;
  if (screenshotBtn) {
    screenshotBtn.style.opacity = 0.5;
  }
  active.value = false;

  body.removeEventListener("touchend", dragEnd);
  body.removeEventListener("touchmove", drag);
  body.removeEventListener("mouseup", dragEnd);
  body.removeEventListener("mousemove", drag);
  return false;
};
const dragStart = ($event) => {
  if ($event.type === "touchstart") {
    initialX.value = $event.touches[0].clientX - xOffset.value;
    initialY.value = $event.touches[0].clientY - yOffset.value;
    //记录开始的位置 当开始和结束的位置一样的时候，需要触发下拉菜单展示
    startX.value = $event.touches[0].clientX;
    startY.value = $event.touches[0].clientY;
  } else {
    initialX.value = $event.clientX - xOffset.value;
    initialY.value = $event.clientY - yOffset.value;
    //记录开始的位置 当开始和结束的位置一样的时候，需要触发下拉菜单展示
    startX.value = $event.clientX;
    startY.value = $event.clientY;
  }
  if ($event.currentTarget.id === screenshot.value.id) {
    body.removeEventListener("touchend", dragEnd, false);
    body.removeEventListener("touchmove", drag, false);
    body.removeEventListener("mouseup", dragEnd, false);
    body.removeEventListener("mousemove", drag, false);
    body.addEventListener("touchend", dragEnd, false);
    body.addEventListener("touchmove", drag, false);
    body.addEventListener("mouseup", dragEnd, false);
    body.addEventListener("mousemove", drag, false);
    //是否是拖拽状态
    active.value = true;
  }
  let screenshotBtn = screenshotBtnRef.value.$el;
  if (screenshotBtn) {
    screenshotBtn.style.opacity = 1;
  }

  return false;
};
const changeMenu = (menu: any) => {
  emits("change", menu);
};
const init = async () => {
  await nextTick();
  screenshot.value.addEventListener("touchstart", dragStart, false);
  screenshot.value.addEventListener("mousedown", dragStart, false);
  assignPosition();
};
const assignPosition = () => {
  let temp = screenshot.value;
  nextTick(() => {
    console.log(temp);
    if (temp) {
      Object.entries(props.position).forEach(([key, value]) => {
        temp.style[key] = value;
        console.log(key, value);
      });
    }
  });
};
onMounted(async () => {
  await init();
});
watch(() => props.position, (val) => {
  if (Object.keys(val || {}).length > 0) {
    assignPosition();
  }
}, {immediate: false, deep: true});
</script>
<template>
  <div v-show="show" ref="screenshot" id="screenshot" class="screenshot">
    <div
        ref="screenshotDropdown"
        v-if="dropDownVisible"
        class="screenshot-dropdown"
    >
      <div
          class="flex items-center gap-1 h-[30px] cursor-pointer"
          v-for="(menu, i) in menus"
          :key="i"
          @click="changeMenu(menu)"
      >
        <star-horse-icon :icon-class="menu[prop.iconName??'icon']||'document'"/>
        <span>{{ menu[prop.label ?? "btnName"] }}</span>
      </div>
    </div>
    <el-button
        ref="screenshotBtnRef"
        id="screenshotBtn"
        circle
        @click.native.prevent.stop="showDropDown"
        class="screenshot-btn el-dropdown-link"
        type="primary"
    >
      <star-horse-icon :icon-class="icon" color="var(--star-horse-white)"/>
    </el-button>
  </div>
</template>
