<script setup lang="ts">
import {
  checkObject,
  checkVisible,
  getDataIndex,
  getFormData,
  getPrefix,
  labelVisibleCheck,
  loadProp,
  validMsg,
} from "@/api/form_utils";

import { compKey } from "@/api/system";
import StarHorseFormItem from "@/components/comp/StarHorseFormItem.vue";
import { ContainerPreps } from "@/components/types/ItemPreps";
import { ModelRef, onMounted } from "vue";
import StarHorseItem from "@/components/comp/StarHorseItem.vue";

const props = withDefaults(defineProps<ContainerPreps>(), {
  // 数据索引
  dataIndex: -1,
  // 父节点名称
  propPrefix: "",
  parentPreps: {},
  subFormFlag: "N",
  batchName: "batchDataList",

  compSize: "default",
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
  <template v-if="item.containerFields?.length > 0">
    <template v-for="(cardItem, key) in item.containerFields">
      <el-card
        shadow="hover"
        style="margin-bottom: 10px"
        :key="compKey(cardItem, key)"
        v-bind="cardItem.preps"
        v-if="
          Object.keys(cardItem).length > 0 &&
          cardItem.formVisible !== false &&
          !cardItem.preps?.hideCard
        "
        :index="checkObject(dataForm, cardItem, key, dataIndex, propPrefix)"
      >
        <template #header>
          <div class="card-header flex items-center justify-between">
            <div class="w-[60%]">
              {{ cardItem.title || cardItem.label || cardItem.tabName }}
              <help v-if="cardItem.helpMsg" :message="cardItem.helpMsg" />
            </div>
            <div
              class="flex-1"
              v-for="(headerItem, key) in cardItem.headerFieldList"
              :key="compKey(headerItem, key)"
            >
              <el-form-item
                :size="compSize"
                :label="labelVisibleCheck(headerItem)"
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
                  :commonFormat="commonFormat"
                  :primaryKey="primaryKey"
                  :item="headerItem"
                  :dataForm="
                    getFormData(
                      cardItem,
                      dataForm,
                      propPrefix,
                      dataIndex,
                      item.groupData ? key : 0,
                    )
                  "
                  :dataIndex="
                    getDataIndex(
                      cardItem,
                      propPrefix,
                      dataIndex,
                      item.groupData ? key : 0,
                    )
                  "
                  :propPrefix="
                    getPrefix(
                      cardItem,
                      propPrefix,
                      dataIndex,
                      item.groupData ? key : 0,
                    )
                  "
                />
              </el-form-item>
            </div>
          </div>
        </template>
        <star-horse-form-item
          :source="source"
          :compUrl="compUrl"
          :compSize="compSize"
          :commonFormat="commonFormat"
          :dataForm="
            getFormData(
              cardItem,
              dataForm,
              propPrefix,
              dataIndex,
              item.groupData ? key : 0,
            )
          "
          :dataIndex="
            getDataIndex(
              cardItem,
              propPrefix,
              dataIndex,
              item.groupData ? key : 0,
            )
          "
          :propPrefix="
            getPrefix(cardItem, propPrefix, dataIndex, item.groupData ? key : 0)
          "
          :objectName="cardItem.objectName"
          @addRow="addRow"
          @removeRow="removeRow"
          :fieldList="cardItem"
          :rules="rules"
          :subFormFlag="cardItem.subFormFlag"
          :enableSubNode="cardItem.enableSubNode"
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
