<script lang="ts">
import {defineComponent} from 'vue';
import QRCode from "qrcode.vue-next";

export default defineComponent({
  components: {QRCode},
  setup(_props, context) {
    console.log(context);
    const parentField = context.attrs['parentField'];
    const field = context.attrs['field'] as any;
    return {parentField, context, field};
  }
});
</script>
<template>
  <starhorse-form-item
      :isDesign="context.attrs['isDesign']"
      :disabled="context.attrs['disabled']"
      :bareFlag="context.attrs['bareFlag']"
      :form-item="field"
      :parentField="parentField">
    <QRCode
        :value="context.attrs['formData'][field.preps['name']]"
        :size="field.preps.size??160"
        :bgColor="field.preps.bgColor??'#fff'"
        :color="field.preps.color??'#000'"
        :level="field.preps.level??'M'"
        :type="field.preps.type??'svg'"
        :icon="field.preps.icon"
        :iconSize="field.preps.iconSize"
        :iconSettings="field.preps.iconSettings??undefined"
        :imageSettings="field.preps.imageSettings??undefined"
        :status="field.preps.status??'active'"
        :bordered="true"
        style="margin: 5px"
        @change="() => console.log('change')"
        @refresh="() => console.log('refresh')"
    />
  </starhorse-form-item>
</template>
<style scoped></style>
