<script setup lang="ts">
import {getDataIndex, getFormData, getPrefix,} from "@/api/form_utils";
import StarHorseFormItem from "@/components/comp/StarHorseFormItem.vue";
import {ContainerPreps} from "@/components/types/ItemPreps";
import {ModelRef, onMounted, ref} from "vue";
import {i18n} from "@/lang";

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
const emits = defineEmits(["addRow", "removeRow"]);
const dataForm: ModelRef<any> = defineModel("dataForm");
const dialogVisible = ref<boolean>(false);
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
const handleOpen = () => {
  dialogVisible.value = true;
};
const handleClose = () => {
  dialogVisible.value = false;
};
const init = () => {
};
onMounted(() => {
  init();
});
</script>

<template>
  <template v-if="item.drawerList?.length > 0">
    <el-button
        :type="item.preps['btnType'] || 'primary'"
        :icon="item.preps['btnIcon'] || undefined"
        @click="handleOpen"
        :disabled="item.preps['disabled']"
    >
      {{ item.preps['btnText'] || i18n("btn") }}
    </el-button>

    <!-- 对话框(设计模式和运行模式都可以打开) -->
    <el-drawer
        v-model="dialogVisible"
        :title="item.preps['dialogTitle'] || item.preps['btnText'] "
        :boxWidth="item.preps['boxWidth'] || '50%'"
        :selfFunc="true"
        :close-on-click-modal="false"
        append-to-body
        destroy-on-close
        @merge="handleClose"
        @closeAction="handleClose"
    >
      <template v-for="(drawerItem, key) in item.drawerList">
        <star-horse-form-item
            :source="source"
            :compUrl="compUrl"
            :compSize="compSize"
            :commonFormat="commonFormat"
            :dataForm="
            getFormData(
              drawerItem,
              dataForm,
              propPrefix,
              dataIndex,
              item.groupData ? key : 0,
            )
          "
            :dataIndex="
            getDataIndex(
              drawerItem,
              propPrefix,
              dataIndex,
              item.groupData ? key : 0,
            )
          "
            :propPrefix="
            getPrefix(drawerItem, propPrefix, dataIndex, item.groupData ? key : 0)
          "
            :objectName="drawerItem.objectName"
            @addRow="addRow"
            @removeRow="removeRow"
            :fieldList="drawerItem"
            :rules="rules"
            :subFormFlag="drawerItem.subFormFlag"
            :enableSubNode="drawerItem.enableSubNode"
            :primaryKey="primaryKey"
        />
      </template>
    </el-drawer>
  </template>
</template>

<style scoped lang="scss">
</style>
