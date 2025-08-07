<!-- 「我的账户」页面 -->
<template>
  <div class="container">
    <uni-nav-bar
      class="nav-bar"
      left-icon="left"
      title="我的账户"
      status-bar
      :border="false"
      background-color="#00000000"
      @click-left="back"
    />
    <!-- 主体部分 -->
    <div class="main">
      <!-- 可提现金额 -->
      <div class="cash">
        <!-- 背景 -->
        <image
          class="bg"
          src="https://ustatic.hudongmiao.com/joymewCustomer/screenTheme/1687772915643andZX5O8BWKTC27"
          mode="aspectFill"
        />
        <div class="title">
          可提现金额
        </div>
        <div class="value">
          <span class="amount">{{ Number(userInfo.account_remain || 0).toFixed(2) }}</span>
          <span class="unit">元</span>
        </div>
        <!-- 提现按钮 -->
        <div
          class="withdraw-btn"
          @click="clickWithdraw"
        >
          提现
        </div>
      </div>
      <!-- 提现记录 -->
      <div class="withdraw-record">
        <div class="title">
          提现记录
        </div>
        <!-- 提现记录项 -->
        <div
          v-for="record in recordList"
          :key="record.user_id"
          class="record-item"
        >
          <!-- 头像 -->
          <image
            class="avatar"
            :src="record.user_avator"
            mode="aspectFill"
          />
          <!-- 文本描述 -->
          <div class="text">
            {{ '提现到支付宝' }}
          </div>
          <!-- 时间 -->
          <div class="time">
            {{ record.time }}
          </div>
          <!-- 金额 -->
          <div class="value negative">
            {{ '-' + record.account + '元' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getWithdrawRecord } from '@/api/user-api';
import useUser from '@/stores/user-store';
import { back, navigateTo } from '@/utils/navigate';

const userStore = useUser();
const { userInfo } = storeToRefs(userStore);

onShow(() => {
  getRecordList();
});

/** 提现记录列表 */
const recordList = ref<WithDrawRecordItem[]>([]);

/** 获取提现记录 */
const getRecordList = async () => {
  const res = await getWithdrawRecord() as any;
  if (res && res?.data && res?.data?.data) {
    const copy = res.data.data;
    recordList.value = copy.map((item: any, index: number) => {
      const { avator, finish_time, redsum } = item;
      return {
        user_avator: avator,
        time: finish_time,
        user_id: index + 1,
        account: String(redsum),
      };
    });
  }
};

const clickWithdraw = () => {
  uni.showToast({
    title: '请前往嗨喵APP继续完成操作',
    icon: 'none',
  });
};
</script>

<style lang="scss" scoped>
.container {
  width: 100vw;
  min-height: 100vh;

  display: grid;
  grid-template:
    'nav-bar' auto
    'main' 1fr
    /100vw;

  .nav-bar {
    grid-area: nav-bar;
  }

  .main {
    grid-area: main;

    position: relative;

    padding: 16px 12px;
    display: flex;
    flex-direction: column;
    row-gap: 16px;
    align-items: center;

    // 可提现金额
    .cash {
      position: relative;

      width: 100%;
      height: 38.4615vw;

      padding: 20px 0 16px;
      display: grid;
      grid-template:
        'title' 6.1538vw
        '.' 1fr
        'value' 8.7179vw
        '.' 1fr
        'withdraw-btn' 7.1795vw
        /1fr;
      justify-items: center;

      // 背景
      .bg {
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;

        width: 100%;
        height: 100%;
      }

      // 标题
      .title {
        grid-area: title;

        font-size: 4.359vw;
        color: #fff;
      }

      // 金额
      .value {
        grid-area: value;

        .amount {
          background: linear-gradient(293deg, #ffd175 0%, #ffe8b7);
          background-clip: text;

          font-size: 7.1795vw;
          font-weight: bold;
          -webkit-text-fill-color: transparent;
        }

        .unit {
          font-size: 4.359vw;
          color: #fff;
        }
      }

      // 提现按钮
      .withdraw-btn {
        grid-area: withdraw-btn;

        width: 93px;
        height: 28px;

        background: linear-gradient(287deg, #ffd175 0%, #ffe8b7);
        border-radius: 40px;

        display: flex;
        align-items: center;
        justify-content: center;

        font-size: 3.0769vw;
        color: #704c00;
      }
    }

    // 提现记录
    .withdraw-record {
      width: 100%;

      padding: 0 0 16px;
      display: flex;
      flex-direction: column;
      row-gap: 12px;

      // 标题
      .title {
        width: 100%;
        height: 6.1538vw;

        display: flex;
        align-items: center;

        font-size: 3.5897vw;
        color: #333;
      }

      // 提现记录项
      .record-item {
        width: 100%;
        height: 9.4872vw;

        display: grid;
        grid-template:
          'avatar text value .' 1fr
          'avatar time value .' 1fr
          /8.2051vw 1fr 15.3846vw 12px;
        column-gap: 8px;
        align-items: center;

        // 头像
        .avatar {
          grid-area: avatar;

          width: 8.2051vw;
          height: 8.2051vw;

          border-radius: 50%;
        }

        // 文本描述
        .text {
          grid-area: text;

          font-size: 3.5897vw;
          color: #333;
        }

        // 时间
        .time {
          grid-area: time;

          font-size: 3.0769vw;
          color: #8d8d8d;
        }

        // 金额
        .value {
          grid-area: value;
          justify-self: end;

          font-size: 5.1282vw;
          color: #27ae60;

          // 负数
          &.negative {
            color: #eb5757;
          }
        }
      }
    }
  }
}
</style>
