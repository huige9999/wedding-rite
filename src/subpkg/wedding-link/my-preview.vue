<!-- 「我的预览」页面 -->
<template>
  <div class="container">
    <!-- 照片背景 -->
    <image
      class="photo-bg"
      :src="currentPhoto"
      mode="aspectFill"
    />
    <uni-nav-bar
      class="nav-bar"
      left-icon="left"
      :title="personalInfo.realName"
      status-bar
      :border="false"
      background-color="#00000000"
      color="#fff"
      @click-left="back"
    />
    <!-- 白色隐藏标题栏 -->
    <uni-nav-bar
      class="hidden-nav-bar"
      :style="{opacity: whiteNavBarOpacity}"
      :title="personalInfo.realName"
      :border="false"
      status-bar
      color="#000"
      background-color="#fff"
      left-icon="left"
      @click-left="back"
    />
    <!-- 主体部分 -->
    <div class="main">
      <!-- 个人信息 -->
      <div class="personal-profile">
        <!-- 照片轮播图 -->
        <PhotoSwiper
          class="photo-swiper"
          :photo-list="personalInfo.photoList"
          :is-show-edit-btn="false"
          @photo-swiper-change="photoSwiperChange"
        />
        <!-- 标题 -->
        <div class="title">
          {{ personalInfo.realName }}作品合集
        </div>
        <!-- 简介 -->
        <div class="intro">
          <p
            v-for="(line, index) in splitStrByLineBreak(personalInfo.intro||'')"
            :key="index"
            class="line-text"
          >
            {{ line }}
          </p>
        </div>
        <!-- 标签 -->
        <div class="tags">
          <span
            v-for="(tag, index) in personalInfo.tags"
            :key="index"
            class="tag"
          >#{{ tag }}</span>
        </div>
        <!-- 我的声音 -->
        <VoicePlayBtn
          v-if="personalInfo.voice"
          class="voice"
          :voice-length="voiceLength"
          :voice-url="personalInfo.voice"
        />
        <!-- 图标按钮列表 -->
        <div class="icon-btn-list">
          <!-- 第一个图标 -->
          <div
            class="icon-btn first"
            @click="navigateTo('personal-info')"
          >
            <image
              class="icon"
              src="@/static/icons/my/blocks-white.svg"
            />
          </div>
          <!-- 第二个图标 -->
          <div
            class="icon-btn second"
            @click="navigateTo('personal-schedule')"
          >
            <image
              class="icon"
              src="@/static/icons/my/calendar-white.svg"
            />
          </div>
          <!-- 第三个图标 -->
          <picker
            class="icon-btn third"
            mode="region"
            :value="personalInfo.workPlace"
            @change="onRegionChange"
          >
            <image
              class="icon"
              src="@/static/icons/my/location-white.svg"
            />
          </picker>
          <!-- 第四个图标 -->
          <div
            class="icon-btn fourth"
            @click="navigateTo('invite-and-earn')"
          >
            <image
              class="icon"
              src="@/static/icons/my/arrow-up-right-white.svg"
            />
          </div>
        </div>
      </div>
      <!-- 分割线 -->
      <div class="hr first" />
      <!-- 作品 -->
      <WorkShowcase
        v-if="workList.length > 0"
        class="works"
        :work-list="workList"
      />
      <!-- 分割线 -->
      <div
        v-if="activityList.length > 0 && userInfo.isShowVideoModel"
        class="hr second"
      />
      <!-- 动态 -->
      <ActivityShowcase
        v-if="activityList.length > 0 && userInfo.isShowVideoModel"
        :activity-list="activityList"
        class="activities"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reqGetAudioAndVideoMeta } from '@/api/others';
import PhotoSwiper from '@/components/PhotoSwiper.vue';
import ActivityShowcase from '@/components/wedding-link/ActivityShowcase.vue';
import VoicePlayBtn from '@/components/wedding-link/VoicePlayBtn.vue';
import WorkShowcase from '@/components/wedding-link/WorkShowcase.vue';
import useActivity from '@/stores/activity-store';
import useUser from '@/stores/user-store';
import useWork from '@/stores/work-store';
import { back, navigateTo } from '@/utils/navigate';
import { splitStrByLineBreak } from '@/utils/tools';
import type { RegionPickerOnChangeEvent } from '@uni-helper/uni-app-types';

const userStore = useUser();
const { editPersonalInfo } = userStore;
const { personalInfo, userInfo } = storeToRefs(userStore);

const workStore = useWork();
const { workList } = storeToRefs(workStore);

const activityStore = useActivity();
const { activityList } = storeToRefs(activityStore);

/** 分享回调 */
onShareAppMessage(() => ({
  title: '专业主持人，让您的婚礼与众不同，快来查看吧',
  path: `/subpkg/wedding-link/my-preview-share?userId=${userInfo.value.id}&inviterId=${userInfo.value.id}`,
  imageUrl: 'https://img.yzcdn.cn/vant/cat.jpeg',
}));

// #region 随页面滚动显示白色标题栏相关

/** 页面头部高度 */
const pageHeadHeight = ref(0);

/** 白色标题栏透明度 */
const whiteNavBarOpacity = ref(0);

onLoad(() => {
  pageHeadHeight.value = (uni?.getSystemInfoSync()?.statusBarHeight || 0) + 44;
});

onPageScroll((e) => {
  const { scrollTop } = e;
  if (scrollTop >= pageHeadHeight.value) {
    whiteNavBarOpacity.value = 1;
    return;
  }

  whiteNavBarOpacity.value = scrollTop / pageHeadHeight.value;
});

// #endregion

// #region 4个图标的点击事件

/** 工作所在地选择器改变事件 */
const onRegionChange = (e: RegionPickerOnChangeEvent) => {
  console.log(e);
  editPersonalInfo({ workPlace: e.detail.value });
};

// #endregion

// #region 照片轮播相关

/** 当前背景照片 */
const currentPhoto = ref(personalInfo.value.photoList[0]);

/** 轮播器切换事件 */
const photoSwiperChange = (index:number) => {
  currentPhoto.value = personalInfo.value.photoList[index];
};

// #endregion

// #region 录音相关

/** 录音长度 */
const voiceLength = ref(0);

// 监听personalInfo，更新录音长度和地址
watch(personalInfo, async (newVal) => {
  // 获取并设置音频长度
  if (newVal.voice) {
    const resData = (await reqGetAudioAndVideoMeta(newVal?.voice || ''))?.data as AnyObject;
    voiceLength.value = Number(resData.format.duration);
  }
}, { immediate: true });

// #endregion
</script>

<style lang="scss" scoped>
.container {
  position: relative;

  width: 100vw;
  min-height: 100vh;

  background-color: #212125;

  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  display: grid;
  grid-template:
    'nav-bar' auto
    'main' 1fr
    /1fr;

  .photo-bg {
    position: absolute;
    top: 0;
    left: 0;

    width: 100vw;
    height: 50vh;

    // 模糊处理
    filter: blur(15px);
  }

  .nav-bar {
    grid-area: nav-bar;
  }

  // 白色隐藏标题栏
  .hidden-nav-bar{
    grid-area: nav-bar;

    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;

    width: 100vw;
  }

  .main {
    grid-area: main;

    width: 100%;

    display: grid;
    grid-template:
      'profile' auto
      'first-hr' 8px
      'works' auto
      'second-hr' 8px
      'activities' auto
      / 1fr;
    justify-items: center;

    // 个人信息
    .personal-profile {
      grid-area: profile;

      width: 100vw;

      display: grid;
      grid-template:
        'photo-swiper' 150.2564vw
        '.' 20px
        'title' 8.9744vw
        '.' 12px
        'intro' min-content
        '.' 12px
        'tags' 5.1282vw
        'voice' min-content
        '.' 36px
        'icon-btn-list' 10.2564vw
        '.' 24px;
      align-items: center;
      justify-items: center;

      // 照片轮播
      .photo-swiper-wrapper {
        grid-area: photo-swiper;

      }

      // 标题
      .title {
        grid-area: title;

        font-size: 6.4103vw;
        color: #fff;
      }

      // 简介
      .intro {
        grid-area: intro;

        padding: 0 12px;
        display: flex;
        flex-direction: column;
        row-gap: 8px;
        align-items: center;
        justify-content: center;

        font-size: 14px;
        line-height: 14px;
        color: rgba($color: #fff, $alpha: 70%);
        text-align: center;
      }

      // 标签
      .tags {
        grid-area: tags;

        display: flex;
        column-gap: 24px;
        align-items: center;
        justify-content: center;

        .tag {
          font-size: 3.5897vw;
          color: rgba($color: #fff, $alpha: 70%);
        }
      }

      // 我的声音
      .voice {
        grid-area: voice;
        margin-top: 20px;
      }

      .icon-btn-list {
        grid-area: icon-btn-list;

        display: flex;
        column-gap: 28px;
        align-items: center;
        justify-content: space-between;

        .icon-btn {
          width: 10.2564vw;
          height: 10.2564vw;

          background: #424148;
          border-radius: 32px;
          box-shadow: 0 2px 8px 0 rgb(52 51 47 / 25%);

          display: flex;
          align-items: center;
          justify-content: center;

          .icon {
            width: 6.4103vw;
            height: 5.1282vw;
          }
        }
      }
    }

    .hr {
      width: 100vw;

      background-color: #1c1c20;

      // 第一条分割线
      &.first {
        grid-area: first-hr;
      }

      // 第二条分割线
      &.second {
        grid-area: second-hr;
      }
    }

    // 作品
    .works{
      grid-area: works;
    }

    // 动态
    .activities {
      grid-area: activities;
    }
  }
}
</style>
