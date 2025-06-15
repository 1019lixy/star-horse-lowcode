<script setup lang="ts" name="StarHorseItem">
import {computed, inject, ModelRef, onMounted, PropType, ref, shallowRef, unref, watch} from 'vue';
import {warning} from '@/utils/message';
import {FieldInfo} from '@/components/types/PageFieldInfo';
import {useSelfOperationStore} from '@/store/SelfOperation';
import piniaInstance from '@/store';
import {compKey, uuid} from '@/api/system';
import {Config} from '@/api/settings';
import {SearchFields} from '@/components/types/SearchProps';
import {checkVisible} from '@/api/form_utils';

const props = defineProps({
  item: {type: Object as PropType<any>, required: true},
  column: {type: Object},
  primaryKey: {type: Object as PropType<any>},
  // 数据索引
  dataIndex: {type: Number, default: -1},
  bareFlag: {type: Object as PropType<any>, default: false},
  batchName: {type: String, default: ''},
  compSize: {type: String, default: Config.compSize},
  isSearch: {type: Boolean, default: false}, //是否查询数据
  showLabel: {type: Boolean, default: true}, //是否显示标签
  isEdit: {type: Boolean, default: false}, //是否编辑数据
  isView: {type: Boolean, default: false}, //是否视图数据
  isDesign: {type: Boolean, default: false}
});
let userOperation = useSelfOperationStore(piniaInstance);
const dataForm: ModelRef<any> = defineModel('dataForm');
const itemType = ref<string>('input');
const emit = defineEmits(['dataSearch', 'focus', 'blur']);
const formFields: any = inject('formFields', {});
const defaultAction = ref('normal');
const typeList = ['select', 'tselect', 'date', 'daterange'];
const actionName = ref();
const componentRef = ref();
const isDragging = ref(false);
const startX = ref(0);
const startWidth = ref(0);
const dragWidth = ref<string | null>(null);
const bareStyle = computed(() => ({
  height: itemType.value != 'button' ? '100%' : 'inherit',
  minWidth: props.isSearch ? '200px' : 'unset',
  maxHeight: props.isSearch ? '500px' : 'unset',
  width: props.isSearch ? dragWidth.value || props.item.minWidth || 'inherit' : '100%',
  position: 'relative'
}));
/**
 * 组件派发事件
 * @param act
 * @param params
 */
const actionDispatcher = (act: string, ...params: any[]) => {
  if (props.isSearch) {
    if (!act || act == 'focus' || act == 'blur') {
      return;
    }
    emit('dataSearch', params);
  } else {
    let actionFun = props.item.actions;
    if (actionFun && actionName.value == act) {
      actionFun(dataForm.value, params);
    }
    if (act == 'focus') {
      emit('focus', props.column, params);
    } else if (act == 'blur') {
      emit('blur', props.column, params);
    }
  }
};
//页面属性改变，重新刷新数据
watch(
    () => [
      props.item,
      props.isEdit
    ],
    () => {
      console.log('组件属性改变', props.item);
      compPreps();
    },
    {
      immediate: false,
      deep: true
    }
);
const dateType: Array<string> = ['year', 'month', 'date', 'datetime', 'week', 'datetimerange', 'daterange'];
const init = () => {
  if (!props.item['id']) {
    props.item['id'] = uuid();
  }
  props.item["clearable"] = true;
  props.item["readonly"] = props.item?.readonly || props.isView;
  if (props.item.preps) {
    let keys = Object.keys(props.item.preps);
    for (let key in keys) {
      let val = props.item.preps[key];
      if (val == 'Y' || val == 'N') {
        props.item.preps[key] = val == 'Y';
      }
    }
  }
  compPreps();
}
const compPreps = () => {
  itemType.value = props.item?.type || props.item?.fieldType || 'input';
  if (dateType.includes(itemType.value)) {
    itemType.value = 'datetime';
    //日期默认以时间戳赋值
  }
  //过滤掉查询表单的信息
  if (!props.isSearch && formFields) {
    let fieldName = props.item.fieldName;
    //如果数据来源于列表
    if (props.batchName) {
      let batchFields = formFields[props.batchName];
      if (!batchFields) {
        formFields[props.batchName] = [];
      }
      let row = formFields[props.batchName][dataForm.value['xh'] - 1];
      if (!row) {
        formFields[props.batchName].push([]);
      } else {
        row.push(props.item);
      }
    } else {
      formFields[fieldName] = props.item;
    }
  }
  //将表单属性存储起来
  if (!props.isSearch) {
    userOperation.addFormItem(props.item);
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
  document.body.style.userSelect = 'none';
};

const onDrag = (e: MouseEvent) => {
  if (!isDragging.value) return;
  const delta = e.clientX - startX.value;
  const newWidth = startWidth.value + delta;
  if (newWidth > 100) { // 最小宽度限制
    dragWidth.value = `${newWidth}px`;
  }
};

const stopDrag = () => {
  if (isDragging.value) {
    isDragging.value = false;
    document.body.style.userSelect = '';
  }
};
const checkClassName = () => {
  if (props.bareFlag === true || props.bareFlag == 'Y' || props.item.preps?.headerFlag) {
    return 'bare-comp';
  } else {
    return 'comp-info';
  }
}
onMounted(() => {
  if (typeList.includes(props.item?.type) || typeList.includes(props.item?.fieldType)) {
    defaultAction.value = 'change';
  }
  actionName.value = props.item?.actionName??defaultAction.value;
  init();
});
</script>
<template>
  <div :class="checkClassName()" :style="bareStyle"
       @mousemove="onDrag"
       @mouseup="stopDrag"
       @mouseleave="stopDrag"
  >
    <div
        class="drag-handle"
        @mousedown.prevent="startDrag"
        v-if="itemType != 'button'&&isSearch"
    ></div>
    <component
        :key="item.id"
        :is="(dataForm&&dataForm['_' + item.fieldName + 'Type'] || itemType) + '-item'"
        @selfFunc="actionDispatcher"
        :isDesign="isDesign"
        ref="componentRef"
        :isSearch="isSearch"
        :bareFlag="bareFlag"
        :field="item"
        :dataIndex="dataIndex"
        v-model:formData="dataForm"
    />
    <div v-if="item.brotherNodes" style="width: 15px"/>
    <template v-for="(temp,key) in item.brotherNodes" :key="compKey(temp,key)">
      <star-horse-item
          v-if="checkVisible(temp,dataForm)"
          :primaryKey="primaryKey"
          :compSize="compSize"
          v-model:dataForm="dataForm"
          :item="temp"
          :isDesign="isDesign"
          :dataIndex="dataIndex"
          :bareFlag="true"
          :isEdit="isEdit"
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
