<template>
  <div class="lang-test-container">
    <h1>{{ i18n("test.langTestTitle") }}</h1>

    <div class="lang-switcher">
      <h3>{{ i18n("test.currentLanguage") }}: {{ currentLang }}</h3>
      <div class="lang-buttons">
        <button
          v-for="lang in languages"
          :key="lang.value"
          @click="switchToLanguage(lang.value)"
          :class="{ active: currentLang === lang.value }"
        >
          {{ lang.label }}
        </button>
      </div>
    </div>

    <div class="lang-content">
      <p>{{ i18n("login.userName") }}</p>
      <p>{{ i18n("login.password") }}</p>
      <p>{{ i18n("dialog.submit") }}</p>
      <p>{{ i18n("dialog.cancel") }}</p>
      <p>{{ i18n("form.submit") }}</p>
    </div>

    <div class="lang-info">
      <h3>{{ i18n("test.loadedLanguages") }}</h3>
      <ul>
        <li v-for="lang in loadedLanguages" :key="lang">{{ lang }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { changeLanguage, currentLang, i18n, onLanguageChange } from "@/lang";
import { LangType } from "@/theme/theme";

// 语言选项
const languages = ref([
  { value: LangType.ZH_CN, label: "简体中文" },
  { value: LangType.EN_US, label: "English" },
]);

// 已加载的语言
const loadedLanguages = ref<string[]>([]);

// 切换语言
const switchToLanguage = async (lang: LangType) => {
  try {
    console.log(`Switching to language: ${lang}`);
    await changeLanguage(lang);

    // 模拟获取已加载的语言（实际应用中可能需要从其他地方获取）
    // 这里仅作为演示，实际项目中应根据实际情况修改
    updateLoadedLanguages();
  } catch (error) {
    console.error("Failed to switch language:", error);
  }
};

// 更新已加载的语言列表
const updateLoadedLanguages = () => {
  // 实际应用中，这里应该检查 langCache 中已加载的语言
  // 由于我们无法直接访问 langCache，这里仅作为演示
  const allLangs = Object.values(LangType);
  // 随机模拟已加载的语言（实际应用中应根据实际情况修改）
  const randomCount = Math.floor(Math.random() * 3) + 1;
  const shuffled = [...allLangs].sort(() => 0.5 - Math.random());
  loadedLanguages.value = shuffled.slice(0, randomCount);
};

// 监听语言变化
let unregisterCallback: (() => void) | null = null;

onMounted(() => {
  // 注册语言变化监听器
  unregisterCallback = onLanguageChange(() => {
    console.log("Language changed:", currentLang);
    // 可以在这里更新组件状态或执行其他操作
  });

  // 初始化已加载的语言列表
  updateLoadedLanguages();
});

onUnmounted(() => {
  // 取消注册语言变化监听器
  if (unregisterCallback) {
    unregisterCallback();
  }
});
</script>

<style scoped>
.lang-test-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.lang-switcher {
  margin-bottom: 30px;
}

.lang-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 10px;
}

button {
  padding: 8px 16px;
  border: 1px solid #ccc;
  background: #fff;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s;
}

button:hover {
  background: #f0f0f0;
}

button.active {
  background: #409eff;
  color: white;
  border-color: #409eff;
}

.lang-content {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.lang-info {
  background: #e6f7ff;
  padding: 20px;
  border-radius: 8px;
}

.lang-info ul {
  margin: 10px 0 0 20px;
}
</style>
