<!-- 「我的地址」弹窗 -->
<template>
  <uni-popup
    ref="popup"
    type="center"
  >
    <div class="container">
      <!-- 标题 -->
      <div class="title">
        我的地址
      </div>
      <!-- 年龄 -->
      <div class="address">
        {{ addressText }}
      </div>
      <!-- 关闭按钮 -->
      <div class="close-area">
        <image
          class="close-icon"
          mode="aspectFit"
          src="@/static/icons/common/cancel-circle-white.svg"
          @click="onClickClose"
        />
      </div>
    </div>
  </uni-popup>
</template>

<script setup lang="ts">
import type { UniPopup } from '@uni-helper/uni-ui-types';

const ctx = getCurrentInstance();

type Props = {
  /** 地址 */
  address: string[]
}

const props = withDefaults(defineProps<Props>(), { address: () => [] });

// 地址文本
const addressText = computed(() => props.address.join('-'));

/** 打开弹窗 */
const open = () => {
  const popup = ctx?.refs.popup as UniPopup;
  popup.open();
};

/** 关闭弹窗 */
const close = () => {
  const popup = ctx?.refs.popup as UniPopup;
  popup.close();
};

/** 点击「关闭」按钮 */
const onClickClose = () => {
  close();
};

defineExpose({
  open,
  close,
});
</script>

<style scoped lang="scss">
.container{
  width: 74.359vw;
  min-height: 47.4359vw;

  background: #666;
  border-radius: 4px;

  display: grid;
  grid-template:
    'title' 13.5897vw
    'address' min-content
    'close-area' 1fr
    /1fr;
  gap: 1px;

  // 标题
  .title{
    grid-area: title;

    width: 100%;
    height: 100%;

    background-color: #333;

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 15px;
    color: #fff;
  }

  // 地址
  .address{
    grid-area: address;

    width: 100%;
    min-height: 19.2308vw;

    background-color: #333;

    padding: 20px 10px;
    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 13px;
    color: #FFF;

  }

  // 关闭按钮
  .close-area{
    grid-area: close-area;

    width: 100%;
    height: 100%;

    background-color: #333;

    display: flex;
    align-items: center;
    justify-content: center;

    .close-icon{
      width: 20px;
      height: 20px;
    }
  }
}
</style>
