import {createServer} from "vite";
import {createSSRApp, h} from "vue";
import {renderToString} from "@vue/server-renderer";

const _win = {
  innerWidth: 375, innerHeight: 900, devicePixelRatio: 1,
  location: {href: "http://localhost/", search: "", hash: "", pathname: "/"},
  addEventListener() {}, removeEventListener() {}, dispatchEvent() { return true; },
  matchMedia: () => ({matches: false, addEventListener() {}, removeEventListener() {}}),
  getComputedStyle: () => ({getPropertyValue: () => ""}),
  requestAnimationFrame: (cb) => setTimeout(cb, 0), cancelAnimationFrame() {},
  localStorage: {getItem: () => null, setItem() {}, removeItem() {}, clear() {}},
  sessionStorage: {getItem: () => null, setItem() {}, removeItem() {}, clear() {}},
  scrollTo() {}, navigator: {userAgent: "Mozilla/5.0 (iPhone) Mobile", language: "zh-CN"},
};
globalThis.window = _win;
globalThis.document = {
  documentElement: {style: {}, appendChild() {}, setAttribute() {}}, head: {appendChild() {}},
  body: {appendChild() {}, style: {}},
  createElement: () => ({style: {}, setAttribute() {}, appendChild() {}, addEventListener() {}, removeEventListener() {}, classList: {add() {}, remove() {}}, getContext: () => null}),
  createTextNode: () => ({}), querySelector: () => null, querySelectorAll: () => [],
  addEventListener() {}, removeEventListener() {},
};
_win.document = globalThis.document; _win.top = _win; _win.self = _win;
Object.defineProperty(globalThis, "navigator", {value: {userAgent: "node", language: "zh-CN"}, configurable: true});
globalThis.localStorage = {getItem: () => null, setItem() {}, removeItem() {}, clear() {}};
globalThis.Storage = class Storage {getItem() { return null; } setItem() {} removeItem() {} clear() {} get length() { return 0; }};
globalThis.ResizeObserver = class {observe() {} unobserve() {} disconnect() {}};
globalThis.requestAnimationFrame = (cb) => setTimeout(cb, 0); globalThis.cancelAnimationFrame = () => {};
globalThis.getComputedStyle = () => ({getPropertyValue: () => ""});

const vite = await createServer({
  server: {middlewareMode: true}, appType: "custom", logLevel: "error",
  ssr: {noExternal: [/element-plus/]},
});
const load = async (p) => { try { return await vite.ssrLoadModule(p); } catch (e) { console.error("FAIL", p, e?.message); return null; } };

const fu = await load("/src/api/form_utils.ts");
const formMod = await load("/src/components/comp/StarHorseForm.vue");
const dataMod = await load("/src/sample/quality/data/inspectionForms.ts");
const ep = (await load("element-plus")).default;

const regCache = {};
const reg = async (app, name, p) => {
  if (!(name in regCache)) regCache[name] = (await load(p))?.default;
  if (regCache[name]) app.component(name, regCache[name]);
};
const registerComps = async (app) => {
  for (const n of ["descriptionsItem", "otherItem", "tableItem", "boxItem", "appItem", "groupItem"]) {
    await reg(app, n, `/src/components/comp/items/${n}.vue`);
    await reg(app, n.replace(/([A-Z])/g, "-$1").toLowerCase(), `/src/components/comp/items/${n}.vue`);
  }
  for (const n of ["checkmatrix-item", "starhorse-form-item", "input-item", "select-item", "number-item", "date-item", "html-item"]) {
    await reg(app, n, `/src/components/formcomp/items/${n}.vue`);
  }
  await reg(app, "star-horse-icon", "/src/components/comp/StarHorseIcon.vue");
  await reg(app, "star-horse-item", "/src/components/comp/StarHorseItem.vue");
  await reg(app, "star-horse-form-item", "/src/components/comp/StarHorseFormItem.vue");
  await reg(app, "star-horse-form-table", "/src/components/comp/StarHorseFormTable.vue");
  await reg(app, "star-horse-form-list", "/src/components/comp/StarHorseFormList.vue");
  await reg(app, "star-horse-form-list-app", "/src/components/comp/StarHorseFormListApp.vue");
  await reg(app, "sh-table-list-column", "/src/components/comp/ShTableListColumn.vue");
  await reg(app, "sh-error-tooltip", "/src/components/comp/items/ShErrorTooltip.vue");
  await reg(app, "u-table-column", "/src/components/comp/items/UTableColumn.vue");
  await reg(app, "star-horse-panel", "/src/components/comp/StarHorsePanel.vue");
  const helpMod = await load("/src/components/help.vue");
  if (helpMod?.default) app.component("help", helpMod.default);
};

const form = dataMod.dipIpqcForm;
const converted = fu.convertCompToAppComps({fieldList: form.fieldList.fieldList});
const app = createSSRApp(formMod.default, {
  fieldList: {fieldList: converted.fieldList},
  outerFormData: form.dataForm,
});
app.use(ep);
await registerComps(app);
const html = await renderToString(app);
console.log("=== APP 端渲染 len:", html.length);
const idxIssue = html.indexOf("问题点");
const cardSeg = html.slice(idxIssue, idxIssue + 4000);
console.log(`  卡片(app-card): ${html.includes("app-card") ? "YES" : "NO"}`);
console.log(`  卡片内输入控件(el-form-item): ${/el-form-item/.test(cardSeg) ? "YES" : "NO"}`);
console.log(`  卡片内输入框(el-input): ${/el-input/.test(cardSeg) ? "YES" : "NO"} | 整页 el-input 数: ${(html.match(/el-input/g) || []).length}`);
const inputSegIdx = html.indexOf("el-input", idxIssue);
console.log("=== 卡片内首个输入框上下文:", inputSegIdx > 0 ? html.slice(Math.max(0, inputSegIdx - 200), inputSegIdx + 200) : "未找到");
console.log(`  非只读展示(无 sh-table-list-column 纯文本分支): ${/el-form-item/.test(cardSeg) ? "YES" : "NO"}`);
console.log(`  操作按钮/新增: ${html.includes("app-card-actions") && html.includes("app-list-add") ? "YES" : "NO"}`);
const idxNote = html.indexOf("缺点定义");
console.log(`  缺点定义位置: ${idxNote} (最后: ${idxNote > idxIssue ? "YES" : "NO"})`);
const noteSeg = html.slice(idxNote, idxNote + 1200);
console.log(`  圆角矩形样式(border-radius): ${/border-radius:\s*8px/.test(noteSeg) || noteSeg.includes("border-radius") ? "YES" : "NO"}`);
console.log(`  说明块容器(user_html): ${/user_html/.test(noteSeg) ? "YES" : "NO"}`);
await vite.close();