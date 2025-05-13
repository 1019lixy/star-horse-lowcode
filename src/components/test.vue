<template>
  <div class="resume-table">
    <div
      v-for="(cell, index) in cells"
      :key="index"
      class="cell"
      :style="cell.style"
    >
      {{ cell.content }}
    </div>
    <div
      v-for="(col, index) in columnWidthsArray"
      :key="'resizer-' + index"
      class="resizer"
      @mousedown="startResize(index, $event)"
    ></div>
  </div>
</template>

<script>
export default {
  name: "DynamicResumeTable",
  data() {
    return {
      columnWidthsArray: [1, 2, 1], // 默认列宽比例
      cells: [
        { content: "个人信息", style: "grid-column: 1 / 2; font-weight: bold;" },
        { content: "联系方式", style: "grid-column: 2 / 3; font-weight: bold;" },
        { content: "技能", style: "grid-column: 3 / 4; font-weight: bold;" },
        { content: "姓名: 张三", style: "grid-column: 1 / 3;" },
        { content: "电话: 123-456-7890", style: "" },
        { content: "邮箱: zhangsan@example.com", style: "" },
        { content: "技能: Vue, React, Node.js", style: "grid-column: 2 / 4;" },
        { content: "自我介绍", style: "grid-column: 1 / 2; font-weight: bold;" },
        { content: "我是一名前端开发工程师...", style: "grid-column: 2 / 4;" },
      ],
      resizing: false,
      startX: 0,
      startWidth: 0,
      currentColIndex: null,
    };
  },
  computed: {
    columnWidths() {
      return this.columnWidthsArray.map((w) => `${w}fr`).join(" ");
    },
  },
  methods: {
    startResize(index, event) {
      this.resizing = true;
      this.startX = event.clientX;
      this.startWidth = this.columnWidthsArray[index];
      this.currentColIndex = index;
      document.addEventListener("mousemove", this.resize);
      document.addEventListener("mouseup", this.stopResize);
    },
    resize(event) {
      if (!this.resizing) return;
      const deltaX = event.clientX - this.startX;
      const newWidth = this.startWidth + deltaX / 100; // 调整比例
      if (newWidth > 0) {
        this.$set(this.columnWidthsArray, this.currentColIndex, newWidth);
      }
    },
    stopResize() {
      this.resizing = false;
      document.removeEventListener("mousemove", this.resize);
      document.removeEventListener("mouseup", this.stopResize);
    },
  },
};
</script>

<style scoped>
.resume-table {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
  border: 1px solid #ccc;
  padding: 10px;
  position: relative;
}

.cell {
  padding: 10px;
  border: 1px solid #ccc;
  background-color: #fff;
}

.resizer {
  position: absolute;
  top: 0;
  right: 0;
  width: 5px;
  height: 100%;
  cursor: col-resize; /* 鼠标形状为水平调整 */
  background-color: #ccc;
  z-index: 10;
}

.resizer:hover {
  background-color: #aaa; /* 鼠标悬停时改变颜色以提示可拖动 */
}
</style>