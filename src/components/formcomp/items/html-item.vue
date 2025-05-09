<template>
  <starhorse-form-item
      :isDesign="isDesign"
      :disabled="disabled"
      :bareFlag="bareFlag"
      :formItem="field"
      :parentField="parentField"
  >
    <div class="user_html" v-html="field.preps['content']"/>
  </starhorse-form-item>
</template>
<script setup lang="ts">
import {onMounted} from "vue";

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

onMounted(() => {
  formData[props.field.preps['name']] = props.field.preps['content'];
})

</script>
<style lang="scss" scoped>
.user_html {
  width: 100%;
  min-height: 30px;
  height: auto;
}
</style>
