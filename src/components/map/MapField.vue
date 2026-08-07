<script setup lang="ts" name="MapField">
import {computed, onBeforeUnmount, onMounted, ref, watch} from "vue";
import {i18n} from "@/lang";
import {ShSvgIcon} from "@/components/shared";
import {formatLngLat, parseLngLat} from "./constants";
import type {MapBounds} from "./types";

const props = withDefaults(defineProps<{
  modelValue?: string;
  bounds?: MapBounds;
  readonly?: boolean;
  height?: number;
  placeholder?: string;
  /** 高德地图 JS API Key（必传） */
  amapKey?: string;
}>(), {
  height: 400,
  amapKey: "",
});

const emits = defineEmits<{
  (e: "update:modelValue", v: string): void;
  (e: "change", v: string): void;
}>();

const containerRef = ref<HTMLDivElement | null>(null);
const mapInstance = ref<any>(null);
const markerInstance = ref<any>(null);
const searchInput = ref("");
const searchResults = ref<any[]>([]);
const showSearch = ref(false);

/** 解析当前值 */
const parsedValue = computed(() => parseLngLat(props.modelValue || ""));

/** 高德地图 API 加载状态 */
const mapLoaded = ref(false);
const mapError = ref<string | null>(null);

/** 动态加载高德地图 JS API */
const loadAMapScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if ((window as any).AMap) {
      resolve();
      return;
    }
    const key = props.amapKey;
    if (!key) {
      reject(new Error("AMap key is required"));
      return;
    }
    const script = document.createElement("script");
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${key}`;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load AMap JS API"));
    document.head.appendChild(script);
  });
};

/** 初始化地图 */
const initMap = async () => {
  try {
    await loadAMapScript();
    const AMap = (window as any).AMap;
    if (!containerRef.value) return;

    const center = parsedValue.value
        ? [parsedValue.value.lng, parsedValue.value.lat]
        : [116.397, 39.908];

    mapInstance.value = new AMap.Map(containerRef.value, {
      zoom: 13,
      center,
      resizeEnable: true,
    });

    // 如果已有值，添加标记
    if (parsedValue.value) {
      addMarker(parsedValue.value.lng, parsedValue.value.lat);
    }

    // 点击地图设置标记
    if (!props.readonly) {
      mapInstance.value.on("click", (e: any) => {
        const lng = e.lnglat.getLng();
        const lat = e.lnglat.getLat();
        addMarker(lng, lat);
        const val = formatLngLat(lng, lat);
        emits("update:modelValue", val);
        emits("change", val);
      });
    }

    // 添加搜索控件
    if (!props.readonly) {
      AMap.plugin(["AMap.PlaceSearch", "AMap.AutoComplete"], () => {
        // 自动完成已就绪
      });
    }

    mapLoaded.value = true;
  } catch (err: any) {
    mapError.value = err.message;
  }
};

/** 添加/更新标记 */
const addMarker = (lng: number, lat: number) => {
  const AMap = (window as any).AMap;
  if (!AMap || !mapInstance.value) return;
  if (markerInstance.value) {
    markerInstance.value.setPosition([lng, lat]);
  } else {
    markerInstance.value = new AMap.Marker({
      position: [lng, lat],
      draggable: !props.readonly,
    });
    mapInstance.value.add(markerInstance.value);

    // 标记拖拽结束
    if (!props.readonly) {
      markerInstance.value.on("dragend", (e: any) => {
        const pos = markerInstance.value.getPosition();
        const val = formatLngLat(pos.lng, pos.lat);
        emits("update:modelValue", val);
        emits("change", val);
      });
    }
  }
  mapInstance.value.setCenter([lng, lat]);
};

/** 地址搜索 */
const handleSearch = async () => {
  if (!searchInput.value.trim()) return;
  const AMap = (window as any).AMap;
  if (!AMap) return;

  AMap.plugin(["AMap.PlaceSearch"], () => {
    const placeSearch = new AMap.PlaceSearch({
      pageSize: 5,
      pageIndex: 1,
    });
    placeSearch.search(searchInput.value, (status: string, result: any) => {
      if (status === "complete" && result.poiList) {
        searchResults.value = result.poiList.pois;
        showSearch.value = true;
      } else {
        searchResults.value = [];
      }
    });
  });
};

/** 选择搜索结果 */
const handleSelectPlace = (poi: any) => {
  const lng = poi.location.getLng();
  const lat = poi.location.getLat();
  addMarker(lng, lat);
  const val = formatLngLat(lng, lat);
  emits("update:modelValue", val);
  emits("change", val);
  showSearch.value = false;
  searchInput.value = poi.name;
};

/** 清除标记 */
const handleClear = () => {
  if (markerInstance.value && mapInstance.value) {
    mapInstance.value.remove(markerInstance.value);
    markerInstance.value = null;
  }
  emits("update:modelValue", "");
  emits("change", "");
};

/** 定位到当前标记 */
const handleLocate = () => {
  if (!parsedValue.value || !mapInstance.value) return;
  mapInstance.value.setCenter([parsedValue.value.lng, parsedValue.value.lat]);
  mapInstance.value.setZoom(15);
};

/** modelValue 变化同步 */
watch(
    () => props.modelValue,
    (v) => {
      if (v && mapInstance.value) {
        const parsed = parseLngLat(v);
        if (parsed) addMarker(parsed.lng, parsed.lat);
      }
    },
);

onMounted(() => {
  initMap();
});

onBeforeUnmount(() => {
  if (mapInstance.value) {
    mapInstance.value.destroy();
    mapInstance.value = null;
  }
});
</script>

<template>
  <div class="map-field">
    <div class="field-header">
      <el-input
          :model-value="modelValue"
          :placeholder="placeholder || i18n('map.field.placeholder')"
          :readonly="true"
          class="coord-input"
      >
        <template #prepend>
          <span class="coord-label">{{ i18n("map.field.lngLat") }}</span>
        </template>
      </el-input>
      <!-- 地址搜索 -->
      <el-input
          v-if="!readonly && mapLoaded"
          v-model="searchInput"
          :placeholder="i18n('map.field.searchPlaceholder')"
          class="search-input"
          @keydown.enter="handleSearch"
      >
        <template #append>
          <el-button @click="handleSearch">
            <ShSvgIcon name="search" size="14px"/>
          </el-button>
        </template>
      </el-input>
      <div class="field-actions" v-if="!readonly">
        <el-button @click="handleLocate" :disabled="!parsedValue">
          <ShSvgIcon name="preview" size="14px"/>
          {{ i18n("map.field.locate") }}
        </el-button>
        <el-button :disabled="!parsedValue" @click="handleClear">
          <ShSvgIcon name="delete" size="14px"/>
        </el-button>
      </div>
    </div>

    <!-- 搜索结果下拉 -->
    <div v-if="showSearch && searchResults.length > 0" class="search-results">
      <div
          v-for="poi in searchResults"
          :key="poi.id"
          class="search-item"
          @click="handleSelectPlace(poi)"
      >
        <span class="poi-name">{{ poi.name }}</span>
        <span class="poi-address">{{ poi.address }}</span>
      </div>
    </div>

    <!-- 地图容器 -->
    <div class="field-map" :style="{ height: `${height}px` }">
      <div v-if="mapError" class="map-error">
        <ShSvgIcon name="alarm" size="24px"/>
        <span>{{ mapError }}</span>
        <span class="error-hint">{{ i18n("map.field.amapKeyRequired") }}</span>
      </div>
      <div v-else ref="containerRef" class="amap-container"/>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.map-field {
  width: 100%;

  .field-header {
    display: flex;
    gap: 8px;
    margin-bottom: 6px;
    flex-wrap: wrap;

    .coord-input {
      flex: 1;
      min-width: 200px;
    }

    .search-input {
      flex: 1;
      min-width: 200px;
    }

    .coord-label {
      font-size: 12px;
      color: var(--el-text-color-secondary);
    }

    .field-actions {
      display: flex;
      gap: 4px;
    }
  }

  .search-results {
    background: var(--el-bg-color-overlay);
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    max-height: 240px;
    overflow-y: auto;
    margin-bottom: 6px;
    z-index: 100;

    .search-item {
      padding: 8px 12px;
      cursor: pointer;
      border-bottom: 1px solid var(--el-border-color-lighter);
      transition: background 0.15s;

      &:hover {
        background: var(--el-fill-color-light);
      }

      &:last-child {
        border-bottom: none;
      }

      .poi-name {
        font-size: 13px;
        font-weight: 500;
        display: block;
      }

      .poi-address {
        font-size: 11px;
        color: var(--el-text-color-secondary);
        display: block;
        margin-top: 2px;
      }
    }
  }

  .field-map {
    position: relative;
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
    overflow: hidden;

    .amap-container {
      width: 100%;
      height: 100%;
    }

    .map-error {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: var(--el-fill-color-light);
      color: var(--el-text-color-secondary);
      font-size: 13px;

      .error-hint {
        font-size: 11px;
        color: var(--el-text-color-placeholder);
      }
    }
  }
}

/* ============ App 端（移动端/窄屏）响应式适配 ============ */
@media (max-width: 768px) {
  .map-field {
    .field-header {
      gap: 6px;

      .coord-input,
      .search-input {
        flex: 1 1 100%;
        min-width: 0;
      }

      .coord-label {
        font-size: 11px;
      }

      .field-actions {
        flex: 1 1 100%;
        justify-content: flex-start;

        :deep(.el-button) {
          padding: 6px 8px;
          font-size: 12px;
        }
      }
    }

    .search-results {
      max-height: 200px;

      .search-item {
        padding: 6px 8px;

        /* 触屏无 :hover，用 :active 兜底高亮 */
        &:active {
          background: var(--el-fill-color-light);
        }

        .poi-name {
          font-size: 12px;
        }

        .poi-address {
          font-size: 10px;
        }
      }
    }

    /* 覆盖行内 style 固定高度 height: 400px（via props.height） */
    .field-map {
      height: 60vh !important;
      min-height: 300px;
    }
  }
}
</style>
