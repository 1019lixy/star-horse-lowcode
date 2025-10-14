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
 后面用户只需要配置好 const dataUrl: ApiUrls = apiInstance("system-config", "system/areainfo");
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
const dataUrl: ApiUrls = apiInstance("system-config", "system/areainfo");
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
  batchFieldList: []
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
  <star-horse-dialog :isShowBtnContinue="true" :dialogVisible="dialogProps.editVisible" :dialogProps="dialogProps">
    <star-horse-form
        @refresh="testRef.loadByPage()"
        :compUrl="dataUrl"
        :fieldList="tableFieldList"
        :rules="rules"
    />
  </star-horse-dialog>
  <star-horse-dialog
      :dialog-visible="dialogProps.viewVisible"
      :dialogProps="dialogProps"
      :source="3"
  >
    <star-horse-data-view :dataFormat="dataFormat" :field-list="tableFieldList" :compUrl="dataUrl"/>
  </star-horse-dialog>
  <div class="search-content">
    <div class="search_btn" :style="{ 'flex-direction': Config.buttonStyle.value == 'line'? 'column' : 'row' }">
      <star-horse-search-comp
          @searchData="(data: any) => areainfoRef.createSearchParams(data)"
          :formData="searchFormData"
          :compUrl="dataUrl"
      />
    </div>
  </div>
  <el-card class="inner_content">
    <star-horse-table-comp
        ref="testRef"
        :fieldList="tableFieldList"
        :primaryKey="primaryKey"
        :compUrl="dataUrl"
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
area        区域组件 
audio       视频组件
autocomplete 自动完成组件
button       按钮组件
cascade      级联组件
checkbox     复选框组件
color         颜色组件
cron          Cron表达式组件
datetime      日期组件
depart         部门组件
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
user          用户组件 业务强关联不适合引用项目使用，后期会进行改造
usercomp       用户自定义组件
view-markdown  只读Markdown组件
qrcode         二维码组件
barcode        条形码组件

```

5.示例图片
请到gitee 查看示例图片
6.BUG 修改记录

```
1. 2025-03-31 修复动态表单Store piniaInstance 对象共享数据问题
              修复列表操作按钮不显示问题
2. 2025-04-11 修改动态表单设计组件css间距问题
3. 2025-04-15 修改动态表单comp组件名称错误问题 ,
              优化编辑列表排除divider,button和usercomp组件显示,
              修复usercomp组件没有被纳入formVisible 控制范围
4. 2025-04-24 修复表单容器全局禁止不生效问题
              修复表单组件dytable选择td不生效问题
5. 2025-04-29 修改svg图标为字体图标
6. 2025-05-07 优化star-horse-table-comp组件，当属性类别为日期类型时，自动格式化日期
7. 2025-05-08 增加qrcode组件,优化StarHorseFormList组件动态添加行，定位到最底部
8. 2025-05-09 增加ShForm表单组件,在自定义表单中如果用到了本插件提供的组件，需要使用ShForm组件进行包裹,
              如果使用el-form表单属性的blur事件会失效，导致一直报字段未赋值.（也可能是本人才疏学浅没有找到根本原因，而使用此方法来解决）,
              修复已知Bug
9. 2025-05-12 增加barcode 条形码组件，增加表单设计属性层级显示接口,
              修复已知Bug
10. 2025-05-15 修复已知Bug,
               增加双击文本输入框或者多行文本输入框，弹窗对话框编辑数据
11. 2025-05-24 修复已知Bug, 删除冗余数据
12. 2025-05-27 优化本组件从项目中剥离时将遗留耦合的业务代码进一步剥离，保证组件的独立性,同时替换过时的组件
13. 2025-06-02 修复判断数据是否Json bug
14. 2025-06-05 修复已知Bug
15. 2025-06-06 增加按钮响应事件的前置校验 preValidFunc：
                <star-horse-table-comp
        ref="projectMemberRef"
        :fieldList="tableFieldList"
        :primaryKey="primaryKey"
        :preValidFunc="[{
          authority:'add',
          valid:()=>{
           //返回true 表示校验通过，返回false 表示校验不通过
            return projectId !='-1'
          },
          msg:'请先选择项目'
        }]"
        :compUrl="dataUrl"
        :dataFormat="dataFormat"
    />
16. 2025-06-17 框架内封装的element-plus组件,将穷举参数修改为v-bind，支持element-plus 最新版本的改变
               同时优化了表单的属性分发的原子化，组件业务逻辑分解到具体的组件中(之前写在一个文件内),
17. 2025-06-19 修复cron，number-range 组件的bug
18. 2025-06-23 发布时去掉'cjs', 'umd'的支持,仅打包 es,以减小打包后的包体大小
19. 2025-06-24 修复动态创建组件函数createComponent props 定义参数在模板中不生效问题，同时修复其它已知bug
20. 2025-06-25 修复dialog-input,page-select 组件的bug,在所有表单组件中新增noPlaceholder属性，默认为false,
              为true时，不显示默认提示文字,
              使用实例：{label:"xx",fieldName:"xx",type:"number",preps:{noPlaceholder:true} }
21. 2025-06-27 优化事件绑定 由之前的一个属性只允许绑定一个事件改为多个事件，方法为 
              actions:{
                click:()=>{},
                change:()={}
              },同时去掉了actionName 属性,
22. 2025-07-08 修复已知Bug
23. 2025-07-12 修复button组件点击事件无响应问题
24. 2025-07-15 修复box布局隐藏属性导致布局异常问题
25. 2025-07-17 修复已知Bug StarHorseTree 组件增加叶子节点和非叶子节点图标,升级所有依赖组件为最新版本
26. 2025-07-19 修复表单超长不滚动问题
27. 2025-07-22 修复动态表单设计时,属性undefined 的Bug
               更新示例图片
               修复StarHorseFormList 组件staticColumn(控制在批量添加数据时，时弹窗添加还是直接在列表中添加) 为N 时不生效问题
28. 2025-07-23 修复编辑数据时,组件初始化时不触发actions定义的事件问题,如果要阻止在初始化时触发事件(默认初始化时触发自定义事件),
               需在preps 中增加 stopInitCallAction:true
               修复动态菜单，页面按钮权限控制问题
               
29. 2025-07-26 增加接口传入引用项目axiosInstance 和对外导出插件内的starHorseAxios(axiosInstance),如果传入axiosInstance 
               则屏蔽插件内的和对外导出插件内的starHorseAxios,以解决引用项目axios 和插件内axios 配置不一致问题(历史遗留)，
               以满足使用者自定义接口需配置的header参数
30. 2025-07-28 修复StarHorseTableColumn 组件在点击单元格编辑数据时(需要在PageFieldInfo中将cellEditable设置为true)，不切换为对应的组件问题
31. 2025-07-29 修复StarHorseSearchComp 更多查询时,输入框 没有匹配模式异常
32. 2025-08-01 修复page-select-item 显示问题，优化StarHorseFormList 组件弹窗模式添加行时增加提交并继续按钮
33. 2025-08-02 修复StarHorseFormList 在同实例不同表单数据渲染时，上一个表单的数据不清空问题
34. 2025-08-04 修复StarHorseForm 批量添加数据异常
                select-item,tselect-item 组件增加增加header(全选) 和footer (动态增加选项)，开关 showHeader,showFooter
35. 2025-08-05  select-item,tselect-item  将 showHeader 去掉当配置多选multiple 为true 是自动显示，减少参数维护,同时新增cascade组件的header
                和footer
                修复StarHorseDataSelector 数据选择及显示的Bug
36. 2025-08-06  修复StarHorseDataSelector 数据回显Bug
37. 2025-08-07  修复markdown-item 组件不能正常显示Bug,修复了button-item 组件初始化时触发了点击事件
                在ApiUrls对外暴露权限接口变量permissionsUrl,用户可以自定义权限接口
                在函数dictData 用户可自定义字典接口
                导出DataPicker组件
38. 2025-08-11  修复表单容器拖拽及切换bug
39. 2025-08-12  修复容器组件tabItem和collapseItem 面板切换自定义事件不响应bug
40. 2025-08-13  优化在动态表单设计时starhorse-form-item 选中组件时响应性能。同时将表单组件的props参数抽成接口
41. 2025-08-14  增加表单设计时组件联动，通过dataRelation 配置项实现
                修复usercomp-item 组件名字冲突问题
                修复datapicker-item,base-json-item 组件的bug
42. 2025-08-15  修复组件b-bind 参数出现脏数据导致组件不能正常显示问题
                修改表单联动事件多次触发问题
                优化表单联动事件Bug
43. 2025-08-21  修复collapseItem组件的change事件报错问题
44. 2025-08-28  增加国际化语言包
45. 2025-08-29  修复表单设计更换组件弹窗高度问题
46. 2025-09-02  修复StarHorseDataSelector 组件加载数据问题
47. 2025-09-03  优化StarHorseFormList，collapseItem,tabItem,tabPanelItem等组件的css样式                
                修复StarHorseJsonEditor 双向数据绑定时，修改数据不响应问题
48. 2025-09-06  升级依赖插件
49. 2025-09-08  修复StarHorseDraggable 组件插槽和设计与非设计模式时的数据控制问题
50. 2025-09-12  增加国际化语言包，中文（zh_CN）英文（en_US），繁体中文（zh_TW），日文（ja_JP），德文（de_DE）
51. 2025-09-15  修复StarHorseDraggable 组件插槽和设计与非设计模式时宽度与高度控制问题
52. 2025-09-20  修复StarHorseTableColumn 组件在点击单元格编辑数据，由之前的blur事件触发保存，改为click事件触发保存
53. 2025-09-26  修复国际化第一次加载异常bug,修复其他组件一系列已知bug
54. 2025-10-11  修复input-item ,number-item 组件prefix,suffix 显示问题
                修复容器组件collapse-container 在表单中校验失效问题
55. 2025-10-13  更新不兼容的第三方插件版本
