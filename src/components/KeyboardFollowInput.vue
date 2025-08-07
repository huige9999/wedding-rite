<!--
  * 跟随键盘移动的输入框组件，用于适配某些平台输入栏被抬起的高度不正确的问题
-->
<template>
  <div
    v-if="isShow"
    class="comment-input"
    :style="inputBottomStyle"
  >
    <input
      v-model="content"
      class="input"
      placeholder="说点什么吧"
      :maxlength="maxInputLength"
      :focus="isShow"
      auto-blur
      :adjust-position="false"
      @keyboardheightchange="keyboardHeightChange"
      @blur="inputBlur"
    >
    <div
      class="send-btn"
      :class="content ? 'active' : ''"
      @click="sendClick"
    >
      发送
    </div>
  </div>
</template>

<script setup lang="ts">
import type { InputOnKeyboardheightchangeEvent } from '@uni-helper/uni-app-types';

type Props = {
  /** 是否显示 */
  isShow: boolean;
  /** 是否随键盘上移 */
  isFollowKeyboard: boolean;
  /** 最大输入字数 */
  maxInputLength: number;
}

const props = withDefaults(defineProps<Props>(), {
  isShow: false,
  isFollowKeyboard: true,
  maxInputLength: 100,
});

type Emit = {
  clickSendBtn: [content: string];
  blur: [];
}

const emit = defineEmits<Emit>();

/** 输入框距离底部距离的相关样式 */
const inputBottomStyle = ref({ bottom: '0px' });

/**
 * 键盘高度变化事件，将输入框距离底部的距离设置为键盘高度
 * @param e 事件对象
 */
const keyboardHeightChange = (e: InputOnKeyboardheightchangeEvent) => {
  if (!props.isFollowKeyboard) return;
  const systemInfo = uni.getSystemInfoSync();
  const tabbarHeight = (systemInfo.screenHeight - systemInfo.windowHeight
    - (systemInfo?.statusBarHeight || 0));
  const safeAreaBottom = systemInfo.screenHeight - (systemInfo?.safeArea?.height || 0);
  inputBottomStyle.value.bottom = `${e.detail.height - tabbarHeight - safeAreaBottom}px`;
};

/** 输入框失去焦点事件 */
const inputBlur = () => {
  emit('blur');
};

/** 评论内容 */
const content = ref('');

/** 点击「发送」 按钮 */
const sendClick = async () => {
  emit('clickSendBtn', content.value);
  content.value = '';
};
</script>

<style scoped lang="scss">
// 评论输入框
.comment-input{
  position: fixed;
  bottom: 0;
  left: 0;

  width: 100vw;
  height: 50px;

  background-color: #fff;

  padding: 0 12px;
  display: flex;
  column-gap: 10px;
  align-items: center;

  .input {
    height: calc(100% - 15px);

    background-color: #f6f6f6;
    border: none;
    border-radius: 2px;
    outline: none;

    padding-left: 10px;
    flex: 1;

    font-size: 14px;
    color: #333;
  }

  .send-btn {
    width: 50px;
    height: calc(100% - 15px);

    background-color: #f6f6f6;
    border-radius: 5px;

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 14px;
    color: #999;

    // 激活状态
    &.active {
      background-color: #ffd47f;

      color: #fff;
    }
  }
}
</style>
