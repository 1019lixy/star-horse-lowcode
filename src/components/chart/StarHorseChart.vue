<script setup lang="ts">
import {onMounted, ref} from 'vue';

const props = defineProps({
  height: {type: Object, default: '100%'},
  width: {type: Object, default: '100%'}
});
const starHorseChartRef = ref();
let ctx = ref();

const init = async () => {
  ctx.value = starHorseChartRef.value.getContext('2d');
};
onMounted(() => {
  init();
});

</script>
<template>
  <div id="container" class="canvas-container">

  </div>
</template>
<style scoped lang="scss">
.canvas-container {
  height: 100%;
  width: 100%;
}
</style>
