<script setup lang="ts">
import { computed, onMounted, PropType, ref, watch } from "vue";
import { useDesignFormStore } from "@/store/DesignForm";
import piniaInstance from "@/store/index";
import { itemCheck, uuid } from "@/api/system";
import GroupContainer from "@/components/formcomp/container/group-container.vue";

defineOptions({
  name: "SplitterContainer",
});
const props = defineProps({
  parentField: { type: Object as PropType<any> },
  isDesign: { type: Boolean, default: false },
  showFormItem: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  formInfo: { type: Object as PropType<any> },
  field: { type: Object as PropType<any> },
});
let designForm = useDesignFormStore(piniaInstance);
const isDragging = computed(() => designForm.isDragging);
const formData = defineModel("formData");
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
    designForm.selectItem(dataInfo, dataInfo.itemType, "");
  }
};
const checkData = (adata: any) => {
  //:size="adata.size"
  //      :min="adata.min" :max="adata.max" :resizable="adata.resizable" :collapsible="adata.collapsible"
  if (adata.preps) {
    let temp = adata.preps;
    if (typeof temp == "string") {
      temp = JSON.parse(adata.preps);
    }
    return {
      size: temp.size,
      min: temp.min,
      max: temp.max,
      resizable: temp.resizable,
      collapsible: temp.collapsible
    }
  }
  return {};
}
onMounted(() => {
  if (!props.field["preps"]["elements"]) {
    props.field["preps"]["elements"] = [
      {
        label: "Splitter1",
        tabName: "splitter1",
        objectName: "splitter1",
        subFormFlag: "Y",
        items: [],
        preps: "{}"
      },
      {
        label: "Splitter2",
        tabName: "splitter2",
        objectName: "splitter2",
        subFormFlag: "Y",
        items: [],
        preps: "{}"
      },
    ];
  }
});
</script>
<template>
  <group-container class="star-horse-form-container" :showFormItem="showFormItem" :isDesign="isDesign"
    :disabled="disabled" :parentField="parentField" :form-item="field">
    <el-splitter :layout="field?.preps?.layout ?? 'horizontal'" :lazy="field?.preps?.lazy">
      <el-splitter-panel v-for="adata in field['preps']['elements']" v-bind="checkData(adata)">
        <draggable @add="(evt: Event) => onDragAdd(evt, adata['items'])" @dragover="checkItem(adata)"
          class="card-design" :class="{ 'dragging-area': isDragging }" group="starHorseGroup" animation="100"
          :item-key="uuid()" ghostClass="ghost" :list="adata['items']">
          <template #item="{ element: data }">
            <div class="comp-item">
              <component :key="data.id" :field="data" :isDesign="isDesign" :disabled="disabled"
                :showFormItem="showFormItem" :formInfo="formInfo" :is="itemCheck(data)" :parentField="field"
                v-model:formData="formData" />
            </div>
          </template>
        </draggable>
      </el-splitter-panel>
    </el-splitter>
  </group-container>
</template>
<style lang="scss" scoped>
:deep(.el-card) {
  margin-top: 10px;
}

:deep(.el-card__body) {
  margin-top: 5px;
}
</style>
