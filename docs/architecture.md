# StarHorse Lowcode 组件库架构

## 概述

StarHorse Lowcode 是一套基于 Vue 3 + Element Plus 的低代码组件库，提供表单、表格、对话框、树形控件、数据选择器等核心业务组件，以及丰富的表单项组件，支持配置化驱动的页面开发。

## 技术栈

- **Vue 3** — Composition API + `<script setup>`
- **Element Plus** — 基础 UI 组件库
- **Pinia** — 状态管理
- **TypeScript** — 类型系统
- **Vite** — 构建工具
- **sortablejs** — 拖拽排序
- **vuedraggable-es** — Vue 3 拖拽组件

## 安装与使用

### 全局注册

```ts
import { createApp } from 'vue'
import StarHorseLowcode from 'star-horse-lowcode'

const app = createApp(App)

app.use(StarHorseLowcode, {
  router,                   // Vue Router 实例
  axiosInstance,            // Axios 实例（可选，不传则使用内置实例）
  lang: 'zh_CN',           // 国际化语言：zh_CN | en_US
  initElementPlus: true,    // 是否初始化 Element Plus（默认 true）
  elementPlusOptions: {},   // Element Plus 配置（可选）
})
```

### 按需引入

```ts
import { StarHorseForm, StarHorseTableComp, StarHorseDialog } from 'star-horse-lowcode'
```

### 插件安装选项

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| router | `Router` | 否 | — | Vue Router 实例，组件内通过 `window.__hostRouter__` 访问 |
| axiosInstance | `AxiosInstance` | 否 | 内置实例 | Axios 实例，组件内通过 `window.__hostAxios__` 访问 |
| lang | `LangType` | 否 | `zh_CN` | 国际化语言 |
| initElementPlus | `boolean` | 否 | `true` | 是否自动初始化 Element Plus |
| elementPlusOptions | `object` | 否 | — | Element Plus 配置项，传入后覆盖默认配置 |

## 组件架构

```
star-horse-lowcode
├── 核心组件 (comp/)
│   ├── StarHorseForm          # 表单组件（核心）
│   ├── StarHorseFormItem      # 表单项容器组件
│   ├── StarHorseFormList      # 表单列表组件
│   ├── StarHorseFormTable     # 表单表格组件
│   ├── StarHorseTableComp     # 数据列表组件（核心）
│   ├── StarHorseStaticTable   # 静态表格组件
│   ├── StarHorseSearchForm    # 搜索表单组件
│   ├── StarHorseSearchComp    # 搜索组件（含高级查询）
│   ├── StarHorseDialog        # 对话框组件
│   ├── StarHorseTree          # 树形控件
│   ├── StarHorseDataSelector  # 数据选择器
│   ├── StarHorseDataView      # 数据查看视图
│   ├── StarHorseDraggable     # 拖拽布局组件
│   ├── StarHorseIcon          # 图标组件
│   ├── StarHorsePopover       # 弹出框图标选择
│   ├── StarHorseJsonEditor    # JSON 编辑器
│   ├── StarHorseTableColumn   # 表格列组件
│   ├── StarHorseItem          # 通用项渲染组件
│   ├── ShForm                 # 轻量表单包装
│   ├── ShDynamicForm          # 动态表单
│   ├── ShTableListColumn      # 列表表格列组件
│   ├── DataPicker             # 数据拾取器
│   └── DataTag                # 数据标签
│
├── 表单项组件 (formcomp/items/)
│   ├── input-item             # 输入框
│   ├── textarea-item          # 文本域
│   ├── number-item            # 数字输入
│   ├── select-item            # 下拉选择
│   ├── radio-item             # 单选框
│   ├── checkbox-item          # 复选框
│   ├── switch-item            # 开关
│   ├── date-item              # 日期选择
│   ├── datetime-item          # 日期时间选择
│   ├── time-item              # 时间选择
│   ├── time-picker-item       # 时间选择器
│   ├── tree-select-item       # 树选择
│   ├── cascade-item           # 级联选择
│   ├── datapicker-item        # 数据拾取选择
│   ├── page-select-item       # 分页选择
│   ├── dialog-input-item      # 弹窗输入
│   ├── dialog-item            # 弹窗容器
│   ├── drawer-item            # 抽屉容器
│   ├── button-item            # 按钮
│   ├── upload-item            # 文件上传
│   ├── image-item             # 图片
│   ├── password-item          # 密码输入
│   ├── signature-item         # 签名
│   ├── autocomplete-item      # 自动补全
│   ├── input-tag-item         # 标签输入
│   ├── number-range-item      # 数字范围
│   ├── icon-item              # 图标选择
│   ├── color-item             # 颜色选择
│   ├── rate-item              # 评分
│   ├── slider-item            # 滑块
│   ├── tag-item               # 标签
│   ├── link-item              # 链接
│   ├── text-item              # 文本展示
│   ├── html-item              # HTML 内容
│   ├── htmleditor-item        # 富文本编辑器
│   ├── json-item              # JSON 编辑（对象）
│   ├── json-array-item        # JSON 编辑（数组）
│   ├── markdown-item          # Markdown 编辑
│   ├── view-markdown-item     # Markdown 查看
│   ├── description-item       # 描述列表
│   ├── divider-item           # 分割线
│   ├── progress-item          # 进度条
│   ├── cron-item              # Cron 表达式
│   ├── user-item              # 用户选择
│   ├── org-item               # 组织选择
│   ├── depart-item            # 部门选择（未实现）
│   ├── area-item              # 地区选择
│   ├── location-item          # 位置选择
│   ├── qrcode-item            # 二维码
│   ├── barcode-item           # 条形码
│   ├── audio-item             # 音频播放
│   ├── transfer-item          # 穿梭框
│   ├── tselect-item           # 树形下拉选择
│   ├── usercomp-item          # 自定义组件容器
│   ├── empty-item             # 空占位
│   └── unknown-item           # 未知组件占位
│
├── 系统组件 (system/)
│   ├── StarHorseButtonList    # 按钮列表
│   ├── StarHorseMenu          # 菜单组件
│   ├── StarHorseSvg           # SVG 组件
│   ├── StarHorseEditor        # 代码编辑器
│   ├── StarHorseSidebar       # 侧边栏
│   ├── StarHorseCodeEditor    # 代码编辑器（IDE风格，需按需加载）
│   ├── StarHorseDiffEditor    # Diff 编辑器（需按需加载）
│   ├── StarHorseQueryBuilder  # 查询构建器
│   ├── ContentMenu            # 右键菜单
│   ├── SvgLoader              # SVG 加载器
│   └── PageConfig             # 页面配置
│
├── 布局组件 (comp/app/)
│   ├── MainBar                # 主导航栏
│   ├── MainContent            # 主内容区
│   ├── MainContainer          # 主容器
│   ├── MainSubBar             # 子导航栏
│   └── MenuShot               # 快捷菜单
│
├── Cron 组件 (cron/)
│   └── Crontab                # Cron 表达式编辑器
│
└── 类型定义 (types/)
    ├── ApiUrls                # 接口地址类型
    ├── BtnAction              # 按钮事件类型
    ├── BtnAuth                # 按钮权限类型
    ├── CompInfo               # 组件信息类型
    ├── DialogProps            # 弹窗属性类型
    ├── DyCompField            # 动态组件字段类型
    ├── DynamicNode            # 动态节点类型
    ├── FormType               # 表单类型
    ├── ItemPreps              # 组件属性类型
    ├── MenusInfo              # 菜单信息类型
    ├── PageFieldInfo          # 页面字段信息类型
    ├── PageProps              # 页面属性类型
    ├── Params                 # 参数类型
    ├── PreOrPendType          # 前后缀事件类型
    ├── RuleType               # 校验规则类型
    ├── SearchProps            # 搜索属性类型
    ├── ShortKey               # 快捷键类型
    ├── StarHorseType          # 通用类型
    └── UserinfoType           # 用户信息类型
```

## 核心数据流

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ StarHorse    │     │ StarHorse    │     │  API 服务    │
│ SearchForm   │────▶│ TableComp    │────▶│  (apiEndpoints)   │
│ (搜索条件)   │     │ (数据列表)   │◀────│              │
└──────────────┘     └──────┬───────┘     └──────────────┘
                            │
                     点击新增/编辑
                            │
                     ┌──────▼───────┐
                     │ StarHorse    │
                     │ Dialog       │
                     │  ┌────────┐  │
                     │  │StarHorse│  │
                     │  │Form    │  │
                     │  └────────┘  │
                     └──────────────┘
```

## 数据来源标识 (source)

所有表单相关组件通过 `source` 参数标识调用场景：

| 值 | 含义 |
|---|---|
| 0 | 表单项组件内部 |
| 1 | 表单新增 |
| 2 | 表单编辑 |
| 3 | 查看视图（只读） |
| 4 | 查询 |
| 5 | 列表 |
| 6 | 表单设计 |
| 7 | 页面设计 |

## 全局变量

插件安装后，以下全局变量可用：

| 变量 | 类型 | 说明 |
|---|---|---|
| `window.__hostRouter__` | `Router` | 宿主应用路由实例 |
| `window.__hostAxios__` | `AxiosInstance` | 宿主应用 Axios 实例 |
| `window.__starHorseHostApp__` | `App` | 宿主应用实例 |
| `window.__starHorseHostLang__` | `LangType` | 国际化语言设置 |

## 文档目录

| 文档 | 说明 |
|---|---|
| [快速上手](quickstart.md) | 安装、引入、基础用法 |
| [联动策略与数据源](linkage-and-datasource.md) | 10种联动类型、ApiLinkageDetail、前后缀按钮事件、执行流程 |
| [内部机制](internal-mechanisms.md) | prepsFilter透传、FormulaEngine公式引擎、usePrefixSuffix前后缀、source影响、禁用判断、动态事件 |
| [表单项组件](components/form-items.md) | 57个表单项组件完整文档（含Element Plus透传属性、计算属性、专属配置） |
| [StarHorseForm](components/star-horse-form.md) | 表单组件（计算属性、provide/inject、watch、联动机制、source影响） |
| [StarHorseTableComp](components/star-horse-table-comp.md) | 数据列表组件（编辑互斥、按钮覆盖、分页加载） |
| [StarHorseDialog](components/star-horse-dialog.md) | 对话框组件（provide、source影响、最小化/全屏） |
| [StarHorseSearchForm](components/star-horse-search-form.md) | 搜索表单 + 搜索组件 |
| [StarHorseDataSelector](components/star-horse-data-selector.md) | 数据选择器 + DataPicker + DataTag |
| [StarHorseDataView](components/star-horse-data-view.md) | 数据查看视图 |
| [StarHorseFormList](components/star-horse-form-list.md) | 表单列表 + 表单表格 + 表单项 |
| [StarHorseTree](components/star-horse-tree.md) | 树形控件 |
| [StarHorseStaticTable](components/star-horse-static-table.md) | 静态表格 |
| [StarHorseDraggable](components/star-horse-draggable.md) | 拖拽布局 + 图标 + 弹出框 + JSON编辑器 + 通用项 |
| [ShForm](components/sh-form.md) | 轻量表单 + 动态表单 |
| [系统组件](components/system-components.md) | 按钮列表、菜单、SVG、编辑器、侧边栏等 |
| [布局组件](components/layout-components.md) | 导航栏、内容区、容器、Crontab |
| [类型定义](types/types.md) | 所有52个TypeScript类型定义 |
