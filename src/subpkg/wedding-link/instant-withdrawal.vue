<!-- 「立即提现」页面 -->
<template>
  <div class="container">
    <uni-nav-bar
      class="nav-bar"
      left-icon="left"
      title="立即提现"
      status-bar
      :border="false"
      background-color="#00000000"
      @click-left="back"
    />
    <!-- 主体部分 -->
    <div class="main">
      <!-- 提现到微信钱包 -->
      <div class="withdraw-to-wx-wallet">
        <image
          class="icon"
          src="https://ustatic.hudongmiao.com/%20miao/zfbIcon.png"
        />
        <span class="label">提现到支付宝</span>
        <span class="tip" @click="showBind" v-if="!userInfo.zfb_account || !userInfo.zfb_name">未绑定支付宝，点击绑定</span>
        <span class="tip" v-else>{{userInfo.zfb_account.slice(0,3) + '****' + userInfo.zfb_account.slice(7)}}</span>
      </div>
      <!-- 提现金额 -->
      <div class="withdraw-amount">
        <div class="label">提现金额</div>
        <!-- 货币符号 -->
        <span class="currency-symbol">¥</span>
        <input
          class="input"
          type="digit"
          inputmode="numeric"
          placeholder="请输入提现金额"
          v-model="withdrawNum"
        />
        <!-- 「全部」按钮 -->
        <div class="all-btn" @click="allMyMoney">全部</div>

        <!-- 分割线 -->
        <div class="hr" />
        <!-- 提现提示 -->
        <span class="tip">
          提现金额不少于
          <span class="emphasis">1</span>
          元
        </span>
      </div>
      <!-- 「立即提现」按钮 -->
      <div class="withdraw-now-btn" @click="withDrawClick">立即提现</div>
    </div>
    <!-- 绑定支付宝弹窗 -->
    <uni-popup ref="bindZfb" type="center">
      <div class="bind-zfb-container">
        <div class="title">绑定支付宝</div>
        <div class="form-container">
          <div class="form-item">
            <div class="form-label">真实姓名：</div>
            <input
              class="form-input"
              v-model="realname"
              placeholder="请输入您的真实姓名"
            />
          </div>
          <div class="form-item">
            <div class="form-label">支付宝账号：</div>
            <input
              class="form-input"
              type="number"
              v-model="zfb_account"
              placeholder="请输入您的支付宝账号"
            />
          </div>
        </div>
        <div class="handler">
          <div class="btn" @click="bindZfbClick">确定</div>
          <div class="btn" @click="close">取消</div>
        </div>
      </div>
    </uni-popup>
  </div>
</template>

<script lang="ts" setup>
import { bindZfbApi, withdrawMyMoney } from '@/api/user-api';
import useUser from '@/stores/user-store';
import { back } from '@/utils/navigate';
import { showToast } from '@/utils/tools';

const currentInstance = getCurrentInstance() as any;

const userStore = useUser();
const { updateUserZfb, updateRemainMoney } = userStore;
const { userInfo } = storeToRefs(userStore)

/** 绑定支付宝 */
const showBind = () => {
  currentInstance.refs.bindZfb.open();
};

// #region 绑定支付宝

/** 真实姓名 */
const realname = ref('');
/** 支付宝账号 */
const zfb_account = ref('');

/** 关闭弹窗 */
const close = () => {
  realname.value = '';
  zfb_account.value = '';
  currentInstance.refs.bindZfb.close();
};

/** 绑定 */
const bindZfbClick = async () => {
  const res = await bindZfbApi(zfb_account.value, realname.value) as any;
  if (res && res?.data && res?.data?.data && String(res.data.data.code) === '200') {
    showToast('绑定成功')
    updateUserZfb(zfb_account.value, realname.value);
    setTimeout(() => {
      close();
    }, 1500)
  } 
  
}

/** 提现的金额 */
const withdrawNum = ref('')
/** 提现按钮 */
const withDrawClick = async () => {
  // 判断提现金额是否小于等于账户余额
  if (Number(withdrawNum.value) > Number(userInfo.value.account_remain)) {
    showToast('当前账户可提现余额不足~')
    return;
  }
  // 判断余额
  if (Number(withdrawNum.value) < 1) {
    showToast('提现金额不能少于1元~')
    return;
  }
  
  const res = await withdrawMyMoney(String(withdrawNum.value)) as any;
  console.log('提现结果', res);
  if (res && res?.data && res?.data?.data && res?.data?.data && String(res?.data?.data.result_code) === 'SUCCESS') {
    showToast('操作成功~')
    updateRemainMoney(withdrawNum.value);
    setTimeout(() => {
      // 更新金额
      uni.navigateBack();
    }, 1500)
  } else {
    showToast('提现失败，请稍后重试');
    return;
  }
}
/** 全部余额 */
const allMyMoney = () => {
  withdrawNum.value = String(userInfo.value.account_remain || 0);
}
// #endregion
</script>

<style lang="scss" scoped>
.container {
  width: 100vw;
  min-height: 100vh;

  background-color: #f9f9f9;

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

    padding: 20px 12px;
    display: grid;
    grid-template:
      'withdraw-to-wx-wallet' 14.6154vw
      '.' 12px
      'withdraw-amount' 39.2308vw
      '.' 148px
      'withdraw-now-btn'
      /1fr;

    // 提现到微信钱包
    .withdraw-to-wx-wallet {
      grid-area: withdraw-to-wx-wallet;

      width: 100%;
      height: 100%;

      background-color: #fff;

      padding: 31rpx 23rpx;
      display: grid;
      grid-template:
        'icon label tip' 1fr
        /6.1538vw 1fr max-content;
      column-gap: 8px;
      align-items: center;

      .icon {
        width: 6.1538vw;
        height: 6.1538vw;
      }

      .label {
        font-size: 4.6154vw;
        font-weight: bold;
        color: #010101;
      }

      .tip {
        justify-self: end;

        font-size: 3.5897vw;
        color: #8d8d8d;
        text-decoration: underline;
      }
    }

    // 提现金额
    .withdraw-amount {
      grid-area: withdraw-amount;

      width: 100%;
      height: 100%;

      background-color: #fff;

      padding: 31rpx 31rpx 19rpx;
      display: grid;
      grid-template:
        'label label label' 5.1282vw
        '. . .' 1fr
        'currency-symbol input all-btn' 11.7949vw
        '. . .' 9px
        'hr hr hr' 1px
        '. . .' 1fr
        'tip tip tip' 4.359vw
        /12vw 1fr max-content;
      align-items: center;

      .label {
        grid-area: label;

        font-size: 3.5897vw;
        color: #8d8d8d;
      }

      .currency-symbol {
        grid-area: currency-symbol;
        margin-left: 4px;

        position: relative;

        font-size: 8.2051vw;
        color: #333;

        // 分割线
        &::after {
          position: absolute;
          top: 50%;
          right: 12px;

          width: 2px;
          height: 11.7949vw;

          content: '';

          background-color: #333;

          transform: translateY(-50%);
        }
      }

      .input {
        grid-area: input;
      }

      .all-btn {
        grid-area: all-btn;

        width: 108rpx;
        height: 56rpx;

        background: #333;
        border-radius: 27px;

        display: flex;
        align-items: center;
        justify-content: center;

        font-size: 3.0769vw;
        color: #fff;
      }

      .hr {
        grid-area: hr;

        height: 1px;

        background-color: rgba($color: #ccc, $alpha: 40%);
      }

      .tip {
        grid-area: tip;

        font-size: 12px;
        color: #8d8d8d;

        .emphasis {
          color: #eb5757;
        }
      }
    }

    // 「立即提现」按钮
    .withdraw-now-btn {
      grid-area: withdraw-now-btn;
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

  .bind-zfb-container {
    width: 80vw;
    padding: 46rpx 31rpx;
    box-sizing: border-box;
    background-color: #fff;
    border-radius: 19rpx;
    display: flex;
    flex-direction: column;
    align-items: center;

    .title {
      margin-bottom: 38rpx;
      font-size: 38rpx;
    }
    .form-container {
      width: 100%;
      margin-bottom: 58rpx;
      .form-item {
        width: 100%;
        height: 81rpx;
        border-bottom: 2rpx solid rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        justify-content: flex-start;
        font-size: 27rpx;
        .form-label {
          width: 173rpx;
          flex-shrink: 0;
        }
        .form-input {
          flex: 1;
          font-size: 27rpx;
        }
      }
    }
    .handler {
      width: 50vw;
      display: flex;
      flex-direction: column;
      align-items: center;
      .btn {
        width: 100%;
        height: 77rpx;
        color: #a95100;
        background-image: linear-gradient(270deg, #ffbe48 0%, #ffedb4);
        text-align: center;
        line-height: 77rpx;
        border-radius: 77rpx;
        font-weight: bold;
        &:last-of-type {
          margin-top: 19rpx;
          background-image: none;
          color: rgba(0, 0, 0, 0.4);
        }
      }
    }
  }
}
</style>
