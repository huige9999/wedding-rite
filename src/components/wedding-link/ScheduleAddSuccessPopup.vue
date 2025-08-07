<!-- 「档期添加成功」弹窗 -->
<template>
  <uni-popup
    ref="popup"
    type="center"
    mask-background-color="rgba(0, 0, 0, 0.6)"
    :is-mask-click="false"
  >
    <div class="main">
      <div class="popup-board">
        <!-- 顶部图标 -->
        <image
          class="top-icon"
          src="@/static/icons/common/done.svg"
          mode="aspectFit"
        />
        <!-- 标题 -->
        <div class="title">
          档期添加成功
        </div>
        <!-- 底部 -->
        <div class="bottom">
          <!-- 「海报晒单」按钮 -->
          <div
            class="poster-btn"
            @click="navigateTo('schedule-poster')"
          >
            海报晒单
          </div>
          <!-- 「一键分享」按钮 -->
          <div
            class="share-btn"
            @click=""
          >
            一键分享
          </div>
        </div>
      </div>
      <!-- 关闭按钮 -->
      <image
        class="close-btn"
        src="@/static/icons/common/cancel-circle-gray.svg"
        mode="aspectFit"
        @click="closeBtnClick"
      />
    </div>
  </uni-popup>
</template>

<script setup lang="ts">
import { back, navigateTo } from '@/utils/navigate';
import type { UniPopup } from '@uni-helper/uni-ui-types';

const ctx = getCurrentInstance();

/** 打开弹窗 */
const open = () => {
  (ctx?.refs.popup as UniPopup).open();
};

/** 关闭弹窗 */
const close = () => {
  (ctx?.refs.popup as UniPopup).close();
};

/** 「×」按钮点击事件 */
const closeBtnClick = () => {
  close();
  setTimeout(back, 200);
};

// 对外暴露的方法
defineExpose({
  open,
  close,
});
</script>

<style scoped lang="scss">
.main {
  width: 331px;
  height: 300px;

  display: grid;
  grid-template:
    'popup-board' 57.4359vw
    '.' 1fr
    'close-btn' 8.7179vw
    / 1fr;
  align-items: center;
  justify-items: center;

  .popup-board {
    grid-area: popup-board;

    width: 100%;
    height: 100%;

    background: #fff;
    border-radius: 10px;

    display: grid;
    grid-template:
      'top-icon' 12.8205vw
      'title' 1fr
      'bottom' 16.1538vw
      / 1fr;
    justify-items: center;

    .top-icon {
      grid-area: top-icon;

      width: 25.641vw;
      height: 25.641vw;

      transform: translateY(-50%);
    }

    .title {
      grid-area: title;
      align-self: center;

      font-size: 6.1538vw;
      font-weight: bold;
      color: #333;
    }

    .bottom {
      grid-area: bottom;

      width: 100%;
      height: 100%;

      background: #f1f5f8;
      border-radius: 0 0 10px 10px;

      display: grid;
      grid-template:
        'poster-btn share-btn' 1fr
        / 1fr 1fr;
      align-items: center;
      justify-items: center;

      .poster-btn,
      .share-btn {
        width: 36.9231vw;
        height: 9.7436vw;

        background: linear-gradient(285deg, #ffd175 0%, #ffe8b7);
        border-radius: 1px;

        display: flex;
        align-items: center;
        justify-content: center;

        font-size: 3.8462vw;
        color: #fff;
      }

      .poster-btn {
        grid-area: poster-btn;
      }

      .share-btn {
        grid-area: share-btn;
      }
    }
  }

  .close-btn {
    grid-area: close-btn;

    width: 8.7179vw;
    height: 8.7179vw;
  }
}
</style>
