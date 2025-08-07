<template>
  <div class="container">
    <!-- 顶部导航栏 -->
    <uni-nav-bar
      :title="navBarTitle"
      status-bar
      :border="false"
      left-icon="bars"
      fixed
      @clickLeft="onClickNavBarLeft"
    />
    <!-- 海报图 -->
    <Poster :posterHeight="posterHeight" />
    <!-- 底部菜单 -->
    <MenuBottom
      :bottomMenuHeight="bottomMenuHeight"
      :windowHeight="windowHeight"
    />
    <!-- 左侧菜单 -->
    <MenuLeft ref="menuLeftRef" :topNavHeight="navBarHeight" />
    <!-- 底部一屏之外的区域 -->
    <div class="bottom-unsee_area">
      <!-- 基本信息 -->
      <BaseInfo />
      <!-- 个人风采 -->
      <PersonStyle />
      <!-- 作品 -->
      <Work />
      <!-- 动态 -->
      <Dynamic />
    </div>
  </div>
</template>

<script lang="ts" setup>
import useTeam from "@/stores/team-store";
import BaseInfo from "./components/BaseInfo.vue";
import Dynamic from "./components/Dynamic.vue";
import MenuBottom from "./components/MenuBottom.vue";
import MenuLeft from "./components/MenuLeft.vue";
import PersonStyle from "./components/PersonStyle.vue";
import Poster from "./components/Poster.vue";
import Work from "./components/Work.vue";

const ctx = getCurrentInstance();

const bottomMenuHeight = ref(80);
const windowHeight = ref(0);
const posterHeight = ref(0);
const navBarHeight = ref(0);
const navBarTitle = ref("主持人上小官");
const teamStore = useTeam();  

const { getHomeInfo } = teamStore;
const { teamName, shareCover } = storeToRefs(teamStore);

/**
 * 导航栏左侧icon点击事件
 * 打开侧边栏菜单
 */
const onClickNavBarLeft = () => {
  const menuLeftRef = ctx?.refs?.menuLeftRef as unknown as InstanceType<
    typeof MenuLeft
  >;
  menuLeftRef.showMenu();
};

/**
 * 设置高度信息
 */
const setHeightInfo = () => {
  const systemInfo = uni.getSystemInfoSync();
  const tmpNavBarHeight = (systemInfo?.statusBarHeight || 0) + 44;
  windowHeight.value = systemInfo.windowHeight;
  navBarHeight.value = tmpNavBarHeight;
  posterHeight.value =
    systemInfo.windowHeight - tmpNavBarHeight - bottomMenuHeight.value;
};

onShareAppMessage(() => ({
  title: teamName.value,
  path: '/subpkgteam/home/index/index',
  imageUrl: shareCover.value,
}));

onLoad(() => {
  setHeightInfo();
  getHomeInfo();
});
</script>

<style scoped lang="scss">
.container {
  position: relative;
  background-color: #2c2c33;
  min-height: 100vh;
  padding-bottom: 200rpx;
  .bottom-unsee_area {
    background: #1c1c20;
  }
}
</style>
