import {createServer} from "vite";
import {createSSRApp, h} from "vue";
import {renderToString} from "@vue/server-renderer";
const _el=()=>({style:{},setAttribute(){},appendChild(){},addEventListener(){},removeEventListener(){},classList:{add(){},remove(){}},getContext:()=>null});
const _win={innerWidth:375,innerHeight:900,devicePixelRatio:1,location:{href:"http://localhost/",search:"",hash:"",pathname:"/"},addEventListener(){},removeEventListener(){},dispatchEvent(){return true},matchMedia:()=>({matches:false,addEventListener(){},removeEventListener(){}}),getComputedStyle:()=>({getPropertyValue:()=>""}),requestAnimationFrame:(cb)=>setTimeout(cb,0),cancelAnimationFrame(){},localStorage:{getItem:()=>null,setItem(){},removeItem(){},clear(){}},sessionStorage:{getItem:()=>null,setItem(){},removeItem(){},clear(){}},scrollTo(){},navigator:{userAgent:"Mozilla/5.0 (iPhone) Mobile",language:"zh-CN"}};
globalThis.window=_win;
globalThis.document={documentElement:{style:{},appendChild(){},setAttribute(){}},head:{appendChild(){}},body:{appendChild(){},style:{}},createElement:_el,createTextNode:()=>({}),querySelector:()=>null,querySelectorAll:()=>[],addEventListener(){},removeEventListener(){}};
_win.document=globalThis.document;_win.top=_win;_win.self=_win;
Object.defineProperty(globalThis,"navigator",{value:{userAgent:"node",language:"zh-CN"},configurable:true});
globalThis.localStorage={getItem:()=>null,setItem(){},removeItem(){},clear(){}};
globalThis.Storage=class{getItem(){return null}setItem(){}removeItem(){}clear(){}get length(){return 0}};
globalThis.ResizeObserver=class{observe(){}unobserve(){}disconnect(){}};
globalThis.requestAnimationFrame=(cb)=>setTimeout(cb,0);globalThis.cancelAnimationFrame=()=>{};
globalThis.getComputedStyle=()=>({getPropertyValue:()=>""});
const vite=await createServer({server:{middlewareMode:true},appType:"custom",logLevel:"error",ssr:{noExternal:[/element-plus/]}});
const load=async(p)=>{try{return await vite.ssrLoadModule(p)}catch(e){return null}};
const fu=await load("/src/api/form_utils.ts");
const formMod=await load("/src/components/comp/StarHorseForm.vue");
const dataMod=await load("/src/sample/quality/data/inspectionForms.ts");
const appListMod=await load("/src/components/comp/StarHorseFormListApp.vue");
const ep=(await load("element-plus")).default;
// 单独渲染 APP 卡片组件验证 label
const fieldList=[
 {label:"工序",fieldName:"process",type:"input",formVisible:true,listVisible:true,minWidth:110},
 {label:"不良现象",fieldName:"defect",type:"input",formVisible:true,required:true,listVisible:true,minWidth:180},
 {label:"责任判定",fieldName:"duty",type:"select",formVisible:true,listVisible:true,preps:{values:[{name:"来料",value:"incoming"}]}},
];
const app1=createSSRApp({render:()=>h(appListMod.default,{fieldList,dataList:[{process:"插件",defect:"物料标识缺失",duty:"incoming",xh:1,id:"r1"}],source:1,staticColumn:"N",size:"default",subTableName:"rows"})});
app1.use(ep);
const c=await load("/src/components/comp/ShTableListColumn.vue");
app1.component("sh-table-list-column",c?.default);
const cardHtml=await renderToString(app1);
console.log("=== APP 卡片组件:");
["app-card-label","工序","不良现象","责任判定","app-card-control","app-card-required","app-list-add"].forEach(k=>console.log(`  ${cardHtml.includes(k)?"YES":"NO "}  ${k}`));
// descriptions direction 验证(取 sample 容器配置)
const form=dataMod.dipIpqcForm;
const descField=form.fieldList.fieldList.find(f=>f.containerType==="descriptions");
console.log("=== descriptions 容器 direction:", descField.preps.direction, "(vertical=label 顶部)");
await vite.close();
