<script setup lang="ts">
import { onMounted, ref, shallowRef, watch, PropType, nextTick } from "vue";
import { PageProps } from "@/components/types/PageProps";
import { closeLoad, createCondition, load } from "@/api/star_horse_utils";
import { postRequest } from "@/api/star_horse_apis";
import {
  FieldInfo,
  FieldMapping,
  OrderByInfo,
} from "@/components/types/PageFieldInfo";
import { SearchParams } from "@/components/types/Params";
import {
  allAction,
  checkIsDisabled,
} from "@/components/formcomp/utils/ItemRelationEventUtils";
import { compKey, getDynamicEvents } from "@/api/system";
import { warning } from "@/utils/message";
import { SearchFields } from "@/components/types";

const props = defineProps({
  isDesign: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  showFormItem: {
    type: Boolean,
    default: false,
  },
  bareFlag: {
    type: Boolean,
    default: false,
  },
  isSearch: {
    type: Boolean,
    default: false,
  },
  field: {
    type: Object as PropType<any>,
    required: true,
  },
  parentField: {
    type: Object as PropType<any>,
  },
  formInfo: {
    type: Object as PropType<any>,
  },
});
const emits = defineEmits(["selfFunc", "selectItem"]);
const formData = defineModel("formData");

// let formData = context.attrs["formData"] as any;

const starHorseTableCompRef = ref();
const filterCondition = ref<Array<SearchParams>>([]);

const orderBy = ref<Array<OrderByInfo>>([]);

let multipleSelection = shallowRef<Array<any>>([]);
let actionName = shallowRef("normal");
let pageInfo = ref<PageProps>({
  pageSize: 20,
  currentPage: 1,
  totalData: 0,
  totalPage: 0,
  dataList: [],
});

let searchData = shallowRef<Array<SearchParams>>([]);
const pageSizeClick = (pageSize: number) => {
  pageInfo.value.pageSize = pageSize;
  loadByPage();
};
const pageChangeClick = (currentPage: number) => {
  pageInfo.value.currentPage = currentPage;
  loadByPage();
};

const loadByPage = (isInit: boolean = false) => {
  if (filterCondition.value?.length > 0) {
    searchData.value.push(...filterCondition.value);
  }
  if (isInit) {
    let fieldName = loadSourceField();
    let value: any =
      formData.value[props.field.aliasName || props.field.fieldName];
    if (fieldName && value) {
      if (props.field.preps?.multiple) {
        searchData.value.push(
          createCondition(
            fieldName,
            Array.isArray(value) ? value : value.split(";"),
            "in",
          ),
        );
      } else {
        searchData.value.push(createCondition(fieldName, value));
      }
    }
  }
  let orderByTemp = [] as Array<OrderByInfo>;
  if (orderBy.value?.length > 0) {
    orderByTemp = orderBy.value;
  }
  if (!props.field.preps?.["dataUrl"]?.pageListUrl) {
    return;
  }
  let params: any = {
    currentPage: pageInfo.value.currentPage,
    pageSize: pageInfo.value.pageSize,
    fieldList: searchData.value,
    orderBy: orderByTemp,
  };
  let url: string = props.field.preps?.dataUrl?.pageListUrl;
  if (props.field.preps?.dataUrl.redirect) {
    params = {
      url,
      host: props.field.preps?.dataUrl?.host,
      port: props.field.preps?.dataUrl?.port,
      protocol: props.field.preps?.dataUrl?.protocol,
      env: props.field.preps?.dataUrl?.env,
      httpMethod: props.field.preps?.dataUrl?.httpMethod || "POST",
      dataType: props.field.preps?.dataUrl?.dataType || "JSON",
      searchInfo: params,
    };
    url = "/system-config/redirect/pageList";
  }
  load("数据加载中");
  postRequest(url, params)
    .then((res) => {
      let redata = res.data?.data;
      pageInfo.value.dataList = redata?.dataList;
      pageInfo.value.totalPage = redata?.totalPages;
      pageInfo.value.totalData = redata?.totalDatas;
      // if (isInit) {
      //   let name = loadSourceField(false);
      //   formData[field.preps["name"]] = redata.dataList?.map((item: any) => item[name]);
      // }
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      closeLoad();
    });
};
const itemAction = (prep: any) => {
  allAction(props, emits, formData, prep);
};
const searchDataFun = (data: any) => {
  searchData.value = data;
  loadByPage();
};
const getRowIdentity = (row: any) => {
  return row[props.field.preps?.primaryKey];
};
const handleSelectionChange = (val: any) => {
  multipleSelection.value = val;
  assignVal();
};
const selectRow = (row: any, _column: any, _evt: any) => {
  const selected = multipleSelection.value.some(
    (item: any) =>
      item[props.field.preps?.primaryKey] ===
      row[props.field.preps?.primaryKey],
  );
  if (!selected) {
    multipleSelection.value.push(row);
    starHorseTableCompRef.value.toggleRowSelection(row);
  } else {
    starHorseTableCompRef.value.toggleRowSelection(row, false);
  }
  assignVal();
};
const loadSourceField = (aliasFirst: boolean = true) => {
  let fields: any = props.field.preps?.["needField"];
  let name = aliasFirst
    ? props.field.preps?.["aliasName"] || props.field.fieldName
    : props.field.fieldName;
  return (
    fields?.find((temp: FieldMapping) => temp.distField == name)?.sourceField ||
    ""
  );
};
const assignVal = () => {
  let fields: any = props.field.preps?.["needField"];
  let name = props.field.fieldName;
  if (fields) {
    fields.forEach((temp: FieldMapping) => {
      let value = multipleSelection.value.map(
        (item: any) => item[temp.sourceField],
      );
      if (!props.field.preps?.multiple) {
        value = value[0];
      }
      if (fields.length == 1) {
        formData.value[name] = value;
      } else {
        formData.value[temp.distField] = value;
      }
    });
  } else {
    formData.value[name] = multipleSelection.value.map((item) => item[name]);
  }
  if (props.field.preps?.["recall"]) {
    props.field.preps?.["recall"](multipleSelection.value);
  }
};
watch(
  () => props.field.preps?.["dataUrl"],
  () => {
    loadByPage();
  },
);
onMounted(async () => {
  await nextTick();
  let inputPreps = props.field?.preps;
  if (!inputPreps) {
    warning("属性" + props.field?.label + "需要配置params 信息");
    return;
  }
  if (inputPreps.searchFieldList?.length === 0) {
    let searchFieldList: Array<SearchFields> = [];
    inputPreps.fieldList?.forEach((item: FieldInfo) => {
      if (item.searchVisible) {
        let temp: any = {
          ...item,
        };
        if (item.prefix) {
          temp["fieldName"] = item.prefix + "." + temp["fieldName"];
        }
        temp["defaultVisible"] = true;
        if (item?.type == "input" && !item["matchType"]) {
          temp["matchType"] = "lk";
        }
        searchFieldList.push(temp);
      }
    });
    inputPreps.searchFieldList = { fieldList: searchFieldList };
  }
  actionName.value = props.field.actionName || "normal";
  loadByPage(true);
  if (!props.isSearch) {
    allAction(props, emits, formData, actionName.value, true);
  }
});
</script>
<template>
  <starhorse-form-item
    :showFormItem="showFormItem"
    :isDesign="isDesign"
    :disabled="disabled"
    :bareFlag="bareFlag"
    :formItem="field"
    :parentField="parentField"
  >
    <el-select
      :fid="field.fieldName"
      v-bind="field.preps"
      :disabled="checkIsDisabled(props)"
      v-on="getDynamicEvents(props, itemAction)"
      v-model="formData[field.fieldName]"
    >
      <template #empty>
        <el-card class="inner_content" style="margin: 5px">
          <star-horse-search-comp
            :formData="field.preps?.['searchFieldList']"
            @searchData="(data: any) => searchDataFun(data)"
            :mutComp="true"
            :compUrl="field.preps?.['dataUrl']"
          />
          <el-table
            ref="starHorseTableCompRef"
            :data="pageInfo.dataList"
            @selection-change="handleSelectionChange"
            @row-click="selectRow"
            :stripe="true"
            :row-key="getRowIdentity"
            :fit="true"
            max-height="250px"
            :highlight-current-row="true"
            :header-cell-style="{
              background: '#f2f2f2',
              color: '#707070',
              'font-size': '13px',
              'background-image':
                '-webkit-gradient(linear,left 0,left 100%,from(#f8f8f8),to(#ececec))',
            }"
            :cell-style="{ 'font-size': '12px' }"
            border
          >
            <el-table-column
              type="selection"
              align="center"
              fixed="left"
              :reserve-selection="true"
            />
            <template
              v-for="(item, key) in field.preps?.fieldList"
              :key="compKey(item, key)"
            >
              <template v-if="Array.isArray(item)">
                <star-horse-table-column
                  v-for="(sitem, skey) in item"
                  :key="compKey(sitem, skey)"
                  :compUrl="field.preps?.['dataUrl']"
                  :cellEditable="false"
                  :data-format="field.preps?.['dataFormat']"
                  :item="sitem"
                />
              </template>
              <star-horse-table-column
                v-else
                :compUrl="field.preps?.['dataUrl']"
                :cellEditable="false"
                :data-format="field.preps?.['dataFormat']"
                :item="item"
              />
            </template>
          </el-table>
        </el-card>
      </template>
      <template #footer>
        <el-pagination
          :size="'default'"
          :total="pageInfo.totalData"
          @current-change="pageChangeClick"
          @size-change="pageSizeClick"
          layout="total, sizes, prev, pager, next, jumper"
          v-model:currentPage="pageInfo.currentPage"
          v-model:page-size="pageInfo.pageSize"
          v-model:pageCount="pageInfo.totalPage"
        />
      </template>
    </el-select>
  </starhorse-form-item>
</template>
<style lang="scss" scoped>
:deep(.el-table__cell) {
  padding: 0;
}

:deep(th.el-table__cell:first-child) {
  padding: 5px 0;
}
</style>
