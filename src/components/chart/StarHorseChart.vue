<script setup lang="ts">
  import { onMounted, ref } from 'vue';

  const props = defineProps({
    height: { type: Object, default: '100%' },
    width: { type: Object, default: '100%' }
  });
  const starHorseChartRef = ref();
  let ctx = ref();
  let isDrawing = ref(false);
  let startX = ref<number>(0);
  let startY = ref<number>(0);
  /**
   * @Event 方法
   * @description: canvas 绘制网格背景
   * */
  const drawGrid1 = (lineColor, lineStepX, lineStepY, bgColor, bgStepX, bgStepY) => {
    let context = ctx.value;
    context.save();
    context.lineWidth = 0.5;
    context.strokeStyle = lineColor;
    context.fillStyle = bgColor;
    context.fillRect(bgStepX, bgStepY, starHorseChartRef.value.width, starHorseChartRef.value.height);
    context.setLineDash([]);
    context.beginPath();
    for (let i = lineStepX + 0.5; i < starHorseChartRef.value.width; i += lineStepX) {
      context.beginPath();
      context.moveTo(i, 0 + 0.5);
      context.lineTo(i, starHorseChartRef.value.height + 0.5);
      context.stroke();
    }
    for (let i = lineStepY + 0.5; i < starHorseChartRef.value.height; i += lineStepY) {
      context.beginPath();
      context.moveTo(0 + 0.5, i);
      context.lineTo(starHorseChartRef.value.width, i);
      context.stroke();
    }
    context.restore();
    context.closePath();
  };
  const drawCycle = () => {
    // 在画布中绘制圆形
    const data = [];
    let context = ctx.value;
    for (let i = 0; i < 10; i++) {
      data.push({
        name: '姓名' + i,
        sex: '性别' + i,
        education: '学历' + i,
        school: '毕业院校' + i,
        address: '地址在什么地方。。。。。' + i
      });
    }
    console.log(data.length);
    let width = 30,
      height = 10;
    let total = height * data.length;
    context.fillStyle = '#ffcc22';
    context.strokeStyle = '#FF0000';
    // context.scale(.5,.5);
    for (let i = 0; i <= 5; i++) {
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(width * i, 0);
      context.lineTo(width * i, total);
      context.closePath();
      context.stroke();
    }
    for (let i = 0; i <= data.length; i++) {
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(0, height * i);
      context.lineTo(150, height * i);
      context.closePath();
      context.stroke();
    }
    // for (let i = 0; i < data.length; i++) {
    //   let temp = data[i];
    //   console.log(temp);
    //   let index = 0;
    //
    //   context.font = "10px Arial";
    //   context.fillText(temp.name, width * index++, i * height + 15);
    //   context.fillText(temp.sex, width * index++, i * height + 15);
    //   context.fillText(temp.education, width * index++, i * height + 15);
    //   context.fillText(temp.school, width * index++, i * height + 15);
    //   context.fillText(temp.address, width * index++, i * height + 15);
    // }
  };
  const resize = () => {
    let container = document.getElementById('container');
    // 获取Canvas元素的实际宽度和高度
    const canvasWidth = container.offsetWidth;
    const canvasHeight = container.offsetHeight;
    // 将Canvas的实际宽度和高度设置为获取到的值
    starHorseChartRef.value.width = canvasWidth;
    starHorseChartRef.value.height = canvasHeight;
    drawCycle();
  };
  const init = async () => {
    ctx.value = starHorseChartRef.value.getContext('2d');
    let ratio = window.devicePixelRatio || 1;
    resize();
    draw();
    // ctx.value.setTransform(ratio, 0, 0, ratio, 0, 0);
    // drawGrid("rgba(238,238,238,0.6)", 10, 10, "#333", 0, 0);
  };
  onMounted(() => {
    init();
    window.onresize = resize;
  });
  const drawGrid = (e, i) => {
    //e表示每两条线的间隔距离值；i颜色值，大格子的颜色和小格子的颜色值不同
    let P = 'rgba(0,0,0,';
    let l = P + i + ')',
      t = 0;
    let context = ctx.value;
    let scale = info.scale || 1;
    context.beginPath();
    //为优化性能，控制只绘制当前画面大小的网格线
    let winInfo = {
      width: starHorseChartRef.value.clientWidth,
      height: starHorseChartRef.value.clientHeight
    };
    let viewMinx = 0;
    let viewMiny = 0;
    let viewMaxx = winInfo.width;
    let viewMaxy = winInfo.height;
    let isDraw = false;
    let windowViewPoints = [];
    windowViewPoints.push({ x: viewMinx, y: viewMiny });
    windowViewPoints.push({ x: viewMaxx, y: viewMaxy });
    windowViewPoints.push({ x: viewMinx, y: viewMaxy });
    windowViewPoints.push({ x: viewMaxx, y: viewMiny });
    let minX = 0,
      maxX = 0,
      minY = 0,
      maxY = 0; //最大、最新 x y值
    let tt: DOMMatrix = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    let n = tt.createSVGMatrix();
    windowViewPoints.forEach((item: any, index) => {
      let point = new DOMPoint(item.x, item.y);
      point.matrixTransform(n.inverse());
      console.log(item, point);
      if (index == 0) {
        maxX = minX = point.x;
        minY = maxY = point.y;
      } else {
        minX = minX > point.x ? point.x : minX;
        maxX = maxX < point.x ? point.x : maxX;
        minY = minY > point.y ? point.y : minY;
        maxY = maxY < point.y ? point.y : maxY;
      }
    });
    console.log(minX, maxX, minY, maxY);
    //纵向线条
    t = 20 * info.scale;
    while (true) {
      console.log(t, Math.abs(t - minX), e, t, minX);
      if (Math.abs(t - minX) <= e || t >= minX) {
        context.moveTo(t, minY);
        context.lineTo(t, maxY);
      }
      t = t + e;
      if (t >= maxX) break;
    }
    //横向线条
    t = 30 * info.scale;
    while (true) {
      if (Math.abs(t - minY) <= e || t >= minY) {
        context.moveTo(minX, t);
        context.lineTo(maxX, t);
      }
      t = t + e;
      if (t >= maxY) break;
    }
    context.closePath();
    context.strokeStyle = l;
    context.lineWidth = 1 / scale;
    context.stroke();
  };
  const draw = () => {
    let scale = info.scale || 1; //获取当前画布缩放比
    let B = 0.05;
    let t = 50;
    let e = 0;
    for (e = 50 * scale; e >= 200; ) {
      e /= 4;
      t = e / scale;
    }
    for (
      ;
      50 > e; //缩小

    ) {
      e *= 4;
      t = e / scale;
    }
    let i = B + ((e - 50) / 150) * (0.07 - B); //颜色值
    ctx.value.clearRect(0, 0, starHorseChartRef.value.width, starHorseChartRef.value.height); //清空画布
    drawGrid(t, i + 0.03); //绘制小格子
    drawGrid(t * 4, 0.21 - i); //绘制大格子
  };
  const onMouseDown = (event: MouseEvent) => {
    isDrawing.value = true;
    startY.value = event.offsetY;
    startX.value = event.offsetX;
  };
  const info = {
    offset: { x: 0, y: 0 },
    scale: 1,
    scaleStep: 0.01,
    minScale: 0.5,
    maxScale: 2
  };
  const getCanvasPostion = (e) => {
    return {
      x: e.offsetX,
      y: e.offsetY
    };
  };
  const onMouseWheel = (e: WheelEvent) => {
    let context = ctx.value;
    context.clearRect(0, 0, starHorseChartRef.value.width, starHorseChartRef.value.height);
    const canvasPosition = getCanvasPostion(e); //获取画布上的事件坐标
    console.log(canvasPosition);
    const realCanvasPosition = {
      //鼠标在画布上的坐标
      x: canvasPosition.x - info.offset.x,
      y: canvasPosition.y - info.offset.y
    };
    // 放缩时产生的偏移量
    const deltaX = (realCanvasPosition.x / info.scale) * info.scaleStep;
    const deltaY = (realCanvasPosition.y / info.scale) * info.scaleStep;
    if (e.wheelDelta > 0 && info.scale < info.maxScale) {
      info.offset.x -= deltaX;
      info.offset.y -= deltaY;
      info.scale += info.scaleStep;
    } else if (e.wheelDelta <= 0 && info.scale > info.minScale) {
      info.offset.x += deltaX;
      info.offset.y += deltaY;
      info.scale -= info.scaleStep;
    }
    context.setTransform(info.scale, 0, 0, info.scale, info.offset.x, info.offset.y);
    draw();
  };
  const onMouseMove = (event: MouseEvent) => {
    if (!isDrawing.value) {
      return;
    }
    // ctx.value.clearRect(0, 0, starHorseChartRef.value.width, starHorseChartRef.value.height);
    // drawCycle();
  };
  const onMouseUp = (event: MouseEvent) => {
    isDrawing.value = false;
  };
</script>
<template>
  <div id="container" class="canvas-container">
    <canvas
      ref="starHorseChartRef"
      @mousedown="onMouseDown"
      @mousemove="onMouseMove"
      @wheel="onMouseWheel"
      @mouseup="onMouseUp"
      style="border: 1px solid #ccc"
    ></canvas>
  </div>
</template>
<style scoped lang="scss">
  .canvas-container {
    height: 100%;
    width: 100%;
  }
</style>
