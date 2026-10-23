import {createServer} from "vite";
import {createSSRApp} from "vue";
import {renderToString} from "@vue/server-renderer";

const _win={innerWidth:1440,innerHeight:900,devicePixelRatio:1,location:{href:"http://localhost/",search:"",hash:"",pathname:"/"},addEventListener(){},removeEventListener(){},dispatchEvent(){return true},matchMedia:()=>({matches:false,addEventListener(){},removeEventListener(){}}),getComputedStyle:()=>({getPropertyValue:()=>"",cssText:""}),requestAnimationFrame:(cb)=>setTimeout(cb,0),cancelAnimationFrame(){},localStorage:{getItem:()=>null,setItem(){},removeItem(){},clear(){}},sessionStorage:{getItem:()=>null,setItem(){},removeItem(){},clear(){}},scrollTo(){},navigator:{userAgent:"Mozilla/5.0 (Windows NT 10.0) Chrome/120",language:"zh-CN"}};
globalThis.window=_win;
globalThis.document={documentElement:{style:{},appendChild(){},setAttribute(){}},head:{appendChild(){}},body:{appendChild(){},style:{}},createElement:()=>({style:{},setAttribute(){},appendChild(){},addEventListener(){},removeEventListener(){},classList:{add(){},remove(){}},getContext:()=>null}),createTextNode:()=>({}),querySelector:()=>null,querySelectorAll:()=>[],addEventListener(){},removeEventListener(){}};
_win.document=globalThis.document;_win.top=_win;_win.self=_win;
Object.defineProperty(globalThis,"navigator",{value:{userAgent:"node",language:"zh-CN"},configurable:true});
globalThis.localStorage={getItem:()=>null,setItem(){},removeItem(){},clear(){}};
globalThis.Storage=class{getItem(){return null}setItem(){}removeItem(){}clear(){}get length(){return 0}};
globalThis.ResizeObserver=class{observe(){}unobserve(){}disconnect(){}};
globalThis.requestAnimationFrame=(cb)=>setTimeout(cb,0);globalThis.cancelAnimationFrame=()=>{};
globalThis.getComputedStyle=()=>({getPropertyValue:()=>"",cssText:""});

const vite=await createServer({server:{middlewareMode:true},appType:"custom",logLevel:"error",ssr:{noExternal:[/element-plus/]}});
const load=async(p)=>{try{return await vite.ssrLoadModule(p)}catch(e){console.error("FAIL",p,e?.message);return null}};

const fu=await load("/src/api/form_utils.ts");
const formMod=await load("/src/components/comp/StarHorseForm.vue");
const dataMod=await load("/src/sample/quality/data/inspectionForms.ts");
const ep=(await load("element-plus")).default;

const regCache={};
const reg=async(app,name,p)=>{if(!(name in regCache))regCache[name]=(await load(p))?.default;if(regCache[name])app.component(name,regCache[name])};
const registerComps=async(app)=>{
  for(const n of["descriptionsItem","otherItem","tableItem","boxItem","appItem","groupItem","checkmatrixItem"]){
    await reg(app,n,`/src/components/comp/items/${n}.vue`);
    await reg(app,n.replace(/([A-Z])/g,"-$1").toLowerCase(),`/src/components/comp/items/${n}.vue`);
  }
  for(const n of["starhorse-form-item","input-item","select-item","number-item","date-item","html-item","textarea-item"]){
    await reg(app,n,`/src/components/formcomp/items/${n}.vue`);
  }
  await reg(app,"star-horse-item","/src/components/comp/StarHorseItem.vue");
  await reg(app,"star-horse-form-item","/src/components/comp/StarHorseFormItem.vue");
  await reg(app,"sh-table-list-column","/src/components/comp/ShTableListColumn.vue");
  await reg(app,"star-horse-form-list","/src/components/comp/StarHorseFormList.vue");
  await reg(app,"star-horse-form-list-app","/src/components/comp/StarHorseFormListApp.vue");
  await reg(app,"star-horse-form-table","/src/components/comp/StarHorseFormTable.vue");
  await reg(app,"star-horse-panel","/src/components/comp/StarHorsePanel.vue");
  await reg(app,"star-horse-icon","/src/components/comp/StarHorseIcon.vue");
  const helpMod=await load("/src/components/help.vue");
  if(helpMod?.default)app.component("help",helpMod.default);
};

const form=dataMod.dipIpqcForm;
const result=fu.analysisCompDatas(form.dataList||[]);
console.log("=== analysisCompDatas ===");
console.log("compFieldList length:",result.compFieldList?.length);
result.compFieldList?.forEach((f,i)=>{
  console.log("  ["+i+"] type="+(f.type||f.containerType||"?")+" containerType="+(f.containerType||"-")+" fieldName="+(f.fieldName||"-")+" containerFields="+(f.containerFields?.length||0));
  if(f.containerFields?.[0]?.fieldList){
    console.log("    fieldList rows:",f.containerFields[0].fieldList.length);
    console.log("    row0 cols:",f.containerFields[0].fieldList[0]?.length);
  }
});

const app=createSSRApp(formMod.default,{
  fieldList:{fieldList:result.compFieldList},
  outerFormData:form.dataForm,
  labelPosition:"top",
});
app.use(ep);
await registerComps(app);
const html=await renderToString(app);
console.log("=== SSR len:",html.length);
console.log("  cm-item-table:",html.includes("cm-item-table"));
console.log("  dynamic-table:",html.includes("dynamic-table"));
console.log("  cm-res:",html.includes("cm-res"));
console.log("  checkitem:",html.includes("checkitem"));
console.log("  el-descriptions:",html.includes("el-descriptions"));
await vite.close();
