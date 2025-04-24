<template>
  <starhorse-form-item
      :isDesign="context.attrs['isDesign']"
      :disabled="context.attrs['disabled']"
      :bareFlag="context.attrs['bareFlag']"
      :form-item="field"
      :parentField="parentField"
  >
    <el-popover
        :popper-style="{ width: 'inherit !important' }"
        ref="popoverRef"
        :placement="field.preps['placement']??'bottom-end'"
        :disabled="checkIsDisabled(context)||field.preps['listView'] == 'Y'"
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
            :icon="context.attrs['formData'][field.preps['name']]"
        />
        <star-horse-icon
            :icon-class="context.attrs['formData'][field.preps['name']]"
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
      <div class="search-box">
        <el-input
            :size="context.attrs.formInfo?.size || field?.preps['size'] || 'default'"
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
            :class="{ 'icon-active': sdata.value == context.attrs['formData'][field.preps['name']] }"
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
    </el-popover>
  </starhorse-form-item>
</template>
<script lang="ts">
import {defineComponent, onMounted, shallowRef, unref, ref} from 'vue';
import {loadElementPlusIcon, loadSvgIcons} from '@/api/star_horse_utils.ts';
import {allAction, checkIsDisabled} from '@/components/formcomp/utils/ItemRelationEventUtils.ts';
import StarHorseIcon from '@/components/comp/StarHorseIcon.vue';

export default defineComponent({
  components: {StarHorseIcon},
  emits: ['selectItem', 'selfFunc'],
  methods: {checkIsDisabled},
  setup(_props, context) {
    const parentField = context.attrs['parentField'];

    const field = context.attrs['field'] as any;
    let formItem = shallowRef({label: 'input', required: false});
    let dataField = shallowRef('');
    let searchName = ref<string>('');
    let iconList = ref<any>([]);
    let allIconList = ref<any>([]);
    let iconType = ref<string>('system');
    const popoverRef = shallowRef();
    let actionName = shallowRef('normal');
    const assignIcon = (iconName: string) => {
      context.attrs['formData'][field.preps['name']] = iconName;
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
      if (prep == actionName.value && field.preps['actionRelation']) {
        field.preps['actionRelation'](
            context.attrs['formData'][field.preps['name']],
            context.attrs['formData']['xh']
        );
      }
      context.emit('selfFunc', prep);
    };
    onMounted(() => {
      actionName.value = field.preps?.actionName || 'normal';
      if (field.preps['values']?.length > 0) {
        allIconList.value = field.preps['values'];
        iconType.value = 'user';
      } else if (field.preps['iconType'] == 'user') {
        allIconList.value = loadSvgIcons();
        iconType.value = field.preps['iconType'];
      } else {
        allIconList.value = loadElementPlusIcon();
        iconType.value = 'system';
      }
      iconList.value = allIconList.value;
      if (!context.attrs['isSearch']) {
        allAction(context, actionName.value, true);
      }
    });
    return {
      parentField,
      context,
      field,
      formItem,
      dataField,
      assignIcon,
      itemAction,
      actionName,
      popoverRef,
      searchName,
      dataSearch,
      iconList,
      iconType
    };
  }
});
</script>
<style scoped>
.search-box {
  width: 90%;
  margin: 0 auto;
}
</style>
