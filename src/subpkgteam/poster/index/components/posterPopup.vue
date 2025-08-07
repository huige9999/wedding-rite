<template>
  <div class="poster-popup" v-if="visible">
    <canvas
      canvas-id="posterCanvas"
      class="posterCanvas"
      id="posterCanvas"
      :style="{ width: posterWidth + 'px', height: posterHeight + 'px' }"
    ></canvas>
    <div class="poster-box">
      <div class="poster-main">
        <image
          class="share-img"
          :src="posterBg"
        />
        <input
          placeholder="请输入分享标题"
          class="title-ipt"
          v-model="shareTitle"
          maxlength="10"
        />
      </div>
      <div class="poster-info">
        <div class="qrcode"></div>
        <div class="tip-info">
          <div class="info up">长按小程序码</div>
          <div class="info">进入ta的个人主页</div>
        </div>
      </div>
      <div class="bottom-operate">
        <div class="btn cancel" @click="hide">放弃</div>
        <div class="btn save" @click="savePoster">保存到相册</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const visible = ref(false);
const posterBg = ref("");


const hide = () => {
  visible.value = false;
};
const show = (url: string) => {
  posterBg.value = url;
  visible.value = true;
};
const { windowWidth } = uni?.getSystemInfoSync();
const posterWidth = parseFloat((windowWidth * 0.9).toFixed(2));
const posterHeight = parseFloat((posterWidth * 1.37).toFixed(2));

const currentInstance = getCurrentInstance();
const ctx = uni.createCanvasContext("posterCanvas", currentInstance);

const shareTitle = ref("");

const getLocalFilePath = (url: string): Promise<string> => {
  return new Promise((resolve) => {
    uni.downloadFile({
      url,
      success: (res) => {
        resolve(res.tempFilePath);
      },
    });
  });
};

const drawPoster = ({ bg, qrcode }: any) => {
  return new Promise(async (resolve) => {
    const bgLocalPath = await getLocalFilePath(bg);
    const qrcodeLocalPath = await getLocalFilePath(qrcode);
    const bgWidth = posterWidth;
    const bgHeight = posterHeight * 0.82;
    const qrcodeWidth = posterWidth * 0.18;
    const qrcodeHeight = qrcodeWidth;
    // 1.绘制顶部背景
    ctx.drawImage(bgLocalPath, 0, 0, bgWidth, bgHeight);
    // 2.绘制底部矩形区域
    ctx.setFillStyle("#fff");
    ctx.fillRect(0, bgHeight, bgWidth, posterHeight - bgHeight);
    // 3.底部矩形上绘制二维码
    ctx.drawImage(
      qrcodeLocalPath,
      10,
      bgHeight + 10,
      qrcodeWidth,
      qrcodeHeight
    );
    // 4.底部矩形上绘制文字
    ctx.setFillStyle("#000");
    ctx.setFontSize(14);
    ctx.fillText("长按小程序码", posterWidth * 0.27, bgHeight + 32);
    ctx.fillText("进入ta的个人主页", posterWidth * 0.27, bgHeight + 55);
    // 5.绘制分享标题
    if (shareTitle.value.length > 0) {
      ctx.setFillStyle("#fff");
      ctx.setFontSize(18);
      ctx.fillText(shareTitle.value, 20, bgHeight * 0.88);
    }
    // 完成绘制
    ctx.draw();
    resolve("finished");
  });
};

const savePoster = async () => {
  uni.showLoading({
    title: "海报生成中...",
  });
  const res = await drawPoster({
    bg: posterBg.value,
    qrcode: "https://ustatic.hudongmiao.com/joymewMp/defaultAvatar/32.png",
  });
  console.log(res);
  uni.hideLoading();
  uni.canvasToTempFilePath(
    {
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
      },
      fail: (err) => {
        console.log(err);
      },
      complete: (res) => {
        console.log(res);
      },
    },
    currentInstance
  );
};

defineExpose({
  show,
  hide,
});
</script>

<style scoped lang="scss">
.poster-popup {
  position: fixed;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  .poster-box {
    width: 685rpx;
    position: relative;
    z-index: 1;
    .poster-main {
      position: relative;
      height: 760rpx;
      .share-img {
        width: 100%;
        height: 100%;
      }
      .title-ipt {
        color: #fff;
        font-size: 38rpx;
        position: absolute;
        left: 50rpx;
        bottom: 42rpx;
      }
    }
    .poster-info {
      height: 169rpx;
      background-color: #fff;
      padding: 23rpx 25rpx;
      display: flex;
      align-items: center;
      .qrcode {
        width: 123rpx;
        height: 123rpx;
        background: #d9d9d9;
      }
      .tip-info {
        margin-left: 38rpx;
        .info {
          color: #000;
          font-size: 27rpx;
          &.up {
            margin-bottom: 12rpx;
          }
        }
      }
    }
    .bottom-operate {
      margin: 46rpx;
      display: flex;
      justify-content: space-between;
      .btn {
        font-size: 27rpx;
        text-align: center;
        line-height: 92rpx;
        height: 92rpx;
        &.cancel {
          width: 254rpx;
          background: #333333;
          color: #fff;
          margin-right: 38rpx;
        }
        &.save {
          width: 396rpx;
          background: #ffffff;
        }
      }
    }
  }
  .posterCanvas {
    opacity: 0;
    position: absolute;
  }
}
</style>
