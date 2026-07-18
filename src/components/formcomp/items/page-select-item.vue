<script setup lang="ts">
import { nextTick, onMounted, ref, shallowRef, watch } from "vue";
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
  initCompCallEvent,
  prepsFilter,
} from "@/components/formcomp/utils/ItemRelationEventUtils";
import { compKey, getDynamicEvents } from "@/api/system";
import { warning } from "@/utils/message";
import { SearchFields } from "@/components/types";

import { ItemPreps } from "@/components/types/ItemPreps";
import { i18n } from "@/lang";

const props = withDefaults(defineProps<ItemPreps>(), {
  isDesign: false,
  disabled: false,
  showFormItem: false,
  bareFlag: false,
  isSearch: false,
});
const emits = defineEmits(["selfFunc", "selectItem"]);
const formData = defineModel("formData");
const starHorseTableCompRef = ref();
const filterCondition = ref<Array<SearchParams>>([]);

const orderBy = ref<Array<OrderByInfo>>([]);

let multipleSelection = shallowRef<Array<any>>([]);
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
    url =
      props.field.preps?.dataUrl?.redirectPageListUrl ??
      "/system-config/redirect/pageList";
  }
  load(i18n("item.dataLoading"));
  postRequest(url, params)
    .then((res) => {
      let redata = res.data?.data;
      pageInfo.value.dataList = redata?.dataList;
      pageInfo.value.totalPage = redata?.totalPages;
      pageInfo.value.totalData = redata?.totalDatas;
      // 回显已选数据：初始化加载时根据 formData 中的值勾选匹配行
      if (isInit) {
        nextTick(() => {
          echoSelection();
        });
      }
    })
    .catch((err) => {
      console.error(err);
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
  //multipleSelection.value = val;
  if (!props.field.preps?.multiple) {
    if (val.length <= 1) {
      multipleSelection.value = val;
    } else {
      let keys: any = props.field.preps?.primaryKey;
      if (Array.isArray(keys)) {
        let arr: any = [];
        for (let index in multipleSelection.value) {
          let temp = multipleSelection.value[index];
          let temp1: any = {};
          for (let key of keys) {
            temp1[key] = temp[key];
          }
          arr.push(temp1);
        }
        let filters: Array<any> = [];
        for (let index in val) {
          let temp = val[index];
          for (let sindex in arr) {
            let stemp = arr[sindex];
            let bflag: number = 0;
            for (let skey in stemp) {
              if (temp.hasOwnProperty(skey) && stemp[skey] == temp[skey]) {
                bflag++;
              }
            }
            //如果不相等说明没有相同数据了
            if (bflag != Object.keys(stemp).length) {
              filters.push(temp);
            }
          }
        }
        multipleSelection.value = filters;
      } else {
        let ids = multipleSelection.value.map(
          (item: any) => item[keys],
        ) as Array<any>;
        multipleSelection.value = val.filter(
          (item: any) => !ids.includes(item[keys]),
        );
      }
      let data = multipleSelection.value[0];
      starHorseTableCompRef.value.toggleRowSelection(data, true);
    }
  } else {
    multipleSelection.value = val;
  }
  assignVal();
};
const selectRow = (row: any, _column: any, _evt: any) => {
  if (multipleSelection.value?.length > 0) {
    for (let valueElement of multipleSelection.value) {
      starHorseTableCompRef.value.toggleRowSelection(valueElement);
    }
  }
  const selected = multipleSelection.value.some(
    (item: any) =>
      item[props.field.preps?.primaryKey] ===
      row[props.field.preps?.primaryKey],
  );
  if (!selected) {
    // 单选模式下替换选中项
    if (!props.field.preps?.multiple) {
      multipleSelection.value = [row];
    } else {
      multipleSelection.value.push(row);
    }
    starHorseTableCompRef.value.toggleRowSelection(row);
  } else {
    multipleSelection.value = multipleSelection.value.filter(
      (item: any) =>
        item[props.field.preps?.primaryKey] !==
        row[props.field.preps?.primaryKey],
    );
    starHorseTableCompRef.value.toggleRowSelection(row, false);
  }

  //如果是弹出选择，没有指定多选 只能选择一条数据

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
/**
 * 回显已选数据：根据 formData 中已存的值，在当前数据列表中勾选匹配行
 */
const echoSelection = () => {
  let realName = props.field.aliasName || props.field.fieldName;
  let value: any = formData.value[realName];
  if (!value) return;
  let sourceField = loadSourceField();
  if (!sourceField) {
    sourceField = realName;
  }
  const values = Array.isArray(value) ? value : [value];
  for (const row of pageInfo.value.dataList) {
    if (values.includes(row[sourceField])) {
      starHorseTableCompRef.value?.toggleRowSelection(row, true);
    }
  }
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
    warning(i18n("item.propertyNeedsParams") + props.field?.label);
    return;
  }
  if (!inputPreps.searchFieldList || inputPreps.searchFieldList?.length == 0) {
    let searchFieldList: Array<SearchFields> = [];
    inputPreps.fieldList?.forEach((item: FieldInfo) => {
      if (item.searchVisible) {
        let temp: any = { ...item };
        if (item.prefix) {
          temp["fieldName"] = item.prefix + "." + temp["fieldName"];
        }
        temp["defaultVisible"] = true;
        if ((!item?.type || item?.type == "input") && !item["matchType"]) {
          temp["matchType"] = "lk";
        }
        searchFieldList.push(temp);
      }
    });
    inputPreps.searchFieldList = { fieldList: searchFieldList };
  }
  loadByPage(true);
  nextTick(() => {
    initCompCallEvent(props, emits, formData);
  });
});
</script>
<template>
  <starhorse-form-item
    :showFormItem="showFormItem"
    :isDesign="isDesign"
    :disabled="disabled"
    :bareFlag="bareFlag"
    :field="field"
    :parentField="parentField"
  >
    <el-select
      :fid="field.fieldName"
      v-bind="prepsFilter(field.preps)"
      :disabled="checkIsDisabled(props)"
      v-on="getDynamicEvents(props, itemAction, formData)"
      v-model="formData[field.fieldName]"
    >
      <!-- 新增显示选中项标签 -->
      <template
        v-if="!field.preps?.multiple && field.preps?.displayField"
        #label
      >
        {{
          multipleSelection[0]?.[`${field.preps?.displayField}`] ??
          formData[field.fieldName]
        }}
      </template>
      <template v-if="field.preps?.multiple && field.preps?.displayField" #tag>
        <span
          v-for="item in multipleSelection"
          :key="item[field.preps?.primaryKey]"
        >
          {{ item[field.preps?.displayField] }}
        </span>
      </template>
      <template #empty>
        <div class="flex flex-col h-full overflow-hidden">
          <div class="search-content">
            <div class="search_btn">
              <star-horse-search-comp
                :formData="field.preps?.['searchFieldList']"
                @searchData="(data: any) => searchDataFun(data)"
                :mutComp="true"
                :compUrl="field.preps?.['dataUrl']"
              />
            </div>
          </div>
          <el-card class="inner_content" style="margin: 5px">
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
        </div>
      </template>
      <template #footer>
        <el-pagination

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
