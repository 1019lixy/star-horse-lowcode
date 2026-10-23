<script setup lang="ts">
import {checkVisible, loadProp, validMsg} from "@/api/form_utils";
import {ContainerPreps} from "@/components/types/ItemPreps";
import {initRelationEvent} from "@/components/formcomp/utils/ItemRelationEventUtils";
import {computed, inject, ModelRef, nextTick, onMounted, ref, unref, watch} from "vue";
import {isMobile} from "@/api/device";
import {ArrowDown, ArrowRight} from "@element-plus/icons-vue";
import StarHorseItem from "@/components/comp/StarHorseItem.vue";
import StarHorseFormItem from "@/components/comp/StarHorseFormItem.vue";

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
 * 移动端(APP)布局:descriptions 强制纵向单栏
 * (label 在上、值在下),避免 horizontal + column>1 在窄屏呈现"两栏"挤压;
 * PC 端保持容器配置的 direction/column
 */
const descDirection = computed(() =>
    isMobile.value ? "vertical" : (props.item.preps?.direction || "horizontal"),
);
const descColumn = computed(() =>
    isMobile.value ? 1 : (props.item.preps?.column || 2),
);

/** 字段跨度:移动端单栏时恒为 1,PC 端取配置跨度 */
const descItemSpan = (field: any, descItm: any) => {
    if (isMobile.value) return 1;
    return field.preps?.descItemSpan || descItm.preps?.descItemSpan || 1;
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
    {immediate: true},
);

onMounted(() => {
  init();
});

/** APP 端 descriptions 默认展开(可手动折叠收紧) */
const descCollapsed = ref(false);
const toggleDescCollapsed = () => {
  descCollapsed.value = !descCollapsed.value;
};
</script>

<template>
  <template v-if="item.containerFields?.length > 0">
    <!-- 标题横幅(PC + APP 统一用 group-label;APP 端可点击折叠/展开) -->
    <div
        v-if="item.title || item.label"
        class="group-label"
        :class="{'group-label-clickable': true}"
        @click="toggleDescCollapsed()"
      >
        <div
            class="group-label-text"
            v-html="item.title || item.label"
        ></div>
        <el-icon class="group-label-arrow">
          <ArrowRight v-if="descCollapsed"/>
          <ArrowDown v-else/>
        </el-icon>
    </div>
    <div
        v-show="!descCollapsed"
        style="margin:5px 0;width: 100%;box-sizing: border-box;overflow: hidden;background: #fff;border:1px solid #e3e6eb;border-radius: 8px;"
    >
      <template v-for="descItm in item.containerFields" :key="descItm.id">
        <el-descriptions
            v-if="descItm.formVisible !== false && !item.preps?.hideDescriptions"
            :title="''"
            :direction="descDirection"
            :column="descColumn"
            style="width: 100%"
            :border="item.preps?.border !== false"
            :size="item.preps?.size || 'default'"
            :extra="item.preps?.descExtra || ''"
            :label-width="item.preps?.descItemLabelWidth || '120px'"
        >
          <template v-for="afield in descItm.fieldList">
            <template v-for="field in checkData(afield)">
              <el-descriptions-item
                  v-if="field.formVisible !== false"
                  :label="field.preps?.hideLabel ? undefined : (field.label || field.fieldName)"
                  :rowspan="descItm.preps?.descItemRowspan || 1"

                  :class-name="descItm.preps?.descItemClassName || ''"
                  :span="descItemSpan(field, descItm)"
                  :label-class-name="descItm.preps?.descItemLabelClassName || ''"
              >
                <template #label>
                  <div class="desc-panel-header" :style="{'justify-content': descItm.preps?.descItemAlign || 'left'}">
                  <span class="editable-name">{{ field.label || field.fieldName }}
                  </span>
                    <div v-if="field.required" style="color: var(--el-color-danger)">*</div>
                  </div>
                </template>
                <star-horse-form-item
                    v-if="field.containerType && field.containerFields?.length > 0 && field.formVisible !== false"
                    :fieldList="{ fieldList: [field] }"
                    :primary-key="primaryKey"
                    :rules="rules"
                    :subTableName="subTableName"
                    :compSize="compSize"
                    :dialogType="dialogType"
                    :apiEndpoints="apiEndpoints"
                    :subFormFlag="subFormFlag"
                    :source="source"
                    :dataIndex="dataIndex"
                    :propPrefix="propPrefix"
                    :commonFormat="commonFormat"
                    v-model:dataForm="dataForm"
                    :parentPreps="field.preps"
                />
                <el-form-item
                    v-else-if="
                (field.formVisible !== false &&
                  field.label &&
                  field.preps?.headerFlag != 'Y') ||
                checkVisible(field, dataForm)
              "
                    :size="compSize"
                    class="flex w-full flex-1 h-full min-w-0"
                    label=""
                    :prop="loadProp(propPrefix, field.fieldName, -1, -1)"
                    :labelPosition="
                field.preps?.labelPosition ?? parentPreps?.labelPosition
              "
                    :rules="validMsg(field, dataForm)"
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
                  <template #error="{ error }">
                    <sh-error-tooltip :error="error || ''"/>
                  </template>
                </el-form-item>
              </el-descriptions-item>
            </template>
          </template>
        </el-descriptions>
      </template>
    </div>
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

:deep(.el-descriptions__table) {
  table-layout: fixed;
}

:deep(.el-descriptions__content) {
  overflow: hidden;
}

:deep(.el-form-item__content) {
  width: 100%;
  height: 100% !important;
  overflow: hidden;
}
  /* APP 端:单列纵向,属性间紧凑(减小 el-descriptions 默认间距) */
  @media (max-width: 768px) {
    :deep(.el-descriptions) {
      margin: 0;
    }
    :deep(.el-descriptions__body) {
      .el-descriptions__table {
        th.el-descriptions__cell,
        td.el-descriptions__cell {
          padding-bottom: 6px;
          padding-top: 6px;
        }
      }
    }
  }

  /* APP 端 group-label 可点击折叠 + 箭头图标 */
  .group-label-clickable {
    cursor: pointer;
    display: flex;
    align-items: center;

    .group-label-text {
      flex: 1;
    }

    .group-label-arrow {
      flex: none;
      font-size: 14px;
      color: var(--el-text-color-secondary);
    }
  }
</style>
