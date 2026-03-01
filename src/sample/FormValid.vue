<script setup lang="ts" name="Areainfo">
import {onMounted, ref} from "vue";
import {PageFieldInfo} from "@/components/types/PageFieldInfo";
import {StarHorseForm} from "@/components/comp";

const testFormValidRef = ref();
const outerData: any = {"backgroundSize": "http你好%",qrcode:"http://www.baidu.com",barcode:"22222223333"};
const fieldList = ref<PageFieldInfo>({
  fieldList: [
    {
      label: "背景颜色", type: "htmleditor", fieldName: "backgroundColor",
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
      formVisible: true,
      preps: {
        mergePrefix: true,
        mergeAppend: true,
        appendList: [
          {name: "%", value: "%"},
          {name: "px", value: "px"},
        ],
        prependList: [
          {name: "http", value: "http"},
          {name: "https", value: "https"},
        ]
      }
    },
    {
      label: "验证数字", type: "number", fieldName: "validNumber",
      formVisible: true,
      preps: {
        mergePrefix: true,
        mergeAppend: true,
        appendList: [
          {name: "%", value: "%"},
          {name: "px", value: "px"},
          {name: "fr", value: "fr"},
        ],
        prependList: [
          {name: "http", value: "http"},
          {name: "https", value: "https"},
        ]
      }
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
    {
      label: "签名",
      type: "signature",
      fieldName: "signature",
      preps: {
        imageType: "jpg"
      }
    },
    {
      label: "二维码",
      type: "qrcode",
      fieldName: "qrcode"
    }
    ,
    {
      label: "条形码",
      type: "barcode",
      fieldName: "barcode"
    }
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
    {{ testFormValidRef?.getFormData() }}
    <star-horse-form ref="testFormValidRef" :outerFormData="outerData" :fieldList="fieldList"/>
  </div>
</template>
<style lang="scss" scoped></style>
