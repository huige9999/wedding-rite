<!-- 编辑动态弹窗 -->
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
          删除动态
        </text>
      </div>
      <!-- 编辑 -->
      <div
        class="share-friend"
        @click="onEditBtnClick"
      >
        <image
          src="@/static/icons/common/edit.svg"
          mode="scaleToFill"
          class="icon"
        />
        <text class="text">
          编辑
        </text>
      </div>
    </div>
  </uni-popup>
</template>

<script setup lang="ts">
import type { UniPopupInstance } from '@uni-helper/uni-ui-types';

const ctx = getCurrentInstance();

type Props = {
  activityId: string
}

type Emits = {
  (e: 'delete', activityId:string): void
  (e: 'edit', activityId:string): void
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
  console.log('id', props.activityId);
  emit('delete', props.activityId);
  close();
};

/** 编辑按钮点击事件 */
const onEditBtnClick = () => {
  console.log('id', props.activityId);
  emit('edit', props.activityId);
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
