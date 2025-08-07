<!-- 录音弹窗组件 -->
<template>
  <uni-popup ref="popup" type="bottom" :safe-area="false" :is-mask-click="false">
    <div class="container">
      <div class="info-item top">您有2个身份，请选择要登录的身份</div>
      <div class="info-item" @click="chooseItem('host')">
        <div class="nickname">{{ userInfo.nickname }}</div>
        <div class="position">主持人</div>
      </div>
      <div class="info-item" @click="chooseItem('team')">
        <div class="nickname">{{ teamName }}</div>
        <div class="position">主持人团队</div>
      </div>
      <div class="cancel-item_btn" @click="close">取消</div>
    </div>
  </uni-popup>
</template>

<script setup lang="ts">
import useTeam from "@/stores/team-store";
import useUser from "@/stores/user-store";
import type { UniPopupInstance } from "@uni-helper/uni-ui-types";

const teamStore = useTeam();
const userStore = useUser();
const { teamName } = storeToRefs(teamStore);
const { userInfo } = storeToRefs(userStore);

const ctx = getCurrentInstance();

const emit = defineEmits<{(e: 'roleChoose', value: 'host' | 'team'): void }>();


/** 打开弹窗 */
const open = () => {
  const popup = ctx?.refs?.popup as unknown as UniPopupInstance;
  if (popup.open) {
    popup.open();
  }
};

/** 关闭弹窗 */
const close = () => {
  const popup = ctx?.refs?.popup as unknown as UniPopupInstance;
  if (popup.close) {
    popup.close();
  }
};

const chooseItem = (type: "host" | "team") => {
  emit('roleChoose', type);
}

defineExpose({
  open,
  close,
});
</script>

<style scoped lang="scss">
.container {
  width: 750rpx;
  .info-item {
    background-color: #fff;
    border-bottom: 2rpx solid #f0f2f5;
    height: 103rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 31rpx;
    color: #333;
    .position {
      background-color: #000;
      color: #fff;
      font-size: 23rpx;
      font-weight: 400;
      margin-left: 7rpx;
      padding: 3rpx 11rpx;
    }
    &.top {
      border-top-right-radius: 20rpx;
      border-top-left-radius: 20rpx;
      height: 84rpx;
      font-size: 27rpx;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.4);
    }
  }
  .cancel-item_btn {
    border-top: 13rpx solid #f0f2f5;
    height: 120rpx;
    display: flex;
    justify-content: center;
    font-size: 31rpx;
    color: #333;
    padding-top: 31rpx;
    background-color: #fff;
  }
}
</style>
