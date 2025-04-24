<template>
  <starhorse-form-item
      :isDesign="context.attrs['isDesign']"
      :disabled="context.attrs['disabled']"
      :bareFlag="context.attrs['bareFlag']"
      :form-item="field"
      :parentField="parentField"
  >
    <el-autocomplete
        :fid="field.preps['name']"
        :clearable="field.preps['clearable'] == 'Y'"
        :disabled="checkIsDisabled(context)"
        :readonly="field.preps['readonly'] == 'Y'"
        :fetch-suggestions="querySearch"
        :fit-input-width="field.preps['fitInputWidth'] == 'Y'"
        :aria-label="field.preps['label']"
        :hide-loading="false"
        :size="context.attrs.formInfo?.size || field?.preps['size'] || 'default'"
        :placeholder="field.preps['placeholder'] || '请输入' + field.preps['label']"
        :placement="field.preps['placement'] || 'bottom-start'"
        :teleported="field.preps['teleported'] == 'Y'"
        :trigger-on-focus="field.preps['triggerOnFocus'] == 'Y'"
        :value-key="field.preps['valueKey'] || 'value'"
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
import {defineComponent, onMounted, shallowRef} from "vue";
import {compDynamicData, createFilter, dynamicUrlOperation} from "@/api/star_horse_utils.ts";
import {SearchParams} from "@/components/types/Params";
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
    /**
     * 动态获取数据
     */
    const initData = async () => {
      field.preps["values"] = await compDynamicData(field.preps);
    };
    onMounted(() => {
      initData();
      actionName.value = field.preps?.actionName || "normal";
      if (!context.attrs["isSearch"]) {
        allAction(context, actionName.value, true);
      }
    });
    const querySearch = async (queryString: string, cb: (arg: any) => void) => {
      let temp = field.preps;
      let dataSource = temp["dataSource"];
      if (dataSource == "url") {
        let searchParams: SearchParams[] = [];
        searchParams.push({
          propertyName: temp["selectLabel"],
          value: queryString,
          operation: "lk"
        });
        temp["values"] = await dynamicUrlOperation(temp, searchParams);
        cb(temp["values"]);
      } else {
        const results = queryString ? temp["values"].filter(createFilter(queryString)) : temp["values"];
        cb(results);
      }
    };

    const handSelect = (item: Record<string, any>) => {
      console.log(item);
    };
    return {
      parentField,
      context,
      field,
      formItem,
      dataField,
      itemAction,
      querySearch,
      actionName,
      handSelect
    };
  }
});
</script>
<style scoped></style>
