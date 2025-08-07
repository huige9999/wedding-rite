<template>
  <div class="content">
    <!-- <uni-nav-bar
      status-bar
      :border="false"
      left-icon="left"
      fixed
      @click-left="back"
    /> -->
    <div class="myNav">
      <div class="innerCt">
        <image
          src="https://ustatic.hudongmiao.com/joymewApp/backIcon.png"
          class="arrow"
          @click="handleBack"
        />
      </div>
    </div>
    <video
      class="myVideo"
      :loop="true"
      :src="videoPath"
      objectFit="contain"
      :autoplay="true"
    />
  </div>
</template>

<script lang="ts" setup>
import { back } from '@/utils/navigate';

const videoPath = ref('');

onLoad((options) => {
  if (options.videoPath) {
    videoPath.value = options.videoPath;
  }
});

const handleBack = () => {
  back();
};
</script>

<style scoped>
.myNav {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 750rpx;
  height: 140rpx;
}
.innerCt {
  position: absolute;
  width: 750rpx;
  height: 100rpx;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
}
.arrow {
  width: 24rpx;
  height: 48rpx;
  position: absolute;
  left: 40rpx;
}
.myVideo {
  width: 750rpx;
  height: 100vh;
}
</style>
