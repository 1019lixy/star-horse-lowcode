<script setup lang="ts">
import {PropType, ref} from 'vue';
import StarHorseIcon from '@/components/comp/StarHorseIcon.vue';
import {compKey} from "@/api/system";

defineProps({
  dataList: {type: Array<any>, required: true},
  preps: {
    type: Object as PropType<any>,
    default: () => {
      return {
        value: 'value',
        label: 'name',
        children: 'children'
      };
    }
  },
  btnTitle: {type: String, default: '添加数据'},
  rmvTitle: {type: String, default: '删除数据'},
  btnVisible: {type: Boolean, default: false},
  rmvVisible: {type: Boolean, default: false}
});
const emits = defineEmits(['selectData', 'addData', 'removeData']);
let currentItem = ref<any>({});
const selectData = (item: any, event: MouseEvent) => {
  currentItem.value = item;
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }
  emits('selectData', item);
};
/**
 * 添加数据
 * @param item
 */
const addData = (item: any) => {
  emits('addData', item);
};
const removeData = (item: any) => {
  emits('removeData', item);
};
</script>
<template>
  <template v-for="(item,key) in dataList" :key="compKey(item,key)">
    <el-sub-menu
        v-if="item?.children?.length > 0"
        :class="{ 'is-active': item[preps.value] == currentItem[preps.value] }"
        :index="item[preps.value]"
    >
      <template #title>
        <el-icon class="star-icon">
          <component is="folder"/>
        </el-icon>
        <div class="menu-title" @click="selectData(item, $event)">
          <div class="name">{{ item[preps.label] }}</div>
          <div v-if="btnVisible || rmvVisible" class="btn">
            <el-tooltip :content="btnTitle">
              <star-horse-icon cursor="pointer" v-if="btnVisible" @click.stop="addData(item)" icon-class="plus"/>
            </el-tooltip>
            <el-tooltip :content="rmvTitle">
              <star-horse-icon
                  cursor="pointer"
                  v-if="rmvVisible"
                  @click.stop="removeData(item)"
                  color="var(--el-color-danger)"
                  icon-class="minus"
              />
            </el-tooltip>
          </div>
        </div>
      </template>
      <SubSystemMenu
          :dataList="item?.children"
          :preps="preps"
          @selectData="selectData"
          @removeData="removeData"
          :btnVisible="btnVisible"
          :btnTitle="btnTitle"
          :rmvVisible="rmvVisible"
          :rmvTitle="rmvTitle"
      />
    </el-sub-menu>
    <el-menu-item
        v-else
        :index="item[preps.value]"
        :class="{ 'is-active': item[preps.value] == currentItem[preps.value] }"
    >
      <el-icon class="star-icon">
        <component is="document"/>
      </el-icon>
      <template #title>
        <div class="menu-title" @click="selectData(item, $event)">
          <div class="name">{{ item[preps.label] }}</div>
          <div v-if="btnVisible || rmvVisible" class="btn">
            <el-tooltip :content="btnTitle">
              <star-horse-icon cursor="pointer" v-if="btnVisible" @click.stop="addData(item)" icon-class="plus"/>
            </el-tooltip>
            <el-tooltip :content="rmvTitle">
              <star-horse-icon
                  cursor="pointer"
                  v-if="rmvVisible"
                  @click.stop="removeData(item)"
                  color="var(--el-color-danger)"
                  icon-class="minus"
              />
            </el-tooltip>
          </div>
        </div>
      </template>
    </el-menu-item>
  </template>
</template>
<style scoped lang="scss">
.star-icon {
  font-size: 22px;
}

.el-sub-menu {
  justify-content: space-between;
}

:deep(.el-sub-menu__title) {
  height: 35px !important;
  line-height: 35px !important;
  width: 100%;
}

:deep(.el-scrollbar__view) {
  height: 100%;
}
</style>
