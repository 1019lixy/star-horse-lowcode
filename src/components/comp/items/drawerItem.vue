<script setup lang="ts">
import {
  collectFieldProps,
  getDataIndex,
  getFormData,
  getPrefix,
} from "@/api/form_utils";
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
import { i18n } from "@/lang";
import { warning } from "@/utils/message";
import StarHorseDrawer from "@/components/comp/StarHorseDrawer.vue";

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
// 注入 el-form 实例（由 StarHorseForm provide），用于调用 validateField / clearValidate
const starHorseFormRef = inject("starHorseFormRef", ref<any>(null));
const dialogVisible = ref<boolean>(false);
const drawerFields = computed(() =>
  props.item.containerFields?.length > 0 ? props.item.containerFields[0] : {},
);
// 是否开启必填校验（默认开启，设为 "N" 可关闭；source=3 查看模式自动关闭）
const mustComplete = computed(() => {
  if (props.source == 3) return false;
  return (props.item?.preps?.mustComplete ?? props.item?.mustComplete) !== "N";
});

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

/**
 * 校验抽屉内所有可见子项的字段（参考 stepItem.validateStep）
 * 调用 el-form 的 validateField 触发内联校验（红框 + 错误提示）
 * @returns 校验通过返回 true，否则 false
 */
const getFieldProps = () => {
  const list = props.item?.containerFields;
  const fieldProps: string[] = [];
  if (!Array.isArray(list)) return fieldProps;
  list.forEach((child: any, idx: number) => {
    if (child == null || child.formVisible === false) return;
    const childPrefix = getPrefix(
      child,
      props.propPrefix,
      props.dataIndex,
      props.item?.groupData ? idx : 0,
    );
    fieldProps.push(...collectFieldProps(child.fieldList || [], childPrefix));
  });
  return fieldProps;
};
const validateContainer = async (): Promise<boolean> => {
  if (!mustComplete.value) return true;
  const formRef = starHorseFormRef.value;
  if (!formRef?.validateField) return true;
  const fields = getFieldProps();
  if (!fields.length) return true;
  try {
    await formRef.validateField(fields);
    return true;
  } catch {
    return false;
  }
};

/**
 * 确认（提交）：先校验必填字段，通过后关闭抽屉
 */
const handleConfirm = async () => {
  if (!(await validateContainer())) {
    warning(i18n("dyform.step.stepIncomplete"));
    return;
  }
  dialogVisible.value = false;
};
const resetForm = () => {
  const fields = getFieldProps();
  const formRef = starHorseFormRef.value;
  if (!formRef?.resetFields) return;
  if (!fields.length) return;
  formRef.resetFields(fields);
};

const init = () => {};

/**
 * 递归遍历 fieldList,对有 dataRelation 的字段重新触发初始联动
 * 用于 drawer 子项从隐藏变可见时,补触子项内字段因组件未挂载而遗漏的初始联动
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
  <div v-if="item.containerFields?.length > 0" class="drawer-trigger-wrapper">
    <div class="dialog-trigger">
      <el-button
        v-if="
          drawerFields.formVisible !== false && !drawerFields.preps?.hideDrawer
        "
        :type="drawerFields.preps?.btnType || 'primary'"
        :icon="drawerFields.preps?.btnIcon || undefined"
        @click="handleOpen"
        :disabled="drawerFields.preps?.disabled"
      >
        {{
          drawerFields.preps?.btnText ||
          drawerFields.title ||
          i18n("ide.ctx.open")
        }}
      </el-button>
    </div>
    <!-- 抽屉(设计模式和运行模式都可以打开) -->
    <star-horse-drawer
      v-model="dialogVisible"
      :userAction="true"
      :title="drawerFields.title || drawerFields.preps?.btnText"
      :direction="drawerFields.preps?.direction || 'rtl'"
      :size="drawerFields.preps?.drawerSize || '40%'"
      :resizable="drawerFields.preps?.resizable ?? true"
      :modal="drawerFields.preps?.modal ?? true"
      :close-on-click-modal="drawerFields.preps?.closeOnClickModal ?? false"
      :close-on-press-escape="drawerFields.preps?.closeOnPressEscape ?? false"
      :show-close="drawerFields.preps?.showClose ?? false"
      :with-header="drawerFields.preps?.withHeader ?? true"
      @resetForm="resetForm"
      @merge="handleConfirm"
      @closeAction="handleClose"
    >
      <template v-for="(drawerItem, key) in item.containerFields">
        <star-horse-form-item
          :source="source"
          :apiEndpoints="apiEndpoints"
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
            getPrefix(
              drawerItem,
              propPrefix,
              dataIndex,
              item.groupData ? key : 0,
            )
          "
          :subTableName="drawerItem.subTableName"
          @addRow="addRow"
          @removeRow="removeRow"
          :fieldList="drawerItem"
          :rules="rules"
          :subFormFlag="drawerItem.subFormFlag"
          :enableSubNode="drawerItem.enableSubNode"
          :primaryKey="primaryKey"
        />
      </template>
    </star-horse-drawer>
  </div>
</template>

<style scoped lang="scss">
.drawer-trigger-wrapper {
  display: inline-block;
}

.drawer-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
