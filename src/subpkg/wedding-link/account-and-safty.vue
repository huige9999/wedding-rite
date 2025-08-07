<template>
  <div class="account-and-safty">
    <div class="body-container">
      <div class="info-item">
        <div class="item-label">当前账号</div>
        <div class="item-data">{{ userInfo.phone || '未绑定' }}</div>
      </div>
      <div class="logout-btn" @click="logoutClick">退出登录</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import useUser from '@/stores/user-store';
import { showToast } from '@/utils/tools';

const userStore = useUser();
const { logout } = userStore;
const { userInfo } = storeToRefs(userStore);

/** 退出登录 */
const logoutClick = () => {
  uni.showModal({
    content: '确认退出当前登录账户？',
    showCancel: true,
    success: ({ confirm, cancel }) => {
      if (confirm) {
        uni.removeStorageSync('token');
        uni.removeStorageSync('isFormalToken');
        logout();
        showToast('操作成功~', 'none', 1500, true, '', () => {
          setTimeout(() => {
            uni.reLaunch({
              url: '/subpkg/wedding-link/login',
            });
          }, 1500);
        });
      }
    },
  });
};
</script>

<style scoped lang="scss">
.account-and-safty {
  width: 100%;
  height: 100vh;
  background-color: #f9f9f9;
  position: relative;
  .body-container {
    padding: 23rpx 31rpx;
    box-sizing: border-box;

    .info-item {
      width: 100%;
      padding: 27rpx 37rpx;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #ffffff;
      border-radius: 15rpx;
      color: #333;
      font-size: 29rpx;
      .item-label {
        flex-shrink: 0;
        margin-right: 38rpx;
      }
      .item-data {
        flex: 1;
        text-align: right;
      }
    }
    .logout-btn {
      width: 615rpx;
      height: 92rpx;
      background-image: linear-gradient(279deg, #ffd175, #ffe8b7);
      border-radius: 77rpx;
      color: #704c00;
      font-size: 27rpx;
      letter-spacing: 2rpx;
      text-indent: 2rpx;
      line-height: 92rpx;
      text-align: center;
      position: fixed;
      bottom: 469rpx;
      left: 50%;
      transform: translateX(-50%);
    }
  }
}
</style>
