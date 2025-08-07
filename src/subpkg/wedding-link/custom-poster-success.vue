<!-- 自定义海报-生成海报成功页面 -->
<template>
  <div class="container">
    <uni-nav-bar
      :title="`主持人`"
      left-icon="left"
      status-bar
      class="nav-bar"
      :border="false"
      @click-left="navigateTo('my')"
    />
    <img
      src="https://static.hudongmiao.com/wedding-rite/tick-circle-green.svg"
      class="icon"
    >
    <p class="text">
      生成海报成功
    </p>
    <div
      class="back-btn"
      @click="navigateTo('my')"
    >
      返回首页
    </div>
  </div>
</template>

<script setup lang="ts">
import { navigateTo } from '@/utils/navigate';
import { downloadFile } from '@uni-helper/uni-promises';

const saveImage = async (imgUrl:string) => {
  const downloadRes = await downloadFile({ url: imgUrl });
  console.log('downloadRes', downloadRes);
  uni.saveImageToPhotosAlbum({
    filePath: downloadRes.tempFilePath,
    success: () => {
      uni.showToast({ title: '已保存至相册' });
    },
    fail: (res) => {
      console.log('fail', res);
      uni.showToast({ title: '保存失败' });
    },
  });
};

onLoad((options) => {
  console.log('options', options);
  const { filePath } = options;
  if (filePath) {
    saveImage(filePath);
  }
});
</script>

<style scoped lang="scss">
.container{
  position: relative;

  width: 100vw;
  height: 100vh;

  padding-bottom: env(safe-area-inset-bottom);
  display: grid;
  grid-template:
    'nav-bar' min-content
    '.' 1fr
    'icon' min-content
    'text' min-content
    '.' 1fr
    'back-btn' min-content
    /1fr;
  place-items: center;

  .nav-bar{
    grid-area: nav-bar;

    width: 100vw;
  }

  .icon{
    grid-area: icon;

    width: 148px;
    height: 148px;
  }

  .text{
    grid-area: text;

    font-size: 20px;
    color: #333;
    text-align: center;
  }

  .back-btn{
    grid-area: back-btn;

    width: 320px;
    height: 48px;

    background: linear-gradient(279deg,#ffd175 0%, #ffe8b7);
    border-radius: 40px;

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 14px;
    line-height: 44px;
    color: #704C00;
    text-align: center;
  }

  .tip{
    position: absolute;
    top: 50%;
    left: 50%;

    background: rgba($color: #000, $alpha: 60%);
    border-radius: 2px;

    transform: translate(-50%, -50%);

    padding: 8px 32px;
    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 14px;
    color: #fff;

    &.v-enter-active,
    &.v-leave-active{
      transition: all 0.4s;
    }

    &.v-enter-from,
    &.v-leave-to{
      opacity: 0;
    }
  }
}
</style>
