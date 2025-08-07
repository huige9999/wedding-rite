<template>
  <div class="container" @click="saveImage">
    <canvas
      canvas-id="posterCanvas"
      id="posterCanvas"
      :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }"
      class="my-canvas"
    ></canvas>
  </div>
</template>

<script lang="ts" setup>
const currentInstance = getCurrentInstance();
const context = uni.createCanvasContext("posterCanvas", currentInstance);
const { windowWidth } = uni?.getSystemInfoSync();
const posterWidth = parseFloat((windowWidth * 0.9).toFixed(2));
const posterHeight = parseFloat((posterWidth * 1.37).toFixed(2));
const canvasWidth = ref(posterWidth);
const canvasHeight = ref(posterHeight);
const drawImage = async (url: string) => {
  return new Promise((resolve) => {
    const imagePath = url;
    const imageHeight = posterHeight * 0.82;
    uni.downloadFile({
      url: imagePath,
      success: (res) => {
        const tempFilePath = res.tempFilePath;
        context.drawImage(tempFilePath, 0, 0, posterWidth, imageHeight);
        resolve({
          imageHeight,
        });
      },
    });
  });
};

const drawQrcode = async (url: string, bgHeight: number) => {
  return new Promise((resolve) => {
    const imagePath = url;
    const imageWidth = posterWidth * 0.18;
    const imageHeight = imageWidth;
    uni.downloadFile({
      url: imagePath,
      success: (res) => {
        const tempFilePath = res.tempFilePath;
        context.drawImage(tempFilePath, 10, bgHeight + 10, imageWidth, imageHeight);
        resolve({
          bgHeight,
        });
      },
    });
  });
};
// 1.绘制顶部背景图
 drawImage('https://ustatic.hudongmiao.com/joymewMp/defaultAvatar/66.png').then((res:any) => {
  // 2. 绘制底部矩形
  context.setFillStyle("#FFFFFF");
  context.fillRect(0, res.imageHeight, posterWidth, posterHeight - res.imageHeight);
  // 3. 绘制二维码
  return drawQrcode('https://ustatic.hudongmiao.com/joymewMp/defaultAvatar/32.png', res.imageHeight)
 }).then((res2:any) => {
  // 4. 绘制文字
  context.setFillStyle("#000000");
  context.setFontSize(14);
  context.fillText("长按小程序码", posterWidth * 0.27, res2.bgHeight + 32);
  context.fillText("进入ta的个人主页", posterWidth * 0.27, res2.bgHeight + 55);
  context.draw();
 });

 const saveImage = () => {
   uni.canvasToTempFilePath({
     canvasId: "posterCanvas",
     success: (res) => {
       uni.saveImageToPhotosAlbum({
         filePath: res.tempFilePath,
         success: (res) => {
           uni.showToast({
             title: "保存成功",
             icon: "success",
             duration: 1000,
           });
         },
       });
      }});
 }
</script>

<style scoped lang="scss">
.container {
  position: relative;
  min-height: 100vh;
  padding-top: 120rpx;
  background-color: rgba(0, 0, 0, 0.6);
  .my-canvas {
    margin: 0 auto;
    opacity: 0;
  }
}
</style>
