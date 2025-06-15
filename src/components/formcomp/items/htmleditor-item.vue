<template>
  <starhorse-form-item
      :isDesign="isDesign"
      :disabled="disabled"
      :bareFlag="bareFlag"
      :formItem="field"
      :parentField="parentField"
  >
    <div style="border: 1px solid #ccc">

      <QuillEditor
          :style="{ height: field.preps?.height || '300px', 'overflow-y': 'hidden' }"
          :modules="modules"
          @change="itemAction('change')"
          @input="itemAction('input')"
          @keydown.enter="itemAction('enter')"
          @focus="itemAction('focus')"
          @blur="itemAction('blur')"
          v-model="formData[field.fieldName]"
          theme="snow"
          toolbar="full"
          :fid="field.fieldName"
          @onCreated="handleCreated"
      />
    </div>
  </starhorse-form-item>
</template>
<script setup lang="ts">
import {onMounted, shallowRef} from 'vue';
import {QuillEditor} from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import {allAction} from '@/components/formcomp/utils/ItemRelationEventUtils';
import {postRequest} from '@/api/star_horse_apis';
import ImageUploader from 'quill-image-uploader';

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

const editorRef = shallowRef(); // 编辑器实例，必须用 shallowRef

const itemAction = (prep: any) => {
  allAction(props, emits, formData, prep);
};

const handleCreated = (editor: any) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};
const modules: any = {
  name: 'imageUploader',
  module: ImageUploader,
  options: {
    upload: file => {
      return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('image', file);

        postRequest('/upload-image', formData)
            .then(res => {
              console.log(res);
              resolve(res.data.url);
            })
            .catch(err => {
              reject('Upload failed');
              console.error('Error:', err);
            });
      });
    }
  }
};
onMounted(() => {

});
</script>
<style scoped></style>
