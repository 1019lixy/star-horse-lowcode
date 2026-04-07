<template>
  <!-- 对话框部分（与原 json-item.vue 完全一致） -->
  <star-horse-dialog
      :title="field.label + 'JSON编辑'"
      :self-func="true"
      :boxHeight="field.preps?.boxHeight ?? '65%'"
      :boxWidth="field.preps?.boxWidth ?? '40%'"
      :dialog-visible="dialogInputVisible"
      @merge="selectItem"
      @resetForm="resetForm"
      @closeAction="closeAction"
  >
    <star-horse-json-editor
        v-if="field.preps?.devType"
        v-model:modelValue="jsonData"
        style="height: 100%"
    />
    <star-horse-form v-else :field-list="jsonTableField" ref="jsonFormRef"/>
  </star-horse-dialog>

  <!-- 输入框+按钮部分（与原 json-item.vue 完全一致） -->
  <starhorse-form-item
      :isDesign="isDesign"
      :disabled="disabled"
      :showFormItem="showFormItem"
      :bareFlag="bareFlag"
      :field="field"
      :parentField="parentField"
  >
    <div class="json-comp">
      <div class="json-box">
        <el-input
            :fid="field.fieldName"
            :disabled="checkIsDisabled(props)"
            :rows="field.preps?.rows || 3"
            type="textarea"
            resize="vertical"
            readonly
            v-on="getDynamicEvents(props, itemAction)"
            v-model="formData[field.fieldName]"
        />
      </div>
      <div class="json-btn" v-if="source!=3">
        <star-horse-icon
            class="w-full"
            @click="editJsonData(false)"
            icon-class="edit"
            style="cursor: pointer"
            title="设计模式编辑"
        />
        <div class="h-[10px]"/>
        <star-horse-icon
            @click="editJsonData(true)"
            icon-class="code"
            style="cursor: pointer"
            title="开发模式编辑"
        />
      </div>
    </div>
  </starhorse-form-item>
</template>

<script setup lang="ts">
import {nextTick, PropType, reactive, shallowRef} from "vue";
import {PageFieldInfo} from "@/components/types/PageFieldInfo";
import {allAction, checkIsDisabled, convertData,} from "@/components/formcomp/utils/ItemRelationEventUtils";
import {getDynamicEvents} from "@/api/system";
import JSON5 from "json5";
import {StarHorseDialog} from "@/components/comp";
import StarhorseFormItem from "@/components/formcomp/items/starhorse-form-item.vue";

// 公共 props（两个组件原有的 props 完全一致）
const props = defineProps({
  isDesign: {type: Boolean, default: false},
  showFormItem: {type: Boolean, default: false},
  disabled: {type: Boolean, default: false},
  bareFlag: {type: Boolean, default: false},
  isSearch: {type: Boolean, default: false},
  field: {type: Object as PropType<any>, required: true},
  parentField: {type: Object as PropType<any>},
  formInfo: {type: Object as PropType<any>},
  // 新增：区分 JSON 对象/数组的关键参数
  dataType: {
    type: String,
    default: "object",
    validator: (v) => ["object", "array"].includes(v),
  },
});

const emits = defineEmits(["selfFunc", "selectItem"]);
const formData = defineModel("formData");
const dialogInputVisible = shallowRef(false);
const jsonFormRef = shallowRef();
const jsonData = shallowRef<any>({}); // 统一存储解析后的 JSON 数据（对象或数组）

// 公共的表格字段配置（两个组件原有的 jsonTableField 完全一致）
const jsonTableField = reactive<PageFieldInfo>({
  batchFieldList: [
    {
      batchName: "jsonDatas",
      fieldList: [
        {
          label: "Name/名称",
          fieldName: "name",
          required: true,
          formVisible: true,
        },
        {
          label: "Value/值",
          fieldName: "value",
          required: true,
          formVisible: true,
        },
      ],
    },
  ],
});

// 公共事件方法
const itemAction = (prep: any) => allAction(props, emits, formData, prep);

// 关键差异逻辑：根据 dataType 动态处理
const editJsonData = async (devType: boolean) => {
  props.field.preps["devType"] = devType;
  const jsonStr = formData.value[props.field.fieldName];
  const temp: any = {};

  if (jsonStr && typeof jsonStr == "string") {
    // 根据 dataType 解析为对象或数组
    const parsedData = convertData(jsonStr);
    jsonData.value = convertData(parsedData);

    // 对象需要转换为键值对数组，数组直接使用
    temp["jsonDatas"] =
        props.dataType === "object"
            ? Object.entries(parsedData).map(([name, value]) => ({name, value}))
            : parsedData;
  } else {
    temp["jsonDatas"] = props.dataType === "object" ? [{}] : [];
  }

  dialogInputVisible.value = true;
  await nextTick();
  if (!devType) jsonFormRef.value.setFormData(temp);
};

const selectItem = async () => {
  if (props.field.preps["devType"]) {
    // 开发模式直接序列化当前 jsonData
    formData.value[props.field.fieldName] =
        typeof jsonData.value == "string"
            ? jsonData.value
            : JSON.stringify(jsonData.value);
  } else {
    // 设计模式根据 dataType 转换数据
    let flag = false;
    await jsonFormRef.value.$refs.starHorseFormRef.validate(
        (res) => (flag = res),
    );
    if (!flag) return;

    const temp = jsonFormRef.value.getFormData().value;
    const dataList = temp["jsonDatas"];

    // 数组直接使用，对象需要转换为键值对对象
    formData.value[props.field.fieldName] =
        props.dataType === "object"
            ? JSON5.stringify(
                Object.fromEntries(
                    dataList.map(({name, value}) => [name, value]),
                ),
            )
            : JSON5.stringify(dataList);
  }
  closeAction();
};

// 公共方法（与原组件一致）
const resetForm = () => jsonFormRef.value.setFormData({jsonDatas: [{}]});
const closeAction = () => (dialogInputVisible.value = false);
</script>

<style lang="scss" scoped>
/* 与原 json-item.vue 样式完全一致 */
.json-comp {
  width: 100%;
  display: flex;
  align-items: center;

  .json-box {
    flex: 1;
    margin-right: 5px;
  }

  .json-btn {
    cursor: pointer;
    flex-direction: column;
    width: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
