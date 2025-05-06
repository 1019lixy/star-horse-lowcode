<template>
  <star-horse-form :fieldList="formField"/>
</template>
<script lang="ts" setup>
import StarHorseForm from "@/components/comp/StarHorseForm.vue";
import {reactive} from "vue";
import {PageFieldInfo} from "@/components/types";

const formField = reactive<PageFieldInfo>({
  fieldList: [{
    dytableList: [
      [{

        fieldName: "txt1",
        formVisible: true,
        type: "text",
        preps: {
          textContent: "文本1",
          labelFlag: "Y"
        }
      }, {

        fieldName: "txt2",
        type: "text",
        formVisible: true,
        preps: {
          textContent: "文本2",
          colspan: 2,
          labelFlag: "Y"
        }

      }],
      [{
        label: "名字1",
        fieldName: "name1",
        required:true,
        formVisible: true,
        preps:{
        }
      }, {
        label: "名字2",
        fieldName: "name2",
        required:true,
        formVisible: true,
        preps: {
          colspan: 2,
        }

      }],
      [{
        label: "名字3",
        fieldName: "name3",
        formVisible: true,
        preps:{
        }
      }, {
        label: "名字4",
        fieldName: "name4",
        formVisible: true,
        preps:{
        }
      }, {
        label: "名字5",
        fieldName: "name5",
        formVisible: true,
        preps:{
        }
      }]
    ]
  }]
});
</script>
<style lang="scss">
#app {
  height: 100%;
}
</style>
