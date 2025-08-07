<!--
  * 个人档期页面
  * @author: Ruan Jiazhen
  * @date: 2024-04-28  17:48:25
-->
<template>
  <div class="container">
    <uni-nav-bar
      class="nav-bar"
      title="档期"
      status-bar
      :border="false"
      left-icon="left"
      @click-left="back"
    />
    <!-- 日历遮罩，以阻止点击日历上的日期 -->
    <!-- <div class="calendar-mask" /> -->
    <!-- 日历 -->
    <!-- <uni-calendar
      ref="calendar"
      insert
      lunar
      :show-month="false"
      :selected="selectedList"
      class="calendar"
      @month-switch="onMonthSwitch"
    /> -->
    <MyUniCalendar
      ref="calendar"
      insert
      :show-month="false"
      :selected="selectedList"
      class="calendar"
      @month-switch="onMonthSwitch"
    />
    <!-- 档期列表 -->
    <SchedulesListWithCalendar
      :schedule-list="scheduleListAll"
      :year="currentYear"
      :month="currentMonth"
      class="schedule-list-with-calendar"
    />
  </div>
</template>

<script lang="ts" setup>
import MyUniCalendar from '@/components/MyUniCalendar/MyUniCalendar.vue';
import SchedulesListWithCalendar from '@/components/wedding-link/SchedulesListWithCalendar.vue';
import { useSchedule } from '@/stores/schedule-store';
import { back } from '@/utils/navigate';
import type { UniCalendarOnMonthSwitchEvent } from '@uni-helper/uni-ui-types';

const scheduleStore = useSchedule();
const { scheduleListAll } = storeToRefs(scheduleStore);
const { getScheduleListAll } = scheduleStore;

onShow(() => {
  getScheduleListAll();
});

// 下拉刷新时重新获取数据
onPullDownRefresh(async () => {
  await getScheduleListAll();
  uni.stopPullDownRefresh();
});

// 打点列表
const selectedList = computed(() => {
  const temSelectedList = scheduleListAll.value.map((monthScheduleList) => {
    const monthSelectedList = monthScheduleList.scheduleList.map((schedule) => ({
      date: schedule.date,
      info: '',
      data: {},
    }));
    return monthSelectedList;
  });
  return temSelectedList.flat();
});

/** 当前显示的年份 */
const currentYear = ref(new Date().getFullYear());

/** 当前显示的月份 */
const currentMonth = ref(new Date().getMonth() + 1);

/** 日历切换月份事件 */
const onMonthSwitch = (e: UniCalendarOnMonthSwitchEvent) => {
  currentYear.value = e.year;
  currentMonth.value = e.month;
};

</script>

<style lang="scss" scoped>
.container {
  display: grid;
  grid-template:
    'nav-bar' auto
    'main' auto
    '.' 20px
    'bottom' auto
    / 100vw;

  // 导航栏
  .nav-bar {
    grid-area: nav-bar;
  }

  // 日历遮罩
  .calendar-mask {
    grid-area: main;
    align-self: end;

    z-index: 1;

    width: 100%;
    height: calc(100% - 50px);
  }

  // 日历
  .calendar {
    grid-area: main;

    height: 102.8205vw;
  }

  .schedule-list-with-calendar {
    grid-area: bottom;
  }
}
</style>
