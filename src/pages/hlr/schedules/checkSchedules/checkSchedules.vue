<template>
  <div class="content">
    <uni-nav-bar
      :title="navBarTitle"
      status-bar
      :border="false"
      left-icon="left"
      fixed
      @click-left="back"
    />
    <ScheduleList
      :schedule-list="scheduleList"
      :schedule-total="scheduleTotal"
    />
  </div>
</template>

<script setup lang="ts">
import { getScheduleInfo } from '@/api/hlr-api';
import { back } from '@/utils/navigate';
import ScheduleList from './components/scheduleList/scheduleList.vue';

const scheduleList = ref([]);
const scheduleTotal = ref(0);
const name = ref('');
const userId = ref('');
const navBarTitle = ref('档期');

const handleScheduleData = (pYear, pMonth, pDayList) => {
// 判断scheduleList中是否包含year为tmpYear的项，没有就新增
  const tmpLen = scheduleList.value.length;
  const tmpScheduleList = scheduleList.value;
  let currentYearIndex = -1;
  let tmpIndex = -1;
  for (let i = 0; i < tmpLen; i += 1) {
    if (tmpScheduleList[i].year === pYear) {
      tmpIndex = i;
      currentYearIndex = i;
      break;
    }
  }
  if (tmpIndex === -1) {
    tmpScheduleList.push({
      year: pYear,
      dataList: [],
    });
    currentYearIndex = tmpScheduleList.length - 1;
  }
  // 判断tmpYear对应的dataList中是否包含month为tmpMonth的项，没有就新增
  const currentYearDataList = tmpScheduleList[currentYearIndex].dataList;
  const tmpLen2 = currentYearDataList.length;
  let tmpIndex2 = -1;
  let currentMonthIndex = -1;
  for (let i = 0; i < tmpLen2; i += 1) {
    if (currentYearDataList[i].month === pMonth) {
      tmpIndex2 = i;
      currentMonthIndex = i;
      break;
    }
  }
  if (tmpIndex2 === -1) {
    currentYearDataList.push({
      month: pMonth,
      dataList: [],
    });
    currentMonthIndex = currentYearDataList.length - 1;
  }
  // dayList数据加入到当前月份
  const currentMonthDataList = currentYearDataList[currentMonthIndex].dataList;
  const tmpLen3 = pDayList.length;
  for (let i = 0; i < tmpLen3; i += 1) {
    let tmpDay = pDayList[i].date.split('-')[2];
    if (tmpDay.split('')[0] === '0') {
      tmpDay = tmpDay.split('')[1];
    }
    currentMonthDataList.push({
      day: tmpDay,
      ...pDayList[i],
    });
  }
  scheduleList.value = tmpScheduleList;
};
const handleScheduleList = (pList) => {
  scheduleList.value.splice(0);
  const tmpLen = pList.length;
  let tmpScheduleTotal = scheduleTotal.value;
  for (let i = 0; i < tmpLen; i += 1) {
    const tmpYear = pList[i].date.split('-')[0];
    let tmpMonth = pList[i].date.split('-')[1];
    tmpScheduleTotal += pList[i].size;
    if (tmpMonth.split('')[0] === '0') {
      // 去0
      tmpMonth = tmpMonth.split('')[1];
    }
    handleScheduleData(tmpYear, tmpMonth, pList[i].dataList);
  }
  scheduleTotal.value = tmpScheduleTotal;
};

onLoad((options) => {
  if (options.userId) {
    userId.value = options.userId;
  }
  if (options.name) {
    name.value = options.name;
    navBarTitle.value = `${name.value}的档期`;
  }

  getScheduleInfo(userId.value)
    .then((res) => {
      console.log(res);
      handleScheduleList(res.data.list);
    })
    .catch((err) => {
      console.log(err);
    });
});
</script>

<style scoped>
</style>
