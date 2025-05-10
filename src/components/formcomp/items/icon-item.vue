<template>
  <starhorse-form-item
      :isDesign="isDesign"
      :disabled="disabled"
      :bareFlag="bareFlag"
      :formItem="field"
      :parentField="parentField"
  >
    <el-popover
        :popper-style="{ width: 'inherit !important' }"
        ref="popoverRef"
        :placement="field.preps['placement']??'bottom-start'"
        :disabled="checkIsDisabled(props)||field.preps['listView'] == 'Y'"
        trigger="click"
    >
      <template #reference>
        <el-avatar
            v-if="iconType == 'system'"
            fit="fill"
            shape="square"
            :style="{
            'font-size': field.preps['listView'] == 'Y' ? '22px' : '24px',
            background: field.preps['listView'] == 'Y' ? 'unset' : 'var(--el-avatar-bg-color)'
          }"
            :icon="formData[field.preps['name']]"
        />
        <star-horse-icon
            :icon-class="formData[field.preps['name']]"
            v-else
            size="40px"
            style="
            font-size: 50px;
            color: var(--star-horse-style);
            border-radius: 3px;
            border: 1px solid var(--star-horse-light-gray);
          "
            cursor="pointer"
        />
      </template>
      <div class="icon-items">
        <div class="search-box">
          <el-input
              :size="formInfo?.size || field?.preps['size'] || 'default'"
              v-model="searchName"
              @keydown.enter="dataSearch"
              clearable
              placeholder="请输入要搜索的图标"
          >
            <template #prefix>
              <star-horse-icon icon-class="search" @click="dataSearch"/>
            </template>
          </el-input>
        </div>
        <ul class="system-icon">
          <li
              v-for="sdata in iconList"
              @click="assignIcon(sdata.value)"
              :title="sdata.name"
              :class="{ 'icon-active': sdata.value == formData[field.preps['name']] }"
          >
            <el-icon
                class="star-icon"
                style="font-size: 50px; color: var(--star-horse-style)"
                v-if="iconType == 'system'"
            >
              <component :is="sdata.value"/>
            </el-icon>
            <star-horse-icon
                :icon-class="sdata.value"
                v-else
                size="30px"
                style="font-size: 50px; color: var(--star-horse-style)"
                cursor="pointer"
            />
          </li>
        </ul>
      </div>
    </el-popover>
  </starhorse-form-item>
</template>
<script setup lang="ts">
import {onMounted, ref, shallowRef, unref} from 'vue';
import {loadElementPlusIcon, loadSvgIcons} from '@/api/star_horse_utils.ts';
import {allAction, checkIsDisabled} from '@/components/formcomp/utils/ItemRelationEventUtils.ts';
import StarHorseIcon from '@/components/comp/StarHorseIcon.vue';
import StarhorseFormItem from "@/components/formcomp/items/starhorse-form-item.vue";

const props = defineProps({
  isDesign: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  bareFlag: {
    type: Boolean,
    default: false
  }, isSearch: {
    type: Boolean,
    default: false
  },
  field: {
    type: Object,
    default: {}
  },
  parentField: {
    type: Object,
    default: {}
  },
  formInfo: {
    type: Object,
    default: {}
  }
});
const emits = defineEmits(['selfFunc', 'selectItem']);
const formData = defineModel("formData");

let searchName = ref<string>('');
let iconList = ref<any>([]);
let allIconList = ref<any>([]);
let iconType = ref<string>('system');
const popoverRef = shallowRef();
let actionName = shallowRef('normal');
const assignIcon = (iconName: string) => {
  formData.value[props.field.preps['name']] = iconName;
  unref(popoverRef).popperRef?.delayHide?.();
  itemAction('blur');
};
const dataSearch = () => {
  if (!searchName.value) {
    iconList.value = allIconList.value;
  } else {
    iconList.value = allIconList.value.filter((item: any) => {
      return item.name.toLowerCase().indexOf(searchName.value.toLowerCase()) > -1;
    });
  }
};
const itemAction = (prep: any) => {
  if (prep == actionName.value && props.field.preps['actionRelation']) {
    props.field.preps['actionRelation'](
        formData.value[props.field.preps['name']],
        formData.value['xh']
    );
  }
  emits('selfFunc', prep, formData.value);
};
onMounted(() => {
  actionName.value = props.field.preps?.actionName || 'normal';
  if (props.field.preps['values']?.length > 0) {
    allIconList.value = props.field.preps['values'];
    iconType.value = 'user';
  } else if (props.field.preps['iconType'] == 'user') {
    allIconList.value = loadSvgIcons();
    iconType.value = props.field.preps['iconType'];
  } else {
    allIconList.value = loadElementPlusIcon();
    iconType.value = 'system';
  }
  iconList.value = allIconList.value;
  if (!props.isSearch) {
    allAction(props, emits, formData, actionName.value, true);
  }
});

</script>
<style scoped>
.icon-items {
  width: 100%;
  display: flex;
  flex-direction: column;

  .system-icon {
    margin-top: 5px;
    justify-content: center;
    li{
      margin: 1px;
    }
  }
}

.search-box {
  width: 90%;
  margin: 0 auto;
}
</style>
