<script setup lang="ts" name="StarHorseItem">
import { computed, inject, isRef, ModelRef, onMounted, PropType, ref } from "vue";
import {
  compKey,
  dateCompList,
  fieldPlaceholder,
  inputCompList,
  uuid,
} from "@/api/system";

import { checkVisible, filterProperties } from "@/api/form_utils";
import Help from "@/components/help.vue";
import { getSelfOperationStore } from "@/store/StoreManager";

const props = defineProps({
  item: { type: Object as PropType<any>, required: true },
  column: { type: Object as PropType<any> },
  primaryKey: { type: Object as PropType<any> },
  // 数据索引
  dataIndex: { type: Number, default: -1 },
  bareFlag: { type: Boolean, default: false },
  batchName: { type: String, default: "" },
  compSize: { type: String, default: "default" },
  showLabel: { type: Boolean, default: true }, //是否显示标签
  source: { type: Number, default: 1 },
  commonFormat: {
    type: Function,
    default: () => {},
  },
});
const dataForm: ModelRef<any> = defineModel("dataForm");

const itemType = computed(() => {
  let type: string = props.item?.type || props.item?.fieldType || "input";
  if (dateCompList().includes(itemType.value)) {
    type = "datetime";
    //日期默认以时间戳赋值
  }
  type =
    (dataForm.value && dataForm.value["_" + props.item.fieldName + "Type"]) ||
    type;
  // console.log("type", props.item);
  // console.log(type);
  return type;
});
const emit = defineEmits(["dataSearch", "focus", "blur"]);
const formFields: any = inject("formFields", []);
// const actionName = ref();
const componentRef = ref();
const isDragging = ref(false);
const startX = ref(0);
const startWidth = ref(0);
const dragWidth = ref<string | null>(null);
const bareStyle = computed(() => ({
  height: itemType.value != "button" ? "100%" : "inherit",
  minWidth: props.source == 4 ? "200px" : "unset",
  maxHeight: props.source == 4 ? "500px" : "unset",
  width:
    props.source == 4
      ? dragWidth.value || props.item.minWidth || "inherit"
      : "100%",
  position: "relative" as const,
}));
/**
 * 组件派发事件
 * @param act
 * @param params
 */
const actionDispatcher = (act: string, ...params: any[]) => {
  if (props.source == 4) {
    if (!act) {
      return;
    }
    emit("dataSearch", params);
  } else {
    let actions: Record<string, Function> = props.item?.actions;
    const eventNames: Array<string> = Object.keys(actions || {});
    if (eventNames?.includes(act) && typeof actions[act] == "function") {
      actions[act](dataForm.value, params);
    }
    if (act == "focus") {
      emit("focus", props.column, params);
    } else if (act == "blur" || (act == "change" && props.source == 5)) {
      emit("blur", props.column, params);
    }
  }
};

const fieldType = () => {
  // const selectNameList = selectCompList();

  if (!props.item?.actions) {
    props.item["actions"] = {};
  }
  const keys = Object.keys(props.item?.actions || {});
  if (props.source == 4) {
    const actionKey = inputCompList().includes(itemType.value)
      ? "keyup.enter"
      : "change";
    if (!keys.includes(actionKey)) {
      props.item.actions[actionKey] = actionKey;
    }
  }
};
const exclusions = [
  "name",
  "id",
  "label",
  "itemNameLabel",
  "autocomplete",
  "maxLength",
];
const init = () => {
  fieldType();
  if (!props.item["id"]) {
    props.item["id"] = props.item.preps?.id ?? uuid();
  }
  if (!props.item?.fieldName) {
    props.item["fieldName"] = props.item?.preps?.name ?? props.item?.id;
  }
  fieldPlaceholder(props.item, itemType.value, props.source);
  if (props.item?.preps) {
    //防止name 与Vue重名,导致渲染异常
    filterProperties(props.item?.preps, exclusions);
    props.item.preps["readonly"] = props.item?.readonly || props.source == 3;
    props.item.preps["starHorseFieldSource"] = props.source;
    let keys = Object.keys(props.item?.preps || {});
    for (let key in keys) {
      let val = props.item?.preps?.[key];
      if (["Y", "N", "y", "n"].includes(val)) {
        props.item.preps[key] = ["Y", "y"].includes(val);
      } else if (val === "true" || val === "false") {
        props.item.preps[key] = val == "true";
      }
    }
  }
  compPreps();
};
const compPreps = () => {
  fieldType();
  //过滤掉查询表单的信息
  if (props.source != 4 && formFields) {
    let fieldName = props.item.fieldName;
    // 兼容 formFields 为 ref(shallowRef) 的情况,统一取 .value 操作
    // formFields.value 可能为 null/undefined(初始化未完成),此时跳过注册
    const formFieldsArr: any = isRef(formFields) ? formFields.value : formFields;
    if (!Array.isArray(formFieldsArr)) return;
    //如果数据来源于列表
    if (props.batchName) {
      let batchFields = formFieldsArr[props.batchName];
      if (!batchFields) {
        formFieldsArr[props.batchName] = [];
      }
      let row = formFieldsArr[props.batchName][dataForm.value["xh"] - 1];
      if (!row) {
        formFieldsArr[props.batchName].push([]);
      } else {
        row.push(props.item);
      }
    } else {
      formFieldsArr[fieldName] = props.item;
    }
  }
  //将表单属性存储起来
  if (props.source != 4) {
    getSelfOperationStore().addFormItem(props.item);
  }
  /**
   * 组件初始化时赋值默认值,
   * 在表单操作过程中，不再进行默认值的处理
   */
  if (!dataForm.value[props.item?.fieldName] && props.item?.defaultValue) {
    dataForm.value[props.item?.fieldName] = props.item?.defaultValue;
  }
};

const startDrag = (e: MouseEvent) => {
  isDragging.value = true;
  startX.value = e.clientX;
  const compInfo = (e.target as HTMLElement).parentElement;
  if (compInfo) {
    startWidth.value = compInfo.offsetWidth;
  }
  document.body.style.userSelect = "none";
};

const onDrag = (e: MouseEvent) => {
  if (!isDragging.value) return;
  const delta = e.clientX - startX.value;
  const newWidth = startWidth.value + delta;
  if (newWidth > 100) {
    // 最小宽度限制
    dragWidth.value = `${newWidth}px`;
  }
};

const stopDrag = () => {
  if (isDragging.value) {
    isDragging.value = false;
    document.body.style.userSelect = "";
  }
};
const checkClassName = () => {
  if (props.bareFlag || props.item.preps?.headerFlag) {
    return "bare-comp";
  } else {
    return "comp-info";
  }
};
const dataFormat = (item: any) => {
  let name = props.item?.fieldName;
  let val = "";
  try {
    val = dataForm.value?.[name];
    return props.commonFormat(name, val, dataForm.value) ?? "--";
  } catch (e) {
    return val || "--";
  }
};
onMounted(() => {
  init();
});
</script>
<template>
  <div
    :class="checkClassName()"
    :style="bareStyle"
    @mousemove="onDrag"
    @mouseup="stopDrag"
    @mouseleave="stopDrag"
  >
    <div
      class="drag-handle"
      @mousedown.prevent="startDrag"
      v-if="itemType != 'button' && item.fieldName && source == 4"
    ></div>
    <help :message="item.helpMsg" v-if="item.helpMsg" />
    <component
      :key="item.id"
      :is="itemType + '-item'"
      :formInfo="formFields"
      @selfFunc="actionDispatcher"
      ref="componentRef"
      :isSearch="source == 4"
      :bareFlag="bareFlag"
      :source="source"
      :field="item"
      v-model:formData="dataForm"
    />
    <div v-if="item.brotherNodes" style="width: 15px" />
    <template
      v-for="(temp, key) in item.brotherNodes"
      :key="compKey(temp, key)"
    >
      <star-horse-item
        v-if="checkVisible(temp, dataForm)"
        :primaryKey="primaryKey"
        :compSize="compSize"
        v-model:dataForm="dataForm"
        :item="temp"
        :dataIndex="dataIndex"
        :bareFlag="true"
        :source="source"
      />
    </template>
  </div>
</template>
<style lang="scss" scoped>
:deep(.el-cascader) {
  width: 100%;
}

.drag-handle {
  position: absolute;
  right: -4px;
  top: 0;
  bottom: 0;
  width: 8px;
  cursor: col-resize;
  z-index: 100;

  &:hover {
    background: rgba(64, 158, 255, 0.2);
  }
}

.comp-info {
  display: flex;
  justify-content: left;
  flex: 1;
  height: 100%;
  align-items: center;
  margin: 0 auto;
}

.bare-comp {
  flex: 1;
  display: flex;
  align-items: center;
  width: 100%;
  margin: 5px;
}

.brother-node {
  margin-left: 5px;
  display: flex;
  align-items: center;
  flex: 1;
}
</style>
