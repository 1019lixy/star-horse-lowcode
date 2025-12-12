<script setup lang="ts" name="Areainfo">
import {onMounted, ref} from "vue";
import {PageFieldInfo} from "@/components/types/PageFieldInfo";
import {StarHorseForm} from "@/components/comp";

const fieldList = ref<PageFieldInfo>({
  fieldList: [
    {
      label: "背景颜色", type: "color", fieldName: "backgroundColor",
      formVisible: true,
      preps: {
        colorFormat: "rgb"
      }
    },
    {
      label: "背景图片", type: "upload", fieldName: "backgroundImage",
      formVisible: true,
      preps: {
        listType: "picture-card",
        drag: true,
        showFileList: true,
      }
    },
    {
      label: "背景大小", type: "input", fieldName: "backgroundSize",
      formVisible: true
    },
    {
      label: "背景重复", type: "radio", fieldName: "backgroundRepeat",
      formVisible: true,
      preps: {
        values: [
          {name: "不重复", value: "no-repeat"},
          {name: "重复", value: "repeat"},
          {name: "水平方向重复", value: "repeat-x"},
          {name: "垂直方向重复", value: "repeat-y"},
          {name: "重复，空白区域填充", value: "space"},
        ]
      }
    },
  ]
});
const initData = async () => {
};

onMounted(() => {
  initData();
});

</script>
<template>
  <div class="flex flex-col h-full overflow-hidden">
    <star-horse-form :fieldList="fieldList"/>
  </div>
</template>
<style lang="scss" scoped></style>
