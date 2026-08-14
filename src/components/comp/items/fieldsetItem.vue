<script setup lang="ts">
import { getDataIndex, getFormData, getPrefix } from "@/api/form_utils";
import StarHorseFormItem from "@/components/comp/StarHorseFormItem.vue";
import { ContainerPreps } from "@/components/types/ItemPreps";
import { initRelationEvent } from "@/components/formcomp/utils/ItemRelationEventUtils";
import {
  computed,
  inject,
  ModelRef,
  nextTick,
  onMounted,
  ref,
  unref,
  watch,
} from "vue";
import {FieldInfo} from "@/components/types";

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
const innerCollapsed = ref<boolean>(false);
const toggleInner = (item:FieldInfo) => {
 if(item.preps){
   item.preps.innerCollapsed =  !item.preps.innerCollapsed;
 }
};

/**
 * 递归遍历 fieldList,对有 dataRelation 的字段重新触发初始联动
 * 用于 fieldset 子项从隐藏变可见时,补触子项内字段因组件未挂载而遗漏的初始联动
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
        initRelationEvent({ field, formInfo: formInfoVal }, dataForm, true);
      }
    }
  });
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
  { deep: true, immediate: true },
);

onMounted(() => {
  init();
});
</script>

<template>
  <template v-if="item.containerFields?.length > 0">
    <template v-for="(fiedsetItem, key) in item.containerFields">
      <fieldset
        v-if="fiedsetItem.formVisible !== false"
        class="fieldset-container"
        :class="{
          'border-dashed': fiedsetItem.preps?.borderStyle === 'dashed',
          'border-none': fiedsetItem.preps?.borderStyle === 'none',
          'is-collapsible': fiedsetItem.preps?.collapsible,
          'is-collapsed': fiedsetItem.preps?.innerCollapsed
        }"
        :disabled="fiedsetItem.preps?.disabled || undefined"
        :form="fiedsetItem.preps?.form || undefined"
        :name="fiedsetItem.preps?.name || undefined"
      >
        <legend
          class="fieldset-legend"
          :class="{ clickable: fiedsetItem.preps?.collapsible }"
          @click="toggleInner(fiedsetItem)"
        >
          <svg
            v-if="fiedsetItem.preps?.collapsible"
            :class="['legend-arrow', { rotated: fiedsetItem.preps?.innerCollapsed }]"
            viewBox="0 0 10 6"
            fill="none"
            width="10"
            height="10"
          >
            <path
              d="M1 1L5 5L9 1"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>

          <span class="legend-text">
            {{ fiedsetItem.title || "FieldSet" }}
          </span>
        </legend>
        <div v-show="!fiedsetItem.preps?.innerCollapsed" class="fieldset-body">
          <star-horse-form-item
            :source="source"
            :compUrl="compUrl"
            :compSize="compSize"
            :commonFormat="commonFormat"
            :dataForm="
              getFormData(
                fiedsetItem,
                dataForm,
                propPrefix,
                dataIndex,
                item.groupData ? key : 0,
              )
            "
            :dataIndex="
              getDataIndex(
                fiedsetItem,
                propPrefix,
                dataIndex,
                item.groupData ? key : 0,
              )
            "
            :propPrefix="
              getPrefix(
                fiedsetItem,
                propPrefix,
                dataIndex,
                item.groupData ? key : 0,
              )
            "
            :subTableName="fiedsetItem.subTableName"
            @addRow="addRow"
            @removeRow="removeRow"
            :fieldList="fiedsetItem"
            :rules="rules"
            :subFormFlag="fiedsetItem.subFormFlag"
            :enableSubNode="fiedsetItem.enableSubNode"
            :primaryKey="primaryKey"
          />
        </div>
      </fieldset>
    </template>
  </template>
</template>

<style scoped lang="scss">
.fieldset-container {
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  padding: 12px 16px 8px;
  margin: 5px 0;
  position: relative;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;

  &:hover {
    border-color: #c0c4cc;
  }

  &.border-dashed {
    border-style: dashed;
  }

  &.border-none {
    border: none;
    padding: 4px 0;
  }

  &.is-collapsible .fieldset-legend {
    cursor: pointer;
    user-select: none;
  }

  &.is-collapsed {
    padding-bottom: 12px;
  }
}

.fieldset-legend {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0 8px;
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.legend-text {
  &.editable {
    cursor: text;
    border-bottom: 1px dashed transparent;

    &:hover {
      border-bottom-color: var(--star-horse-style, #409eff);
    }
  }
}

.legend-arrow {
  transition: transform 0.2s ease;
  color: #909399;

  &.rotated {
    transform: rotate(-90deg);
  }
}

.fieldset-body {
  padding-top: 4px;
}
</style>
