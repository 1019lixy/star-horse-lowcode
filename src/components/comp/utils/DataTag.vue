<script setup lang="ts">
import {onMounted} from "vue";

export interface DataTagProps {
  data: any;
  displayName?: string;
  displayValue?: string;
  type?: "success" | "info" | "warning" | "danger";
  closable?: boolean;
}

const props = withDefaults(defineProps<DataTagProps>(), {
  closable: false,
  displayName: "name",
  displayValue: "value",
  type: "info"
});
const emits = defineEmits<{
  (e: "close", id: string): void;
}>();

onMounted(() => {
  if (!props.data) {
    throw new Error("username is required");
  }

  // getById(props.id).then((res) => {
  //   if (res.success) {
  //     roleInfo.id = res.data.id
  //     roleInfo.name = res.data.name
  //   }
  // })
});
const onClose = () => {
  emits("close", props.data);
};
</script>
<template>
  <el-tag round :closable="closable" :type="type" effect="light" @close="onClose">
    <div class="flex-center" style="gap: 4px; grid-gap: 4px">
      <span>{{ data[displayName] }}</span>
    </div>
  </el-tag>
</template>

<style scoped lang="scss">
:deep {
  .el-tag__content:only-child {
    margin-right: 4px;
  }
}
</style>
