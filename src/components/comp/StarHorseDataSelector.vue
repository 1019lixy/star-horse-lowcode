<script setup lang="ts">
import {useVModel} from "@vueuse/core";
import DataPicker, {type ModelValueType,} from "@/components/comp/utils/DataPicker.vue";
import {computed, CSSProperties, onMounted, ref, watch} from "vue";
import StarHorseIcon from "@/components/comp/StarHorseIcon.vue";
import {postRequest} from "@/api/star_horse_apis";
import {createCondition} from "@/api/star_horse_utils";

export interface DataSelectorProps {
  modelValue: ModelValueType;
  selectedData?: any;
  placeholder?: string;
  dataUrl?: string;
  datas?: Array<any>;
  pageSize?: number;
  title?: string;
  compSize?: string;
  displayName?: string;
  displayValue?: string;
  multiple?: boolean;
  disabled?: boolean;
  checkStrictly?: boolean;
  selectLeaf?: boolean;
  showTagLength?: number;
  style?: CSSProperties;
}

const props = withDefaults(defineProps<DataSelectorProps>(), {
  multiple: false,
  disabled: false,
  compSize: "small",
  pageSize: 0,
  displayName: "name",
  displayValue: "value",
  checkStrictly: true,
  selectLeaf: false,
  showTagLength: 3,
  placeholder: "请选择数据",
});
const emits = defineEmits<{
  (e: "update:modelValue", modelValue: ModelValueType): void;
  (e: "update:selectedData", selectData: any): void;
  (e: "selectedData", selectData: any): void;
}>();
const value: any = useVModel(props, "modelValue", emits);
const emitData: any = useVModel(props, "selectedData", emits);
const selectData: any = ref<any>(props.multiple ? [] : "");
const valueArr = computed<string[]>(() => {
  if (selectData.value) {
    return Array.isArray(selectData.value)
        ? selectData.value
        : [selectData.value];
  }
  return [];
});


const dataPickerRef = ref<InstanceType<typeof DataPicker>>();

const openDataPicker = () => {
  if (props.disabled) return;
  dataPickerRef.value?.open();
};
const onClose = (data: any) => {
  if (!selectData.value) return;
  if (props.multiple && Array.isArray(selectData.value)) {
    selectData.value.splice(selectData.value.indexOf(data), 1);
    value.value.splice(selectData.value.indexOf(data[props.displayValue]), 1);
  } else {
    selectData.value = [];
    value.value = props.multiple ? [] : "";
  }
  emits("selectedData", selectData.value);
};
/**
 * 递归查找树结构数据中符合条件的节点
 * @param nodes 树结构数据节点数组
 * @param result 符合条件的节点结果数组
 * @returns 符合条件的节点结果数组
 */
const findInTree = (nodes: any[], result: any[]) => {
  nodes.forEach(node => {
    // 检查当前节点是否匹配
    if (Array.isArray(value.value)) {
      if (value.value.includes(node[props.displayValue])) {
        const temp = {...node};
        delete temp.children;
        result.push(temp);
      }
    } else if (node[props.displayValue] === value.value) {
      const temp = {...node};
      delete temp.children;
      result.push(temp);
    }
    // 递归处理子节点
    if (node.children) {
      findInTree(node.children, result);
    }
  });
  return result;
};
/**
 * 初始化数据选择器
 */
const init = () => {
  if (props.datas) {
    selectData.value = findInTree(props.datas, []);
  } else if (props.dataUrl && value.value) {
    let params: any = {
      currentPage: 0,
      pageSize: 100,
      fieldList: [
        createCondition(props.displayValue, Array.isArray(value.value) ? value.value : [value.value], "in")
      ],
      orderBy: [],
    };
    postRequest(props.dataUrl!, params)
        .then((res) => {
          if (res?.data?.code) {
            console.error(res?.data?.cnMessage);
            return;
          }
          let redata = res?.data?.data;
          selectData.value = findInTree(redata?.dataList || redata, []);
        })
        .catch((err: any) => {
          console.log(err);
        });
  }
}
const addTag = (val: any) => {
  const temp = {
    [props.displayName]: val,
    [props.displayValue]: val,
  }
  if (props.multiple && Array.isArray(selectData.value)) {
    selectData.value.push(temp);
  } else {
    selectData.value = [temp];
  }
}
const tagVisible = (val: any) => {
  return selectData?.value?.find((item: any) => item[props.displayValue] === val)?.[props.displayName]??val;
};
onMounted(() => {
  init();
});
// 新增 watch 监听 selectData 变化
watch(selectData, (newVal) => {
  // 同步modelValue
  value.value = Array.isArray(newVal)
      ? newVal.map(v => v[props.displayValue])
      : newVal?.[props.displayValue];
  // 同步selectedData
  emitData.value = newVal;
}, {deep: true});
</script>

<template>
  <data-picker
      ref="dataPickerRef"
      :title="title"
      :datas="datas"
      :data-url="dataUrl"
      :page-size="pageSize"
      :display-name="displayName"
      :display-value="displayValue"
      :checkStrictly="checkStrictly"
      :select-leaf="selectLeaf"
      :multiple="multiple"
      v-model="selectData"
  />
  <el-input-tag v-model="valueArr" v-bind="{...props,...$attrs}"
                @clear="selectData=[]"
                @addTag="addTag"
                @removeTag="(val)=>{
    onClose(val);
  }">
    <template #prefix>
      <star-horse-icon
          @click="openDataPicker"
          cursor="pointer"
          icon-class="select-data"
          size="22px"
          :border="true"
      />
    </template>
    <template #tag="{ value }">
      <div class="flex items-center">
        <span>{{ tagVisible(value) }}</span>
      </div>
    </template>
  </el-input-tag>
</template>

<style scoped lang="scss">
.el-tag {
  padding: 0 3px;
}


</style>
