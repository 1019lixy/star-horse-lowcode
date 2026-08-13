import { App } from "vue";

const containers = import.meta.glob("@/components/comp/items/*.vue", {
  eager: true,
});
export default function install(app: App<Element>) {
  for (const [key, mod] of Object.entries(containers)) {
    const name = key.slice(key.lastIndexOf("/") + 1, key.lastIndexOf("."));
    app.component(name, (mod as any).default);
  }
}
