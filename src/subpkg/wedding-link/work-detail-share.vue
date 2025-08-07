<!-- 「作品详情-分享」页面 -->
<template>
  <div class="container">
    <uni-nav-bar
      class="nav-bar"
      left-icon="left"
      status-bar
      :border="false"
      @click-left="onLeftClick"
    >
      <template
        #default
      >
        <div class="center">
          <div class="nav-bar-title">
            作品详情
          </div>
        </div>
      </template>
    </uni-nav-bar>
    <!-- 主体部分 -->
    <div class="main">
      <!-- 标题 -->
      <div class="title">
        {{ workInfo?.title }}
      </div>
      <!-- 标签 -->
      <div class="tags">
        <div
          v-for="(tag, index) in workInfo?.tags"
          :key="index"
          class="tag"
        >
          {{ tag }}
        </div>
      </div>
      <!-- 作品内容 -->
      <div class="content">
        <!-- 视频缩略图 -->
        <div
          v-for="(video,index) in workInfo?.videoUrl"
          :key="index"
          class="media-item"
          @click="videoClick(video)"
        >
          <image
            class="video-thumbnail"
            :src="getVideoThumbnail(index, video, workInfo?.coverUrl)"
            mode="aspectFill"
          />
          <!-- 视频播放按钮 -->
          <image
            class="video-play-btn"
            src="@/static/icons/common/play-circle.svg"
            mode="aspectFill"
          />
        </div>
        <!-- 图片 -->
        <image
          v-for="(img,index) in workInfo?.imgUrl"
          :key="index"
          class="media-item"
          :src="img"
          mode="aspectFill"
          @click="imageClick(index)"
        />
        <!-- 文字内容 -->
        <div class="text-content">
          {{ workInfo?.desc }}
        </div>
      </div>
    </div>
  </div>
  <!-- 视频播放器 -->
  <video
    v-show="videoSrc"
    id="videoPlayer"
    class="video-player"
    :src="videoSrc"
    :show-fullscreen-btn="false"
    @fullscreenchange="onVideoFullscreenChange"
  />
  <!-- 主持人信息栏 -->
  <HostInfoBar
    :id="userInfo.id"
    :avatar="userInfo.avatar"
    :real-name="personalInfo.realName || ''"
    :phone="userInfo.phone"
  />
  <!-- 授权昵称头像弹窗 -->
  <AvatarNicknameAuthPopup />
</template>

<script lang="ts" setup>
import { reqGetWorkDetail } from '@/api/work-api';
import HostInfoBar from '@/components/wedding-link/HostInfoBar.vue';
import AvatarNicknameAuthPopup from '@/components/wedding-link/avatarNicknameAuthPopup.vue';
import { useTempUser } from '@/stores/temp-user-store';
import useUser from '@/stores/user-store';
import { navigateTo } from '@/utils/navigate';
import { parseWorkInfo } from '@/utils/parse';
import { getVideoThumbnail } from '@/utils/wedding-link';
import type { VideoOnFullscreenchangeEvent } from '@uni-helper/uni-app-types';

const ctx = getCurrentInstance();

const userStore = useUser();
const { userInfo, personalInfo } = storeToRefs(userStore);

const tempUserStore = useTempUser();
const { tempUserInfo } = storeToRefs(tempUserStore);

/** 作品信息 */
const workInfo = ref<WorkInfo>();
onLoad(async (option) => {
  console.log('option', option);
  try {
    const workDetailRes = await reqGetWorkDetail(option?.workId);
    console.log('workDetailRes', workDetailRes);
    workInfo.value = parseWorkInfo((workDetailRes?.data as AnyObject).data);
  } catch (e) {
    console.error('reqGetWorkDetail', e);
  }
});

/** 返回按钮点击事件，跳转到「我的预览-分享」页面 */
const onLeftClick = () => {
  // 如果有上一页，则返回上一页
  const pages = getCurrentPages();
  if (pages.length > 1) {
    uni.navigateBack();
    return;
  }
  navigateTo('my-preview-share', { userId: userInfo.value.id });
};

// #region 分享相关
onShareAppMessage(() => ({
  title: '我的作品已更新，快来查看吧',
  path: `/subpkg/wedding-link/work-detail-share?userId=${userInfo.value.id}&workId=${workInfo.value?.id}&inviterId=${tempUserInfo.value.id}`,
  imageUrl: workInfo.value?.coverUrl || workInfo.value?.imgUrl[0],
}));

// #endregion

// #region 主持人信息栏相关

// #endregion

// #region 图片/视频相关

/**
 * 点击图片事件
 * @param imgIndex
 */
const imageClick = (imgIndex:number) => {
  if (workInfo) {
    const urls = workInfo.value?.imgUrl || [];
    uni.previewImage({
      urls,
      current: urls[imgIndex],
    });
  }
};

/** 要播放的视频地址 */
const videoSrc = ref('');

/**
 * 点击视频缩略图事件
 * @param videoUrl 视频地址
 */
const videoClick = (videoUrl:string) => {
  if (videoUrl) {
    videoSrc.value = videoUrl;
    const videoContext = uni.createVideoContext('videoPlayer', ctx);
    videoContext.requestFullScreen({ direction: 0 });
  }
};

/**
 * 视频全屏切换事件
 * @param e 事件
 */
const onVideoFullscreenChange = (e:VideoOnFullscreenchangeEvent) => {
  console.log('fullscreenchange', e.detail);
  // 如果是打开全屏，则进行播放
  if (e.detail.fullScreen) {
    const videoContext = uni.createVideoContext('videoPlayer', ctx);
    videoContext.play();
    return;
  }
  // 如果是退出全屏，则清空src
  videoSrc.value = '';
};

// #endregion
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;

  box-sizing: content-box;
  display: grid;
  grid-template:
    'nav-bar' min-content
    'main' auto
    / 1fr;

  .nav-bar {
    grid-area: nav-bar;

    // 中间部分
    .center {
      width: 100%;
      height: 100%;

      display: flex;
      align-items: center;
      justify-content: center;

      // 标题
      .nav-bar-title{
        font-size: 14px;
      }

      // 更多按钮
      .more-btn {
        width: 24px;
        height: 24px;
      }
    }
  }

  .main {
    grid-area: main;

    padding: 12px;
    display: grid;
    grid-template:
      'title' min-content
      'tags' min-content
      'content' min-content
      / 1fr;
    row-gap: 12px;

    .title {
      grid-area: title;

      font-size: 6.1538vw;
    }

    .tags {
      grid-area: tags;

      display: flex;
      flex-wrap: wrap;
      gap: 8px;

      .tag {
        background-color: #000;

        padding: 4px 8px;

        font-size: 12px;
        color: #fff;
      }
    }

    .content {
      grid-area: content;

      padding-bottom: calc(12px + env(safe-area-inset-bottom));
      padding-bottom: calc(12px + constant(safe-area-inset-bottom));
      display: grid;
      grid-template-rows: repeat(auto-fill, 52.8205vw);
      row-gap: 12px;

      .media-item {
        position: relative;

        width: 100%;
        height: 52.8205vw;
        overflow: hidden;

        border-radius: 8px;

        // 视频缩略图
        .video-thumbnail{
          width: 100%;
          height: 100%;
        }

        // 视频播放按钮
        .video-play-btn {
          position: absolute;
          top: 50%;
          left: 50%;

          width: 10.2564vw;
          height: 10.2564vw;

          transform: translate(-50%, -50%);
        }
      }

      // 文字内容
      .text-content {
        padding: 12px;

        font-size: 14px;
        line-height: 1.5;
        color: #333;
        text-align: justify;
      }
    }
  }
}

// 视频播放器
.video-player{
  position: absolute;
  top: 0;
  left: 0;

  transform: translateY(-100%);
}
</style>
