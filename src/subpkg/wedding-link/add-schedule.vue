<!--
  * 添加档期页面
  * @author: Ruan Jiazhen
  * @date: 2024-04-28  17:30:26
-->
<template>
  <div class="container">
    <uni-nav-bar
      class="nav-bar"
      left-icon="left"
      title="添加档期"
      status-bar
      :border="false"
      @click-left="back"
    />
    <!-- 主体部分 -->
    <div class="main">
      <!-- 日期 -->
      <picker-view
        class="date"
        indicator-style="height: 13.3333vw;"
        @change="pickerViewChange"
      >
        <picker-view-column>
          <view
            v-for="(item, index) in years"
            :key="index"
            class="item"
          >
            {{ item }}年
          </view>
        </picker-view-column>
        <picker-view-column>
          <view
            v-for="(item, index) in months"
            :key="index"
            class="item"
          >
            {{ item }}月
          </view>
        </picker-view-column>
        <picker-view-column>
          <view
            v-for="(item, index) in days"
            :key="index"
            class="item"
          >
            {{ item }}日
          </view>
        </picker-view-column>
        <picker-view-column>
          <view
            v-for="(item, index) in periods"
            :key="index"
            class="item"
          >
            {{ item }}
          </view>
        </picker-view-column>
      </picker-view>
      <!-- 举办地点 -->
      <div class="address">
        <div class="left">
          举办地点
        </div>
        <div
          class="right"
          @click="addressClick"
        >
          <div
            class="text"
            :class="address ? 'selected' : ''"
          >
            {{ address || '请输入' }}
          </div>
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
              :src="type === 'unbooked' ? checkedRadio : uncheckedRadio"
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
              :src="type === 'booked' ? checkedRadio : uncheckedRadio"
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
            :value="customerName"
            @input="customerNameInput"
          >
          <div class="hr" />
          <input
            class="phone"
            placeholder="手机号"
            type="tel"
            :value="customerPhone"
            @input="customerPhoneInput"
          >
        </div>
      </div>
      <!-- 添加联系人 -->
      <!-- <div class="add-customer">
        <image class="icon" src="@/static/icons/common/plus.svg" mode="aspectFit" />
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
            :src="hasBeenPaid ? checkedCheckBox : uncheckedCheckBox"
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
          @input="earnestInput"
        >
      </div>
      <!-- 备注 -->
      <textarea
        class="remark"
        placeholder="备注说明"
        maxlength="150"
        :data-length="remark.length"
        @input="remarkInput"
      />
      <!-- 「保存」按钮 -->
      <div
        class="save-btn"
        @click="saveBtnClick"
      >
        保存
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reqSaveSchedule } from '@/api/schedule-api';
import checkedCheckBox from '@/static/icons/common/check-box-checked.svg';
import uncheckedCheckBox from '@/static/icons/common/check-box.svg';
import checkedRadio from '@/static/icons/common/radio-checked.svg';
import uncheckedRadio from '@/static/icons/common/radio.svg';
import { useSchedule } from '@/stores/schedule-store';
import { back } from '@/utils/navigate';
import { showToast } from '@/utils/tools';
import { uniAuthorize, uniChooseLocation } from '@/utils/uniapp-api-promised';
import type { InputOnInputEvent, PickerViewOnChangeEvent, TextareaOnInputEvent } from '@uni-helper/uni-app-types';
import lunisolar from 'lunisolar';

const scheduleStore = useSchedule();
const { getScheduleListAfterToday } = scheduleStore;

// #region 日期选择相关

/** 今天日期 */
const today = lunisolar();

/** 当前选择的值 */
const currentValues = ref([0, 0, 0, 0]);

/** 年份，从今年开始往后推 10 年 */
const years = computed(() => {
  const currentYear = lunisolar().year;
  const temYears = [];
  for (let i = 0; i < 10; i += 1) {
    temYears.push(currentYear + i);
  }
  return temYears;
});

/** 可选择的月份 */
const months = computed(() => {
  const year = years.value[currentValues.value[0]];

  // 如果不是今年，那么就是 12 个月
  if (year !== today.year) {
    return Array.from(
      { length: 12 },
      (_, i) => i + 1,
    );
  }
  // 如果是今年，那么就是从当前月份开始往后推 12 个月
  return Array.from(
    { length: 12 - today.month + 1 },
    (_, i) => i + today.month,
  );
});

/** 可选择的日期 */
const days = computed(() => {
  const year = years.value[currentValues.value[0]];
  const month = months.value[currentValues.value[1]];

  // 如果是当前月份，那么就是从今天开始往后推到月底
  if (year === today.year && month === today.month) {
    return Array.from(
      { length: new Date(year, month, 0).getDate() - today.day + 1 },
      (_, i) => i + today.day,
    );
  }

  // 否则返回该月份的天数
  return Array.from(
    { length: new Date(year, month, 0).getDate() },
    (_, i) => i + 1,
  );
});

/**
 * 选择器修改事件
 * @param e 事件对象
 */
const pickerViewChange = (e: PickerViewOnChangeEvent) => {
  currentValues.value = e.detail.value;
};

/** 当前选择的日期 */
const currentDate = computed(() => {
  const year = years.value[currentValues.value[0]];
  const month = months.value[currentValues.value[1]];
  const day = days.value[currentValues.value[2]];
  return lunisolar(`${year}-${month}-${day}`).format('YYYY-MM-DD');
});

/** 可选择的时段 */
const periods = ref(['早上', '上午', '午宴', '下午', '晚宴', '全天']);

/** 当前选择的时间段 */
const currentPeriod = computed(
  () => periods.value[currentValues.value[3]] as ScheduleInfo['period'],
);

// #endregion

// #region 举办地点相关

/** 举办地点 */
const address = ref('');
/** 点击输入事件 */
const addressClick = async () => {
  try {
    await uniAuthorize('scope.userLocation');
    const res = (await uniChooseLocation()) as UniApp.ChooseLocationSuccess;
    console.log('授权成功', res);
    address.value = res.name;
  } catch (e) {
    console.error('用户拒绝授权', e);
  }
};

// #endregion

// #region 档期类型相关

/** 档期类型 */
const type = ref<ScheduleInfo['type']>('unbooked');
/**
 * 点击档期类型
 * @param t 档期类型
 */
const typeClick = (t: ScheduleInfo['type']) => {
  type.value = t;
};
// #endregion

// #region 客户相关

/** 客户名称 */
const customerName = ref('');
/** 客户电话 */
const customerPhone = ref('');

/**
 * 客户名称输入
 * @param e 事件对象
 */
const customerNameInput = (e: any) => {
  e as InputOnInputEvent;
  customerName.value = e.detail.value;
};

/**
 * 客户电话输入
 * @param e 事件对象
 */
const customerPhoneInput = (e: any) => {
  e as InputOnInputEvent;
  customerPhone.value = e.detail.value;
};

// #endregion

// #region 收款情况相关

/** 收款情况 */
const hasBeenPaid = ref<boolean>(false);

/**
 * 点击收款情况
 */
const receiptStatusClick = () => {
  hasBeenPaid.value = !hasBeenPaid.value;
};

/** 总价 */
const totalPrice = ref('');

/**
 * 总价输入
 * @param e 事件对象
 */
const totalPriceInput = (e: any) => {
  e as InputOnInputEvent;
  totalPrice.value = e.detail.value;
};

/** 定金 */
const deposit = ref('');

/**
 * 定金输入
 * @param e 事件对象
 */
const earnestInput = (e: any) => {
  e as InputOnInputEvent;
  deposit.value = e.detail.value;
};

// #endregion

// #region 备注相关

/** 备注 */
const remark = ref('');

/**
 * 备注输入
 * @param e 事件对象
 */
const remarkInput = (e: any) => {
  e as TextareaOnInputEvent;
  remark.value = e.detail.value;
};

// #endregion

// #region 保存相关

/** 保存按钮点击事件 */
const saveBtnClick = async () => {
  const scheduleInfo: ScheduleInfo = {
    id: '',
    date: currentDate.value,
    period: currentPeriod.value,
    type: type.value,
    address: address.value,
    customerName: customerName.value,
    customerPhone: customerPhone.value,
    hasBeenPaid: hasBeenPaid.value,
    totalPrice: totalPrice.value,
    deposit: deposit.value,
    remark: remark.value,
  };
  console.log('scheduleInfo', scheduleInfo);
  try {
    const res = await reqSaveSchedule(scheduleInfo);
    if ((res?.data as AnyObject).code === 200) {
      getScheduleListAfterToday();
      showToast('添加成功');
      setTimeout(() => {
        back();
      }, 500);
    } else {
      showToast('添加失败，请稍后重试');
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
      'date date' 49.2308vw
      'address address' 12.8205vw
      'type type' 12.8205vw
      'customer customer' 22.3077vw
      /* '. .' 16px*/
      /* 'add-customer add-customer' 5.3846vw*/
      '. .' 20px
      'receipt-status receipt-status' 9.2308vw
      'total-price earnest' 10.2564vw
      '. .' 20px
      'comment comment' 36.9231vw
      '. .' 20px
      'delete-btn delete-btn' 12.3077vw
      '. .' 30px
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

      .item {
        display: flex;
        align-items: center;
        justify-content: center;

        font-size: 15px;
        text-align: center;
      }
    }

    //举办地点
    .address {
      grid-area: address;

      .right {
        display: flex;
        column-gap: 4px;
        align-items: center;
        justify-content: flex-end;

        .text {
          font-size: 3.8462vw;
          color: #8d8d8d;
          text-align: end;

          // 已选择地址
          &.selected {
            color: #333;
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
        }
      }
    }

    // 添加联系人
    .add-customer {
      grid-area: add-customer;
      align-self: center;
      justify-self: center;

      height: 100%;

      display: flex;
      column-gap: 8px;
      align-items: center;
      justify-content: center;

      .icon {
        width: 5vw;
        height: 5vw;
      }

      .text {
        font-size: 3.8462vw;
        color: #333;
      }
    }

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
    .remark {
      grid-area: comment;
      align-self: center;

      position: relative;

      width: 93.8462vw;

      border: 0.5px solid #e5e5e5;
      border-radius: 8px;

      padding: 12px 16px 30px;
      box-sizing: border-box;

      text-align: justify;

      // 字数统计
      &::after {
        position: absolute;
        right: 16px;
        bottom: 8px;

        content: attr(data-length) '/150';

        font-size: 3.8462vw;
        color: #8d8d8d;
      }
    }

    // 删除按钮
    .save-btn {
      grid-area: delete-btn;
      justify-self: center;

      width: 82.0513vw;
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
