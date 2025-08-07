<!-- 底部菜单弹窗组件 -->
<!-- XXX 改为使用showActionSheet，放弃该组件 -->
<template>
  <uni-popup
    ref="popup"
    type="bottom"
    class="bottom-menu-popup"
    :safe-area="false"
  >
    <div class="menu">
      <div
        v-for="(menu, index) in props.menuList"
        :key="index"
        class="menu-item"
        @click="menuBtnClick(menu.action)"
      >
        {{ menu.name }}
      </div>
      <div
        class="menu-item"
        @click="cancelBtnClick"
      >
        取消
      </div>
    </div>
  </uni-popup>
</template>

<script setup lang="ts">
import type { UniPopup } from '@uni-helper/uni-ui-types';

const ctx = getCurrentInstance()!;
type Props = {
  /** 菜单列表 */
  menuList: Array<{
    /** 菜单名称 */
    name: string;
    /** 点击动作名称 */
    action: string;
  }>;
}

type Emits = {
  (e: 'menuClick', action:string): void
}

const props = defineProps<Props>();

const emits = defineEmits<Emits>();

/** 打开弹窗 */
const open = () => {
  const popup = ctx.refs.popup as UniPopup;
  popup?.open();
};

/** 关闭弹窗 */
const close = () => {
  const popup = ctx.refs.popup as UniPopup;
  popup?.close();
};

/** 点击「取消」按钮 */
const cancelBtnClick = () => {
  close();
};

/** 点击菜单按钮 */
const menuBtnClick = (action: string) => {
  emits('menuClick', action);
  close();
};

defineExpose({
  open,
  close,
});
</script>

<style scoped lang="scss">
.menu{
  width: 100vw;

  background-color: #fff;
  border-radius: 20px 20px 0 0;

  display: grid;
  grid-template-rows: repeat(auto-fill, min-content);
  grid-template-columns: 1fr;

  .menu-item{
    height: 16.4103vw;

    border-bottom: 1px solid #eee;

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 4.359vw;
    color: #333;
  }
}
</style>
