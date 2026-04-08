<script setup lang="ts" name="collapse-container">
import { computed, onMounted, PropType, ref, watch } from "vue";
import { useDesignFormStore } from "@/store/DesignForm";
import piniaInstance from "@/store/index";
import { itemCheck, uuid } from "@/api/system";

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
const activeTabName = ref();
onMounted(() => {
  if (!props.field["preps"]) {
    props.field["preps"] = {};
  }
  if (!props.field["preps"]?.["elements"]) {
    props.field["preps"]["elements"] = [
      {
        label: "Collapse1",
        tabName: "collapse1",
        objectName: "collapse1",
        subFormFlag: "Y",
        items: [],
      },
      {
        label: "Collapse2",
        tabName: "collapse2",
        objectName: "collapse2",
        subFormFlag: "Y",
        items: [],
      },
    ];
  }
  activeTabName.value = props.field["preps"]["elements"][0].tabName;
});
watch(
  () => activeTabName.value,
  (val) => {
    props.field["activeItemName"] = val;
    designForm.setCurrentSubTabName(val);
  },
  { immediate: true, deep: true },
);
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
    <el-collapse
      v-model="activeTabName"
      class="collapse-container"
      :accordion="field.preps['accordion']"
    >
      <el-collapse-item
        v-for="adata in field['preps']['elements']"
        :name="adata.tabName"
      >
        <template #title>
          <div class="collapse-item-title title">
            <div>{{ adata.label || adata.objectName }}</div>
          </div>
        </template>
        <draggable
          @add="(evt: Event) => onDragAdd(evt, adata['items'])"
          @dragover="checkItem(adata)"
          class="card-design"
          :class="{ 'dragging-area': isDragging }"
          group="starHorseGroup"
          animation="100"
          :item-key="uuid()"
          ghostClass="ghost"
          :list="adata['items']"
        >
          <template #item="{ element: data }">
            <div class="comp-item  my-[5px]">
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
      </el-collapse-item>
    </el-collapse>
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
