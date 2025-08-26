<template>
  <div class="cron-content">
    <div class="cron-item">
      <el-radio size="small" v-model="radioValue" :label="1" border>
        {{ i18n("cron.day") }}{{ i18n("cron.wildcardsWithL") }}
      </el-radio>
    </div>
    <div class="cron-item">
      <el-radio size="small" v-model="radioValue" :label="2" border>
        {{ i18n("cron.notSpecified") }}
      </el-radio>
    </div>
    <div class="cron-item">
      <el-radio size="small" v-model="radioValue" :label="3" border>
        {{ i18n("cron.period") }}
      </el-radio>
      <span style="margin-left: 10px; margin-right: 5px">{{
        i18n("cron.from")
      }}</span>
      <el-input-number
        size="small"
        v-model="cycle01"
        :min="0"
        :max="31"
        controls-position="right"
      />
      <span style="margin-left: 10px; margin-right: 5px">{{
        i18n("cron.to")
      }}</span>
      <el-input-number
        size="small"
        v-model="cycle02"
        :min="0"
        :max="31"
        controls-position="right"
      />
      <span style="margin-left: 10px; margin-right: 5px">{{
        i18n("cron.day")
      }}</span>
    </div>
    <div class="cron-item">
      <el-radio size="small" v-model="radioValue" :label="4" border>
        {{ i18n("cron.loop") }}
      </el-radio>
      <span style="margin-left: 10px; margin-right: 5px">{{
        i18n("cron.from")
      }}</span>
      <el-input-number
        size="small"
        v-model="average01"
        :min="0"
        :max="31"
        controls-position="right"
      />
      <span style="margin-left: 10px; margin-right: 5px"
        >{{ i18n("cron.day") }}{{ i18n("cron.start") }}，{{
          i18n("cron.every")
        }}</span
      >
      <el-input-number
        size="small"
        v-model="average02"
        :min="0"
        :max="31"
        controls-position="right"
      />
      <span style="margin-left: 10px; margin-right: 5px"
        >{{ i18n("cron.day") }}{{ i18n("cron.executeOnce") }}</span
      >
    </div>
    <div class="cron-item">
      <el-radio size="small" v-model="radioValue" :label="5" border>
        {{ i18n("cron.workDay") }}
      </el-radio>
      <span style="margin-left: 10px; margin-right: 5px">{{
        i18n("cron.every")
      }}</span>
      <el-input-number
        size="small"
        v-model="workday"
        :min="0"
        :max="31"
        controls-position="right"
      />
      <span style="margin-left: 10px; margin-right: 5px"
        >{{ i18n("cron.day") }}{{ i18n("cron.nearestWorkDay") }}</span
      >
    </div>
    <div class="cron-item">
      <el-radio size="small" v-model="radioValue" :label="6" border>
        {{ i18n("cron.lastDayOfMonth") }}
      </el-radio>
    </div>
    <div class="cron-item">
      <el-radio size="small" v-model="radioValue" :label="7" border>
        {{ i18n("cron.specify") }}
      </el-radio>
      <el-checkbox-group size="small" v-model="checkboxList">
        <el-checkbox
          class="my-[5px]"
          :border="true"
          v-for="item in 31"
          :key="item"
          :value="item - 1"
          :label="item < 11 ? '0' + (item - 1) : item - 1"
        />
      </el-checkbox-group>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { i18n } from "@/lang";

defineOptions({
  name: "crontab-day",
});
let radioValue = ref(1);
let workday = ref(1);
let cycle01 = ref(1);
let cycle02 = ref(2);
let average01 = ref(1);
let average02 = ref(1);

let checkboxList = ref([]);
const props = defineProps({
  check: { type: Function },
  cron: { type: Object },
});

const emits = defineEmits(["update"]);
// 计算两个周期值
const cycleTotalFun = () => {
  cycle01.value = props.check?.(cycle01.value, 1, 31);
  cycle02.value = props.check?.(cycle02.value, 1, 31);
  return cycle01.value + "-" + cycle02.value;
};
// 计算平均用到的值
const averageTotalFun = () => {
  average01.value = props.check?.(average01.value, 1, 31);
  average02.value = props.check?.(average02.value, 1, 31);
  return average01.value + "/" + average02.value;
};
// 计算工作日格式
const workdayCheckFun = () => {
  workday.value = props.check?.(workday.value, 1, 31);
  return workday.value;
};
// 计算勾选的checkbox值合集
const checkboxStringFun = () => {
  let str = checkboxList.value.join();
  return str == "" ? "?" : str;
};
let cycleTotal = computed(() => cycleTotalFun());
let averageTotal = computed(() => averageTotalFun());
let workdayCheck = computed(() => workdayCheckFun());
let checkboxString = computed(() => checkboxStringFun());
// 单选按钮值变化时
const radioChange = () => {
  switch (radioValue.value) {
    case 1:
      emits("update", "day", "*", "day");
      break;
    case 2:
      emits("update", "day", "?");
      break;
    case 3:
      emits("update", "day", cycle01.value + "-" + cycle02.value);
      break;
    case 4:
      emits("update", "day", average01.value + "/" + average02.value);
      break;
    case 5:
      emits("update", "day", workday.value + "W");
      break;
    case 6:
      emits("update", "day", "L");
      break;
    case 7:
      emits("update", "day", checkboxString.value);
      break;
  }
};
// 周期两个值变化时
const cycleChange = () => {
  if (radioValue.value == 3) {
    emits("update", "day", cycleTotal.value);
  }
};
// 平均两个值变化时
const averageChange = () => {
  if (radioValue.value == 4) {
    emits("update", "day", averageTotal.value);
  }
};
// 最近工作日值变化时
const workdayChange = () => {
  if (radioValue.value == 5) {
    emits("update", "day", workday.value + "W");
  }
};
// checkbox值变化时
const checkboxChange = () => {
  if (radioValue.value == 7) {
    emits("update", "day", checkboxString.value);
  }
};
// // 父组件传递的week发生变化触发
// const weekChange = () => {
//   //判断week值与day不能同时为“?”
//   if (props.cron?.week == '?' && radioValue.value == 2) {
//     radioValue.value = 1;
//   } else if (props.cron?.week !== '?' && radioValue.value != 2) {
//     radioValue.value = 2;
//   }
// };
watch(
  () => radioValue.value,
  (_val) => radioChange(),
);
watch(
  () => cycleTotal.value,
  (_val) => cycleChange(),
);
watch(
  () => averageTotal.value,
  (_val) => averageChange(),
);
watch(
  () => workdayCheck.value,
  (_val) => workdayChange(),
);
watch(
  () => checkboxString.value,
  (_val) => checkboxChange(),
);
defineExpose({
  cycle01,
  cycle02,
  average01,
  average02,
  checkboxList,
  workday,
  radioValue,
});
</script>
