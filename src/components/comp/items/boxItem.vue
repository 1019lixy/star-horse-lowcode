<script setup lang="ts">
import {checkVisible, labelVisibleCheck, loadProp, validMsg} from "@/api/form_utils";
import {ContainerPreps} from "@/components/types/ItemPreps";
import {computed, onMounted} from "vue";
import StarHorseItem from "@/components/comp/StarHorseItem.vue";

const props = withDefaults(defineProps<ContainerPreps>(), {
  // 数据索引
  dataIndex: -1,
  // 父节点名称
  propPrefix: "",
  parentPreps: {},
  subFormFlag: "N",
  batchName: "batchDataList",
  batchFieldName: "batchFieldList",
  compSize: "default",
  source: 1,
});
const dataForm = defineModel("dataForm");
const noVisibleData = computed(() => {
  const temp = props.item;
  const datas = Array.isArray(temp) && temp.filter(item => item?.formVisible === false);
  return temp.length == datas.length;
});
const init = () => {
};
const checkItem = (item: any) => {
  if (Array.isArray(item)) {
    return item[0];
  }
  return item;
};
const countSpan = (item: any) => {
  let totalVisible =Array.isArray(item) && item.filter((temp) => temp && temp.formVisible).length || 24;
  if (totalVisible != 24) {
    totalVisible = 24 / totalVisible;
  }
  return item.preps?.colspan || totalVisible;
};
const createArray = (item: any) => {
  if (Array.isArray(item)) {
    return item;
  }
  return [item];
};
onMounted(() => {
  init();
});

</script>

<template>
  <el-row
      v-if="Array.isArray(item)&&!noVisibleData"
      :gutter="5"
      :justify="'center'"
      :align="'middle'"
      :tag="'div'"
      style=""
  >
    <template v-for="sitem in item">

      <el-col
          v-if="sitem"
          :span="countSpan(checkItem(sitem))"
          class="h-full flex items-center justify-center"
          v-bind="checkItem(sitem).preps"
          :style="{ height: checkItem(sitem).preps?.colHeight||'auto' ,

        }"
      >
        <template v-for="tempData in createArray(sitem)">
          <template
              v-if="
            tempData.type != 'button' &&
            tempData.type != 'usercomp' &&
            !tempData.preps?.staticData
          "
          >
            <!--需解决只需要标签内容的情况-->
            <el-form-item
                :size="compSize"
                class="flex w-full flex-1 my-5"
                :label="labelVisibleCheck(tempData)"
                :prop="loadProp(propPrefix, tempData.fieldName, -1, -1)"
                :labelPosition="tempData.preps?.labelPosition??parentPreps?.labelPosition"
                :rules="validMsg(tempData, dataForm)"
                v-if="
              (tempData.formVisible &&
                tempData.label &&
                tempData.preps?.headerFlag != 'Y') ||
              checkVisible(tempData, dataForm)
            "
            >
              <star-horse-item
                  :primaryKey="primaryKey"
                  :compSize="compSize"
                  v-model:dataForm="dataForm"
                  :commonFormat="commonFormat"
                  :item="tempData"
                  :dataIndex="dataIndex"
                  :source="source"
              />
            </el-form-item>

            <star-horse-item
                v-else-if="tempData.viewVisible || checkVisible(tempData, dataForm)"
                :compSize="compSize"
                :primaryKey="primaryKey"
                v-model:dataForm="dataForm"
                :commonFormat="commonFormat"
                :item="tempData"
                :dataIndex="dataIndex"
                :source="source"
            />
          </template>
          <template v-else-if="tempData.fieldName">
            <star-horse-item
                :primaryKey="primaryKey"
                :compSize="compSize"
                v-model:dataForm="dataForm"
                :commonFormat="commonFormat"
                :item="tempData"
                :dataIndex="dataIndex"
                :source="source"
            />
          </template>
        </template>
      </el-col>
    </template>
  </el-row>
</template>

<style scoped lang="scss">
.el-col {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
