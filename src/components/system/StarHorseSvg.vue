<script setup lang="ts" name="StarHorseSvg">
  import { computed, PropType } from 'vue';
  import { ShapeInfo } from '@/utils/shapes.ts';

  const props = defineProps({
    className: { type: String },
    title: { type: String, default: '' },
    size: { type: String, default: '20px' },
    width: { type: Number, default: 200 },
    height: { type: Number, default: 200 },
    data: { type: Object as PropType<ShapeInfo>, default: {} },
    borderOffset: { type: Number, default: 0 },
    color: { type: String, default: 'var(--star-horse-style)' },
    backgroundColor: { type: String, default: '#fff' },
    borderColor: { type: String, default: '#ebebeb' },
    borderWidth: { type: Number, default: 0 },
    cursor: { type: String, default: 'default' }
  });
  const svgClass = computed(() => {
    if (props.className) {
      return 'svg-icon ' + props.className;
    } else {
      return 'svg-icon';
    }
  });
</script>
<style lang="scss" scoped>
  .svg-icon {
    cursor: v-bind(cursor);
    width: v-bind(size);
    height: v-bind(size);
    color: v-bind(color);
    margin-left: 0.35em;
    margin-right: 0.35em;
    vertical-align: -0.15em;
    fill: currentColor;
  }
</style>
<template>
  <svg :class="svgClass" :width="width" :height="height">
    <!--'+(width - borderOffset)/ data.viewBox[0]+','+(height - borderOffset) / data.viewBox[1]+'-->
    <g
      :transform="
        'scale(' +
        (width - borderOffset) / data.viewBox[0] +
        ',' +
        (height - borderOffset) / data.viewBox[1] +
        ') translate(0,0) matrix(1,0,0,1,0,0)'
      "
    >
      <path
        :class="data.outlined ? 'outlined' : ''"
        :d="data.path"
        vector-effect="non-scaling-stroke"
        stroke-linecap="butt"
        stroke-miterlimit="8"
        :fill="color"
        :stroke="borderColor"
        :stroke-width="borderWidth"
      ></path>
    </g>
  </svg>
</template>
