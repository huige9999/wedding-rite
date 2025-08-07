<!-- 「已激活用户」页面 -->
<template>
  <div class="container">
    <uni-nav-bar
      class="nav-bar"
      left-icon="left"
      title="已激活用户"
      status-bar
      :border="false"
      background-color="#00000000"
      @click-left="back"
    />
    <!-- 主体部分 -->
    <div class="main" v-if="activatedInviteUserList.length">
      <!-- 用户项 -->
      <div
        v-for="item in activatedInviteUserList"
        :key="item.userId"
        class="user-item"
      >
        <!-- 头像 -->
        <image
          class="avatar"
          :src="item.avatar"
          mode="aspectFill"
        />
        <!-- 昵称 -->
        <div class="nickname">
          {{ item.nickname }}
        </div>
        <!-- 提示文案 -->
        <div class="tip">已激活</div>
        <!-- 时间 -->
        <div class="time">
          {{ item.inviteTime }}
        </div>
      </div>
    </div>
    <!-- 缺省状态 -->
    <div class="none-data" v-else>暂无邀请的已激活VIP用户</div>
  </div>
</template>

<script lang="ts" setup>
import useUser from '@/stores/user-store';
import { back } from '@/utils/navigate';

const userStore = useUser();
const { activatedInviteUserList } = storeToRefs(userStore);

</script>

<style lang="scss" scoped>
.container {
  width: 100vw;
  min-height: 100vh;

  background-color: #f9f9f9;

  display: grid;
  grid-template:
    'nav-bar' auto
    'main' 1fr
    /100vw;

  .nav-bar {
    grid-area: nav-bar;
  }

  .main {
    grid-area: main;

    padding: 18px 20px;
    display: flex;
    flex-direction: column;
    row-gap: 16px;
    align-items: center;

    // 用户项
    .user-item {
      width: 100%;
      height: 8.2051vw;

      display: grid;
      grid-template:
        'avatar nickname tip time' 1fr
        / auto 1fr auto auto;
      column-gap: 6px;
      align-items: center;

      // 头像
      .avatar {
        grid-area: avatar;

        width: 8.2051vw;
        height: 8.2051vw;

        border-radius: 50%;
      }

      // 昵称
      .nickname {
        grid-area: nickname;

        font-size: 14px;
        color: #333;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      // 提示文案
      .tip {
        margin: 0 19rpx;
        color: green;
        font-size: 23rpx;
      }

      // 时间
      .time {
        grid-area: time;

        font-size: 12px;
        color: #8d8d8d;
      }
    }
  }
  .none-data {
    margin: 60px auto;
    width: 100%;
    text-align: center;
    color: rgba(0, 0, 0, .4);
    font-weight: bold;
    font-size: 33rpx;
  }
}
</style>
