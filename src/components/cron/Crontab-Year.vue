<template>
  <div class="cron-content">
    <div class="cron-item">
      <el-radio size="small" :label="1" v-model="radioValue" border>
        不填，允许的通配符[, - * /]
      </el-radio>
    </div>
    <div class="cron-item">
      <el-radio size="small" :label="2" v-model="radioValue" border>
        每年
      </el-radio>
    </div>
    <div class="cron-item">
      <el-radio size="small" :label="3" v-model="radioValue" border
        >周期
      </el-radio>
      <span style="margin-left: 10px; margin-right: 5px">从</span>
      <el-input-number
        size="small"
        v-model="cycle01"
        :min="fullYear"
        controls-position="right"
      />
      <span style="margin-left: 10px; margin-right: 5px">至</span>
      <el-input-number
        size="small"
        v-model="cycle02"
        :min="fullYear"
        controls-position="right"
      />
    </div>
    <div class="cron-item">
      <el-radio size="small" :label="4" v-model="radioValue" border
        >循环
      </el-radio>
      <span style="margin-left: 10px; margin-right: 5px">从</span>
      <el-input-number
        size="small"
        v-model="average01"
        :min="fullYear"
        controls-position="right"
      />
      <span style="margin-left: 10px; margin-right: 5px">年开始，每</span>
      <el-input-number
        size="small"
        v-model="average02"
        :min="fullYear"
        controls-position="right"
      />
      <span style="margin-left: 10px; margin-right: 5px">年执行一次</span>
    </div>
    <div class="cron-item">
      <el-radio size="small" :label="5" v-model="radioValue" border>
        指定
      </el-radio>
      <el-checkbox-group size="small" v-model="checkboxList">
        <el-checkbox
          class="my-[5px]"
          :border="true"
          v-for="item in 20"
          :key="item"
          :value="item - 1 + fullYear"
          :label="item - 1 + fullYear"
        />
      </el-checkbox-group>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
<script lang="ts" setup name="crontab-year">
import { computed, onMounted, ref, watch } from "vue";

const props = defineProps({
  check: { type: Function },
  month: {},
  cron: { type: Object },
});
const emits = defineEmits(["update"]);
let fullYear = ref(0);
let radioValue = ref(1);
let cycle01 = ref(0);
let cycle02 = ref(0);
let average01 = ref(0);
let average02 = ref(1);
let checkboxList = ref([]);
// 计算两个周期值
const cycleTotalFun = () => {
  cycle01.value = props.check?.(
    cycle01.value,
    fullYear.value,
    fullYear.value + 100,
  );
  cycle02.value = props.check?.(
    cycle02.value,
    fullYear.value + 1,
    fullYear.value + 101,
  );
  return cycle01.value + "-" + cycle02.value;
};
// 计算平均用到的值
const averageTotalFun = () => {
  average01.value = props.check?.(
    average01.value,
    fullYear.value,
    fullYear.value + 100,
  );
  average02.value = props.check?.(average02.value, 1, 10);
  return average01.value + "/" + average02.value;
};
// 计算勾选的checkbox值合集
const checkboxStringFun = () => {
  return checkboxList.value.join();
};
let cycleTotal = computed(() => cycleTotalFun());
let averageTotal = computed(() => averageTotalFun());
let checkboxString = computed(() => checkboxStringFun());
// 单选按钮值变化时
const radioChange = () => {
  switch (radioValue.value) {
    case 1:
      emits("update", "year", "");
      break;
    case 2:
      emits("update", "year", "*");
      break;
    case 3:
      emits("update", "year", cycle01.value + "-" + cycle02.value);
      break;
    case 4:
      emits("update", "year", average01.value + "/" + average02.value);
      break;
    case 5:
      emits("update", "year", checkboxString.value);
      break;
  }
};
// 周期两个值变化时
const cycleChange = () => {
  if (radioValue.value == 3) {
    emits("update", "year", cycleTotal.value);
  }
};
// 平均两个值变化时
const averageChange = () => {
  if (radioValue.value == 4) {
    emits("update", "year", averageTotal.value);
  }
};
// checkbox值变化时
const checkboxChange = () => {
  if (radioValue.value == 5) {
    emits("update", "year", checkboxString.value);
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
  () => checkboxString.value,
  (_val) => checkboxChange(),
);

onMounted(() => {
  fullYear.value = Number(new Date().getFullYear());
});
defineExpose({
  cycle01,
  cycle02,
  average01,
  average02,
  checkboxList,
  radioValue,
});
</script>
