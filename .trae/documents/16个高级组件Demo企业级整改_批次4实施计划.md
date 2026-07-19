# 16 个高级组件 Demo 企业级整改 - 批次 4 实施计划

## 摘要

承接批次 1/2/3 已完成的工作，本次批次 4 完成**剩余 5 个 C 类 Demo 的企业级整改**：
改写 `MapDemo` / `IotDemo` / `KnowledgeGraphDemo` / `DigitalTwinDemo` / `AiCopilotDemo` 五个 `.vue` 文件，统一采用 `ShDemoToolbar + .demo-stage` 模式占满整个页面，工具栏图标齐全、tooltip 完整、全 i18n 国际化，然后追加批次 4 的 i18n keys 并做浏览器验证。

整改后所有 18 个 tab 将全部完成企业级整改，彻底解决用户反馈的"布局乱、无图标、无提示、不占满、死挤"等问题。

---

## 当前状态分析

### 已完成（批次 1/2/3）

| 工作项 | 状态 |
| --- | --- |
| `src/sample/components/demoTypes.ts`（ShDemoAction/ShDemoToolbarProps/groupActions） | ✅ |
| `src/sample/components/ShDemoToolbar.vue`（声明式工具栏） | ✅ |
| `src/sample/components/useElementHeight.ts`（ResizeObserver 高度追踪） | ✅ |
| `src/components/office/OfficeEditor.vue`（height 默认 100%） | ✅ |
| 批次 1：4 个 Demo（Diagram/Kanban/Pdf/Whiteboard） | ✅ |
| 批次 2：5 个 A 类设计器 Demo（Gantt/Schedule/DocTemplate/EmailTemplate/Etl） | ✅ |
| 批次 3：4 个 B 类单组件 Demo（Pivot/RichText/Office/ApiOrchestrator） | ✅ |
| 批次 1-3 i18n keys（zh_CN + en_US） | ✅ |
| 批次 4：5 个 constants.ts（map/iot/knowledgegraph/digitaltwin/aicopilot） | ✅ |

### 批次 4 待完成（本次实施）

| Demo | 底层组件 | 类型 | 当前问题 |
| --- | --- | --- | --- |
| MapDemo | MapField+MapTrackPlayer+MapHeatmap | C 类多组件 | `<h3>+<p>` 占空间、`:height="380"` 写死、`.demo-tabs { height:620px }` 写死、无 ShDemoToolbar |
| IotDemo | IotAlarmCenter+IotDeviceTopology+IotRealtimeChart | C 类多组件 | `<h3>+<p>` 占空间、`:height="420"` 写死、无 ShDemoToolbar |
| KnowledgeGraphDemo | GraphViewer+GraphQueryBuilder | C 类多组件 | el-tabs 切换不利于企业级查询场景、无 ShDemoToolbar |
| DigitalTwinDemo | DigitalTwinDesigner | C 类单组件 | 无 ShDemoToolbar、无数据生命周期操作、无 toggleAutoSim |
| AiCopilotDemo | AiCopilot | C 类单组件 | 无 ShDemoToolbar、无数据生命周期操作 |

### 底层组件 Props/Events 实测结论（Phase 1 已验证）

| 组件 | height prop | 监听 props? | 根样式 height:100%? | 整改策略 |
| --- | --- | --- | --- | --- |
| MapField | `height?: number` 默认 280 | ❌ 不监听 | ❌（SVG 内部） | 用 `useElementHeight` 动态算像素值传入 |
| MapTrackPlayer | `height?: number` | ❌ 不监听 height | ✅ | 同上 |
| MapHeatmap | `height?: number` | ❌ 不监听 height | ✅ | 同上 |
| IotAlarmCenter | `height?: number` | ✅ 监听 alarms.length | ✅ | 用 `useElementHeight` 动态算像素值传入 |
| IotDeviceTopology | `height?: number` | ❌ 不监听 | ✅ | 同上 |
| IotRealtimeChart | `height?: number` | ✅ 监听 series/config | ✅ | 同上 |
| GraphViewer | 无 height prop | ✅ 监听 graph | ✅ | 直接 `.demo-stage flex:1` 撑满 |
| GraphQueryBuilder | 无 height prop | ❌ 不监听 | ✅ | 同上 |
| DigitalTwinDesigner | `scene?`/`autoSim?` | ✅ 监听 scene，❌ 不监听 autoSim | ✅ | toggleAutoSim 需 `:key` 重挂载 |
| AiCopilot | 无 height prop | ❌ 不监听 | ✅ | `:key` 重挂载 |

### 关键依赖验证

- ✅ `IotAlarm`/`IotDevice`/`IotMetric` 类型从 `@/components/iot`（`types.ts` 经 `export *`）导出
- ✅ `SAMPLE_ALARMS`/`SAMPLE_DEVICES`/`SAMPLE_METRICS` 从 `@/components/iot/constants.ts` 导出
- ✅ `DtScene` 类型 + `DigitalTwinDesigner` 组件从 `@/components/digitaltwin` 导出
- ✅ `AiContext`/`AiConversation`/`AiAction` 类型 + `createAiAction`/`createAiConversation`/`createAiMessage` 函数 + `AiCopilot` 组件从 `@/components/aicopilot` 导出
- ✅ `useElementHeight` 已在 `src/sample/components/useElementHeight.ts` 就绪
- ✅ 批次 4 的 5 个 constants.ts 已就绪（含 SAMPLE_*/ACTIONS/SECONDARY）

---

## 实施方案

### 任务 1：改写 `src/sample/MapDemo.vue`（C 类多组件 - el-tabs）

**目标**：ShDemoToolbar + el-tabs + useElementHeight 动态高度，移除 `<h3>+<p>` 和 `:height="380"` 写死。

**关键改动**：
- 引入 `ShDemoToolbar` + `useElementHeight` + `MAP_ACTIONS`/`MAP_SECONDARY`
- `stageRef` ref 指向 `.demo-stage`，`useElementHeight(stageRef, { offset: 40 })` 扣除 el-tabs header 高度
- `mapKey` ref 用于 loadSample/clear 强制重挂载
- `fieldValue`/`tracks`/`heatPoints` 三个 ref 分别管理三个 tab 的数据
- 工具栏 action 处理：loadSample/clear/exportJson/help
- exportJson 导出 `{ fieldValue, tracks, heatPoints, bounds: BEIJING_BOUNDS }` 整体 JSON
- 移除 `<h3>+<p>`、`.tab-desc`、`:height="380"`、`.demo-tabs { height:620px }`

**template 结构**：
```vue
<div class="demo-root">
    <ShDemoToolbar ... />
    <div class="demo-stage" ref="stageRef">
        <el-tabs v-model="activeTab" type="border-card" class="sub-tabs">
            <el-tab-pane :label="t('advanced.map.tab.field')" name="field">
                <MapField :key="`f-${mapKey}`" v-model="fieldValue" :bounds="BEIJING_BOUNDS" :height="contentHeight" />
            </el-tab-pane>
            <el-tab-pane :label="t('advanced.map.tab.track')" name="track">
                <MapTrackPlayer :key="`t-${mapKey}`" :tracks="tracks" :bounds="BEIJING_BOUNDS" :height="contentHeight" />
            </el-tab-pane>
            <el-tab-pane :label="t('advanced.map.tab.heatmap')" name="heatmap">
                <MapHeatmap :key="`h-${mapKey}`" :points="heatPoints" :bounds="BEIJING_BOUNDS" :height="contentHeight" />
            </el-tab-pane>
        </el-tabs>
    </div>
</div>
```

**style 关键**：
```css
.demo-root { display: flex; flex-direction: column; height: 100%; width: 100%; overflow: hidden; background: var(--el-bg-color-page); }
.demo-stage { flex: 1; min-height: 0; overflow: hidden; display: flex; }
.sub-tabs { height: 100%; display: flex; flex-direction: column; width: 100%; }
.sub-tabs :deep(.el-tabs__content) { flex: 1; overflow: hidden; }
.sub-tabs :deep(.el-tab-pane) { height: 100%; }
```

### 任务 2：改写 `src/sample/IotDemo.vue`（C 类多组件 - el-tabs）

**目标**：ShDemoToolbar + el-tabs + useElementHeight 动态高度，移除 `<h3>+<p>` 和 `:height="420"` 写死。

**关键改动**：
- 引入 `ShDemoToolbar` + `useElementHeight` + `IOT_ACTIONS`/`IOT_SECONDARY` + `EMPTY_ALARMS`/`EMPTY_DEVICES`/`EMPTY_METRICS`
- `stageRef` ref + `useElementHeight(stageRef, { offset: 40 })`
- `iotKey` ref 用于 loadSample/clear 强制重挂载
- `alarms`/`devices`/`metrics` 三个 ref 分别管理三个 tab 数据，初始 `structuredClone(SAMPLE_*)`
- 工具栏 action 处理：loadSample/clear/exportJson/help
- exportJson 导出 `{ alarms, devices, metrics }` 整体 JSON
- 移除 `<h3>+<p>`、`:height="420"`、`handleSelectDevice` 改为 `@select` 内联或保留
- IotRealtimeChart 的 config 内联对象保持不变

**template 结构**：
```vue
<div class="demo-root">
    <ShDemoToolbar ... />
    <div class="demo-stage" ref="stageRef">
        <el-tabs v-model="activeTab" type="border-card" class="sub-tabs">
            <el-tab-pane :label="t('advanced.iot.tab.topology')" name="topology">
                <IotDeviceTopology :key="`d-${iotKey}`" :devices="devices" :height="contentHeight" @select="handleSelectDevice" />
            </el-tab-pane>
            <el-tab-pane :label="t('advanced.iot.tab.alarm')" name="alarm">
                <IotAlarmCenter :key="`a-${iotKey}`" :alarms="alarms" :height="contentHeight" />
            </el-tab-pane>
            <el-tab-pane :label="t('advanced.iot.tab.chart')" name="chart">
                <IotRealtimeChart :key="`c-${iotKey}`" :series="metrics" :config="chartConfig" :height="contentHeight" />
            </el-tab-pane>
        </el-tabs>
    </div>
</div>
```

### 任务 3：改写 `src/sample/KnowledgeGraphDemo.vue`（C 类多组件 - 左右分栏）

**目标**：ShDemoToolbar + 左右分栏（GraphViewer 左 flex:1 + GraphQueryBuilder 右 380px fixed），移除 el-tabs。

**关键改动**：
- 引入 `ShDemoToolbar` + `KG_ACTIONS`/`KG_SECONDARY` + `SAMPLE_GRAPH`/`EMPTY_GRAPH`/`createSampleTemplates`
- `kgKey` ref 用于 loadSample/clear 强制重挂载
- `graph` ref 管理 KgGraph 数据，`templates` ref 管理 KgQueryTemplate[]
- 工具栏 action 处理：loadSample/clear/exportJson/save/help
- exportJson 导出 `{ graph, templates }` 整体 JSON
- 移除 el-tabs，改为左右分栏

**template 结构**：
```vue
<div class="demo-root">
    <ShDemoToolbar ... />
    <div class="demo-stage kg-split">
        <div class="split-left">
            <GraphViewer :key="`v-${kgKey}`" :graph="graph" :auto-layout="true" @select-node="handleSelectNode" />
        </div>
        <div class="split-right">
            <GraphQueryBuilder :key="`q-${kgKey}`" :graph="graph" :templates="templates" @select-node="handleSelectNode" />
        </div>
    </div>
</div>
```

**style 关键**：
```css
.demo-root { display: flex; flex-direction: column; height: 100%; width: 100%; overflow: hidden; background: var(--el-bg-color-page); }
.demo-stage { flex: 1; min-height: 0; overflow: hidden; }
.kg-split { display: flex; gap: 8px; padding: 8px; }
.split-left { flex: 1; min-width: 0; overflow: hidden; }
.split-right { width: 380px; flex-shrink: 0; overflow: hidden; }
```

### 任务 4：改写 `src/sample/DigitalTwinDemo.vue`（C 类单组件）

**目标**：ShDemoToolbar + :key + toggleAutoSim 图标动态切换。

**关键改动**：
- 引入 `ShDemoToolbar` + `DT_ACTIONS`/`DT_SECONDARY` + `SAMPLE_DT_SCENE`/`EMPTY_DT_SCENE` + `getAutoSimIcon`
- `dtKey` ref 用于 loadSample/clear/toggleAutoSim 强制重挂载（因 DigitalTwinDesigner 不监听 autoSim）
- `scene` ref 管理 DtScene 数据
- `autoSim` ref（boolean，初始 true）管理模拟开关
- `secondaryActions` computed 中 `toggleAutoSim` 项的 `icon` 用 `getAutoSimIcon(autoSim.value)` 动态切换、`active: autoSim.value`
- 工具栏 action 处理：loadSample/clear/exportJson/save/toggleAutoSim/help
- exportJson 导出 `scene.value` JSON
- 保留 `handleSelectEntity`

**template 结构**：
```vue
<div class="demo-root">
    <ShDemoToolbar ... />
    <div class="demo-stage">
        <DigitalTwinDesigner
            :key="dtKey"
            :scene="scene"
            :auto-sim="autoSim"
            @select-entity="handleSelectEntity"
        />
    </div>
</div>
```

### 任务 5：改写 `src/sample/AiCopilotDemo.vue`（C 类单组件）

**目标**：ShDemoToolbar + :key。

**关键改动**：
- 引入 `ShDemoToolbar` + `AI_ACTIONS`/`AI_SECONDARY` + `SAMPLE_CONTEXT`/`EMPTY_CONTEXT`/`createSampleConversations`
- `aiKey` ref 用于 loadSample/clear 强制重挂载
- `context` ref 管理 AiContext，`conversations` ref 管理 AiConversation[]
- 工具栏 action 处理：loadSample/clear/exportJson/help
- exportJson 导出 `{ context, conversations }` 整体 JSON
- 保留 `handleApplyAction`/`handleSend`

**template 结构**：
```vue
<div class="demo-root">
    <ShDemoToolbar ... />
    <div class="demo-stage">
        <AiCopilot
            :key="aiKey"
            :conversations="conversations"
            :context="context"
            @apply-action="handleApplyAction"
            @send="handleSend"
        />
    </div>
</div>
```

### 任务 6：追加 i18n keys（zh_CN + en_US）

在 `src/lang/zh_CN.ts` 第 2841 行 `};` 之前追加批次 4 的 i18n keys（约 50 个），在 `src/lang/en_US.ts` 对应位置追加英文翻译。

**key 结构**（5 个模块）：

```
// map（10 个）
advanced.map.title
advanced.map.toolbar.loadSample/clear/exportJson/help
advanced.map.message.loaded/cleared/exported/helpHint
advanced.map.tab.field/track/heatmap

// iot（11 个）
advanced.iot.title
advanced.iot.toolbar.loadSample/clear/exportJson/help
advanced.iot.message.loaded/cleared/exported/helpHint
advanced.iot.tab.topology/alarm/chart

// kg（9 个）
advanced.kg.title
advanced.kg.toolbar.loadSample/clear/exportJson/save/help
advanced.kg.message.loaded/cleared/exported/saved/helpHint

// digitaltwin（11 个）
advanced.digitaltwin.title
advanced.digitaltwin.toolbar.loadSample/clear/exportJson/save/toggleAutoSim/help
advanced.digitaltwin.message.loaded/cleared/exported/saved/simOn/simOff/helpHint

// aicopilot（9 个）
advanced.aicopilot.title
advanced.aicopilot.toolbar.loadSample/clear/exportJson/help
advanced.aicopilot.message.loaded/cleared/exported/helpHint
```

**中文文案**（示例）：
- `advanced.map.title`: "地图 GIS MapField/MapTrackPlayer/MapHeatmap"
- `advanced.map.message.helpHint`: "坐标选点：点击地图或弹窗精确选择；轨迹回放：播放/暂停/拖拽进度/倍速切换；热力图：调节半径与强度"
- `advanced.digitaltwin.toolbar.toggleAutoSim`: "自动模拟"
- `advanced.digitaltwin.message.simOn`: "已开启自动模拟"
- `advanced.digitaltwin.message.simOff`: "已停止自动模拟"

英文翻译对应。

### 任务 7：最终验证

使用 `browser_use` agent 验证 5 个新 tab：
1. 访问 `http://localhost:4000/`
2. 切到 "高级组件库" tab
3. 依次点击 Map / Iot / KnowledgeGraph / DigitalTwin / AiCopilot 五个 tab
4. 验证：
   - ShDemoToolbar 显示在顶部，按钮有图标、有 tooltip
   - 内容区占满整个 tab 面板（无下方空白、无死挤）
   - loadSample/clear/exportJson 按钮 click 有 ElMessage 反馈
   - DigitalTwin 的 toggleAutoSim 按钮图标随 active 切换
   - KnowledgeGraph 左右分栏布局正确
   - Map/Iot 三个 sub-tab 切换正常，子组件高度自适应

---

## 决策说明

1. **Map/Iot 保留内部 el-tabs**：底层三个组件功能独立，el-tabs 切换比左右分栏更符合使用场景。但移除 `:height` 写死，用 `useElementHeight` 动态算像素值。

2. **KnowledgeGraph 改为左右分栏**：GraphViewer（图谱可视化）和 GraphQueryBuilder（查询构建）企业级场景下需同时可见——左侧浏览图谱、右侧构建查询，比 el-tabs 切换更高效。

3. **DigitalTwin toggleAutoSim 用 :key 重挂载**：DigitalTwinDesigner 不监听 autoSim prop 变化，仅监听 scene。toggleAutoSim 时 `dtKey++` 强制重挂载，`autoSim` ref 的新值通过 props 传入新实例。

4. **constants.ts 中 MAP/IOT_SECONDARY 只有 help**：底层 Map/Iot 组件不直接支持 toggleLayer/fitView/toggleAutoRefresh 等功能，添加后会变成空操作（过家家）。保持简洁，只保留实际可用的 loadSample/clear/exportJson + help，符合用户"不要过家家"的要求。

5. **exportJson 导出整体数据**：MapDemo 导出 `{ fieldValue, tracks, heatPoints, bounds }`，IotDemo 导出 `{ alarms, devices, metrics }`，KnowledgeGraphDemo 导出 `{ graph, templates }`，DigitalTwinDemo 导出 `scene`，AiCopilotDemo 导出 `{ context, conversations }`。每个 Demo 的数据结构不同，统一用 JSON.stringify(data, null, 2) 美化输出。

6. **保留 `defineExpose({ loadData })`**：所有 5 个 Demo 都暴露 loadData 方法，供未来后端 API 调用接入（与批次 3 一致）。

7. **i18n key 用 `as any` 绕过编译期检查**：i18n 函数签名要求 `keyof typeof zh_CN`，新增 key 在 ts 类型推导完成前会报错。用 `i18n("advanced.xxx" as any)` 与批次 3 保持一致。

---

## 实施顺序

1. ✅ 任务 1：改写 `MapDemo.vue`
2. ✅ 任务 2：改写 `IotDemo.vue`
3. ✅ 任务 3：改写 `KnowledgeGraphDemo.vue`
4. ✅ 任务 4：改写 `DigitalTwinDemo.vue`
5. ✅ 任务 5：改写 `AiCopilotDemo.vue`
6. ✅ 任务 6：追加 i18n keys（zh_CN + en_US）
7. ✅ 任务 7：browser_use 验证 5 个 tab

---

## 验证步骤

1. **编译验证**：改写完成后，Vite HMR 应自动同步，无 TypeScript 编译错误。
2. **浏览器验证**：
   - 访问 `http://localhost:4000/`
   - 切到 "高级组件库" tab
   - 依次验证 Map/Iot/KnowledgeGraph/DigitalTwin/AiCopilot 五个 tab
   - 检查项：ShDemoToolbar 显示、图标齐全、tooltip 完整、内容占满、按钮反馈、布局协调
3. **回归验证**：批次 1/2/3 的 13 个 tab 不受影响（未修改其文件）。

---

## 风险与缓解

1. **IotRealtimeChart config 内联对象**：原 Demo 用 `:config="{ title: '环境监测', unit: '', refreshInterval: 1500, windowSize: 30 }"`。改写时保持原样，避免引入新问题。

2. **Map/Iot 子组件不监听 height 变化**：`useElementHeight` 的 ResizeObserver 会触发 `contentHeight` ref 变化，但子组件不监听 height prop。这意味着容器尺寸变化时，子组件内部画布不会重绘。
   - **缓解**：`:key="xxxKey"` 包含 `contentHeight` 不必要——初始挂载时 `useElementHeight` 已在 `onMounted` 中 update 一次，传入的初始像素值即为容器实际高度。容器后续尺寸变化（如窗口 resize）时画布不会重绘，但这是底层组件的已知限制，不在批次 4 整改范围内。

3. **DigitalTwinDesigner 重挂载开销**：toggleAutoSim 会触发整个 3D 视口重挂载（Three.js 场景重建）。这可能会有短暂卡顿。
   - **缓解**：这是底层组件的设计限制（不监听 autoSim）。重挂载是唯一可靠的方式。如果用户反馈卡顿，可在后续优化 DigitalTwinDesigner 增加 autoSim watch。

4. **i18n key 缺失降级**：`i18n()` 对缺失 key 返回 undefined，ShDemoToolbar 中已降级为返回 key 本身。新增 key 在 zh_CN/en_US 中都添加后不会缺失。
