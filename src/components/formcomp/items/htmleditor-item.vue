<template>
  <starhorse-form-item
      :isDesign="context.attrs['isDesign']"
      :bareFlag="context.attrs['bareFlag']"
      :form-item="field"
      :parentField="parentField"
  >
    <div style="border: 1px solid #ccc">

      <QuillEditor
          :style="{ height: field.preps.height || '300px', 'overflow-y': 'hidden' }"
          :modules="modules"
          @change="itemAction('change')"
          @input="itemAction('input')"
          @keydown.enter="itemAction('enter')"
          @focus="itemAction('focus')"
          @blur="itemAction('blur')"
          v-model="context.attrs['formData'][field.preps['name']]"
          theme="snow"
          toolbar="full"
          :fid="field.preps['name']"
          @onCreated="handleCreated"
      />
    </div>
  </starhorse-form-item>
</template>
<script lang="ts">
import {defineComponent, getCurrentInstance, shallowRef} from "vue";
import {QuillEditor} from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import {allAction} from "@/components/formcomp/utils/ItemRelationEventUtils.ts";
import {postRequest} from "@/api/star_horse_apis.ts";
import ImageUploader from 'quill-image-uploader';
export default defineComponent({
  components: {QuillEditor},
  beforeUnmount: () => {
    // const {proxy} = getCurrentInstance();

  },
  setup(_props, context) {
    const parentField = context.attrs["parentField"];

    const field = context.attrs["field"] as any;
    let formItem = shallowRef({label: "input", required: false});
    let dataField = shallowRef("");
    let editorConfig = shallowRef({});
    let toolbarConfig = shallowRef({});
    const editorRef = shallowRef(); // 编辑器实例，必须用 shallowRef
    const dynamicFunction = (data: any) => {
      if (!data) {
        return;
      }
      let fun = new Function(data);
      fun();
    };
    const itemAction = (prep: any) => {
      allAction(context, prep);
    };
    toolbarConfig.value = {
      //excludeKeys: ["insertLink", "insertImage", "editImage", "viewImageLink", "insertVideo", "emotion", "fullScreen"],
    };
    editorConfig.value = {placeholder: "请输入内容...", MENU_CONF: {}};
    const handleCreated = (editor: any) => {
      editorRef.value = editor; // 记录 editor 实例，重要！
    };
    const modules:any = {
      name: 'imageUploader',
      module: ImageUploader,
      options: {
        upload: file => {
          return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append("image", file);

            postRequest('/upload-image', formData)
                .then(res => {
                  console.log(res)
                  resolve(res.data.url);
                })
                .catch(err => {
                  reject("Upload failed");
                  console.error("Error:", err)
                })
          })
        }
      }
    }
    // 组件销毁时，也及时销毁编辑器
    return {
      parentField,
      context,
      field,
      formItem,
      editorConfig,
      editorRef,
      toolbarConfig,
      dataField,
      modules,
      dynamicFunction,
      itemAction,
      handleCreated
    };
  }
});
</script>
<style scoped></style>
