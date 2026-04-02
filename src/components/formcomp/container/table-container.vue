<script setup lang="ts" name="table-container">
// 右键菜单组件
import {computed, PropType, ref} from "vue";
import {operationConfirm, warning} from "@/utils/message";
import {useDesignFormStore} from "@/store/DesignForm";
import piniaInstance from "@/store/index";
import StarHorseIcon from "@/components/comp/StarHorseIcon.vue";
import {itemCheck, uuid} from "@/api/system";
import {i18n} from "@/lang";
import GroupContainer from "@/components/formcomp/container/group-container.vue";

let containerTableRef = ref(); // 强制刷新表格
const props = defineProps({
  parentField: {type: Object as PropType<any>},
  isDesign: {type: Boolean, default: false},
  showFormItem: {type: Boolean, default: false},
  disabled: {type: Boolean, default: false},
  formInfo: {type: Object as PropType<any>},
  field: {type: Object as PropType<any>},
  compSize: {type: String, default: "default"},
});
let designForm = useDesignFormStore(piniaInstance);
let draggingItem = computed(() => designForm.draggingItem);
let excludeContainerType: Array<string> = [
  "box",
  "tab",
  "table",
  "dytable",
  "collapse",
  "card",
];
let isEdit = computed(() => props.isDesign);
const isDragging = computed(() => designForm.isDragging);
const formData = defineModel("formData");
const rowHeight = computed(() => {
  if (props.compSize == "large") {
    return "45px";
  } else if (props.compSize == "small") {
    return "35px";
  } else {
    return "40px";
  }
});
const onDragAdd = (evt: Event | any, dataList: any) => {
  let newIndex = evt.newIndex;
  if (excludeContainerType.includes(draggingItem.value.itemType)) {
    warning(i18n("table.containerCannotNest"));
    let elements = props.field.preps.elements;
    for (let inde in elements) {
      let element = elements[inde];
      for (let sind in element?.columns) {
        let column = element.columns[sind];
        for (let i in column?.items) {
          let item = column.items[i];
          if (draggingItem.value.id == item.id) {
            column.items.splice(i, 1);
          }
        }
      }
    }
    return false;
  }
  if (newIndex != null && newIndex != "undefined") {
    let dataInfo = dataList[newIndex];
    designForm.selectItem(dataInfo, dataInfo.itemType, "");
  }
};
const analysisData = (index: number) => {
  let field = props.field?.preps;
  let elements = field?.elements;
  let f = elements.find((item: any) => item.colIndex == index);
  if (index > 1) {
    if (!f) {
      elements.push({
        colIndex: index,
        items: [],
      });
    }
  }
  return f?.items[0]?.preps?.label || `Title${index}`;
};
let currentIndex = ref<number>(-1);
const tdOver = (evt: MouseEvent, index: number) => {
  evt.preventDefault();
  evt.stopPropagation();
  if (currentIndex.value == index) {
    return;
  }
  currentIndex.value = index;
};
const tdOut = (evt: MouseEvent, _index: number) => {
  evt.preventDefault();
  evt.stopPropagation();
  currentIndex.value = 0;
};
const deleteCol = (index: number) => {
  operationConfirm(i18n("table.confirmDeleteColumn")).then((res: boolean) => {
    if (res) {
      let elements = props.field.preps.elements;
      elements.splice(index - 1, 1);
      for (let index in elements) {
        elements[index].colIndex = parseInt(index) + 1;
      }
      props.field.preps.columns = props.field.preps.columns - 1;
      currentIndex.value = 0;
    }
  });
};
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
    <table
        ref="containerTableRef"
        class="dynamic-table"
        :style="{
        border: isEdit && isDesign ? '1px solid #dfe6ec' : 'none',
      }"
    >
      <thead class="container-thead">
      <tr>
        <th
            v-for="td of parseInt(field.preps.columns || 1)"
            @mouseenter="(evt) => tdOver(evt, td)"
            @mouseleave="(evt) => tdOut(evt, td)"
        >
          <div class="td-operator" v-if="currentIndex == td && isDesign">
            <el-tooltip content="删除列">
              <star-horse-icon
                  icon-class="delete"
                  cursor="pointer"
                  color="var(--el-color-danger)"
                  @click="deleteCol(td)"
              />
            </el-tooltip>
          </div>
          {{ analysisData(td) }}
        </th>
      </tr>
      </thead>
      <tbody>
      <tr class="dy-tr">
        <template v-for="td of parseInt(field.preps.columns || 1)">
          <td
              :style="{
               width: field.colWidth || '100%',
              height: field.colHeight || rowHeight,
              'word-break': !!field.wordBreak ? 'break-all' : 'normal',
              'text-overflow': 'ellipsis'
              }"
              class="edit_col dy-cell"
              :class="{
                'dragging-area': isDragging,
                'no-drag': !isDesign,
              }"
              @mouseenter="(evt) => tdOver(evt, td)"
              @mouseleave="(evt) => tdOut(evt, td)"
          >
            <draggable
                @add="
                  (evt: Event) =>
                    onDragAdd(evt, field.preps.elements[td - 1].items)
                "
                class="smain-design"
                tag="div"
                group="starHorseGroup"
                ghostClass="container_ghost"
                animation="200"
                :item-key="uuid()"
                :list="field.preps.elements[td - 1].items"
            >
              <template #item="{ element: data }">
                <div
                    :class="{
            'comp-item': data?.preps?.headerFlag != 'Y',
            'bare-item': data?.preps?.headerFlag,
          }"
                    style="height: 100%"
                >
                  <component
                      :key="data?.id"
                      :field="data"
                      :showFormItem="showFormItem"
                      :isDesign="isDesign"
                      :disabled="disabled"
                      :formInfo="formInfo"
                      :is="itemCheck(data)"
                      :parentField="field"
                      v-model:formData="formData"
                  />
                </div>
              </template>
            </draggable>
          </td>
        </template>
      </tr>
      </tbody>
    </table>
  </group-container>
</template>
<style lang="scss" scoped>
/*table {
  display: table;
  border-collapse: separate;
  box-sizing: border-box;
  text-indent: initial;
  unicode-bidi: isolate;
  border-spacing: 2px;
  border-color: gray;
}

tr {
  display: table-row;
  vertical-align: inherit;
  unicode-bidi: isolate;
  border-color: inherit;
}*/

.container-thead tr {
  background: var(--star-horse-shadow);
  display: table-row;
  vertical-align: inherit;
  unicode-bidi: isolate;
  height: 35px;
  border-radius: 3px;
  margin-bottom: 5px;
  border: 1px solid #dfe6ec;
}

th {
  position: relative;
  border: 1px solid #dfe6ec;
  table-layout: fixed;
  .td-operator {
    position: absolute;
    right: 0;
    top: 0;
    z-index: 9999;
  }
}

tr {
  width: 100%;
}

.td-clz {
  flex-direction: row;
  padding: 5px;
  border: 1px solid #dfe6ec;
  border-top: none;
  height: 35px;
}

.comp-item {
  margin: unset;
}

.dynamic-table {
  width: 100%;
  border-collapse: collapse;

  thead {
    background: var(--star-horse-font-color);
    height: 30px;
    font-size: 14px;
  }
}
</style>
