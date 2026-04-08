<script setup lang="ts">
import {useDesignFormStore} from "@/store/DesignForm";
import piniaInstance from "@/store";
import {computed, ComputedRef, ref} from "vue";
import {i18n} from "@/lang";

defineOptions({
  name: "FieldList",
});
const containerRef = ref();
const emits = defineEmits(["selectData"]);
let designForm = useDesignFormStore(piniaInstance);
let formDataList: ComputedRef = computed(() => designForm.formDataList);
let containerList: ComputedRef = computed(() => designForm.containerList);
let selfFormDataList: ComputedRef = computed(() => designForm.selfFormDataList);
const searchQuery = ref("");
const filteredContainerList = computed(() => {
  if (!searchQuery.value) {
    return containerList.value;
  }
  return containerList.value.filter((item: any) =>
    item.itemName.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});
const filteredFormDataList = computed(() => {
  if (!searchQuery.value) {
    return formDataList.value;
  }
  return formDataList.value.filter((item: any) =>
    item.itemName.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});
const filteredSelfFormDataList = computed(() => {
  if (!searchQuery.value) {
    return selfFormDataList.value;
  }
  return selfFormDataList.value.filter((item: any) =>
    item.itemName.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});
const selectData = (item: any) => {
  emits("selectData", item);
};
</script>

<template>
  <div class="component-list">
    <div class="title">
      <el-anchor type="underline" :container="containerRef" :offset="70">
        <el-anchor-link :href="`#container`">
          {{ i18n("form.container") }}
        </el-anchor-link
        >
        <el-anchor-link :href="`#basic`">
          {{ i18n("form.basicComponents") }}
        </el-anchor-link
        >
        <el-anchor-link :href="`#self`">
          {{ i18n("form.customComponents") }}
        </el-anchor-link
        >
      </el-anchor>
    </div>
    <div class="flex flex-col h-full w-full" ref="containerRef">
      <div style=" height: 30px">
        <el-input
            v-model="searchQuery"
            :placeholder="i18n('form.searchPlaceholder')"
            size="small"
            clearable
        />
      </div>
      <div class="flex-1 overflow-hidden">
        <el-scrollbar>
          <el-divider content-position="left">{{
              i18n("form.container")
            }}
          </el-divider>
          <ul id="container" class="my-2 min-h-[10px]">
            <template v-for="item in filteredContainerList">
              <li class="field-item" @click="selectData(item)">
                &nbsp;&nbsp;
                <div class="flex items-center">
                  <star-horse-icon :icon-class="item.itemIcon"/> &nbsp;{{
                    item.itemName
                  }}
                </div>
              </li>
            </template>
          </ul>
          <el-divider content-position="left">{{
              i18n("form.basicComponents")
            }}
          </el-divider>
          <ul id="basic"  class="my-2 min-h-[10px]">
            <template v-for="item in filteredFormDataList">
              <li class="field-item" @click="selectData(item)">
                &nbsp;&nbsp;
                <div class="flex items-center">
                  <star-horse-icon :icon-class="item.itemIcon"/> &nbsp;{{
                    item.itemName
                  }}
                </div>
              </li>
            </template>
          </ul>
          <el-divider content-position="left">{{
              i18n("form.customComponents")
            }}
          </el-divider>
          <ul id="self"  class="my-2 min-h-[10px]">
            <template v-for="item in filteredSelfFormDataList">
              <li class="field-item" @click="selectData(item)">
                &nbsp;&nbsp;
                <div class="flex items-center">
                  <star-horse-icon :icon-class="item.itemIcon"/> &nbsp;{{
                    item.itemName
                  }}
                </div>
              </li>
            </template>
          </ul>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-divider) {
  margin: 15px auto;
}

.component-list {
  display: flex;
  flex-direction: row;
  height: inherit;
  width: 100%;
  overflow: hidden;

  .title {
    width: 100px;
    overflow: hidden;
  }

  .content {
    margin-left: 10px;
    height: 100%;
    overflow: hidden;
    flex: 1;

    ul {
      list-style: none;
      margin-top: 5px !important;
      padding-top: 0 !important;

      li {
        cursor: pointer;
        display: block;
        height: 30px;
        padding: 0 !important;
        margin: 0;

        &:hover {
          background-color: #f5f7fa;
        }

        div {
          display: inline-flex;
          height: 100%;
          align-items: center;
          margin-top: 0 !important;
          padding-top: 0 !important;
        }
      }
    }
  }
}
</style>
