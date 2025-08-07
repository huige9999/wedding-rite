<template>
  <!-- 档期列表组件 -->
  <!-- 单个月的列表 -->
  <div
    v-for="(monthScheduleList, index) in formattedScheduleList"
    :key="index"
    class="month-list"
  >
    <!-- 头部 -->
    <div class="header">
      <div class="month">
        —— {{ monthScheduleList.month }}月 ——
      </div>
      <!-- 共计单数 -->
      <div class="total-count">
        共计{{ monthScheduleList.scheduleList.length }}单
      </div>
      <!-- 合计收入 -->
      <div class="total-income">
        收入{{ monthScheduleList.totalIncomeString }}元
      </div>
    </div>
    <!-- 单个月的列表 -->
    <div class="month-schedule-list">
      <div
        v-for="(schedule, scheduleIndex) in monthScheduleList.scheduleList"
        :key="scheduleIndex"
        class="day-item"
        @click="navigateTo('view-schedule', { scheduleId: schedule.id })"
      >
        <div class="left-up">
          <!-- 日期 -->
          <div class="day">
            {{ schedule.day }}日
          </div>
          <!-- 时间段 -->
          <div class="time-period">
            （{{ schedule.period }}）
          </div>
          <!-- 新日程标记 -->
          <image
            wx:if="{{schedule.isNew}}"
            class="new-tag"
            src="/static/icons/schedules/new.svg"
          />
        </div>
        <div class="left-down">
          <!-- 预定标记 -->
          <div
            v-if="schedule.type === 'unbooked'"
            class="booked-tag"
          >
            预
          </div>
          <!-- 农历日期 -->
          <div class="lunar-day">
            {{ schedule.lunarDay }}
          </div>
          <!-- 周几 -->
          <div class="week-day">
            {{ schedule.weekDay }}
          </div>
        </div>
        <!-- 举办地点 -->
        <div class="address">
          {{ schedule.address }}
        </div>
        <!-- 电话按钮 -->
        <div
          v-if="schedule.customerPhone"
          class="phone"
          @click.stop="onPhoneClick(schedule.customerPhone)"
        >
          <image
            class="phone-icon"
            src="/static/icons/schedules/phone.svg"
          />
          <div class="customer-name">
            {{ schedule.customerName }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { INDEX_TO_WEEK } from '@/static/constants/view-constants';
import { navigateTo } from '@/utils/navigate';
import lunisolar from 'lunisolar';

const props = defineProps<{
  /** 档期列表 */
  scheduleList: AllScheduleList
}>();

onMounted(() => {
  console.log(props.scheduleList);
});

/** 格式化后的档期列表数据 */
const formattedScheduleList = computed(() => {
  // 当前遍历到的年份
  let currentYear = 0;
  // 是否是该年遍历到的第一个月
  let isFirstMonth = true;
  return props.scheduleList.map((schedule) => {
    const { scheduleList, year, month } = schedule;
    const temFormattedScheduleList = scheduleList.map((scheduleInfo) => {
      const { date } = scheduleInfo;
      const timeObject = lunisolar(date);
      return {
        ...scheduleInfo,
        day: timeObject.day,
        /** 农历日期 */
        lunarDay: timeObject.format('lMlD'),
        /** 周几 */
        weekDay: INDEX_TO_WEEK[timeObject.dayOfWeek],
      };
    });

    // 如果当前年份和上一个年份不同，则是该年的第一个月
    if (currentYear !== year) isFirstMonth = true;
    // 设置当前年份
    currentYear = year;

    // 如果不是今年，且是该年的第一个月，则加上年份前缀
    const monthPrefix = isFirstMonth ? `${currentYear}年` : '';

    // 设置为 false，下一个月就不是该年的第一个月了
    isFirstMonth = false;

    return {
      ...schedule,
      /** 月份 */
      month: `${monthPrefix}${month}`,
      scheduleList: temFormattedScheduleList,
    };
  });
});

/** 电话图标点击事件 */
const onPhoneClick = (phone: string) => {
  uni.makePhoneCall({ phoneNumber: phone });
};
</script>

<style scoped lang="scss">
// 单月的列表
.month-list {
  width: 100vw;

  display: grid;
  grid-template:
    'header' 12.3077vw
    'month-schedule-list' min-content
    / 1fr;

  .header {
    grid-area: header;

    background-color: #6fcf97;

    padding: 6px 12px;
    display: grid;
    grid-template:
      'left month total-count' 1fr
      'left month total-income' 1fr
      / 1fr auto 1fr;
    align-items: center;
    justify-items: center;

    .month {
      grid-area: month;

      font-size: 4.359vw;
      color: #fff;
    }

    .total-count {
      grid-area: total-count;
      justify-self: end;

      font-size: 3.3333vw;
      color: #fff;
    }

    .total-income {
      grid-area: total-income;
      justify-self: end;

      font-size: 3.3333vw;
      color: #fff;
    }
  }

  // 单个月的列表
  .month-schedule-list {
    grid-area: month-schedule-list;

    display: grid;
    grid-template-rows: repeat(auto-fill, min-content);

    .day-item {
      width: 100%;
      height: 16.9231vw;

      border-bottom: 1px solid #f3f3f3;

      padding: 12px;
      display: grid;
      grid-template:
        'left-up address phone' 1fr
        'left-down address phone' 1fr
        / 1fr 48.2051vw 11.7949vw;
      column-gap: 10px;
      align-items: center;

      .left-up {
        grid-area: left-up;

        display: flex;
        align-items: center;

        // 日期
        .day {
          font-size: 3.3333vw;
          color: #333;
        }

        // 时间段
        .time-period {
          font-size: 2.8205vw;
          color: #8d8d8d;
        }

        // 新日程标记
        .new-tag {
          width: 8.2051vw;
          height: 3.5897vw;
        }
      }

      .left-down {
        grid-area: left-down;

        display: flex;
        align-items: center;

        // 预定标记
        .booked-tag {
          width: 14px;
          height: 14px;

          background: #f8d58f;
          border-radius: 50%;

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 7px;
          color: #fff;
        }

        // 农历日期
        .lunar-day {
          margin-left: 4px;

          font-size: 2.8205vw;
          color: #8d8d8d;
        }

        // 周几
        .week-day {
          margin-left: 8px;

          font-size: 2.8205vw;
          color: #8d8d8d;
        }
      }

      // 地址
      .address {
        grid-area: address;

        font-size: 15px;
        color: #333;
      }

      // 电话
      .phone {
        grid-area: phone;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .phone-icon {
          width: 3.8462vw;
          height: 3.8462vw;
        }

        .customer-name {
          font-size: 2.8205vw;
          color: #8d8d8d;
        }
      }
    }
  }
}
</style>
