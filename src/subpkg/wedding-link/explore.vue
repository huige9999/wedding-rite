<!-- 「随便逛逛」页面 -->
<template>
  <image
    class="first-img"
    :src="EXPLORE_CONSTANTS.ABOUT_US_IMG_URL"
    mode="aspectFit"
  />
  <!-- 「主持人的一致选择」文本 -->
  <div class="text">
    主持人的一致选择
  </div>
  <!-- 点击查看范例 -->
  <div class="example">
    点击查看主持人&nbsp;<span
      class="underline"
      @click="navigateTo(
        'my-preview-share',
        {userId: EXPLORE_CONSTANTS.EXAMPLE_USER_ID, from:'explore'}
      )"
    >{{ EXPLORE_CONSTANTS.EXAMPLE_NAME }}</span>&nbsp;使用效果
  </div>
  <!-- 价格图片 -->
  <image
    class="price-img"
    :src="EXPLORE_CONSTANTS.PRICE_IMG_URL"
    mode="aspectFit"
  />
  <!-- 「立即开通」按钮 -->
  <!-- <div
    class="open-btn"
    @click="navigateTo('contact-support')"
  >
    立即开通
  </div> -->
  <!-- 二维码图片 -->
  <image
    class="qr-code-img"
    :src="EXPLORE_CONSTANTS.QR_CODE_IMG_URL"
    mode="aspectFit"
    show-menu-by-longpress
  />
  <!-- 底部固定栏 -->
  <div class="bottom-bar">
    <div
      class="left"
      @click="navigateTo(
        'my-preview-share',
        {userId: EXPLORE_CONSTANTS.EXAMPLE_USER_ID, from:'explore', canBack}
      )"
    >
      案例
    </div>
    <div class="right">
      咨询
      <button
        class="contact-btn"
        open-type="contact"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { EXPLORE_CONSTANTS } from '@/static/constants/view-constants';
import { navigateTo } from '@/utils/navigate';

/** 是否展示返回 */
const canBack = ref(false);
onLoad((options) => {
  if (options?.canBack && String(options?.canBack) === 'true') {
    canBack.value = true;
  } else {
    canBack.value = false;
  }
})
</script>

<style lang="scss" scoped>
.first-img {
  width: 100vw;
  height: 892.564vw;
}

// 「主持人的一致选择」文本
.text {
  margin-top: 73px;
  margin-bottom: 10px;

  width: 100vw;
  height: 34px;

  font-size: 24px;
  font-weight: bold;
  color: #333;
  text-align: center;
}

// 点击查看范例
.example{
  justify-self: center;
  margin: 0 8px;

  width: calc(100vw - 16px);
  height: 41px;

  background-color: #F5F5F5;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #FD3055;

  .underline {
    text-decoration: underline;
  }
}

// 价格图片
.price-img {
  width: 100vw;
  height: 53.8462vw;
}

// 「立即开通」按钮
.open-btn {
  justify-self: center;
  margin: auto;

  width: 320px;
  height: 48px;

  background: #212125;
  border-radius: 40px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 14px;
  color: #FFF;
}

// 二维码图片
.qr-code-img {
  margin-top: 63px;
  margin-bottom: 125px;

  width: 100vw;
  height: 66.9231vw;
}

// 底部固定栏
.bottom-bar {
  position: fixed;
  bottom: 0;

  width: 100vw;
  height: 49px;

  background-color: #fff;

  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  box-sizing: content-box;
  display: flex;
  align-items: center;
  justify-content: center;

  .left, .right {
    width: 50%;
    height: 100%;

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 20px;
    color: #fff;
  }

  .left{
    background: #333;
  }

  .right{
    position: relative;

    background: #444;

    .contact-btn{
      position: absolute;

      width: 100%;
      height: 100%;

      opacity: 0;
    }
  }

}

</style>
