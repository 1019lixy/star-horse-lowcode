<script setup lang="ts" name="GroupBoxContainer">
import {operationConfirm, warning} from '@/utils/message';
import piniaInstance from '@/store/index';
import {useDesignFormStore} from '@/store/DesignForm';
import {computed, PropType, ref} from 'vue';
import {colDataInfo} from '@/components/formcomp/container/dytableUtils';
import {dynamicFormContextMenuData} from '@/plugins/AblesPlugin';
import FieldList from '@/components/formcomp/utils/FieldList.vue';
import StarHorseDialog from '@/components/comp/StarHorseDialog.vue';
import {fieldCopy} from '@/utils/FieldOperationUtils';

const props = defineProps({
  isDesign: {type: Boolean, default: false},
  disabled: {type: Object as PropType<Boolean | String>},
  parentField: {type: Object},
  formItem: {type: Object, required: true}
});
let designForm = useDesignFormStore(piniaInstance);
let compList = computed(() => designForm.compList);
let currentItemId = computed(() => designForm.currentItemId);
let componentVisible = computed(() => {
  return designForm.componentVisible && currentItemId.value == props.formItem?.preps.id;
});
let isEdit = computed(() => designForm.isEdit);
const selectData = () => {
  let container = props.formItem;
  designForm.selectItem(container, container?.itemType, '');
};
const removeData = () => {
  operationConfirm('删除容器，容器内的所有元素都会被删除').then((res) => {
    if (res) {
      let id = props.formItem.preps?.id || props.formItem.id;
      if (props.parentField?.itemType == 'tab') {
        let elements = props.parentField!.preps.elements;
        for (let i = 0; i < elements.length; i++) {
          let items = elements[i].items;
          for (let j = 0; j < items.length; j++) {
            if (id === items[j]?.id) {
              items.splice(j, 1);
              return;
            }
          }
        }
      } else if (props.parentField?.itemType == 'box') {
      } else {
        let dataList = compList.value;
        for (let i = 0; i < dataList.length; i++) {
          if (id === dataList[i].id) {
            dataList.splice(i, 1);
          }
        }
      }
    }
  });
};
const containerContextMenuRef = ref();
const containerContextMenu = (evt: MouseEvent | any) => {
  if (!isEdit.value) return;
  evt.stopPropagation();
  evt.preventDefault();
  evt.props = props;
  containerContextMenuRef.value?.show(evt);
};
const close = () => {
  designForm.setComponentVisible(false);
};
const addItem = (item: any) => {
  let type = item.category == 2 ? 'container' : 'formItem';
  let data = fieldCopy(item, type);
  let itemType = props.formItem.itemType;
  let activeItemName = props.formItem.activeItemName;
  let elements = props.formItem.preps.elements;
  for (let index in elements) {
    let element = elements[index];
    if (activeItemName && activeItemName != element.tabName) {
      continue;
    }
    let columns = element.columns;
    if (!columns) {
      let items = element.items;
      if (itemType == 'table') {
        if (items.length == 0) {
          items.push(data);
          return;
        }
      } else {
        items.push(data);
        return;
      }
    }
    for (let colIndex in columns) {
      let col = columns[colIndex];
      if (col.items.length == 0) {
        col.items.push(data);
        return;
      }
    }
  }
};
const tableOperation = (actonName: string, _preps: any) => {
  let preps = props.formItem.preps;
  if (!preps.elements) {
    preps['elements'] = [];
  }
  let isBox = props.formItem.itemType == 'box';
  if (actonName == 'insertRow') {
    //获取最大的数字
    let rows: Array<any> = preps.elements;
    if (rows.length > 0) {
      let columns: Array<any> = [];
      let len: number = 1;
      for (let index in rows) {
        let colLen = rows[index]?.columns?.length;
        if (colLen > len) {
          len = colLen;
        }
      }
      for (let i = 0; i < len; i++) {
        let col = colDataInfo();
        if (isBox) {
          col.colspan = 24 / len;
        }
        columns.push(col);
      }
      preps.elements.push({
        columns: columns
      });
    } else {
      let col = colDataInfo();
      if (isBox) {
        col.colspan = 24;
      }
      preps.elements.push({
        columns: []
      });
    }
  } else if (actonName == 'insertCol') {
    if (props.formItem.itemType == 'table') {
      preps.columns = (preps.columns || 1) + 1;
      return;
    }
    for (let index in preps.elements) {
      let row: any = preps.elements[index];
      if (!row.columns) {
        row['columns'] = [];
      }
      let col = colDataInfo();
      if (isBox) {
        col.colspan = 24 / (row.columns.length + 1);
        row.columns.forEach((item: any) => {
          item.colspan = col.colspan;
        });
      }
      row.columns.push(col);
    }
  } else if (actonName == 'copy') {
    //拷贝容器
    warning("功能开发中")
  }
};
</script>
<template>
  <star-horse-dialog
      box-width="450px"
      :is-view="true"
      :full-screen="false"
      title="添加组件"
      :self-func="true"
      :dialog-visible="componentVisible"
      @closeAction="close"
  >
    <template #footer>
      <el-button type="primary" size="default" @click="close">确定</el-button>
    </template>
    <field-list @selectData="addItem"/>
  </star-horse-dialog>
  <div class="field-item" v-if="isEdit&&isDesign" @contextmenu="containerContextMenu">
    <slot></slot>
    <div class="drag-handler"  v-if="isEdit&&isDesign && currentItemId == formItem.id">
      <el-tooltip content="拖动">
        <star-horse-icon  icon-class="drag" size="18px" style="color: var(--star-horse-white)"/>
      </el-tooltip>
      <el-tooltip content="选中容器">
        <star-horse-icon
            cursor="pointer"
            @click.stop="selectData"
            icon-class="select-parent"
            style="color: var(--star-horse-white)"
        />
      </el-tooltip>
      <el-tooltip content="删除容器">
        <star-horse-icon
            cursor="pointer"
            @click.stop="removeData"
            icon-class="clear-all"
            style="color: var(--star-horse-white)"
        />
      </el-tooltip>
    </div>
    <div class="field-action" v-if="isEdit&&isDesign && currentItemId == formItem.id">
      <template v-if="formItem.itemType == 'dytable' || formItem.itemType == 'box'">
        <el-tooltip content="插入行">
          <star-horse-icon
              @click.stop="tableOperation('insertRow', formItem?.preps)"
              icon-class="insert_row"
              cursor="pointer"
              style="color: var(--star-horse-white)"
          />
        </el-tooltip>
      </template>
      <template v-if="formItem.itemType == 'dytable' || formItem.itemType == 'box' || formItem.itemType == 'table'">
        <el-tooltip content="插入列">
          <star-horse-icon
              @click.stop="tableOperation('insertCol', formItem?.preps)"
              icon-class="insert_col"
              cursor="pointer"
              style="color: var(--star-horse-white)"
          />
        </el-tooltip>
      </template>
      <el-tooltip content="复制容器">
        <star-horse-icon
            @click.stop="tableOperation('copy',formItem?.preps)"
            icon-class="copy"
            style="color: var(--star-horse-white)"
        />
      </el-tooltip>
    </div>
    <Teleport to="body">
      <ContentMenu
          ref="containerContextMenuRef"
          :menu-data="dynamicFormContextMenuData(formItem, parentField, 'container')"
      />
    </Teleport>
  </div>
  <div class="field-item" style="border: unset" v-else>
    <slot></slot>
  </div>
</template>
<style lang="scss" scoped>
.field-item {
  border: 1px dashed #e6a23c;
}

.el-form-item {
  position: relative;
  :deep(.el-form-item__label) {
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  span.custom-label .icon-cls {
    margin: 0 3px;
  }

  :deep(.hide-spin-button) input::-webkit-outer-spin-button,
  :deep(.hide-spin-button) input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
  }

  :deep(.hide-spin-button) input[type="number"] {
    -moz-appearance: textfield;
  }
}

.required :deep(.el-form-item__label)::before {
  content: "*";
  color: #f56c6c;
  margin-right: 4px;
}

.static-content-item {
  min-height: 20px;
  display: flex; /* 垂直居中 */
  align-items: center; /* 垂直居中 */
  :deep(.el-divider--horizontal) {
    margin: 0;
  }
}

.el-form-item.selected,
.static-content-item.selected {
  outline: 2px solid var(--star-horse-style);
}

:deep(.label-left-align) .el-form-item__label {
  text-align: left;
  justify-content: flex-start !important;
}

:deep(.label-center-align) .el-form-item__label {
  text-align: center;
  justify-content: center !important;
}

:deep(.label-right-align) .el-form-item__label {
  text-align: right;
  justify-content: flex-end !important;
}
</style>
