import { App, defineAsyncComponent } from "vue";

const containers = import.meta.glob("@/components/formcomp/container/*.vue");
export default function install(app: App<Element>) {
  for (const [key, value] of Object.entries(containers)) {
    const name = key.slice(key.lastIndexOf("/") + 1, key.lastIndexOf("."));
    app.component(name, defineAsyncComponent(value as any));
  }
}
