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
const selectData: any = ref<any>();
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
    selectData.value = null;
    value.value = null;
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
  } else if (props.dataUrl) {
    let params: any = {
      currentPage: 0,
      pageSize: 100,
      fieldList: [
        createCondition(props.displayValue, value.value, "in")
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
    selectData.value = temp;
  }
}
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
  <el-input-tag v-model="valueArr"  v-bind="{...props,...$attrs}"
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
        <span>{{ value[displayName] ?? value }}</span>
      </div>
    </template>
  </el-input-tag>
  <!--  <div class="data-wrapper ">
      <star-horse-icon
          @click="openDataPicker"
          cursor="pointer"
          icon-class="select-data"
          size="22px"
          :border="true"
      />
      <template v-if="valueArr.length>1">
        <DataTag
            v-for="(item, key) in valueArr.slice(0,showTagLength)"
            :key="compKey(item, key)"
            :closable="!disabled"
            :data="item"
            :display-name="displayName"
            :display-value="displayValue"
            @close="onClose"
        />
        <el-text
            v-if="valueArr.length > showTagLength"
            type="info"
            class="placeholder"
        >
          <el-tooltip
              v-if="valueArr.length > showTagLength"
              placement="top"
              effect="light"
              :disabled="disabled"
          >
            <template #content>
              <div class="tooltip-content">
                <DataTag
                    v-for="(item, index) in valueArr.slice(showTagLength)"
                    :key="compKey(item, index)"
                    :closable="!disabled"
                    :data="item"
                    :display-name="displayName"
                    :display-value="displayValue"
                    @close="onClose"
                    class="tooltip-item my-[5px]"
                />
              </div>
            </template>
            <span class="more-text">+{{ valueArr.length - showTagLength }} more</span>
          </el-tooltip>
        </el-text>
      </template>
      <el-text v-else>
        {{ valueArr[0]?.[displayName] ?? valueArr[0] }}
      </el-text>

      <el-text v-show="!value || value.length === 0" class="placeholder">
        {{ placeholder }}
      </el-text>
    </div>-->
</template>

<style scoped lang="scss">
.el-tag {
  padding: 0 3px;
}

.data-wrapper {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  grid-gap: 7px;
  gap: 7px;
  justify-content: start;
  width: 100%;
  border: 1px solid var(--el-border-color);

  .placeholder {
    color: var(--el-text-color-placeholder);
  }

  &:focus {
    border-color: var(--el-color-primary);
  }

  .data-but-item {
    border-style: dashed;

    &:hover {
      border-style: solid;
    }
  }
}

.tooltip-content {
  max-height: 200px;
  overflow-y: auto;

  .tooltip-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px 0;

    .close-icon {
      margin-left: 8px;
      cursor: pointer;

      &:hover {
        color: var(--el-color-primary);
      }
    }
  }
}
</style>
