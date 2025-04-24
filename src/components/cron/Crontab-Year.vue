<template>
  <el-form>
    <el-form-item>
      <el-radio :label="1" v-model="radioValue" border> 不填，允许的通配符[, - * /] </el-radio>
    </el-form-item>
    <el-form-item>
      <el-radio :label="2" v-model="radioValue" border> 每年 </el-radio>
    </el-form-item>
    <el-form-item>
      <el-radio :label="3" v-model="radioValue" border>周期</el-radio>
      <span style="margin-left: 10px; margin-right: 5px">从</span>
      <el-input-number v-model="cycle01" :min="fullYear" />
      <span style="margin-left: 10px; margin-right: 5px">至</span>
      <el-input-number v-model="cycle02" :min="fullYear" />
    </el-form-item>
    <el-form-item>
      <el-radio :label="4" v-model="radioValue" border>循环</el-radio>
      <span style="margin-left: 10px; margin-right: 5px">从</span>
      <el-input-number v-model="average01" :min="fullYear" />
      <span style="margin-left: 10px; margin-right: 5px">年开始，每</span>
      <el-input-number v-model="average02" :min="fullYear" />
      <span style="margin-left: 10px; margin-right: 5px">年执行一次</span>
    </el-form-item>
    <el-form-item>
      <el-radio :label="5" v-model="radioValue" border> 指定 </el-radio>
      <el-select clearable filterable collapse-tags v-model="checkboxList" placeholder="请选择年" multiple>
        <el-option v-for="item in 20" :key="item" :value="item - 1 + fullYear" :label="item - 1 + fullYear" />
      </el-select>
    </el-form-item>
  </el-form>
</template>
<style lang="scss" scoped>
  .el-select {
    width: 250px;
  }

  .el-input-number {
    width: 150px;
  }
</style>
<script lang="ts" setup name="crontab-year">
  import { computed, onMounted, ref, watch } from 'vue';

  const props = defineProps({
    check: { type: Function },
    month: {},
    cron: { type: Object }
  });
  const emits = defineEmits(['update']);
  let fullYear = ref(0);
  let radioValue = ref(1);
  let cycle01 = ref(0);
  let cycle02 = ref(0);
  let average01 = ref(0);
  let average02 = ref(1);
  let checkboxList = ref([]);
  let checkNum = ref(props.check);
  // 计算两个周期值
  const cycleTotalFun = () => {
    cycle01.value = checkNum.value?.(cycle01.value, fullYear.value, fullYear.value + 100);
    cycle02.value = checkNum.value?.(cycle02.value, fullYear.value + 1, fullYear.value + 101);
    return cycle01.value + '-' + cycle02.value;
  };
  // 计算平均用到的值
  const averageTotalFun = () => {
    average01.value = checkNum.value?.(average01.value, fullYear.value, fullYear.value + 100);
    average02.value = checkNum.value?.(average02.value, 1, 10);
    return average01.value + '/' + average02.value;
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
    if (props.cron?.month === '*') {
      emits('update', 'month', '0', 'year');
    }
    if (props.cron?.day === '*') {
      emits('update', 'day', '0', 'year');
    }
    if (props.cron?.hour === '*') {
      emits('update', 'hour', '0', 'year');
    }
    if (props.cron?.min === '*') {
      emits('update', 'min', '0', 'year');
    }
    if (props.cron?.second === '*') {
      emits('update', 'second', '0', 'year');
    }
    switch (radioValue.value) {
      case 1:
        emits('update', 'year', '');
        break;
      case 2:
        emits('update', 'year', '*');
        break;
      case 3:
        emits('update', 'year', cycle01.value + '-' + cycle02.value);
        break;
      case 4:
        emits('update', 'year', average01.value + '/' + average02.value);
        break;
      case 5:
        emits('update', 'year', checkboxString.value);
        break;
    }
  };
  // 周期两个值变化时
  const cycleChange = () => {
    if (radioValue.value == 3) {
      emits('update', 'year', cycleTotal.value);
    }
  };
  // 平均两个值变化时
  const averageChange = () => {
    if (radioValue.value == 4) {
      emits('update', 'year', averageTotal.value);
    }
  };
  // checkbox值变化时
  const checkboxChange = () => {
    if (radioValue.value == 5) {
      emits('update', 'year', checkboxString.value);
    }
  };
  watch(
    () => radioValue.value,
    (_val) => radioChange(),
    {
      immediate: true,
      deep: true
    }
  );
  watch(
    () => cycleTotal.value,
    (_val) => cycleChange(),
    {
      immediate: true,
      deep: true
    }
  );
  watch(
    () => averageTotal.value,
    (_val) => averageChange(),
    {
      immediate: true,
      deep: true
    }
  );
  watch(
    () => checkboxString.value,
    (_val) => checkboxChange(),
    {
      immediate: true,
      deep: true
    }
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
    radioValue
  });
</script>
