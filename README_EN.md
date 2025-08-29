# Star Horse Low-Code Core Component Library (star-horse-lowcode)

[English](README_EN.md) | [中文](README.md)

## Usage Instructions

1. Install dependencies
```shell
// Import in main.js
import StarHorseLowCode from "star-horse-lowcode";
import "star-horse-lowcode/assets/index.css"
import "router" from "@/router";
import ElementPlus from 'element-plus';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
const app = createApp(App);
app.use(ElementPlus, { locale: zhCn })
// If elementPlusOptions is not configured, the component assumes ElementPlus is not used,
// so it will import ElementPlus internally
app.use(StarHorseLowCode,{
  router: router,
  // If this parameter is not passed, the plugin's internal axios header configuration will be used
  //axiosInstance:axiosInstance,
  // Add internationalization configuration
  //lang:'zh_cn'||'en_us' // defaults to zh_cn
  elementPlusOptions: {
   locale: zhCn,
   //...other configurations
   }
});
app.mount('#app')
```

2. Start the project
```shell
```

3. Notes
```
Node version >20
This component library is developed based on vue3+ts+pinia+vue-router+element-plus,
It provides encapsulation of Element-Plus official components,
Supported parameters can be found in: PageFieldInfo.t.ts under FieldInfo, all official parameters
are configured in preps:{};
It also provides custom components such as:
 cron Cron expression,
 dialog-input Popup selector,
 usercomp Dynamic component,
 page-select Dropdown pagination selector,
 etc.; The currently released components are for personal use. Specific descriptions will be available in the knowledge base after it is improved.
 This release is only the core component library of the low-code platform. Design module functions will be released later based on actual situations.
 There are two interfaces in this component library that will automatically call the backend: one is the user data sharing interface (will be blocked in the next version), and one is the forwarding address interface (will be called if configured).
 Later, users only need to configure const dataUrl: ApiUrls = apiInstance("system-config", "system/areainfo");
 // Taking the pagination interface pageListUrl as an example, it will eventually be mapped to: /system-config/system/areainfo/pageListUrl,
 The data return format is:
 Pagination interface: {
  code: 0,
  data: {
    dataList: [],
    totalData: 0,
    pageSize: 10,
    pageNum: 1
  },
  cnMessage: "Operation successful"
}, Non-pagination interface: {
  code: 0,
  data: []|{},
  cnMessage: "Operation successful"
}
Then it can communicate with the backend normally. This involves Token and dynamic routing issues, which will be improved later.
 After the knowledge base function is improved, it will be fully open-sourced. Please look forward to it.
 This component was independently developed by me over 4 years (front-end + back-end). There may be bugs that haven't been detected. Please don't criticize if you don't like it.
 If you encounter problems during use or want to offer valuable suggestions, you can email: l_1019@163.com
 
```

4. Complete example (copy this code to a new .vue empty file)
```vue
<script setup lang="ts">
import {onMounted, provide, reactive, ref} from "vue";
import {
  apiInstance, dialogPreps, commonField,
  PageFieldInfo, SearchFields, ApiUrls
} from "star-horse-lowcode";
// API address
const dataUrl: ApiUrls = apiInstance("system-config", "system/areainfo");
// Search properties
const searchFormData = reactive<SearchFields>({
  fieldList: [
   {label: "Area Name 3", defaultVisible: true, matchType: "lk", fieldName: "areaName3", type: "input"},
    {label: "Area Code", defaultVisible: true, matchType: "lk", fieldName: "areaCode", type: "input"}
  ]
});
/**
 * Table properties
 */
const tableFieldList = reactive<PageFieldInfo>({
  fieldList: [
    {
      label: "Area Primary Key",
      fieldName: "idAreainfo",
      type: "input"
    },
    {
      label: "Parent Node Number",
      fieldName: "parentNo",
      type: "select",
      formVisible: true,
      listVisible: true
    },
    {
      label: "Area Name",
      fieldName: "areaName",
      type: "input",
      formVisible: true,
      listVisible: true
    },
    {
      label: "Area Code",
      fieldName: "areaCode",
      type: "input",
      formVisible: true,
      listVisible: true
    },
    ...commonField()
  ],
  batchFieldList: []
});
// Primary key
const primaryKey = "idAreainfo";
const testRef = ref();
const rules = {};
// Dialog properties
const dialogProps = dialogPreps();
provide("dialogProps", dialogProps);
// Button permissions
const btnPermisson:any={
  add:"add",
  edit:"edit",
  batchDelete:"batchDelete",
  download:"download",
  upload:"upload",
  export:"export",
  import:"import",
}
// Data formatting
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

Component List Description:

The following components are used by setting the type to the corresponding name, for example: {
      label: "Area Name",
      fieldName: "areaName",
      type: "area"
    }, After rendering, it becomes an area selector. If type is empty, the system defaults to input, and after rendering, it displays a text input box.
Many of the following components are secondary encapsulations of Element-Plus official components. To configure the corresponding parameters, please configure as follows:
{
      label: "Gender",
      fieldName: "sex",
      type: "radio",
      preps:{
      values:[{name:"Male",value:"male"},{name:"Female",value:"female"}],
      ...
      }
    },
Since I'm not a full-time developer, the documentation can only be written when I have time.
For specific form layout methods, please refer to the category files in the release package: PageFieldInfo.d.ts, which contains definitions for box layout, tab layout, and table layout.
Currently supported components:
area        Area component 
audio       Audio component
autocomplete Auto-complete component
button      Button component
cascade     Cascade component
checkbox    Checkbox component
color       Color component
cron        Cron expression component
datetime    Date component
depart      Department component
dialog-input Popup selector component 
divider     Divider
html        HTML read-only component
htmleditor  HTML editor component
icon        Icon component
image       Image component
input       Text box component
json-array  JSON array component
json        JSON component
markdown    Markdown component
number      Number component
number-range Number range component
page-select Dropdown pagination selector component 
password    Password box component
radio       Radio component
rate        Rating component
select      Dropdown component
signature   Signature component
slider      Slider component
switch      Switch component
tag         Tag component
text        Text component
textarea    Text area component
time        Time component
timePicker  Time picker component
transfer    Transfer component
tselect     Tree selector component
unknown     Unknown component (no practical meaning)
upload      Upload component
user        User component (strongly business-related, not suitable for reference projects, will be improved later)
usercomp    User-defined component
view-markdown Read-only Markdown component
qrcode      QR code component
barcode     Barcode component

```

5. Example Images
 Please check example images on gitee

6. BUG Fix Records
```
1. 2025-03-31 Fixed dynamic form Store piniaInstance object data sharing issue
              Fixed list operation button not displaying issue
2. 2025-04-11 Modified dynamic form design component CSS spacing issue
3. 2025-04-15 Fixed dynamic form comp component name error issue,
              Optimized editing list to exclude divider, button and usercomp component display,
              Fixed usercomp component not being included in formVisible control range
4. 2025-04-24 Fixed form container global disable not taking effect issue
              Fixed form component dytable selecting td not taking effect issue
5. 2025-04-29 Changed SVG icons to font icons
6. 2025-05-07 Optimized star-horse-table-comp component, when property type is date type, automatically format date
7. 2025-05-08 Added qrcode component, optimized StarHorseFormList component dynamic row addition, positioned to bottom
8. 2025-05-09 Added ShForm form component, when using components provided by this plugin in custom forms, need to wrap with ShForm component,
              If using el-form form property blur event will fail, causing continuous field not assigned error. (Maybe due to my limited skills, I couldn't find the root cause, so I used this method to solve it),
              Fixed known bugs
9. 2025-05-12 Added barcode component, added form design property hierarchy display interface,
              Fixed known bugs
10. 2025-05-15 Fixed known bugs,
               Added double-click text input box or multi-line text input box to pop up dialog for data editing
11. 2025-05-24 Fixed known bugs, deleted redundant data
12. 2025-05-27 Optimized further separation of legacy coupled business code when stripping components from project, ensuring component independence, while replacing obsolete components
13. 2025-06-02 Fixed Json data judgment bug
14. 2025-06-05 Fixed known bugs
15. 2025-06-06 Added button response event pre-validation preValidFunc:
                <star-horse-table-comp
        ref="projectMemberRef"
        :fieldList="tableFieldList"
        :primaryKey="primaryKey"
        :preValidFunc="[{
          authority:'add',
          valid:()=>{
           // Return true means validation passed, return false means validation failed
            return projectId !='-1'
          },
          msg:'Please select project first'
        }]"
        :compUrl="dataUrl"
        :dataFormat="dataFormat"
    />
16. 2025-06-17 Framework encapsulated element-plus components, changed exhaustive parameters to v-bind, supporting element-plus latest version changes
               Optimized atomic distribution of form properties, decomposed component business logic to specific components (previously written in one file),
17. 2025-06-19 Fixed cron, number-range component bugs
18. 2025-06-23 Removed 'cjs', 'umd' support during release, only packaged es to reduce package size
19. 2025-06-24 Fixed dynamic component creation function createComponent props definition parameters not taking effect in template issue, fixed other known bugs
20. 2025-06-25 Fixed dialog-input, page-select component bugs, added noPlaceholder property to all form components, default false,
              When true, default placeholder text is not displayed,
              Usage example: {label:"xx",fieldName:"xx",type:"number",preps:{noPlaceholder:true} }
21. 2025-06-27 Optimized event binding from one property only allowing one event to multiple events, method:
              actions:{
                click:()=>{},
                change:()={}
              }, removed actionName property,
22. 2025-07-08 Fixed known bugs
23. 2025-07-12 Fixed button component click event not responding issue
24. 2025-07-15 Fixed box layout hidden property causing layout abnormality issue
25. 2025-07-17 Fixed known bugs StarHorseTree component added leaf node and non-leaf node icons, upgraded all dependent components to latest versions
26. 2025-07-19 Fixed form too long not scrolling issue
27. 2025-07-22 Fixed dynamic form design time, property undefined Bug
               Updated example images
               Fixed StarHorseFormList component staticColumn (controls whether to add data in popup or directly in list when batch adding data) not taking effect when N
28. 2025-07-23 Fixed editing data, component initialization not triggering actions defined events issue, if want to prevent triggering events during initialization (default triggers custom events during initialization),
               Need to add stopInitCallAction:true in preps
               Fixed dynamic menu, page button permission control issue
               
29. 2025-07-26 Added interface to pass reference project axiosInstance and exported plugin's starHorseAxios (axiosInstance), if axiosInstance is passed
               Then block plugin's and exported plugin's starHorseAxios, to solve reference project axios and plugin axios configuration inconsistency issue (legacy issue),
               To meet user's custom interface header parameter configuration needs
30. 2025-07-28 Fixed StarHorseTableColumn component not switching to corresponding component when clicking cell to edit data issue (need to set cellEditable to true in PageFieldInfo)
31. 2025-07-29 Fixed StarHorseSearchComp more query, input box without matching mode exception
32. 2025-08-01 Fixed page-select-item display issue, optimized StarHorseFormList component popup mode row addition added submit and continue button
33. 2025-08-02 Fixed StarHorseFormList different form data rendering in same instance, previous form data not clearing issue
34. 2025-08-04 Fixed StarHorseForm batch add data exception
                select-item,tselect-item components added header (select all) and footer (dynamic add options), switches showHeader,showFooter
35. 2025-08-05 select-item,tselect-item removed showHeader when configuring multiple selection multiple as true automatically displays, reducing parameter maintenance, added cascade component header
                and footer
                Fixed StarHorseDataSelector data selection and display Bug
36. 2025-08-06 Fixed StarHorseDataSelector data echo Bug
37. 2025-08-07 Fixed markdown-item component not displaying normally Bug, fixed button-item component initialization triggering click event
                Exported permissionsUrl variable in ApiUrls for custom permission interface
                In dictData function user can customize dictionary interface
                Exported DataPicker component
38. 2025-08-11 Fixed form container drag and switch bug
39. 2025-08-12 Fixed container component tabItem and collapseItem panel switch custom event not responding bug
40. 2025-08-13 Optimized starhorse-form-item component selection performance during dynamic form design. Extracted form component props parameters into interface
41. 2025-08-14 Added form design component linkage, implemented through dataRelation configuration item
                Fixed usercomp-item component name conflict issue
                Fixed datapicker-item,base-json-item component bugs
42. 2025-08-15 Fixed component v-bind parameters having dirty data causing component not to display normally issue
                Modified form linkage event triggering multiple times issue
                Optimized form linkage event Bug
43. 2025-08-21 Fixed collapseItem component change event error issue
44. 2025-08-28 Added internationalization language pack
45. 2025-08-29  Fixed form design component replacement popup height issue
