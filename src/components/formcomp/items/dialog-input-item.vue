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
      :isDesign="context.attrs['isDesign']"
      :disabled="context.attrs['disabled']"
      :bareFlag="context.attrs['bareFlag']"
      :formItem="field"
      :parentField="parentField"
  >
    <el-input
        :clearable="field.preps['clearable'] == 'Y'"
        :disabled="checkIsDisabled(context)"
        :max="field.preps['max']"
        :maxlength="field.preps['maxlength']"
        :min="field.preps['min']"
        :minlength="field.preps['maxlength']"
        :placeholder="field.preps['placeholder'] || '请输入' + field.preps['label']"
        :prefix-icon="field.preps['prefixIcon']"
        :readonly="field.preps['readonly'] == 'Y'"
        :size="context.attrs.formInfo?.size || field?.preps['size'] || 'default'"
        type="text"
        :fid="field.preps['name']"
        @change="itemAction('change')"
        @input="itemAction('input')"
        @keydown.enter="itemAction('enter')"
        @focus="itemAction('focus')"
        @blur="itemAction('blur')"
        v-model="context.attrs['formData'][field.preps['name']]"
    >
      <template #append>
        <el-button
            icon="Search"
            @click="showVisible"
            :size="context.attrs.formInfo?.size || field?.preps['size'] || 'default'"
            :disabled="checkIsDisabled(context)"
        />
      </template>
    </el-input>
  </starhorse-form-item>
</template>
<script lang="ts">
import {defineComponent, nextTick, onMounted, ref, shallowRef} from 'vue';
import {warning} from '@/utils/message';
import {FieldMapping} from '@/components/types/PageFieldInfo';
import {SearchParams} from '@/components/types/Params';
import {isJson} from '@/api/star_horse_utils.ts';
import {allAction, checkIsDisabled} from '@/components/formcomp/utils/ItemRelationEventUtils.ts';

export default defineComponent({
  methods: {checkIsDisabled},
  setup(_props, context) {
    const parentField = context.attrs['parentField'];

    const field = context.attrs['field'] as any;
    const dialogInputTableRef = ref();
    let formItem = shallowRef({label: 'input', required: false});
    let dataField = shallowRef('');
    let dialogInputVisible = shallowRef(false);
    // let multipleSelection = shallowRef<any>([]);
    // let instance=getCurrentInstance();
    const dynamicFunction = (data: any) => {
      if (!data) {
        return;
      }
      try {
        let fun = new Function(data);
        fun.call(this);
      } catch (e) {
        console.error(e);
      }
    };
    let actionName = shallowRef('normal');
    const itemAction = (prep: any) => {
      allAction(context, prep);
    };
    const selectItem = (row: any) => {
      let data = '';
      let needField = field.preps['needField'];
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
      let name = field.preps['name'];
      if (!needField) {
        context.attrs['formData'][name] = data[name];
      } else {
        needField.forEach((item: FieldMapping) => {
          if (needField.length == 1) {
            context.attrs['formData'][name] = data[item.sourceField];
          } else {
            context.attrs['formData'][item.distField] = data[item.sourceField];
          }
        });
      }
      console.log(data, needField);
      if (field.preps['recall']) {
        field.preps['recall'](row);
      }
      closeAction();
    };
    const closeAction = () => {
      dialogInputVisible.value = false;
    };
    const showVisible = () => {
      dialogInputVisible.value = true;
      nextTick(() => {
        let fields = field.preps['needField'];
        let name = field.preps['name'];
        let realName = name;
        if (field.preps['aliasName']) {
          realName = field.preps['aliasName'];
        }
        if (fields) {
          name = fields.map((item: FieldMapping) => item.sourceField)[0];
        }
        dialogInputTableRef.value?.setDataInfo(name, context.attrs['formData'][realName]);
      });
    };
    const searchData = (data: SearchParams[]) => {
      dialogInputTableRef.value?.createSearchParams(data);
    };
    onMounted(() => {
      actionName.value = field.preps?.actionName || 'normal';
      if (!context.attrs['isSearch']) {
        allAction(context, actionName.value, true);
      }
    });
    return {
      parentField,
      context,
      field,
      formItem,
      dataField,
      dynamicFunction,
      itemAction,
      dialogInputVisible,
      closeAction,
      showVisible,
      actionName,
      dialogInputTableRef,
      searchData,
      selectItem
    };
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
