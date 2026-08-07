<script setup lang="ts">
import {PageFieldInfo} from "@/components/types/PageFieldInfo";
import {SelectOption} from "@/components/types/SearchProps";
import {ModelRef, nextTick, onMounted, PropType, reactive, ref, watch,} from "vue";

defineOptions({
  name: "WebUrlComp",
});
const props = defineProps({
  formProps: {
    type: Object as PropType<any>,
    default: () => {
    },
  },

  preps: {
    type: Object as PropType<any>,
    default: () => {
    },
  },

  item: {
    type: Object as PropType<PageFieldInfo>,
    default: () => {
    },
  },
  source: {
    type: Number,
    default: 0,
  },
  batchName: {
    type: String,
    default: "",
  },
  subFormFlag: {
    type: Boolean,
    default: false,
  },
});

const dataSourceFormRef = ref();
const dataForm: ModelRef<any> = defineModel("dataForm");
const matchTypeList = [];
const disableUrl = ref<boolean>(false);
const currentTabName = ref<string>("data");
const fieldList = ref<SelectOption[]>([]);
let envList = ref<Array<SelectOption>>([]);

const dataSourceField = reactive<PageFieldInfo | any>({
  fieldList: [
    [
      {
        label: "系统环境",
        fieldName: "env",
        type: "select",
        required: false,
        defaultValue: "dev",
        formVisible: true,
        listVisible: true,
        preps: {
          values: envList,
        },
      },
      {
        label: "请求方式",
        fieldName: "httpMethod",
        type: "select",
        required: false,
        defaultValue: "POST",
        formVisible: true,
        listVisible: true,
        preps: {
          values: [],
        },
      },
      {
        label: "协议",
        fieldName: "protocol",
        type: "select",
        required: false,
        defaultValue: "http",
        formVisible: true,
        listVisible: true,
        preps: {
          values: [
            {name: "HTTP", value: "http"},
            {name: "HTTPS", value: "https"},
          ],
        },
      },
    ],
    [
      {
        label: "IP/域名/服务名",
        fieldName: "host",
        required: false,
        formVisible: true,
        listVisible: true,
        preps: {
          colspan: 16,
        },
      },
      {
        label: "端口",
        fieldName: "port",
        type: "number",
        min: 1,
        max: 65535,
        formVisible: true,
        listVisible: true,
        preps: {
          colspan: 8,
        },
      },
    ],
    [
      {
        label: "接口地址",
        fieldName: "interfaceUrl",
        required: true,
        formVisible: true,
        preps: {
          colspan: 20,
        },
      },
      {
        label: "校验",
        type: "button",
        formVisible: true,
        actions: {
          click: async (val: any) => {
          },
        },
        preps: {
          icon: "valid",
          colspan: 4,
        },
      },
    ],
    [
      {
        label: "标签名字段",
        fieldName: "selectLabel",
        type: "select",
        defaultValue: "",
        required: false,
        formVisible: true,
        listVisible: true,
        preps: {
          values: fieldList,
        },
      },
      {
        label: "标签值字段",
        fieldName: "selectValue",
        type: "select",
        defaultValue: "",
        preps: {
          values: fieldList,
        },
        required: false,
        formVisible: true,
        listVisible: true,
      },
    ],
    {
      fieldName: "queryParams",
      tabList: [
        {
          title: "标准参数",
          tabName: "queryParams",
          objectName: "queryParams",
          batchFieldList: [
            {
              batchName: "queryParams",
              fieldList: [
                {
                  label: "参数名",
                  fieldName: "name",
                  type: "select",
                  required: false,
                  formVisible: true,
                  listVisible: true,
                  preps: {
                    values: fieldList,
                    allowCreate: "Y",
                  },
                },
                {
                  label: "参数值",
                  fieldName: "value",
                  required: false,
                  formVisible: true,
                  listVisible: true,
                },
                {
                  label: "匹配方式",
                  fieldName: "matchType",
                  type: "select",
                  defaultValue: "eq",
                  required: false,
                  formVisible: true,
                  listVisible: true,
                  preps: {
                    values: matchTypeList,
                  },
                },
              ],
            },
          ],
        },
        {
          title: "自定义参数",
          tabName: "customParams",
          objectName: "customParams",
          fieldList: [
            {
              fieldName: "customParams",
              label: "自定义JSON参数",
              type: "json",
              formVisible: true,
              listVisible: true,
              required: false,
              defaultValue: "",
              preps: {
                devType: "Y",
              },
            },
          ],
        },
      ],
    },
  ],
});
const submitValid = async () => {
  let flag: boolean = false;
  return flag;
};
const isInited = ref<boolean>(false);
const createSubForm = () => {
  if (props.subFormFlag && !dataForm.value[props.batchName]) {
    dataForm.value[props.batchName] = {};
  }
  return props.batchName;
};
const init = () => {
  nextTick(() => {
    if (props.preps?.objectName && dataForm.value) {
      let temp = dataForm.value;
      setFormData(temp);
      currentTabName.value = temp.dataSource || "data";
      isInited.value = true;
    }
  });
};
const setFormData = (data: any) => {
  !dataForm.value && dataSourceFormRef.value?.setFormData(data);
};
const getFormData = () => {
  return dataSourceFormRef.value?.getFormData();
};
watch(
    () => dataForm.value?.dataSource,
    (val) => {
      currentTabName.value = val || "data";
    },
);
onMounted(() => {
  init();
});

defineExpose({
  submitValid,
  setFormData,
  getFormData,
});
</script>

<template>
  <el-scrollbar height="100%">
    <star-horse-form
        :fieldList="dataSourceField"
        ref="dataSourceFormRef"
        v-if="!dataForm"
    />
    <star-horse-form-item
        v-else
        ref="dataSourceFormRef"
        :fieldList="dataSourceField"
        :subFormFlag="subFormFlag ? 'Y' : 'N'"
        :propPrefix="batchName"
        :key="createSubForm()"
        :batchName="batchName"
        :source="source"
        v-model:dataForm="dataForm[batchName]"
    />
  </el-scrollbar>
</template>

<style scoped lang="scss"></style>
