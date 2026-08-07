<script setup lang="ts" name="EditorTest">
import {onMounted, ref} from "vue";
import {StarHorseEditor} from "@/components/system";
import {ElMessage} from "element-plus";

const editorRef = ref<InstanceType<typeof StarHorseEditor>>();
const sqlContent = ref("");

// 示例：通过 toolbarItems 从外部配置工具栏按钮
// position: 'left' 显示在左侧, 'right' 显示在右侧（和默认项并排）
const customToolbarItems = ref([
  {
    id: "save",
    label: "保存",
    icon: "save",
    position: "left" as const,
    type: "button" as const,
    handler: () => {
      ElMessage.success(
          "保存成功！内容：" + sqlContent.value.substring(0, 50) + "...",
      );
    },
  },
  {
    id: "format",
    label: "格式化",
    icon: "format",
    position: "left" as const,
    type: "button" as const,
    handler: () => {
      ElMessage.info("执行格式化");
    },
  },
  {
    id: "export",
    label: "导出",
    icon: "download",
    position: "right" as const,
    type: "dropdown" as const,
    children: [
      {label: "导出为 SQL", handler: () => ElMessage.success("导出 SQL")},
      {label: "导出为 CSV", handler: () => ElMessage.success("导出 CSV")},
      {label: "导出为 JSON", handler: () => ElMessage.success("导出 JSON")},
    ],
  },
]);

onMounted(() => {
  const mockDbData = [
    {
      tableName: "sys_user",
      comment: "系统用户表",
      fields: [
        {fieldName: "id"},
        {fieldName: "username"},
        {fieldName: "password"},
        {fieldName: "email"},
        {fieldName: "phone"},
        {fieldName: "status"},
        {fieldName: "create_time"},
        {fieldName: "update_time"},
      ],
    },
    {
      tableName: "sys_order",
      comment: "订单表",
      fields: [
        {fieldName: "id"},
        {fieldName: "order_no"},
        {fieldName: "user_id"},
        {fieldName: "amount"},
        {fieldName: "status"},
        {fieldName: "create_time"},
        {fieldName: "pay_time"},
      ],
    },
    {
      tableName: "sys_product",
      comment: "商品表",
      fields: [
        {fieldName: "id"},
        {fieldName: "name"},
        {fieldName: "price"},
        {fieldName: "stock"},
        {fieldName: "category_id"},
        {fieldName: "description"},
      ],
    },
  ];

  editorRef.value?.setAutoCompletion("mydb", mockDbData);
});
</script>

<template>
  <div class="flex flex-col h-full p-4 gap-4">
    <div class="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
      <span>测试1：输入 <code>s</code> → 应弹出表名 + SQL关键字</span>
      <span
      >测试2：<code>FROM sys_user a</code> 然后 <code>a.</code> → 应弹出
        sys_user 的字段</span
      >
      <span>测试3：<code>FROM sys_order.</code> → 应弹出 sys_order 的字段</span>
    </div>
    <StarHorseEditor
        ref="editorRef"
        lang="sql"
        v-model:value="sqlContent"
        :toolbar-items="customToolbarItems"
    />
  </div>
</template>

<style lang="scss" scoped>
code {
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 13px;
}
</style>
