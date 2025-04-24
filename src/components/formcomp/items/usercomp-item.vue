<template>
  <starhorse-form-item
      :isDesign="context.attrs['isDesign']"
      :disabled="context.attrs['disabled']"
      :bareFlag="context.attrs['bareFlag']"
      :formItem="field"
      :parentField="parentField"
  >
    <component
        :is="currentComponent"
        :isDesign="context.attrs['isDesign']"
        :disabled="context.attrs['disabled']"
        :bareFlag="context.attrs['bareFlag']"
        :nodeFieldList="field['preps'].params?.nodeFieldList"
        :lineFieldList="field['preps'].params?.lineFieldList"
        :customerItems="field['preps'].params?.nodeList"
        :readonly="field['preps']['readonly'] == 'Y'"
        :preps="field['preps']"
        v-model:dataForm="context.attrs['formData']"
    />
  </starhorse-form-item>
</template>
<script lang="ts">
import {defineComponent, shallowRef, onMounted, watch} from 'vue';
import {checkIsDisabled} from '@/components/formcomp/utils/ItemRelationEventUtils.ts';

export default defineComponent({
  methods: {checkIsDisabled},
  setup(_props, context) {
    const parentField = context.attrs['parentField'];

    const field = context.attrs['field'] as any;
    let formItem = shallowRef({label: 'input', required: false});
    let dataField = shallowRef('');
    const currentComponent = shallowRef(null);
    const loadComponent = async () => {
      let compName = field['preps'].compName;
      if (compName) {
        try {
          let comp = await import(`@/components/${compName}.vue`);
          currentComponent.value = comp.default;
        } catch (e) {
          console.log(e.message);
          currentComponent.value = null;
        }
      } else {
        currentComponent.value = field?.preps['name'];
      }
    };
    onMounted(() => {
      loadComponent();
    });
    watch(() => [field.preps?.compName, field.preps?.name],
        () => {
          loadComponent();
        }, {immediate: false});
    return {parentField, context, field, formItem, dataField, currentComponent};
  }
});
</script>
<style scoped></style>
