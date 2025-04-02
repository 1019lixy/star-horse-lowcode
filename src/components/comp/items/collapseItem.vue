<script setup lang="ts">
import StarHorseFormItem from "@/components/comp/StarHorseFormItem.vue";
import {onMounted, PropType} from "vue";
import {ApiUrls} from "@/components/types/ApiUrls";
import {FieldInfo} from "@/components/types/PageFieldInfo";
import {ModelRef} from "vue";
import {Config} from "@/api/settings.ts";
import {getDataIndex, getFormData, getPrefix,checkObject} from "@/api/form_utils.ts";

const props=defineProps({
  compUrl: {type: Object as PropType<ApiUrls>},
  item: {type: Array as PropType<Array<FieldInfo>>, required: true},
  objectName: {type: String},
  // 数据索引
  dataIndex: {type: Number, default: -1},
  // 父节点名称
  propPrefix: { type: String,default:"" },
  parentPreps: {type: Object, default: {}},
  subFormFlag: {type: String, default: "N"},
  batchName: {type: String, default: "batchDataList"},
  batchFieldName: {type: String, default: "batchFieldList"},
  primaryKey: {type: [String, Object] as PropType<string | any>,required:true},
  rules: {type: Object},
  compSize: {type: String, default: Config.compSize},
  isView: {type: Boolean, default: false},
  isEdit: {type: Boolean, default: false}
});
const emits = defineEmits(["addRow", "removeRow"]);
const dataForm: ModelRef<any> = defineModel("dataForm");
/**
 * 列表添加行数据
 * @param row
 */
const addRow = (row: any) => {
  emits("addRow", row);
};
/**
 * 列表删除行数据
 * @param row
 */
const removeRow = (row: any) => {
  emits("removeRow", row);
};
const init = () => {
};
onMounted(() => {
  init();
});
</script>

<template>
  <template v-if="item.collapseList?.length > 0">
    <el-scrollbar style="margin-top: 10px">
      <el-collapse v-model="item.fieldName" :accordion="item.preps?.accordion" v-on:change="item.actions">
        <template v-for="(collapseItem, key) in item.collapseList">
          <el-collapse-item
              v-if="collapseItem['disVisible']??Object.keys(collapseItem).length > 0"
              :name="collapseItem.tabName || key"
              :disabled="collapseItem.disabled"
              :index="checkObject(dataForm,collapseItem,key,dataIndex,propPrefix)"
          >
            <template #title>
              <div class="collapse-item-title title">
                <div style="width: 80%"
                >{{ collapseItem.title }}
                  <help v-if="collapseItem.helpMsg" :message="collapseItem.helpMsg"/>
                </div>
                <star-horse-icon v-if="collapseItem.icon" :icon-class="collapseItem.icon"/>
              </div>
            </template>
            <star-horse-form-item
                :isView="isView"
                :compUrl="compUrl"
                :compSize="compSize"
                @addRow="addRow"
                @removeRow="removeRow"
                :objectName="collapseItem.objectName"
                :dataForm="getFormData(collapseItem,dataForm,propPrefix,dataIndex,key)"
                :dataIndex="getDataIndex(collapseItem,propPrefix,dataIndex,key)"
                :propPrefix="getPrefix(collapseItem,propPrefix,dataIndex,key)"
                :fieldList="{
                ...collapseItem
              }"
                :rules="rules"
                :subFormFlag="collapseItem.subFormFlag"
                :primaryKey="primaryKey"
            />
          </el-collapse-item>
        </template>
      </el-collapse>
    </el-scrollbar>
  </template>
</template>

<style scoped lang="scss">
.el-collapse {
  margin: 5px 3px;

  :deep(.el-collapse-item__header) {
    border-bottom: 1px solid rgb(229, 230, 235);
    border-top: 1px solid rgb(229, 230, 235);
    height: 30px;
  }

  :deep(.el-collapse-item__wrap) {
    margin-top: 10px;
    border: unset;
  }
}
</style>
