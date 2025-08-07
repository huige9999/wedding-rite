<!-- 个人名片预览弹窗 -->
<template>
  <uni-popup
    ref="popup"
  >
    <div class="container">
      <canvas
        id="poster"
        canvas-id="poster"
        class="poster"
      />
      <div
        class="give-up-btn"
        @click="close"
      >
        放弃
      </div>
      <div
        class="save-btn"
        @click="saveToAlbum"
      >
        保存到相册
      </div>
    </div>
  </uni-popup>
</template>

<script setup lang="ts">
import { getImageInfo } from '@uni-helper/uni-promises';

const currentInstance = getCurrentInstance();

const props = defineProps<{
  photo: string,
  qrCode: string,
  name:string
}>();

// #region 绘制海报

let isDrawComplete = false;

const canvasCtx = uni.createCanvasContext('poster', currentInstance);

const drawPoster = async () => {
  const rectRes = await (
    new Promise<UniApp.NodeInfo>((resolve) => {
      // XXX 不延时则获得到的宽高有误，可能是因为弹窗的动画还未完成
      setTimeout(() => {
        uni.createSelectorQuery().in(currentInstance).select('#poster')
          .fields({ size: true }, (res) => {
            console.log('res', res);
            resolve(res as UniApp.NodeInfo);
          })
          .exec();
      }, 500);
    }));
  const posterWidth = rectRes.width ?? 0;
  const posterHeight = rectRes.height ?? 0;

  const imgAreaHeightRatio = 0.812;
  const imgAreaHeight = imgAreaHeightRatio * posterHeight;
  const imgAreaWidth = posterWidth;

  const qrCodeHeight = posterHeight - imgAreaHeight - 16 - 16;
  const qrCodeWidth = qrCodeHeight;

  const textAreaHeight = 34;
  const textFontSize = 15;
  const textAreaX = 16 + qrCodeWidth + 16;
  const textAreaY = (posterHeight - imgAreaHeight - textAreaHeight) / 2
    + imgAreaHeight + textFontSize;

  canvasCtx.setFillStyle('#fff');
  canvasCtx.fillRect(0, 0, posterWidth, posterHeight);

  const imgInfo = await getImageInfo({ src: props.photo });

  canvasCtx.drawImage(
    imgInfo.path,
    0,
    0,
    imgInfo.width,
    imgInfo.width * (imgAreaHeight / imgAreaWidth),
    0,
    0,
    imgAreaWidth,
    imgAreaHeight,
  );

  canvasCtx.setFontSize(15);
  canvasCtx.setFillStyle('#fff');
  canvasCtx.fillText(
    props.name,
    16,
    imgAreaHeight - 16,
  );

  const qrCodeImgInfo = await getImageInfo({ src: props.qrCode });
  canvasCtx.drawImage(
    qrCodeImgInfo.path,
    16,
    imgAreaHeight + 16,
    qrCodeWidth,
    qrCodeHeight,
  );

  canvasCtx.setFillStyle('#333');
  canvasCtx.fillText(
    '长按小程序码',
    textAreaX,
    textAreaY,
  );
  canvasCtx.fillText(
    '进入Ta的个人主页',
    textAreaX,
    textAreaY + textFontSize + 4,
  );

  canvasCtx.draw(false, () => {
    isDrawComplete = true;
  });
};

// #endregion

// #region 弹窗的开关

const open = () => {
  isDrawComplete = false;
  const popup = currentInstance?.refs?.popup as UniHelper.UniPopupInstance;
  if (popup.open) { popup.open(); }
  drawPoster();
};

const close = () => {
  const popup = currentInstance?.refs?.popup as UniHelper.UniPopupInstance;
  if (popup.close) { popup.close(); }
};

defineExpose({
  open,
  close,
});

// #endregion

// #region 保存到相册相关

const emit = defineEmits<{(event:'iKnow'): void;
}>();

const saveToAlbum = async () => {
  if (!isDrawComplete) {
    uni.showToast({
      title: '正在生成个人名片，请稍后',
      icon: 'none',
    });
    return;
  }

  const TempFileRes = await new Promise<UniApp.CanvasToTempFilePathRes>((resolve) => {
    uni.canvasToTempFilePath({
      canvasId: 'poster',
      success: (res) => {
        resolve(res);
      },
    }, currentInstance);
  });

  const saveRes = await new Promise<boolean>((resolve) => {
    uni.saveImageToPhotosAlbum({
      filePath: TempFileRes.tempFilePath,
      success: () => {
        resolve(true);
      },
      fail: () => {
        resolve(false);
      },
    });
  });

  if (saveRes) {
    close();
    uni.showModal({
      title: '个人名片已保存到手机相册',
      content: '快去分享给小伙伴，叫小伙伴来围观吧',
      confirmText: '知道了',
      showCancel: false,
      success: () => {
        emit('iKnow');
      },
    });
  } else {
    uni.showToast({
      title: '保存失败',
      icon: 'none',
    });
  }
};

// #endregion

</script>

<style scoped lang="scss">

.container{
  display: grid;
  grid-template:
    'poster poster' min-content
    'give-up save' min-content
    /min-content min-content;
  gap: 16px;

  .poster{
    grid-area: poster;

    width: 89.0667vw;
    height: 136.2667vw;
  }

  .give-up-btn{
    grid-area: give-up;

    width: 21.3333vw;
    height: 48px;

    background: #eaeaea;
    border-radius: 40px;

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 14px;
    color: #8d8d8d;
  }

  .save-btn{
    grid-area: save;

    width: 63.4667vw;
    height: 48px;

    background: linear-gradient(282deg,#ffd175 0%, #ffe8b7);
    border-radius: 40px;

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 14px;
    font-weight: bold;
    color: #704C00;
  }
}

</style>
