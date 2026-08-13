/**
 * IoT 实时图表渲染器（纯 Canvas 实现，无第三方依赖）
 */
import type { IotChartConfig, IotChartSeries } from "../types";

/** 坐标轴边距 */
const PADDING = { top: 20, right: 24, bottom: 36, left: 56 };
/** 网格颜色 */
const GRID_COLOR = "rgba(180, 180, 180, 0.25)";
/** 轴标签颜色 */
const AXIS_LABEL_COLOR = "rgba(96, 98, 102, 0.95)";
/** 轴线颜色 */
const AXIS_COLOR = "rgba(144, 147, 153, 0.6)";

/** 格式化时间戳为 HH:mm:ss */
export const formatTime = (timestamp: number): string => {
  const d = new Date(timestamp);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

/**
 * 计算友好的坐标轴刻度
 * @param min 数据最小值
 * @param max 数据最大值
 * @param ticks 期望刻度数
 */
export const niceScale = (
  min: number,
  max: number,
  ticks = 5,
): { niceMin: number; niceMax: number; step: number } => {
  if (min === max) {
    // 退化处理：常量数据给一个上下浮动空间
    const pad = Math.abs(min) > 0 ? Math.abs(min) * 0.2 : 1;
    min = min - pad;
    max = max + pad;
  }
  const range = max - min;
  const roughStep = range / Math.max(1, ticks);
  const magnitude = Math.pow(10, Math.floor(Math.log10(roughStep)));
  const normalized = roughStep / magnitude;
  let niceStep: number;
  if (normalized < 1.5) niceStep = 1 * magnitude;
  else if (normalized < 3) niceStep = 2 * magnitude;
  else if (normalized < 7) niceStep = 5 * magnitude;
  else niceStep = 10 * magnitude;
  const niceMin = Math.floor(min / niceStep) * niceStep;
  const niceMax = Math.ceil(max / niceStep) * niceStep;
  if (niceMax <= niceMin) {
    return { niceMin, niceMax: niceMin + niceStep, step: niceStep };
  }
  return { niceMin, niceMax, step: niceStep };
};

/**
 * 渲染多线时序图
 * @param ctx 2D 绘图上下文
 * @param series 系列数据
 * @param config 图表配置
 * @param width 画布宽
 * @param height 画布高
 */
export const renderLineChart = (
  ctx: CanvasRenderingContext2D,
  series: IotChartSeries[],
  config: IotChartConfig,
  width: number,
  height: number,
): void => {
  ctx.clearRect(0, 0, width, height);
  // 背景
  ctx.fillStyle = "rgba(250, 250, 252, 0.6)";
  ctx.fillRect(0, 0, width, height);

  const chartLeft = PADDING.left;
  const chartTop = PADDING.top;
  const chartRight = width - PADDING.right;
  const chartBottom = height - PADDING.bottom;
  const chartWidth = Math.max(10, chartRight - chartLeft);
  const chartHeight = Math.max(10, chartBottom - chartTop);

  // 仅渲染可见系列
  const visibleSeries = series.filter(
    (s) => s.visible !== false && s.data.length > 0,
  );

  // 计算 Y 轴范围
  let dataMin = Number.POSITIVE_INFINITY;
  let dataMax = Number.NEGATIVE_INFINITY;
  let minTs = Number.POSITIVE_INFINITY;
  let maxTs = Number.NEGATIVE_INFINITY;
  for (const s of visibleSeries) {
    for (const p of s.data) {
      if (p.value < dataMin) dataMin = p.value;
      if (p.value > dataMax) dataMax = p.value;
      if (p.timestamp < minTs) minTs = p.timestamp;
      if (p.timestamp > maxTs) maxTs = p.timestamp;
    }
  }
  const hasData =
    visibleSeries.length > 0 && dataMin !== Number.POSITIVE_INFINITY;
  if (config.yMin !== undefined) dataMin = Math.min(dataMin, config.yMin);
  if (config.yMax !== undefined) dataMax = Math.max(dataMax, config.yMax);
  if (!hasData) {
    dataMin = 0;
    dataMax = 1;
    minTs = Date.now() - 60000;
    maxTs = Date.now();
  }
  const yScale = niceScale(dataMin, dataMax, 5);
  if (minTs === maxTs) {
    minTs = minTs - 60000;
    maxTs = maxTs + 1000;
  }

  // 1. 绘制网格 + Y 轴刻度
  ctx.strokeStyle = GRID_COLOR;
  ctx.fillStyle = AXIS_LABEL_COLOR;
  ctx.lineWidth = 1;
  ctx.font = "11px Consolas, monospace";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  const yTickCount = Math.round(
    (yScale.niceMax - yScale.niceMin) / yScale.step,
  );
  for (let i = 0; i <= yTickCount; i++) {
    const v = yScale.niceMin + i * yScale.step;
    const y =
      chartBottom -
      ((v - yScale.niceMin) / (yScale.niceMax - yScale.niceMin)) * chartHeight;
    ctx.beginPath();
    ctx.moveTo(chartLeft, y);
    ctx.lineTo(chartRight, y);
    ctx.stroke();
    ctx.fillText(formatNumber(v), chartLeft - 6, y);
  }

  // 2. 绘制 X 轴时间刻度（约 6 个刻度）
  const xTickCount = 6;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  for (let i = 0; i <= xTickCount; i++) {
    const t = minTs + ((maxTs - minTs) * i) / xTickCount;
    const x = chartLeft + (chartWidth * i) / xTickCount;
    ctx.strokeStyle = GRID_COLOR;
    ctx.beginPath();
    ctx.moveTo(x, chartTop);
    ctx.lineTo(x, chartBottom);
    ctx.stroke();
    ctx.fillStyle = AXIS_LABEL_COLOR;
    ctx.fillText(formatTime(t), x, chartBottom + 6);
  }

  // 3. 绘制轴线
  ctx.strokeStyle = AXIS_COLOR;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(chartLeft, chartTop);
  ctx.lineTo(chartLeft, chartBottom);
  ctx.lineTo(chartRight, chartBottom);
  ctx.stroke();

  // 4. 绘制各系列折线
  const xOf = (ts: number) =>
    chartLeft + ((ts - minTs) / (maxTs - minTs || 1)) * chartWidth;
  const yOf = (v: number) =>
    chartBottom -
    ((v - yScale.niceMin) / (yScale.niceMax - yScale.niceMin || 1)) *
      chartHeight;

  for (const s of visibleSeries) {
    ctx.strokeStyle = s.color;
    ctx.fillStyle = s.color;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    const pts = s.data;
    for (let i = 0; i < pts.length; i++) {
      const x = xOf(pts[i].timestamp);
      const y = yOf(pts[i].value);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    // 末端数据点高亮
    if (pts.length > 0) {
      const last = pts[pts.length - 1];
      const x = xOf(last.timestamp);
      const y = yOf(last.value);
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 5. 绘制图例（右上角）
  drawLegend(ctx, visibleSeries, chartRight, chartTop);
  // 6. 标题 + 单位
  if (config.title) {
    ctx.fillStyle = "rgba(48, 49, 51, 0.95)";
    ctx.font = "bold 13px sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(config.title, chartLeft, 4);
  }
  if (config.unit) {
    ctx.fillStyle = AXIS_LABEL_COLOR;
    ctx.font = "11px sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(
      `(${config.unit})`,
      chartLeft + (config.title ? ctx.measureText(config.title).width + 8 : 0),
      6,
    );
  }
};

/** 绘制图例 */
const drawLegend = (
  ctx: CanvasRenderingContext2D,
  series: IotChartSeries[],
  right: number,
  top: number,
): void => {
  ctx.font = "11px sans-serif";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  let y = top + 8;
  const x = right;
  for (const s of series) {
    ctx.fillStyle = s.color;
    ctx.fillRect(x - 80, y - 5, 10, 10);
    ctx.fillStyle = "rgba(48, 49, 51, 0.95)";
    const label = s.name.length > 10 ? s.name.slice(0, 10) + "…" : s.name;
    ctx.fillText(label, x - 12, y);
    y += 16;
  }
};

/** 格式化数值，避免过长小数 */
const formatNumber = (v: number): string => {
  if (Math.abs(v) >= 1000) return v.toFixed(0);
  if (Math.abs(v) >= 10) return v.toFixed(1);
  return v.toFixed(2);
};
