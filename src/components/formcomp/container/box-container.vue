<script setup lang="ts" name="box-container">
import {ComponentInternalInstance, computed, getCurrentInstance, PropType} from 'vue';
import {warning} from '@/utils/message';
import {useDesignFormStore} from '@/store/DesignForm.ts';
import piniaInstance from '@/store/index.ts';

const props = defineProps({
  parentField: {type: String},
  isDesign: {type: Boolean,default: false},
  disabled: {type: Object as PropType<Boolean | String>},
  formInfo: {type: Object as PropType<any>},
  field: {type: Object as PropType<any>}
});
let designForm = useDesignFormStore(piniaInstance);
let draggingItem = computed(() => designForm.draggingItem);
const formData = defineModel("formData");
let isEdit = computed(() => designForm.isEdit);
const isDragging = computed(() => designForm.isDragging);
let boxCompList = computed(() => props.field);
let excludeContainerType: Array<string> = ['box', 'tab', 'table', 'dytable', 'collapse', 'card'];

const checkItem = (items: any) => {
  if (!items['items']) {
    items['items'] = [];
  }
};
const onDragAdd = (evt: Event, dataList: any) => {
  let newIndex = evt.newIndex;
  if (excludeContainerType.includes(draggingItem.value.itemType)) {
    warning('栅格容器不允许嵌套其他容器');
    let elements = props.field.preps.elements;
    for (let inde in elements) {
      let element = elements[inde];
      for (let sind in element?.columns) {
        let column = element.columns[sind];
        for (let i in column?.items) {
          let item = column.items[i];
          if (draggingItem.value.id == item.id) {
            console.log('find data', item);
            column.items.splice(i, 1);
          }
        }
      }
    }
    return false;
  }
  if (newIndex != null && newIndex != 'undefined') {
    let dataInfo = dataList[newIndex];
    designForm.selectItem(dataInfo, dataInfo.itemType, '');
  }
};

</script>
<template>
  <group-box-container class="star-horse-form-container"
                       :isDesign="isDesign"
                       :disabled="disabled"
                       :parentField="parentField" :form-item="boxCompList">
    <el-row
        v-for="element in boxCompList.preps.elements"
        :gutter="boxCompList.preps?.gutter || 10"
        :justify="boxCompList.preps?.justify || 'start'"
        :align="boxCompList.preps?.align || 'top'"
        :tag="boxCompList.preps?.tag || 'div'"
    >
      <el-col
          class="edit_col"
          :class="{'dragging-area':isDragging}"
          :item-key="index"
          :span="sdata.colspan || 24"
          v-for="(sdata, index) in element.columns"
          v-if="isEdit"
      >
        <draggable
            @add="(evt: Event) => onDragAdd(evt, sdata.items)"
            @dragover="checkItem(sdata)"
            class="smain-design"
            tag="div"
            group="starHorseGroup"
            ghostClass="ghost"
            animation="200"
            :list="sdata.items"
        >
          <template #item="{ element: data }">
            <div class="comp-item">
              <component
                  :key="data.id"
                  :field="data"
                  :formInfo="formInfo"
                  :isDesign="isDesign"
                  :disabled="disabled"
                  :is="data.itemType + (data.compType === 'container' ? '-container' : '-item')"
                  :parentField="boxCompList"
                  v-model:formData="formData"
              />
            </div>
          </template>
        </draggable>
      </el-col>
      <el-col
          :item-key="index"
          :span="sdata.colspan || 24"
          :class="{'dragging-area':isDragging}"
          style="border: none"
          v-else
          v-for="(sdata, index) in element.columns"
      >
        <template v-for="data in sdata.items">
          <component
              :field="data"
              :isDesign="isDesign"
              :disabled="disabled"
              :is="data.itemType + (data.compType === 'container' ? '-container' : '-item')"
              v-model:formData="formData"
              :formInfo="formInfo"
          />
        </template>
      </el-col>
    </el-row>
  </group-box-container>
</template>
<style lang="scss" scoped>
.smain-design {
  width: 100%;
  background: var(--star-horse-background);
  border-radius: 3px;
  min-height: 50px;
  display: flex;
  flex-direction: column;
  vertical-align: middle;
  justify-content: center;
  align-items: center;

  .ghost {
    content: "";
    font-size: 0;
    height: 3px;
    box-sizing: border-box;
    outline-width: 0;
    padding: 0;
    overflow: hidden;
  }
}

.edit_col {
  border: 1px dashed var(--star-horse-border—color);
  min-height: 50px;
}
</style>
