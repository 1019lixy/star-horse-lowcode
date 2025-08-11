<script setup lang="ts" name="tab-container">
import { computed, onMounted, PropType, ref, watch } from "vue";
import { useDesignFormStore } from "@/store/DesignForm";
import piniaInstance from "@/store/index";
import { compKey, itemCheck, uuid } from "@/api/system";

const props = defineProps({
  parentField: { type: String },
  isDesign: { type: Boolean, default: false },
  showFormItem: { type: Boolean, default: false },
  disabled: { type: Object as PropType<Boolean | String> },
  formInfo: { type: Object as PropType<any> },
  field: { type: Object as PropType<any> },
});
let designForm = useDesignFormStore(piniaInstance);
const isDragging = computed(() => designForm.isDragging);
const formData = defineModel("formData");
let containerType: Array<string> = [
  "tab",
  "box",
  "table",
  "card",
  "dytable",
  "collapse",
];

const isContainer = (data: any) => {
  return containerType.includes(data.itemType);
};
/**
 * 如果没有items，动态添加
 * @param adata
 */
const checkItem = (adata: any) => {
  if (!adata["items"]) {
    adata["items"] = [];
  }
};
const onDragAdd = (evt: Event | any, dataList: any) => {
  let newIndex = evt.newIndex;
  if (newIndex != null && newIndex != "undefined") {
    let dataInfo = dataList[newIndex];
    // designForm.setDraggingItem({});
    designForm.selectItem(dataInfo, dataInfo.itemType, "");
  }
};
const activeTabName = ref();
onMounted(() => {
  if (!props.field["preps"]["elements"]) {
    props.field["preps"]["elements"] = [
      {
        label: "Tab1",
        tabName: "tab1",
        objectName: "tab1",
        subFormFlag: "Y",
        items: [],
      },
      {
        label: "Tab2",
        tabName: "tab2",
        objectName: "tab2",
        subFormFlag: "Y",
        items: [],
      },
    ];
    props.field["stretch"] = "N";
  }
  activeTabName.value = props.field.preps.elements[0].tabName;
});
watch(
  () => activeTabName.value,
  (val) => {
    props.field["activeItemName"] = val;
  },
  { immediate: true, deep: true },
);
const dynamicFunc = (funcType: string, funcCode: any) => {
  let func = new Function(funcCode);
  func.call(this);
};
const addTab = () => {};
</script>
<template>
  <group-container
    class="star-horse-form-container"
    :showFormItem="showFormItem"
    :isDesign="isDesign"
    :disabled="disabled"
    :parentField="parentField"
    :form-item="field"
  >
    <el-tabs
      class="tab-container"
      :tab-position="field.preps['tablePosition'] || 'top'"
      :type="field.preps['type'] || ''"
      :closable="field.preps['closable']"
      :addable="field.preps['addable']"
      :editable="field.preps['editable']"
      :stretch="field.preps['stretch']"
      v-model="activeTabName"
      @tab-add="addTab()"
      @tab-click="dynamicFunc('tabClick', field['tabClick'])"
      @tab-change="dynamicFunc('tabChange', field['tabChange'])"
      @tab-remove="dynamicFunc('tabRemove', field['tabRemove'])"
    >
      <el-tab-pane
        v-for="(adata, key) in field['preps']['elements']"
        :key="compKey(adata, key)"
        :label="adata['label']"
        :name="adata['tabName']"
      >
        <el-scrollbar height="100%" :class="{ 'dragging-area': isDragging }">
          <draggable
            @add="(evt: Event) => onDragAdd(evt, adata['items'])"
            @dragover="checkItem(adata)"
            class="tab-design"
            group="starHorseGroup"
            animation="100"
            :item-key="uuid()"
            ghostClass="ghost"
            :list="adata['items']"
          >
            <template #item="{ element: data }">
              <div
                class="comp-item"
                :style="{ marginTop: isContainer(data) ? '25px' : '10px' }"
              >
                <component
                  :key="data.id"
                  :field="data"
                  :isDesign="isDesign"
                  :disabled="disabled"
                  :showFormItem="showFormItem"
                  :formInfo="formInfo"
                  :is="itemCheck(data)"
                  :parentField="field"
                  v-model:formData="formData"
                />
              </div>
            </template>
          </draggable>
        </el-scrollbar>
      </el-tab-pane>
    </el-tabs>
  </group-container>
</template>
<style lang="scss" scoped>
</style>
