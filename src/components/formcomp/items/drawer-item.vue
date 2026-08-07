<script setup lang="ts">
import {computed, nextTick, onMounted, shallowRef, watch} from "vue";
import {
  allAction,
  checkIsDisabled,
  convertData,
  prepsFilter,
} from "@/components/formcomp/utils/ItemRelationEventUtils";

import {ItemPreps} from "@/components/types/ItemPreps";
import {StarHorseFormItem, StarHorseIcon} from "@/components/comp";
import StarhorseFormItem from "@/components/formcomp/items/starhorse-form-item.vue";
import {i18n} from "@/lang";

const props = withDefaults(defineProps<ItemPreps>(), {
  isDesign: false,
  disabled: false,
  showFormItem: false,
  bareFlag: false,
  isSearch: false,
});
const emits = defineEmits(["selfFunc", "selectItem"]);
const formData = defineModel("formData");
const compSize = computed(() => props.field.preps?.compSize ?? "default");
let dialogInputVisible = shallowRef(false);
const drawerData = shallowRef({});
const itemAction = (prep: any) => {
  allAction(props, emits, formData, prep);
};
const selectItem = (type: string) => {
  itemAction(type);
  if (type == "merge") {
    closeAction();
  } else {
    formData.value[props.field.fieldName] = {};
  }
};
const closeAction = () => {
  dialogInputVisible.value = false;
};
const showVisible = () => {
  dialogInputVisible.value = true;
};

onMounted(() => {
  let fieldInfo = formData.value[props.field.fieldName];
  if (!fieldInfo) {
    formData.value[props.field.fieldName] = {};
  }
  nextTick(() => {
    drawerData.value = formData.value[props.field.fieldName];
  });
});
watch(
    () => drawerData.value,
    (val) => {
      formData.value[props.field.fieldName] = val;
    },
    {
      deep: true,
    },
);
</script>
<template>
  <el-drawer
      v-model="dialogInputVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :direction="field.preps?.direction ?? 'rtl'"
      :modal="field.preps?.modal ?? true"
      :resizable="field.preps?.resizable ?? true"
  >
    <template #header>
      <h3>{{ field.label }}</h3>
    </template>
    <template #default>
      <el-card class="inner_content">
        <template v-if="field.preps?.compName || field.preps?.fieldList">
          <el-scrollbar height="100%">
            <Component
                v-if="field.preps?.compName"
                :is="field.preps?.compName"
                v-bind="prepsFilter(convertData(field.preps?.params))"
                v-model="drawerData"
                v-model:dataForm="drawerData"
            />
            <template v-if="field.preps?.fieldList">
              <star-horse-form-item
                  :fieldList="{ fieldList: convertData(field.preps?.fieldList) }"
                  :compSize="compSize"
                  v-bind="prepsFilter(convertData(field.preps?.params))"
                  :source="1"
                  v-model:dataForm="drawerData"
              />
            </template>
          </el-scrollbar>
        </template>
        <el-empty v-else :description="i18n('item.noContentSet')"/>
      </el-card>
    </template>
    <template #footer>
      <div class="footer-button w-full">
        <el-button :size="compSize" @click="selectItem('merge')" type="primary">
          <star-horse-icon icon-class="save" color="#fff"/>
          {{ i18n("form.confirm") }}
        </el-button>
        <el-button :size="compSize" type="text" @click="selectItem('reset')">
          <star-horse-icon icon-class="reset"/>
          {{ i18n("dialog.reset") }}
        </el-button>
      </div>
    </template>
  </el-drawer>
  <starhorse-form-item
      :showFormItem="showFormItem"
      :isDesign="isDesign"
      :disabled="disabled"
      :bareFlag="bareFlag"
      :field="field"
      :parentField="parentField"
  >
    <el-button @click="showVisible" :disabled="checkIsDisabled(props)">
      <star-horse-icon icon-class="setting"/>
      {{ field.label }}
    </el-button>
  </starhorse-form-item>
</template>
<style lang="scss" scoped>
.cell.el-tooltip {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
