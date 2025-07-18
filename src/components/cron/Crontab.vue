<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from "vue";
import CrontabSecond from "@/components/cron/Crontab-Second.vue";
import CrontabMin from "@/components/cron/Crontab-Min.vue";
import CrontabHour from "@/components/cron/Crontab-Hour.vue";
import CrontabDay from "@/components/cron/Crontab-Day.vue";
import Crontabmonth from "@/components/cron/Crontab-Month.vue";
import CrontabWeek from "@/components/cron/Crontab-Week.vue";
import CrontabYear from "@/components/cron/Crontab-Year.vue";
import { useVModel } from "@vueuse/core";
import { copyText } from "@/api/system";

defineOptions({
  name: "Crontab",
});

export interface Crontab {
  expression?: string;
  modelValue: string;
  hideComponent?: any;
}

const props = withDefaults(defineProps<Crontab>(), {});
const emits = defineEmits(["update:modelValue"]);
let dataValue = useVModel(props, "modelValue", emits);
let tabTitles = ref<Array<string>>([
  "秒",
  "分钟",
  "小时",
  "日",
  "月",
  "周",
  "年",
]);
let tabActive = ref<string>("0");
const cronsecond = ref();
const cronmin = ref();
const cronhour = ref();
const cronday = ref();
const cronmonth = ref();
const cronweek = ref();
const cronyear = ref();
const prototypeCron = ["0 0 0 0 0 *", "* * * * * ? *", "* * * * * ?"];
let contabValueObj = ref<any>({
  second: "*",
  min: "*",
  hour: "*",
  day: "*",
  month: "*",
  week: "?",
  year: "",
});
let contabValueString = ref<string>("");
const contabValueStringFun = () => {
  let obj = contabValueObj.value;
  let val =
    obj.second +
    " " +
    obj.min +
    " " +
    obj.hour +
    " " +
    obj.day +
    " " +
    obj.month +
    " " +
    obj.week +
    (obj.year == "" ? "" : " " + obj.year);
  contabValueString.value = val;
  if (!prototypeCron.includes(val)) {
    emits("update:modelValue", val);
  }
};
const shouldHide = (key: any) => {
  return !(props.hideComponent && props.hideComponent.includes(key));
};
const resolveExp = () => {
  //反解析 表达式
  if (dataValue.value) {
    let arr = dataValue.value.split(" ");
    // debugger;
    if (arr.length >= 6) {
      //6 位以上是合法表达式
      let obj: any = {
        second: arr[0],
        min: arr[1],
        hour: arr[2],
        day: arr[3],
        month: arr[4],
        week: arr[5],
        year: arr[6] ? arr[6] : "",
      };

      contabValueObj.value = obj;
      for (let i in obj) {
        if (obj[i]) {
          changeRadio(i, obj[i]);
        }
      }
    }
  } else {
    //没有传入的表达式 则还原
    clearCron();
  }
};

// 由子组件触发，更改表达式组成的字段值
const updateContabValue = (name: string, value: any, from: any) => {
  contabValueObj.value[name] = value;
  if (from && from !== name) {
    changeRadio(name, value);
  }
};
const getRefObj = (name: string) => {
  if (name == "cronsecond") {
    return cronsecond;
  } else if (name == "cronmin") {
    return cronmin;
  } else if (name == "cronhour") {
    return cronhour;
  } else if (name == "cronday") {
    return cronday;
  } else if (name == "cronmonth") {
    return cronmonth;
  } else if (name == "cronweek") {
    return cronweek;
  } else {
    return cronyear;
  }
};

const parseCheckList = (refObj: any, value: string) => {
  let numStrs = value?.split(",");
  if (numStrs?.length > 0) {
    let arr = [];
    for (let i = 0; i < numStrs.length; i++) {
      arr.push(parseInt(numStrs[i]));
    }
    refObj.value.checkboxList = arr;
  } else {
    refObj.value.checkboxList = [];
  }
};
//赋值到组件
const changeRadio = async (name: string, value: string) => {
  let arr = ["second", "min", "hour", "month"],
    refName = "cron" + name,
    insValue;
  let refObj = getRefObj(refName);
  await nextTick();
  if (arr.includes(name)) {
    if (value === "*") {
      insValue = 1;
    } else if (value.indexOf("-") > -1) {
      let indexArr: Array<any> = value.split("-");
      isNaN(indexArr[0])
        ? (refObj.value.cycle01 = 0)
        : (refObj.value.cycle01 = indexArr[0]);
      refObj.value.cycle02 = indexArr[1];
      insValue = 2;
    } else if (value.indexOf("/") > -1) {
      let indexArr: Array<any> = value.split("/");
      isNaN(indexArr[0])
        ? (refObj.value.average01 = 0)
        : (refObj.value.average01 = indexArr[0]);
      refObj.value.average02 = indexArr[1];
      insValue = 3;
    } else {
      if (name == "month" && value == "0") {
        insValue = 1;
      } else {
        insValue = 4;
        parseCheckList(refObj, value);
      }
    }
  } else if (name == "day") {
    if (value === "*") {
      insValue = 1;
    } else if (value == "?") {
      insValue = 2;
    } else if (value.indexOf("-") > -1) {
      let indexArr: Array<any> = value.split("-");
      isNaN(indexArr[0])
        ? (refObj.value.cycle01 = 0)
        : (refObj.value.cycle01 = parseInt(indexArr[0]));
      refObj.value.cycle02 = parseInt(indexArr[1]);
      insValue = 3;
    } else if (value.indexOf("/") > -1) {
      let indexArr: Array<any> = value.split("/");
      isNaN(indexArr[0])
        ? (refObj.value.average01 = 0)
        : (refObj.value.average01 = parseInt(indexArr[0]));
      refObj.value.average02 = parseInt(indexArr[1]);
      insValue = 4;
    } else if (value.indexOf("W") > -1) {
      let indexArr: Array<any> = value.split("W");
      isNaN(indexArr[0])
        ? (refObj.value.workday = 0)
        : (refObj.value.workday = parseInt(indexArr[0]));
      insValue = 5;
    } else if (value === "L") {
      insValue = 6;
    } else {
      insValue = 7;
      parseCheckList(refObj, value);
    }
  } else if (name == "week") {
    if (value === "*") {
      insValue = 1;
    } else if (value == "?") {
      insValue = 2;
    } else if (value.indexOf("-") > -1) {
      let indexArr: Array<any> = value.split("-");
      isNaN(indexArr[0])
        ? (refObj.value.cycle01 = 0)
        : (refObj.value.cycle01 = parseInt(indexArr[0]));
      refObj.value.cycle02 = parseInt(indexArr[1]);
      insValue = 3;
    } else if (value.indexOf("#") > -1) {
      let indexArr: Array<any> = value.split("#");
      isNaN(indexArr[0])
        ? (refObj.value.average01 = 1)
        : (refObj.value.average01 = parseInt(indexArr[0]));
      refObj.value.average02 = parseInt(indexArr[1]);
      insValue = 4;
    } else if (value.indexOf("L") > -1) {
      let indexArr: Array<any> = value.split("L");
      isNaN(indexArr[0])
        ? (refObj.value.weekday = 1)
        : (refObj.value.weekday = parseInt(indexArr[0]));
      insValue = 5;
    } else {
      insValue = 7;
      parseCheckList(refObj, value);
    }
  } else if (name == "year") {
    if (value == "") {
      insValue = 1;
    } else if (value == "*") {
      insValue = 2;
    } else if (value.indexOf("-") > -1) {
      insValue = 3;
    } else if (value.indexOf("/") > -1) {
      insValue = 4;
    } else {
      insValue = 5;
      parseCheckList(refObj, value);
    }
  }
  refObj.value.radioValue = insValue;
};
// 表单选项的子组件校验数字格式（通过-props传递）
const checkNumber = (value: number, minLimit: number, maxLimit: number) => {
  //检查必须为整数
  value = Math.floor(value);
  if (value < minLimit) {
    value = minLimit;
  } else if (value > maxLimit) {
    value = maxLimit;
  }
  return value;
};

const clearCron = () => {
  // 还原选择项
  contabValueObj.value = {
    second: "*",
    min: "*",
    hour: "*",
    day: "*",
    month: "*",
    week: "?",
    year: "",
  };
  for (let j in contabValueObj.value) {
    changeRadio(j, contabValueObj.value[j]);
  }
};
onMounted(() => {
  resolveExp();
});
watch(
  () => contabValueObj.value,
  () => {
    contabValueStringFun();
  },
  { immediate: false, deep: true },
);
defineExpose({
  clearCron,
  resolveExp,
});
</script>
<template>
  <div class="flex flex-col h-full">
    <div class="flex-grow-1 flex-1 overflow-auto min-h-0">
      <el-tabs type="border-card" v-model="tabActive">
        <el-tab-pane label="秒" name="0" v-if="shouldHide('second')">
          <CrontabSecond
            @update="updateContabValue"
            :cron="contabValueObj"
            :check="checkNumber"
            ref="cronsecond"
          />
        </el-tab-pane>
        <el-tab-pane label="分钟" name="1" v-if="shouldHide('min')">
          <CrontabMin
            @update="updateContabValue"
            :check="checkNumber"
            :cron="contabValueObj"
            ref="cronmin"
          />
        </el-tab-pane>
        <el-tab-pane label="小时" name="2" v-if="shouldHide('hour')">
          <CrontabHour
            @update="updateContabValue"
            :check="checkNumber"
            :cron="contabValueObj"
            ref="cronhour"
          />
        </el-tab-pane>
        <el-tab-pane label="日" name="3" v-if="shouldHide('day')">
          <CrontabDay
            @update="updateContabValue"
            :check="checkNumber"
            :cron="contabValueObj"
            ref="cronday"
          />
        </el-tab-pane>
        <el-tab-pane label="月" name="4" v-if="shouldHide('month')">
          <Crontabmonth
            @update="updateContabValue"
            :check="checkNumber"
            :cron="contabValueObj"
            ref="cronmonth"
          />
        </el-tab-pane>
        <el-tab-pane label="周" name="5" v-if="shouldHide('week')">
          <CrontabWeek
            @update="updateContabValue"
            :check="checkNumber"
            :cron="contabValueObj"
            ref="cronweek"
          />
        </el-tab-pane>
        <el-tab-pane label="年" name="6" v-if="shouldHide('year')">
          <CrontabYear
            @update="updateContabValue"
            :check="checkNumber"
            :cron="contabValueObj"
            ref="cronyear"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="popup-main">
      <div class="popup-result">
        <p class="title">时间表达式</p>
        <table>
          <thead>
            <tr>
              <th v-for="item of tabTitles" width="40" :key="item">
                {{ item }}
              </th>
              <th>crontab完整表达式</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <el-tag>{{ contabValueObj.second }}</el-tag>
              </td>
              <td>
                <el-tag>{{ contabValueObj.min }}</el-tag>
              </td>
              <td>
                <el-tag>{{ contabValueObj.hour }}</el-tag>
              </td>
              <td>
                <el-tag>{{ contabValueObj.day }}</el-tag>
              </td>
              <td>
                <el-tag>{{ contabValueObj.month }}</el-tag>
              </td>
              <td>
                <el-tag>{{ contabValueObj.week }}</el-tag>
              </td>
              <td>
                <el-tag>{{ contabValueObj.year }}</el-tag>
              </td>
              <td>
                <el-tag
                  style="cursor: pointer"
                  @click="copyText(contabValueString)"
                  >{{ contabValueString }}</el-tag
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <CrontabResult :ex="contabValueString" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
:deep {
  .el-tabs__content {
    padding: 5px !important;
    height: 100%;
  }

  .el-tab-pane {
    height: 100%; /* 显式设置tab面板高度为100% */
    display: flex; /* 配合flex布局撑满空间 */
    flex-direction: column;
  }
}

:deep(.el-form-item__content) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
}

.popup-main {
  background: #fff;
  width: 100%;
  font-size: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .popup-result {
    box-sizing: border-box;
    margin: 5px auto;
    line-height: 24px;
    width: 100%;
    border: 1px solid #ccc;
    font-size: 14px;

    .title {
      display: flex;
      width: 100%;
      justify-content: center;
      align-items: center;
      flex-direction: row;
      overflow: hidden;
      line-height: 34px;
      background: #f2f2f2;
    }

    table {
      text-align: center;
      width: 100%;
      margin: 0 auto;
      border-spacing: 5px; /* 新增：控制单元格间距（上下左右） */
      border-collapse: separate; /* 必须设置，否则border-spacing无效 */

      span {
        display: block;
        width: 100%;
        line-height: 30px;
        height: 30px;
        font-size: 12px;
        white-space: nowrap;
        overflow: hidden;
        border: 1px solid #e8e8e8;
      }
    }
  }
}
</style>
