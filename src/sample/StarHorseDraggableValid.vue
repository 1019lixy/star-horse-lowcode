<script setup lang="ts" name="Areainfo">
import {ref} from "vue";
import {DynamicNode} from "@/components/types";
import {StarHorseDraggable} from "@/components/comp";

let json = ref<Array<DynamicNode>>([
  {
    id: "a",
    label: "节点1",
    name: "nondea",
    styles: {
      left: 100,
      width: 200,
      height: 200,
      top: 200,
    },
    preps: {},
  },
  {
    id: "b",
    label: "节点2",
    name: "node",
    preps: {
      width: 200,
      height: 200,
    },
  },
]);
const editorData = ref<any>({});
const activeOperation = (item: DynamicNode) => {
  console.log(item);
  editorData.value = item;
};
const contextAction = (actionName: string, item: DynamicNode) => {
  console.log(actionName, item);
};
</script>
<template>
  <div class="module-grid w-full overflow-y-auto h-full">
    <div></div>
    <StarHorseDraggable
        :isDesign="true"
        ref="editor"
        :isActive="editorData.id == item.id"
        @contextAction="contextAction"
        sizeControlType="px"
        :node="item"
        v-for="item in json"
        :key="item.id"
    >
      <div @click="activeOperation(item)" class="w-full h-full">
        {{ item.label }} {{ editorData }}
      </div>
    </StarHorseDraggable>
  </div>
</template>
<style lang="scss" scoped>
.module-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, auto));
  gap: 20px;
  background: #f5f5f5;
  align-items: start;
  padding: 20px;
  border-radius: 8px;
  position: relative;
}
</style>
