<template>
  <star-horse-dialog
      :title="field.preps['label'] + 'JSON数组编辑'"
      :self-func="true"
      :dialog-visible="dialogInputVisible"
      @merge="selectItem"
      @resetForm="resetForm"
      @closeAction="closeAction"
  >
    <star-horse-json-editor v-if="field.preps['devType'] == 'Y'" v-model:modelValue="jsonArray" style="height: 100vh"/>
    <star-horse-form v-else :field-list="jsonTableField" ref="jsonFormRef"/>
  </star-horse-dialog>
  <starhorse-form-item
      :isDesign="context.attrs['isDesign']"
      :disabled="context.attrs['disabled']"
      :bareFlag="context.attrs['bareFlag']"
      :form-item="field"
      :parentField="parentField"
  >
    <div class="json-comp">
      <div class="json-box">
        <el-input
            :fid="field.preps['name']"
            :clearable="field.preps['clearable'] == 'Y'"
            :disabled="checkIsDisabled(context)"
            :max="field.preps['max']"
            :maxlength="field.preps['maxlength']"
            :min="field.preps['min']"
            :minlength="field.preps['minlength']"
            :placeholder="field.preps['placeholder'] || '请输入' + field.preps['label']"
            :readonly="field.preps['readonly'] == 'Y'"
            :rows="field.preps['rows'] || 3"
            :show-word-limit="field.preps['showWordLimit'] == 'Y'"
            :size="context.attrs.formInfo?.size || field?.preps['size'] || 'default'"
            type="textarea"
            resize="none"
            @change="itemAction('change')"
            @input="itemAction('input')"
            @normal="itemAction('enter')"
            @focus="itemAction('focus')"
            @blur="itemAction('blur')"
            v-model="context.attrs['formData'][field.preps['name']]"
        />
      </div>
      <div class="json-btn"  @click="editJsonData" title="编辑数据">
        <star-horse-icon icon-class="edit" style="cursor: pointer"/>
      </div>
    </div>
  </starhorse-form-item>
</template>
<script lang="ts">
import {defineComponent, nextTick, onMounted, reactive, shallowRef} from "vue";
import StarHorseIcon from "@/components/comp/StarHorseIcon.vue";
import {PageFieldInfo} from "@/components/types/PageFieldInfo";
import StarHorseForm from "@/components/comp/StarHorseForm.vue";
import {allAction, checkIsDisabled} from "@/components/formcomp/utils/ItemRelationEventUtils.ts";
import StarHorseJsonEditor from "@/components/comp/StarHorseJsonEditor.vue";

export default defineComponent({
  components: {StarHorseJsonEditor, StarHorseForm, StarHorseIcon},
  methods: {checkIsDisabled},
  setup(_props, context) {
    const parentField = context.attrs["parentField"];
    const field = context.attrs["field"] as any;
    let formItem = shallowRef({label: "input", required: false});
    let dataField = shallowRef("");
    let dialogInputVisible = shallowRef<boolean>(false);
    let jsonFormRef = shallowRef();
    let jsonArray = shallowRef<Array<any>>([]);
    let jsonTableField = reactive<PageFieldInfo>({
      batchFieldList: [
        {
          batchName: "jsonDatas",
          fieldList: [
            {
              label: "Name/名称",
              fieldName: "name",
              type: "input",
              required: true,
              formVisible: true
            },
            {
              label: "Value/值",
              fieldName: "value",
              type: "input",
              required: true,
              formVisible: true
            }
          ]
        }
      ]
    });
    const dynamicFunction = (data: any) => {
      if (!data) {
        return;
      }
      let fun = new Function(data);
      fun();
    };
    let actionName = shallowRef("normal");
    const itemAction = (prep: any) => {
      allAction(context, prep);
    };
    const editJsonData = async () => {
      let jsonStr = context.attrs["formData"][field.preps["name"]];
      let formData: any = {};
      if (jsonStr) {
        formData["jsonDatas"] = JSON.parse(jsonStr);
        jsonArray.value = formData["jsonDatas"];
      }
      dialogInputVisible.value = true;
      await nextTick();
      if (field.preps["devType"] != "Y") {
        jsonFormRef.value.setFormData(formData);
      }
    };
    const selectItem = async () => {
      if (field.preps["devType"] == "Y") {
        context.attrs["formData"][field.preps["name"]] = JSON.stringify(jsonArray.value, null, 4);
      } else {
        let flag = false;
        await jsonFormRef.value.$refs.starHorseFormRef.validate((res: boolean) => {
          flag = res;
        });
        if (!flag) {
          return;
        }
        let formData = jsonFormRef.value.getFormData().value;
        let dataList = formData["jsonDatas"];
        context.attrs["formData"][field.preps["name"]] = JSON.stringify(dataList, null, 4);
      }
      closeAction();
    };
    const resetForm = () => {
      jsonFormRef.value.setFormData({jsonDatas: [{}]});
    };
    const closeAction = () => {
      dialogInputVisible.value = false;
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
      dynamicFunction,
      itemAction,
      actionName,
      jsonArray,
      dialogInputVisible,
      selectItem,
      closeAction,
      editJsonData,
      resetForm,
      jsonTableField,
      jsonFormRef
    };
  }
});
</script>
<style lang="scss" scoped>
.json-comp {
  width: 100%;
  display: flex;
  align-items: center;

  .json-box {
    flex: 1;
    margin-right: 5px;

    :deep(.el-input) {
      height: 60px !important;
    }
  }

  .json-btn {
    cursor: pointer;
    border: 1px solid var(--star-horse-style);
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
  }
}
</style>
