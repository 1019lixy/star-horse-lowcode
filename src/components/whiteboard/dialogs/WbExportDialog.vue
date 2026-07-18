<script setup lang="ts" name="WbExportDialog">
import { computed, ref, watch } from "vue";
import { ElMessage } from "element-plus";
import { i18n } from "@/lang";
import StarHorseDialog from "@/components/comp/StarHorseDialog.vue";
import type { WhiteboardElement } from "../types";
import type { WbExportFormat } from "../types";
import {
    wbDownloadBlob,
    wbDownloadText,
    wbGetElementsBounds,
    wbSvgXmlToPng,
    wbToJson,
    wbToSvgXml,
} from "../utils/WbExportUtils";

const props = defineProps<{
    visible: boolean;
    elements: WhiteboardElement[];
}>();

const emit = defineEmits<{
    (e: "update:visible", v: boolean): void;
}>();

const innerVisible = computed({
    get: () => props.visible,
    set: (v) => emit("update:visible", v),
});

const format = ref<WbExportFormat>("png");
const scale = ref(2);
const fileName = ref("whiteboard");

const formatOptions = computed(() => [
    { value: "png", label: i18n("whiteboard.export.png") },
    { value: "svg", label: i18n("whiteboard.export.svg") },
    { value: "json", label: i18n("whiteboard.export.json") },
]);

const bounds = computed(() => wbGetElementsBounds(props.elements));

/** SVG XML（其他格式共用） */
const svgXml = computed(() =>
    wbToSvgXml(props.elements, bounds.value.width, bounds.value.height),
);

/** 预览内容 */
const previewContent = computed(() => {
    if (props.elements.length === 0) return "";
    if (format.value === "svg") return svgXml.value;
    if (format.value === "json") return wbToJson(props.elements);
    return "";
});

/** 预览类型 */
const previewType = computed(() => {
    if (format.value === "png") return "image";
    return "text";
});

/** PNG 预览 URL */
const pngPreviewUrl = ref("");
const buildPngPreview = async () => {
    if (format.value !== "png" || props.elements.length === 0) {
        pngPreviewUrl.value = "";
        return;
    }
    try {
        const blob = await wbSvgXmlToPng(
            svgXml.value,
            bounds.value.width,
            bounds.value.height,
            Math.min(scale.value, 1),
        );
        if (pngPreviewUrl.value) URL.revokeObjectURL(pngPreviewUrl.value);
        pngPreviewUrl.value = URL.createObjectURL(blob);
    } catch (e) {
        console.error(e);
    }
};

watch(
    () => [props.visible, format.value, props.elements.length],
    () => {
        if (props.visible) buildPngPreview();
    },
    { immediate: true },
);

const handleExport = async () => {
    if (props.elements.length === 0) {
        ElMessage.warning(i18n("whiteboard.layer.empty"));
        return;
    }
    const name = fileName.value.trim() || "whiteboard";
    try {
        if (format.value === "svg") {
            wbDownloadText(svgXml.value, `${name}.svg`, "image/svg+xml;charset=utf-8");
        } else if (format.value === "json") {
            wbDownloadText(wbToJson(props.elements), `${name}.json`, "application/json;charset=utf-8");
        } else {
            const blob = await wbSvgXmlToPng(
                svgXml.value,
                bounds.value.width,
                bounds.value.height,
                scale.value,
            );
            wbDownloadBlob(blob, `${name}.png`);
        }
        ElMessage.success(i18n("whiteboard.message.exported"));
        innerVisible.value = false;
    } catch (e) {
        console.error(e);
        ElMessage.error(String(e));
    }
};

const handleClose = () => {
    if (pngPreviewUrl.value) {
        URL.revokeObjectURL(pngPreviewUrl.value);
        pngPreviewUrl.value = "";
    }
};
</script>

<template>
    <star-horse-dialog
        v-model="innerVisible"
        :title="i18n('whiteboard.export.title')"
        box-width="780px"
        :self-func="true"
        @close="handleClose"
    >
        <div class="wb-export-dialog">
            <el-form label-width="80px" >
                <el-form-item :label="i18n('whiteboard.export.format')">
                    <el-radio-group v-model="format">
                        <el-radio-button
                            v-for="o in formatOptions"
                            :key="o.value"
                            :value="o.value"
                        >
                            {{ o.label }}
                        </el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="文件名">
                    <el-input v-model="fileName" placeholder="whiteboard" style="width: 240px;" />
                    <span class="ext-tip">.{{ format }}</span>
                </el-form-item>
                <el-form-item v-if="format === 'png'" label="缩放">
                    <el-slider
                        v-model="scale"
                        :min="1"
                        :max="4"
                        :step="0.5"
                        style="width: 240px;"
                        :format-tooltip="(v: number) => v + 'x'"
                    />
                </el-form-item>
                <el-form-item :label="i18n('whiteboard.property.size')">
                    <span class="size-text">
                        {{ Math.ceil(bounds.width) }} × {{ Math.ceil(bounds.height) }} px
                        <template v-if="format === 'png'">
                            → {{ Math.ceil(bounds.width * scale) }} × {{ Math.ceil(bounds.height * scale) }} px
                        </template>
                    </span>
                </el-form-item>
            </el-form>
            <div class="preview-box">
                <div v-if="previewType === 'image' && pngPreviewUrl" class="image-preview">
                    <img :src="pngPreviewUrl" alt="preview" />
                </div>
                <pre v-else>{{ previewContent || i18n("whiteboard.layer.empty") }}</pre>
            </div>
        </div>
        <template #footer>
            <el-button @click="innerVisible = false">{{ i18n("dialog.close") }}</el-button>
            <el-button type="primary" @click="handleExport">
                {{ i18n("whiteboard.export.confirm") }}
            </el-button>
        </template>
    </star-horse-dialog>
</template>

<style lang="scss" scoped>
.wb-export-dialog {
    .ext-tip {
        margin-left: 6px;
        color: var(--el-text-color-secondary);
        font-size: 12px;
    }

    .size-text {
        font-size: 12px;
        color: var(--el-text-color-secondary);
    }

    .preview-box {
        max-height: 50vh;
        overflow: auto;
        background: var(--el-fill-color-light);
        border: 1px solid var(--el-border-color-lighter);
        border-radius: 4px;
        padding: 12px;
        margin-top: 8px;

        pre {
            margin: 0;
            white-space: pre-wrap;
            word-break: break-all;
            font-family: "Courier New", monospace;
            font-size: 12px;
            line-height: 1.5;
        }

        .image-preview {
            text-align: center;

            img {
                max-width: 100%;
                max-height: 50vh;
                border: 1px dashed var(--el-border-color);
                background:
                    linear-gradient(45deg, #eee 25%, transparent 25%),
                    linear-gradient(-45deg, #eee 25%, transparent 25%),
                    linear-gradient(45deg, transparent 75%, #eee 75%),
                    linear-gradient(-45deg, transparent 75%, #eee 75%);
                background-size: 16px 16px;
                background-position: 0 0, 0 8px, 8px -8px, -8px 0;
            }
        }
    }
}
</style>
