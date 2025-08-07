<!--
  * 档期页面
  * @author: Ruan Jiazhen
  * @date: 2024-04-28  17:16:21
-->
<template>
  <uni-nav-bar
    title="档期"
    status-bar
    :border="false"
  />
  <div class="main">
    <!-- 「海报」按钮 -->
    <div
      class="poster-btn"
      @click="navigateTo('schedule-poster')"
    >
      <image
        src="/static/icons/schedules/download.svg"
        mode="widthFix"
        class="poster-btn-icon"
      />
      <div class="poster-btn-text">
        海报
      </div>
    </div>
    <!-- 切换菜单 -->
    <div class="toggleMenu">
      <div
        class="menuItem"
        :class="activeId === '1' ? 'activated' : ''"
        @click="chooseMenu('1')"
      >
        列表
      </div>
      <div
        class="menuItem"
        :class="activeId === '2' ? 'activated' : ''"
        @click="chooseMenu('2')"
      >
        日历
      </div>
    </div>
    <!-- 统计按钮 -->
    <image
      class="status-btn"
      src="/static/icons/schedules/status.svg"
      @click="navigateTo('year-orders-overview')"
    />
    <!-- 暂无档期提醒 -->
    <div
      v-if="scheduleListAfterToday.length === 0 && activeId === '1'"
      class="no-schedule-tip"
    >
      <text>您暂时还没有档期，去</text>
      <text
        class="emphasis"
        @click="navigateTo('add-schedule')"
      >
        创建
      </text>
      <text>吧</text>
    </div>
    <!-- 档期列表 -->
    <SchedulesList
      v-if="scheduleListAfterToday.length > 0 && activeId === '1'"
      :schedule-list="showAllSchedule ? scheduleListAll : scheduleListAfterToday"
      class="schedule-list"
    />

    <!-- #region 切换到「日历」标签时显示、内容 -->
    <!-- 日历遮罩，以阻止点击日历上的日期 -->
    <div
      v-if="activeId === '2'"
      class="calendar-mask"
    />
    <!-- 日历 -->
    <MyUniCalendar
      v-if="activeId === '2'"
      ref="calendar"
      insert
      :show-month="false"
      :selected="selectedList"
      class="calendar"
      @month-switch="onMonthSwitch"
    />
    <!-- 档期列表 -->
    <SchedulesListWithCalendar
      v-if="activeId === '2'"
      :schedule-list="scheduleListAll"
      :year="currentYear"
      :month="currentMonth"
      class="schedule-list-with-calendar"
    />
    <!-- #endregion -->
  </div>

  <!-- 添加档期按钮 -->
  <image
    class="add-work-btn"
    src="@/static/icons/works/circle-plus-yellow.svg"
    @click="navigateTo('add-schedule')"
  />
  <CustomTabBar />
</template>

<script lang="ts" setup>
import CustomTabBar from '@/components/CustomTabBar.vue';
import MyUniCalendar from '@/components/MyUniCalendar/MyUniCalendar.vue';
import SchedulesList from '@/components/wedding-link/SchedulesList.vue';
import SchedulesListWithCalendar from '@/components/wedding-link/SchedulesListWithCalendar.vue';
import { useSchedule } from '@/stores/schedule-store';
import { navigateTo } from '@/utils/navigate';
import type { UniCalendarOnMonthSwitchEvent } from '@uni-helper/uni-ui-types';

const scheduleStore = useSchedule();
const { getScheduleListAfterToday, getScheduleListAll } = scheduleStore;
const { scheduleListAfterToday, scheduleListAll } = storeToRefs(scheduleStore);

// #region 列表标签页相关

/** 是否显示所有的档期数据 */
const showAllSchedule = ref(false);

// 页面显示时获取今天之后的档期列表数据
onShow(() => {
  getScheduleListAfterToday();
  getScheduleListAll();
});

// 下拉刷新时获取所有的档期列表数据
onPullDownRefresh(async () => {
  showAllSchedule.value = true;
  uni.stopPullDownRefresh();
});

// #endregion

// #region 日历标签页相关

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

// #endregion

// #region 菜单切换相关
/** 激活的菜单项对应的id */
const activeId = ref<'1' | '2'>('1');

/**
 * 菜单项点击事件
 * @param id 菜单项id
 */
const chooseMenu = (id: '1' | '2') => {
  activeId.value = id;
};

// #endregion
</script>

<style lang="scss" scoped>
.main {
  width: 100%;
  height: 100;

  padding: 12px 0 60px;
  display: grid;
  grid-template:
    'poster-btn toggle-menu stat-btn' 9.7436vw
    'main main main' auto
    'bottom bottom bottom' auto
    / 1fr 1fr 1fr;
  row-gap: 12px;
  align-items: center;
  justify-items: center;

  // 海报按钮
  .poster-btn {
    grid-area: poster-btn;
    justify-self: start;
    margin-left: 16px;

    width: 14.1026vw;
    height: 5.641vw;

    display: flex;
    align-items: center;
    justify-content: center;

    .poster-btn-icon {
      width: 4.1026vw;
      height: 4.1026vw;
    }

    .poster-btn-text {
      margin-left: 7px;

      font-size: 4.1026vw;
      color: #333;
      white-space: nowrap;
    }
  }

  // 切换按钮
  .toggleMenu {
    grid-area: toggle-menu;

    width: 39.4872vw;
    height: 9.7436vw;

    background: #f8d58f;
    border-radius: 8px;

    display: flex;
    align-items: center;
    justify-content: center;

    .menuItem {
      width: calc(50% - 3px);
      height: calc(100% - 4px);

      border-radius: 6px;

      display: flex;
      align-items: center;
      justify-content: center;

      color: #fff;

      &.activated {
        position: relative;

        background: #fff;
        border-radius: 6px;

        color: #f8d58f;
      }
    }
  }

  // 统计按钮
  .status-btn {
    grid-area: stat-btn;
    justify-self: end;
    margin-right: 16px;

    width: 6.1538vw;
    height: 6.1538vw;

    display: flex;
    align-items: center;
    justify-content: center;
  }

  // 暂无档期提醒
  .no-schedule-tip {
    grid-area: main;
    align-self: start;
    justify-self: center;
    margin-top: 202px;

    width: 100%;
    height: 100%;

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 3.8462vw;
    color: #999;
    white-space: nowrap;

    .emphasis {
      color: #f8d58f;
    }
  }

  // 档期列表
  .schedule-list {
    grid-area: main;
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

  // 隐藏「今日」按钮
  ::v-deep .uni-calendar__backtoday {
    display: none;
  }
}

// 添加档期按钮
.add-work-btn {
  position: fixed;
  right: 20px;
  bottom: 40px + $tabBarHeight;

  width: 12.3077vw;
  height: 12.3077vw;
}
</style>
