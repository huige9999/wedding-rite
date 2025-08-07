<!--
  * 每年订单总览页面
  * @author: Ruan Jiazhen
  * @date: 2024-04-28  17:55:07
-->
<template>
  <div class="container">
    <uni-nav-bar
      class="nav-bar"
      left-icon="left"
      :title="`${currentYear}年单量总览`"
      color="#fff"
      background-color="#00000000"
      status-bar
      :border="false"
      @click-left="back"
    />
    <!-- 主体部分 -->
    <div class="main">
      <!-- 年份选择器 -->
      <div
        class="year-selector"
        @click="yearBtnClick"
      >
        {{ currentYear }}年
        <image
          class="triangle-icon"
          src="@/static/icons/common/inverted-triangle-white.svg"
        />
      </div>
      <!-- 统计数据面板 -->
      <div class="stat-board">
        <!-- 总单量 -->
        <div class="total-orders-count">
          <div class="title">
            总单量
          </div>
          <text class="count">
            {{ overViewDate?.totalOrderCount }}
          </text>
          <text class="unit">
            单
          </text>
        </div>
        <!-- 分隔线 -->
        <div class="line" />
        <!-- 总收入 -->
        <div class="total-income">
          <div class="title">
            总收入
          </div>
          <text class="amount">
            {{ overViewDate?.totalIncome.toFixed(2) }}
          </text>
          <text class="unit">
            元
          </text>
        </div>
        <!-- 分隔区块 -->
        <div class="gap-block" />
        <!-- 统计列表 -->
        <div class="stat-list">
          <!-- 表头 -->
          <div class="stat-list-header">
            <div class="month">
              月份
            </div>
            <div class="orders-count">
              单量
              <text class="unit">
                （单）
              </text>
            </div>
            <div class="income-amount">
              收入
              <text class="unit">
                （元）
              </text>
            </div>
          </div>
          <!-- 各月份数据 -->
          <div
            v-for="(item, index) in overViewDate?.monthData"
            :key="index"
            class="stat-list-item"
            :class="index === new Date().getMonth() ? 'current-month' : ''"
          >
            <div class="month">
              {{ item.month }}
            </div>
            <div class="orders-count">
              {{ item.orderCount }}
            </div>
            <div class="income-amount">
              {{ item.income.toFixed(2) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- 年份选择器弹窗 -->
  <YearPickerPopup
    ref="yearPickerPopup"
    :start-year="2022"
    :end-year="new Date().getFullYear() + 3"
    :current-year="new Date().getFullYear()"
    @change="yearPickerChange"
  />
</template>

<script lang="ts" setup>
import { reqGetYearSchedule } from '@/api/schedule-api';
import YearPickerPopup from '@/components/YearPickerPopup.vue';
import { back } from '@/utils/navigate';

const ctx = getCurrentInstance();

// #region 数据获取和展示相关

/** 当前年份 */
const currentYear = ref(new Date().getFullYear());

/** 总览数据 */
const overViewDate = ref<YearOverviewDate>();

/**
 * 获取并设置对应年份的总览数据
 * @param year 年份
 * @returns yearOverviewDate
 */
const getOverViewDate = async (year: number): Promise<YearOverviewDate> => {
  const res = (await reqGetYearSchedule(year)) as any;
  const resData = res?.data?.data.map as AnyObject;
  // 遍历resData，1-12的值分别对应1月到12月的数据，13对应总数据
  return {
    year,
    totalOrderCount: Number(resData[13]?.size),
    totalIncome: Number(resData[13]?.income),
    monthData: Object.keys(resData)
      .filter((key) => key !== '13')
      .map((key) => ({
        month: `${key}月`,
        orderCount: Number(resData[key]?.size),
        income: Number(resData[key]?.income),
      })),
  };
};

onMounted(async () => {
  overViewDate.value = await getOverViewDate(currentYear.value);
});
// #endregion

// #region 年份选择器相关

/** 年份按钮点击事件 */
const yearBtnClick = () => {
  const yearPickerPopup = ctx?.refs?.yearPickerPopup as unknown as InstanceType<
    typeof YearPickerPopup
  >;
  yearPickerPopup.open();
};

/** 年份选择器修改年份事件 */
const yearPickerChange = async (year: number) => {
  currentYear.value = year;
  overViewDate.value = await getOverViewDate(currentYear.value);
};
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;

  background: linear-gradient(0deg, #ffe8b7 70%, #ffd175 100%);

  display: grid;
  grid-template:
    'nav-bar' auto
    'main' 1fr;

  .nav-bar {
    grid-area: nav-bar;
  }

  .main {
    grid-area: main;

    padding: 12px 0 0;
    display: grid;
    grid-template:
      'year-selector .' 9.2308vw
      'stat-board stat-board' 1fr
      /26.1538vw 1fr;
    row-gap: 12px;

    .year-selector {
      grid-area: year-selector;
      margin-left: 16px;

      width: 100%;
      height: 100%;

      background: rgba($color: #000, $alpha: 30%);
      border-radius: 32px;

      display: flex;
      align-items: center;
      justify-content: center;

      font-size: 4.359vw;
      color: #fff;

      .triangle-icon {
        margin-left: 8px;

        width: 3.0769vw;
        height: 3.0769vw;
      }
    }

    // 统计数据面板
    .stat-board {
      grid-area: stat-board;

      width: 100%;
      height: 100%;

      background-color: #fff;
      border-radius: 24px 24px 0 0;

      display: grid;
      grid-template:
        '. line .' 24px
        'total-orders-count line total-income' 24.1026vw
        'gap-block gap-block gap-block' 8px
        'stat-list stat-list stat-list' 1fr
        /1fr 1px 1fr;
      row-gap: 8px;
      align-items: center;
      justify-items: center;

      // 总单量
      .total-orders-count {
        grid-area: total-orders-count;

        display: grid;
        grid-template:
          'title title' 4.6154vw
          'count unit' auto
          / 1fr;
        row-gap: 9px;
        justify-items: center;

        .title {
          grid-area: title;

          font-size: 4.359vw;
          color: #333;
        }

        .count {
          grid-area: count;
          align-self: baseline;

          font-size: 6.1538vw;
          font-weight: bold;
          color: #f8d58f;
        }

        .unit {
          grid-area: unit;
          align-self: baseline;

          font-size: 3.3333vw;
          color: #8d8d8d;
        }
      }

      // 分隔线
      .line {
        grid-area: line;

        width: 1px;
        height: 21vw;

        background-color: #e5e5e5;

        transform: translate(0, 5px);
      }

      // 总收入
      .total-income {
        grid-area: total-income;

        display: grid;
        grid-template:
          'title title' 4.6154vw
          'amount unit' auto
          / 1fr;
        row-gap: 9px;
        justify-items: center;

        .title {
          grid-area: title;

          font-size: 4.359vw;
          color: #333;
        }

        .amount {
          grid-area: amount;
          align-self: baseline;

          font-size: 6.1538vw;
          font-weight: bold;
          color: #fd3055;
        }

        .unit {
          grid-area: unit;
          align-self: baseline;

          font-size: 3.3333vw;
          color: #8d8d8d;
        }
      }

      // 分隔区块
      .gap-block {
        grid-area: gap-block;

        width: 100%;
        height: 100%;

        background-color: #f9f9f9;
      }

      // 统计列表
      .stat-list {
        grid-area: stat-list;

        width: 100%;
        height: 100%;

        display: flex;
        flex-direction: column;
        align-items: center;

        .stat-list-header {
          width: 100vw;
          height: 8.9744vw;

          padding: 0 35px 0 52px;
          display: grid;
          grid-template:
            'month orders-count income-amount' 1fr
            /1fr 1fr 1fr;

          .month {
            grid-area: month;
            justify-self: start;

            display: flex;
            align-items: center;
            justify-content: center;

            font-size: 3.3333vw;
            color: #333;
          }

          .orders-count {
            grid-area: orders-count;

            display: flex;
            align-items: center;
            justify-content: center;

            font-size: 3.3333vw;
            color: #333;

            .unit {
              font-size: 2.8205vw;
            }
          }

          .income-amount {
            grid-area: income-amount;
            justify-self: end;

            display: flex;
            align-items: center;
            justify-content: center;

            font-size: 3.3333vw;
            color: #333;

            .unit {
              font-size: 2.8205vw;
            }
          }
        }

        // 统计列表项
        .stat-list-item {
          width: 100vw;
          height: 8.9744vw;

          padding: 0 42px 0 52px;
          display: grid;
          grid-template:
            'month orders-count income-amount' 1fr
            /1fr 1fr 1fr;

          .month {
            grid-area: month;
            justify-self: start;

            display: flex;
            align-items: center;
            justify-content: center;

            font-size: 3.8462vw;
            color: #333;
          }

          .orders-count {
            grid-area: orders-count;

            display: flex;
            align-items: center;
            justify-content: center;

            font-size: 3.8462vw;
            color: #333;
          }

          .income-amount {
            grid-area: income-amount;
            justify-self: end;

            display: flex;
            align-items: center;
            justify-content: center;

            font-size: 3.8462vw;
            color: #333;
          }

          // 当前月份
          &.current-month {
            background-color: #f8d58f;

            .month {
              color: #fff;
            }

            .orders-count {
              color: #fff;
            }

            .income-amount {
              color: #fff;
            }
          }
        }
      }
    }
  }
}
</style>
