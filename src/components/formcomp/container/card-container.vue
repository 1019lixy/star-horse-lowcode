<script setup lang="ts" name="card-container">
import {computed, onMounted, PropType, ref} from 'vue';
import {useDesignFormStore} from '@/store/DesignForm.ts';
import piniaInstance from '@/store/index.ts';
import {uuid} from '@/api/system.ts';

const props = defineProps({
  parentField: {type: String},
  isDesign: {type: Boolean,default: false},
  disabled: {type: Object as PropType<Boolean | String>},
  formInfo: {type: Object as PropType<any>},
  formData: {type: Object as PropType<any>},
  field: {type: Object as PropType<any>}
});
let designForm = useDesignFormStore(piniaInstance);
const isDragging = computed(() => designForm.isDragging);
let containerType: Array<string> = ['tab', 'box', 'table', 'card', 'dytable', 'collapse'];
const getComponentName = (data: any) => {
  return containerType.includes(data.itemType) ? data.itemType + '-container' : data.itemType + '-item';
};
const isContainer = (data: any) => {
  return containerType.includes(data.itemType);
};
/**
 * 如果没有items，动态添加
 * @param adata
 * @param type
 */
const checkItem = (adata: any, type: string) => {
  if (type == 'header') {
    if (!adata['headerFieldList']) {
      adata['headerFieldList'] = [];
    }
  } else {
    if (!adata['items']) {
      adata['items'] = [];
    }
  }
};
const onDragAdd = (evt: Event, dataList: any) => {
  console.log(evt, dataList);
  let newIndex = evt.newIndex;
  if (newIndex != null && newIndex != 'undefined') {
    let dataInfo = dataList[newIndex];
    designForm.selectItem(dataInfo, dataInfo.itemType, '');
  }
};
const activeTabName = ref();
onMounted(() => {
  if (!props.field['preps']['elements']) {
    props.field['preps']['elements'] = [
      {
        label: 'Card',
        tabName: 'card',
        objectName: 'card',
        subFormFlag: 'Y',
        headerFieldList: [],
        items: []
      }
    ];
    props.field['stretch'] = 'N';
  }
  activeTabName.value = 0; // props.field?["tabList"][0]["name"] || 0;
});
</script>
<template>
  <group-box-container class="star-horse-form-container"
                       :isDesign="isDesign"
                       :parentField="parentField" :form-item="field">
    <el-card class="card-container" :shadow="field.preps['shadow'] == 'Y'" v-for="adata in field['preps']['elements']">
      <template #header>
        <div class="card-header flex items-center justify-between ">
          <div class="w-[60%]">
            {{ adata.title || adata.tabName }}
            <help v-if="adata.helpMsg" :message="adata.helpMsg"/>
          </div>
          <div class="flex-1  min-h-[40px]" :class="{'dragging-area':isDragging}">
            <draggable
                @add="(evt: Event) => onDragAdd(evt, adata['headerFieldList'])"
                @dragover="checkItem(adata,'header')"
                class="card-design"
                group="starHorseGroup"
                animation="100"
                :item-key="uuid()"
                ghostClass="ghost"
                v-model="adata['headerFieldList']"
            >
              <template #item="{ element: header }">
                <div class="comp-item" :style="{marginTop:isContainer(header)?'25px':'10px'}">
                  <component
                      :key="header.id"
                      :field="header"
                      :isDesign="isDesign"
                      :disabled="disabled"
                      :formInfo="formInfo"
                      :is="getComponentName(header)"
                      :parentField="field"
                      :formData="formData"
                  />
                </div>
              </template>
            </draggable>
          </div>
        </div>
      </template>

      <el-scrollbar height="100%" class="min-h-20" :class="{'dragging-area':isDragging}">
        <draggable
            @add="(evt: Event) => onDragAdd(evt, adata['items'])"
            @dragover="checkItem(adata,'body')"
            class="card-design"
            group="starHorseGroup"
            animation="100"
            :item-key="uuid()"
            ghostClass="ghost"
            v-model="adata['items']"
        >
          <template #item="{ element: item }">
            <div class="comp-item">
              <component
                  :key="item.id"
                  :field="item"
                  :isDesign="isDesign"
                  :disabled="disabled"
                  :formInfo="formInfo"
                  :is="getComponentName(item)"
                  :parentField="field"
                  :formData="formData"
              />
            </div>
          </template>
        </draggable>
      </el-scrollbar>
    </el-card>
  </group-box-container>
</template>
<style lang="scss" scoped>
.card-design {
  height: 100%;
  min-height: 200px;
  overflow-y: auto;
}
</style>
