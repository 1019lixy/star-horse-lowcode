<script setup lang="ts">
/**
 * 数字孪生 Demo - 工业场景演示
 *
 * 默认加载"工厂车间"场景模板（厂房 + 4 储罐 + 2 泵 + 2 阀门 + 换热器 + 管道 + 控制室）
 * 顶部"切换模板"按钮：在 3 个模板（工厂车间/数据中心/能源站）间循环切换
 * 启用动画（泵电机旋转、阀门手轮旋转）
 * 启用数据模拟（温度/压力/流量实时更新）
 * 部分设备预设报警状态（出料泵 P2 报警，原料罐 T2 警告）
 */
import { computed, ref } from "vue";
import { DigitalTwinViewer } from "@/components/digitaltwin";
import { i18n } from "@/lang";
import type { DtScene } from "@/components/digitaltwin";
import { DT_SCENE_TEMPLATES, dtCreateModelInstance, createDtEntity } from "@/components/digitaltwin";

/** 模板序号（0=工厂车间 / 1=数据中心 / 2=能源站） */
const currentTemplateIndex = ref(0);

/** 当前场景（默认从工厂车间模板克隆） */
const buildSceneFromTemplate = (templateIndex: number): DtScene => {
    const template = DT_SCENE_TEMPLATES[templateIndex];
    return {
        id: `dt_demo_${template.id}`,
        name: template.labelKey,
        // 深拷贝模板实体（确保切换时互不干扰）
        entities: JSON.parse(JSON.stringify(template.entities)),
    };
};

const scene = ref<DtScene>(buildSceneFromTemplate(0));

/** 切换到下一个模板 */
const handleSwitchTemplate = (): void => {
    currentTemplateIndex.value = (currentTemplateIndex.value + 1) % DT_SCENE_TEMPLATES.length;
    scene.value = buildSceneFromTemplate(currentTemplateIndex.value);
};

/** 给模板中部分设备预设报警/警告状态（用于演示） */
const applyPresetStatus = (s: DtScene): void => {
    s.entities.forEach((e) => {
        // 工厂车间模板：出料泵 P2 报警、原料罐 T2 警告
        if (e.name === "出料泵 P2") e.status = "alarm";
        if (e.name === "原料罐 T2") e.status = "warning";
    });
};

applyPresetStatus(scene.value);

/** 当前模板名称（翻译后展示） */
const currentTemplateName = computed(() => i18n(DT_SCENE_TEMPLATES[currentTemplateIndex.value].labelKey as any));

const handleSelectEntity = (id: string | null) => {
    // eslint-disable-next-line no-console
    console.log("selected entity:", id);
};

// 抑制未使用告警（这两个函数保留供未来扩展使用）
void dtCreateModelInstance;
void createDtEntity;
</script>

<template>
    <div class="demo-container">
        <div class="demo-toolbar">
            <span class="demo-title">3D 数字孪生 - 工业级场景 Demo</span>
            <el-button type="primary" @click="handleSwitchTemplate">
                切换模板（当前：{{ currentTemplateName }}）
            </el-button>
        </div>
        <div class="demo-viewer">
            <DigitalTwinViewer
                :key="scene.id"
                :scene="scene"
                :auto-sim="true"
                @select-entity="handleSelectEntity"
            />
        </div>
    </div>
</template>

<style scoped>
.demo-container {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.demo-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 16px;
    background: #f0f2f5;
    border-bottom: 1px solid #e8e8e8;
}

.demo-title {
    font-size: 14px;
    font-weight: 600;
    color: #262626;
}

.demo-viewer {
    flex: 1;
    overflow: hidden;
}
</style>
