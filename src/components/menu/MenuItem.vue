<script setup lang="ts">
import { computed, PropType } from 'vue';
import { compKey } from "@/api/system";
defineOptions({
  name: 'MenuItem',
})
const props = defineProps({
  item: { type: Object as PropType<any>, required: true },
  preps: {
    type: Object as PropType<any>,
    default: () => {
      return {
        id: "id",
        icon: "icon",
        value: 'value',
        label: 'name',
        children: 'children'
      };
    }
  },
  level: { type: Number, default: 1 }
});
const emits = defineEmits(['selectItem']);
const selectItem = (item: any) => {
  emits('selectItem', item);
}
let menuColor = computed(() => (props.level > 1 ? 'var(--star-horse-shadow)' : 'var(--star-horse-background)'));
</script>
<template>
  <el-sub-menu popper-class="popper-class" v-if="item[preps.children??'children']?.length > 0" :index="item[preps.id]"
    @click="selectItem(item)">
    <template #title>
      <el-icon class="star-icon">
        <component :is="item[preps.icon] || 'document'" />
      </el-icon>
      <span>{{ item[preps.label] }} </span>
    </template>
    <template v-for="(sitem, key) in item[preps.children??'children']" :key="compKey(sitem,key)">
      <MenuItem :item="sitem" :level="level + 1" :preps="preps" @selectItem="selectItem" />
    </template>
  </el-sub-menu>
  <el-menu-item popper-class="popper-class" v-else :index="item[preps.id]" @click="selectItem(item)">
    <el-icon class="star-icon">
      <component :is="item[preps.icon] || 'document'" />
    </el-icon>
    <template #title>
      <span>{{ item[preps.label] }} </span>
    </template>
  </el-menu-item>
</template>
<style lang="scss" scoped>
.star-icon {
  font-size: 22px;
}

.popper-class {
  background: var(--star-horse-white) !important;
}

.el-sub-menu {
  background: v-bind(menuColor);
  margin-top: 1px;
}

:deep(.el-sub-menu__title) {
  height: 40px;
  line-height: 40px;
}

:deep(.el-scrollbar__view) {
  height: 100%;
}

.popers {
  overflow: auto;
  height: 100% !important;
  z-index: 999999;
}
</style>
