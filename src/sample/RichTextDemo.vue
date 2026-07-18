<script setup lang="ts">
import { ref } from "vue";
import { RichTextCollab } from "@/components/richtext";

const toolbarMode = ref<"simple" | "default" | "full">("default");

const htmlContent = ref<string>(
    `<h2>协同富文本编辑器示例</h2>` +
    `<p>这是一个基于 <strong>wangEditor</strong> 的富文本编辑器组件，支持 <em>简单</em>、<u>默认</u>、完整三种工具栏模式切换。</p>` +
    `<h3>核心特性</h3>` +
    `<ul>` +
    `<li>多种工具栏模式（simple / default / full）</li>` +
    `<li>协同编辑用户列表展示</li>` +
    `<li>字数统计与最大长度限制</li>` +
    `<li>@提及功能支持</li>` +
    `<li>只读模式切换</li>` +
    `</ul>` +
    `<blockquote>提示：可通过上方单选按钮切换工具栏模式，编辑内容会自动保留。</blockquote>` +
    `<p>更多内容请参考官方文档。</p>`,
);

const modeOptions = [
    { label: "简洁模式 (simple)", value: "simple" },
    { label: "默认模式 (default)", value: "default" },
    { label: "完整模式 (full)", value: "full" },
];
</script>

<template>
    <div class="demo-container">
        <h3>协同富文本 RichTextCollab</h3>
        <p>基于 wangEditor 封装的协同富文本编辑器，支持多种工具栏模式、协同用户展示、字数统计、@提及等。下方可切换三种工具栏模式查看效果。</p>

        <div class="demo-toolbar">
            <span class="toolbar-label">工具栏模式：</span>
            <el-radio-group v-model="toolbarMode">
                <el-radio-button
                    v-for="opt in modeOptions"
                    :key="opt.value"
                    :value="opt.value"
                >
                    {{ opt.label }}
                </el-radio-button>
            </el-radio-group>
        </div>

        <div class="demo-canvas">
            <RichTextCollab
                :key="toolbarMode"
                v-model:html="htmlContent"
                :toolbar-mode="toolbarMode"
                :config="{ enableCollaboration: true, maxLength: 100000 }"
            />
        </div>
    </div>
</template>

<style scoped>
.demo-container {
    padding: 16px;
    height: 100%;
    overflow: auto;
}
.demo-toolbar {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
}
.toolbar-label {
    font-size: 14px;
    color: var(--el-text-color-secondary);
}
.demo-canvas {
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
    overflow: hidden;
    height: 560px;
}
</style>
