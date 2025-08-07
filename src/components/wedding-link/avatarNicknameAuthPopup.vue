<!-- 授权头像昵称弹窗 -->
<!-- 目前用于临时用户的设置头像昵称，所以相关的后端交互逻辑也封装在这里面了 -->
<template>
  <uni-popup
    ref="tipPopup"
    type="bottom"
    :safe-area="false"
  >
    <div class="tip-popup">
      <image
        class="logo"
        src="@/static/icons/common/logo.png"
        mode="aspectFit"
      />
      <text class="tip-text">
        授权后可查看更多内容
      </text>
      <div
        class="auth-btn"
        @click="onClickAuthBtn"
      >
        一键授权
      </div>
      <div
        class="cancel-btn"
        @click="closeTipPopup"
      >
        取消
      </div>
    </div>
  </uni-popup>
  <!-- 完善信息弹窗 -->
  <uni-popup
    ref="infoPopup"
    type="bottom"
    :safe-area="false"
  >
    <div
      class="info-popup"
    >
      <!-- 标题 -->
      <div class="title">
        完善信息以继续浏览
      </div>
      <!-- 「X」按钮 -->
      <image
        class="close"
        src="@/static/icons/common/close-circle-fill.svg"
        mode="aspectFill"
        @click="closeInfoPopup"
      />
      <!-- 头像 -->
      <div class="avatar">
        <text class="text">
          头像
        </text>
        <image
          class="avatar-img"
          :src="newAvatar|| tempUserInfo.avatar || defaultAvatar"
          mode="aspectFill"
        />
        <!-- 授权头像按钮 -->
        <button
          class="avatar-img btn"
          open-type="chooseAvatar"
          @chooseavatar="onClickAvatar"
        />
      </div>
      <!-- 昵称 -->
      <div class="nickname">
        <text class="text">
          昵称
        </text>
        <div
          class="nickname-tip"
          @click="getNicknameClick"
        >
          {{ newNickname || '点击获取微信昵称' }}
        </div>
        <image
          class="arrow-btn"
          src="@/static/icons/common/right.svg"
          @click="getNicknameClick"
        />
      </div>
      <!-- 「跳过」按钮 -->
      <div
        class="skip-btn"
        @click="closeInfoPopup"
      >
        跳过
      </div>
      <!-- 「确认」按钮 -->
      <div
        class="confirm-btn"
        @click="confirmClick"
      >
        确认
      </div>
    </div>
  </uni-popup>
  <!-- 昵称输入框 -->
  <div
    v-if="showNicknameInput"
    class="nickname-input"
    :style="inputBottomStyle"
  >
    <input
      v-model="newNickname"
      class="input"
      type="nickname"
      maxlength="100"
      :focus="showNicknameInput"
      auto-blur
      :adjust-position="false"
      @keyboardheightchange="keyboardHeightChange"
      @blur="nicknameInputBlur"
    >
    <div
      class="send-btn"
      :class="newNickname ? 'active' : ''"
      @click="confirmClick"
    >
      确定
    </div>
  </div>
</template>

<script setup lang="ts">
import defaultAvatar from '@/static/icons/common/user.svg';
import type { ButtonOnChooseavatarEvent, InputOnKeyboardheightchangeEvent } from '@uni-helper/uni-app-types';
import type { UniPopup } from '@uni-helper/uni-ui-types';
import { useTempUser } from '@/stores/temp-user-store';
import { reqUploadAnyFile } from '@/api/others';
import { parseUploadFileUrl } from '@/utils/parse';
import { reqEditTemUserInfo, reqGetPersonalInfo } from '@/api/user-api';

const ctx = getCurrentInstance();

const tempUserStore = useTempUser();
const { tempUserInfo } = storeToRefs(tempUserStore);

/** 打开提示弹窗 */
const openTipPopup = () => {
  const tipPopup = ctx?.refs.tipPopup as UniPopup;
  tipPopup.open();
};

/** 关闭提示弹窗 */
const closeTipPopup = () => {
  const tipPopup = ctx?.refs.tipPopup as UniPopup;
  tipPopup.close();
};

/** 打开完善信息弹窗 */
const openInfoPopup = () => {
  const infoPopup = ctx?.refs.infoPopup as UniPopup;
  infoPopup.open();
};

/** 关闭完善信息弹窗 */
const closeInfoPopup = () => {
  const infoPopup = ctx?.refs.infoPopup as UniPopup;
  infoPopup.close();
};

/** 「一键授权」按钮点击事件 */
const onClickAuthBtn = () => {
  openInfoPopup();
  closeTipPopup();
};

/** 头像 */
const newAvatar = ref('');

/**
 * 头像点击事件
 * @param event 选择头像事件
 */
const onClickAvatar = async (event:Event | ButtonOnChooseavatarEvent) => {
  newAvatar.value = (event as ButtonOnChooseavatarEvent).detail.avatarUrl;
};

/** 昵称输入框是否显示 */
const showNicknameInput = ref(false);

/** 输入框距离底部距离的相关样式 */
const inputBottomStyle = ref({ bottom: '60px' });

/**
 * 键盘高度变化事件
 * @param e 事件对象
 */
const keyboardHeightChange = (e: InputOnKeyboardheightchangeEvent) => {
  // 因为是有昵称提示，所以需要加上昵称提示的高度（60px）
  inputBottomStyle.value.bottom = `${e.detail.height + 60}px`;
};

/** 评论内容 */
const newNickname = ref('');

/** 获取昵称点击事件 */
const getNicknameClick = () => {
  showNicknameInput.value = true;
};

/** 昵称输入框失去焦点事件 */
const nicknameInputBlur = () => {
  setTimeout(() => {
    showNicknameInput.value = false;
  }, 100);
};

const onConfirmAuthAvatarNickname = async (e: {
  avatar: string;
  nickname: string;
}) => {
  console.log('onConfirmAuthAvatarNickname', e);
  // 如果返回的头像昵称和原来的一样，则不用修改
  if (
    e.avatar === tempUserInfo.value.avatar
    && e.nickname === tempUserInfo.value.nickname
  ) {
    return;
  }

  // 如果返回的头像和原来的不同，则判断是否是新的头像，如果是则上传头像
  const newUserInfo = {
    avatar: tempUserInfo.value.avatar,
    nickname: tempUserInfo.value.nickname,
  };
  // 如果添加了新的头像，则上传头像
  if (e.avatar !== tempUserInfo.value.avatar) {
    const uploadRes = await reqUploadAnyFile(e.avatar);
    const filePath = parseUploadFileUrl(uploadRes?.data);
    newUserInfo.avatar = filePath;
  }

  // 如果添加了新的昵称，则修改昵称
  if (e.nickname !== tempUserInfo.value.nickname) {
    newUserInfo.nickname = e.nickname;
  }
  const editResult = await reqEditTemUserInfo(newUserInfo);

  if (editResult) {
    await reqGetPersonalInfo();
    console.log('new myUserInfo', tempUserInfo);
  }
};

/** 点击「确定」 按钮 */
const confirmClick = async () => {
  showNicknameInput.value = false;
  onConfirmAuthAvatarNickname({
    avatar: newAvatar.value,
    nickname: newNickname.value,
  });
  closeInfoPopup();
};

watch(() => tempUserInfo, (newVal) => {
  newNickname.value = newVal.value.nickname;
  if (!newVal.value.avatar || !newVal.value.nickname) {
    console.log('openTipPopup', newVal);
    openTipPopup();
  }
});

defineExpose({
  openTipPopup,
  closeTipPopup,
  openInfoPopup,
  closeInfoPopup,
});

</script>

<style scoped lang="scss">
// 提示授权弹窗
.tip-popup{
  width: 100vw;
  height: calc(71.7949vw + env(safe-area-inset-bottom));
  height: calc(71.7949vw + constant(safe-area-inset-bottom));

  background-color: #fff;

  padding: 32px 0 20px;
  display: grid;
  grid-template:
    'logo' min-content
    '.' 24px
    'tip-text' min-content
    '.' 20px
    'auth-btn' min-content
    '.' 8px
    'cancel-btn' min-content
    / 1fr;
  align-items: center;
  justify-items: center;

  // logo
  .logo{
    grid-area: logo;

    width: 20vw;
    height: 20vw;
  }

  // 提示文字
  .tip-text{
    grid-area: tip-text;

    font-size: 14px;
    color: #333;
  }

  // 「一键授权」按钮
  .auth-btn{
    grid-area: auth-btn;

    width: 82.0513vw;
    height: 11.2821vw;

    background: #212125;
    border-radius: 2px;

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 14px;
    color: #fff;
  }

  // 「取消」按钮
  .cancel-btn{
    grid-area: cancel-btn;

    width: 82.0513vw;
    height: 11.2821vw;

    background: #bcbcbe;
    border-radius: 2px;

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 14px;
    color: #fff;
  }
}

// 完善信息弹窗
.info-popup{
  width: 100vw;
  height: calc(71.7949vw + env(safe-area-inset-bottom));
  height: calc(71.7949vw + constant(safe-area-inset-bottom));

  background-color: #fff;
  border-radius: 16px 16px 0 0;

  padding: 12px 24px 14px;
  display: grid;
  grid-template:
    'title title' min-content
    '. .' 30px
    'avatar avatar ' min-content
    '. .' 24px
    'nickname nickname' min-content
    '. .' 40px
    'skip-btn confirm-btn' min-content
    / 1fr 1fr;
  align-items: center;
  justify-items: center;

  // 标题
  .title{
    grid-area: title;

    font-size: 17px;
    font-weight: bold;
    color: #161823;
  }

  // 「X」按钮
  .close{
    grid-area: 1/2/1/2;
    justify-self: end;

    width: 7.1795vw;
    height: 7.1795vw;

    translate: (4px, 0);
  }

  // 头像
  .avatar{
    grid-area: avatar;

    width: 100%;
    height: 9.2308vw;

    display: grid;
    grid-template:
      'text avatar-img' 1fr
      /auto 1fr;
    align-items: center;

    .text{
      grid-area: text;

      color: #333;
    }

    .avatar-img{
      grid-area: avatar-img;
      justify-self: end;

      width: 9.2308vw;
      height: 9.2308vw;
    }

    // 隐藏的授权按钮
    .btn{
      opacity: 0;
    }
  }

  // 昵称
  .nickname{
    grid-area: nickname;

    width: 100%;
    height: 11.2821vw;

    border-bottom: 1px solid #e5e5e5;

    display: grid;
    grid-template:
      'text tip arrow-btn' 1fr
      /min-content 1fr min-content;
    column-gap: 4px;
    align-items: center;

    .text{
      grid-area: text;

      width: 32px;

      color: #333;
    }

    .nickname-tip{
      grid-area: tip;
      justify-self: end;

      color: #8d8d8d;
    }

    .arrow-btn{
      grid-area: arrow-btn;

      width: 4.1026vw;
      height: 4.1026vw;
    }
  }

  // 「跳过」按钮
  .skip-btn{
    grid-area: skip-btn;

    background-color: #bcbcbe;
  }

  // 「确定」按钮
  .confirm-btn{
    grid-area: confirm-btn;

    background: #212125;

  }

  .skip-btn,
  .confirm-btn{
    width: 36.9231vw;
    height: 11.2821vw;

    border-radius: 2px;

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 14px;
    color: #fff;
  }
}

// 昵称输入框
.nickname-input{
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 1000;

  width: 100vw;
  height: 50px;

  background-color: #fff;

  padding: 0 12px;
  display: flex;
  align-items: center;

  .input {
    height: 100%;

    border: none;
    outline: none;
    flex: 1;

    font-size: 14px;
    color: #333;
  }

  .send-btn {
    width: 50px;
    height: 100%;

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 14px;
    color: #999;

    // 激活状态
    &.active {
      color: #fca800;
    }
  }
}

</style>
