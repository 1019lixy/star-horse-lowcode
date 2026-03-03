<script setup lang="ts" name="StarHorseSearchComp">
import { isJson, searchMatchList } from "@/api/star_horse_utils";
import { ApiUrls } from "@/components/types/ApiUrls";
import { SearchParams } from "@/components/types/Params";
import { SearchFields, SelectOption } from "@/components/types/SearchProps";
import piniaInstance from "@/store";
import { useGlobalConfigStore } from "@/store/GlobalConfig";
import { analysisSearchData } from "@/utils/preview";
import { computed, nextTick, onMounted, PropType, ref } from "vue";
import { i18n } from "@/lang";
import StarHorseIcon from "@/components/comp/StarHorseIcon.vue";
import Help from "@/components/help.vue";

let matchTypeList = ref<SelectOption[]>();
let sarchIcon = ref<string>("search_down");
let defaultSearch = ref<boolean>(true);
let tips = ref<string>(i18n("search.moreQuery"));
let showTips = ref<boolean>(true);
const emits = defineEmits(["searchData"]);
const props = defineProps({
  dialogInput: { type: Boolean, default: false },
  mutComp: { type: Boolean, default: false },
  compUrl: { type: Object as PropType<ApiUrls> },
  formData: { type: Object as PropType<SearchFields>, required: true },
  defaultCondition: { type: Array<SearchParams> },
});
let configStore = useGlobalConfigStore(piniaInstance);
let compSize = computed(
  () => configStore.configFormInfo?.inputSize || "default",
);
let searchForm = ref<any>({});

const createSearchParams = (formData: any) => {
  return analysisSearchData(searchForm.value, formData);
};
/**
 * 解析默认值
 */
const analysisDefaultValue = () => {
  let defaultDatas: any = {};
  props.formData?.fieldList?.forEach((item: any) => {
    if (item.defaultValue) {
      if (isJson(item.defaultValue)) {
        for (let key in item.defaultValue) {
          defaultDatas[key] = item.defaultValue[key];
        }
      } else {
        defaultDatas[item.fieldName] = item.defaultValue;
      }
    }
  });
  return defaultDatas;
};
const dataSearch = (val: string | null) => {
  if (val === "reset") {
    searchForm.value = { ...analysisDefaultValue() };
  }
  let searchDatas = createSearchParams(props.formData?.fieldList);
  //如果一个页面（包括引入的页面）出现多个此组件,不能走消息总线，
  // 默认查询条件，如果设置，在每次的查询中都会带上
  if (props.defaultCondition) {
    searchDatas.push(...props.defaultCondition);
  }
  emits("searchData", searchDatas);
};
const searchArea = () => {
  if (defaultSearch.value) {
    tips.value = i18n("search.moreQuery");
    sarchIcon.value = "search_up";
  } else {
    tips.value = i18n("search.collapse");
    sarchIcon.value = "search_down";
  }
  defaultSearch.value = !defaultSearch.value;
};
/**
 * 设置查询值
 * @param data
 */
const setData = (data: any) => {
  if (data) {
    Object.assign(searchForm.value, data);
  }
};
const init = async () => {
  matchTypeList.value = searchMatchList();
  searchForm.value = { ...analysisDefaultValue() };
  await nextTick();
  //没有隐藏的查询属性，则隐藏掉展开图标
  let fdata = props.formData?.fieldList?.find((item) => !item.defaultVisible);
  if (!fdata && props.formData?.fieldList?.length > 0) {
    showTips.value = false;
  }
};

onMounted(() => {
  init();
});
defineExpose({
  searchForm,
  setData,
  createSearchParams,
});
</script>
<template>
  <div class="search_content">
    <el-form class="search_area" :size="compSize" v-if="formData?.fieldList">
      <template v-for="item in formData.fieldList" v-if="defaultSearch">
        <el-form-item
          :size="compSize"
          :label="item.label"
          v-if="item.defaultVisible"
          :prop="item.fieldName"
        >
          <template
            v-if="(!item.type || item.type == 'input') && !item.disabled"
            :span="6"
          >
            <el-select
              :size="compSize"
              style="width: 90px !important; height: 100%; padding-top: 2px"
              v-model="item['matchType']"
              clearable
              filterable
            >
              <el-option
                v-for="sitem in matchTypeList"
                :value="sitem.value"
                :label="sitem.name"
                :key="sitem.value"
              >
                <div class="flex items-center">
                  <span>{{ sitem.name }}</span>
                  <span style="margin-left: 10px" v-if="sitem?.helpMsg"
                    ><help :message="sitem?.helpMsg"
                  /></span>
                </div>
              </el-option> </el-select
            >&nbsp;&nbsp;
          </template>
          <star-horse-item
            v-model:data-form="searchForm"
            :compSize="compSize"
            :item="item"
            :source="4"
            @dataSearch="dataSearch"
          />
        </el-form-item>
      </template>
      <template v-for="item in formData?.fieldList" v-else>
        <el-form-item
          :size="compSize"
          :label="item.label"
          :prop="item.fieldName"
        >
          <template
            v-if="(!item.type || item.type == 'input') && !item.disabled"
            :span="6"
          >
            <el-select
              :size="compSize"
              style="width: 90px !important; height: 100%; padding-top: 2px"
              v-model="item['matchType']"
              clearable
              filterable
            >
              <el-option
                v-for="sitem in matchTypeList"
                :value="sitem.value"
                :label="sitem.name"
                :key="sitem.value"
              /> </el-select
            >&nbsp;&nbsp;
          </template>
          <star-horse-item
            v-model:data-form="searchForm"
            :compSize="compSize"
            :item="item"
            :source="4"
            @dataSearch="dataSearch"
          >
          </star-horse-item>
        </el-form-item>
      </template>
      <el-form-item style="vertical-align: middle; align-items: center">
        <div class="search_btn">
          <el-button
            @click="dataSearch"
            style="
              background: var(--star-horse-style);
              color: var(--star-horse-white);
            "
            :size="compSize"
          >
            <star-horse-icon
              icon-class="search"
              size="16px"
              color="var(--star-horse-white)"
            />
            {{ i18n("search.query") }}
          </el-button>
          <el-button @click="dataSearch('reset')" link :size="compSize">
            <star-horse-icon
              icon-class="reset"
              size="16px"
              color="var(--star-horse-disable)"
            />
            {{ i18n("search.reset") }}
          </el-button>
          <el-tooltip :content="tips" v-if="showTips">
            <el-button text @click="searchArea" :size="compSize">
              <star-horse-icon
                :icon-class="sarchIcon"
                size="20px"
                color="var(--star-horse-style)"
              />
            </el-button>
          </el-tooltip>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<style lang="scss" scoped>
:deep(.el-form-item) {
  width: auto; // 强制设置为自动宽度
  margin-right: 8px !important; // 添加右侧间距
  flex-shrink: 0; // 防止收缩
  margin-bottom: 0 !important;
}

.el-form-item,
.el-form-item-small {
  margin-bottom: 0 !important;
}

:deep(.el-form-item__label):last-child {
  max-width: 5px;
}

.search_content {
  display: flex;
  flex-direction: column;
  flex: 1;

  .search_area {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    flex: 1;
    justify-content: left;
    flex-shrink: 0;
    gap: 12px; // 新增间隔控制
    align-items: center; // 新增垂直对齐方式
    padding: 5px 0;
  }

  .search_btn {
    margin-left: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
  }
}
</style>
