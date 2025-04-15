<script setup lang="ts" name="starhorse-form-item">
import {computed, onMounted, PropType, ref} from "vue";
import {useDesignFormStore} from "@/store/DesignForm.ts";
import piniaInstance from "@/store/index.ts";
import StarHorseDialog from "@/components/comp/StarHorseDialog.vue";
import FieldList from "@/components/formcomp/utils/FieldList.vue";
import {
  dynamicFormContextMenuData,
  getParentComp,
  moveDownItem,
  moveUpItem,
  removeItem
} from "@/plugins/AblesPlugin.ts";

const props = defineProps({
  parentField: {type: Object},
  parentId: {type: Object},
  formItem: {type: Object, required: true},
  isDesign: {type: Boolean, default: true},
  //是否需要css 修饰
  bareFlag: {type: Object as PropType<Boolean | String>, default: false}
});
let designForm = useDesignFormStore(piniaInstance);
let isEdit = computed(() => designForm.isEdit);
// let refresh = computed(() => designForm.refresh);
// let compList = computed(() => designForm.compList);
let currentItemId = computed(() => designForm.currentItemId);
let componentVisible = computed(() => {
  return designForm.componentVisible && currentItemId.value == props.formItem?.preps.id;
});
const selectParentContainer = () => {
  if (!isEdit.value) {
    return;
  }
  designForm.selectItem(props.parentField, "", "container");
};
const selectData = (data: any) => {
  if (!isEdit.value) {
    return;
  }
  designForm.selectItem(props.formItem, data.itemType, getParentComp(props.parentField));
};

const exchangeItem = () => {
  designForm.setComponentVisible(true);
};
const close = () => {
  designForm.setComponentVisible(false);
};
const changeItem = (item: any) => {
  props.formItem["itemType"] = item["itemType"];
  if (item.category == 2) {
    props.formItem["compType"] = "container";
  }
  props.formItem["preps"] = {
    ...props.formItem["preps"],
    itemNameLabel: item.itemName
  };
  close();
  selectData(props.formItem);
};
const itemContextMenuRef = ref();
const itemContextMenu = (evt: MouseEvent) => {
  evt.stopPropagation();
  evt.preventDefault();
  evt.props = props;
  itemContextMenuRef.value?.show(evt);
};
onMounted(() => {
});
</script>
<template>
  <star-horse-dialog
      box-width="450px"
      :is-view="true"
      :full-screen="false"
      title="更换组件"
      :self-func="true"
      :dialog-visible="componentVisible"
      @closeAction="close"
  >
    <template #footer>
      <el-button type="primary" size="default" @click="close">确定</el-button>
    </template>
    <field-list @selectData="changeItem"/>
  </star-horse-dialog>
  <div :class="{'item-info':formItem.preps?.itemType!='usercomp'}"
       :style="{margin:formItem.preps?.itemType=='button'?'5px auto':'unset'}" v-if="bareFlag===true||bareFlag=='Y'">
    <help :message="formItem.preps?.helpMsg" v-if="formItem.preps?.helpMsg"/>
    <slot></slot>
  </div>
  <div v-else class="form-item-operation">
    <div
        :class="{
        'design-star-horse': isEdit,
        'field-item': true,
        'active-item': currentItemId == formItem?.preps.id && isEdit
      }"
        v-if="isDesign"
        @click="selectData(formItem)"
        @contextmenu="itemContextMenu"
    >
      <el-form-item
          :size="formItem?.preps['size'] || 'default'"
          v-if="
          parentField?.itemType != 'table' && formItem.preps?.itemType != 'divider' && formItem?.preps['headerFlag'] != 'Y'
        "
          :label="formItem?.preps['hideLabel'] == 'Y' ? '' : formItem?.preps['label']"
          :prop="formItem?.preps['name']"
          :required="formItem?.preps['required'] == 'Y'"
          :rules="
          formItem?.preps['required'] == 'Y' ? [{ required: true, trigger: 'blur', message: '必须项不能为空' }] : []
        "
      >
        <help :message="formItem.preps?.helpMsg" v-if="formItem.preps?.helpMsg"/>
        <slot></slot>
      </el-form-item>
      <div v-else :class="{'bare-item':true,
                           'item-info':formItem.preps?.itemType!='usercomp'
                          }"
           :style="{margin:formItem?.itemType=='button'?'5px auto':'unset'}">
        <help :message="formItem.preps?.helpMsg" v-if="formItem.preps?.helpMsg"/>
        <slot></slot>
      </div>
      <div class="field-action" v-if="isEdit && currentItemId == formItem?.preps.id">
        <el-tooltip content="选择父容器" v-if="parentField?.itemType">
          <star-horse-icon
              @click.stop="selectParentContainer()"
              icon-class="select-parent"
              cursor="pointer"
              style="color: var(--star-horse-white)"
          />
        </el-tooltip>
        <el-tooltip content="更换组件">
          <star-horse-icon @click.stop="exchangeItem" icon-class="exchange" cursor="pointer"
                           style="color: var(--star-horse-white)"/>
        </el-tooltip>
        <el-tooltip content="上移" v-if="parentField?.itemType != 'table'">
          <star-horse-icon
              @click.stop="moveUpItem(isEdit, formItem?.preps, parentField)"
              icon-class="move-up"
              cursor="pointer"
              style="color: var(--star-horse-white)"
          />
        </el-tooltip>
        <el-tooltip content="下移" v-if="parentField?.itemType != 'table'">
          <star-horse-icon
              @click.stop="moveDownItem(isEdit, formItem?.preps, parentField)"
              icon-class="move-down"
              cursor="pointer"
              style="color: var(--star-horse-white)"
          />
        </el-tooltip>
        <el-tooltip content="删除组件">
          <star-horse-icon
              @click.stop="removeItem(isEdit, formItem?.preps, parentField)"
              icon-class="clear-all"
              cursor="pointer"
              style="color: var(--star-horse-white)"
          />
        </el-tooltip>
      </div>
      <div class="drag-handler" v-if="isEdit && currentItemId == formItem?.preps.id">
        <el-tooltip content="拖动">
          <star-horse-icon icon-class="drag" style="cursor: move; color: var(--star-horse-white)"/>
        </el-tooltip>

        <el-tooltip :content="formItem?.preps['itemNameLabel']">
          <span style="color: var(--star-horse-white); cursor: pointer" @click="selectData(formItem)">{{
              formItem?.preps["itemNameLabel"]
            }}</span>
        </el-tooltip>
      </div>
    </div>
    <div class="item-info" :style="{margin:formItem.preps?.itemType=='button'?'5px auto':'unset'}" v-else>
      <help :message="formItem.preps?.helpMsg" v-if="formItem.preps?.helpMsg"/>
      <slot></slot>
    </div>
    <Teleport to="body">
      <ContentMenu ref="itemContextMenuRef" :menu-data="dynamicFormContextMenuData(formItem, parentField, 'item')"/>
    </Teleport>
  </div>
</template>
<style lang="scss" scoped>
.form-item-operation {
  display: flex;
  flex: 1;
}

.item-info {
  display: inline-flex;
  width: 100%;
  align-items: center;
}

.active-item {
  border: 1px dashed var(--star-horse-style);
}

.design-star-horse {
  width: 100%;
  display: flex;
  justify-content: center;
  vertical-align: middle;
  align-items: center;
  min-height: 50px;
  z-index: 0;
}

.field-item {
  position: relative;
  width: 100%;
  height: 100%;
  vertical-align: middle;
  align-items: center;

  .bare-item {
    width: 100%;
    height: 100%;
  }

  .el-form-item {
    margin-bottom: 1px;
  }

  .field-action {
    position: absolute;
    //bottom: -25px;
    top: 0;
    transform: translate(0, -50%);
    right: 0;
    align-items: center;
    background: var(--star-horse-style);
    z-index: 99;
    display: flex;

    .svg-icon {
      font-size: 14px;
      color: var(--star-horse-white);
      margin: 4px;
      cursor: pointer;
    }
  }

  .drag-handler {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    background: var(--star-horse-style);
    z-index: 9999999;
    transform: translate(0, -50%);

    .svg-icon {
      font-size: 12px;
      font-style: normal;
      color: var(--star-horse-style);
      margin: 4px;

      &:first-child {
        cursor: move;
      }

      &:last-child {
        cursor: pointer;
      }
    }

    /*   &:hover {
       opacity: 1;
       background: var(--star-horse-style);
     }*/
  }
}

.field-action,
.drag-handler {
  :deep(.svg-icon) {
    margin-left: 0;
    margin-right: 0;
  }
}

.drag-handler {
  padding-right: 10px;
  font-size: 13px;
}

.el-form-item {
  //margin-bottom: 0 !important;
  //margin-bottom: 6px;
  //margin-top: 2px;
  position: relative;

  :deep(.el-form-item__label) {
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  span.custom-label i {
    margin: 0 3px;
  }

  /* 隐藏Chrome浏览器中el-input数字输入框右侧的上下调整小箭头 */
  :deep(.hide-spin-button) input::-webkit-outer-spin-button,
  :deep(.hide-spin-button) input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
  }

  /* 隐藏Firefox浏览器中el-input数字输入框右侧的上下调整小箭头 */
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
