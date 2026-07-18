/**
 * 地图选点字段状态管理
 */
import { computed, ref } from "vue";
import { formatLngLat, parseLngLat } from "../constants";
import type { LngLat, MapBounds } from "../types";

export const useMapField = (initialValue?: string, bounds?: MapBounds) => {
    const value = ref<string>(initialValue ?? "");
    const currentBounds = ref<MapBounds>(bounds ?? [73.5, 18, 135, 53]);

    const lngLat = computed<LngLat | null>(() => {
        const parsed = parseLngLat(value.value);
        return parsed ? { lng: parsed.lng, lat: parsed.lat } : null;
    });

    const hasValue = computed(() => lngLat.value !== null);

    const setLngLat = (lng: number, lat: number) => {
        value.value = formatLngLat(lng, lat);
    };

    const clear = () => {
        value.value = "";
    };

    const setValue = (v: string) => {
        value.value = v;
    };

    const setBounds = (b: MapBounds) => {
        currentBounds.value = b;
    };

    return {
        value,
        lngLat,
        hasValue,
        currentBounds,
        setLngLat,
        clear,
        setValue,
        setBounds,
    };
};

export type MapFieldState = ReturnType<typeof useMapField>;
