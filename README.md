# 星马低代码(star-horse-lowcode)
## 使用说明
1. 安装依赖
```shell
在main.js中引入
import StarHorseLowCode from "star-horse-lowcode";
import "star-horse-lowcode/assets/index.css"
import "router" from "@/router";
const app = createApp(App);
app.use(StarHorseLowCode,{
  router: router
});
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
      type: "long"
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
      :title="'查看数据'"
      :is-view="true"
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

```
5.示例图片
![图片描述](dist/images/img.png)

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
12. 2025-05-27 优化本组件从项目中剥离时将遗留耦合的业务代码进一步剥离，保证组件的独立性
