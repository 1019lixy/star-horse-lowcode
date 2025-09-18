<script setup lang="ts" name="Areainfo">
import StarHorseJsonEditor from "@/components/comp/StarHorseJsonEditor.vue";
import {ref} from "vue";

let json = ref<Array<any>>([
  {
    "prop": "date",
    "label": "日期",
    "width": "180"
  },
  {
    "prop": "name",
    "label": "姓名",
    "width": "180"
  },
  {
    "prop": "address",
    "label": "地址"
  }
]);
</script>
<template>
  {{ json }}
  <StarHorseJsonEditor v-model="json" currentMode="json" ref="editor"/>
  "
</template>
<style lang="scss" scoped></style>
