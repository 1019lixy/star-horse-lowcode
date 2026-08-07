<script setup lang="ts" name="DtViewport">
/**
 * 数字孪生 - 3D 视口（TresJS 声明式）
 *
 * 核心转变：
 *  - 命令式 new Mesh()/scene.add() → 声明式 <TresMesh v-for>
 *  - 手动 syncEntitiesToScene → Vue 响应式自动同步
 *  - 手动 Raycaster → TresJS @click/@pointermove 事件
 *  - 手动 TransformControls → @tresjs/cientos <TransformControls>
 *  - 手动 RAF 循环 → useLoop
 */
import {computed, onBeforeUnmount, ref, shallowRef} from "vue";
import {TresCanvas} from "@tresjs/core";
import {OrbitControls, TransformControls} from "@tresjs/cientos";
import {Color, type Object3D,} from "three";
import {ShSvgIcon} from "@/components/shared";
import {dtApp, SIGNAL_NAMES, useAddSignal, useDispatchSignal} from "../core/DtApp";
import type {DtEntity, DtPoint3D, DtSize3D, DtViewportMode} from "../types";

const props = withDefaults(
    defineProps<{
      entities: DtEntity[];
      mode?: DtViewportMode;
      transformMode?: "translate" | "rotate" | "scale";
      showGrid?: boolean;
      showAxes?: boolean;
    }>(),
    {
      mode: "view",
      transformMode: "translate",
      showGrid: true,
      showAxes: true,
    },
);

const emit = defineEmits<{
  (e: "ready"): void;
  (e: "select-entity", id: string | null): void;
  (e: "entity-transform", entityId: string, position: DtPoint3D, size: DtSize3D): void;
  (e: "entity-transform-end", entityId: string): void;
  (e: "context-menu", x: number, y: number, entityId: string | null): void;
}>();

/* ----------------------- 状态 ----------------------- */
const isEditMode = computed(() => props.mode === "edit");
const selectedId = ref<string | null>(null);

// TransformControls 绑定的目标对象（shallowRef 避免 Three.js 对象被深度代理）
const transformTarget = shallowRef<Object3D | null>(null);
// TransformControls 的 key（切换模式时强制重建）
const transformKey = ref(0);

// 场景中所有 Object3D 的 ref 映射（entityId → Object3D）
const meshRefs = new Map<string, Object3D>();

// 临时变换状态（拖拽中记录初始值）
const transformSnapshot = ref<{ id: string; position: DtPoint3D; size: DtSize3D } | null>(null);

/* ----------------------- 状态颜色映射 ----------------------- */
const STATUS_COLORS: Record<string, number> = {
  normal: 0x52c41a,
  warning: 0xfaad14,
  alarm: 0xff4d4f,
  offline: 0x8c8c8c,
};

const getEntityColor = (entity: DtEntity): number => {
  if (entity.status === "offline") return STATUS_COLORS.offline;
  return STATUS_COLORS[entity.status] ?? new Color(entity.color).getHex();
};

/* ----------------------- 实体几何参数计算 ----------------------- */
const getGeometryArgs = (entity: DtEntity): [number, number] | [number, number, number] | [number, number, number, number] => {
  const s = entity.size;
  switch (entity.type) {
    case "cube":
      return [s.width || 60, s.height || 60, s.depth || 60];
    case "cylinder":
      return [s.radius || 30, s.height || 80, 32];
    case "sphere":
      return [s.radius || 25, 32, 32];
    case "plane":
      return [s.width || 200, s.depth || 200];
    default:
      return [s.width || 60, s.height || 60, s.depth || 60];
  }
};

/* ----------------------- 信号监听 ----------------------- */
// 选中实体变化 → attach TransformControls
useAddSignal(SIGNAL_NAMES.objectSelected, (entity: DtEntity | null) => {
  selectedId.value = entity?.id ?? null;
  if (entity && isEditMode.value) {
    const obj = meshRefs.get(entity.id);
    if (obj) {
      transformTarget.value = obj;
      transformKey.value++;
    }
  } else {
    transformTarget.value = null;
  }
});

useAddSignal(SIGNAL_NAMES.objectDeselected, () => {
  selectedId.value = null;
  transformTarget.value = null;
});

// 变换模式变化
useAddSignal(SIGNAL_NAMES.transformModeChanged, (mode: string) => {
  // 通过 key 变化触发 TransformControls 重建
  transformKey.value++;
});

// 对象变化 → 更新选中标记
useAddSignal(SIGNAL_NAMES.objectChanged, (entity: DtEntity) => {
  if (selectedId.value !== entity.id) {
    selectedId.value = entity.id;
  }
});

/* ----------------------- 交互处理 ----------------------- */
const handleClick = (entity: DtEntity, event: any): void => {
  if (event?.ctrlKey || event?.metaKey) {
    // 多选（暂只单选）
    return;
  }
  dtApp.select(entity.id);
  emit("select-entity", entity.id);
};

const handleContextMenu = (entity: DtEntity | null, event: PointerEvent): void => {
  event.preventDefault();
  const id = entity?.id ?? null;
  if (id) {
    dtApp.select(id);
    emit("select-entity", id);
  }
  emit("context-menu", event.clientX, event.clientY, id);
};

const handleCanvasContextMenu = (event: PointerEvent): void => {
  event.preventDefault();
  emit("context-menu", event.clientX, event.clientY, null);
};

// TransformControls 拖拽开始
const handleTransformStart = (): void => {
  if (!selectedId.value) return;
  const entity = dtApp.findEntity(selectedId.value);
  if (!entity) return;
  transformSnapshot.value = {
    id: entity.id,
    position: {...entity.position},
    size: {...entity.size},
  };
};

// TransformControls 拖拽中（实时派发）
const handleTransformChange = (): void => {
  if (!transformTarget.value || !selectedId.value) return;
  const obj = transformTarget.value;
  const entity = dtApp.findEntity(selectedId.value);
  if (!entity) return;
  const newPosition = {x: obj.position.x, y: obj.position.y, z: obj.position.z};
  // 实时派发（不进历史栈）
  emit("entity-transform", entity.id, newPosition, {...entity.size});
};

// TransformControls 拖拽结束 → 提交命令
const handleTransformEnd = (): void => {
  if (!transformTarget.value || !selectedId.value || !transformSnapshot.value) return;
  const obj = transformTarget.value;
  const entity = dtApp.findEntity(selectedId.value);
  if (!entity) return;
  const newPos = {x: obj.position.x, y: obj.position.y, z: obj.position.z};
  // 更新实体数据
  entity.position = {...newPos};
  // 派发结束信号
  emit("entity-transform-end", entity.id);
  useDispatchSignal(SIGNAL_NAMES.objectChanged, entity);
  transformSnapshot.value = null;
};

/* ----------------------- 模式切换 ----------------------- */
const modeList: Array<{ value: DtViewportMode; label: string; icon: string }> = [
  {value: "view", label: "查看", icon: "eye"},
  {value: "edit", label: "编辑", icon: "edit"},
  {value: "measure", label: "测量", icon: "ruler"},
  {value: "annotation", label: "标注", icon: "location"},
  {value: "inspection", label: "巡检", icon: "monitor"},
];

const handleModeChange = (m: DtViewportMode): void => {
  useDispatchSignal(SIGNAL_NAMES.viewportModeChanged, m);
  if (m !== "edit") {
    transformTarget.value = null;
  }
};

/* ----------------------- 暴露方法 ----------------------- */
const flyTo = (pos: DtPoint3D, target: DtPoint3D, durationMs = 1000): void => {
  // TODO: 通过 OrbitControls ref 调用
  void pos;
  void target;
  void durationMs;
};

const setTransformMode = (mode: "translate" | "rotate" | "scale"): void => {
  useDispatchSignal(SIGNAL_NAMES.transformModeChanged, mode);
};

defineExpose({
  flyTo,
  setTransformMode,
  selectedId,
});

onBeforeUnmount(() => {
  meshRefs.clear();
  transformTarget.value = null;
});

emit("ready");
</script>

<template>
  <div class="dt-viewport" @contextmenu="handleCanvasContextMenu">
    <!-- 模式切换按钮组 -->
    <div class="mode-bar">
      <button
          v-for="m in modeList"
          :key="m.value"
          :class="['mode-btn', { active: mode === m.value }]"
          :title="m.label"
          @click="handleModeChange(m.value)"
      >
        <ShSvgIcon :name="m.icon" size="14px"/>
        <span>{{ m.label }}</span>
      </button>
    </div>

    <!-- TresCanvas 声明式 3D 场景 -->
    <TresCanvas
        clear-color="#0a0e17"
        shadows
        :window-size="false"
    >
      <!-- 透视相机 -->
      <TresPerspectiveCamera :position="[300, 300, 300]" :fov="45" :near="0.1" :far="10000"/>

      <!-- 轨道控制 -->
      <OrbitControls
          :enable-damping="true"
          :damping-factor="0.08"
          :min-distance="50"
          :max-distance="3000"
          :enable-pan="true"
      />

      <!-- 光照 -->
      <TresAmbientLight :intensity="0.6"/>
      <TresDirectionalLight
          :position="[200, 400, 200]"
          :intensity="1.2"
          cast-shadow
      />

      <!-- 网格 -->
      <TresGridHelper
          v-if="showGrid"
          :args="[2000, 50, 0x1a2030, 0x141821]"
          :position="[0, 0, 0]"
      />

      <!-- 坐标轴 -->
      <TresAxesHelper v-if="showAxes" :args="[200]"/>

      <!-- 实体列表（声明式渲染） -->
      <TresGroup
          v-for="entity in entities"
          :key="entity.id"
          :position="[entity.position.x, entity.position.y, entity.position.z]"
          :visible="entity.visible !== false"
          @click="(e: any) => handleClick(entity, e)"
          @contextmenu="(e: any) => handleContextMenu(entity, e)"
      >
        <!-- Cube -->
        <TresMesh
            v-if="entity.type === 'cube'"
            :ref="(el: any) => { if (el?.object) meshRefs.set(entity.id, el.object as Object3D) }"
            cast-shadow
            receive-shadow
        >
          <TresBoxGeometry :args="getGeometryArgs(entity)"/>
          <TresMeshStandardMaterial
              :color="`#${getEntityColor(entity).toString(16).padStart(6, '0')}`"
              :emissive="selectedId === entity.id ? '#ff6600' : '#000000'"
              :emissive-intensity="selectedId === entity.id ? 0.3 : 0"
          />
        </TresMesh>

        <!-- Cylinder -->
        <TresMesh
            v-else-if="entity.type === 'cylinder'"
            :ref="(el: any) => { if (el?.object) meshRefs.set(entity.id, el.object as Object3D) }"
            cast-shadow
            receive-shadow
        >
          <TresCylinderGeometry :args="getGeometryArgs(entity)"/>
          <TresMeshStandardMaterial
              :color="`#${getEntityColor(entity).toString(16).padStart(6, '0')}`"
              :emissive="selectedId === entity.id ? '#ff6600' : '#000000'"
              :emissive-intensity="selectedId === entity.id ? 0.3 : 0"
          />
        </TresMesh>

        <!-- Sphere -->
        <TresMesh
            v-else-if="entity.type === 'sphere'"
            :ref="(el: any) => { if (el?.object) meshRefs.set(entity.id, el.object as Object3D) }"
            cast-shadow
            receive-shadow
        >
          <TresSphereGeometry :args="getGeometryArgs(entity)"/>
          <TresMeshStandardMaterial
              :color="`#${getEntityColor(entity).toString(16).padStart(6, '0')}`"
              :emissive="selectedId === entity.id ? '#ff6600' : '#000000'"
              :emissive-intensity="selectedId === entity.id ? 0.3 : 0"
          />
        </TresMesh>

        <!-- Plane -->
        <TresMesh
            v-else
            :ref="(el: any) => { if (el?.object) meshRefs.set(entity.id, el.object as Object3D) }"
            rotation-x="-Math.PI / 2"
            receive-shadow
        >
          <TresPlaneGeometry :args="getGeometryArgs(entity)"/>
          <TresMeshStandardMaterial
              :color="`#${getEntityColor(entity).toString(16).padStart(6, '0')}`"
              :emissive="selectedId === entity.id ? '#ff6600' : '#000000'"
              :emissive-intensity="selectedId === entity.id ? 0.3 : 0"
          />
        </TresMesh>
      </TresGroup>

      <!-- TransformControls（仅编辑模式且选中实体时显示） -->
      <TransformControls
          v-if="isEditMode && transformTarget"
          :key="transformKey"
          :object="transformTarget"
          :mode="transformMode"
          @object-change="handleTransformChange"
          @dragging-changed="(e: any) => { if (!e.value) handleTransformEnd(); else handleTransformStart(); }"
      />
    </TresCanvas>
  </div>
</template>

<style lang="scss" scoped>
.dt-viewport {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 400px;
  background: #0a0e17;
  overflow: hidden;

  .mode-bar {
    position: absolute;
    top: 12px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
    display: flex;
    gap: 4px;
    background: rgba(20, 24, 33, 0.9);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    padding: 4px;

    .mode-btn {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 6px 10px;
      border: none;
      background: transparent;
      color: rgba(255, 255, 255, 0.65);
      font-size: 12px;
      cursor: pointer;
      border-radius: 4px;
      transition: all 0.15s;

      &:hover {
        background: rgba(255, 255, 255, 0.08);
        color: #fff;
      }

      &.active {
        background: var(--el-color-primary, #1890ff);
        color: #fff;
      }
    }
  }

  :deep(canvas) {
    display: block;
    width: 100% !important;
    height: 100% !important;
  }

  :deep(.tres-container) {
    width: 100% !important;
    height: 100% !important;
    position: absolute !important;
    top: 0;
    left: 0;
  }
}
</style>
