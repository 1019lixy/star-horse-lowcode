<template>
  {{ formData }}
  <template v-for="data in fields">
    <component
      :field="data"
      v-model:formData="formData"
      :isDesign="false"
      :formInfo="fields"
      :showFormItem="true"
      :bareFlag="false"
      :is="data.itemType + '-item'"
    />
  </template>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";

const formData = ref<any>({});
const fields = ref<Array<any>>([
  {
    fieldName: "banners",
    label: "图片描述",
    type: "dialog",
    itemType: "dialog",
    helpMsg: "配置轮播图的图片及其描述信息",
    formVisible: true,
    preps: {
      formVisible: true,
      fieldList: {
        containerFields: [
          {
            containerType: "batchTable",
            tabName: "imageInfo",
            fieldList: [
              {
                fieldName: "imageType",
                label: "获取图片方式",
                type: "select",
                formVisible: true,
                defaultValue: "upload",
                preps: {
                  values: [
                    { name: "上传", value: "upload" },
                    { name: "手动输入", value: "manual" },
                    { name: "图库选择", value: "select" },
                  ],
                  dataRelation: {
                    actionName: "change",
                    relationDetails: [
                      {
                        matchType: "eq",
                        controlCondition: "changeType",
                        relationFields: "path",
                        matchFieldValue: "upload",
                        staticDatas: "upload",
                      },
                      {
                        matchType: "eq",
                        controlCondition: "changeType",
                        relationFields: "path",
                        matchFieldValue: "manual",
                        staticDatas: "input",
                      },
                      {
                        matchType: "eq",
                        controlCondition: "changeType",
                        relationFields: "path",
                        matchFieldValue: "select",
                        staticDatas: "dialog-input",
                      },
                    ],
                  },
                },
              },

              {
                label: "图片地址",
                type: "upload",
                fieldName: "path",
                formVisible: true,
              },
              {
                label: "标题",
                type: "input",
                fieldName: "title",
                formVisible: true,
              },
              {
                label: "描述",
                type: "input",
                fieldName: "description",
                formVisible: true,
              },
              {
                label: "连接地址",
                type: "input",
                fieldName: "linkUrl",
                formVisible: true,
              },
            ],
          },
        ],
      },
      params: {
        model: "full",
      },
    },
  },
  {
    fieldName: "height",
    label: "高度",
    type: "input",
    defaultValue: "200px",
    helpMsg: "例如: 200px",
  },
  {
    fieldName: "autoplay",
    label: "自动播放",
    type: "switch",
    defaultValue: true,
  },
  {
    fieldName: "interval",
    label: "播放间隔(ms)",
    type: "number",
    defaultValue: 3000,
    helpMsg: "自动切换的时间间隔",
  },
  {
    fieldName: "indicatorPosition",
    label: "指示器位置",
    type: "select",
    defaultValue: "outside",
    preps: {
      values: [
        { name: "外部", value: "outside" },
        { name: "内部", value: "inside" },
        { name: "隐藏", value: "none" },
      ],
    },
  },
  {
    fieldName: "arrow",
    label: "切换箭头",
    type: "select",
    defaultValue: "hover",
    preps: {
      values: [
        { name: "悬停时显示", value: "hover" },
        { name: "一直显示", value: "always" },
        { name: "隐藏", value: "never" },
      ],
    },
  },
  {
    fieldName: "zIndex",
    label: "层级",
    type: "number",
    defaultValue: 1,
    helpMsg: "组件层级 (z-index),控制组件的堆叠顺序，数值越大越靠前",
  },
]);
onMounted(() => {});
</script>

<style lang="scss" scoped></style>
