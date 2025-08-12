<script setup lang="ts">
import StarHorseFormItem from "@/components/comp/StarHorseFormItem.vue";
import { ModelRef, onMounted, PropType } from "vue";
import { ApiUrls } from "@/components/types/ApiUrls";
import { FieldInfo } from "@/components/types/PageFieldInfo";
import { Config } from "@/api/settings";
import {
  checkObject,
  checkVisible,
  getDataIndex,
  getFormData,
  getPrefix,
  loadProp,
  validMsg,
} from "@/api/form_utils";
import { compKey } from "@/api/system";

const props = defineProps({
  compUrl: { type: Object as PropType<ApiUrls> },
  item: { type: Array as PropType<any>, required: true },
  objectName: { type: String },
  // 数据索引
  dataIndex: { type: Number, default: -1 },
  // 父节点名称
  propPrefix: { type: String, default: "" },
  parentPreps: { type: Object, default: {} },
  subFormFlag: { type: String, default: "N" },
  batchName: { type: String, default: "batchDataList" },
  batchFieldName: { type: String, default: "batchFieldList" },
  primaryKey: { type: [String, Object] as PropType<string | any> },
  rules: { type: Object },
  compSize: { type: String, default: Config.compSize },
  source: { type: Number, default: 1 },
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

const init = () => {};
onMounted(() => {
  init();
});
</script>

<template>
  <template v-if="item.cardList?.length > 0">
    <template
      v-for="(cardItem, key) in item.cardList"
      :key="compKey(cardItem, key)"
    >
      <el-card
        shadow="hover"
        style="margin-bottom: 10px"
        v-if="Object.keys(cardItem).length > 0"
        :index="checkObject(dataForm, cardItem, key, dataIndex, propPrefix)"
      >
        <template #header>
          <div class="card-header flex items-center justify-between">
            <div class="w-[60%]">
              {{ cardItem.title || cardItem.tabName }}
              <help v-if="cardItem.helpMsg" :message="cardItem.helpMsg" />
            </div>
            <div
              class="flex-1"
              v-for="(headerItem, key) in cardItem.headerFieldList"
              :key="compKey(headerItem, key)"
            >
              <el-form-item
                :size="compSize"
                :label="headerItem.preps?.hideLabel ? '' : headerItem.label"
                :required="headerItem.required"
                :prop="
                  loadProp(
                    getPrefix(cardItem, propPrefix, dataIndex, key),
                    headerItem.fieldName,
                    -1,
                    -1,
                  )
                "
                :labelPosition="parentPreps?.labelPosition"
                :rules="validMsg(headerItem, dataForm)"
                v-if="checkVisible(headerItem, dataForm)"
              >
                <star-horse-item
                  style="flex: 1"
                  :compSize="compSize"
                  :bareFlag="true"
                  :source="source"
                  :primaryKey="primaryKey"
                  :item="headerItem"
                  :dataForm="
                    getFormData(cardItem, dataForm, propPrefix, dataIndex, key)
                  "
                  :dataIndex="
                    getDataIndex(cardItem, propPrefix, dataIndex, key)
                  "
                  :propPrefix="getPrefix(cardItem, propPrefix, dataIndex, key)"
                />
              </el-form-item>
            </div>
          </div>
        </template>
        <star-horse-form-item
          :source="source"
          :compUrl="compUrl"
          :compSize="compSize"
          :dataForm="
            getFormData(cardItem, dataForm, propPrefix, dataIndex, key)
          "
          :dataIndex="getDataIndex(cardItem, propPrefix, dataIndex, key)"
          :propPrefix="getPrefix(cardItem, propPrefix, dataIndex, key)"
          :objectName="cardItem.objectName"
          @addRow="addRow"
          @removeRow="removeRow"
          :fieldList="{
            ...cardItem,
          }"
          :rules="rules"
          :subFormFlag="cardItem.subFormFlag"
          :primaryKey="primaryKey"
        />
      </el-card>
    </template>
  </template>
</template>

<style scoped lang="scss">
.card-header {
  span {
    width: 90%;
  }
}

:deep(.el-card__body),
.el-card {
  height: unset !important;
  flex: unset !important;
}
</style>
