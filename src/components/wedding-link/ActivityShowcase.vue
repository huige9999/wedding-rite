<!-- 「动态展示版块」 -->
<!-- 目前用于「我的预览」和「我的预览-分享」页面的动态展示 -->
<template>
  <div class="activity-showcase">
    <!-- 动态标题 -->
    <div
      class="activities-title"
      @click="titleClick"
    >
      <span class="text">动态</span>
      <image
        class="icon"
        src="@/static/icons/common/right-white.svg"
        mode="scaleToFill"
      />
    </div>
    <!-- 动态列表 -->
    <div class="activity-list">
      <!-- 单个动态内容 -->
      <div
        v-for="activity in currentActivityList"
        :key="activity.id"
        class="activity"
        @click="activityClick(activity.id)"
      >
        <!-- 文字内容 -->
        <div class="text">
          {{ activity.content }}
        </div>
        <!-- 媒体内容 -->
        <div class="media-list">
          <!-- 视频项 -->
          <div
            v-for="videoIndex in Math.min(activity?.videoUrl?.length||0, 3)"
            :key="videoIndex"
            class="media-item"
            @click.stop="videoClick(activity?.videoUrl?.[videoIndex-1]||'')"
          >
            <!-- 视频缩略图 -->
            <image
              class="video-thumbnail"
              :src="activity?.videoUrl?.[videoIndex-1]+'?vframe/jpg/offset/0'"
              mode="aspectFill"
            />
            <!-- 视频播放按钮 -->
            <image
              class="video-play-btn"
              src="@/static/icons/common/play-circle.svg"
              mode="aspectFill"
            />
          </div>
          <!-- 照片项 -->
          <image
            v-for="imgIndex in Math.min(activity?.imgUrl?.length||0, 3)"
            :key="imgIndex"
            class="media-item"
            :src="activity?.imgUrl?.[imgIndex-1]||''"
            mode="aspectFill"
            @click.stop="photoClick(activity, imgIndex-1)"
          />
        </div>
      </div>
    </div>
    <!-- 「更多动态」按钮 -->
    <div
      v-if="activityList.length > 2"
      class="more-activities-btn"
      @click="titleClick"
    >
      更多动态
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
</template>

<script setup lang="ts">
import { navigateTo } from '@/utils/navigate';
import type { VideoOnFullscreenchangeEvent } from '@uni-helper/uni-app-types';

const ctx = getCurrentInstance();

type Props= {
  activityList: ActivityInfo[];
  /** 是否是分享的 */
  isShare: boolean;
  /** 展示的用户的id */
  userId: string;
  /** 是否是分享给同行的 */
  isShareWorkmate: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isShare: false,
  userId: '',
  isShareWorkmate: false,
});

/** 要展示的动态列表 */
const currentActivityList = computed(() => props.activityList.slice(0, 2));

// #region 标题等点击事件

/** 标题点击事件 */
const titleClick = () => {
  if (props.isShare) {
    navigateTo('more-activities', { userId: props.userId });
    return;
  }

  if (props.isShareWorkmate) {
    navigateTo('more-activities-share-workmate', { userId: props.userId });
    return;
  }
  navigateTo('activities');
};

/**
 * 单条动态点击事件
 * @param activityId 动态id
 */
const activityClick = (activityId:string) => {
  if (props.isShare) {
    navigateTo('activity-detail-share', { activityId });
    return;
  }
  if (props.isShareWorkmate) {
    navigateTo('activity-detail-share-workmate', { activityId });
    return;
  }
  navigateTo('activity-detail', { activityId });
};

// #endregion

// #region 动态视频和照片相关

/** 要播放的视频地址 */
const videoSrc = ref('');

/**
 * 点击视频缩略图事件
 * @param videoUrl 视频地址
 */
const videoClick = (videoUrl:string) => {
  videoSrc.value = videoUrl;
  const videoContext = uni.createVideoContext('videoPlayer', ctx);
  videoContext.requestFullScreen({ direction: 0 });
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

/**
 *  照片点击事件
 * @param activityInfo 动态信息
 * @param index 照片索引
 */
const photoClick = (activityInfo:ActivityInfo, index:number) => {
  console.log('photoClick', activityInfo, index);
  const photoList = activityInfo.imgUrl || [];
  uni.previewImage({
    urls: photoList,
    current: photoList[index],
  });
};

// #endregion
</script>

<style scoped lang="scss">
.activity-showcase{
  width: 100vw;

  padding: 24px 12px;
  display: grid;
  grid-template:
    'title' 7.4359vw
    'activity-list' auto
    'more-activities-btn' min-content
    / 1fr;

  .activities-title {
    grid-area: title;

    display: flex;
    column-gap: 8px;
    align-items: center;

    .text {
      font-size: 5.3846vw;
      font-weight: bold;
      color: #fff;
    }

    .icon {
      width: 3.5897vw;
      height: 3.5897vw;
    }
  }

  .activity-list {
    grid-area: activity-list;

    .activity {
      width: 100%;

      border-bottom: 1px solid #484653;

      padding: 24px 0 62px;
      display: grid;
      grid-template:
        'text' auto
        'images' auto;
      row-gap: 20px;

      // 文字内容
      .text {
        grid-area: text;

        font-size: 4.359vw;
        color: #fff;
      }

      // 图片内容
      .media-list {
        grid-area: images;

        display: grid;
        grid-template-rows: repeat(auto-fill, 30.7692vw);
        grid-template-columns: repeat(3, 30.7692vw);
        gap: 3px;
        justify-items: center;

        .media-item {
          position: relative;

          width: 30.7692vw;
          height: 30.7692vw;
          overflow: hidden;

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
      }
    }
  }

  .more-activities-btn {
    grid-area: more-activities-btn;
    margin-top: 36px;

    width: 93.8462vw;
    height: 10.2564vw;

    background: #424148;
    border-radius: 8.2051vw;
    box-shadow: 0 2px 8px 0 rgb(52 51 47 / 25%);

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 3.3333vw;
    color: #fff;
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
