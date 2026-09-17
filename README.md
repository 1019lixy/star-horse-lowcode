# 星马低代码核心组件库(star-horse-lowcode)

[English](README_EN.md) | [中文](README.md)


## 使用说明

1. 安装依赖

```shell
在main.js中引入
import StarHorseLowCode from "star-horse-lowcode";
import "star-horse-lowcode/assets/index.css"
import "router" from "@/router";
import ElementPlus from 'element-plus';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
const app = createApp(App);
//如果项目初始化了element-plus,后面的插件initElementPlus 需要设置为false,否则会重复引入element-plus，可能导致组件冲突
app.use(ElementPlus, { locale: zhCn })
app.use(StarHorseLowCode,{
  router: router,
  //不传此参数则使用插件内部的axios header配置参数
  //axiosInstance:axiosInstance,
  //增加国际化配置
  //lang:'zh_CN'||'en_US'||'zh_TW'||'ja_JP'||'de_DE' //默认为zh_CN
  initElementPlus: true,//新增插件是否初始化element-plus开关,默认初始化
  elementPlusOptions: { //element-plus 配置选项,如果不配置,组件内部会引入element-plus
   locale: zhCn,
   //...其它配置
   }
}
);
app.mount('#app')
```

2. 启动项目

```shell
```

3. 说明

```
Node 版本 >20
该组件库基于vue3+ts+pinia+vue-router+element-plus开发，
该组件提供了对Element-Plus 官方组件的封装，
支持参数见：PageFieldInfo.t.ts 下的 FieldInfo,所有官方参数
配置到preps:{}里面;
同时也提供了自定义的组件如：
 cron Cron 表达式、
 dialog-input 弹出选择器、
 usercomp 动态组件、
 page-select 下拉分页选择器、
 等；当前发布的组件是便于个人使用， 具体描述待后期知识库完善后，可在知识库上进行查看。
 此次发布只是低代码平台的核心组件库，后期会根据实际情况发布设计模块功能。
 该组件库里面存在着 两个接口会自动调用后端，一个是用户分享数据接口（下一个版本会屏蔽掉），一个是转发地址接口（配置了会调用）
 后面用户只需要配置好 const apiEndpoints: ApiUrls = apiInstance("system-config", "system/areainfo");
 //以分页接口pageListUrl为例，最终会映射成：/system-config/system/areainfo/pageListUrl,
 返回数据格式为：
 分页接口：{
  code: 0,
  data: {
    dataList: [],
    totalData: 0,
    pageSize: 10,
    pageNum: 1
  },
  cnMessage: "操作成功"
}，非分页接口：{
  code: 0,
  data: []|{},
  cnMessage: "操作成功"
}
就可以和后端正常通讯了，这里涉及到Token和动态路由的问题，后续会进行完善。
 待后期知识库功能完善后将进行全面开源，敬请期待。
 该组件右本人独立耗时4年开发完成（前端+后端），其中可能存在没测到的bug，不喜勿喷。
 使用过程中遇到问题或提出你的宝贵意见可邮件至：l_1019@163.com
 
```

4. 完整示例（将此代码拷贝到新建.vue空文件）

```
<script setup lang="ts">
import {onMounted, provide, reactive, ref} from "vue";
import {
  apiInstance, dialogPreps, commonField,
  PageFieldInfo, SearchFields, ApiUrls
} from "star-horse-lowcode";
// 接口地址
const apiEndpoints: ApiUrls = apiInstance("system-config", "system/areainfo");
// 搜索属性
const searchFormData = reactive<SearchFields>({
  fieldList: [
   {label: "区域名称3", defaultVisible: true, matchType: "lk", fieldName: "areaName3", type: "input"},
    {label: "区域编码", defaultVisible: true, matchType: "lk", fieldName: "areaCode", type: "input"}
  ]
});
/**
 * 表格属性, 
 */
const tableFieldList = reactive<PageFieldInfo>({
  fieldList: [
    {
      label: "区域主键",
      fieldName: "idAreainfo",
      type: "input"
    },
    {
      label: "父节点编号",
      fieldName: "parentNo",
      type: "select",
      formVisible: true,
      listVisible: true
    },
    {
      label: "区域名称",
      fieldName: "areaName",
      type: "input",
      formVisible: true,
      listVisible: true
    },
    {
      label: "区域编码",
      fieldName: "areaCode",
      type: "input",
      formVisible: true,
      listVisible: true
    },
    ...commonField()
  ],
  containerFields: []
});
//主键
const primaryKey = "idAreainfo";
const testRef = ref();
const rules = {};
//弹出属性
const dialogProps = dialogPreps();
provide("dialogProps", dialogProps);
//按钮权限
const btnPermisson:any={
  add:"add",
  edit:"edit",
  batchDelete:"batchDelete",
  download:"download",
  upload:"upload",
  export:"export",
  import:"import",
}
//数据格式化
const dataFormat = (_name: string, cellValue: object): any => {
  return cellValue;
};
const initData = async () => {
};
onMounted(() => {
  initData();
});
</script>
<template>
  <star-horse-panel :isShowBtnContinue="true" v-model="dialogProps.editVisible" :dialogProps="dialogProps">
    <star-horse-form
        @refresh="testRef.loadByPage()"
        :apiEndpoints="apiEndpoints"
        :fieldList="tableFieldList"
        :rules="rules"
    />
  </star-horse-panel>
  <star-horse-panel
      v-model="dialogProps.viewVisible"
      :dialogProps="dialogProps"
      :source="3"
  >
    <star-horse-data-view :dataFormat="dataFormat" :field-list="tableFieldList" :apiEndpoints="apiEndpoints"/>
  </star-horse-panel>
  <div class="search-content">
    <div class="search_btn" :style="{ 'flex-direction': Config.buttonStyle.value == 'line'? 'column' : 'row' }">
      <star-horse-search-comp
          @searchData="(data: any) => areainfoRef.createSearchParams(data)"
          :formData="searchFormData"
          :apiEndpoints="apiEndpoints"
      />
    </div>
  </div>
  <el-card class="inner_content">
    <star-horse-table-comp
        ref="testRef"
        :fieldList="tableFieldList"
        :primaryKey="primaryKey"
        :apiEndpoints="apiEndpoints"
        :btnPermissions="btnPermisson"
        :dataFormat="dataFormat"
        :showPageBar="true"
    />
  </el-card>
</template>
<style lang="scss" scoped></style>
组件列表说明：

以下组件的使用方式 是将 type设置为对应的名字 如： {
      label: "区域名称",
      fieldName: "areaName",
      type: "area"
    }, 渲染后就是区域选择，如果type 为空系统默认为input，渲染后显示文本输入框,
以下组件有好多是对Element-Plus 官方组件做的二次封装，如果要配置对应的参数请如下配置
{
      label: "性别",
      fieldName: "sex",
      type: "radio",
	  preps:{
	  values:[{name:"男",value:"male"},{name:"女",value:"female"}],
	  ...
	  }
    }, 
毕竟不是全职开发，因此帮助文档只能尽可能的抽时间写。
具体表单的布局方式请参见发布包里的类别文件：PageFieldInfo.d.ts 这里面有对box 布局，tab 布局，table 布局的定义。
目前支持的组件如下：
audio       视频组件
autocomplete 自动完成组件
button       按钮组件
cascade      级联组件
checkbox     复选框组件
color         颜色组件
cron          Cron表达式组件
datetime      日期组件
dialog-input   弹出选择器组件 
divider        分割线
html           html 只读组件
htmleditor     html编辑器组件
icon           图标组件
image          图片组件
input          文本框组件
json-array     Json数组组件
json           Json组件
markdown       Markdown组件
number         数字组件
number-range   数字范围组件
page-select    下拉分页选择组件 
password        密码框组件
radio          单选框组件
rate            评分组件
select         下拉框组件
signature      签名组件
slider         滑块组件
switch         开关组件
tag            Tag组件
text           文本组件
textarea       文本域组件
time           时间组件
timePicker     时间选择器组件
transfer      穿梭框组件
tselect       树形选择器组件
unknown       未知组件  无实际意义
upload        上传组件
usercomp       用户自定义组件
view-markdown  只读Markdown组件
qrcode         二维码组件
barcode        条形码组件

```

5.示例图片

请到gitee 查看示例图片

6.更新记录
#### v4.0.0

```
-- 此次做了重大升级,如果用到了容器组件，和之前版本不兼容
-- 1、容器组件目前支持box,gridtable,dytable,fieldset,card,splitter,collapse,table,drawer,dialog,descriptions,step,tab
    这些容器组件，除了box,其它全部统一了数据结构 把原来的*List,全部统一为 containerType:"**",containerFields:[],
    如：card 容器
     {
       containerType:"card",
       containerFields:[{
        subTableName:"", //子表名字
        subTablePrimaryKey:"", //子表组件
        subFormFlag:"", //是否子表 Y|N
        title:"", //标题
        fieldList:[] //表单字段
       }]
     }
--2、完全剥离了表单设计器遗留在此组件的代码 
```
#### v4.0.01

```
-- 优化弹窗层级混乱问题
```
#### v4.0.02

```
-- 修复一些列已知bug
```
#### v4.0.03

```
-- 增加分段编辑标记，修复一些bug
```
#### v4.0.04

```
-- 修复重置表单禁用状态下的数据丢失
```
#### v4.0.05

```
-- 修复v4.0.04 更新导致的bug
```
#### v4.0.06

```
-- 修复v4.0.04 更新导致的bug,优化App端分段审批bug
```
