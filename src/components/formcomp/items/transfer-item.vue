<template>
  <starhorse-form-item
    :isDesign="context.attrs['isDesign']"
    :bareFlag="context.attrs['bareFlag']"
    :form-item="field"
    :parentField="parentField"
  >
    <el-transfer
      :fid="field.preps['name']"
      :button-texts="field.preps['buttonTexts']"
      :data="field.preps['values']"
      :props="{
        key: field.preps['props']?.key || 'value',
        label: field.preps['props']?.label || 'name'
      }"
      :filter-placeholder="field.preps['filterPlaceholder'] || '请输入' + field.preps['label']"
      :filterable="field.preps['filterable'] == 'Y'"
      :format="{
        noChecked: '${total}',
        hasChecked: '${checked}/${total}'
      }"
      :target-order="field.preps['targetOrder']"
      :titles="[field.preps['leftTitle'], field.preps['rightTitle']]"
      :size="context.attrs.formInfo?.size || field?.preps['size'] || 'default'"
      :left-default-checked="JSON.parse(field.preps['leftDefaultChecked'])"
      :right-default-checked="JSON.parse(field.preps['rightDefaultChecked'])"
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
  import { defineComponent, onMounted, shallowRef } from "vue";
  import { compDynamicData } from "@/api/star_horse_utils.ts";
  import { SelectOption } from "@/components/types/SearchProps";
  import { allAction } from "@/components/formcomp/utils/ItemRelationEventUtils.ts";

  export default defineComponent({
    setup(_props, context) {
      const parentField = context.attrs["parentField"];

      const field = context.attrs["field"] as any;
      let formItem = shallowRef({ label: "input", required: false });
      let dataField = shallowRef("");
      let actionName = shallowRef("normal");
      let bakeData: SelectOption[] = [];
      const itemAction = (prep: string) => {
        allAction(context, prep);
      };
      const initData = async () => {
        field.preps["values"] = await compDynamicData(field.preps);
        bakeData = JSON.parse(JSON.stringify(field.preps["values"]));
      };

      // let bakeQueryString
      const querySearch = async (_queryString: string, _item: Record<string, any>) => {
        // let temp = field.preps;
        // let dataSource = temp['dataSource'];
        //虽然实现类远程搜索，但是数据没法还原为初始状态
        // if (dataSource == "url") {
        //   console.log(queryString);
        //   if (!queryString) {
        //    field.preps["values"] = JSON.parse(JSON.stringify(bakeData));
        //     return false;
        //   }
        //   if (bakeQueryString == queryString) {
        //     return false;
        //   }
        //   bakeQueryString = queryString;
        //   let searchParams: SearchParams[] = [];
        //   searchParams.push({
        //     propertyName: temp["selectLabel"],
        //     value: queryString,
        //     operation: "lk"
        //   });
        //   temp['values'] = await dynamicUrlOperation(temp, searchParams);
        // } else {
        //temp['values'] = queryString ? temp['values'].filter(createFilter(queryString)) : temp['values'];
        // }
        // return item.initial.toLowerCase().includes(queryString.toLowerCase());
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
        querySearch
      };
    }
  });
</script>
<style scoped></style>
