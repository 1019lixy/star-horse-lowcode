import { createPinia } from "pinia";
import piniaPersist from "pinia-plugin-persistedstate";

const piniaInstance = createPinia();
piniaInstance.use(piniaPersist);
export default piniaInstance;
