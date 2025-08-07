<!--
  * 自定义TabBar组件，根据pages.json配置的页面列表生成TabBar，并且根据userInfo.isShowVideoModel决定是否显示「动态」页面按钮
  * @author: Ruan Jiazhen
  * @date: 2024-04-28  17:10:15
-->
<template>
  <div class="tab-bar">
    <div class="tab-bar-border" />
    <div
      v-for="(item, index) in list"
      :key="index"
      class="tab-bar-item"
      @click="navigateTo(item.pagePath.split('/').pop()||'index')"
    >
      <image :src="selected === index ? `/${item.selectedIconPath}` : `/${item.iconPath}`" />
      <view :style="{color: selected === index ? selectedColor : color}">
        {{ item.text }}
      </view>
    </div>
  </div>
</template>

<script setup lang="ts">
import { tabBar } from '@/pages.json';
import useUser from '@/stores/user-store';
import { navigateTo } from '@/utils/navigate';

const userStore = useUser();
const { userInfo } = storeToRefs(userStore);

// 如果不显示视频模块，则隐藏「动态」页面
const list = computed(() => (userInfo.value.isShowVideoModel ? tabBar.list : tabBar.list.filter((item) => item.pagePath !== 'pages/wedding-link/activities')));

const selected = computed(() => {
  const page = getCurrentPages().pop()?.route;
  const index = list.value.findIndex((item) => item.pagePath === page);
  return index;
});
const color = tabBar.color || '#000';
const selectedColor = tabBar.selectedColor || '#000';

</script>

<style scoped lang="scss">
.tab-bar {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 98;

  height: $tabBarHeight;

  background: white;

  padding-bottom: env(safe-area-inset-bottom);
  box-sizing: content-box;
  display: flex;
}

.tab-bar-border {
  position: absolute;
  top: 0;
  left: 0;

  width: 100%;
  height: 1px;

  background-color: rgb(0 0 0 / 33%);

  transform: scaleY(0.5);
}

.tab-bar-item {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  text-align: center;
}

.tab-bar-item image {
  width: 25px;
  height: 25px;
}

.tab-bar-item view {
  font-size: 10px;
}

</style>
