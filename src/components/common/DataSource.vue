<script setup lang="ts">
import {onMounted, ref, toRef} from "vue";
import {SelectOption} from "@/components/types/SearchProps";
import {searchMatchList} from "@/api/star_horse_utils.ts";
import {loadDict} from "@/api/star_horse_apis.ts";
import {createData, dataSourceFields, validInterface} from "@/utils/ItemPreps.ts";
import {warning} from "@/utils/message.ts";

defineOptions({
  name: "DataSource"
})
const props = defineProps({
  recall: {
    type: Function,
    default: () => {
    }
  },
  formProps: {
    type: Object,
    default: () => {

    }
  }
})
const dataSourceFormRef = ref();
let envList = ref<Array<SelectOption>>([]);
const getFormData = async (extandErrorMsg?: string) => {
  let reData = toRef(props.formProps ?? {});
  let flag = true;
  await validInterface(reData, dataSourceFormRef, (dataList: any, _successMsg: string, errorMsg: string) => {
    if (!errorMsg) {
      //只保存静态数据,
      reData["values"] = createData(dataSourceFormRef, dataList).reDataList;
    } else {
      flag = false;
      warning(extandErrorMsg ?? errorMsg);
    }
  });
  if (flag)
    return reData;
  return false;
}
const setFormData = (data: any) => {
  dataSourceFormRef.value?.setFormData(data);
}
onMounted(async () => {
  matchTypeList.value = searchMatchList();
  envList.value = await loadDict("system_environment");
});
defineExpose({
  getFormData,
  setFormData
})
</script>

<template>
  <star-horse-form
      :outerFormData="formProps"
      primary-key=""
      ref="dataSourceFormRef"
      :fieldList="dataSourceFields(dataSourceFormRef, envList, recall)"
  />
</template>

<style scoped lang="scss">

</style>
