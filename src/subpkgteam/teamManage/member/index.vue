<template>
  <div class="container">
    <uni-nav-bar
      class="nav-bar"
      left-icon="left"
      status-bar
      title="所有成员"
      :border="false"
      background-color="#ffffff"
      @click-left="back"
    />
    <div class="top-nav">
      <div
        class="nav-item"
        @click="changeNav(0)"
        :class="{ active: currentNav === 0 }"
      >
        全部
      </div>
      <div
        class="nav-item"
        @click="changeNav(1)"
        :class="{ active: currentNav === 1 }"
      >
        待审核
      </div>
    </div>
    <div class="content-list">
      <div class="list-item" v-for="item in 10" :key="item">
        <div class="cover">
          <image
            class="cover-img"
            src="https://ustatic.hudongmiao.com/joymewMp/defaultAvatar/24.png"
            mode="aspectFill"
          />
          <div class="extra-bar_info">于2024/8/10申请退出</div>
        </div>
        <div class="info">
          <div class="name">张三</div>
          <div class="more-btn" @click="showMoreOperate">
            <uni-icons
              type="more-filled"
              size="18"
              color="rgba(0,0,0,0.4)"
            ></uni-icons>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { back } from "@/utils/navigate";
import { showActionSheet } from "@uni-helper/uni-promises";

const currentNav = ref<0 | 1>(0);

const changeNav = (index: 0 | 1) => {
  currentNav.value = index;
};

const showMoreOperate = async () => {
  console.log("showMoreOperate");
  const showActionSheetRes = await showActionSheet({
    itemList: ["排序", "查看档期", "查看报价", "取消合作"],
  });
  console.log(showActionSheetRes.tapIndex);
};
</script>

<style scoped lang="scss">
.container {
  position: relative;
  .top-nav {
    height: 108rpx;
    display: flex;
    align-items: center;
    padding-left: 65rpx;
    border-bottom: 2rpx solid #ededed;
    position: sticky;
    background-color: #fff;
    z-index: 1;
    top: 0;
    .nav-item {
      position: relative;
      color: rgba(0, 0, 0, 0.4);
      font-weight: 500;
      font-size: 31rpx;
      margin-right: 53rpx;
      display: flex;
      justify-content: center;
      &.active {
        color: #000;
        &::after {
          content: "";
          display: block;
          width: 35rpx;
          height: 6rpx;
          background: #000000;
          position: absolute;
          top: 58rpx;
        }
      }
    }
  }
  .content-list {
    padding: 0 31rpx;
    margin-top: 20rpx;
    display: grid;
    justify-content: center;
    grid-template-columns: repeat(2, min-content);
    row-gap: 30rpx;
    column-gap: 27rpx;
    padding-bottom: 120rpx;
    .list-item {
      .cover {
        position: relative;
        .cover-img {
          width: 331rpx;
          height: 438rpx;
        }
        .extra-bar_info {
          width: 100%;
          height: 40rpx;
          background: linear-gradient(
            180deg,
            rgba(0, 0, 0, 0),
            rgba(0, 0, 0, 0.8) 100%
          );
          position: absolute;
          bottom: 0;
          left: 0;
          font-size: 23rpx;
          font-weight: 400;
          color: #ffffff;
          padding: 0 15rpx;
          line-height: 40rpx;
        }
      }
      .info {
        margin-top: 34rpx;
        display: flex;
        justify-content: space-between;
        .name {
          width: 180rpx;
          font-size: 27rpx;
          font-weight: 500;
          color: #000000;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }
    }
  }
}
</style>
