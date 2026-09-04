<script setup lang="ts">
import {checkVisible, loadProp, validMsg} from "@/api/form_utils";
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
  subTableName: "subDataList",

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
        initRelationEvent({field, formInfo: formInfoVal}, dataForm, true);
      }
    }
  });
};
const checkData = (data: any) => {
  return Array.isArray(data) ? data : [data];
};
/**
 * 监听 containerFields 子项的 formVisible 变化:
 * 子项从隐藏变可见时,重新触发子项内有 dataRelation 的字段的初始联动
 * (子项隐藏时内部字段组件未挂载,onMounted 中的 initCompCallEvent 未执行)
 */
watch(
    () => {
      const list = props.item?.containerFields;
      return Array.isArray(list) ? list.map((c: any) => c?.formVisible) : [];
    },
    (newVals, oldVals) => {
      const list = props.item?.containerFields;
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
  <template v-if="item.containerFields?.length > 0">
    <template v-for="descItm in item.containerFields" :key="descItm.id">
      <el-descriptions
          v-if="descItm.formVisible !== false && !item.preps?.hideDescriptions"
          :title="item.title || ''"
          :direction="item.preps?.direction || 'horizontal'"
          :column="item.preps?.column || 2"
          style="margin: 5px 0"
          :border="item.preps?.border !== false"
          :size="item.preps?.size || 'default'"
          :extra="item.preps?.descExtra || ''"
          :label-width="item.preps?.descItemLabelWidth || '120px'"
      >
        <template v-for="afield in descItm.fieldList">
          <template v-for="field in checkData(afield)">
            <el-descriptions-item
                v-if="field.formVisible !== false"
                :label="field.label || field.fieldName"
                :rowspan="descItm.preps?.descItemRowspan || 1"

                :class-name="descItm.preps?.descItemClassName || ''"
                :span="descItm.preps?.descItemSpan || 1"
                :label-class-name="descItm.preps?.descItemLabelClassName || ''"
            >
              <template #label>
                <div class="desc-panel-header" :style="{'justify-content': descItm.preps?.descItemAlign || 'left'}">
                  <span class="editable-name">{{ field.label || field.fieldName }}
                  </span>
                  <div v-if="field.required" style="color: var(--el-color-danger)">*</div>
                </div>
              </template>
              <el-form-item
                  :size="compSize"
                  class="flex w-full flex-1 h-full"
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
        </template>
      </el-descriptions>
    </template>
  </template>
</template>

<style scoped lang="scss">
:deep(.el-form-item__label) {
  padding: 0 !important;
}

.desc-panel-header {
  display: flex;
  flex-direction: row;

  align-items: center;
}
:deep(.el-form-item__content) {
  height: 100% !important;
}
</style>
