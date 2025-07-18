<script setup lang="ts" name="StarHorseButtonList">
import { computed, onMounted, onUpdated, PropType, ref } from "vue";
import { ApiUrls } from "@/components/types/ApiUrls";
import { download } from "@/api/star_horse_apis";
import { error, warning } from "@/utils/message";
import { DialogProps } from "@/components/types/DialogProps";
import { getToken } from "@/utils/auth";
import { useGlobalConfigStore } from "@/store/GlobalConfig";
import piniaInstance from "@/store";
import { useButtonPermissionStore } from "@/store/ButtonPermission";
import { useRoute } from "vue-router";
import { UserFuncInfo } from "@/components/types/PageFieldInfo";
import Help from "@/components/help.vue";
import { Config } from "@/api/settings";
import { PreValid } from "@/components/types/BtnAuth";
import { compKey } from "@/api/system";

const props = defineProps({
  dialogProps: { type: Object as PropType<DialogProps>, required: true },
  compUrl: { type: Object as PropType<ApiUrls>, required: true },
  viewFlag: { type: Boolean, default: false },
  //自定义按钮
  extendBtns: { type: Array as PropType<UserFuncInfo[]> },
  //预检查方法,如果设置了预检查方法，必须要检查通过后，按钮事件才能继续往下执行
  preValidFunc: { type: Object as PropType<Array<PreValid>> },
  btnPermissions: { type: Object as PropType<any>, required: false },
});
const emits = defineEmits([
  "upload",
  "uploadProcess",
  "uploadError",
  "uploadSuccess",
  "btnOperation",
  "tableCompFunc",
]);
const route = useRoute();
let configStore = useGlobalConfigStore(piniaInstance);
let pagePermission = useButtonPermissionStore(piniaInstance);
let compSize = computed(
  () => configStore.configFormInfo?.buttonSize || Config.compSize,
);
let showType = computed(
  () => configStore.configFormInfo?.buttonShowType || "dropdown",
);
let permissions = ref<any>({});
const dataForm = ref<any>({});
/**
 * 向往抛出事件
 * @param funcName
 */
const tableCompFunc = (funcName: string) => {
  emits("tableCompFunc", funcName);
};
const btnOperation = (funcName: string) => {
  //检查前置条件
  if (props.preValidFunc?.length > 0 && Array.isArray(props.preValidFunc)) {
    const preFunc = props.preValidFunc.find(
      (item: PreValid) => item.authority == funcName,
    );
    if (preFunc) {
      const result = preFunc.valid?.();
      if (!result) {
        if (preFunc.msg?.length > 1) {
          warning(preFunc.msg);
        }
        return;
      }
    }
  }
  //？表示判断是否为空 ！表示断言not null
  if (funcName == "add") {
    //  dataForm.value = {};
    props.dialogProps!.ids = -1;
    props.dialogProps!.editVisible = true;
    props.dialogProps!.dialogTitle = "新增数据";
  } else if (funcName == "batchAdd") {
    props.dialogProps!.batchEditVisible = true;
    props.dialogProps!.batchDialogTitle = "批量新增数据";
  } else if (funcName == "download") {
    downloadTemplate();
  } else {
    tableCompFunc(funcName);
  }
};
/**
 * 刷新数据
 * @param file
 * @param fileList
 */
const downloadTemplate = () => {
  download(props.compUrl?.downloadTemplateUrl!, {}).catch((err) => {
    error("接口不存在或网络异常:" + err);
  });
};
const upload = (file: any, fileList: any) => {
  emits("upload", file, fileList);
};
const beforeUpload = (_file: any, _fileList: any) => {
  //load("数据导入中");
};
/**
 * 上传过程
 */
const uploadProcess = (_event: any, _file: any, _fileList: any) => {};
/**
 * 上传失败
 */
const uploadError = (_err: any, _file: any, _fileList: any) => {
  // closeLoad();
  tableCompFunc("refresh");
};
/**
 * 上传成功
 */
const uploadSuccess = (_response: any, _file: any, _fileList: any) => {
  //closeLoad();
  tableCompFunc("refresh");
};
let buttonList = ref<UserFuncInfo[] | any>([]);
/**
 * 扩展按钮
 */
const extendBtnFunction = (): Array<UserFuncInfo> => {
  let arr: Array<UserFuncInfo | any> = [];
  if (props.viewFlag) {
    return arr;
  }
  arr.push({
    btnName: "新增",
    icon: "add",
    authority: "add",
    priority: 100,
    funcName: (actionName: string) => btnOperation(actionName),
  });
  arr.push({
    btnName: "批量新增",
    icon: "batch-add",
    authority: "batchAdd",
    priority: 110,
    funcName: (actionName: string) => btnOperation(actionName),
  });
  arr.push({
    btnName: "下载模板",
    icon: "download",
    authority: "download",
    priority: 120,
    funcName: (actionName: string) => btnOperation(actionName),
  });
  arr.push({
    btnName: "执行",
    icon: "run",
    authority: "execution",
    priority: 130,
    funcName: (actionName: string) => btnOperation(actionName),
  });
  arr.push({
    btnName: "导入数据",
    icon: "excel-upload",
    authority: "upload",
    priority: 140,
    funcName: (actionName: string) => btnOperation(actionName),
  });
  arr.push({
    btnName: "导出数据",
    icon: "excel-export",
    authority: "export",
    helpMsg:
      "如果选择了数据，则按选择数据导出;\n没有选择数据，则根据查询条件导出",
    priority: 150,
    funcName: (actionName: string) => btnOperation(actionName),
  });
  arr.push({
    btnName: "批量删除",
    icon: "batch_delete1",
    authority: "batchDelete",
    priority: 160,
    funcName: (actionName: string) => btnOperation(actionName),
  });
  //自定义按钮，如果时自定义按钮，则覆盖原有的按钮
  if (props.extendBtns?.length > 0) {
    let extBtns: UserFuncInfo[] =
      props.extendBtns.filter((item) => item.position == "toolbar") || [];
    if (extBtns?.length > 0) {
      for (let i = 0; i < arr.length; i++) {
        let temp: UserFuncInfo = arr[i];
        if (
          extBtns.find(
            (item: UserFuncInfo) =>
              item.btnName == temp.btnName && item.authority == temp.authority,
          )
        ) {
          arr.splice(i, 1);
        }
      }
      arr.push(...extBtns);
    }
  }
  arr.sort(
    (a: UserFuncInfo, b: UserFuncInfo) =>
      (a.priority || 100) - (b.priority || 100),
  );
  return arr;
};
const setFormData = (val: any) => {
  dataForm.value = { ...val };
};
const init = async () => {
  if (props.btnPermissions && Object.keys(props.btnPermissions).length > 0) {
    permissions.value = props.btnPermissions;
  } else {
    permissions.value = await pagePermission.addRoute(route);
  }
};
onMounted(() => {
  init();
});
onUpdated(() => {
  buttonList.value = extendBtnFunction();
});
defineExpose({
  setFormData,
});
</script>
<template>
  <ul
    class="inner_button"
    v-if="showType == 'line' && Object.keys(permissions || {}).length > 0"
  >
    <template v-for="(item, key) in buttonList" :key="compKey(item, key)">
      <template v-if="item.children?.length > 0">
        <el-dropdown
          :size="compSize"
          split-button
          style="
            background: var(--star-horse-style);
            color: var(--star-horse-white);
          "
          placement="top-start"
          v-if="permissions[item.authority]"
        >
          <star-horse-icon :icon-class="item.icon" width="27px" size="18px" />
          {{ item.btnName }}
          <template #dropdown>
            <el-dropdown-menu>
              <template
                v-for="(sitem, skey) in item.children"
                :key="compKey(sitem, skey)"
              >
                <el-dropdown-item
                  v-if="permissions[sitem.authority]"
                  @click="sitem.funcName(sitem.btnName)"
                >
                  <star-horse-icon
                    :icon-class="item.icon || 'edit'"
                    width="27px"
                    size="18px"
                    :color="
                      item.authority == 'delete' ||
                      item.authority == 'batchDelete'
                        ? '#f56c6c'
                        : 'var(--star-horse-style)'
                    "
                  />
                  {{ sitem.btnName }}
                  <help :message="sitem.helpMsg" v-if="sitem.helpMsg" />
                </el-dropdown-item>
              </template>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
      <template v-else>
        <li v-if="permissions[item.authority] && item.authority == 'upload'">
          <el-upload
            :auto-upload="true"
            :on-change="upload"
            :on-error="uploadError"
            :on-progress="uploadProcess"
            :on-success="uploadSuccess"
            :show-file-list="false"
            accept=".xls,.xlsx"
            :before-upload="beforeUpload"
            :action="compUrl?.importUrl"
            :headers="{ token: getToken() }"
            class="upload"
            name="file"
            title="导入"
          >
            <star-horse-icon
              title="导入"
              width="27px"
              size="18px"
              icon-class="excel-upload"
            />
          </el-upload>
        </li>
        <li v-else @click="item.funcName(item.authority)" :title="item.btnName">
          <star-horse-icon
            :icon-class="item.icon || 'edit'"
            :title="item.btnName"
            size="18px"
            width="27px"
            :color="
              item.authority == 'delete' || item.authority == 'batchDelete'
                ? '#f56c6c'
                : 'var(--star-horse-style)'
            "
          />
          <help :message="item.helpMsg" v-if="item.helpMsg" />
        </li>
      </template>
    </template>
  </ul>
  <el-menu
    mode="horizontal"
    :ellipsis="false"
    v-if="showType == 'dropdown' && Object.keys(permissions || {}).length > 0"
  >
    <el-sub-menu index="1">
      <template #title>
        <el-tooltip content="操作" placement="top">
          <star-horse-icon
            icon-class="operation"
            size="16px"
            cursor="pointer"
          />
        </el-tooltip>
      </template>
      <template v-for="(item, index) in buttonList" :key="compKey(item, index)">
        <template v-if="item.children?.length > 0">
          <el-sub-menu :index="'2-' + index" v-if="permissions[item.authority]">
            <template #title>
              {{ item.btnName }}
            </template>
            <template
              v-for="(sitem, sindex) in item.children"
              :key="compKey(sitem, sindex)"
            >
              <el-menu-item
                :index="'3-' + index + '-' + sindex"
                @click="sitem.funcName(sitem.authority)"
                v-if="permissions[sitem.authority]"
              >
                <star-horse-icon
                  :icon-class="item.icon || 'edit'"
                  :color="
                    item.authority == 'delete' ||
                    item.authority == 'batchDelete'
                      ? 'var(--el-style-danger)'
                      : 'var(--star-horse-style)'
                  "
                  size="14px"
                />
                {{ sitem.btnName }}
                <help :message="sitem.helpMsg" v-if="sitem.helpMsg" />
              </el-menu-item>
            </template>
          </el-sub-menu>
        </template>
        <template v-else>
          <el-menu-item
            :index="'1-' + index"
            v-if="permissions[item.authority]"
          >
            <el-upload
              :auto-upload="true"
              :on-change="upload"
              :on-error="uploadError"
              :on-progress="uploadProcess"
              :on-success="uploadSuccess"
              :show-file-list="false"
              accept=".xls,.xlsx"
              :before-upload="beforeUpload"
              :action="compUrl?.importUrl"
              :headers="{ token: getToken() }"
              class="upload flex items-center w-[100%]"
              name="file"
              v-if="item.authority == 'upload'"
            >
              <div class="flex items-center w-[100%]">
                <star-horse-icon icon-class="excel-upload" size="14px" />
                {{ item.btnName }}
              </div>
            </el-upload>
            <div
              class="flex items-center w-[100%]"
              @click="item.funcName(item.authority)"
              v-else
            >
              <star-horse-icon
                :icon-class="item.icon || 'edit'"
                :color="
                  item.authority == 'delete' || item.authority == 'batchDelete'
                    ? 'var(--el-color-danger)'
                    : 'var(--star-horse-style)'
                "
                size="14px"
              />
              {{ item.btnName }}
              <help :message="item.helpMsg" v-if="item.helpMsg" />
            </div>
          </el-menu-item>
        </template>
      </template>
    </el-sub-menu>
  </el-menu>
</template>
<style lang="scss" scoped>
:deep(.el-tooltip__trigger:focus-visible) {
  outline: unset;
}

.el-menu {
  background: none;
  border-bottom: none;
}

:deep(.el-sub-menu) {
  background: none;
}

.el-menu--horizontal {
  height: 30px;
}
</style>
