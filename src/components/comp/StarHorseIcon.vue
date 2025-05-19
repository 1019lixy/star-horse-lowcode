<script setup lang="ts" name="StarHorseIcon">
import {computed} from 'vue';

const props = defineProps({
  iconClass: {type: String, required: true},
  className: {type: String},
  title: {type: String, default: ''},
  size: {type: String, default: '20px'},
  // 图标是否有边框
  boxShow: {type: Boolean, default: false},
  border: {type: Boolean, default: false},
  color: {type: String, default: 'var(--star-horse-style)'},
  cursor: {type: String, default: 'default'}
});
const iconName = computed(() => `sh-${props.iconClass}`);
const svgClass = computed(() => {
  let cls = props.border ? 'sh_icon svg-icon icon-border' : props.boxShow ? 'sh_icon svg-icon icon-cls' : 'sh_icon svg-icon';
  if (props.className) {
    return cls + props.className;
  } else {
    return cls;
  }
});
</script>
<style lang="scss" scoped>
.svg-icon {
  cursor: v-bind(cursor);
  width: v-bind(size);
  height: v-bind(size);
  color: v-bind(color);
  font-size: v-bind(size);
  margin-left: 0.35em;
  /*margin-right: 0.35em;*/
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
  outline: none;
}

.icon-border {
  border-radius: 7px;
  border: 1px solid var(--star-horse-style);
  padding: 3px;
}

.icon-cls {
  background: var(--star-horse-style);
  color: var(--star-horse-white);
  border-radius: 7px;
  padding: 3px;
}
</style>
<template>
  <i aria-hidden="false" :class="[svgClass,iconName]" :title="title">
  </i>
</template>
