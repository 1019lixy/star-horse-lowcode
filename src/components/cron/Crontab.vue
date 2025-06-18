<template>
  <div class="flex flex-col h-full overflow-y-auto">
    <el-tabs type="border-card" v-model="tabActive">
      <el-tab-pane label="秒" name="0" v-if="shouldHide('second')">
        <CrontabSecond @update="updateContabValue" :cron="contabValueObj" :check="checkNumber" ref="cronsecond"/>
      </el-tab-pane>
      <el-tab-pane label="分钟" name="1" v-if="shouldHide('min')">
        <CrontabMin @update="updateContabValue" :check="checkNumber" :cron="contabValueObj" ref="cronmin"/>
      </el-tab-pane>
      <el-tab-pane label="小时" name="2" v-if="shouldHide('hour')">
        <CrontabHour @update="updateContabValue" :check="checkNumber" :cron="contabValueObj" ref="cronhour"/>
      </el-tab-pane>
      <el-tab-pane label="日" name="3" v-if="shouldHide('day')">
        <CrontabDay @update="updateContabValue" :check="checkNumber" :cron="contabValueObj" ref="cronday"/>
      </el-tab-pane>
      <el-tab-pane label="月" name="4" v-if="shouldHide('month')">
        <Crontabmonth @update="updateContabValue" :check="checkNumber" :cron="contabValueObj" ref="cronmonth"/>
      </el-tab-pane>
      <el-tab-pane label="周" name="5" v-if="shouldHide('week')">
        <CrontabWeek @update="updateContabValue" :check="checkNumber" :cron="contabValueObj" ref="cronweek"/>
      </el-tab-pane>
      <el-tab-pane label="年" name="6" v-if="shouldHide('year')">
        <CrontabYear @update="updateContabValue" :check="checkNumber" :cron="contabValueObj" ref="cronyear"/>
      </el-tab-pane>
    </el-tabs>
    <div class="popup-main">
      <div class="popup-result">
        <p class="title">时间表达式</p>
        <table>
          <thead>
          <tr>
            <th v-for="item of tabTitles" width="40" :key="item">{{ item }}</th>
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
              <el-tag style="cursor: pointer" @click="copy(contabValueString)">{{ contabValueString }}</el-tag>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <CrontabResult :ex="contabValueString"/>
    </div>
  </div>
</template>
<script setup lang="ts">
import {nextTick, onMounted, ref, watch} from 'vue';
import CrontabSecond from '@/components/cron/Crontab-Second.vue';
import CrontabMin from '@/components/cron/Crontab-Min.vue';
import CrontabHour from '@/components/cron/Crontab-Hour.vue';
import CrontabDay from '@/components/cron/Crontab-Day.vue';
import Crontabmonth from '@/components/cron/Crontab-Month.vue';
import CrontabWeek from '@/components/cron/Crontab-Week.vue';
import CrontabYear from '@/components/cron/Crontab-Year.vue';
import CrontabResult from '@/components/cron/Crontab-Result.vue';
import {copy} from '@/api/star_horse_utils';
import {useVModel} from '@vueuse/core';

export interface Crontab {
  expression?: string;
  modelValue: string;
  hideComponent?: any;
}

const props = withDefaults(defineProps<Crontab>(), {});
const emits = defineEmits(['update:modelValue']);
let dataValue = useVModel(props, 'modelValue', emits);
let tabTitles = ref<Array<string>>(['秒', '分钟', '小时', '日', '月', '周', '年']);
let tabActive = ref<string>('0');
const cronsecond = ref();
const cronmin = ref();
const cronhour = ref();
const cronday = ref();
const cronmonth = ref();
const cronweek = ref();
const cronyear = ref();
const prototypeCron = ['0 0 0 0 0 *', '* * * * * ? *', '* * * * * ?'];
let contabValueObj = ref<any>({
  second: '*',
  min: '*',
  hour: '*',
  day: '*',
  month: '*',
  week: '?',
  year: ''
});
let contabValueString = ref<string>('');
const contabValueStringFun = () => {
  let obj = contabValueObj.value;
  let val =
      obj.second +
      ' ' +
      obj.min +
      ' ' +
      obj.hour +
      ' ' +
      obj.day +
      ' ' +
      obj.month +
      ' ' +
      obj.week +
      (obj.year == '' ? '' : ' ' + obj.year);
  contabValueString.value = val;
  if (!prototypeCron.includes(val)) {
    emits('update:modelValue', val);
  }
};
const shouldHide = (key: any) => {
  return !(props.hideComponent && props.hideComponent.includes(key));
};
const resolveExp = () => {
  //反解析 表达式
  if (dataValue.value) {
    let arr = dataValue.value.split(' ');
    if (arr.length >= 6) {
      //6 位以上是合法表达式
      let obj: any = {
        second: arr[0],
        min: arr[1],
        hour: arr[2],
        day: arr[3],
        month: arr[4],
        week: arr[5],
        year: arr[6] ? arr[6] : ''
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
  if (name == 'cronsecond') {
    return cronsecond;
  } else if (name == 'cronmin') {
    return cronmin;
  } else if (name == 'cronhour') {
    return cronhour;
  } else if (name == 'cronday') {
    return cronday;
  } else if (name == 'cronmonth') {
    return cronmonth;
  } else if (name == 'cronweek') {
    return cronweek;
  } else {
    return cronyear;
  }
};
//赋值到组件
const changeRadio = async (name: string, value: string) => {
  let arr = ['second', 'min', 'hour', 'month'],
      refName = 'cron' + name,
      insValue;
  let refObj = getRefObj(refName);
  await nextTick();
  if (arr.includes(name)) {
    if (value === '*') {
      insValue = 1;
    } else if (value.indexOf('-') > -1) {
      let indexArr: Array<any> = value.split('-');
      isNaN(indexArr[0]) ? (refObj.value.cycle01 = 0) : (refObj.value.cycle01 = indexArr[0]);
      refObj.value.cycle02 = indexArr[1];
      insValue = 2;
    } else if (value.indexOf('/') > -1) {
      let indexArr: Array<any> = value.split('/');
      isNaN(indexArr[0]) ? (refObj.value.average01 = 0) : (refObj.value.average01 = indexArr[0]);
      refObj.value.average02 = indexArr[1];
      insValue = 3;
    } else {
      if (name == 'month' && value == '0') {
        insValue = 1;
      } else {
        insValue = 4;
        refObj.value.checkboxList = value.split(',');
      }
    }
    console.log('insValue', name, value, insValue);
  } else if (name == 'day') {
    if (value === '*') {
      insValue = 1;
    } else if (value == '?') {
      insValue = 2;
    } else if (value.indexOf('-') > -1) {
      let indexArr: Array<any> = value.split('-');
      isNaN(indexArr[0]) ? (refObj.value.cycle01 = 0) : (refObj.value.cycle01 = indexArr[0]);
      refObj.value.cycle02 = indexArr[1];
      insValue = 3;
    } else if (value.indexOf('/') > -1) {
      let indexArr: Array<any> = value.split('/');
      isNaN(indexArr[0]) ? (refObj.value.average01 = 0) : (refObj.value.average01 = indexArr[0]);
      refObj.value.average02 = indexArr[1];
      insValue = 4;
    } else if (value.indexOf('W') > -1) {
      let indexArr: Array<any> = value.split('W');
      isNaN(indexArr[0]) ? (refObj.value.workday = 0) : (refObj.value.workday = indexArr[0]);
      insValue = 5;
    } else if (value === 'L') {
      insValue = 6;
    } else {
      refObj.value.checkboxList = value.split(',');
      insValue = 7;
    }
  } else if (name == 'week') {
    if (value === '*') {
      insValue = 1;
    } else if (value == '?') {
      insValue = 2;
    } else if (value.indexOf('-') > -1) {
      let indexArr: Array<any> = value.split('-');
      isNaN(indexArr[0]) ? (refObj.value.cycle01 = 0) : (refObj.value.cycle01 = indexArr[0]);
      refObj.value.cycle02 = indexArr[1];
      insValue = 3;
    } else if (value.indexOf('#') > -1) {
      let indexArr: Array<any> = value.split('#');
      isNaN(indexArr[0]) ? (refObj.value.average01 = 1) : (refObj.value.average01 = indexArr[0]);
      refObj.value.average02 = indexArr[1];
      insValue = 4;
    } else if (value.indexOf('L') > -1) {
      let indexArr: Array<any> = value.split('L');
      isNaN(indexArr[0]) ? (refObj.value.weekday = 1) : (refObj.value.weekday = indexArr[0]);
      insValue = 5;
    } else {
      refObj.value.checkboxList = value.split(',');
      insValue = 7;
    }
  } else if (name == 'year') {
    if (value == '') {
      insValue = 1;
    } else if (value == '*') {
      insValue = 2;
    } else if (value.indexOf('-') > -1) {
      insValue = 3;
    } else if (value.indexOf('/') > -1) {
      insValue = 4;
    } else {
      refObj.value.checkboxList = value.split(',');
      insValue = 5;
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
    second: '*',
    min: '*',
    hour: '*',
    day: '*',
    month: '*',
    week: '?',
    year: ''
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
    {immediate: false, deep: true}
);
defineExpose({
  clearCron,
  resolveExp
});
</script>
<style lang="scss" scoped>
:deep(.el-tabs__content) {
  padding: 5px !important;
}

:deep(.el-form-item__content) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
}

.popup-main {
  position: relative;
  margin: 10px auto;
  background: #fff;
  width: 100%;
  border-radius: 5px;
  font-size: 12px;
  overflow: hidden;

  .popup-title {
    overflow: hidden;
    line-height: 34px;
    padding-top: 6px;
    background: #f2f2f2;
  }

  .popup-result {
    box-sizing: border-box;
    line-height: 24px;
    margin: 25px auto;
    width: 100%;
    padding: 15px 10px 10px;
    border: 1px solid #ccc;
    position: relative;
    font-size: 14px;

    .title {
      position: absolute;
      top: -28px;
      left: 50%;
      width: 140px;
      font-size: 14px;
      margin-left: -70px;
      text-align: center;
      line-height: 30px;
      background: #fff;
    }

    table {
      text-align: center;
      width: 100%;
      margin: 0 auto;

      span {
        display: block;
        width: 100%;
        font-family: arial;
        line-height: 30px;
        height: 30px;
        font-size: 14px;
        white-space: nowrap;
        overflow: hidden;
        border: 1px solid #e8e8e8;
      }
    }

    .popup-result-scroll {
      font-size: 12px;
      line-height: 24px;
      display: flex;
      flex-direction: row;
      overflow-y: auto;
    }
  }
}
</style>
