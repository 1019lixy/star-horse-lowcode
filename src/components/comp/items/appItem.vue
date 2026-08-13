<script setup lang="ts">
import { getDataIndex, getFormData, getPrefix } from "@/api/form_utils";
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
const createFieldList = (item: any) => {
  //容器对象(子表单/批量表单)自身携带 fieldList,需用其内部字段渲染,而非将容器当作叶子字段
  if (item && Array.isArray(item.fieldList)) {
    return { fieldList: item.fieldList };
  }
  return { fieldList: Array.isArray(item) ? item : [item] };
};
const init = () => {
  console.log(props.item);
};
onMounted(() => {
  init();
});
</script>

<template>
  <template v-if="item.appList?.length > 0">
    <template v-for="(appItem, key) in item.appList" :key="key">
      <!-- 跳过容器联动影子项(__appContainer)、被隐藏字段(__containerHidden)和 formVisible=false 的项 -->
      <!-- formVisible 检查与 PC 端 tabItem.vue 的 v-if="tabItem.formVisible !== false" 一致 -->
      <template
        v-if="
          !appItem?.__appContainer &&
          !appItem?.__containerHidden &&
          appItem?.formVisible !== false
        "
      >
        <div
          class="group-label"
          v-if="
            appItem.staticData === true &&
            ['app', 'all'].includes(appItem.visiblePlatform)
          "
        >
          <div
            class="group-label-text"
            v-html="appItem.preps?.textContent"
          ></div>
        </div>
        <template v-else>
          <template v-if="appItem.title">
            <div class="group-label">
              <div class="group-label-text" v-html="appItem.title"></div>
            </div>
          </template>
          <star-horse-form-item
            :source="source"
            :compUrl="compUrl"
            :compSize="compSize"
            :commonFormat="commonFormat"
            :dataForm="
              getFormData(
                appItem,
                dataForm,
                propPrefix,
                dataIndex,
                item.groupData ? key : 0,
              )
            "
            :dataIndex="
              getDataIndex(
                appItem,
                propPrefix,
                dataIndex,
                item.groupData ? key : 0,
              )
            "
            :propPrefix="
              getPrefix(
                appItem,
                propPrefix,
                dataIndex,
                item.groupData ? key : 0,
              )
            "
            :objectName="appItem.objectName"
            @addRow="addRow"
            @removeRow="removeRow"
            :fieldList="createFieldList(appItem)"
            :rules="rules"
            :subFormFlag="appItem.subFormFlag"
            :primaryKey="primaryKey"
          />
        </template>
      </template>
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
