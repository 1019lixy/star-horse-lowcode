<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { FieldInfo, PageFieldInfo } from "@/components/types/PageFieldInfo";
import { StarHorseForm } from "@/components/comp";

const componentTypes = [
  { name: "input", label: "输入框" },
  { name: "number", label: "数字输入框" },
  { name: "textarea", label: "文本域" },
  { name: "password", label: "密码框" },
  { name: "select", label: "下拉选择" },
  { name: "tselect", label: "树形下拉" },
  { name: "radio", label: "单选框" },
  { name: "checkbox", label: "复选框" },
  { name: "switch", label: "开关" },
  { name: "slider", label: "滑块" },
  { name: "rate", label: "评分" },
  /* { name: "date", label: "日期" },*/
  { name: "datetime", label: "日期时间" },
  { name: "time", label: "时间" },
  { name: "time-picker", label: "时间选择器" },
  { name: "datapicker", label: "数据选择" },
  { name: "number-range", label: "数字范围" },
  { name: "color", label: "颜色选择" },
  { name: "icon", label: "图标选择" },
  { name: "upload", label: "文件上传" },
  { name: "image", label: "图片" },
  { name: "audio", label: "音频" },
  { name: "signature", label: "签名" },
  { name: "qrcode", label: "二维码" },
  { name: "barcode", label: "条形码" },
  { name: "htmleditor", label: "富文本编辑器" },
  { name: "markdown", label: "Markdown编辑器" },
  { name: "json", label: "JSON编辑器" },
  { name: "json-array", label: "JSON数组编辑器" },
  { name: "cron", label: "Cron表达式" },
  { name: "cascade", label: "级联选择" },
  { name: "transfer", label: "穿梭框" },
  { name: "autocomplete", label: "自动完成" },
  { name: "tag", label: "标签" },
  { name: "button", label: "按钮" },
  { name: "divider", label: "分割线" },
  { name: "text", label: "文本" },
  { name: "html", label: "HTML" },
  { name: "dialog", label: "模态框" },
  { name: "drawer", label: "抽屉" },
  { name: "dialog-input", label: "对话框输入" },
  { name: "user", label: "用户选择" },
  { name: "depart", label: "部门选择" },
  { name: "page-select", label: "页面选择" },
  { name: "area", label: "地区选择" },
  { name: "usercomp", label: "自定义组件" },
  { name: "input-tag", label: "标签输入组件" },
];

const selectedType = ref<string>("");
const currentField = ref<FieldInfo | null>(null);
const testFormRef = ref();
const searchKeyword = ref("");

const filteredComponents = computed(() => {
  if (!searchKeyword.value) {
    return componentTypes;
  }
  const keyword = searchKeyword.value.toLowerCase();
  return componentTypes.filter(
    (comp) =>
      comp.label.toLowerCase().includes(keyword) ||
      comp.name.toLowerCase().includes(keyword),
  );
});

const fieldList = ref<PageFieldInfo>({
  fieldList: [],
});

const newPropKey = ref("");
const newPropType = ref<"string" | "number" | "boolean" | "array" | "object">(
  "string",
);
const newPropValue = ref("");

const arrayItemValue = ref("");
const arrayItems = ref<any[]>([]);
const arrayItemType = ref<"string" | "object">("string");
const arrayObjectKey = ref("");
const arrayObjectValue = ref("");
const currentArrayObject = ref<Record<string, string>>({});

const objectKey = ref("");
const objectValue = ref("");
const objectItems = ref<Record<string, string>>({});

const selectComponent = (type: string) => {
  selectedType.value = type;
  const label = componentTypes.find((c) => c.name === type)?.label || type;

  currentField.value = {
    label: label,
    type: type,
    fieldName: "testField",
    formVisible: true,
    preps: {},
  };

  fieldList.value = {
    fieldList: [currentField.value],
  };

  resetNewProp();
  formDataDisplay.value = "{}";

  nextTick(() => {
    updateFormDataDisplay();
  });
};

const resetNewProp = () => {
  newPropKey.value = "";
  newPropType.value = "string";
  newPropValue.value = "";
  arrayItems.value = [];
  arrayItemType.value = "string";
  arrayObjectKey.value = "";
  arrayObjectValue.value = "";
  currentArrayObject.value = {};
  objectItems.value = {};
};

const addProperty = () => {
  if (!currentField.value || !newPropKey.value) return;

  if (!currentField.value.preps) {
    currentField.value.preps = {};
  }

  let value: any;
  switch (newPropType.value) {
    case "string":
      value = newPropValue.value;
      break;
    case "number":
      value = Number(newPropValue.value) || 0;
      break;
    case "boolean":
      value = newPropValue.value === "true";
      break;
    case "array":
    case "object":
      value = JSON.parse(currentArrayObject.value["currentObject"]);
      // currentField.value.preps = { ...currentField.value.preps, ...value };
      break;
  }
  // let value: any=JSON.parse(currentArrayObject.value["currentObject"]);
  // if (newPropType.value !== "object" && newPropType.value !== "array") {
  currentField.value.preps[newPropKey.value] = value;
  // }
  resetNewProp();
};

/*const addArrayItem = () => {
  if (arrayItemType.value === "string") {
    if (arrayItemValue.value) {
      arrayItems.value.push(arrayItemValue.value);
      arrayItemValue.value = "";
    }
  } else {
    if (Object.keys(currentArrayObject.value).length > 0) {
      arrayItems.value.push({ ...currentArrayObject.value });
      currentArrayObject.value = {};
      arrayObjectKey.value = "";
      arrayObjectValue.value = "";
    }
  }
};

const addArrayObjectField = () => {
  if (arrayObjectKey.value && arrayObjectValue.value) {
    currentArrayObject.value[arrayObjectKey.value] = arrayObjectValue.value;
    arrayObjectKey.value = "";
    arrayObjectValue.value = "";
  }
};

const removeArrayObjectField = (key: string) => {
  delete currentArrayObject.value[key];
};

const removeArrayItem = (index: number) => {
  arrayItems.value.splice(index, 1);
};

const addObjectItem = () => {
  if (objectKey.value && objectValue.value) {
    objectItems.value[objectKey.value] = objectValue.value;
    objectKey.value = "";
    objectValue.value = "";
  }
};

const removeObjectItem = (key: string) => {
  delete objectItems.value[key];
};*/

const removeProperty = (key: string) => {
  if (currentField.value?.preps) {
    delete currentField.value.preps[key];
  }
};

const formDataDisplay = ref<string>("{}");

const updateFormDataDisplay = () => {
  try {
    const rawData = testFormRef.value?.getFormData()?.value;
    if (rawData) {
      // const cleanData = JSON.parse(
      //     JSON.stringify(plainData, (key, value) => {
      //       if (typeof value === "function" || key.startsWith("_")) {
      //         return undefined;
      //       }
      //       return value;
      //     }),
      // );
      const data = {
        fieldList: fieldList.value,
        instanceData: rawData,
      };
      formDataDisplay.value = JSON.stringify(data, null, 2);
    } else {
      formDataDisplay.value = "{}";
    }
  } catch (e) {
    console.error(e);
    formDataDisplay.value = "{}";
  }
};

// const startAutoUpdate = () => {
//   if (updateTimer) {
//     clearInterval(updateTimer);
//   }
//   updateTimer = setInterval(() => {
//     updateFormDataDisplay();
//   }, 500);
// };

// const stopAutoUpdate = () => {
//   if (updateTimer) {
//     clearInterval(updateTimer);
//     updateTimer = null;
//   }
// };

onMounted(() => {
  // startAutoUpdate();
});

watch(
  () => fieldList.value.fieldList.length,
  (len) => {
    if (len > 0) {
      nextTick(() => {
        updateFormDataDisplay();
      });
    }
  },
);
watch(
  () => testFormRef.value?.getFormData()?.value,
  (val) => {
    nextTick(() => {
      updateFormDataDisplay();
    });
  },
);

const prepsEntries = computed(() => {
  if (!currentField.value?.preps) return [];
  return Object.entries(currentField.value.preps);
});
</script>

<template>
  <div class="component-tester">
    <div class="left-panel">
      <div class="panel-header">组件列表</div>
      <div class="search-container">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索组件名称或编码"
          clearable
          prefix-icon="el-icon-search"
        />
      </div>
      <div class="component-list">
        <div
          v-for="comp in filteredComponents"
          :key="comp.name"
          :class="['component-item', { active: selectedType === comp.name }]"
          @click="selectComponent(comp.name)"
        >
          {{ comp.label }}
          <span class="component-code">{{ comp.name }}</span>
        </div>
      </div>
    </div>

    <div class="center-panel">
      <div class="panel-header">
        表单预览
        <span v-if="selectedType" class="current-type">
          -
          {{ componentTypes.find((c) => c.name === selectedType)?.label }}</span
        >
      </div>
      <div class="form-container">
        <star-horse-form
          v-if="fieldList.fieldList.length > 0"
          ref="testFormRef"
          :fieldList="fieldList"
        />
        <div v-else class="empty-tip">请从左侧选择一个组件</div>
      </div>
      <div class="panel-header">
        表单数据
        <el-button style="color: #fff" link @click="updateFormDataDisplay"
          >刷新
        </el-button>
      </div>
      <div class="form-data">
        <pre>{{ formDataDisplay }}</pre>
      </div>
    </div>

    <div class="right-panel">
      <div class="panel-header">属性配置 (preps)</div>

      <div v-if="currentField" class="preps-config">
        <div class="current-preps">
          <div class="sub-header">当前属性</div>
          <div v-if="prepsEntries.length > 0" class="preps-list">
            <div
              v-for="[key, value] in prepsEntries"
              :key="key"
              class="prep-item"
            >
              <span class="prep-key">{{ key }}:</span>
              <span class="prep-value">
                <template v-if="typeof value === 'object'">
                  {{ JSON.stringify(value) }}
                </template>
                <template v-else>{{ value }}</template>
              </span>
              <el-button type="danger" @click="removeProperty(key)"
                >删除
              </el-button>
            </div>
          </div>
          <div v-else class="empty-tip">暂无属性</div>
        </div>

        <div class="add-prep">
          <div class="sub-header">添加属性</div>
          <div class="add-form">
            <el-input
              v-model="newPropKey"
              placeholder="属性名"
              class="prop-input"
            />
            <el-select v-model="newPropType" class="prop-type">
              <el-option label="字符串" value="string" />
              <el-option label="数字" value="number" />
              <el-option label="布尔" value="boolean" />
              <el-option label="数组" value="array" />
              <el-option label="对象" value="object" />
            </el-select>

            <div class="value-input">
              <template v-if="newPropType === 'string'">
                <el-input v-model="newPropValue" placeholder="字符串值" />
              </template>

              <template v-else-if="newPropType === 'number'">
                <el-input-number
                  v-model="newPropValue"
                  :controls="false"
                  placeholder="数字值"
                  style="width: 100%"
                />
              </template>

              <template v-else-if="newPropType === 'boolean'">
                <el-select v-model="newPropValue" style="width: 100%">
                  <el-option label="true" value="true" />
                  <el-option label="false" value="false" />
                </el-select>
              </template>

              <template
                v-else-if="newPropType === 'array' || newPropType === 'object'"
              >
                <div class="array-config">
                  <json-item
                    v-model:formData="currentArrayObject"
                    :field="{
                      fieldName: 'currentObject',
                      preps: {},
                    }"
                  />
                </div>
              </template>
            </div>
            <el-button type="primary" @click="addProperty">添加属性</el-button>
          </div>
        </div>

        <div class="common-preps">
          <div class="sub-header">常用属性快捷添加</div>
          <div class="quick-buttons">
            <el-button @click="currentField.preps.placeholder = '请输入...'"
              >placeholder
            </el-button>
            <el-button @click="currentField.preps.disabled = true"
              >disabled
            </el-button>
            <el-button @click="currentField.preps.clearable = true"
              >clearable
            </el-button>
            <el-button @click="currentField.preps.prefix = '前缀'"
              >prefix
            </el-button>
            <el-button @click="currentField.preps.suffix = '后缀'"
              >suffix
            </el-button>
            <el-button @click="currentField.preps.mergeAppend = true"
              >mergeAppend
            </el-button>
            <el-button @click="currentField.preps.mergePrefix = true"
              >mergePrefix
            </el-button>
            <el-button
              @click="
                currentField.preps.appendList = [
                  { name: '%', value: '%' },
                  { name: 'px', value: 'px' },
                ]
              "
              >appendList
            </el-button>
            <el-button
              @click="
                currentField.preps.prependList = [
                  { name: 'http', value: 'http' },
                  { name: 'https', value: 'https' },
                ]
              "
              >prependList
            </el-button>
          </div>
        </div>
      </div>

      <div v-else class="empty-tip">请先选择一个组件</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.component-tester {
  display: flex;
  height: 100%;
  background: #f5f7fa;
  overflow: hidden;
}

.panel-header {
  padding: 12px 16px;
  background: #409eff;
  color: white;
  font-weight: bold;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .current-type {
    font-weight: normal;
    opacity: 0.9;
  }
}

.left-panel {
  width: 200px;
  background: white;
  border-right: 1px solid #e4e7ed;
  display: flex;
  flex-direction: column;

  .search-container {
    padding: 8px 12px;
    border-bottom: 1px solid #e4e7ed;
  }

  .component-list {
    flex: 1;
    overflow-y: auto;
    padding: 8px;
  }

  .component-item {
    padding: 10px 12px;
    margin-bottom: 4px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 13px;
    transition: all 0.2s;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &:hover {
      background: #ecf5ff;
      color: #409eff;
    }

    &.active {
      background: #409eff;
      color: white;
    }

    .component-code {
      font-size: 11px;
      color: #909399;
      margin-left: 8px;
      white-space: nowrap;

      .active & {
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }
}

.center-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .form-container {
    flex: 1;
    min-height: 0;
    padding: 20px;
    background: white;
    margin: 16px;
    border-radius: 8px;
    overflow-y: auto;

    .empty-tip {
      color: #909399;
      text-align: center;
      padding: 40px;
    }
  }

  .form-data {
    flex: none;
    min-height: 150px;
    max-height: 250px;
    background: #1e1e1e;
    color: #d4d4d4;
    padding: 16px;
    margin: 0 16px 16px;
    border-radius: 8px;
    overflow: auto;

    pre {
      margin: 0;
      font-family: "Consolas", monospace;
      font-size: 12px;
    }
  }
}

.right-panel {
  width: 350px;
  background: white;
  border-left: 1px solid #e4e7ed;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .preps-config {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
  }

  .sub-header {
    font-size: 13px;
    font-weight: bold;
    color: #303133;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid #ebeef5;
  }

  .current-preps {
    margin-bottom: 20px;

    .preps-list {
      .prep-item {
        display: flex;
        align-items: center;
        padding: 8px;
        background: #f5f7fa;
        border-radius: 4px;
        margin-bottom: 8px;
        font-size: 12px;

        .prep-key {
          color: #409eff;
          font-weight: bold;
          min-width: 80px;
        }

        .prep-value {
          flex: 1;
          color: #606266;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-right: 8px;
        }
      }
    }
  }

  .add-prep {
    margin-bottom: 20px;

    .add-form {
      display: flex;
      flex-direction: column;
      gap: 12px;

      .prop-input {
        width: 100%;
      }

      .prop-type {
        width: 100%;
      }

      .value-input {
        min-height: 32px;
      }

      .array-config,
      .object-config {
        .array-type-radio {
          margin-bottom: 12px;
        }

        .array-input-row,
        .object-input-row {
          display: flex;
          gap: 8px;
          margin-bottom: 8px;

          .el-input {
            flex: 1;
          }
        }

        .array-object-config {
          .object-field-row {
            display: flex;
            gap: 8px;
            margin-bottom: 8px;

            .el-input {
              flex: 1;
            }
          }

          .current-object {
            background: #e6f7ff;
            border-radius: 4px;
            padding: 8px;
            margin-bottom: 8px;

            .current-object-label {
              font-size: 12px;
              color: #409eff;
              margin-bottom: 4px;
            }

            .object-field-item {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 4px 8px;
              background: white;
              border-radius: 4px;
              margin-bottom: 4px;
              font-size: 12px;

              &:last-child {
                margin-bottom: 0;
              }
            }
          }
        }

        .array-items-label {
          font-size: 12px;
          color: #606266;
          margin-bottom: 4px;
        }

        .array-items,
        .object-items {
          background: #f5f7fa;
          border-radius: 4px;
          padding: 8px;
          margin-top: 8px;
        }

        .array-item,
        .object-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 4px 8px;
          background: white;
          border-radius: 4px;
          margin-bottom: 4px;
          font-size: 12px;

          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
  }

  .common-preps {
    .quick-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
  }

  .empty-tip {
    color: #909399;
    text-align: center;
    padding: 40px;
  }
}
</style>
