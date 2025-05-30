<template>
  <star-horse-dialog
      :title="field.preps['label'] + '数据选择'"
      :self-func="true"
      :dialog-visible="dialogInputVisible"
      @merge="selectItem"
      @closeAction="closeAction"
  >
    <star-horse-search-comp
        @searchData="(data: any) => dialogInputTableRef.createSearchParams(data)"
        :formData="field.preps['searchFieldList']"
        :compUrl="field.preps['dataUrl']"
    />
    <star-horse-table-comp
        :fieldList="field.preps['fieldList']"
        :primaryKey="field.preps['primaryKey']"
        :compUrl="field.preps['dataUrl']"
        ref="dialogInputTableRef"
        :dialogInput="true"
        height="400px"
        :filterCondition="field.preps['filterCondition']"
        :orderBy="field.preps['orderBy']"
        @selectItem="selectItem"
        :dataFormat="field.preps['dataFormat']"
        :disableAction="true"
    />
  </star-horse-dialog>
  <starhorse-form-item
      :isDesign="isDesign"
      :disabled="disabled"
      :bareFlag="bareFlag"
      :formItem="field"
      :parentField="parentField"
  >
    <el-input
        :clearable="field.preps['clearable'] == 'Y'"
        :disabled="checkIsDisabled(props)"
        :max="field.preps['max']"
        :maxlength="field.preps['maxlength']"
        :min="field.preps['min']"
        :minlength="field.preps['maxlength']"
        :placeholder="field.preps['placeholder'] || '请输入' + field.preps['label']"
        :prefix-icon="field.preps['prefixIcon']"
        :readonly="field.preps['readonly'] == 'Y'"
        :size="formInfo?.size || field?.preps['size'] || 'default'"
        type="text"
        :fid="field.preps['name']"
        @change="itemAction('change')"
        @input="itemAction('input')"
        @keydown.enter="itemAction('enter')"
        @focus="itemAction('focus')"
        @blur="itemAction('blur')"
        v-model="formData[field.preps['name']]"
    >
      <template #append>
        <el-button
            icon="Search"
            @click="showVisible"
            :size="formInfo?.size || field?.preps['size'] || 'default'"
            :disabled="checkIsDisabled(props)"
        />
      </template>
    </el-input>
  </starhorse-form-item>
</template>
<script setup lang="ts">
import {nextTick, onMounted, ref, shallowRef} from 'vue';
import {warning} from '@/utils/message';
import {FieldMapping} from '@/components/types/PageFieldInfo';
import {isJson} from '@/api/star_horse_utils';
import {allAction, checkIsDisabled} from '@/components/formcomp/utils/ItemRelationEventUtils';

const props = defineProps({
  isDesign: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  bareFlag: {
    type: Boolean,
    default: false
  }, isSearch: {
    type: Boolean,
    default: false
  },
  field: {
    type: Object,
    default: {}
  },
  parentField: {
    type: Object,
    default: {}
  },
  formInfo: {
    type: Object,
    default: {}
  }
});
const emits = defineEmits(['selfFunc', 'selectItem']);
const formData = defineModel("formData");
const dialogInputTableRef = ref();
let dialogInputVisible = shallowRef(false);
let actionName = shallowRef('normal');
const itemAction = (prep: any) => {
  allAction(props, emits, formData, prep);
};
const selectItem = (row: any) => {
  let data = '';
  let needField = props.field.preps['needField'];
  if (!row || !isJson(row)) {
    let selectDatas = dialogInputTableRef.value.multipleSelection;
    if (!selectDatas) {
      warning('请选择数据');
      return;
    }
    data = selectDatas[0];
  } else {
    data = row;
  }
  //如果没有指定属性，则默认取相同的属性
  let name = props.field.preps['name'];
  if (!needField) {
    formData.value[name] = data[name];
  } else {
    needField.forEach((item: FieldMapping) => {
      if (needField.length == 1) {
        formData.value[name] = data[item.sourceField];
      } else {
        formData.value[item.distField] = data[item.sourceField];
      }
    });
  }
  console.log(data, needField);
  if (props.field.preps['recall']) {
    props.field.preps['recall'](row);
  }
  closeAction();
};
const closeAction = () => {
  dialogInputVisible.value = false;
};
const showVisible = () => {
  dialogInputVisible.value = true;
  nextTick(() => {
    let fields = props.field.preps['needField'];
    let name = props.field.preps['name'];
    let realName = name;
    if (props.field.preps['aliasName']) {
      realName = props.field.preps['aliasName'];
    }
    if (fields) {
      name = fields.map((item: FieldMapping) => item.sourceField)[0];
    }
    dialogInputTableRef.value?.setDataInfo(name, formData.value[realName]);
  });
};

onMounted(() => {
  actionName.value = props.field.preps?.actionName || 'normal';
  if (!props.isSearch) {
    allAction(props, emits, formData, actionName.value, true);
  }
});
</script>
<style lang="scss" scoped>
:deep(.el-input-group__append) {
  padding: 0 20px !important;
}

.cell.el-tooltip {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
