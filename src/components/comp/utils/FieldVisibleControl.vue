<script setup lang="ts">
import { i18n } from "@/lang";
import { isMobile } from "@/api/device";
import { Sort, Tools } from "@element-plus/icons-vue";
import StarHorseIcon from "../StarHorseIcon.vue";
import { FieldInfo } from "@/components/types";
import { ref } from "vue";
import ShMobilePicker from "@/components/formcomp/utils/ShMobilePicker.vue";
import { useMobilePicker } from "@/components/formcomp/utils/useMobilePicker";

withDefaults(
  defineProps<{
    fields: FieldInfo[];
    compSize?: string;
  }>(),
  {
    compSize: "default",
  },
);
// const emits = defineEmits<{
//   (e: "update:modelValue", dataList: Array<any>): void;
// }>();
let fieldVisible = ref<boolean>(false);
// 字段配置表（.sh-columns）的 ref，替代 document.querySelector 全局查询
const shColumnsTableRef = ref<any>(null);
// APP 端列显隐抽屉
const {
  pickerVisible: columnPickerVisible,
  placement: columnPlacement,
  size: columnSize,
  openPicker: openColumnPicker,
} = useMobilePicker(() => ({ preps: {} }) as any);
</script>

<template>
  <el-popover
    v-if="!isMobile"
    trigger="click"
    :popper-style="{ width: 'unset !important' }"
    placement="left-end"
  >
    <template #reference>
      <star-horse-icon
        @click="fieldVisible = !fieldVisible"
        :title="i18n('comp.showHideColumns')"
        icon-class="setting"
        style="color: var(--star-horse-style); cursor: pointer"
      />
    </template>
    <el-table
      class="sh-columns"
      ref="shColumnsTableRef"
      :data="fields"
      :strip="true"
      :fit="true"
      :highlight-current-row="true"
      max-height="400px"
      row-key="prop"
      style="width: 100%"
      :size="compSize"
      :border="true"
    >
      <el-table-column prop="" :label="i18n('comp.sort')" width="60">
        <el-tag class="move" style="cursor: move" :size="compSize">
          <el-icon style="cursor: move">
            <Sort />
          </el-icon>
        </el-tag>
      </el-table-column>
      <el-table-column
        prop="label"
        :label="i18n('comp.columnName')"
        :show-overflow-tooltip="true"
      >
        <template #default="scope">
          <el-tag round :effect="scope.row.listVisible ? 'dark' : 'light'">
            {{ scope.row.label }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="listVisible"
        :label="i18n('comp.showHide')"
        width="100"
      >
        <template #default="scope">
          <el-switch
            v-model="scope.row.listVisible"
            :size="compSize"
            :active-value="true"
            :inactive-value="false"
          />
        </template>
      </el-table-column>
    </el-table>
  </el-popover>
  <!-- APP 端：触发器 + 抽屉 -->
  <el-icon
    v-else
    class="star-page-icon"
    style="cursor: pointer"
    @click="openColumnPicker"
  >
    <Tools />
  </el-icon>
  <ShMobilePicker
    v-if="isMobile && columnPickerVisible"
    v-model="columnPickerVisible"
    :title="i18n('comp.showHideColumns')"
    :placement="columnPlacement"
    :size="columnSize"
    :show-footer="false"
  >
    <el-table
      class="sh-columns"
      ref="shColumnsTableRef"
      :data="fields"
      :strip="true"
      :fit="true"
      :highlight-current-row="true"
      max-height="100%"
      row-key="prop"
      style="width: 100%"
      :size="compSize"
      :border="true"
    >
      <el-table-column prop="" :label="i18n('comp.sort')" width="60">
        <el-tag class="move" style="cursor: move" :size="compSize">
          <el-icon style="cursor: move">
            <Sort />
          </el-icon>
        </el-tag>
      </el-table-column>
      <el-table-column
        prop="label"
        :label="i18n('comp.columnName')"
        :show-overflow-tooltip="true"
      >
        <template #default="scope">
          <el-tag round :effect="scope.row.listVisible ? 'dark' : 'light'">
            {{ scope.row.label }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="listVisible"
        :label="i18n('comp.showHide')"
        width="100"
      >
        <template #default="scope">
          <el-switch
            v-model="scope.row.listVisible"
            :size="compSize"
            :active-value="true"
            :inactive-value="false"
          />
        </template>
      </el-table-column>
    </el-table>
  </ShMobilePicker>
</template>

<style scoped lang="scss"></style>
