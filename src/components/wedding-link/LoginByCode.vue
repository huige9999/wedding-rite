<!-- 「验证码登录」组件 -->
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
        手机号码
      </text>
      <input
        v-model="phoneNumber"
        class="input"
        type="number"
        maxlength="11"
      >
    </div>
    <!-- 验证码输入框 -->
    <div class="code-input">
      <text class="text">
        验证码
      </text>
      <input
        v-model="code"
        class="input"
        type="number"
        maxlength="6"
      >
      <div
        class="get-code"
        :class="time > 0 ? 'disable':''"
        @click="getCodeClick"
      >
        {{ time > 0 ? `${time}s` : '获取验证码' }}
      </div>
    </div>
    <!-- 「确定」按钮 -->
    <div
      class="confirm-btn"
      :class="`disable`"
      @click="confirm"
    >
      确定
    </div>
    <!-- 「验证码登录」按钮 -->
    <div
      class="code-login-btn"
      @click="emits('password-login-click')"
    >
      密码登录
    </div>
  </div>
</template>

<script setup lang="ts">
import { isPhoneNum, showToast } from '@/utils/tools';

type Emits = {
  // 获取验证码按钮点击事件
  (event: 'get-code-click', phoneNumber: string):void
  // 「确定」按钮点击事件
  (event: 'confirm', form: { phoneNumber: string, code: string }): void,
  // 「密码登录」按钮点击事件
  (event: 'password-login-click'):void
}

const emits = defineEmits<Emits>();

/** 账号 */
let phoneNumber:string;

/** 密码 */
let code:string;

/** 二维码重新获取时间 */
const time = ref(0);

/** 设置获取二维码倒计时 */
const setGetCodeTime = () => {
  time.value = 60;
  const timer = setInterval(() => {
    time.value -= 1;
    if (time.value <= 0) {
      clearInterval(timer);
    }
  }, 1000);
};

/** 关闭二维码倒计时 */
const closeGetCodeTime = () => {
  time.value = 0;
};

/** 「获取验证码」点击事件 */
const getCodeClick = () => {
  if (time.value > 0) return;
  // 校验账号
  if (!isPhoneNum(phoneNumber)) {
    showToast('请输入正确的手机号码');
    return;
  }
  setGetCodeTime();
  emits('get-code-click', phoneNumber);
};

/** 「确定」按钮点击事件 */
const confirm = () => {
  console.log('confirm', phoneNumber, code);
  // 校验账号
  if (!isPhoneNum(phoneNumber)) {
    showToast('请输入正确的手机号码');
    return;
  }

  // 校验验证码
  if (!code) {
    showToast('请输入验证码');
    return;
  }

  emits('confirm', {
    phoneNumber,
    code,
  });
};

defineExpose({
  setGetCodeTime,
  closeGetCodeTime,
  confirm,
});

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
    'code-input' min-content
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

  // 验证码输入框
  .code-input{
    grid-area: code-input;

    // 获取验证码
    .get-code{
      grid-area: right;
      justify-self: end;

      color: #2F80ED;
    }
  }

  // 账号输入框，验证码输入框
  .account-input, .code-input{
    width: calc(100vw - 48px);
    height: 50px;

    border-bottom: #eaeaea 1px solid;

    display: grid;
    grid-template:
      'text input right' / 80px 1fr 80px;
    column-gap: 10px;
    align-items: center;

    .text{
      grid-area: text;

      color: #333;
    }

    .input{
      grid-area: input;

      width: 100%;
      height: 100%;

      color: #212125;
    }
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
