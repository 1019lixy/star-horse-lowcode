<template>
  {{ fields }}
  <dytable-container
    :formData="formData"
    :field="fields"
    :is-design="true"
    :formInfo="{}"
  />
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import piniaInstance from "@/store";
import { useDesignFormStore } from "@/store/designForm";
import { uuid } from "@/api/system";

let designForm = useDesignFormStore(piniaInstance);
const formData = ref<any>({
  test: "1-2-1",
});
const fields = ref<any>({
  id: "shb5d00449-56ee-47a6-a7af-54aec2715b98",
  name: "测试",
  itemNameLabel: "测试",
  compType: "container",
  itemType: "dytable",
  preps: {
    elements: [
      {
        columns: [
          {
            _uuid: "sh80d2269a-849d-498c-b386-cdba601f70af",
            colspan: 1,
            rowspan: 1,
            items: [],
          },
          {
            _uuid: "sh7a347a46-37bd-4082-8c10-98981024b850",
            colspan: 1,
            rowspan: 1,
            items: [],
          },
          {
            _uuid: "sh7235d4a7-613e-42c1-9b11-9c0e15ffccaf",
            colspan: 1,
            rowspan: 1,
            items: [],
          },
        ],
      },
      {
        columns: [
          {
            _uuid: "sh0aacfdf0-a223-463d-9b9b-140e2276d608",
            colspan: 1,
            rowspan: 1,
            items: [],
          },
          { colspan: 1, items: [] },
          {
            _uuid: "sh4c4bf53f-d936-42da-b87e-243e1620a613",
            colspan: 1,
            rowspan: 1,
            items: [],
          },
        ],
      },
      {
        columns: [
          {
            _uuid: "sh4302ee34-f984-4e7b-a1a3-589ae7b1ef56",
            colspan: 1,
            rowspan: 1,
            items: [],
          },
          {
            _uuid: "sh3e39747f-ea0f-4398-98b4-dbd68f606709",
            colspan: 1,
            rowspan: 1,
            items: [],
          },
          {
            _uuid: "sh3ba4267a-340d-4d6a-9ae7-d19524101065",
            colspan: 1,
            rowspan: 1,
            items: [],
          },
        ],
      },
    ],
  },
});
onMounted(() => {
  designForm.clearAll(true);
});
</script>

<style lang="scss" scoped></style>
