<script setup lang="ts">
import {
  checkObject,
  checkVisible,
  getDataIndex,
  getFormData,
  getPrefix,
  loadProp,
  validMsg,
} from "@/api/form_utils";
import { Config } from "@/api/settings";
import { compKey } from "@/api/system";
import StarHorseFormItem from "@/components/comp/StarHorseFormItem.vue";
import { ContainerPreps } from "@/components/types/ItemPreps";
import { ModelRef, onMounted } from "vue";

const props = withDefaults(defineProps<ContainerPreps>(), {
  // 数据索引
  dataIndex: -1,
  // 父节点名称
  propPrefix: "",
  parentPreps: {},
  subFormFlag: "N",
  batchName: "batchDataList",
  batchFieldName: "batchFieldList",
  compSize: Config.compSize,
  source: 1,
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
    <template v-for="(cardItem, key) in item.cardList">
      <el-card
        shadow="hover"
        style="margin-bottom: 10px"
        :key="compKey(cardItem, key)"
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
                    getFormData(cardItem, dataForm, propPrefix, dataIndex, 0)
                  "
                  :dataIndex="
                    getDataIndex(cardItem, propPrefix, dataIndex, 0)
                  "
                  :propPrefix="getPrefix(cardItem, propPrefix, dataIndex, 0)"
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
            getFormData(cardItem, dataForm, propPrefix, dataIndex, 0)
          "
          :dataIndex="getDataIndex(cardItem, propPrefix, dataIndex, 0)"
          :propPrefix="getPrefix(cardItem, propPrefix, dataIndex, 0)"
          :objectName="cardItem.objectName"
          @addRow="addRow"
          @removeRow="removeRow"
          :fieldList="cardItem"
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
