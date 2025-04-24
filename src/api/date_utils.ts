/**
 * 创建日期
 * @param val
 * @returns {string}
 */
export function createDate(val: any) {
  if (!val) {
    return '--';
  }
  return dateParse(val, false);
}

/**
 * 当前日期
 * @param split
 */
export function currentDate(split: string = '-') {
  const date = new Date();
  return dateParse(date, false, split);
}

/**
 * 获取当月的开始和结束时间
 */
export function currentMonthRange() {
  // 获取当前日期
  return monthRange(new Date());
}

export function monthRange(date: Date) {
  if (!date) {
    return {};
  }
  // 获取当前月份
  const currentMonth = date.getMonth();
  // 获取当前月份的第一天
  date.setDate(1);
  const firstDay = new Date(date.getTime());
  // 获取当前月份的最后一天
  date.setMonth(currentMonth + 1, 0);
  const lastDay = new Date(date.getTime());
  const year = date.getFullYear();
  let month: number | string = currentMonth + 1;
  month = month < 10 ? '0' + month : month;
  return {
    startDate: firstDay,
    starDateStr: year + '-' + month + '-01',
    lastDate: lastDay,
    lastDateStr: year + '-' + month + '-' + lastDay.getDate()
  };
}

/**
 * 将日期解析为字符串
 * @param date
 * @param needTime
 * @param split
 * @param needSecond
 */
export function dateParse(date: Date, needTime: boolean = true, split: string = '-', needSecond: boolean = false) {
  if (!date) {
    return '';
  }
  const m = date.getMonth() + 1;
  const m1 = m < 10 ? '0' + m : m;
  const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  const hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
  const minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
  const second = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
  let restr = date.getFullYear() + split + m1 + split + day;
  const tm = hour + ':' + minute;
  if (needTime) {
    restr += ' ' + tm;
  }
  if (needSecond) {
    restr += ':' + second;
  }
  return restr;
}

/**
 * 创建年月日时分秒
 * @param val
 */
export function createDatetime(val: any) {
  if (!val || val == 'undefined' || val == '-') {
    return '--';
  }
  const date = new Date(val);
  return dateParse(date);
}
