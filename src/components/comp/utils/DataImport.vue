<script setup lang="ts">
import { i18n } from "@/lang";
import { getToken } from "@/utils/auth";
import { isMobile } from "@/api/device";
import { UploadFilled } from "@element-plus/icons-vue";
import StarHorseIcon from "../StarHorseIcon.vue";
import { ApiUrls } from "@/components/types";
import { ref } from "vue";
import { download } from "@/api/star_horse_apis";
import { error, success, warning } from "@/utils/message";

const props = withDefaults(
  defineProps<{
    importInfo: ApiUrls;
    compSize?: string;
  }>(),
  {
    compSize: "default",
  },
);
const emits = defineEmits<{
  (e: "update:modelValue", dataList: Array<any>): void;
}>();
const importDialogVisible = ref<boolean>(false);
const staticDataList = defineModel("modelValue");
//批量操作
const excelOperation = () => {
  importDialogVisible.value = true;
};
/**
 * 下载模板
 */
const downloadTemplate = () => {
  download(props.importInfo?.downloadTemplateUrl, {}).catch((err) => {
    error(i18n("comp.interfaceNotFoundOrNetworkError") + err);
  });
};
/**
 * 上传失败
 * @param _err err
 * @param _file file
 * @param _fileList fileList
 */
const uploadError = (_err: any, _file: any, _fileList: any) => {
  warning(i18n("ui.importFailure"));
};
/**
 * 上传成功
 */
const uploadSuccess = (response: any, _file: any, _fileList: any) => {
  if (response.code != 200) {
    warning(i18n("ui.dataAnalysisError"));
    return;
  }
  success(i18n("ui.importSuccess"));
  staticDataList.value = response.data;
  importDialogVisible.value = false;
};
</script>

<template>
  <star-horse-dialog
    :title="i18n('ui.importFile')"
    v-model="importDialogVisible"
    :boxWidth="'30%'"
    :source="3"
    :draggable="false"
    @closeAction="importDialogVisible = false"
  >
    <el-card>
      <el-upload
        :auto-upload="true"
        :on-error="uploadError"
        :on-success="uploadSuccess"
        :show-file-list="false"
        accept=".xls,.xlsx"
        :action="importInfo?.analyzeDataUrl"
        :headers="{ token: getToken() }"
        class="upload"
        name="file"
        drag
      >
        <el-icon class="el-icon--upload">
          <upload-filled />
        </el-icon>
        <div class="el-upload__text">
          {{ i18n("ui.uploadText") }}
        </div>
        <template #tip>
          <div class="el-upload__tip">
            {{ i18n("ui.uploadTip") }}
            <el-button
              @click="downloadTemplate"
              title=""
              :size="compSize"
              link
              v-if="importInfo?.downloadTemplateUrl"
            >
              <star-horse-icon
                icon-class="download"
                color="var(--star-horse-white)"
                size="12px"
              />
              <el-tooltip
                :content="i18n('ui.downloadTemplate')"
                :trigger="isMobile ? 'click' : 'hover'"
                >{{ i18n("ui.downloadTemplate") }}
              </el-tooltip>
            </el-button>
          </div>
        </template>
      </el-upload>
    </el-card>
  </star-horse-dialog>
  <star-horse-icon
    :title="i18n('ui.importExcel')"
    icon-class="upload"
    v-if="importInfo?.analyzeDataUrl"
    @click="excelOperation"
    color="var(--star-horse-style)"
    size="18px"
  />
</template>

<style scoped lang="scss"></style>
