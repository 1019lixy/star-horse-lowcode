<template>

  <!--      <star-horse-form :fieldList="tableFieldList"/>-->
  <radio-item
      :field="{
   preps: {
    name: 'parentId',
    values: [
      {
        name: '一级',
        value: '123'
      },
      {
        name: '二级',
        value: '456'
      }
    ]
  }}"
      :formData="formData"
  />
  <button-item
      :field="{
    label:'Button',
    fieldName:'btn',
   }"/>
</template>
<script lang="ts" setup>
import {ref} from "vue";
const ss=ref("33")
const formData = ref({
  parentId: '123'
})
// import {PageFieldInfo} from "@/types/PageFieldInfo";
// const tableFieldList :PageFieldInfo|any={
//   fieldList: [
//     {
//       label: "主键",
//       fieldName: "idInformations",
//       type: "long"
//     },
//     {
//       label: "上级系统",
//       fieldName: "parentId",
//       type: "select",
//       formVisible: true,
//       actionName: "change",
//     },
//     [
//       {
//         label: "系统名称",
//         fieldName: "sysName",
//         type: "input",
//         required: true,
//         formVisible: true,
//         listVisible: true
//       },
//       {
//         label: "归属主体",
//         fieldName: "idCustomer",
//         type: "select",
//         required: true,
//         formVisible: true,
//         listVisible: true
//       }
//     ],
//     /* {
//      label: "归属主体", fieldName: "customer['customerName']", type: "select",
//      required: true,
//      listVisible: true
//    },*/
//     {
//       label: "系统编码",
//       fieldName: "sysCode",
//       type: "input",
//       required: true,
//       disabled: "Y",
//       listVisible: true
//     },
//     [
//       {
//         label: "系统Logo",
//         fieldName: "sysLogo",
//         type: "icon",
//         formVisible: true,
//         listVisible: true,
//         preps: {
//           iconType: "system"
//         }
//       },
//       {
//         label: "数据排序",
//         fieldName: "dataSort",
//         type: "number",
//         formVisible: true,
//         listVisible: true
//       }
//     ],
//     {
//       label: "系统描述",
//       fieldName: "sysDesc",
//       type: "textarea",
//       formVisible: true,
//       listVisible: true,
//       actionName: "input",
//     },
//     {
//       label: "创建人",
//       disabled: "Y",
//       fieldName: "createdBy",
//       type: "input"
//     },
//     {
//       label: "修改人",
//       disabled: "Y",
//       fieldName: "updatedBy",
//       type: "input"
//     },
//     {
//       label: "创建日期",
//       disabled: "Y",
//       fieldName: "createdTime",
//       type: "date"
//     },
//     {
//       label: "修改日期",
//       disabled: "Y",
//       fieldName: "updatedTime",
//       type: "date"
//     },
//     {
//       label: "数据版本号",
//       fieldName: "version",
//       type: "number"
//     },
//     {
//       label: "是否已逻辑",
//       fieldName: "isDel",
//       type: "number"
//     },
//     {
//       label: "数据编号",
//       fieldName: "dataNo",
//       type: "input"
//     },
//     {
//       label: "状态码",
//       fieldName: "statusCode",
//       type: "input"
//     },
//     {
//       label: "状态码名称",
//       fieldName: "statusName",
//       type: "input"
//     },
//     {
//       label: "国际码",
//       fieldName: "local",
//       type: "input"
//     }
//   ]
// };
import SelectItem from "@/components/formcomp/items/select-item.vue";
import ButtonItem from "@/components/formcomp/items/button-item.vue";
</script>
<style lang="scss">
#app {
  height: 100%;
}
</style>
