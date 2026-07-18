<script setup lang="ts" name="DiagramPreviewDialog">
import { computed } from "vue";
import { i18n } from "@/lang";
import StarHorseDialog from "@/components/comp/StarHorseDialog.vue";
import { getPortPosition, getShapePath } from "../constants";
import type { DiagramData } from "../types";

const props = defineProps<{
    visible: boolean;
    diagram: DiagramData;
}>();

const emits = defineEmits<{
    (e: "update:visible", v: boolean): void;
}>();

const innerVisible = computed({
    get: () => props.visible,
    set: (v) => emits("update:visible", v),
});

const svgContent = computed(() => {
    const dg = props.diagram;
    const padding = 50;
    const minX = Math.min(0, ...dg.nodes.map((n) => n.x)) - padding;
    const minY = Math.min(0, ...dg.nodes.map((n) => n.y)) - padding;
    const maxX = Math.max(500, ...dg.nodes.map((n) => n.x + n.width)) + padding;
    const maxY = Math.max(400, ...dg.nodes.map((n) => n.y + n.height)) + padding;
    const width = maxX - minX;
    const height = maxY - minY;

    let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${minX} ${minY} ${width} ${height}" width="${width}" height="${height}">`;
    svg += `<rect x="${minX}" y="${minY}" width="${width}" height="${height}" fill="#FFFFFF"/>`;

    // 边
    for (const edge of dg.edges) {
        const source = dg.nodes.find((n) => n.id === edge.source);
        const target = dg.nodes.find((n) => n.id === edge.target);
        if (!source || !target) continue;
        const sp = getPortPosition(source, edge.sourcePort || "right");
        const tp = getPortPosition(target, edge.targetPort || "left");
        const midX = (sp.x + tp.x) / 2;
        svg += `<path d="M${sp.x},${sp.y} L${midX},${sp.y} L${midX},${tp.y} L${tp.x},${tp.y}" stroke="${edge.style?.stroke || "#666"}" stroke-width="${edge.style?.strokeWidth || 2}" fill="none"/>`;
        if (edge.label) {
            svg += `<text x="${midX}" y="${(sp.y + tp.y) / 2}" fill="${edge.style?.textColor || "#333"}" font-size="${edge.style?.fontSize || 12}" text-anchor="middle">${edge.label}</text>`;
        }
    }

    // 节点
    for (const node of dg.nodes) {
        svg += `<g transform="translate(${node.x},${node.y})">`;
        if (node.shape === "image" && node.style?.image) {
            svg += `<image href="${node.style.image}" width="${node.width}" height="${node.height}" preserveAspectRatio="xMidYMid meet"/>`;
        } else if (node.shape !== "text") {
            const path = getShapePath(node.shape, 0, 0, node.width, node.height);
            svg += `<path d="${path}" fill="${node.style?.fill || "#FFF"}" stroke="${node.style?.stroke || "#333"}" stroke-width="${node.style?.strokeWidth || 1}"/>`;
        }
        if (node.text) {
            svg += `<text x="${node.width / 2}" y="${node.height / 2}" fill="${node.style?.textColor || "#333"}" font-size="${node.style?.fontSize || 13}" text-anchor="middle" dominant-baseline="middle">${node.text}</text>`;
        }
        svg += `</g>`;
    }

    svg += `</svg>`;
    return svg;
});

const handleExportSvg = () => {
    const blob = new Blob([svgContent.value], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${props.diagram.name || "diagram"}.svg`;
    a.click();
    URL.revokeObjectURL(url);
};

const handleExportPng = async () => {
    const svgString = svgContent.value;
    const img = new Image();
    img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width * 2;
        canvas.height = img.height * 2;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.scale(2, 2);
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${props.diagram.name || "diagram"}.png`;
            a.click();
            URL.revokeObjectURL(url);
        });
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgString)));
};
</script>

<template>
    <star-horse-dialog
        v-model="innerVisible"
        :title="i18n('diagram.preview.title')"
        box-width="80%"
        box-height="80%"
        :is-show-reset="false"
        :is-show-save="false"
        :self-func="true"
    >
        <div class="diagram-preview-dialog">
            <div class="preview-toolbar">
                <el-button  @click="handleExportSvg">
                    {{ i18n('diagram.preview.exportSvg') }}
                </el-button>
                <el-button  @click="handleExportPng">
                    {{ i18n('diagram.preview.exportPng') }}
                </el-button>
            </div>
            <div class="preview-content" v-html="svgContent"></div>
        </div>
        <template #footer>
            <el-button @click="innerVisible = false">{{ i18n('dialog.close') }}</el-button>
        </template>
    </star-horse-dialog>
</template>

<style lang="scss" scoped>
.diagram-preview-dialog {
    display: flex;
    flex-direction: column;
    height: 100%;
    gap: 8px;

    .preview-toolbar {
        display: flex;
        gap: 8px;
    }

    .preview-content {
        flex: 1;
        overflow: auto;
        border: 1px solid var(--el-border-color);
        border-radius: 4px;
        background: #FFFFFF;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 12px;

        :deep(svg) {
            max-width: 100%;
            max-height: 100%;
        }
    }
}
</style>
