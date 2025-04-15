<script lang="ts">
import {defineComponent, onMounted, ref, shallowRef, watch} from "vue";
import {PageProps} from "@/components/types/PageProps";
import {closeLoad, createCondition, load} from "@/api/star_horse_utils.ts";
import {postRequest} from "@/api/star_horse_apis.ts";
import {FieldMapping, OrderByInfo} from "@/components/types/PageFieldInfo";
import {SearchParams} from "@/components/types/Params";
import {allAction} from "@/components/formcomp/utils/ItemRelationEventUtils.ts";
import StarHorseTableComp from "@/components/comp/StarHorseTableComp.vue";

export default defineComponent({
  components: {StarHorseTableComp},
  setup(_props, context) {
    const parentField = context.attrs["parentField"];
    // let formData = context.attrs["formData"] as any;
    const field = context.attrs["field"] as any;
    const starHorseTableCompRef = ref();
    const filterCondtion = field.preps["filterCondition"] as Array<SearchParams>;
    const orderBy = field.preps["orderBy"] as Array<OrderByInfo>;
    let formItem = shallowRef({label: "input", required: false});
    let dataField = shallowRef("");
    let multipleSelection = shallowRef<Array<any>>([]);
    let actionName = shallowRef("normal");
    let pageInfo = ref<PageProps>({
      pageSize: 20,
      currentPage: 1,
      totalData: 0,
      totalPage: 0,
      dataList: []
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
      if (filterCondtion) {
        searchData.value.push(...filterCondtion);
      }
      if (isInit) {
        let fieldName = loadSourceField();
        let value = context.attrs["formData"][field.preps["aliasName"] || field.preps["name"]];
        if (fieldName && value) {
          if ("Y" == field.preps["multiple"]) {
            searchData.value.push(createCondition(fieldName, Array.isArray(value) ? value : value.split(";"), "in"));
          } else {
            searchData.value.push(createCondition(fieldName, value));
          }
        }
      }
      let orderByTemp = [] as Array<OrderByInfo>;
      if (orderBy) {
        orderByTemp = orderBy;
      }
      if (!field.preps["dataUrl"]?.pageListUrl) {
        return;
      }
      let params: any = {
        currentPage: pageInfo.value.currentPage,
        pageSize: pageInfo.value.pageSize,
        fieldList: searchData.value,
        orderBy: orderByTemp
      };
      let url: string = field.preps.dataUrl?.pageListUrl;
      if (field.preps.dataUrl.redirect) {
        params = {
          url,
          host: field.preps.dataUrl?.host,
          port: field.preps.dataUrl?.port,
          protocol: field.preps.dataUrl?.protocol,
          env: field.preps.dataUrl?.env,
          httpMethod: field.preps.dataUrl?.httpMethod || "POST",
          dataType: field.preps.dataUrl?.dataType || "JSON",
          searchInfo: params
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
            //   context.attrs['formData'][field.preps["name"]] = redata.dataList?.map((item: any) => item[name]);
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
      allAction(context, prep);
    };
    const searchDataFun = (data: any) => {
      searchData.value = data;
      loadByPage();
    };
    const getRowIdentity = (row: any) => {
      return row[field.preps.primaryKey];
    };
    const handleSelectionChange = (val: any) => {
      multipleSelection.value = val;
      assignVal();
    };
    const selectRow = (row: any, _column: any, _evt: any) => {
      const selected = multipleSelection.value.some(
          (item: any) => item[field.preps.primaryKey] === row[field.preps.primaryKey]
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
      let fields: any = field.preps["needField"];
      let name = aliasFirst ? field.preps["aliasName"] || field.preps["name"] : field.preps["name"];
      return fields?.find((temp: FieldMapping) => temp.distField == name)?.sourceField || "";
    };
    const assignVal = () => {
      let fields: any = field.preps["needField"];
      let name = field.preps["name"];
      if (fields) {
        fields.forEach((temp: FieldMapping) => {
          let value = multipleSelection.value.map((item: any) => item[temp.sourceField]);
          if (!field.preps["multiple"] || field.preps["multiple"] == "N") {
            value = value[0];
          }
          if (fields.length == 1) {
            context.attrs["formData"][name] = value;
          } else {
            context.attrs["formData"][temp.distField] = value;
          }
        });
      } else {
        context.attrs["formData"][name] = multipleSelection.value.map((item) => item[name]);
      }
      if (field.preps["recall"]) {
        field.preps["recall"](multipleSelection.value);
      }
    };
    watch(
        () => field.preps["dataUrl"],
        () => {
          loadByPage();
        }
    );
    onMounted(() => {
      actionName.value = field.preps?.actionName || "normal";
      loadByPage(true);
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
      pageInfo,
      pageSizeClick,
      pageChangeClick,
      getRowIdentity,
      searchDataFun,
      handleSelectionChange,
      starHorseTableCompRef,
      selectRow
    };
  }
});
</script>
<template>
  <starhorse-form-item
      :isDesign="context.attrs['isDesign']"
      :bareFlag="context.attrs['bareFlag']"
      :formItem="field"
      :parentField="parentField"
  >
    <el-select
        :fid="field.preps['name']"
        :readonly="field.preps['readonly'] == 'Y'"
        :automatic-dropdown="field.preps['automaticDropdown'] == 'Y'"
        :clearable="true"
        :collapse-tags="true"
        :collapse-tags-tooltip="true"
        :default-first-option="field.preps['defaultFirstOption'] == 'Y'"
        :disabled="!context.attrs['formData']['_' + field.preps['name'] + 'Editable'] && field.preps['disabled'] == 'Y'"
        :filterable="true"
        :multiple="field.preps['multiple'] == 'Y'"
        :multiple-limit="field.preps['multipleLimit']"
        :placeholder="field.preps['placeholder'] || '请选择' + field.preps['label']"
        :size="context.attrs.formInfo?.size || field?.preps['size'] || 'default'"
        :tag-type="field.preps['tagType']"
        @change="itemAction('change')"
        @input="itemAction('input')"
        @keydown.enter="itemAction('enter')"
        @focus="itemAction('focus')"
        @blur="itemAction('blur')"
        v-model="context.attrs['formData'][field.preps['name']]"
    >
      <template #empty>
        <el-card class="inner_content" style="margin: 5px">
          <!--          <div class="search_btn" :style="{'flex-direction':Config.buttonStyle.value=='line'?'column':'row'}">-->
          <star-horse-search-comp
              :formData="field.preps['searchFieldList']"
              @searchData="(data: any) => searchDataFun(data)"
              :mutComp="true"
              :compUrl="field.preps['dataUrl']"
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
              'background-image': '-webkit-gradient(linear,left 0,left 100%,from(#f8f8f8),to(#ececec))'
            }"
              :cell-style="{ 'font-size': '12px' }"
              border
          >
            <el-table-column type="selection" align="center" fixed="left" :reserve-selection="true"/>
            <template v-for="item in field.preps?.fieldList?.fieldList">
              <template v-if="Array.isArray(item)">
                <star-horse-table-column
                    v-for="sitem in item"
                    :compUrl="field.preps['dataUrl']"
                    :cellEditable="false"
                    :data-format="field.preps['dataFormat']"
                    :item="sitem"
                />
              </template>
              <star-horse-table-column
                  v-else
                  :compUrl="field.preps['dataUrl']"
                  :cellEditable="false"
                  :data-format="field.preps['dataFormat']"
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
