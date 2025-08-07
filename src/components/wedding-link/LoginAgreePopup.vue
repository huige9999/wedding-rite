<!-- 「登录」页面的同意用户协议弹窗 -->
<template>
  <uni-popup
    ref="popup"
    type="center"
  >
    <div class="container">
      <div class="text">
        <p>阅读并同意以下条款</p>
        <p>我已阅读并同意<span class="height-light">《用户隐私协议》</span></p>
      </div>
      <div
        class="agree-btn"
        @click="agreeBtnClick"
      >
        同意并继续
      </div>
      <div
        class="cancel"
        @click="close"
      >
        取消
      </div>
    </div>
  </uni-popup>
</template>

<script setup lang="ts">
import type { UniPopup } from '@uni-helper/uni-ui-types';

const ctx = getCurrentInstance();

type Emit = {
  (e: 'agreeBtnClick'): void;
};

const emits = defineEmits<Emit>();

const open = () => {
  const popup = ctx?.refs?.popup as InstanceType<UniPopup>;
  if (popup?.open) {
    popup.open();
  }
};

const close = () => {
  const popup = ctx?.refs?.popup as InstanceType<UniPopup>;
  if (popup?.close) {
    popup.close();
  }
};

/** 「同意并继续」按钮点击事件 */
const agreeBtnClick = () => {
  emits('agreeBtnClick');
  close();
};

defineExpose({
  open,
  close,
});
</script>

<style scoped lang="scss">
.container{
  width: 260px;
  height: 260px;

  background: #fff;
  border-radius: 16px;

  padding: 40px 10px 20px;
  display: grid;
  grid-template:
    'text' min-content
    '.' 40px
    'agree-btn' min-content
    '.' 20px
    'cancel' min-content
    / 1fr;
  place-items: center;

  .text{
    grid-area: text;

    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    font-size: 14px;
    color: #333;

    .height-light{
      font-weight: bold;
      color: #000;
    }
  }

  .agree-btn{
    grid-area: agree-btn;

    width: 164px;
    height: 40px;

    background: #212125;
    border-radius: 40px;

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 14px;
    color: #fff;
  }

  .cancel{
    grid-area: cancel;

    font-size: 14px;
    color: #8d8d8d;
  }
}
</style>
