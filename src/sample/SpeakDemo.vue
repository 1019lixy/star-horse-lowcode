<template>
  <div class="tts-demo">
    <!-- 输入框 -->
    <textarea
      v-model="textToSpeak"
      placeholder="请输入要转换为语音的文字..."
      rows="5"
      class="text-input"
    ></textarea>

    <!-- 控制按钮 -->
    <div class="btn-group">
      <button @click="startSpeak" :disabled="!textToSpeak || isSpeaking">
        {{ isSpeaking ? "正在播放" : "开始朗读" }}
      </button>
      <button @click="pauseSpeak" :disabled="!isSpeaking">暂停</button>
      <button @click="resumeSpeak" :disabled="!isPaused">继续</button>
      <button @click="stopSpeak" :disabled="!isSpeaking">停止</button>
    </div>

    <!-- 语音配置 -->
    <div class="config-group">
      <label>
        语速：
        <input
          type="range"
          v-model.number="rate"
          min="0.5"
          max="2"
          step="0.1"
        />
        {{ rate }}
      </label>
      <label>
        音量：
        <input
          type="range"
          v-model.number="volume"
          min="0"
          max="1"
          step="0.1"
        />
        {{ volume }}
      </label>
      <label>
        音调：
        <input type="range" v-model.number="pitch" min="0" max="2" step="0.1" />
        {{ pitch }}
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from "vue";
import {warning} from "@/utils/message";

// 响应式数据
const textToSpeak = ref(""); // 要转换的文字
const isSpeaking = ref(false); // 是否正在播放
const isPaused = ref(false); // 是否暂停
const rate = ref(1); // 语速（0.5-2）
const volume = ref(1); // 音量（0-1）
const pitch = ref(1); // 音调（0-2）

// 创建语音合成实例
let speechInstance = null;

// 初始化语音合成
const initSpeech = () => {
  // 检查浏览器是否支持
  if (!("speechSynthesis" in window)) {
    warning("你的浏览器不支持文字转语音功能，请更换现代浏览器（如Chrome、Edge）");
    return null;
  }

  const utterance = new SpeechSynthesisUtterance();
  utterance.lang = "zh-CN"; // 设置语言为中文
  utterance.rate = rate.value; // 语速
  utterance.volume = volume.value; // 音量
  utterance.pitch = pitch.value; // 音调

  // 监听播放结束
  utterance.onend = () => {
    isSpeaking.value = false;
    isPaused.value = false;
  };

  // 监听错误
  utterance.onerror = (error) => {
    console.error("语音播放出错：", error);
    isSpeaking.value = false;
    isPaused.value = false;
  };

  return utterance;
};

// 开始朗读
const startSpeak = () => {
  if (!textToSpeak.value.trim()) return;

  // 先停止之前的播放
  stopSpeak();

  // 初始化语音实例
  speechInstance = initSpeech();
  if (!speechInstance) return;

  // 设置要朗读的文本
  speechInstance.text = textToSpeak.value;

  // 播放
  window.speechSynthesis.speak(speechInstance);
  isSpeaking.value = true;
  isPaused.value = false;
};

// 暂停朗读
const pauseSpeak = () => {
  if (isSpeaking.value && !isPaused.value) {
    window.speechSynthesis.pause();
    isPaused.value = true;
  }
};

// 继续朗读
const resumeSpeak = () => {
  if (isPaused.value) {
    window.speechSynthesis.resume();
    isPaused.value = false;
  }
};

// 停止朗读
const stopSpeak = () => {
  if (speechInstance || isSpeaking.value) {
    window.speechSynthesis.cancel();
    isSpeaking.value = false;
    isPaused.value = false;
    speechInstance = null;
  }
};

// 组件卸载时停止播放
onUnmounted(() => {
  stopSpeak();
});
</script>

<style scoped>
.tts-demo {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
}

.text-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 15px;
  font-size: 14px;
}

.btn-group {
  margin-bottom: 15px;
  display: flex;
  gap: 10px;
}

.btn-group button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background: #409eff;
  color: white;
  cursor: pointer;
}

.btn-group button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.config-group {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  align-items: center;
}

.config-group label {
  display: flex;
  align-items: center;
  gap: 8px;
}

.config-group input[type="range"] {
  width: 100px;
}
</style>
