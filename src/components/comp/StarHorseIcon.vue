<script setup lang="ts" name="StarHorseIcon">
import {computed} from 'vue';

const props = defineProps({
  iconClass: {type: String, required: true},
  className: {type: String},
  title: {type: String, default: ''},
  size: {type: String, default: '20px'},
  width: {type: String, default: '24px'},
  height: {type: String, default: '22px'},
  marginLeft: {type: String, default: '0.1em'},
  marginRight: {type: String, default: '0.1em'},
  borderRadius: {type: String, default: '5px'},
  boorderPadding: {type: String, default: '3px'},
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
    return cls + " " + props.className;
  } else {
    return cls;
  }
});
</script>
<style lang="scss" scoped>
.svg-icon {
  cursor: v-bind(cursor);
  width: v-bind(width);
  height: v-bind(height);
  color: v-bind(color);
  font-size: v-bind(size);
  margin-left: v-bind(marginLeft);
  margin-right: v-bind(marginRight);
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
  outline: none;
  align-items: center;
  justify-content: center;
  display: flex;
}

.icon-border {
  border-radius: v-bind(borderRadius);
  border: 1px solid var(--star-horse-style);
  padding: v-bind(boorderPadding);
}

.icon-cls {
  background: var(--star-horse-style);
  color: var(--star-horse-white);
  border-radius: v-bind(borderRadius);
  padding: v-bind(boorderPadding);
}
</style>
<template>
  <i aria-hidden="false" :class="[svgClass,iconName]" :title="title"/>
</template>
