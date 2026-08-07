<script setup lang="ts">
import {nextTick, onMounted, PropType, ref} from "vue";
import {UserFuncInfo} from "@/components/types/PageFieldInfo";
import {BtnHideCondition} from "@/components/types/Params";

import {compKey} from "@/api/system";
import {isMobile} from "@/api/device";
import ShMobilePicker from "@/components/formcomp/utils/ShMobilePicker.vue";

const props = defineProps({
  //按钮列表
  buttonList: {type: Array as PropType<UserFuncInfo[]>, required: true},
  //权限
  permissions: {
    type: Object as PropType<Record<string, string>>,
    required: true,
  },
  //数据
  row: {type: Object, required: true},
  //按钮隐藏条件
  hideBtnCondition: {
    type: Array as PropType<BtnHideCondition[]>,
    default: [],
  },
  //按钮大小
  compSize: {type: String, default: "default"},
  //按钮默认显示限制，超出按钮个数则折叠显示
  showLimit: {type: Number, default: 3},
});
let validButtonList = ref<UserFuncInfo[] | any>([]);
/**
 * 过滤掉需要隐藏的按钮
 */
const init = () => {
  let btnList: UserFuncInfo[] = props.buttonList;
  validButtonList.value = [];
  for (let i in btnList) {
    let temp: UserFuncInfo = btnList[i];
    if (
        btnHideCheck(temp.authority, props.row) &&
        Object.keys(props.permissions).includes(temp.authority!)
    ) {
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

// APP 端动作面板：使用轻量 ref 替代 useMobilePicker，避免随卡片行数线性膨胀
const pickerVisible = ref(false);
const placement = "bottom" as const;
const size = "auto";
const openPicker = () => {
  pickerVisible.value = true;
};
const closePicker = () => {
  pickerVisible.value = false;
};

const handleActionClick = (item: any) => {
  item.funcName?.(props.row);
  closePicker();
};

onMounted(() => {
  nextTick(() => {
    init();
  });
});
</script>

<template>
  <div
      class="flex items-center h-full w-full"
      :class="{
      'justify-end': isMobile,
    }"
  >
    <!-- PC 端：原 el-tooltip + el-dropdown 逻辑 -->
    <template v-if="!isMobile">
      <template v-if="validButtonList.length > 3">
        <el-tooltip
            :content="item.btnName"
            v-for="(item, key) in validButtonList.slice(0, 3)"
            :key="compKey(item, key)"
        >
          <star-horse-icon
              v-if="permissions[item.authority!]"
              @click="item.funcName!(row)"
              :icon-class="item.icon || 'edit'"
              style="cursor: pointer"
              :color="
              item.authority == 'delete'
                ? 'var(--el-color-danger)'
                : 'var(--star-horse-style)'
            "
          />
        </el-tooltip>
        <el-dropdown>
          <span class="el-dropdown-link">
            <star-horse-icon
                icon-class="ellipsis"
                style="color: var(--star-horse-style)"
            />
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                  v-for="(auth, key) in validButtonList.slice(
                  3,
                  validButtonList.length,
                )"
                  :key="compKey(auth, key)"
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
                      :color="
                      auth.authority == 'delete'
                        ? 'var(--el-color-danger)'
                        : 'var(--star-horse-style)'
                    "
                  />
                  {{ auth["btnName"] }}
                </el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
      <template v-else>
        <el-tooltip
            :content="item.btnName"
            v-for="(item, key) in validButtonList"
            :key="compKey(item, key)"
        >
          <star-horse-icon
              v-if="permissions[item.authority]"
              @click="item.funcName(row)"
              :icon-class="item.icon || 'edit'"
              style="cursor: pointer"
              :color="
              item.authority == 'delete'
                ? 'var(--el-color-danger)'
                : 'var(--star-horse-style)'
            "
          />
        </el-tooltip>
      </template>
    </template>

    <!-- APP 端：最多显示 2 个按钮 + "更多"触发抽屉动作面板 -->
    <template v-else>
      <template v-if="validButtonList.length > 2">
        <template v-for="(item, key) in validButtonList.slice(0, 2)" :key="compKey(item, key)">
          <star-horse-icon
              v-if="permissions[item.authority!]"
              @click="item.funcName!(row)"
              :icon-class="item.icon || 'edit'"
              style="cursor: pointer; margin-left: 8px"
              :color="
              item.authority == 'delete'
                ? 'var(--el-color-danger)'
                : 'var(--star-horse-style)'
            "
          />
        </template>
        <div class="more-btn" @click="openPicker">
          <star-horse-icon
              icon-class="ellipsis"
              style="color: var(--star-horse-style)"
          />
        </div>
      </template>
      <template v-else>
        <template v-for="(item, key) in validButtonList" :key="compKey(item, key)">
          <star-horse-icon
              v-if="permissions[item.authority]"
              @click="item.funcName(row)"
              :icon-class="item.icon || 'edit'"
              style="cursor: pointer; margin-left: 8px"
              :color="
              item.authority == 'delete'
                ? 'var(--el-color-danger)'
                : 'var(--star-horse-style)'
            "
          />
        </template>
      </template>

      <ShMobilePicker
          v-if="isMobile && pickerVisible"
          v-model="pickerVisible"
          title="更多操作"
          :placement="placement"
          :size="size"
          :show-footer="false"
      >
        <div class="mobile-action-panel">
          <template v-for="(item, key) in validButtonList" :key="compKey(item, key)">
            <div
                v-if="permissions[item.authority!]"
                class="mobile-action-panel__item"
                @click="handleActionClick(item)"
            >
              <star-horse-icon
                  :icon-class="item.icon || 'edit'"
                  :color="
                  item.authority == 'delete'
                    ? 'var(--el-color-danger)'
                    : 'var(--star-horse-style)'
                "
                  class="mobile-action-panel__icon"
              />
              <span class="mobile-action-panel__label">{{ item.btnName }}</span>
            </div>
          </template>
        </div>
      </ShMobilePicker>
    </template>
  </div>
</template>

<style scoped lang="scss">
.more-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin-left: 8px;
  cursor: pointer;
  border-radius: 4px;

  &:active {
    background: var(--el-fill-color, #f5f7fa);
  }
}

.mobile-action-panel {
  display: flex;
  flex-direction: column;
  padding: 8px 0;
  height: 100%;
  overflow-y: auto;

  &__item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    cursor: pointer;
    border-bottom: 1px solid var(--el-border-color-lighter, #ebeef5);
    transition: background 0.15s;

    &:active {
      background: var(--el-fill-color, #f5f7fa);
    }

    &:last-child {
      border-bottom: none;
    }
  }

  &__icon {
    font-size: 20px !important;
    flex-shrink: 0;
  }

  &__label {
    font-size: 15px;
    color: var(--el-text-color-primary, #303133);
  }
}
</style>
