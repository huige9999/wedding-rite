<!-- 「密码登录」组件 -->
<template>
  <div class="container">
    <!-- logo -->
    <image
      class="logo"
      src="@/static/icons/common/logo.png"
      mode="aspectFit"
    />
    <!-- slogan -->
    <div class="slogan">
      欢迎来到Wedding Rite，主持人的获客好帮手
    </div>
    <!-- 提示 -->
    <div class="tip">
      为了您更好的使用Wedding Rite系统，需要登录您的账户信息
    </div>
    <!-- 账号输入框 -->
    <div class="account-input">
      <text class="text">
        嗨喵账号
      </text>
      <input
        v-model="account"
        class="input"
        type="number"
        maxlength="11"
      >
    </div>
    <!-- 密码输入框 -->
    <div class="password-input">
      <text class="text">
        嗨喵密码
      </text>
      <input
        v-model="password"
        class="input"
        password
      >
    </div>
    <!-- 忘记密码 -->
    <div
      class="forget-password"
      @click="forgetPasswordClick"
    >
      忘记密码？
    </div>
    <!-- 「确定」按钮 -->
    <div
      class="confirm-btn"
      @click="confirm"
    >
      确定
    </div>
    <!-- 「验证码登录」按钮 -->
    <div
      class="code-login-btn"
      @click="codeLoginClick"
    >
      验证码登录
    </div>
  </div>
</template>

<script setup lang="ts">
import { isPhoneNum, showToast } from '@/utils/tools';

type Emits = {
  // 「忘记密码」按钮点击事件
  (event: 'forget-password-click'):void
  // 「确定」按钮点击事件
  (event: 'confirm', form: { account: string, password: string }): void,
  // 「验证码登录」按钮点击事件
  (event: 'code-login-click'):void
}

const emits = defineEmits<Emits>();

/** 账号 */
let account:string;

/** 密码 */
let password:string;

/** 「忘记密码」按钮点击事件 */
const forgetPasswordClick = () => {
  console.log('forgetPasswordClick');
  emits('forget-password-click');
};

/** 「确定」按钮点击事件 */
const confirm = () => {
  console.log('confirm', account, password);
  // 校验账号
  if (!isPhoneNum(account)) {
    showToast('请输入正确的手机号码');
    return;
  }

  // 校验密码
  if (!password) {
    showToast('请输入密码');
    return;
  }

  emits('confirm', {
    account,
    password,
  });
};

defineExpose({ confirm });

/** 「验证码登录」按钮点击事件 */
const codeLoginClick = () => {
  emits('code-login-click');
};
</script>

<style scoped lang="scss">
.container{
  width: 100%;
  height: 100%;

  padding: 62px 24px 25px;
  display: grid;
  grid-template:
    'logo' min-content
    '.' 15px
    'slogan' min-content
    '.' 3.3333vw
    'tip' min-content
    '.' 10.2564vw
    'account-input' min-content
    '.' 9.2308vw
    'password-input' min-content
    '.' 4.1026vw
    'forget-password' min-content
    '.' minmax(30px, 1fr)
    'confirm-btn' min-content
    '.' 4.1026vw
    'code-login-btn' min-content
    / 1fr;
  justify-items: center;

  // logo
  .logo{
    grid-area: logo;

    width: 30vw;
    height: 30vw;
  }

  // slogan
  .slogan{
    grid-area: slogan;

    font-size: 14px;
    color: #333;
  }

  // tip
  .tip{
    grid-area: tip;

    font-size: 14px;
    color: #c8c8c8;
    text-align: center;
  }

  // 账号输入框
  .account-input{
    grid-area: account-input;
  }

  // 密码输入框
  .password-input{
    grid-area: password-input;
  }

  // 账号输入框
  .account-input, .password-input{
    width: calc(100vw - 48px);
    height: 50px;

    border-bottom: #eaeaea 1px solid;

    display: grid;
    grid-template:
      'text input' / 135rpx 1fr;
    column-gap: 10px;
    align-items: center;

    .text{
      grid-area: text;

      color: #333;
    }

    .input{
      grid-area: input;

      color: #212125;
    }
  }

  // 忘记密码
  .forget-password{
    grid-area: forget-password;
    justify-self: start;

    font-size: 14px;
    color: #8d8d8d;
  }

  // 「确定」按钮
  .confirm-btn{
    grid-area: confirm-btn;

    width: 82.0513vw;
    height: 12.3077vw;

    background: #212125;
    border-radius: 40px;

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 14px;
    color: #fff;
  }

  // 「验证码登录」按钮
  .code-login-btn{
    grid-area: code-login-btn;

    width: 82.0513vw;
    height: 12.3077vw;

    border: 1px solid #e0e0e0;
    border-radius: 40px;

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 14px;
    font-weight: bold;
    color: #212125;
  }
}
</style>
