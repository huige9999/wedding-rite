<template>
  <uni-nav-bar
    :title="navTitle"
    status-bar
    :border="false"
    left-icon="left"
    fixed
    @click-left="back"
  />
  <div
    v-if="isImg"
    class="image-page"
  >
    <div class="header-wrap">
      <image
        :src="headerAvator"
        class="avatar"
      />
      <div class="name">
        {{ headerNickname }}
      </div>
    </div>
    <swiper
      class="swiper"
      :indicator-dots="true"
      indicator-color="rgba(255, 255, 255, 0.3)"
      indicator-active-color="#FFFFFF"
      @change="handleSwiperChange"
    >
      <swiper-item
        v-for="item in imagePreviewList"
        :key="item"
        class="swiperItem"
      >
        <image
          :src="item"
          mode="aspectFit"
          class="sImage"
        />
      </swiper-item>
    </swiper>
    <div class="numBox">
      {{ currentIndex + 1 }}/{{ imagePreviewList.length }}
    </div>
    <div class="title">
      {{ title }}
    </div>
    <div class="mainCt">
      <text>{{ content }}</text>
    </div>
    <div
      v-if="tags"
      class="tags"
    >
      #{{ tags }}
    </div>
    <div class="editTime">
      {{ createTime }}
    </div>
  </div>
  <div
    v-if="!isImg"
    class="video-page"
  >
    <video
      class="myVideo"
      :loop="true"
      :poster="cover"
      :src="videoPath"
      objectFit="contain"
      :controls="true"
      :style="'height:' + windowHeight + 'px'"
    />
    <div class="footer-wrap">
      <div class="footer">
        <image
          :src="headerAvator"
          class="avatar"
        />
        <div class="name">
          {{ headerNickname }}
        </div>
      </div>
      <div class="content">
        <rich-text :nodes="content" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { back } from '@/utils/navigate';
import { getFindById } from '@/api/hlr-api';

const currentIndex = ref(0);
const isImg = ref(false);
const headerAvator = ref('');
const headerNickname = ref('');
const headerUserId = ref('');
const tags = ref('');
const imagePreviewList = ref('');
const title = ref('');
const content = ref('');
const cover = ref('');
const videoPath = ref('');
const id = ref('');
const windowHeight = ref(0);
const navTitle = ref('详情');

const initFind = () => {
  if (!id.value) {
    return;
  }
  getFindById(id.value).then((res) => {
    const params = {};
    console.log(res);
    params.headerAvator = res.data.user_headimg;
    params.headerNickname = res.data.user_qm_name;
    params.headerUserId = res.data.userId;
    const tmpMediaInfo = JSON.parse(res.data.mediaInfo);
    if (tmpMediaInfo.type === 'image') {
      params.isImg = true;
      params.imagePreviewList = tmpMediaInfo.mediaPath;
    } else {
      params.isImg = false;
      params.videoPath = tmpMediaInfo.mediaPath;
      params.cover = res.data.cover;
    }

    params.title = res.data.title;
    navTitle.value = params.title;
    let tmpSubject = '';

    if (res.data.subject) {
      const subjects = res.data.subject ? JSON.parse(res.data.subject) : [];
      params.subject = subjects.map((itemInner) => `#${itemInner}`);
      tmpSubject = params.subject.join(' ');
    }
    params.content = res.data.content + tmpSubject;
    params.contentReal = res.data.content;
    if (res.data.subject) {
      const tmpTags = JSON.parse(res.data.subject);
      params.tags = tmpTags.join(' ');
    }
    headerAvator.value = params.headerAvator;
    headerNickname.value = params.headerNickname;
    headerUserId.value = params.headerUserId;
    tags.value = params.tags;
    imagePreviewList.value = params.imagePreviewList;
    title.value = params.title;
    content.value = params.content;
    cover.value = params.cover;
    videoPath.value = params.videoPath;
    isImg.value = params.isImg;
  }).catch((err) => {
    console.log(err);
  });
};

onLoad((options) => {
  if (options.id) {
    id.value = options.id;
  }
});

onReady(() => {
  const deviceInfo = uni.getSystemInfoSync();
  console.log(deviceInfo.windowHeight);
  windowHeight.value = deviceInfo.windowHeight;
});

onShow(() => {
  initFind();
});
</script>

<style scoped>
.header-wrap {
  width: 750rpx;
  background-color: #fff;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 80rpx;
}
.header-wrap .avatar {
  width: 60rpx;
  height: 60rpx;
  margin-left: 30rpx;
  margin-right: 30rpx;
  border-radius: 100%;
}
.header-wrap .name {
  font-size: 28rpx;
}
.image-page {
  position: relative;
}
.image-page .swiper {
  height: 60vh;
}
.image-page .swiper .swiperItem {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  background-color: #000000;
}
.image-page .swiper .swiperItem .sImage {
  width: 750rpx;
  height: 60vh;
}
.image-page .numBox {
  width: 72rpx;
  height: 42rpx;
  background: rgba(1, 1, 1, 0.8);
  border-radius: 66rpx;
  position: absolute;
  top: 90rpx;
  right: 24rpx;
  font-size: 24rpx;
  font-weight: 400;
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
}
.image-page .title {
  margin-top: 24rpx;
  padding: 0 32rpx;
  font-size: 34rpx;
  font-weight: 600;
  color: #333333;
}
.image-page .mainCt {
  margin-top: 16rpx;
  padding: 0 32rpx;
  font-size: 28rpx;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.6);
  line-height: 40rpx;
  letter-spacing: -0.01px;
}
.image-page .tags {
  margin-top: 40rpx;
  padding: 0 32rpx;
  font-size: 28rpx;
  font-weight: 400;
  color: #23375c;
}
.image-page .editTime {
  margin-top: 40rpx;
  padding: 0 32rpx;
  font-size: 24rpx;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.4);
}
.image-page .commentTit {
  font-size: 28rpx;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.6);
  padding: 0 32rpx;
  padding-top: 98rpx;
}
.image-page .commentIpt {
  display: flex;
  background-color: #FFFFFF;
  padding: 0 40rpx;
  margin-top: 40rpx;
}
.image-page .commentIpt .avator {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
}
.image-page .commentIpt .vituralIpt {
  margin-left: 20rpx;
  width: 520rpx;
  height: 64rpx;
  background: #e5e9f0;
  border-radius: 52rpx;
  padding: 0 20rpx;
  font-size: 26rpx;
  display: flex;
  align-items: center;
}
.image-page .noCommentsBlock {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 70rpx;
  padding-bottom: 180rpx;
}
.image-page .noCommentsBlock .emptyComment {
  width: 264rpx;
  height: 187rpx;
}
.image-page .noCommentsBlock .tip {
  margin-top: 75rpx;
  font-size: 28rpx;
  font-weight: 400;
  color: #868c9b;
  line-height: 28rpx;
}
.image-page .commentsBlock {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 40rpx;
  padding-bottom: 120rpx;
}
.image-page .commentsBlock .commentsItem {
  width: 682rpx;
  margin-bottom: 20rpx;
  padding-bottom: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.image-page .commentsBlock .commentsItem .avator {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
}
.image-page .commentsBlock .commentsItem .rightCt .rTop {
  width: 584rpx;
  display: flex;
  justify-content: space-between;
  font-size: 24rpx;
  font-weight: 400;
  color: #848a9a;
  margin-bottom: 10rpx;
}
.image-page .commentsBlock .commentsItem .rightCt .rTop .name {
  width: 300rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.image-page .commentsBlock .commentsItem .rightCt .rBottom {
  width: 584rpx;
  font-size: 28rpx;
  font-weight: 400;
  color: #010101;
  line-height: 32rpx;
}
.image-page .commentsBt {
  height: 40rpx;
}
.image-page .commentBar {
  display: flex;
  position: fixed;
  bottom: 0rpx;
  left: 0;
  width: 750rpx;
  height: 98rpx;
  background: #ffffff;
  box-shadow: 0rpx -2rpx 2rpx 0rpx rgba(195, 201, 218, 0.25);
  z-index: 9999;
  padding-left: 32rpx;
  align-items: center;
}
.image-page .commentBar .inputBox {
  width: 332rpx;
  height: 72rpx;
  background: #f6f6f6;
  border-radius: 50rpx;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding-left: 32rpx;
  font-size: 32rpx;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.4);
  margin-right: 40rpx;
}
.image-page .commentBar .commentBoxGroup {
  flex: 1;
  display: flex;
  justify-content: space-around;
  margin-right: 60rpx;
}
.image-page .commentBar .commentBoxGroup .commentBox {
  display: flex;
  align-items: center;
  font-size: 28rpx;
  font-weight: 400;
  color: #333333;
}
.image-page .commentBar .commentBoxGroup .commentBox .loveIcon {
  width: 38rpx;
  height: 38rpx;
  margin-right: 6rpx;
  margin-top: 2rpx;
}
.image-page .jianpanArea {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
}
.image-page .jianpanArea .jianpanShade {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.3);
}
.image-page .jianpanArea .cmtBar {
  width: 750rpx;
  height: 106rpx;
  background-color: #FFFFFF;
  justify-content: center;
  flex-direction: row;
  padding-top: 15rpx;
  position: absolute;
  bottom: 0;
  padding-left: 15rpx;
  padding-right: 15rpx;
  display: flex;
  box-sizing: border-box;
  transition: all 0.2s linear;
}
.image-page .jianpanArea .cmtBar .iptRel {
  flex: 1;
  height: 72rpx;
  background: #f6f6f6;
  border-radius: 50rpx;
  padding: 0 32rpx;
}
.image-page .jianpanArea .cmtBar .jianPanSendBtn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 140rpx;
  height: 64rpx;
  border-radius: 52rpx;
  background-color: #010101;
  margin-left: 20rpx;
  font-size: 28rpx;
  color: #FFFFFF;
}
.image-page .popupWrap {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-around;
  padding-top: 40rpx;
}
.image-page .popupWrap .operateItem {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 140rpx;
  height: 140rpx;
  background-image: url('https://ustatic.joymew.com/joymewApp/caseDetailBg.png');
  background-size: 100% 100%;
  padding-bottom: 40rpx;
  box-sizing: border-box;
  padding-bottom: 20rpx;
  position: relative;
}
.image-page .popupWrap .operateItem .operateIcon {
  width: 40rpx;
  height: 40rpx;
}
.image-page .popupWrap .operateItem .operateIcon.edit {
  width: 44rpx;
  height: 44rpx;
}
.image-page .popupWrap .operateItem text {
  font-size: 20rpx;
  font-weight: 400;
  color: #656972;
  position: absolute;
  bottom: -10rpx;
  line-height: 20rpx;
}
.video-page {
  width: 750rpx;
  height: 100vh;
  background-color: #000;
  background-color: gray;
}
.video-page .myVideo {
  width: 750rpx;
}
.video-page .footer-wrap {
  position: absolute;
  bottom: 50rpx;
  left: 0;
}
.video-page .footer-wrap .footer {
  width: 750rpx;
  color: #fff;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 80rpx;
}
.video-page .footer-wrap .footer .avatar {
  width: 60rpx;
  height: 60rpx;
  margin-left: 30rpx;
  margin-right: 30rpx;
  border-radius: 100%;
}
.video-page .footer-wrap .footer .name {
  font-size: 28rpx;
}
.video-page .footer-wrap .content {
  color: #fff;
  font-size: 24rpx;
  padding: 40rpx;
  line-height: 2;
}

</style>
