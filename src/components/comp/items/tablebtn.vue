<script setup lang="ts">
import {nextTick, onMounted, PropType, ref} from "vue";
import {UserFuncInfo} from "@/components/types/PageFieldInfo";
import {BtnHideCondition} from "@/components/types/Params";
import {Config} from "@/api/settings.ts";

const props = defineProps({
  //按钮列表
  buttonList: {type: Array as PropType<UserFuncInfo[]>, required: true},
  //权限
  permissions: {type: Object as PropType<Permissions>, required: true},
  //数据
  row: {type: Object, required: true},
  //按钮隐藏条件
  hideBtnCondition: {type: Array as PropType<BtnHideCondition[]>, default: []},
  //按钮大小
  compSize: {type: String, default: Config.compSize},
  //按钮默认显示限制，超出按钮个数则折叠显示
  showLimit: {type: Number, default: 3}
});
let validButtonList = ref<UserFuncInfo[]|any>([]);
/**
 * 过滤掉需要隐藏的按钮
 */
const init = () => {
  let btnList: UserFuncInfo[] = props.buttonList;
  validButtonList.value = [];
  for (let i in btnList) {
    let temp: UserFuncInfo = btnList[i];
    if (btnHideCheck(temp.authority, props.row) && Object.keys(props.permissions).includes(temp.authority!)) {
      validButtonList.value.push(temp);
    }
  }
};

/**
 * 判断按钮是否需要隐藏
 * @param btn
 * @param row
 */
const btnHideCheck = (btn: string, row: any) => {
  let cond = props.hideBtnCondition;
  if (!cond || cond.length == 0) {
    return true;
  }
  let flag = false,
      hasBtn = false;
  for (let i in cond) {
    let temp = cond[i];
    if (temp.btnName.includes(btn)) {
      hasBtn = true;
      if (Array.isArray(temp.value)) {
        if (!temp.value.includes(row[temp.fieldName])) {
          flag = true;
          break;
        }
      } else if (row[temp.fieldName] != temp.value) {
        flag = true;
        break;
      }
    }
  }
  return hasBtn ? flag : true;
};
onMounted(() => {
  nextTick(() => {
    init();
  });
});
</script>

<template>
  <template v-if="validButtonList.length > 3">
    <el-tooltip :content="item.btnName" v-for="item in validButtonList.slice(0, 3)">
      <star-horse-icon
          v-if="permissions[item.authority!]"
          @click="item.funcName!(row)"
          :icon-class="item.icon || 'edit'"
          style="cursor: pointer"
          :color="item.authority == 'delete' ? 'var(--el-color-danger)' : 'var(--star-horse-style)'"
      />
    </el-tooltip>
    <el-dropdown>
      <span class="el-dropdown-link">
        <star-horse-icon icon-class="ellipsis" style="color: var(--star-horse-style)"/>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
              v-for="auth in validButtonList.slice(3, validButtonList.length)"
              :v-if="permissions[auth.authority!]"
          >
            <el-button
                @click="auth.funcName(row)"
                link
                title=""
                style="cursor: pointer; color: var(--star-horse-style)"
                :size="compSize"
            >
              <star-horse-icon
                  :icon-class="auth.icon || 'edit'"
                  :color="auth.authority == 'delete' ? 'var(--el-color-danger)' : 'var(--star-horse-style)'"
              />
              {{ auth["btnName"] }}
            </el-button>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </template>
  <template v-else>
    <el-tooltip :content="item.btnName" v-for="item in validButtonList">
      <star-horse-icon
          v-if="permissions[item.authority]"
          @click="item.funcName(row)"
          :icon-class="item.icon || 'edit'"
          style="cursor: pointer"
          :color="item.authority == 'delete' ? 'var(--el-color-danger)' : 'var(--star-horse-style)'"
      />
    </el-tooltip>
  </template>
</template>

<style scoped lang="scss"></style>
