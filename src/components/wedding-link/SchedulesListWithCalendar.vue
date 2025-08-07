<!-- 日历下方的档期列表组件 -->
<template>
  <div class="container">
    <!-- 统计信息 -->
    <div
      class="stat-info"
      :class="showTotalIncome && monthScheduleList?.scheduleList.length ? '' : 'hide'"
    >
      {{ year }}年{{ month }}月总计
      <span class="emphasis">{{ monthScheduleList?.scheduleList.length }}</span>
      单&nbsp;&nbsp;&nbsp;收入
      <span class="emphasis">{{ monthScheduleList?.totalIncomeString }}</span>
      元
    </div>
    <!-- 标题 -->
    <div class="title">
      全部{{ monthScheduleList?.scheduleList.length
        ? `（${monthScheduleList?.scheduleList.length}）`
        :'' }}
    </div>
    <!-- 档期 -->
    <div
      v-for="schedule in monthScheduleList?.scheduleList"
      :key="schedule.id"
      class="schedule-item"
      @click="onScheduleClick(schedule.id)"
    >
      <!-- 日期 -->
      <div class="date">
        <image
          class="icon"
          src="@/static/icons/common/clock.svg"
        />
        <span class="date-text">{{ schedule.date }}</span>
      </div>
      <!-- 时间段 -->
      <div class="period">
        {{ schedule.period }}
      </div>
      <!-- 新郎 -->
      <div class="bridegroom">
        <image
          class="icon"
          src="@/static/icons/common/user.svg"
        />
        <span class="bridegroom-text">{{ schedule.customerName }}</span>
      </div>
      <!-- 地点 -->
      <div class="address">
        <image
          class="icon"
          src="@/static/icons/common/map-pin.svg"
        />
        <span class="address-text">{{ schedule.address }}</span>
      </div>
      <!-- 电话 -->
      <image
        v-if="showPhoneIcon && schedule.customerPhone"
        class="phone"
        src="/static/icons/schedules/phone-2.svg"
        @click.stop="onPhoneClick(schedule.customerPhone)"
      />
      <!-- 备注 -->
      <div
        v-if="showComment"
        class="comment"
      >
        <span class="text">备注：{{ schedule.remark }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { navigateTo } from '@/utils/navigate';

type Props = {
  /** 档期列表 */
  scheduleList: AllScheduleList
  /** 要显示的档期列表的年份 */
  year: number
  /** 要显示的档期列表的月份 */
  month: number
  /** 是否显示总收入 */
  showTotalIncome: boolean
  /** 是否显示电话图标 */
  showPhoneIcon: boolean
  /** 是否显示备注 */
  showComment: boolean
  /** 是否能点击档期 */
  canClickSchedule: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showTotalIncome: true,
  showPhoneIcon: true,
  showComment: true,
  canClickSchedule: true,
});

const monthScheduleList = computed(() => props.scheduleList.find((temMonthScheduleList) => {
  const { month, year } = temMonthScheduleList;
  return month === props.month && year === props.year;
}));

/** 电话图标点击事件 */
const onPhoneClick = (phone: string) => {
  uni.makePhoneCall({ phoneNumber: phone });
};

/**
 * 档期点击事件
 * @param scheduleId 档期id
 */
const onScheduleClick = (scheduleId: string) => {
  if (props.canClickSchedule) {
    navigateTo('view-schedule', { scheduleId });
  }
};
</script>

<style scoped lang="scss">
.container {
  width: 100vw;

  padding: 0 12px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .stat-info {
    align-self: center;
    justify-self: center;

    width: 366px;
    height: 26px;

    background: #fff0f0;

    padding: 4px 12px;
    display: flex;
    align-items: center;

    font-size: 13px;
    color: #333;

    // 隐藏状态
    &.hide{
      opacity: 0;
    }

    .emphasis {
      color: #eb5757;
    }
  }

  .title {
    align-self: flex-start;
    margin-top: 12px;

    position: relative;

    font-size: 14px;
    color: #333;

    // 底部的横线
    &::after {
      position: absolute;
      bottom: -4px;
      left: 1px;

      width: 24px;
      height: 2px;

      content: '';

      background: #333;
    }
  }

  .schedule-item {
    margin-top: 16px;

    width: 93.8462vw;
    height: 32.8205vw;

    background: #fff;
    border-radius: 2px;
    box-shadow: 0 0 2.08px 0 #c1c1c1;

    padding: 12px 0 0;
    display: grid;
    grid-template:
      '. date period title title .' 6.1538vw
      '. bridegroom bridegroom bridegroom phone .' 1fr
      '. address address address phone .' 1fr
      'comment comment comment comment comment comment' 6.6667vw
      /10px auto auto auto 14.359vw 10px;
    align-items: center;

    // 日期
    .date {
      grid-area: date;

      display: flex;
      align-items: center;

      .icon {
        width: 14px;
        height: 14px;
      }

      .date-text {
        font-size: 4.359vw;
        font-weight: bold;
        color: #333;
      }
    }

    // 时间段
    .period {
      grid-area: period;

      font-size: 4.359vw;
      font-weight: bold;
      color: #333;
    }

    // 标题
    .schedule-title {
      grid-area: title;

      font-size: 4.359vw;
      font-weight: bold;
      color: #333;
    }

    // 新郎
    .bridegroom {
      grid-area: bridegroom;

      display: flex;
      align-items: center;

      .icon {
        width: 14px;
        height: 14px;
      }

      .bridegroom-text {
        font-size: 3.8462vw;
        color: #8d8d8d;
      }
    }

    // 地点
    .address {
      grid-area: address;

      display: flex;
      align-items: center;

      .icon {
        width: 14px;
        height: 14px;
      }

      .address-text {
        font-size: 3.8462vw;
        color: #8d8d8d;
      }
    }

    // 电话
    .phone {
      grid-area: phone;

      width: 14.359vw;
      height: 14.359vw;
    }

    // 备注
    .comment {
      grid-area: comment;
      justify-self: center;

      width: 93.8462vw;
      height: 6.6667vw;

      background: #f4f4f4;

      // box-sizing: border-box;
      padding: 0 16px;
      display: flex;
      align-items: center;

      .text {
        width: 100%;
        overflow: hidden;

        font-size: 3.3333vw;
        color: #b8b8b8;
        text-overflow: ellipsis;
        word-wrap: break-word;

        // 文字不换行
        white-space: nowrap;
      }
    }
  }
}
</style>
