<!-- 「找回密码」组件 -->
<template>
  <div class="container">
    <!-- 标题 -->
    <div class="title">
      找回密码
    </div>
    <!-- 提示 -->
    <div class="tip">
      请验证手机号并设置新的密码
    </div>
    <!-- 账号输入框 -->
    <div class="phone-input">
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
    <!-- 新密码输入框 -->
    <div class="new-password-input">
      <text class="text">
        新密码
      </text>
      <input
        v-model="newPassword"
        class="input"
        password
      >
    </div>
    <!-- 「确定」按钮 -->
    <div
      class="confirm-btn"
      :class="confirmBtnDisable ? 'disable' : ''"
      @click="confirm"
    >
      确定
    </div>
    <!-- 「验证码登录」按钮 -->
    <div
      class="code-login-btn"
      @click="emits('back-to-login')"
    >
      返回登录
    </div>
  </div>
</template>

<script setup lang="ts">
import { isPhoneNum, showToast } from '@/utils/tools';

type Emits = {
  // 获取验证码按钮点击事件
  (event: 'get-code-click', phoneNumber: string):void
  // 「确定」按钮点击事件
  (event: 'confirm', form: { phoneNumber: string, code: string, newPassword:string }): void,
  // 「返回登录」按钮点击事件
  (event: 'back-to-login'):void
}

const emits = defineEmits<Emits>();

const phoneNumber = ref('');

/** 验证码 */
const code = ref('');

/** 密码 */
const newPassword = ref('');

/** 「确定」按钮是否可用，只要有一项未填就禁用 */
const confirmBtnDisable = computed(() => !phoneNumber.value || !code.value || !newPassword.value);

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

/** 关闭获取二维码倒计时 */
const closeGetCodeTime = () => {
  time.value = 0;
};

/** 「获取验证码」点击事件 */
const getCodeClick = () => {
  if (time.value > 0) return;
  // 校验账号
  if (!isPhoneNum(phoneNumber.value)) {
    showToast('请输入正确的手机号码');
    return;
  }
  setGetCodeTime();
  emits('get-code-click', phoneNumber.value);
};

/** 「确定」按钮点击事件 */
const confirm = () => {
  // 如果按钮不可用，直接返回
  if (confirmBtnDisable.value) return;

  // 校验账号
  if (!isPhoneNum(phoneNumber.value)) {
    showToast('请输入正确的手机号码');
    return;
  }

  // 校验验证码
  if (!code.value) {
    showToast('请输入验证码');
  }

  // 校验密码
  if (!newPassword.value) {
    showToast('请输入密码');
  } else if (newPassword.value.length < 3) {
    showToast('密码长度不能小于3位');
  }

  emits('confirm', {
    phoneNumber: phoneNumber.value,
    code: code.value,
    newPassword: newPassword.value,
  });
};

defineExpose({
  setGetCodeTime,
  closeGetCodeTime,
});

</script>

<style scoped lang="scss">
.container{
  width: 100%;
  height: 100%;

  padding: 62px 24px 25px;
  display: grid;
  grid-template:
    'title' min-content
    '.' 12px
    'tip' min-content
    '.' 56px
    'phone-input' min-content
    '.' 9.2308vw
    'code-input' min-content
    '.' 9.2308vw
    'new-password-input' min-content
    '.' minmax(30px, 1fr)
    'confirm-btn' min-content
    '.' 4.1026vw
    'code-login-btn' min-content
    / 1fr;
  justify-items: center;

  // 标题
  .title{
    grid-area: title;
    justify-self: start;

    font-size: 24px;
    font-weight: bold;
    color: #333;
  }

  // tip
  .tip{
    grid-area: tip;
    justify-self: start;

    font-size: 14px;
    color: #8d8d8d;
  }

  // 账号输入框
  .phone-input{
    grid-area: phone-input;
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

  // 新密码输入框
  .new-password-input{
    grid-area: new-password-input;
  }

  // 账号输入框，验证码输入框
  .phone-input,
  .code-input,
  .new-password-input{
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

    // 禁用
    &.disable{
      background: #bcbcbe;
    }
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
