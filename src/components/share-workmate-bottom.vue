<!-- 分享给同行的底部操作栏 -->
<template>
  <div class="share-workmate-bottom">
    <!-- 关于我们 -->
    <div class="about-us btn" @click="navigateTo('explore', {canBack: true})">关于我们</div>
    <!-- 注册登录 -->
    <div class="login btn" @click="loginClick">注册登录</div>
  </div>
</template>

<script setup lang="ts">
import { navigateTo } from '@/utils/navigate';

/** 点击登录注册，如果没登录，则跳转到登录页面，反正跳转到小程序首页 */
const loginClick = () => {
  const isLogin = uni.getStorageSync('isFormalToken');
  if (isLogin) {
    navigateTo('works')
  } else {
    navigateTo('login')
  }

}
</script>

<style scoped lang="scss">
.share-workmate-bottom {
  width: 100vw;
  display: flex;
  padding-bottom: 58rpx;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 0;
  left: 0;
  background-color: #FFFFFF;
  z-index: 10;
  .btn {
    flex: 1;
    height: 94rpx;
    text-align: center;
    line-height: 94rpx;
    font-size: 29rpx;
    &:first-of-type {
      color: #FFFFFF;
      background-color: #333333;
    }
  }
}
</style>
