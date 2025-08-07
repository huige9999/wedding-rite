<!--
  * 作品详情页面
  * @author: Ruan Jiazhen
  * @date: 2024-04-28  17:54:26
-->
<template>
  <div class="container">
    <uni-nav-bar
      class="nav-bar"
      left-icon="left"
      status-bar
      :border="false"
      @click-left="back"
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
      <!--「...」按钮 -->
      <image
        class="more-btn"
        src="@/static/icons/common/more-black.svg"
        @click="onMoreBtnClick"
      />
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
  <EditWorkPopup
    ref="editWorkPopup"
    :work-id="workInfo?.id || ''"
    @delete="onDeleteBtnClick"
  />
  <!-- 视频播放器 -->
  <video
    v-show="videoSrc"
    id="videoPlayer"
    class="video-player"
    :src="videoSrc"
    :show-fullscreen-btn="false"
    @fullscreenchange="onVideoFullscreenChange"
  />
</template>

<script lang="ts" setup>
import { reqDeleteWork, reqGetWorkDetail } from '@/api/work-api';
import EditWorkPopup from '@/components/wedding-link/editWorkPopup.vue';
import useUser from '@/stores/user-store';
import useWork from '@/stores/work-store';
import { back } from '@/utils/navigate';
import { parseWorkInfo } from '@/utils/parse';
import { showToast } from '@/utils/tools';
import { getVideoThumbnail } from '@/utils/wedding-link';
import type { VideoOnFullscreenchangeEvent } from '@uni-helper/uni-app-types';

const ctx = getCurrentInstance();

const userStore = useUser();
const { userInfo } = storeToRefs(userStore);

const workStore = useWork();
const { getWorkList } = workStore;

/** 作品信息 */
const workInfo = ref<WorkInfo>();

onLoad(async (option) => {
  console.log('option', option);
  if (!option?.workId) back();
  try {
    const res = await reqGetWorkDetail(option?.workId);
    workInfo.value = parseWorkInfo((res?.data as AnyObject).data);
  } catch (e) {
    console.error('reqGetWorkDetail', e);
  }
});

// #region 分享相关

onShareAppMessage(() => ({
  title: '我的作品已更新，快来查看吧',
  path: `/subpkg/wedding-link/work-detail-share?userId=${userInfo.value.id}&workId=${workInfo.value?.id}&inviterId=${userInfo.value.id}`,
  imageUrl: workInfo.value?.coverUrl || workInfo.value?.imgUrl[0],
}));

// #endregion

// #region 编辑作品弹窗相关

/**
 * 点击「...」按钮事件
 * @param workId 作品id
 */
const onMoreBtnClick = () => {
  const popup = ctx?.refs.editWorkPopup as InstanceType<typeof EditWorkPopup>;
  if (popup?.open) {
    popup.open();
  }
};

/**
 * 点击删除按钮事件
 * @param workId 作品id
 */
const onDeleteBtnClick = async (workId: string) => {
  try {
    const resData = (await reqDeleteWork(workId))?.data as AnyObject;
    if (resData.code === 200) {
      await getWorkList();
      back();
    } else {
      showToast('删除失败，请稍后重试');
    }
    console.log('onDeleteBtnClick', resData);
  } catch (err) {
    console.error('onDeleteBtnClick', err);
  }
};

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
    }
  }

  .main {
    grid-area: main;

    padding: 12px;
    display: grid;
    grid-template:
      'title more-btn' min-content
      'tags tags' min-content
      'content content' min-content
      / 1fr 1fr;
    row-gap: 12px;

    .title {
      grid-area: title;

      font-size: 6.1538vw;
    }

    // 「...」按钮
    .more-btn {
      grid-area: more-btn;
      justify-self: end;

      width: 24px;
      height: 24px;
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
