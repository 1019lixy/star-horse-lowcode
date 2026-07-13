<script setup lang="ts" name="StarHorseFormList">
import Sortable from "sortablejs";
import {i18n} from "@/lang";
import {inject, ModelRef, nextTick, onMounted, PropType, ref, ShallowReactive, watch,} from "vue";
import {ApiUrls} from "@/components/types/ApiUrls";
import StarHorseIcon from "@/components/comp/StarHorseIcon.vue";
import {rowClassName} from "@/api/star_horse_utils";
import {error, operationConfirm, success, warning} from "@/utils/message";
import {download} from "@/api/star_horse_apis";
import {getToken} from "@/utils/auth";
import Help from "@/components/help.vue";
import {compKey, uuid} from "@/api/system";
import UTableColumn from "@/components/comp/items/UTableColumn.vue";
import StarHorseForm from "@/components/comp/StarHorseForm.vue";
import {FieldInfo} from "@/components/types";
import JSON5 from "json5";
import {Sort, UploadFilled} from "@element-plus/icons-vue";

let importDialogVisible = ref<boolean>(false);
let rowDialogVisible = ref<boolean>(false);
const rowDataFormRef = ref();
const props = defineProps({
  compUrl: {type: Object as PropType<ApiUrls>},
  fieldList: {type: Object as PropType<FieldInfo[]>, required: true},
  defaultValues: {type: Object, default: {}},
  batchName: {type: String, default: "batchDataList"},
  primaryKey: {type: [String, Object] as PropType<string | any>},
  initRows: {type: Number, default: 0},
  importInfo: {type: Object as PropType<any>},
  title: {type: String, default: ""},
  helpMsg: {type: String, default: ""},
  rules: {type: Object},
  staticColumn: {type: String, default: "Y"},
  size: {type: String, default: "default"},
  source: {type: Number, default: 1},
  showCheckBox: {type: Boolean, default: false},
  selectAll: {type: Boolean, default: false},
  subFlag: {type: Boolean, default: false},
  commonFormat: {
    type: Function,
    default: () => {
    },
  },
});
const emits = defineEmits(["addRow", "removeRow", "inited"]);
const dataForm: ModelRef<any> = defineModel("dataForm");
const formFields = inject("formFields", []) as ShallowReactive<any>;
const loading = ref(null);
const starHorseFormListRef = ref(null);
const enterEvent = (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    event.preventDefault();
    mergeData("continue");
  }
};
/**
 * 添加子节点数据（支持无限级）
 * @param parentRow
 */
const addSubData = (parentRow: any) => {
  if (!parentRow.children) {
    parentRow.children = [];
  }
  const newChild: any = {
    xh: parentRow.children.length + 1,
    __nodeId: uuid(),
    __isChild: true,
  };
  if (props.staticColumn == "Y") {
    editingNodeId.value = newChild.__nodeId;
    currentRow.value = newChild;
    rowDialogVisible.value = true;
    parentRow.children.push(newChild);
    nextTick(() => {
      rowDataFormRef.value.setSource(1);
      rowDataFormRef.value.setFormData(newChild);
    });
  } else {
    const obj = JSON5.parse(JSON5.stringify(props.defaultValues || {}));
    obj["id"] = uuid();
    Object.assign(newChild, obj);
    parentRow.children.push(newChild);
  }
};
/**
 * 编辑子节点数据（支持无限级）
 * @param row
 */
const editSubData = (row: any) => {
  editingNodeId.value = row.__nodeId;
  dynamicHandleAddForm(row, "edit");
};
/**
 * 删除节点数据（支持无限级，含子节点时提示确认）
 * @param row
 */
const removeSubData = (row: any) => {
  const doRemove = () => {
    const batchArray = dataForm.value[props.batchName];
    const found = findNodeInTree(batchArray, row.__nodeId);
    if (found) {
      found.parentChildren.splice(found.index, 1);
      found.parentChildren.forEach((child: any, i: number) => {
        child.xh = i + 1;
      });
    }
  };
  if (row.children && row.children.length > 0) {
    operationConfirm("该节点包含子节点，确认一并删除？").then(() => {
      doRemove();
    });
  } else {
    doRemove();
  }
};
const handleAddDetails = (row: any, type: number) => {
  if (props.staticColumn == "Y" && type != 2) {
    document.addEventListener("keydown", enterEvent);
    dynamicHandleAddForm(row, "add");
  } else {
    dynamicHandleAddRow(row, type);
  }
};
let currentRow = ref<any>({});
let editingNodeId = ref<string | null>(null);
/**
 * 递归查找节点在树中的位置
 * @returns { parentChildren, index } 或 null
 */
const findNodeInTree = (nodes: any[], nodeId: string): { parentChildren: any[], index: number } | null => {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].__nodeId === nodeId) {
      return { parentChildren: nodes, index: i };
    }
    if (nodes[i].children && nodes[i].children.length > 0) {
      const result = findNodeInTree(nodes[i].children, nodeId);
      if (result) return result;
    }
  }
  return null;
};
/**
 * 编辑当前行的数据
 * @param row
 * @param type
 */
const dynamicHandleAddForm = async (row: any, type: string) => {
  currentRow.value = row;
  rowDialogVisible.value = true;
  if (!dataForm.value[props.batchName]) {
    dataForm.value[props.batchName] = [];
  }
  if (type == "edit") {
    row["starHorseEditing"] = "yes";
  }
  await nextTick();
  rowDataFormRef.value.setSource("edit" == type ? 2 : 1);
  rowDataFormRef.value.setFormData(row);
};
const mergeData = async (type: string) => {
  let flag = false;
  let formRef = rowDataFormRef.value.$refs.starHorseFormRef;
  await formRef.validate((res: any) => (flag = res));
  if (!flag) {
    return;
  }
  const batchArray = dataForm.value[props.batchName];
  let formData = rowDataFormRef.value.getFormData().value;
  if (editingNodeId.value) {
    // 子节点：递归查找并更新
    const found = findNodeInTree(batchArray, editingNodeId.value);
    if (found) {
      if (formData.starHorseEditing == "yes") {
        formData.starHorseEditing = "no";
      }
      found.parentChildren[found.index] = Object.assign({}, formData, {
        __nodeId: editingNodeId.value,
        __isChild: true,
      });
    }
    editingNodeId.value = null;
  } else if (formData.starHorseEditing == "yes") {
    //有xh表示数据编辑
    batchArray.forEach((item: any, index: number) => {
      if (item.xh == formData.xh) {
        formData.starHorseEditing = "no";
        batchArray[index] = Object.assign({}, formData);
      }
    });
  } else {
    dataForm.value[props.batchName].push(Object.assign({}, formData));
  }
  if (type == "close") {
    closeAction();
  } else {
    rowDataFormRef.value.resetForm();
  }
};
const closeAction = () => {
  rowDialogVisible.value = false;
  editingNodeId.value = null;
  document.removeEventListener("keydown", enterEvent);
};

/**
 * 动态添加行
 * @param row
 * @param type
 */
const dynamicHandleAddRow = (row: any, type: number) => {
  if (!dataForm.value[props.batchName]) {
    dataForm.value[props.batchName] = [];
  }
  if (type === 1) {
    let obj = JSON5.parse(JSON5.stringify(props.defaultValues || {}));
    obj["id"] = uuid();
    dataForm.value[props.batchName].push(obj);
    emits("addRow", row);
  } else {
    let index = row.xh - 1;
    formFields && formFields[props.batchName]?.splice(index, 1);
    dataForm.value[props.batchName].splice(index, 1);
    emits("removeRow", row);
  }
  //将事件传出去
  let fieldList = props.fieldList;
  for (let ind in fieldList) {
    let temp = fieldList[ind];
    if (typeof temp.actions == "function") {
      temp.actions(dataForm, "oper");
    }
  }
  // 修改后的滚动逻辑：
  nextTick(() => {
    const tryScroll = (attempt = 0) => {
      const tableEl = starHorseFormListRef.value?.$el;
      const scrollContainer = tableEl?.querySelector(
          ".el-table--scrollable-y .el-scrollbar__wrap",
      );
      if (scrollContainer) {
        // 仅在新行添加时滚动（type=1）
        if (type === 1) {
          scrollContainer.scrollTop =
              scrollContainer.scrollHeight - scrollContainer.clientHeight;
        }
      } else if (attempt < 3) {
        // 最多重试3次
        setTimeout(() => tryScroll(attempt + 1), 50);
      }
    };

    tryScroll();
  });
};
const getRowIdentity = (row: any) => {
  // 子节点使用 __nodeId 作为唯一key，保证无限级不冲突
  if (row.__nodeId) {
    return row.__nodeId;
  }
  return (row.xh || 0) + 1;
};
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
  if (response.code != 0) {
    warning(i18n("ui.dataAnalysisError"));
    return;
  }
  success(i18n("ui.importSuccess"));
  dataForm.value[props.batchName] = response.data;
  importDialogVisible.value = false;
};
let currentItem = ref<any>({});
const selectData = (item: any) => {
  currentItem.value = item.row;
};
const moveColumn = () => {
  const tableEl = starHorseFormListRef.value?.$el;
  const tbody = tableEl?.querySelector(".el-table__body tbody");
  if (tbody) {
    // 强制清除旧实例
    const oldInstance = Sortable.get(tbody);
    oldInstance?.destroy();
    Sortable.create(tbody, {
      handle: ".move",
      animation: 200,
      ghostClass: "ghost",
      forceFallback: true,
      onStart: () => {
        tbody.style.cursor = "move"; // 拖动时改变光标
      },
      onEnd(event: any) {
        const {oldIndex, newIndex} = event;
        if (oldIndex === newIndex) {
          return;
        }
        // 新增数据交换逻辑
        const data: any = dataForm.value[props.batchName];
        const movedItem = data.splice(oldIndex, 1)[0];
        data.splice(newIndex, 0, movedItem);
        // 新增序号同步逻辑
        data.forEach((item: any, index: number) => {
          item.xh = index + 1; // 更新序号
          if (formFields && formFields[props.batchName]) {
            const fieldItem = formFields[props.batchName][index];
            if (fieldItem) fieldItem.xh = index + 1; // 同步更新表单字段
          }
        });
      },
    });
  }
};
const clearAll = () => {
  if (
      !dataForm.value[props.batchName] ||
      dataForm.value[props.batchName]?.length == 0
  ) {
    return;
  }
  operationConfirm(i18n("ui.confirm")).then(() => {
    dataForm.value[props.batchName] = [];
  });
};
const init = async () => {
  // console.log(Object.keys(dataForm.value), props.batchName);
  if (!Object.keys(dataForm.value).includes(props.batchName)) {
    dataForm.value[props.batchName] = [];
  }
  /**
   * 如果列表为空的情况才初始化行数
   */
  if (props.staticColumn == "N") {
    if (dataForm.value[props.batchName]?.length == 0) {
      for (let i = 0; i < props.initRows; i++) {
        handleAddDetails(null, 1);
      }
    }
  }
  moveColumn();
  await nextTick();
  emits("inited");
};
onMounted(async () => {
  await init();
});
watch(
    () => dataForm.value[props.batchName],
    (val) => {
      if (val && val.length > 0 && props.showCheckBox && props.selectAll) {
        nextTick(() => {
          // 改用原生全选方法
          starHorseFormListRef.value?.toggleAllSelection(true);
        });
      }
    },
    {
      immediate: false,
      deep: true,
    },
);
</script>
<template>
  <star-horse-dialog
      :title="i18n('dialog.editTitle')"
      :dialogVisible="rowDialogVisible"
      :boxWidth="'50%'"
      :is-show-btn-continue="true"
      :selfFunc="true"
      @merge="mergeData"
      @closeAction="closeAction"
  >
    <star-horse-form
        :fieldList="{ fieldList: fieldList }"
        ref="rowDataFormRef"
    />
  </star-horse-dialog>
  <star-horse-dialog
      v-if="!subFlag"
      :title="i18n('ui.importFile')"
      :dialogVisible="importDialogVisible"
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
          :action="importInfo?.importDataUrl"
          :headers="{ token: getToken() }"
          class="upload"
          name="file"
          drag
      >
        <el-icon class="el-icon--upload">
          <upload-filled/>
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
                :size="size"
                link
                v-if="importInfo?.downloadTemplateUrl"
            >
              <star-horse-icon
                  icon-class="download"
                  color="var(--star-horse-white)"
                  size="12px"
              />
              <el-tooltip :content="i18n('ui.downloadTemplate')"
              >{{ i18n("ui.downloadTemplate") }}
              </el-tooltip>
            </el-button>
          </div>
        </template>
      </el-upload>
    </el-card>
  </star-horse-dialog>
  <div class="form-list">
    <div class="dynamic-tools">
      <div class="flex items-center" v-if="!subFlag">
        <star-horse-icon icon-class="config" size="14px"/>
        {{ title }}
        <help v-if="helpMsg" :message="helpMsg" :width="400"/>
      </div>
      <div class="flex items-center">
        <ul class="inner_button" v-if="source != 3">
          <li
              v-if="importInfo?.importDataUrl && !subFlag"
              @click="excelOperation"
          >
            <el-tooltip :content="i18n('ui.importExcel')">
              <star-horse-icon
                  icon-class="upload"
                  color="var(--star-horse-style)"
                  size="18px"
              />
            </el-tooltip>
          </li>
          <li @click="clearAll">
            <el-tooltip :content="i18n('ui.clearList')">
              <star-horse-icon
                  icon-class="dustbin"
                  color="var(--el-color-danger)"
                  size="18px"
              />
            </el-tooltip>
          </li>
        </ul>
      </div>
    </div>
    <el-table
        v-loading="loading"
        :data="dataForm[batchName]"
        fit
        border
        sortable
        :size="size"
        :strip="true"
        :row-key="getRowIdentity"
        :highlight-current-row="true"
        :row-class-name="rowClassName"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        ref="starHorseFormListRef"
        class="sh-columns"
        :stripe="true"
        :virtual="true"
        max-height="400px"
        :virtual-scroll-threshold="10"
        :virtual-scroll-options="{
        scrollSensitivity: 60,
        scrollDebounce: 20,
      }"
        :use-virtual="dataForm[batchName]?.length > 10"
        :header-cell-style="{
        background: '#f2f2f2',
        color: '#707070',
        'font-size': '12px',
        'background-image':
          '-webkit-gradient(linear,left 0,left 100%,from(#f8f8f8),to(#ececec))',
      }"
        :cell-style="{ 'font-size': '12px' }"
    >
      <el-table-column
          type="selection"
          fixed="left"
          width="50"
          align="center"
          v-if="showCheckBox"
      />
      <el-table-column
          :label="i18n('ui.serialNumber')"
          align="center"
          prop="xh"
          width="50"
      />
      <el-table-column prop="" :label="i18n('ui.sort')" width="60">
        <template #default="scope">
          <el-tag
              class="move"
              style="cursor: move"
              @mousedown="selectData(scope)"
          >
            <el-icon style="cursor: move">
              <Sort/>
            </el-icon>
          </el-tag>
        </template>
      </el-table-column>
      <template v-for="(item, key) in fieldList" :key="compKey(item, key)">
        <template v-if="Array.isArray(item)">
          <template v-for="(temp, skey) in item">
            <UTableColumn
                :item="temp"
                :key="compKey(temp, skey)"
                v-if="temp.listVisible || temp.formVisible"
                :size="size"
                :commonFormat="commonFormat"
                :rules="rules"
                :source="source"
                :batchName="batchName"
                :primaryKey="primaryKey"
                :staticColumn="staticColumn"
            />
          </template>
        </template>
        <template v-else-if="item.listVisible || item.formVisible">
          <UTableColumn
              :item="item"
              :size="size"
              :rules="rules"
              :source="source"
              :commonFormat="commonFormat"
              :batchName="batchName"
              :primaryKey="primaryKey"
              :staticColumn="staticColumn"
          />
        </template>
      </template>
      <el-table-column
          fixed="right"
          :label="i18n('table.operation')"
          width="100"
      >
        <template #default="scope" v-if="source != 3">
          <star-horse-icon
              icon-class="edit"
              v-if="staticColumn == 'Y'"
              @click="scope.row.__isChild ? editSubData(scope.row) : dynamicHandleAddForm(scope.row, 'edit')"
              :title="i18n('ui.edit')"
          />
          <star-horse-icon
              icon-class="add"
              v-if="staticColumn == 'Y'"
              @click="addSubData(scope.row)"
              :title="i18n('ui.addSubData')"
          />
          <star-horse-icon
              icon-class="delete"
              @click="scope.row.__isChild ? removeSubData(scope.row) : handleAddDetails(scope.row, 2)"
              :title="i18n('ui.deleteRow')"
              color="var(--el-color-danger)"
          />
        </template>
      </el-table-column>
    </el-table>
    <div class="add-row" v-if="source != 3" @click="handleAddDetails(null, 1)">
      <star-horse-icon icon-class="plus" color="var(--star-horse-style)"/>
      {{ staticColumn == "Y" ? i18n("ui.addData") : i18n("ui.addRow") }}
    </div>
  </div>
</template>
<style lang="scss" scoped>
:deep(.el-table__cell) {
  padding: 0;
}

:deep(.cell) {
  display: flex;
}

.dynamic-tools {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  height: 30px;
  border-bottom: var(--star-horse-style) 1px solid;
}

.form-list {
  display: flex;
  flex-direction: column;
  width: 99%;
  margin: 0 auto;
  flex: 1;
  height: 100%;
  overflow: hidden;

  .inner_button {
    height: unset;
  }

  .el-table {
    flex: 1;
    min-height: 100px;
  }
}

:deep(th.el-table__cell:first-child) {
  padding: 5px 0;
}

:deep(.el-form-item) {
  font-size: 11px;
  /* margin-bottom: 1px;*/
}

:deep(.el-input__inner),
:deep(el-select) {
  height: 25px;
  font-size: 12px;
}

:deep(.el-select) {
  line-height: 25px;
}
</style>
