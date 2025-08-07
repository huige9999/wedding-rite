<template>
  <div class="container">
    <uni-nav-bar
      class="nav-bar"
      left-icon="left"
      title="查看档期"
      status-bar
      :border="false"
      @click-left="back"
    />
    <!-- 主体部分 -->
    <div class="main">
      <!-- 日期 -->
      <div class="date">
        <div class="left">
          日期
        </div>
        <div class="right">
          {{ schedule.date }}（{{ schedule.period }}）
        </div>
      </div>
      <!-- 举办地点 -->
      <div class="address">
        <div class="left">
          举办地点
        </div>
        <div class="right">
          <p
            class="text"
            :class="schedule.address ? 'has-data' : ''"
          >
            {{ schedule.address || '请输入' }}
          </p>
          <image
            src="https://ustatic.joymew.com/joymewApp/locationIcon.png"
            mode="widthFix"
            class="icon"
          />
        </div>
      </div>
      <!-- 档期类型 -->
      <div class="type">
        <div class="left">
          档期类型
        </div>
        <div class="right">
          <div class="radio-item">
            <div class="text">
              预定
            </div>
            <image
              class="icon"
              :src="schedule.type === 'unbooked' ? checkedRadio : uncheckedRadio"
            />
          </div>
          <div class="radio-item">
            <div class="text">
              已定
            </div>
            <image
              class="icon"
              :src="schedule.type === 'booked' ? checkedRadio : uncheckedRadio"
            />
          </div>
        </div>
      </div>
      <!-- 客户信息 -->
      <div class="customer">
        <span class="title">客户信息</span>
        <div class="customer-item">
          <div
            class="name"
            :class="schedule.customerName ? 'has-data' : ''"
          >
            {{ schedule.customerName || '机构/个人名称' }}
          </div>
          <div class="hr" />
          <div
            class="phone"
            :class="schedule.customerPhone ? 'has-data' : ''"
          >
            {{ schedule.customerPhone || '手机号' }}
          </div>
        </div>
      </div>
      <!-- 添加联系人 -->
      <!-- <div class="add-customer">
        <image
          class="icon"
          src="@/static/icons/common/plus.svg"
          mode="aspectFit"
        />
        <text class="text">
          添加联系人
        </text>
      </div> -->
      <!-- 收款情况 -->
      <div class="receipt-status">
        <div class="title">
          收款情况
        </div>
        <div class="right">
          <image
            class="check-box"
            :src="schedule.hasBeenPaid ? checkedCheckBox : uncheckedCheckBox"
          />
          <div class="text">
            已结清
          </div>
        </div>
      </div>
      <!-- 总价 -->
      <div class="total-price">
        <div class="title">
          总价
        </div>
        <div
          class="right"
          :class="schedule.totalPrice ? 'has-data' : ''"
        >
          {{ schedule.totalPrice || '请输入' }}
        </div>
      </div>
      <!-- 定金 -->
      <div class="earnest">
        <div class="title">
          定金
        </div>
        <div
          class="right"
          :class="schedule.deposit ? 'has-data' : ''"
        >
          {{ schedule.deposit || '请输入' }}
        </div>
      </div>
      <!-- 备注 -->
      <textarea
        class="comment"
        placeholder="备注说明"
        maxlength="-1"
        :value="schedule.remark"
        disabled
      />
      <!-- 「删除按钮」 -->
      <div
        class="delete-btn"
        @click="clickDeleteBtn"
      >
        删除
      </div>

      <!-- 「编辑」按钮 -->
      <div
        class="edit-btn"
        @click="navigateTo('edit-schedule', { scheduleId: schedule.id })"
      >
        编辑
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { back, navigateTo } from '@/utils/navigate';
import { reqGetScheduleDetail, reqDeleteSchedule } from '@/api/schedule-api';
import checkedRadio from '@/static/icons/common/radio-checked.svg';
import uncheckedRadio from '@/static/icons/common/radio.svg';
import checkedCheckBox from '@/static/icons/common/check-box-checked.svg';
import uncheckedCheckBox from '@/static/icons/common/check-box.svg';
import { showToast } from '@/utils/tools';
import { useSchedule } from '@/stores/schedule-store';

const scheduleStore = useSchedule();
const { getScheduleListAfterToday } = scheduleStore;

/** 当前显示的档期的数据 */
const schedule = ref<ScheduleInfo>({
  id: '',
  date: '2023-01-30',
  period: '早上',
  hasBeenPaid: false,
  address: '',
  type: 'unbooked',
  customerName: '',
  customerPhone: '',
  totalPrice: '请输入',
  deposit: '2000',
  remark: '',
});

// 页面加载时，获取档期数据
onLoad(async (options) => {
  const { scheduleId } = options as any;
  if (!scheduleId) return;
  const resData = ((await reqGetScheduleDetail(scheduleId)) as any)?.data?.data;

  schedule.value = {
    id: scheduleId,
    date: resData.date,
    period: resData.time_interval,
    hasBeenPaid: resData.price_is_settle === '1',
    address: resData.address,
    type: resData.type === '1' ? 'booked' : 'unbooked',
    customerName: resData.customer_name,
    customerPhone: resData.customer_phone,
    totalPrice: resData.price,
    deposit: resData.paid,
    remark: resData.remark,
  };
});

/** 点击「删除」按钮 */
const clickDeleteBtn = async () => {
  uni.showModal({
    content: '是否删除该档期吗？',
    success: async (res) => {
      console.log(res);

      if (res.confirm) {
        const resData = (await reqDeleteSchedule(schedule.value.id)) as any;
        if (resData?.data?.code === 200) {
          showToast('删除成功');
          getScheduleListAfterToday();
          setTimeout(() => {
            back();
          }, 500);
        } else {
          showToast('删除失败，请稍后重试');
        }
      }
    },
  });
};

/** 点击「编辑」按钮 */
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;

  display: grid;
  grid-template:
    'nav-bar' auto
    'main' auto;

  .nav-bar {
    grid-area: nav-bar;
  }

  .main {
    grid-area: main;

    width: 100vw;

    padding: 0 12px 30px;
    display: grid;
    grid-template:
      'date date' 12.8205vw
      'address address' 12.8205vw
      'type type' 12.8205vw
      'customer customer' 22.3077vw
      /* '. .' 16px*/
      /* 'add-customer add-customer' 5.3846vw*/
      /* '. .' 20px*/
      'receipt-status receipt-status' 9.2308vw
      'total-price earnest' 10.2564vw
      '. .' 20px
      'comment comment' 36.9231vw
      '. .' 134px
      'delete-btn edit-btn' 12.3077vw
      /1fr 1fr;
    column-gap: 28px;

    // 日期、举办地点、档期类型
    .data,
    .address,
    .type {
      border-bottom: 1px solid #ccc;

      padding: 20px 0 9px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .left {
        width: max-content;

        font-size: 3.8462vw;
        color: #333;
      }
    }

    // 日期
    .date {
      grid-area: date;

      border-bottom: 1px solid #ccc;

      padding: 20px 0 9px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .left {
        font-size: 3.8462vw;
        color: #333;
      }
    }

    // 举办地点
    .address {
      grid-area: address;

      .right {
        display: flex;
        align-items: center;

        .text {
          font-size: 3.8462vw;
          color: #8d8d8d;

          // 有数据的情况
          &.has-data {
            color: #000;
          }
        }

        .icon {
          width: 4.1026vw;
          height: 4.1026vw;
        }
      }
    }

    // 档期类型
    .type {
      grid-area: type;

      .right {
        display: flex;
        column-gap: 15px;
        align-items: baseline;

        text-align: center;

        .radio-item {
          display: grid;
          grid-auto-flow: column;
          column-gap: 4px;
          align-items: center;

          .text {
            font-size: 3.8462vw;
            line-height: 100%;
            color: #8d8d8d;
          }

          .icon {
            width: 4.1026vw;
            height: 4.1026vw;
          }
        }
      }
    }

    // 客户信息
    .customer {
      grid-area: customer;

      border-bottom: 1px solid #ccc;

      padding: 12px 0 8px;
      display: grid;
      grid-template-rows: repeat(auto-fill, 9vw);
      align-items: center;

      .title {
        color: #333;
      }

      .customer-item {
        display: grid;
        grid-template:
          'name hr . phone'
          /35.8974vw 1px 19px 1fr;

        .name {
          grid-area: name;

          color: #8d8d8d;

          // 有数据的情况
          &.has-data {
            color: #000;
          }
        }

        .hr {
          grid-area: hr;

          width: 100%;
          height: 100%;

          background-color: #ccc;
        }

        .phone {
          grid-area: phone;

          color: #8d8d8d;

          // 有数据的情况
          &.has-data {
            color: #000;
          }
        }
      }
    }

    // // 添加联系人
    // .add-customer {
    //   grid-area: add-customer;
    //   align-self: center;
    //   justify-self: center;

    //   height: 100%;

    //   display: flex;
    //   align-items: center;
    //   justify-content: center;
    //   column-gap: 8px;

    //   .icon {
    //     width: 5vw;
    //     height: 5vw;
    //   }

    //   .text {
    //     color: #333;
    //     font-size: 3.8462vw;
    //   }
    // }

    // 收款情况
    .receipt-status {
      grid-area: receipt-status;

      display: flex;
      align-items: center;
      justify-content: space-between;

      .title {
        font-size: 3.8462vw;
        color: #333;
      }

      .right {
        display: flex;
        column-gap: 5px;
        align-items: center;

        .check-box {
          width: 16px;
          height: 16px;
        }

        .text {
          font-size: 3.8462vw;
          color: #8d8d8d;
        }
      }
    }

    // 总价
    .total-price {
      grid-area: total-price;
    }

    // 定金
    .earnest {
      grid-area: earnest;
    }

    .total-price,
    .earnest {
      border-bottom: 1px solid #ccc;

      padding: 11px 0 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .title {
        font-size: 15px;
        color: #333;
      }

      .right {
        font-size: 15px;
        color: #9a9fac;

        // 有数据的情况
        &.has-data {
          color: #000;
        }
      }
    }

    // 备注
    .comment {
      grid-area: comment;
      align-self: center;

      width: 93.8462vw;

      border: 0.5px solid #e5e5e5;
      border-radius: 8px;

      padding: 12px 16px;
      box-sizing: border-box;
    }

    // 删除按钮
    .delete-btn {
      grid-area: delete-btn;
      justify-self: center;

      width: 100%;
      height: 12.3077vw;

      background: linear-gradient(279deg, #ffd175 0%, #ffe8b7);
      border-radius: 40px;

      display: flex;
      align-items: center;
      justify-content: center;

      font-size: 3.5897vw;
      color: #704c00;
    }

    // 删除按钮
    .edit-btn {
      grid-area: edit-btn;
      justify-self: center;

      width: 100%;
      height: 12.3077vw;

      background: linear-gradient(279deg, #ffd175 0%, #ffe8b7);
      border-radius: 40px;

      display: flex;
      align-items: center;
      justify-content: center;

      font-size: 3.5897vw;
      color: #704c00;
    }
  }
}
</style>
