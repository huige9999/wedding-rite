<!-- 「我的预览-分享」页面 -->
<!-- 当在「我的预览」页面进行分享，点击分享链接后进入的页面 -->
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
      :title="personalInfo?.realName || ''"
      status-bar
      :border="false"
      :left-icon="canBack ? 'left' : 'home'"
      background-color="#00000000"
      color="#fff"
      @click-left="navLeftClick"
    />
    <!-- 白色隐藏标题栏 -->
    <uni-nav-bar
      class="hidden-nav-bar"
      :style="{ opacity: whiteNavBarOpacity }"
      :title="personalInfo?.realName || ''"
      :border="false"
      :left-icon="canBack ? 'left' : 'home'"
      status-bar
      color="#000"
      background-color="#fff"
      @click-left="navLeftClick"
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
          {{ personalInfo?.realName || '' }}作品合集
        </div>
        <!-- 简介 -->
        <div class="intro">
          <p
            v-for="(line, index) in splitStrByLineBreak(
              personalInfo.intro || ''
            )"
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
            @click="onFirstBtnClick"
          >
            <image
              class="icon"
              src="@/static/icons/my/blocks-white.svg"
            />
          </div>
          <!-- 第二个图标 -->
          <div
            class="icon-btn second"
            @click="navigateTo('personal-schedule-share')"
          >
            <image
              class="icon"
              src="@/static/icons/my/calendar-white.svg"
            />
          </div>
          <!-- 第三个图标 -->
          <div
            class="icon-btn third"
            @click="onThirdBtnClick"
          >
            <image
              class="icon"
              src="@/static/icons/my/location-white.svg"
            />
          </div>
          <!-- 第四个图标 -->
          <div class="icon-btn fourth">
            <button
              class="share-btn-hidden"
              open-type="share"
            />
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
        is-share
        :user-id="userInfo?.id"
      />
      <!-- 分割线 -->
      <div class="hr second" />
      <!-- 动态 -->
      <ActivityShowcase
        v-if="activityList.length > 0 && userInfo.isShowVideoModel"
        class="activity-showcase"
        :activity-list="activityList"
        :user-id="userInfo?.id"
        is-share
      />
    </div>
  </div>
  <!-- 主持人信息底栏 -->
  <HostInfoBar
    :id="userInfo.id"
    :avatar="userInfo.avatar"
    :real-name="personalInfo.realName || ''"
    :phone="userInfo.phone"
  />
  <!-- 授权昵称头像弹窗 -->
  <AvatarNicknameAuthPopup />
  <!-- 「关于我」弹窗 -->
  <MyPreviewShareAboutMePopup
    ref="MyPreviewShareAboutMePopup"
    :age="userInfo.age"
    :height="userInfo.height"
    :weight="userInfo.weight"
    :proficiency="personalInfo.proficiency"
  />
  <MyPreviewShareMyAddressPopup
    ref="MyPreviewShareMyAddressPopup"
    :address="personalInfo.workPlace || ['']"
  />
</template>

<script lang="ts" setup>
import { reqGetActivityList } from '@/api/activity-api';
import { reqGetAudioAndVideoMeta } from '@/api/others';
import { reqGetWorkList } from '@/api/work-api';
import PhotoSwiper from '@/components/PhotoSwiper.vue';
import ActivityShowcase from '@/components/wedding-link/ActivityShowcase.vue';
import HostInfoBar from '@/components/wedding-link/HostInfoBar.vue';
import MyPreviewShareAboutMePopup from '@/components/wedding-link/MyPreviewShareAboutMePopup.vue';
import MyPreviewShareMyAddressPopup from '@/components/wedding-link/MyPreviewShareMyAddressPopup.vue';
import VoicePlayBtn from '@/components/wedding-link/VoicePlayBtn.vue';
import WorkShowcase from '@/components/wedding-link/WorkShowcase.vue';
import AvatarNicknameAuthPopup from '@/components/wedding-link/avatarNicknameAuthPopup.vue';
import { useSchedule } from '@/stores/schedule-store';
import { useViewedUser } from '@/stores/viewed-user-store';
import type { ActivityData, ActivityInfo, WorkInfo } from '@/types/env';
import { navigateTo } from '@/utils/navigate';
import {
  parseActivityList,
  parseWorkList
} from '@/utils/parse';
import { isFormalToken } from '@/utils/token';
import { splitStrByLineBreak } from '@/utils/tools';

const ctx = getCurrentInstance();

const viewedUserStore = useViewedUser();
const { userInfo, personalInfo } = storeToRefs(viewedUserStore);
const { getUserInfoAndPersonalInfoById } = viewedUserStore;

const scheduleStore = useSchedule();
const { getScheduleListAll, getSchedulePosterData } = scheduleStore;
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

// #region 分享相关

onShareAppMessage(() => ({
  title: '专业主持人，让您的婚礼与众不同，快来查看吧',
  path: `/subpkg/wedding-link/my-preview-share?userId=${userInfo.value.id}`,
  imageUrl: personalInfo?.value?.photoList?.[0],
}));

// #endregion

// #region 要查看的用户的信息相关
const canBack = ref(false);
onLoad((options) => {
  if (options?.canBack && String(options?.canBack) === 'true') {
    canBack.value = true;
  }

  const viewedUserId = options?.userId || options?.scene;
  if (!viewedUserId) return;

  getUserInfoAndPersonalInfoById(viewedUserId);
  // XXX 截止2023年7月20日，档期数据最多也不到100条，所以这里不分页获取，后续有需要再改
  getScheduleListAll(viewedUserId);
  getSchedulePosterData(viewedUserId);

  console.log('viewedUserInfo', userInfo);
});

// #endregion

// #region 图标按钮相关

/** 第一个按钮点击事件 */
const onFirstBtnClick = () => {
  const myPreviewShareAboutMePopup = ctx?.refs
    .MyPreviewShareAboutMePopup as InstanceType<
    typeof MyPreviewShareAboutMePopup
  >;
  myPreviewShareAboutMePopup?.open();
};

/** 第三个按钮点击事件 */
const onThirdBtnClick = () => {
  const myPreviewShareMyAddressPopup = ctx?.refs
    .MyPreviewShareMyAddressPopup as InstanceType<
    typeof MyPreviewShareMyAddressPopup
  >;
  myPreviewShareMyAddressPopup?.open();
};

// #endregion

// #region 作品相关

/** 作品列表 */
const workList = ref<WorkInfo[]>([]);

/**
 * 获取并设置作品列表
 * @param userId 用户id
 */
const getWorkList = async (userId: string) => {
  const res = await reqGetWorkList(userId);
  if ((res?.data as GetWorksListResData).code === 200) {
    workList.value = parseWorkList(res?.data as GetWorksListResData);
    console.log('workList share', workList.value);
  }
};

// 页面加载时获取并设置作品列表
onLoad((options) => {
  if (options?.userId || options?.scene) {
    getWorkList(options?.userId || options?.scene);
  }
});

// #endregion

// #region 动态相关

/** 动态列表 */
const activityList = ref<ActivityInfo[]>([]);

/**
 * 获取并设置动态列表
 * @param userId 用户id
 */
const getActivityList = async (userId: string) => {
  const res = await reqGetActivityList(userId);
  if ((res?.data as ResData<ActivityData>).code === 200) {
    activityList.value = parseActivityList(res?.data as ResData<ActivityData>);
    console.log('activityList share', activityList.value);
  }
};

// 页面加载时获取并设置动态列表
onLoad((options) => {
  if (options?.userId || options?.scene) {
    getActivityList(options?.userId || options.scene);
  }
});
// #endregion

// #region 照片轮播相关

/** 当前背景照片 */
const currentPhoto = ref(personalInfo?.value?.photoList[0] || '');

/** 轮播器切换事件 */
const photoSwiperChange = (index:number) => {
  currentPhoto.value = personalInfo.value.photoList[index];
};

// #endregion

// #region 录音相关

/** 录音长度 */
const voiceLength = ref(0);

// 监听personalInfo，更新录音长度和地址
watch(
  personalInfo,
  async (newVal) => {
    // 获取并设置音频长度
    if (newVal.voice) {
      const resData = (await reqGetAudioAndVideoMeta(newVal?.voice || ''))
        ?.data as AnyObject;
      voiceLength.value = Number(resData.format.duration);
    }
  },
  { immediate: true },
);

// #endregion

/** 路由返回 */
const navLeftClick = () => {
  if (canBack.value) {
    uni.navigateBack();
    return;
  }

  if (!isFormalToken()) {
    navigateTo('login');
    return;
  }

  navigateTo('works');
};
</script>

<style lang="scss" scoped>
.container {
  position: relative;

  width: 100vw;
  min-height: 100vh;

  background-color: #212125;

  padding-bottom: 60px;
  display: grid;
  grid-template:
    'nav-bar' auto
    'main' 1fr
    /1fr;

  // 白色隐藏标题栏
  .hidden-nav-bar {
    grid-area: nav-bar;

    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;

    width: 100vw;
  }

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
        'intro' auto
        '.' 12px
        'tags' 5.1282vw
        'voice' min-content
        '.' 36px
        'icon-btn-list' 10.2564vw
        '.' 24px;
      align-items: center;
      justify-items: center;

      // 照片轮播
      .photo-swiper {
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

          // 第四个按钮是分享按钮
          &.fourth {
            position: relative;

            .share-btn-hidden {
              position: absolute;
              top: 0;
              left: 0;

              width: 100%;
              height: 100%;

              opacity: 0;
            }
          }

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
    .works {
      grid-area: works;
    }

    // 动态
    .activity-showcase {
      grid-area: activities;
    }
  }
}
</style>
