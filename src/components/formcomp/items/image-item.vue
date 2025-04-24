<template>
  <starhorse-form-item
      :isDesign="context.attrs['isDesign']"
      :disabled="context.attrs['disabled']"
      :bareFlag="context.attrs['bareFlag']"
      :form-item="field"
      :parentField="parentField"
  >
    <el-input
        v-if="field.preps['assignType'] == 'url'"
        :placeholder="field.preps['placeholder'] || '请输入图片地址：如：http://localhost/assert/test.jpg'"
        v-model="context.attrs['formData'][field.preps['name']]"
    >
      <template #append>
        <el-upload
            :auto-upload="true"
            :on-change="(uploadFile: any, uploadFiles: any) => selfAction('change', uploadFile, uploadFiles)"
            :on-error="
            (error: any, uploadFile: any, uploadFiles: any) => selfAction('error', uploadFile, uploadFiles, error)
          "
            :on-exceed="(files: any, uploadFiles: any) => selfAction('exceed', files, uploadFiles)"
            :on-preview="(uploadFile: any) => selfAction('preview', uploadFile)"
            :on-progress="
            (evt: any, uploadFile: any, uploadFiles: any) => selfAction('progress', uploadFile, uploadFiles, evt)
          "
            :on-remove="(uploadFile: any, uploadFiles: any) => selfAction('remove', uploadFile, uploadFiles)"
            :on-success="
            (response: any, uploadFile: any, uploadFiles: any) =>
              selfAction('success', uploadFile, uploadFiles, response)
          "
            :show-file-list="false"
            accept=".jpg,.jpeg,.png,.gif,.bmp,.webp"
            :action="field.preps['action'] || defaultAction"
            :headers="{ token: getToken() }"
            class="upload"
            name="file"
        >
          <el-tooltip content="上传图片">
            <star-horse-icon icon-class="upload" color="var(--star-horse-style)"/>
          </el-tooltip>
        </el-upload>
      </template>
    </el-input>
    <div class="image-area" v-else>
      <el-image
          :style="{
          width: context.attrs['formData'][field.preps['name']] ? field.preps['width'] || '100px' : '100%',
          height: context.attrs['formData'][field.preps['name']] ? field.preps['height'] || '100px' : '100%'
        }"
          :zoom-rate="field.preps['zoomRate'] || 1.2"
          :max-scale="field.preps['maxScale'] || 2"
          :min-scale="field.preps['minScale'] || 0.2"
          :preview-src-list="field.preps['previewSrcList'] || defaultViewList"
          :initial-index="field.preps['initialIndex'] || 5"
          :fit="field.preps['fit'] || 'contain'"
          :fid="field.preps['name']"
          :src="context.attrs['formData'][field.preps['name']] || ''"
      >
        <template #error>
          <el-upload
              :auto-upload="true"
              :on-change="(uploadFile: any, uploadFiles: any) => selfAction('change', uploadFile, uploadFiles)"
              :on-error="
              (error: any, uploadFile: any, uploadFiles: any) => selfAction('error', uploadFile, uploadFiles, error)
            "
              :on-exceed="(files: any, uploadFiles: any) => selfAction('exceed', files, uploadFiles)"
              :on-preview="(uploadFile: any) => selfAction('preview', uploadFile)"
              :on-progress="
              (evt: any, uploadFile: any, uploadFiles: any) => selfAction('progress', uploadFile, uploadFiles, evt)
            "
              :on-remove="(uploadFile: any, uploadFiles: any) => selfAction('remove', uploadFile, uploadFiles)"
              :on-success="
              (response: any, uploadFile: any, uploadFiles: any) =>
                selfAction('success', uploadFile, uploadFiles, response)
            "
              :show-file-list="false"
              accept=".jpg,.jpeg,.png,.gif,.bmp,.webp"
              :action="field.preps['action'] || defaultAction"
              :headers="{ token: getToken() }"
              class="upload"
              name="file"
          >
            <el-button type="text" text size="small">
              <el-tooltip content="上传图片">
                <star-horse-icon icon-class="upload"/>
                上传图片
              </el-tooltip>
            </el-button>
          </el-upload>
        </template>
        <template #placeholder>
          <div class="image-slot">
            <el-icon>
              <icon-picture/>
            </el-icon>
          </div>
        </template>
      </el-image>
      <div class="image-remove" v-if="context.attrs['formData'][field.preps['name']] && context.attrs['isDesign']">
        <el-tooltip content="删除图片">
          <el-button title="" size="small" type="text" @click="removeImage">
            <star-horse-icon icon-class="delete" color="var(--el-color-danger)" cursor="pointer"/>
          </el-button>
        </el-tooltip>
      </div>
    </div>
  </starhorse-form-item>
</template>
<script lang="ts">
import {defineComponent, onMounted, shallowRef} from "vue";
import {allAction, checkIsDisabled} from "@/components/formcomp/utils/ItemRelationEventUtils.ts";
import {Picture as IconPicture} from "@element-plus/icons-vue";
import {getToken} from "@/utils/auth.ts";

export default defineComponent({
  methods: {getToken,checkIsDisabled},
  components: {
    IconPicture
  },
  setup(_props, context) {
    const parentField = context.attrs["parentField"];

    const field = context.attrs["field"] as any;
    let formItem = shallowRef({label: "input", required: false});
    let dataField = shallowRef("");
    let actionName = shallowRef("change");
    let defaultAction = "/system-config/annex/upload/common";
    let defaultViewList = shallowRef([]);
    const itemAction = (prep: any) => {
      allAction(context, prep);
    };
    const removeImage = () => {
      console.log(context.attrs);
      context.attrs["formData"][field.preps["name"]] = "";
      defaultViewList.value = [];
    };
    const selfAction = (prep: any, uploadFile: any, uploadFiles: any = [], param: any = {}) => {
      if (prep == "success") {
        let result = param.data;
        let path = (field.preps["context"] || "/system-config") + result.path;
        context.attrs["formData"][field.preps["name"]] = path;
        defaultViewList.value.push(path);
        //默认将上传成功的属性存入数据对象
        if (!field.preps["keepResult"] || field.preps["keepResult"] == "Y") {
          Object.entries(result).forEach(([key, value]) => {
            context.attrs["formData"][key] = value;
          });
        }
        //console.log(param.data.path);
      }
      context.emit("selfFunc", prep, uploadFile, uploadFiles, param);
    };
    onMounted(() => {
      actionName.value = field.preps?.actionName || "normal";
      if (!context.attrs["isSearch"]) {
        allAction(context, actionName.value, true);
      }
    });
    return {
      parentField,
      context,
      field,
      formItem,
      dataField,
      itemAction,
      actionName,
      selfAction,
      removeImage,
      defaultAction,
      defaultViewList
    };
  }
});
</script>
<style lang="scss" scoped>
.image-area {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;

  &:hover {
    .image-remove {
      visibility: visible;
    }
  }

  .image-remove {
    position: absolute;
    visibility: hidden;
    top: 50%;
    left: 50%;
  }
}

.demo-image__error .image-slot {
  font-size: 30px;
}

.demo-image__error .image-slot .el-icon {
  font-size: 30px;
}

.demo-image__error .el-image {
  width: 100%;
  height: 200px;
}
</style>
