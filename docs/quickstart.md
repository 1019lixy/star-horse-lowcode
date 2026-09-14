# 快速上手

## 安装

```bash
npm install star-horse-lowcode
```

## 全局注册

```ts
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import StarHorseLowcode from 'star-horse-lowcode'

const app = createApp(App)

app.use(StarHorseLowcode, {
  router,
  lang: 'zh_CN',
})

app.mount('#app')
```

## 按需引入

```ts
import {
  StarHorseForm,
  StarHorseTableComp,
  StarHorseDialog,
  StarHorseSearchForm,
} from 'star-horse-lowcode'
```

## 基本用法

### 1. 配合接口的完整列表页

```vue
<template>
  <div>
    <!-- 搜索区域 -->
    <StarHorseSearchForm
      :formData="searchFields"
      @searchData="onSearch"
    />

    <!-- 数据列表 -->
    <StarHorseTableComp
      ref="tableRef"
      :apiEndpoints="apiUrls"
      :fieldList="pageFieldInfo"
      :primaryKey="'id'"
      :showBatchField="false"
      :dataFormat="dataFormat"
      :disableAction="false"
      :dialogInput="false"
      :filterCondition="searchParams"
      :orderBy="orderByList"
      :tableDataList="[]"
      :expand="false"
      :title="'用户管理'"
      :extendBtns="[]"
      :multipleSelect="false"
      :expandTable="{}"
      :helpMsg="''"
      :globalConfig="{}"
      :isDynamic="false"
      :hideButtonList="false"
      :editCondition="[]"
      :pageKeepOldData="false"
      :preview="false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { ApiUrls, PageFieldInfo, SearchParams, OrderByInfo } from 'star-horse-lowcode'

const tableRef = ref()

const apiUrls: ApiUrls = {
  pageListUrl: '/api/user/page',
  mergeUrl: '/api/user/save',
  mergeDraftUrl: '/api/user/draft',
  batchMergeUrl: '/api/user/batch',
  batchMergeDraftUrl: '/api/user/batch-draft',
  loadByIdUrl: '/api/user/detail',
  loadByIdForViewUrl: '/api/user/view',
  deleteUrl: '/api/user/delete',
}

const searchFields = {
  fieldList: [
    { label: '名称', fieldName: 'name', type: 'input' },
    { label: '状态', fieldName: 'status', type: 'select', preps: { values: [{ name: '启用', value: '1' }, { name: '禁用', value: '0' }] } },
  ]
}

const pageFieldInfo: PageFieldInfo = {
  fieldList: [
    { label: '名称', fieldName: 'name', required: true, formVisible: true, listVisible: true },
    { label: '状态', fieldName: 'status', type: 'select', preps: { values: [{ name: '启用', value: '1' }, { name: '禁用', value: '0' }] } },
  ]
}

const searchParams = ref<SearchParams[]>([])
const orderByList: OrderByInfo[] = [{ fieldName: 'create_time', orderBy: 'desc' }]

function onSearch(data: SearchParams[]) {
  searchParams.value = data
  tableRef.value?.createSearchParams(data)
}

function dataFormat(row: any, column: any, cellValue: any) {
  return cellValue
}
</script>
```

### 2. 独立表单

```vue
<template>
  <StarHorseForm
    ref="formRef"
    :apiEndpoints="apiUrls"
    :fieldList="pageFieldInfo"
    @refresh="onRefresh"
  />
</template>
```

### 3. 对话框中的表单

```vue
<template>
  <StarHorseDialog
    v-model:dialogVisible="visible"
    title="编辑数据"
    @merge="onMerge"
  >
    <StarHorseForm
      ref="formRef"
      :apiEndpoints="apiUrls"
      :fieldList="pageFieldInfo"
    />
  </StarHorseDialog>
</template>
```

### 4. 静态表格

```vue
<template>
  <StarHorseStaticTable
    primaryKey="id"
    :fieldList="{ fieldList: columns }"
    :dataList="tableData"
  />
</template>
```

### 5. 数据选择器

```vue
<template>
  <StarHorseDataSelector
    v-model="selectedValue"
    :apiEndpoints="'/api/user/list'"
    :displayName="'name'"
    :displayValue="'id'"
    :multiple="true"
    @change="onChange"
  />
</template>
```

## 国际化

组件库支持中文和英文，通过安装选项设置：

```ts
app.use(StarHorseLowcode, {
  lang: 'en_US',  // 或 'zh_CN'
})
```

## 主题定制

组件库使用 CSS 变量控制主题色，可通过覆盖以下变量自定义：

```css
:root {
  --star-horse-style: #409eff;   /* 主题色 */
}
```
