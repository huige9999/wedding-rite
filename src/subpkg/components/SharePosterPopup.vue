<!-- 分享个人名片、海报弹窗 -->
<template>
  <uni-popup
    ref="popup"
    type="bottom"
    :safe-area="false"
  >
    <div class="container">
      <div class="top-bar" />
      <div
        v-for="(menu,index) in MENU_LIST"
        :key="index"
        class="menu"
        :class="`menu${index + 1}`"
        @click="emit('menu-click',index)"
      >
        <button
          v-if="menu.openType"
          class="hidden-btn"
          :open-type="menu.openType"
        />
        <image
          class="icon"
          :src="menu.icon"
          mode="aspectFit"
        />
        <p class="name">
          {{ menu.name }}
        </p>
      </div>
    </div>
  </uni-popup>
</template>

<script setup lang="ts">
import type { UniPopupInstance } from '@uni-helper/uni-ui-types';

const MENU_LIST = [
  {
    name: '分享到朋友圈',
    icon: 'https://static.hudongmiao.com/wedding-rite/moments-logo.svg',
  },
  {
    name: '自定义海报',
    icon: 'https://static.hudongmiao.com/wedding-rite/img.svg',
  },
  {
    name: '直接转发',
    icon: 'https://static.hudongmiao.com/wedding-rite/arrow-right-red.svg',
    openType: 'share',
  },
];

const currentInstance = getCurrentInstance();
const open = () => {
  const popup = currentInstance?.refs?.popup as UniPopupInstance;
  if (popup.open) { popup.open(); }
};

const close = () => {
  const popup = currentInstance?.refs?.popup as UniPopupInstance;
  if (popup.close) { popup.close(); }
};

defineExpose({
  open,
  close,
});

// #region 菜单点击事件相关

const emit = defineEmits<{(event:'menu-click', index:number): void;
}>();

// #endregion
</script>

<style scoped lang="scss">
.container{
  width: 100vw;
  height: 46.4vw;

  background: #ededed;
  border-radius: 20px 20px 0 0;

  padding: 16px 0 20px;
  padding-bottom: env(safe-area-inset-bottom);
  box-sizing: content-box;
  display: grid;
  grid-template:
    'top-bar top-bar top-bar' min-content
    'menu1 menu2 menu3' min-content
    / 1fr 1fr 1fr;
  gap: 28px 0;
  place-items: center;

  .top-bar{
    grid-area: top-bar;

    width: 36px;
    height: 4px;

    background: #D4D6D8;
    border-radius: 17px;
  }

  .menu{
    &.menu1{
      grid-area: menu1;
    }

    &.menu2{
      grid-area: menu2;
    }

    &.menu3{
      grid-area: menu3;
    }
    position: relative;

    display: flex;
    flex-direction: column;
    row-gap: 8px;
    align-items: center;
    justify-content: center;

    .hidden-btn{
      position: absolute;
      top: 0;
      left: 0;

      width: 100%;
      height: 100%;

      opacity: 0;
    }

    .icon{
      width: 76px;
      height: 76px;
    }

    .name{
      font-size: 13px;
      color: #8d8d8d;
    }
  }
}
</style>
