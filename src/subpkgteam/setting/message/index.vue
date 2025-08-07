<template>
  <div class="container">
    <uni-nav-bar
      class="nav-bar"
      left-icon="left"
      status-bar
      title="消息设置"
      :border="false"
      background-color="#ffffff"
      @click-left="back"
    />
    <div class="set-form">
      <div class="form-item">
        <div class="key-box">
          <div class="key">预约通知</div>
          <div class="desc">收到新的【预约】，马上收到预约消息</div>
        </div>
        <switch class="switch" color="#333333" />
      </div>
      <div class="form-item">
        <div class="key-box">
          <div class="key">成员加入</div>
          <div class="desc">收到新的成员加入，马上收到加入消息</div>
        </div>
        <switch class="switch" color="#333333" />
      </div>
      <div class="form-item">
        <div class="key-box">
          <div class="key">成员退出</div>
          <div class="desc">收到新的成员退出，马上收到退出消息</div>
        </div>
        <switch class="switch" color="#333333" />
      </div>
    </div>
    <div class="add-qrcode_wrap">
      <div class="tip">为了您能及时接收到消息，请先关注"wd公众号"</div>
      <div class="qrcode"></div>
      <div class="tip save">长按保存二维码</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { back } from "@/utils/navigate";
</script>

<style scoped lang="scss">
.container {
  position: relative;
  .set-form {
    width: 688rpx;
    margin: 10rpx auto 0 auto;
    .form-item {
      height: 164rpx;
      border-bottom: 2rpx solid #ededed;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .key-box {
        .key {
          font-size: 31rpx;
          font-weight: 400;
          color: #000000;
          margin-bottom: 13rpx;
        }
        .desc {
          font-size: 27rpx;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.4);
        }
      }
      .switch {
        transform: scale(0.7);
        transform-origin: right;
      }
    }
  }
  .add-qrcode_wrap {
    position: fixed;
    bottom: 250rpx;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    .tip {
      font-size: 23rpx;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.4);
      white-space: nowrap;
      &.save {
        margin-top: 21rpx;
      }
    }
    .qrcode {
      width: 233rpx;
      height: 233rpx;
      background: #f2f3f7;
      margin-top: 46rpx;
    }
  }
}
</style>
