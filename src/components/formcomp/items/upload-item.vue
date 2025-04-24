<template>
  <starhorse-form-item
      :isDesign="context.attrs['isDesign']"
      :disabled="context.attrs['disabled']"
      :bareFlag="context.attrs['bareFlag']"
      :form-item="field"
      :parentField="parentField"
  >
    <el-upload
        :fid="field.preps['name']"
        :accept="field.preps['accept']"
        :action="field.preps['action']"
        :auto-upload="field.preps['autoUpload'] ? field.preps['autoUpload'] == 'Y' : true"
        :before-remove="field.preps['beforeRemove']"
        :before-upload="field.preps['beforeUpload']"
        :data="field.preps['data'] || {}"
        :disabled="checkIsDisabled(context)"
        :drag="field.preps['drag'] == 'Y'"
        :headers="headers"
        :http-request="field.preps['httpRequest']"
        :limit="field.preps['limit']"
        :list-type="field.preps['listType'] || 'text'"
        :method="field.preps['method'] || 'post'"
        :multiple="field.preps['multiple'] == 'Y'"
        :name="field.preps['aliasName'] || 'file'"
        :size="context.attrs.formInfo?.size || field?.preps['size'] || 'default'"
        :on-change="(uploadFile: any, uploadFiles: any) => selfAction('change', uploadFile, uploadFiles)"
        :on-error="(error: any, uploadFile: any, uploadFiles: any) => selfAction('error', uploadFile, uploadFiles, error)"
        :on-exceed="(files: any, uploadFiles: any) => selfAction('exceed', files, uploadFiles)"
        :on-preview="(uploadFile: any) => selfAction('preview', uploadFile)"
        :on-progress="
        (evt: any, uploadFile: any, uploadFiles: any) => selfAction('progress', uploadFile, uploadFiles, evt)
      "
        :on-remove="(uploadFile: any, uploadFiles: any) => selfAction('remove', uploadFile, uploadFiles)"
        :on-success="
        (response: any, uploadFile: any, uploadFiles: any) => selfAction('success', uploadFile, uploadFiles, response)
      "
        style="width: 100% !important; display: flex; align-items: center; position: relative"
        :show-file-list="field.preps['showFileList'] == 'Y'"
        :with-credentials="field.preps['withCredentials'] == 'Y'"
        v-model:file-list="dataField"
    >
      <el-icon class="el-icon--upload" v-if="field.preps['drag'] == 'Y'">
        <upload-filled/>
      </el-icon>
      <div class="el-upload__text" v-if="field.preps['drag'] == 'Y'"> 将文件拖到此处 或 <em>点击上传</em></div>
      <template #tip v-if="field.preps['maxSize']">
        <div class="el-upload__tip"> 文件大小不能超过{{ field.preps["maxSize"] }}</div>
      </template>
      <star-horse-icon v-if="field.preps['drag'] != 'Y'" icon-class="plus" color="var(--star-horse-style)"/>
    </el-upload>
  </starhorse-form-item>
</template>
<script lang="ts">
import {defineComponent, shallowRef, onMounted, nextTick, ref, watch} from 'vue';
import {getToken} from '@/utils/auth.ts';
import {checkIsDisabled} from '@/components/formcomp/utils/ItemRelationEventUtils.ts';

export default defineComponent({
  emits: ['selectItem', 'selfFunc'],
  methods: {checkIsDisabled},
  setup(_props, context) {
    const parentField = context.attrs['parentField'];
    const field = context.attrs['field'] as any;
    let formItem = shallowRef({label: 'input', required: false});
    let dataField = shallowRef([]);
    let headers = ref<any>({});
    const selfAction = (prep: any, uploadFile: any, uploadFiles: any = [], param: any = {}) => {
      if (prep == 'success') {
        let result = param.data;
        context.attrs['formData'][field.preps['name']] = result.path;
        //默认将上传成功的属性存入数据对象
        if (!field.preps['keepResult'] || field.preps['keepResult'] == 'Y') {
          Object.entries(result).forEach(([key, value]) => {
            context.attrs['formData'][key] = value;
          });
        }
      }
      console.log(prep, uploadFile, uploadFiles, param);
      context.emit('selfFunc', prep, uploadFile, uploadFiles, param);
    };
    onMounted(async () => {
      await nextTick();
      let datas = context.attrs['formData'][field.preps['name']];
      if (datas) {
        dataField.value.push({url: (field.preps['context'] || '/system-config') + datas});
      }
      let temp = field.preps?.headers;
      if (temp && Object.keys(temp).length > 0) {
        headers.value = temp;
      }
      headers.value['token'] = getToken();
    });
    watch(
        () => context.attrs['formFieldList'],
        (val: any) => {
          if (val && Object.keys(val).includes(field.preps['name'])) {
            dataField.value = [{url: (field.preps['context'] || '/system-config') + val[field.preps['name']]}];
          }
        },
        {immediate: true, deep: true}
    );
    return {parentField, context, field, formItem, dataField, selfAction, headers};
  }
});
</script>
<style lang="scss" scoped>
:deep(.el-upload) {
  width: 100% !important;
}

:deep(.el-upload--text) {
  justify-content: left !important;
}

:deep(.el-upload-list--picture-card) {
  width: 100% !important;

  .is-drag {
    height: 100% !important;
    width: 100% !important;
  }
}

:deep(.el-upload-list) {
  position: absolute;
  top: 0;
  right: 0;
}
</style>
