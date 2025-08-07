<!--
  * 编辑档期页面
  * @author: Ruan Jiazhen
  * @date: 2024-04-28  17:33:21
-->
<template>
  <div class="container">
    <uni-nav-bar
      class="nav-bar"
      left-icon="left"
      title="编辑档期"
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
          <image
            class="icon"
            :style="isShowDatePicker ? `` : `transform: rotate(-90deg);`"
            src="@/static/icons/schedules/triangle-down-yellow.svg"
            mode="scaleToFill"
            @click="clickTriangle"
          />
        </div>
      </div>
      <!-- 日期选择器 -->
      <ScheduleDatePicker
        v-show="isShowDatePicker"
        :date="date"
        :period="schedule.period"
        class="date-picker"
        @change="datePickerChange"
      />
      <!-- 举办地点 -->
      <div class="address">
        <div class="left">
          举办地点
        </div>
        <div
          class="right"
          @click="addressClick"
        >
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
          <div
            class="radio-item"
            @click="typeClick('unbooked')"
          >
            <div class="text">
              预定
            </div>
            <image
              class="icon"
              :src="schedule.type === 'unbooked' ? checkedRadio : uncheckedRadio"
            />
          </div>
          <div
            class="radio-item"
            @click="typeClick('booked')"
          >
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
          <input
            class="name"
            placeholder="机构/个人名称"
            type="text"
            :value="schedule.customerName"
            @input="customerNameInput"
          >

          <div class="hr" />
          <input
            class="phone"
            placeholder="手机号"
            type="tel"
            :value="schedule.customerPhone"
            @input="customerPhoneInput"
          >
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
        <div
          class="right"
          @click="receiptStatusClick"
        >
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
        <input
          class="right"
          placeholder="请输入"
          type="digit"
          :value="schedule.totalPrice"
          @input="totalPriceInput"
        >
      </div>
      <!-- 定金 -->
      <div class="earnest">
        <div class="title">
          定金
        </div>
        <input
          class="right"
          placeholder="请输入"
          type="digit"
          :value="schedule.deposit"
          @input="earnestInput"
        >
      </div>
      <!-- 备注 -->
      <textarea
        class="comment"
        placeholder="备注说明"
        maxlength="150"
        :value="schedule.remark"
        @input="remarkInput"
      />
      <!-- 「删除按钮」 -->
      <div
        class="delete-btn"
        @click="clickDeleteBtn"
      >
        删除
      </div>

      <!-- 「完成」按钮 -->
      <div
        class="edit-btn"
        @click="clickFinishBtn"
      >
        完成
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reqDeleteSchedule, reqEditSchedule, reqGetScheduleDetail } from '@/api/schedule-api';
import ScheduleDatePicker from '@/components/ScheduleDatePicker.vue';
import checkedCheckBox from '@/static/icons/common/check-box-checked.svg';
import uncheckedCheckBox from '@/static/icons/common/check-box.svg';
import checkedRadio from '@/static/icons/common/radio-checked.svg';
import uncheckedRadio from '@/static/icons/common/radio.svg';
import { useSchedule } from '@/stores/schedule-store';
import { back, navigateTo } from '@/utils/navigate';
import { showToast } from '@/utils/tools';
import { uniAuthorize, uniChooseLocation } from '@/utils/uniapp-api-promised';
import type { InputOnInputEvent, TextareaOnInputEvent } from '@uni-helper/uni-app-types';

const scheduleStore = useSchedule();
const { getScheduleListAfterToday } = scheduleStore;

// #region  档期数据展示和获取相关

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
    type: resData.schedule_type === '1' ? 'booked' : 'unbooked',
    customerName: resData.customer_name,
    customerPhone: resData.customer_phone,
    totalPrice: resData.price,
    deposit: resData.paid,
    remark: resData.remark,
  };
});

// #endregion

// #region 日期选择器相关

/** 是否显示日期选择器 */
const isShowDatePicker = ref(false);

/** 点击三角 */
const clickTriangle = () => {
  isShowDatePicker.value = !isShowDatePicker.value;
};

/** 日期选择器改变事件 */
const datePickerChange = (e: AnyObject) => {
  schedule.value.date = e.date;
  schedule.value.period = e.period;
};

/** 日期 */
const date = computed(() => schedule.value.date);

// #endregion

// #region 举办地点相关
/** 点击举办地点事件 */
const addressClick = async () => {
  try {
    await uniAuthorize('scope.userLocation');
    const res = (await uniChooseLocation()) as UniApp.ChooseLocationSuccess;
    console.log('授权成功', res);
    schedule.value.address = res.name;
  } catch (e) {
    console.error('用户拒绝授权', e);
  }
};
// #endregion

// #region 档期类型相关

/**
 * 点击档期类型
 * @param t 档期类型
 */
const typeClick = (t: ScheduleInfo['type']) => {
  schedule.value.type = t;
};

// #endregion

// #region 客户相关

/**
 * 客户名称输入
 * @param e 事件对象
 */
const customerNameInput = (e: any) => {
  e as InputOnInputEvent;
  schedule.value.customerName = e.detail.value;
};

/**
 * 客户电话输入
 * @param e 事件对象
 */
const customerPhoneInput = (e: any) => {
  e as InputOnInputEvent;
  schedule.value.customerPhone = e.detail.value;
};

// #endregion

// #region 收款情况相关

/**
 * 点击收款情况
 */
const receiptStatusClick = () => {
  schedule.value.hasBeenPaid = !schedule.value.hasBeenPaid;
};

/** 总价输入事件 */
const totalPriceInput = (e: any) => {
  e as InputOnInputEvent;
  schedule.value.totalPrice = e.detail.value;
};

/** 定金输入事件 */
const earnestInput = (e: any) => {
  e as InputOnInputEvent;
  schedule.value.deposit = e.detail.value;
};

// #endregion

// #region 备注相关

/**
 * 备注输入
 * @param e 事件对象
 */
const remarkInput = (e: any) => {
  e as TextareaOnInputEvent;
  schedule.value.remark = e.detail.value;
};

// #endregion

// #region 删除和完成按钮相关

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

/** 点击「完成」按钮 */
const clickFinishBtn = async () => {
  try {
    const res = await reqEditSchedule(schedule.value);
    if (res?.data?.code === 200) {
      showToast('修改成功');
      getScheduleListAfterToday();
      setTimeout(() => {
        navigateTo('schedules');
      }, 500);
    } else {
      showToast('修改失败，请稍后重试');
    }
  } catch (e) {
    console.error(e);
  }
};

// #endregion
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;

  display: grid;
  grid-template:
    'nav-bar' min-content
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
      'date-picker date-picker' min-content
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
      '. .' 1fr
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

      padding: 20px 0 9px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .left {
        font-size: 3.8462vw;
        color: #333;
      }

      .right {
        .icon {
          width: 3.0769vw;
          height: 3.0769vw;
        }
      }
    }

    .date-picker {
      grid-area: date-picker;
    }

    //举办地点
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
        }

        .hr {
          grid-area: hr;

          width: 100%;
          height: 100%;

          background-color: #ccc;
        }

        .phone {
          grid-area: phone;
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
        width: 12.8205vw;

        font-size: 15px;
        color: #333;
      }

      .right {
        font-size: 15px;
        text-align: end;
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
