<!-- 「个人收益」页面 -->
<template>
  <div class="container">
    <!-- 头部背景 -->
    <image
      class="head-bg"
      src="https://ustatic.hudongmiao.com/joymewCustomer/screenTheme/1687767197333andR197BBVUSHF2"
      mode="aspectFill"
    />
    <!-- 导航栏 -->
    <uni-nav-bar
      class="nav-bar"
      left-icon="left"
      title="个人收益"
      status-bar
      :border="false"
      background-color="#00000000"
      color="#fff"
      @click-left="back"
    />
    <!-- 主体部分 -->
    <div class="main">
      <!-- 可提现金额 -->
      <div class="withdrawable-amount">
        <div class="label">
          可提现金额：
        </div>
        <div class="amount">
          <span class="num">{{ withdrawableAmount.toFixed(2) }}</span>
          <span class="unit">元</span>
        </div>
      </div>
      <!-- 提现按钮 -->
      <div
        class="withdraw-btn"
        @click="navigateTo('instant-withdrawal')"
      >
        提现
      </div>
      <!-- 已提现金额 -->
      <div class="withdrawn-amount">
        <div class="amount">
          {{ withdrawnAmount.toFixed(2) }}元
        </div>
        <div class="label">
          已提现
        </div>
      </div>
      <!-- 总收益 -->
      <div class="total-amount">
        <div class="amount">
          {{ totalIncome.toFixed(2) }}元
        </div>
        <div class="label">
          总收益
        </div>
      </div>
      <!-- 中间部分 -->
      <div class="center">
        <!-- 已激活用户数量 -->
        <div
          class="activated-user-count"
          @click="navigateTo('activated-users')"
        >
          <div class="count">
            {{ activatedInviteUserList.length }}人
          </div>
          <div class="label">
            已激活用户数量
          </div>
        </div>
        <!-- 未激活用户数量 -->
        <div
          class="unactivated-user-count"
          @click="navigateTo('unactivated-users')"
        >
          <div class="count">
            {{ unactivatedInviteUserList.length }}人
          </div>
          <div class="label">
            未激活用户数量
          </div>
        </div>
        <!-- 获得佣金提示 -->
        <div class="commission-tip">
          <image
            class="bg"
            src="@/static/images/my/tip-bg.png"
          />
          <div class="text">
            通过您的分享成功激活成为我们Wedding Rite VIP，您将获得20%的佣金
          </div>
        </div>
      </div>
      <!-- 菜单 -->
      <div class="menu">
        <!-- 「我的账户」菜单项 -->
        <div
          class="my-account menu-item"
          @click="navigateTo('my-account')"
        >
          <span class="text">我的账户</span>
          <image
            class="icon"
            src="@/static/icons/common/right-gray.svg"
          />
        </div>
        <!-- 「去分享」菜单项 -->
        <div
          class="share menu-item"
          @click="navigateTo('invite-and-earn')"
        >
          <span class="text">去分享</span>
          <image
            class="icon"
            src="@/static/icons/common/right-gray.svg"
          />
        </div>
        <!-- 「联系客服」菜单项 -->
        <div class="contact-service menu-item">
          <!-- 用于跳转到联系客服的隐藏按钮 -->
          <button
            open-type="contact"
            class="btn"
          />
          <span class="text">联系客服</span>
          <image
            class="icon"
            src="@/static/icons/common/right-gray.svg"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reqGetWithdrawInfo } from '@/api/user-api';
import useUser from '@/stores/user-store';
import { back, navigateTo } from '@/utils/navigate';

const userStore = useUser();
const { activatedInviteUserList, unactivatedInviteUserList } = storeToRefs(userStore);
const { getActivatedInviteUserList, getUnactivatedInviteUserList } = userStore;

/** 可提现金额 */
const withdrawableAmount = ref(0);

/** 已提现金额 */
const withdrawnAmount = ref(0);

/** 总收益金额 */
const totalIncome = ref(0);

// 页面挂载时获取数据
onMounted(async () => {
  // 获取提现信息
  const resData = (await reqGetWithdrawInfo())?.data as ResData<AnyObject>;
  withdrawableAmount.value = resData?.data?.balance_withdraw || 0;
  withdrawnAmount.value = resData?.data?.withdrawnAmount || 0;
  totalIncome.value = resData?.data?.totalIncome || 0;

  // 获取用户数量
  getActivatedInviteUserList();
  getUnactivatedInviteUserList();
});
</script>

<style lang="scss" scoped>
.container {
  position: relative;

  width: 100vw;
  min-height: 100vh;

  background-color: #f9f9f9;

  display: grid;
  grid-template:
    'nav-bar' auto
    'main' 1fr
    /100vw;

  // 头部背景
  .head-bg {
    position: absolute;
    top: 0;
    left: 0;

    width: 100vw;
    height: 74.6154vw;
  }

  .nav-bar {
    grid-area: nav-bar;
  }

  .main {
    grid-area: main;

    z-index: 1;

    padding-top: 20px;
    display: grid;
    grid-template:
      'withdrawable-amount withdraw-btn' 18.2051vw
      '. .' 48px
      'withdrawn-amount total-amount' 11.0256vw
      '. .' 49px
      'center center' min-content
      '. .' 12px
      'menu menu' min-content
      / 1fr 1fr;

    // 可提现金额
    .withdrawable-amount {
      grid-area: withdrawable-amount;

      padding-left: 27px;
      display: flex;
      flex-direction: column;
      row-gap: 10px;
      justify-content: center;

      .label {
        font-size: 4.359vw;
        color: #fff;
      }

      .amount {
        .num {
          // 文字渐变色
          background: linear-gradient(293deg, #ffd175 0%, #ffe8b7);
          background-clip: text;

          font-size: 28px;
          font-weight: bold;
          -webkit-text-fill-color: transparent;
        }

        .unit {
          font-size: 17px;
          color: #fff;
        }
      }
    }

    // 提现按钮
    .withdraw-btn {
      grid-area: withdraw-btn;
      align-self: center;
      justify-self: end;
      margin-right: 24px;

      width: 23.5897vw;
      height: 9.2308vw;

      background: linear-gradient(292deg, #ffd175 0%, #ffe8b7);
      border-radius: 10.2564vw;

      display: flex;
      align-items: center;
      justify-content: center;

      font-size: 3.5897vw;
      color: #704c00;
    }

    // 已提现金额
    .withdrawn-amount,
    .total-amount {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .amount {
        font-size: 3.5897vw;
        color: #fff;
      }

      .label {
        font-size: 3.5897vw;
        color: #fff;
      }
    }

    .withdrawn-amount {
      grid-area: withdrawn-amount;

      position: relative;

      // 分割线
      &::after {
        position: absolute;
        top: 50%;
        right: 0;

        width: 1px;
        height: 8.2051vw;

        content: '';

        background-color: rgba($color: #f8f8f8, $alpha: 60%);

        transform: translateY(-50%);
      }
    }

    // 总金额
    .total-amount {
      grid-area: total-amount;
    }

    // 中间部分
    .center {
      grid-area: center;
      justify-self: center;

      width: 93.8462vw;
      height: 32.8205vw;

      background: #fff;
      border-radius: 2px;

      padding-top: 16px;
      display: grid;
      grid-template:
        'activated-user-count unactivated-user-count' 12.0513vw
        'tip tip' 10.5128vw
        / 1fr 1fr;
      row-gap: 16px;

      // 已激活用户数量，未激活用户数量
      .activated-user-count,
      .unactivated-user-count {
        display: flex;
        flex-direction: column;
        row-gap: 3px;
        align-items: center;
        justify-content: center;

        .count {
          font-size: 4.359vw;
          color: #333;
        }

        .label {
          font-size: 14px;
          color: #27ae60;
        }
      }

      // 已激活用户数量
      .activated-user-count {
        grid-area: activated-user-count;
      }

      // 未激活用户数量
      .unactivated-user-count {
        grid-area: unactivated-user-count;

        .label {
          color: #eb5757;
        }
      }

      // 获得佣金提示
      .commission-tip {
        grid-area: tip;

        position: relative;

        display: flex;
        align-items: center;
        justify-content: center;

        .bg {
          position: absolute;
          bottom: 0;
          left: 50%;

          width: 89.7436vw;
          height: 10.5128vw;

          transform: translateX(-50%);
        }

        .text {
          z-index: 1;

          font-size: 3.0769vw;
          color: #f8d58f;
        }
      }
    }

    // 菜单
    .menu {
      grid-area: menu;

      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      // 菜单项
      .menu-item {
        width: 93.8462vw;
        height: 15.641vw;

        background-color: #fff;
        border-bottom: 1px solid #f3f3f3;
        border-radius: 2px;

        padding: 0 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .text {
          font-size: 3.8462vw;
          color: #333;
        }

        .icon {
          width: 16px;
          height: 16px;
        }
      }

      // 「联系客服」菜单项
      .contact-service {
        position: relative;

        border-bottom: none;

        // 隐藏的按钮
        .btn {
          position: absolute;
          top: 0;
          left: 0;

          width: 100%;
          height: 100%;

          opacity: 0;
        }
      }
    }
  }
}
</style>
