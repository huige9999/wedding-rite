<!-- 编辑作品弹窗 -->
<template>
  <uni-popup
    ref="popup"
    type="bottom"
    :safe-area="false"
  >
    <div class="container">
      <!-- 操作条 -->
      <div class="bar" />
      <!-- 删除作品按钮 -->
      <div
        class="delete-btn"
        @click="onDeleteBtnClick"
      >
        <image
          src="@/static/icons/common/recycle-bin.svg"
          mode="scaleToFill"
          class="icon"
        />
        <text class="text">
          删除作品
        </text>
      </div>
      <!-- 分享给朋友 -->
      <div class="share-friend">
        <button
          class="share-btn"
          open-type="share"
          :data-work-id="props.workId"
          :data-work-cover="props.coverUrl"
        />
        <image
          src="@/static/icons/common/wechat.svg"
          mode="scaleToFill"
          class="icon"
        />
        <text class="text">
          分享给朋友
        </text>
      </div>
    </div>
  </uni-popup>
</template>

<script setup lang="ts">
import type { UniPopupInstance } from '@uni-helper/uni-ui-types';

const ctx = getCurrentInstance();

type Props = {
  workId: string
  /** 作品封面 */
  coverUrl?: string
}

type Emits = {
  (e: 'delete', workId:string): void
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

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

/** 删除按钮点击事件 */
const onDeleteBtnClick = () => {
  console.log('id', props.workId);
  emit('delete', props.workId);
  close();
};

defineExpose({
  open,
  close,
});

</script>

<style scoped lang="scss">
.container{
  width: 100vw;
  height: auto;

  background-color: #EDEDED;
  border-radius: 20px 20px 0 0;

  padding-top: 16px;
  padding-bottom: 20px;
  box-sizing: content-box;
  display: grid;
  grid-template:
    'bar bar' 4px
    'delete-btn  share-friend' 27.1795vw
    /1fr 1fr;
  row-gap: 28px;

  // 操作条
  .bar{
    grid-area: bar;
    justify-self: center;

    width: 36px;
    height: 4px;

    background: #d4d6d8;
    border-radius: 17px;
  }

  // 删除作品按钮，分享到朋友圈，分享给朋友
  .delete-btn,
  .share-moment,
  .share-friend{
    position: relative;

    display: flex;
    flex-direction: column;
    row-gap: 12px;
    align-items: center;
    justify-content: center;

    // 隐藏的分享按钮
    .share-btn{
      position: absolute;
      top: 0;
      left: 0;

      width: 100%;
      height: 100%;

      opacity: 0;
    }

    .icon{
      width: 19.4872vw;
      height: 19.4872vw;
    }

    .text{
      font-size: 3.3333vw;
      color: #8d8d8d;
    }
  }

  // 删除作品按钮
  .delete-btn{
    grid-area: delete-btn;
  }

  // 分享给朋友
  .share-friend{
    grid-area: share-friend;
  }
}
</style>
