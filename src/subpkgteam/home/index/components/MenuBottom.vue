<template>
  <div
    class="menu-bottom_container"
    :style="{
      height: `${bottomMenuHeightReal}px`,
    }"
  >
    <!-- 收起/展开的箭头 -->
    <uni-icons
      :type="arrowType"
      size="18"
      color="#DBDBDB"
      @click="toggleArrowType"
    ></uni-icons>
    <div class="menu">
      <!-- 收起情况下的菜单 -->
      <div class="simple-menu" v-if="arrowType === 'top'">
        <div class="menu-item" @click="navigateTo('/subpkgteam/work/add/index')">发布作品</div>
        <div class="menu-item" @click="navigateTo('/subpkgteam/dynamic/add/index')">发布动态</div>
        <div class="menu-item" @click="navigateTo('/subpkgteam/schedules/index/index')">档期管理</div>
        <div class="menu-item" 
        @click="navigateTo('/subpkgteam/clientInfo/index/index')">客资</div>
      </div>
      <!-- 展开情况下的菜单 -->
      <div class="complex-menu" v-if="arrowType === 'bottom'">
        <div class="menu-item"  @click="navigateTo('/subpkgteam/work/add/index')">
          <div class="icon-box">
            <uni-icons type="compose" size="18" color="#000000"></uni-icons>
          </div>
          <div class="menu-name">发布作品</div>
        </div>
        <div class="menu-item" @click="navigateTo('/subpkgteam/dynamic/add/index')">
          <div class="icon-box">
            <uni-icons type="navigate" size="18" color="#000000"></uni-icons>
          </div>
          <div class="menu-name">发布动态</div>
        </div>
        <div class="menu-item" @click="navigateTo('/subpkgteam/schedules/index/index')">
          <div class="icon-box">
            <uni-icons type="calendar" size="18" color="#000000"></uni-icons>
          </div>
          <div class="menu-name">档期管理</div>
        </div>
        <div class="menu-item"  @click="navigateTo('/subpkgteam/clientInfo/index/index')">
          <div class="icon-box">
            <uni-icons type="wallet" size="18" color="#000000"></uni-icons>
          </div>
          <div class="menu-name">客资</div>
        </div>
        <div class="menu-item">
          <div class="icon-box">
            <uni-icons type="home" size="18" color="#000000"></uni-icons>
          </div>
          <div class="menu-name">首页展示</div>
        </div>
        <div class="menu-item">
          <div class="icon-box">
            <uni-icons type="settings" size="18" color="#000000"></uni-icons>
          </div>
          <div class="menu-name">设置</div>
        </div>
        <div class="menu-item">
          <div class="icon-box">
            <uni-icons type="map" size="18" color="#000000"></uni-icons>
          </div>
          <div class="menu-name">使用手册</div>
        </div>
        <div class="menu-item" @click="navigateTo('/subpkgteam/poster/index/index')">
          <div class="icon-box">
            <uni-icons type="pyq" size="18" color="#000000"></uni-icons>
          </div>
          <div class="menu-name">分享</div>
        </div>
        <div class="menu-item">
          <div class="icon-box">
            <uni-icons type="person" size="18" color="#000000"></uni-icons>
          </div>
          <div class="menu-name">我的</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
type Props = {
  bottomMenuHeight: number;
  windowHeight: number;
};
const props = withDefaults(defineProps<Props>(), {
  bottomMenuHeight: 0,
  windowHeight: 0,
});
// 展开后的底部菜单高度
const bottomMenuHeightExpand = computed(() => {
  return props.windowHeight * 0.8;
});

const arrowType = ref<"top" | "bottom">("top");

const bottomMenuHeightReal = computed(() => {
  return arrowType.value === "top"
    ? props.bottomMenuHeight
    : bottomMenuHeightExpand.value;
});

const toggleArrowType = () => {
  arrowType.value = arrowType.value === "top" ? "bottom" : "top";
};

const navigateTo = (path: string) => {
  uni.navigateTo({ url: path });
};
</script>

<style scoped lang="scss">
.menu-bottom_container {
  position: fixed;
  left: 0;
  bottom: 0rpx;
  width: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 10rpx;
  border-top-left-radius: 20rpx;
  border-top-right-radius: 20rpx;
  transition: height 0.25s ease-in-out;
  z-index: 9999;
  .menu {
    margin-top: 20rpx;
    width: 100%;
    .simple-menu {
      display: flex;
      justify-content: space-evenly;
      font-size: 24rpx;
      font-weight: 400;
      color: #333333;
      .menu-item {
        width: 100rpx;
        text-align: center;
      }
    }
    .complex-menu {
      display: grid;
      justify-content: center;
      grid-template-columns: repeat(4, min-content);
      grid-auto-rows: min-content;
      row-gap: 31rpx;
      column-gap: 84rpx;
      .menu-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        .icon-box {
          width: 104rpx;
          height: 104rpx;
          background: #ffffff;
          border:2rpx solid #eeeeee;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .menu-name {
          margin-top: 23px;
          font-size: 23rpx;
          font-weight: 400;
          color: #333333;
        }
      }
    }
  }
}
</style>
