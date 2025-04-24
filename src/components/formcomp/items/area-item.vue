<template>
  <starhorse-form-item
      :isDesign="context.attrs['isDesign']"
      :disabled="context.attrs['disabled']"
      :bareFlag="context.attrs['bareFlag']"
      :form-item="field"
      :parentField="parentField"
  >
    <el-cascader
        :fid="field.preps['name']"
        :clearable="field.preps['clearable'] == 'Y'"
        :filterable="field.preps['filterable'] == 'Y'"
        :collapse-tags="field.preps['collapseTags'] == 'Y'"
        :collapse-tags-tooltip="field.preps['collapseTagsTooltip'] == 'Y'"
        :disabled="checkIsDisabled(context)"
        :options="areaData"
        :placeholder="'请选择' + field.preps['label']"
        :props="{
        multiple: field.preps['props']?.multiple == 'Y',
        checkStrictly: field.preps['props']?.checkStrictly == 'Y',
        expandTrigger: field.preps['props']?.expandTrigger || 'click',
        label: 'name',
        value: 'code',
        emitPath: field.preps['props']?.emitPath == 'Y'
      }"
        :separator="field.preps['separator']"
        :show-all-levels="field.preps['showAllLevels'] == 'Y'"
        :size="context.attrs.formInfo?.size || field?.preps['size'] || 'default'"
        :tag-type="field.preps['tagType']"
        @change="itemAction('change')"
        @input="itemAction('input')"
        @keydown.enter="itemAction('enter')"
        @focus="itemAction('focus')"
        @blur="itemAction('blur')"
        v-model="context.attrs['formData'][field.preps['name']]"
    />
  </starhorse-form-item>
</template>
<script lang="ts">
import {defineComponent, nextTick, onMounted, shallowRef} from "vue";
import {compDynamicData} from "@/api/star_horse_utils.ts";
import areaData from "@/api/pcas-code.json";
import {allAction, checkIsDisabled} from "@/components/formcomp/utils/ItemRelationEventUtils.ts";

export default defineComponent({
  methods: {checkIsDisabled},
  setup(_props, context) {
    const parentField = context.attrs["parentField"];

    const field = context.attrs["field"] as any;
    let formItem = shallowRef({label: "input", required: false});
    let dataField = shallowRef("");
    let actionName = shallowRef("normal");
    const itemAction = (prep: any) => {
      allAction(context, prep);
    };
    const lazyLoad = (node, resolve) => {
    };
    const initData = async () => {
      await nextTick();
      field.preps["values"] = await compDynamicData(field.preps);
      let data = context.attrs["formData"][field.preps["name"]];
      if (data) {
        context.attrs["formData"][field.preps["name"]] = JSON.parse(data);
      } else {
        //解决加载慢问题，导致数据没法回显
        setTimeout(() => {
          let data = context.attrs["formData"][field.preps["name"]];
          context.attrs["formData"][field.preps["name"]] = data ? JSON.parse(data) : [];
        }, 200);
      }
    };
    onMounted(() => {
      initData();
      actionName.value = field.preps?.actionName || "normal";
      if (!context.attrs["isSearch"]) {
        allAction(context, actionName.value, true);
      }
    });
    return {
      parentField,
      context,
      field,
      formItem,
      dataField,
      itemAction,
      actionName,
      lazyLoad,
      areaData
    };
  }
});
</script>
<style lang="scss" scoped>
:deep(.el-cascader) {
  width: 100%;
}
</style>
