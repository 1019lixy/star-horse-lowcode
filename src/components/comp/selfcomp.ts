import { App } from "vue";

const items = import.meta.glob("@/components/comp/*.vue", { eager: true });
export default function install(app: App<Element>) {
  for (const [key, mod] of Object.entries(items)) {
    const name = key.slice(key.lastIndexOf("/") + 1, key.lastIndexOf("."));
    app.component(name, (mod as any).default);
  }
}
