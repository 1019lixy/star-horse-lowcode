<template>
  <div class="cron-content">
    <div class="cron-item">
      <el-radio size="small" v-model="radioValue" :label="1" border>
        {{ i18n("cron.week") }}{{ i18n("cron.wildcardsWithLHash") }}
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
      <span style="margin-left: 10px; margin-right: 5px">{{ i18n("cron.from") }}{{ i18n("cron.week") }}</span>
      <el-input-number
        size="small"
        v-model="cycle01"
        :min="1"
        :max="7"
        controls-position="right"
      />
      <span style="margin-left: 10px; margin-right: 5px">{{ i18n("cron.to") }}</span>
      <el-input-number
        size="small"
        v-model="cycle02"
        :min="1"
        :max="7"
        controls-position="right"
      />
    </div>
    <div class="cron-item">
      <el-radio size="small" v-model="radioValue" :label="4" border>
        {{ i18n("cron.loop") }}
      </el-radio>
      <span style="margin-left: 10px; margin-right: 5px">{{ i18n("cron.every") }}</span>
      <el-input-number
        size="small"
        v-model="average01"
        :min="1"
        :max="4"
        controls-position="right"
      />
      <span style="margin-left: 10px; margin-right: 5px">{{ i18n("cron.week") }}{{ i18n("cron.day") }}{{ i18n("cron.weekDay") }}</span>
      <el-input-number
        size="small"
        v-model="average02"
        :min="1"
        :max="7"
        controls-position="right"
      />
    </div>
    <div class="cron-item">
      <el-radio size="small" v-model="radioValue" :label="5" border>
        {{ i18n("cron.lastWeekday") }}
      </el-radio>
      <span style="margin-left: 10px; margin-right: 5px">{{ i18n("cron.weekDay") }}</span>
      <el-input-number
        size="small"
        v-model="weekday"
        :min="1"
        :max="7"
        controls-position="right"
      />
    </div>
    <div class="cron-item">
      <el-radio size="small" v-model="radioValue" :label="6" border>
        {{ i18n("cron.specify") }}
      </el-radio>
      <el-checkbox-group size="small" v-model="checkboxList">
        <el-checkbox
          class="my-[5px]"
          :border="true"
          v-for="item of weekList"
          :key="item"
          :value="item + 1"
          :label="Number(item) < 10 ? '0' + item : item"
        />
      </el-checkbox-group>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
<script setup lang="ts" name="crontab-week">
import { computed, ref, watch } from "vue";
import { i18n } from "@/lang";

const props = defineProps({
  check: { type: Function },
  cron: { type: Object },
});
const emits = defineEmits(["update"]);
let weekday = ref(0);
let radioValue = ref(1);
let cycle01 = ref(0);
let cycle02 = ref(0);
let average01 = ref(0);
let average02 = ref(1);

let checkboxList = ref([]);
let weekList = ref([
  i18n("cron.monday"),
  i18n("cron.tuesday"),
  i18n("cron.wednesday"),
  i18n("cron.thursday"),
  i18n("cron.friday"),
  i18n("cron.saturday"),
  i18n("cron.sunday")
]);

// 计算两个周期值
const cycleTotalFun = () => {
  cycle01.value = props.check?.(cycle01.value, 1, 7);
  cycle02.value = props.check?.(cycle02.value, 2, 7);
  return cycle01.value + "-" + cycle02.value;
};
// 计算平均用到的值
const averageTotalFun = () => {
  average01.value = props.check?.(average01.value, 1, 4);
  average02.value = props.check?.(average02.value, 1, 7);
  return average01.value + "#" + average02.value;
};
// 最近的工作日（格式）
const weekdayCheckFun = () => {
  weekday.value = props.check?.(weekday.value, 1, 7);
  return weekday.value;
};
// 计算勾选的checkbox值合集
const checkboxStringFun = () => {
  let str = checkboxList.value.join();
  return str == "" ? "?" : str;
};
let cycleTotal = computed(() => cycleTotalFun());
let averageTotal = computed(() => averageTotalFun());
let weekdayCheck = computed(() => weekdayCheckFun());
let checkboxString = computed(() => checkboxStringFun());
// 单选按钮值变化时
const radioChange = () => {
  switch (radioValue.value) {
    case 1:
      emits("update", "week", "*");
      break;
    case 2:
      emits("update", "week", "?");
      break;
    case 3:
      emits("update", "week", cycle01.value + "-" + cycle02.value);
      break;
    case 4:
      emits("update", "week", average01.value + "#" + average02.value);
      break;
    case 5:
      emits("update", "week", weekday.value + "L");
      break;
    case 6:
      emits("update", "week", checkboxString.value);
      break;
  }
};
// 根据互斥事件，更改radio的值
// 周期两个值变化时
const cycleChange = () => {
  if (radioValue.value == 3) {
    emits("update", "week", cycleTotal.value);
  }
};
// 平均两个值变化时
const averageChange = () => {
  if (radioValue.value == 4) {
    emits("update", "week", averageTotal.value);
  }
};
// 最近工作日值变化时
const weekdayChange = () => {
  if (radioValue.value == 5) {
    emits("update", "week", weekday.value + "L");
  }
};
// checkbox值变化时
const checkboxChange = () => {
  if (radioValue.value == 6) {
    emits("update", "week", checkboxString.value);
  }
};
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
  () => weekdayCheck.value,
  (_val) => weekdayChange(),
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
  weekday,
  radioValue,
});
</script>
