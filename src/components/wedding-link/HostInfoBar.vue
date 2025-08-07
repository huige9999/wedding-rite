<!--
  * 主持人信息栏组件，用于显示主持人信息、预约按钮、电话按钮、分享按钮等
  * @author: Ruan Jiazhen
  * @date: 2024-04-28  17:02:49
-->
<template>
  <div
    class="host-info-bar"
    :style="{paddingBottom: `${safeAreaBottom}px`}"
  >
    <!-- 主持人头像 -->
    <image
      class="avatar"
      :src="avatar"
      mode="aspectFill"
      @click="onAvatarClick"
    />
    <!-- 主持人真实姓名 -->
    <div
      class="name"
      @click="onAvatarClick"
    >
      {{ realName||'最佳主持人' }}
    </div>
    <!-- 「转发」按钮 -->
    <div
      class="share-btn"
    >
      <button
        class="hidden-share-btn"
        open-type="share"
      />
      <image
        class="icon"
        src="@/static/icons/common/arrow-top-right-on-square-white.svg"
      />
      <span class="text">转发</span>
    </div>
    <!-- 「电话」按钮 -->
    <div
      class="phone-btn"
      @click="onPhoneIconClick"
    >
      <image
        class="icon"
        src="@/static/icons/common/phone-white.svg"
      />
      <span class="text">电话</span>
    </div>
    <!-- 「预定」按钮 -->
    <div
      class="book-btn"
      @click="onBookBtnClick"
    >
      <image
        class="icon"
        src="@/static/icons/common/pen-white.svg"
      />
      <span class="text">预定</span>
    </div>
  </div>
  <NewBookingPopup
    ref="newBookingPopup"
    @on-confirm-click="onConfirmClick"
  />
</template>

<script setup lang="ts">
import { reqSubmitBooking } from '@/api/booking-api';
import NewBookingPopup from '@/components/wedding-link/NewBookingPopup.vue';
import { navigateTo } from '@/utils/navigate';
import { showToast } from '@/utils/tools';

const ctx = getCurrentInstance();

type Props = {
  /** 用户id */
  id: string
  avatar: string
  realName: string
  phone: string,
}
const props = defineProps<Props>();

/** 底部安全区高度 */
const safeAreaBottom = ref(uni?.getSystemInfoSync()?.safeAreaInsets?.bottom || 35);

/** 电话图标点击事件 */
const onPhoneIconClick = () => {
  uni.makePhoneCall({ phoneNumber: props.phone });
};

/** 头像昵称点击事件 */
const onAvatarClick = () => {
  const currentPages = getCurrentPages() as AnyObject[];
  const currentPageRoute = currentPages[currentPages.length - 1].route;
  const currentPageUserId = currentPages[currentPages.length - 1].options.userId;
  // 只要route和userId都相同，就不跳转
  if (currentPageRoute === 'subpkg/wedding-link/my-preview-share' && currentPageUserId === props.id) {
    return;
  }
  navigateTo('my-preview-share', { userId: props.id });
};

onLoad((options) => {
  const isOpenNewBookingPopup = options?.isOpenNewBookingPopup === 'true';
  if (isOpenNewBookingPopup) {
    const newBookingPopup = ctx?.refs.newBookingPopup as InstanceType<typeof NewBookingPopup>;
    newBookingPopup?.open();
  }
});

/** 预定按钮点击事件 */
const onBookBtnClick = () => {
  const newBookingPopup = ctx?.refs.newBookingPopup as InstanceType<typeof NewBookingPopup>;
  newBookingPopup?.open();
};

/**
 * 新增预约弹窗「确定」按钮点击事件
 * @param bookingData 预约数据
 */
const onConfirmClick = async (bookingData: BookingSubmitData) => {
  const resData = (await reqSubmitBooking(props.id, bookingData))?.data as ResData<AnyObject>;
  console.log('resData', resData);
  if (resData.code === 200) {
    showToast('预约成功');

    const newBookingPopup = ctx?.refs.newBookingPopup as InstanceType<typeof NewBookingPopup>;
    newBookingPopup?.close();
    newBookingPopup.resetData();
  }
};

</script>

<style scoped lang="scss">
.host-info-bar {
  position: fixed;
  bottom: 0;
  left: 0;

  width: calc(100vw - 12px);

  background: #333;

  padding-left: 12px;
  box-sizing: content-box;
  display: grid;
  grid-template:
    'avatar . name share-btn phone-btn book-btn' 1fr
    / min-content 8px 1fr min-content min-content min-content;
  align-items: center;

  .avatar {
    grid-area: avatar;

    width: 7.1795vw;
    height: 7.1795vw;

    border: 1px solid #fff;
    border-radius: 50%;
  }

  .name {
    grid-area: name;

    font-size: 17px;
    font-weight: bold;
    color: #fff;
  }

  .share-btn {
    grid-area: share-btn;

    position: relative;

    // 隐藏的分享按钮
    .hidden-share-btn{
      position: absolute;
      top: 0;
      left: 0;

      width: 100%;
      height: 100%;

      opacity: 0;
    }
  }

  .phone-btn {
    grid-area: phone-btn;
  }

  .book-btn {
    grid-area: book-btn;
  }

  .share-btn,
  .phone-btn,
  .book-btn{
    width: 14.8718vw;
    height: 14.8718vw;

    background-color: #444;

    display: grid;
    grid-template:
      'icon' 1fr
      'text' 1fr
      / 1fr ;
    row-gap: 2px;
    justify-items: center;

    .icon {
      grid-area: icon;
      align-self: end;

      width: 16px;
      height: 16px;
    }

    .text {
      grid-area: text;

      font-size: 13px;
      line-height: 1;
      color: #fff;
    }
  }

}
</style>
