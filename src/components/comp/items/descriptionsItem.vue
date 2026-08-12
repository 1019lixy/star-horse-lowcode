<script setup lang="ts">
import {checkVisible, labelVisibleCheck, loadProp, validMsg,} from "@/api/form_utils";
import {ContainerPreps} from "@/components/types/ItemPreps";
import {initRelationEvent} from "@/components/formcomp/utils/ItemRelationEventUtils";
import {inject, ModelRef, nextTick, onMounted, ref, unref, watch} from "vue";
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
const emits = defineEmits(["addRow", "removeRow"]);
const dataForm: ModelRef<any> = defineModel("dataForm");
// inject 表单字段列表,用于构造 initRelationEvent 所需的 props.formInfo
const formFields = inject("formFields", ref<any[]>([]));


const init = () => {
};

/**
 * 递归遍历 fieldList,对有 dataRelation 的字段重新触发初始联动
 * 用于 descriptions 子项从隐藏变可见时,补触子项内字段因组件未挂载而遗漏的初始联动
 */
const reTriggerRelation = (fields: any[], visited?: WeakSet<any>) => {
  if (!Array.isArray(fields)) return;
  if (!visited) visited = new WeakSet();
  fields.forEach((field: any) => {
    if (Array.isArray(field)) {
      reTriggerRelation(field, visited);
    } else if (field == null || typeof field !== "object") {
      return;
    } else if (visited.has(field)) {
      return;
    } else {
      visited.add(field);
      if (field?.preps?.dataRelation?.actionName) {
        const formInfoVal = unref(formFields);
        initRelationEvent(
            {field, formInfo: formInfoVal},
            dataForm,
            true,
        );
      }
    }
  });
};

/**
 * 监听 descriptionsList 子项的 formVisible 变化:
 * 子项从隐藏变可见时,重新触发子项内有 dataRelation 的字段的初始联动
 * (子项隐藏时内部字段组件未挂载,onMounted 中的 initCompCallEvent 未执行)
 */
watch(
    () => {
      const list = props.item?.descriptionsList;
      return Array.isArray(list) ? list.map((c: any) => c?.formVisible) : [];
    },
    (newVals, oldVals) => {
      const list = props.item?.descriptionsList;
      if (!Array.isArray(list)) return;
      list.forEach((child: any, index: number) => {
        if (child == null) return;
        const wasVisible = oldVals?.[index] !== false;
        const isVisible = newVals?.[index] !== false;
        if (!wasVisible && isVisible) {
          nextTick(() => {
            reTriggerRelation(child.fieldList);
          });
        }
      });
    },
    {deep: true, immediate: true},
);

onMounted(() => {
  init();
});
</script>

<template>
  <template v-if="item.descriptionsList?.length > 0">
    <template v-for="descItm in item.descriptionsList" :key="descItm.id">
      <el-descriptions
          v-if="descItm.formVisible !== false&&!item.preps?.hideDescriptions"
          :title="descItm.title || ''"
          :direction="descItm.preps?.direction || 'horizontal'"
          :column="descItm.preps?.column || 1"
          :border="descItm.preps?.border !== false"
          :size="descItm.preps?.size || 'default'"
          :extra="descItm.preps?.descExtra || ''"
          :label-width=" descItm.preps?.descItemLabelWidth || '110px'"
      >
        <template v-for="field in descItm.fieldList">
          <el-descriptions-item
              v-if="field.formVisible!==false"
              :label="field.label || field.fieldName"
              :rowspan=" descItm.preps?.descItemRowspan || 1"
              :align=" descItm.preps?.descItemAlign || 'left'"
              :class-name=" descItm.preps?.descItemClassName || ''"
              :span="descItm.preps?.descItemSpan || 1"
              :label-class-name=" descItm.preps?.descItemLabelClassName || ''"
          >
            <el-form-item
                :size="compSize"
                class="flex w-full flex-1 my-5"
                label=""
                :prop="loadProp(propPrefix, field.fieldName, -1, -1)"
                :labelPosition="
                field.preps?.labelPosition ?? parentPreps?.labelPosition
              "
                :rules="validMsg(field, dataForm)"
                v-if="
                (field.formVisible &&
                  field.label &&
                  field.preps?.headerFlag != 'Y') ||
                checkVisible(field, dataForm)
              "
            >
              <star-horse-item
                  :primaryKey="primaryKey"
                  :compSize="compSize"
                  v-model:dataForm="dataForm"
                  :commonFormat="commonFormat"
                  :item="field"
                  :dataIndex="dataIndex"
                  :source="source"
              />
            </el-form-item>
          </el-descriptions-item>
        </template>

      </el-descriptions>
    </template>
  </template>

</template>

<style scoped lang="scss">
:deep(.el-form-item__label) {
  padding: 0 !important;
}
</style>
