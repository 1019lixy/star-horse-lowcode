/**
 * 离线地图渲染器
 *
 * 纯 Canvas 矢量渲染，不依赖外网瓦片
 * 包含：简化世界大陆轮廓 + 经纬度网格 + 标注
 */

/** 墨卡托投影：经纬度 → 像素 */
const lngLatToMercator = (lng: number, lat: number, zoom: number, tileSize: number) => {
    const n = Math.pow(2, zoom);
    const x = ((lng + 180) / 360) * n * tileSize;
    const latRad = (lat * Math.PI) / 180;
    const clampedLat = Math.max(-85, Math.min(85, latRad)); // 避免极点溢出
    const y = ((1 - Math.log(Math.tan(clampedLat) + 1 / Math.cos(clampedLat)) / Math.PI) / 2) * n * tileSize;
    return { x, y };
};

/** 墨卡托逆投影：像素 → 经纬度 */
const mercatorToLngLat = (x: number, y: number, zoom: number, tileSize: number) => {
    const n = Math.pow(2, zoom);
    const lng = (x / (n * tileSize)) * 360 - 180;
    const latRad = Math.atan(Math.sinh(Math.PI * (1 - (2 * y) / (n * tileSize))));
    const lat = (latRad * 180) / Math.PI;
    return { lng, lat };
};

/** 简化世界大陆轮廓（经纬度多边形） */
const CONTINENTS: { name: string; color: string; points: [number, number][] }[] = [
    {
        name: "Asia",
        color: "#E8F5E9",
        points: [
            [26, 40], [30, 35], [35, 32], [40, 28], [45, 25], [50, 25], [55, 25],
            [60, 23], [65, 25], [70, 20], [75, 15], [80, 8], [85, 10], [90, 22],
            [95, 18], [100, 14], [105, 10], [110, 18], [115, 22], [120, 30],
            [125, 35], [130, 35], [135, 35], [140, 40], [145, 45], [140, 50],
            [135, 55], [130, 50], [125, 45], [120, 50], [115, 45], [110, 45],
            [105, 50], [100, 55], [90, 50], [80, 55], [70, 60], [60, 55],
            [50, 50], [40, 45], [30, 45], [26, 40],
        ],
    },
    {
        name: "Europe",
        color: "#E3F2FD",
        points: [
            [-10, 36], [-5, 36], [0, 38], [3, 43], [5, 44], [8, 44], [12, 45],
            [15, 45], [18, 45], [22, 40], [26, 40], [30, 45], [30, 50],
            [28, 55], [25, 58], [20, 60], [15, 62], [10, 64], [5, 62],
            [0, 58], [-5, 55], [-8, 50], [-10, 44], [-10, 36],
        ],
    },
    {
        name: "Africa",
        color: "#FFF3E0",
        points: [
            [-17, 15], [-15, 10], [-10, 5], [-5, 5], [0, 5], [5, 4],
            [10, 2], [10, 0], [12, -5], [15, -10], [20, -15], [25, -20],
            [30, -25], [35, -30], [35, -34], [30, -34], [25, -30],
            [20, -25], [15, -20], [12, -15], [10, -10], [8, -5],
            [5, 0], [0, 5], [-5, 5], [-10, 5], [-15, 10], [-17, 15],
            [-17, 20], [-15, 25], [-12, 30], [-5, 35], [0, 36],
            [5, 37], [10, 37], [12, 33], [15, 30], [20, 25],
            [25, 20], [30, 15], [35, 10], [40, 10], [42, 12],
            [45, 12], [50, 10], [50, 5], [45, 0], [42, -5],
            [40, -10], [38, -15], [35, -20], [33, -25], [35, -30],
            [35, -34], [28, -34], [22, -30], [18, -25], [15, -20],
            [12, -15], [10, -10], [8, -5], [5, 0], [0, 5],
        ],
    },
    {
        name: "NorthAmerica",
        color: "#F3E5F5",
        points: [
            [-170, 65], [-160, 70], [-140, 70], [-130, 65], [-125, 60],
            [-125, 50], [-120, 45], [-115, 40], [-110, 35], [-105, 30],
            [-100, 25], [-95, 20], [-90, 18], [-85, 15], [-80, 10],
            [-75, 10], [-70, 15], [-65, 18], [-60, 20], [-55, 25],
            [-55, 30], [-60, 35], [-65, 40], [-70, 42], [-75, 45],
            [-80, 48], [-85, 50], [-90, 52], [-95, 55], [-100, 58],
            [-105, 60], [-110, 62], [-120, 65], [-130, 68], [-140, 70],
            [-150, 72], [-160, 72], [-170, 65],
        ],
    },
    {
        name: "SouthAmerica",
        color: "#FCE4EC",
        points: [
            [-80, 10], [-75, 10], [-70, 5], [-65, 0], [-60, -5],
            [-55, -10], [-50, -15], [-45, -20], [-40, -25], [-35, -30],
            [-35, -35], [-40, -40], [-45, -45], [-50, -50], [-55, -55],
            [-60, -55], [-65, -50], [-70, -45], [-75, -40], [-75, -35],
            [-70, -30], [-65, -25], [-60, -20], [-55, -15], [-50, -10],
            [-45, -5], [-40, 0], [-35, 5], [-30, 5], [-25, 5],
            [-20, 5], [-15, 5], [-10, 5], [-5, 5], [-70, 5], [-75, 10],
            [-80, 10],
        ],
    },
    {
        name: "Oceania",
        color: "#E0F7FA",
        points: [
            [115, -10], [120, -12], [125, -14], [130, -15], [135, -15],
            [140, -15], [145, -15], [150, -20], [153, -25], [150, -30],
            [145, -35], [140, -38], [135, -35], [130, -32], [125, -30],
            [120, -25], [115, -20], [115, -10],
        ],
    },
];

/** 中国简化轮廓 */
const CHINA: [number, number][] = [
    [73, 40], [80, 45], [85, 48], [90, 45], [95, 42], [100, 40],
    [105, 38], [110, 35], [115, 30], [118, 28], [120, 25], [122, 22],
    [120, 20], [118, 18], [115, 20], [110, 18], [108, 15], [106, 18],
    [104, 20], [102, 22], [100, 22], [98, 25], [95, 28], [90, 28],
    [85, 30], [80, 35], [75, 37], [73, 40],
];

/** 主要城市标注 */
const CITIES: { name: string; lng: number; lat: number }[] = [
    { name: "北京", lng: 116.4, lat: 39.9 },
    { name: "上海", lng: 121.5, lat: 31.2 },
    { name: "广州", lng: 113.3, lat: 23.1 },
    { name: "东京", lng: 139.7, lat: 35.7 },
    { name: "纽约", lng: -74.0, lat: 40.7 },
    { name: "伦敦", lng: -0.1, lat: 51.5 },
    { name: "巴黎", lng: 2.3, lat: 48.9 },
    { name: "莫斯科", lng: 37.6, lat: 55.8 },
    { name: "悉尼", lng: 151.2, lat: -33.9 },
    { name: "开罗", lng: 31.2, lat: 30.0 },
];

/** 渲染离线矢量地图到 Canvas */
export const renderTiles = async (
    canvas: HTMLCanvasElement,
    centerLng: number,
    centerLat: number,
    zoom: number,
): Promise<void> => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const tileSize = 256;

    // 计算视图范围（经纬度）
    const center = lngLatToMercator(centerLng, centerLat, zoom, tileSize);
    const viewLeft = mercatorToLngLat(center.x - w / 2, center.y - h / 2, zoom, tileSize);
    const viewRight = mercatorToLngLat(center.x + w / 2, center.y + h / 2, zoom, tileSize);
    const minLng = viewLeft.lng;
    const maxLng = viewRight.lng;
    const minLat = viewRight.lat; // y 轴反转
    const maxLat = viewLeft.lat;

    // 清除画布
    ctx.clearRect(0, 0, w, h);

    // 海洋背景
    ctx.fillStyle = "#C8E6F5";
    ctx.fillRect(0, 0, w, h);

    // 坐标转换函数
    const toPixel = (lng: number, lat: number) => {
        const m = lngLatToMercator(lng, lat, zoom, tileSize);
        return {
            x: w / 2 + (m.x - center.x),
            y: h / 2 + (m.y - center.y),
        };
    };

    // 绘制经纬度网格
    drawGrid(ctx, w, h, zoom, center, toPixel, minLng, maxLng, minLat, maxLat);

    // 绘制大陆
    for (const continent of CONTINENTS) {
        drawPolygon(ctx, continent.points, continent.color, "#B0BEC5", toPixel);
    }

    // 绘制中国轮廓（高亮）
    if (zoom >= 3) {
        drawPolygon(ctx, CHINA, "#FFF9C4", "#FF8F00", toPixel);
    }

    // 绘制城市标注
    if (zoom >= 4) {
        for (const city of CITIES) {
            if (city.lng < minLng - 5 || city.lng > maxLng + 5 || city.lat < minLat - 5 || city.lat > maxLat + 5) continue;
            const p = toPixel(city.lng, city.lat);
            // 城市点
            ctx.beginPath();
            ctx.arc(p.x, p.y, zoom >= 6 ? 3 : 2, 0, Math.PI * 2);
            ctx.fillStyle = "#E53935";
            ctx.fill();
            // 城市名
            if (zoom >= 5) {
                ctx.font = `${Math.min(12, 8 + zoom)}px sans-serif`;
                ctx.fillStyle = "#333";
                ctx.textAlign = "left";
                ctx.fillText(city.name, p.x + 5, p.y + 3);
            }
        }
    }

    // 绘制赤道和回归线
    drawSpecialLatitudes(ctx, w, toPixel, minLng, maxLng);
};

/** 绘制经纬度网格 */
const drawGrid = (
    ctx: CanvasRenderingContext2D,
    w: number, h: number,
    zoom: number,
    center: { x: number; y: number },
    toPixel: (lng: number, lat: number) => { x: number; y: number },
    minLng: number, maxLng: number, minLat: number, maxLat: number,
) => {
    // 根据缩放级别决定网格密度
    let step: number;
    if (zoom <= 2) step = 30;
    else if (zoom <= 4) step = 15;
    else if (zoom <= 6) step = 10;
    else if (zoom <= 8) step = 5;
    else if (zoom <= 10) step = 2;
    else if (zoom <= 12) step = 1;
    else step = 0.5;

    ctx.strokeStyle = "rgba(100, 150, 200, 0.3)";
    ctx.lineWidth = 0.5;

    // 经线
    const lngStart = Math.floor(minLng / step) * step;
    const lngEnd = Math.ceil(maxLng / step) * step;
    for (let lng = lngStart; lng <= lngEnd; lng += step) {
        const top = toPixel(lng, maxLat + 10);
        const bottom = toPixel(lng, minLat - 10);
        ctx.beginPath();
        ctx.moveTo(top.x, top.y);
        ctx.lineTo(bottom.x, bottom.y);
        ctx.stroke();

        // 经度标注
        if (zoom >= 3) {
            const label = toPixel(lng, Math.min(maxLat - 2, 80));
            ctx.font = "10px monospace";
            ctx.fillStyle = "rgba(0, 80, 150, 0.5)";
            ctx.textAlign = "center";
            ctx.fillText(`${lng}°`, label.x, label.y - 2);
        }
    }

    // 纬线
    const latStart = Math.floor(minLat / step) * step;
    const latEnd = Math.ceil(maxLat / step) * step;
    for (let lat = latStart; lat <= latEnd; lat += step) {
        const left = toPixel(minLng - 10, lat);
        const right = toPixel(maxLng + 10, lat);
        ctx.beginPath();
        ctx.moveTo(left.x, left.y);
        ctx.lineTo(right.x, right.y);
        ctx.stroke();

        // 纬度标注
        if (zoom >= 3) {
            const label = toPixel(minLng + 2, lat);
            ctx.font = "10px monospace";
            ctx.fillStyle = "rgba(0, 80, 150, 0.5)";
            ctx.textAlign = "left";
            ctx.fillText(`${lat}°`, label.x + 2, label.y);
        }
    }
};

/** 绘制特殊纬线（赤道、回归线、极圈） */
const drawSpecialLatitudes = (
    ctx: CanvasRenderingContext2D,
    w: number,
    toPixel: (lng: number, lat: number) => { x: number; y: number },
    minLng: number, maxLng: number,
) => {
    const specialLines = [
        { lat: 0, label: "赤道", color: "rgba(255, 0, 0, 0.25)" },
        { lat: 23.44, label: "北回归线", color: "rgba(255, 165, 0, 0.2)" },
        { lat: -23.44, label: "南回归线", color: "rgba(255, 165, 0, 0.2)" },
    ];

    for (const line of specialLines) {
        const left = toPixel(minLng - 20, line.lat);
        const right = toPixel(maxLng + 20, line.lat);
        ctx.strokeStyle = line.color;
        ctx.lineWidth = 1;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.moveTo(left.x, left.y);
        ctx.lineTo(right.x, right.y);
        ctx.stroke();
        ctx.setLineDash([]);
    }
};

/** 绘制多边形 */
const drawPolygon = (
    ctx: CanvasRenderingContext2D,
    points: [number, number][],
    fillColor: string,
    strokeColor: string,
    toPixel: (lng: number, lat: number) => { x: number; y: number },
) => {
    if (points.length < 3) return;
    ctx.beginPath();
    const first = toPixel(points[0][0], points[0][1]);
    ctx.moveTo(first.x, first.y);
    for (let i = 1; i < points.length; i++) {
        const p = toPixel(points[i][0], points[i][1]);
        ctx.lineTo(p.x, p.y);
    }
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 1;
    ctx.stroke();
};

/** 清除缓存（离线模式无需缓存，保留接口兼容） */
export const clearTileCache = () => { /* no-op */ };

/** 经纬度 → 像素（在 Canvas 内） */
export const lngLatToPixel = (
    lng: number, lat: number,
    centerLng: number, centerLat: number,
    zoom: number,
    canvasWidth: number, canvasHeight: number,
) => {
    const tileSize = 256;
    const center = lngLatToMercator(centerLng, centerLat, zoom, tileSize);
    const point = lngLatToMercator(lng, lat, zoom, tileSize);
    return {
        x: canvasWidth / 2 + (point.x - center.x),
        y: canvasHeight / 2 + (point.y - center.y),
    };
};

/** 像素 → 经纬度 */
export const pixelToLngLat = (
    x: number, y: number,
    centerLng: number, centerLat: number,
    zoom: number,
    canvasWidth: number, canvasHeight: number,
) => {
    const tileSize = 256;
    const center = lngLatToMercator(centerLng, centerLat, zoom, tileSize);
    const px = center.x + (x - canvasWidth / 2);
    const py = center.y + (y - canvasHeight / 2);
    return mercatorToLngLat(px, py, zoom, tileSize);
};
