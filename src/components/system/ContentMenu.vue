<script lang="ts" setup>
  import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
  import { useZIndex } from "@/api/system.ts";
  import StarHorseIcon from "@/components/comp/StarHorseIcon.vue";

  defineOptions({
    name: "PageEditorContentMenu"
  });

  const props = defineProps({
    menuData: { type: Array, default: () => [] },
    isSubMenu: { type: Boolean, default: false },
    autoHide: { type: Boolean, default: true },
    active: { type: [String, Number], default: "" }
  });
  const emit = defineEmits<{
    hide: [];
    show: [];
    mouseenter: [];
  }>();

  const menu = ref<HTMLDivElement>();
  const buttons = ref<Array<any>>();
  const subMenu = ref<any>();
  const visible = ref(false);
  const subMenuData = ref<Array<any>>([]);
  const zIndex = useZIndex();
  const curZIndex = ref<number>(0);

  const menuPosition = ref({
    left: 0,
    top: 0
  });

  const menuStyle = computed(() => ({
    top: `${menuPosition.value.top}px`,
    left: `${menuPosition.value.left}px`,
    zIndex: curZIndex.value
  }));

  const contains = (el: HTMLElement) => menu.value?.contains(el) || subMenu.value?.contains(el);

  const hide = () => {
    if (!visible.value) return;
    visible.value = false;
    subMenu.value?.hide();
    emit("hide");
  };

  const clickHandler = (item: any) => {
    if (!props.autoHide) return;
    item.handler();
    hide();
  };

  const outsideClickHideHandler = (e: MouseEvent) => {
    if (!props.autoHide) return;
    const target = e.target as HTMLElement | undefined;
    if (!visible.value || !target) {
      return;
    }
    if (contains(target)) {
      return;
    }
    hide();
  };

  const setPosition = (e: MouseEvent) => {
    const menuHeight = menu.value?.clientHeight || 0;
    let top = e.clientY;
    if (menuHeight + e.clientY > document.body.clientHeight) {
      top = document.body.clientHeight - menuHeight;
    }
    let left = e.clientX;
    menuPosition.value = {
      top,
      left
    };
  };

  const show = (e?: MouseEvent) => {
    // 加setTimeout是以为，如果菜单中的按钮监听的是mouseup，那么菜单显示出来时鼠标如果正好在菜单上就会马上触发按钮的mouseup
    setTimeout(() => {
      visible.value = true;
      nextTick(() => {
        e && setPosition(e);
        curZIndex.value = zIndex.nextZIndex();
        emit("show");
      });
    }, 300);
  };
  const showSubMenu = (item: any, index: number) => {
    const menuItem = item;
    if (typeof item !== "object") {
      return;
    }
    subMenuData.value = menuItem.items || [];
    setTimeout(() => {
      if (!visible.value) {
        return;
      }

      if (menu.value) {
        // 将子菜单放置在按钮右侧，与按钮齐平
        let y = menu.value.offsetTop;
        if (buttons.value?.[index]?.$el) {
          const rect = buttons.value?.[index].$el.getBoundingClientRect();
          y = rect.top;
        }
        subMenu.value?.show({
          clientX: menu.value.offsetLeft + menu.value.clientWidth,
          clientY: y
        });
      }
    }, 0);
  };

  const mouseenterHandler = () => {
    emit("mouseenter");
  };

  onMounted(() => {
    if (props.isSubMenu) return;
    globalThis.addEventListener("mousedown", outsideClickHideHandler, true);
  });

  onBeforeUnmount(() => {
    if (props.isSubMenu) return;
    globalThis.removeEventListener("mousedown", outsideClickHideHandler, true);
  });

  defineExpose({
    menu,
    menuPosition,
    hide,
    show,
    contains,
    setPosition
  });
</script>
<template>
  <transition name="fade">
    <div v-show="visible" class="content-menu" ref="menu" :style="menuStyle" @mouseenter="mouseenterHandler()">
      <slot name="title"></slot>

      <template v-for="(item, index) in menuData">
        <el-divider v-if="item.type == 'divider'" :direction="item.direction" />
        <div
          v-if="item.type == 'button' && item.display"
          ref="buttons"
          class="menu-item button"
          :class="{ active: active && item.id === active }"
          :data="item"
          :key="index"
          @mouseup="clickHandler(item)"
          @mouseenter="showSubMenu(item, index)"
        >
          <star-horse-icon :icon-class="item.icon" />
          {{ item.text }}
        </div>
      </template>
      <teleport to="body">
        <content-menu
          v-if="subMenuData.length"
          class="sub-menu"
          ref="subMenu"
          :active="active"
          :menu-data="subMenuData"
          :is-sub-menu="true"
          @hide="hide"
        ></content-menu>
      </teleport>
    </div>
  </transition>
</template>
<style lang="scss" scoped>
  :deep(.el-divider) {
    margin: 5px auto;
  }

  .content-menu {
    position: fixed;
    font-size: 12px;
    background: #fff;
    box-shadow: 0 2px 8px 2px rgba(68, 73, 77, 0.16);
    z-index: 999999;
    transform-origin: 0 0;
    font-weight: 600;
    padding: 4px 0;
    overflow: auto;
    max-height: 80%;
    min-width: 180px;

    .menu-item {
      color: #333;
      display: flex;
      -webkit-box-align: center;
      align-items: center;
      flex-direction: row;
      vertical-align: middle;
      cursor: pointer;
      line-height: 35px;
      min-width: 140px;
      transition: all 0.2s ease 0s;
      padding: 5px 14px;
      border-left: 2px solid transparent;

      .button {
        width: 100%;
        justify-content: flex-start;
      }

      .el-button--text,
      i {
        color: var(--star-horse-style);
      }

      svg {
        margin-right: 5px;
      }

      &.divider {
        padding: 0 14px;

        .el-divider {
          margin: 0;
        }
      }

      &.button {
        &:hover {
          background-color: #6b778c;

          &.menu-item i {
            color: var(--star-horse-style);
          }
        }

        &.active {
          background-color: #6b778c;

          &.menu-item i {
            color: #fff;
          }
        }
      }
    }
  }
</style>
