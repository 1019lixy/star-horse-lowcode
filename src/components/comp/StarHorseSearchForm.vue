<script setup lang="ts" name="StarHorseSearchForm">
import { isJson, searchMatchList } from "@/api/star_horse_utils";
import { SearchParams } from "@/components/types/Params";
import { SearchFields, SelectOption } from "@/components/types/SearchProps";
import { analysisSearchData } from "@/utils/preview";
import { computed, nextTick, onMounted, ref } from "vue";
import { i18n } from "@/lang";
import StarHorseIcon from "@/components/comp/StarHorseIcon.vue";
import Help from "@/components/help.vue";
import { isMobile } from "@/api/device";
import { MOBILE_POPPER_OPTIONS } from "@/components/formcomp/utils/useMobilePicker";
import { getGlobalConfigStore } from "@/store/StoreManager";

let matchTypeList = ref<SelectOption[]>();
const emits = defineEmits(["searchData", "initComplete"]);
const props = withDefaults(
  defineProps<{
    formData: SearchFields;
    defaultCondition?: SearchParams[];
    dialogInput: boolean;
    mutComp: boolean;
  }>(),
  {
    dialogInput: false,
    mutComp: false,
  },
);
let compSize = computed(
  () => getGlobalConfigStore().configFormInfo?.inputSize || "default",
);
let searchForm = ref<any>({});
let showTips = ref<boolean>(true);
let sarchIcon = ref<string>("search_down");
let defaultSearch = ref<boolean>(true);
let tips = ref<string>(i18n("search.moreQuery"));
const createSearchParams = (formData: any) => {
  return analysisSearchData(searchForm.value, formData);
};

const analysisDefaultValue = () => {
  let defaultDatas: any = {};
  props.formData?.fieldList?.forEach((item: any) => {
    if (item?.defaultValue) {
      if (isJson(item.defaultValue)) {
        for (let key in item.defaultValue) {
          defaultDatas[key] = item.defaultValue[key];
        }
      } else {
        defaultDatas[item?.fieldName] = item.defaultValue;
      }
    }
  });
  return defaultDatas;
};

const dataSearch = (val?: any) => {
  if (val === "reset") {
    searchForm.value = { ...analysisDefaultValue() };
  }
  // 移动端：来自字段 change 的事件（val 是数组）不触发查询，
  // 避免选日期/数据确认后误关闭查询弹窗；PC 端保持原行为
  if (isMobile && Array.isArray(val)) {
    return;
  }
  let searchDatas = createSearchParams(props.formData?.fieldList);
  if (props.defaultCondition) {
    searchDatas.push(...props.defaultCondition);
  }
  emits("searchData", searchDatas);
};

const matchTypeChange = (type: string, item: any) => {
  if (!item.preps) {
    item.preps = {};
  }
  item.preps.readonly = ["isnull", "notnull"].includes(type);
  if ("llk" === type) {
    item.preps.prefix = "%";
    delete item.preps.suffix;
  } else if ("rlk" === type) {
    delete item.preps.prefix;
    item.preps.suffix = "%";
  } else if ("lk" === type) {
    item.preps.prefix = "%";
    item.preps.suffix = "%";
  } else if (["ini", "ins", "in"].includes(type)) {
    if (!item.oldType) {
      item.oldType = item.type ?? "input";
    }
    item.type = "textarea";
  } else {
    delete item.preps.prefix;
    delete item.preps.suffix;
    item.type = item.oldType;
  }
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
  setData: (data: any) => {
    if (data) {
      Object.assign(searchForm.value, data);
    }
  },
  createSearchParams,
});
</script>

<template>
  <el-form
    :class="{ search_area: !isMobile }"
    :label-position="isMobile ? 'top' : 'left'"
    :size="compSize"
    v-if="formData?.fieldList"
  >
    <template v-for="item in formData.fieldList" v-if="defaultSearch">
      <el-form-item
        :size="compSize"
        :label="item.label"
        v-if="item.defaultVisible"
        :prop="item.fieldName"
      >
        <template
          v-if="
            (!item.type || item.type == 'input' || item.type == 'textarea') &&
            !item.disabled
          "
          :span="6"
        >
          <el-select
            :size="compSize"
            :style="isMobile ? 'width: 72px !important; height: 100%; padding-top: 2px' : 'width: 90px !important; height: 100%; padding-top: 2px'"
            :teleported="!isMobile"
            :popper-options="isMobile ? MOBILE_POPPER_OPTIONS : undefined"
            v-model="item['matchType']"
            @change="(val) => matchTypeChange(val, item)"
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
      <el-form-item :size="compSize" :label="item.label" :prop="item.fieldName">
        <template
          v-if="(!item.type || item.type == 'input') && !item.disabled"
          :span="6"
        >
          <el-select
            :size="compSize"
            :style="isMobile ? 'width: 72px !important; height: 100%; padding-top: 2px' : 'width: 90px !important; height: 100%; padding-top: 2px'"
            :teleported="!isMobile"
            :popper-options="isMobile ? MOBILE_POPPER_OPTIONS : undefined"
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
    <el-form-item class="search-action-item">
      <div class="search_btn" :class="{ search_app: isMobile }">
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
        <slot name="action-append" />
      </div>
    </el-form-item>
  </el-form>
</template>

<style lang="scss" scoped>
:deep(.el-form-item) {
  width: auto;
  margin-right: 8px !important;
  flex-shrink: 0;
  margin-bottom: 0 !important;
}

.el-form-item,
.el-form-item-small {
  margin-bottom: 0 !important;
}

:deep(.el-form-item__label):last-child {
  max-width: 5px;
}

.search_area {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  flex: 1;
  justify-content: left;
  flex-shrink: 0;
  gap: 12px;
  align-items: center;
  padding: 5px 0;
}

/* 桌面端：操作按钮右对齐，跟随字段流动而非独占整行居中 */
.search_area .search-action-item {
  width: auto !important;
  margin-left: auto;
  margin-right: 0 !important;
  align-items: center;
}

.search_btn {
  margin-left: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  vertical-align: middle;
}

/* 移动端：按钮居中、正常文档流（避免在 dialog 内 position:fixed 错位） */
.search_app {
  width: 100%;
  margin-top: 18px;
  justify-content: center;
}
</style>
