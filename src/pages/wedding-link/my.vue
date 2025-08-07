<!--
  * 我的页面
  * @author: Ruan Jiazhen
  * @date: 2024-04-28  17:15:15
-->
<template>
  <div class="container">
    <!-- 照片背景 -->
    <image
      v-if="(personalInfo?.photoList?.length || 0) > 0"
      class="photo-bg"
      :src="currentPhoto"
      mode="aspectFill"
    />
    <uni-nav-bar
      class="nav-bar"
      background-color="#00000000"
      status-bar
      :border="false"
      @click-left="navigateTo('my-preview')"
    >
      <template #left>
        <text class="nav-bar-left-text">
          预览
        </text>
      </template>
    </uni-nav-bar>
    <!-- 主体部分 -->
    <div class="main">
      <!-- 点击上传图片提示 -->
      <div
        v-if="
          !personalInfo?.photoList?.length ||
            personalInfo?.photoList?.length === 0
        "
        class="upload-img-tip"
        @click="clickUploadImgTip"
      >
        <image
          class="bg"
          src="@/static/images/my/upload-img.svg"
        />
        <div class="text">
          点击上传图片 推荐比例9:16
        </div>
      </div>
      <!-- 照片轮播图 -->
      <PhotoSwiper
        v-else
        class="photo-swiper"
        :photo-list="personalInfo.photoList"
        @photo-swiper-change="photoSwiperChange"
        @photo-edit-btn-click="photoEditBtnClick"
      />
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
        @change="workPlaceChange"
      >
        <image
          class="icon"
          src="@/static/icons/my/location-white.svg"
        />
      </picker>
      <!-- 第四个图标 -->
      <button
        class="icon-btn fourth"
        @click="openSharePosterPopup"
      >
        <image
          class="icon"
          src="@/static/icons/my/arrow-up-right-white.svg"
        />
      </button>
      <!-- 第五个图标 -->
      <div
        class="icon-btn fifth"
        @click="navigateTo('my-account')"
      >
        <image
          class="icon"
          src="@/static/icons/my/bag-white.svg"
        />
      </div>
      <!-- 第一个菜单项 -->
      <div
        class="menu-item first"
        @click="navigateTo('personal-profile')"
      >
        <image
          class="bg"
          src="@/static/images/my/menu-item-bg.svg"
        />
        <text class="title">
          个人简介
        </text>
        <text class="content">
          编辑
        </text>
        <image
          class="right-arrow"
          src="@/static/icons/my/arrow-right-golden.svg"
        />
      </div>
      <!-- 第二个菜单项 -->
      <div class="menu-item second">
        <image
          class="bg"
          src="@/static/images/my/menu-item-bg.svg"
        />
        <text class="title">
          我的声音
        </text>
        <!-- 声音播放按钮 -->
        <VoicePlayBtn
          v-if="voiceLength"
          :voice-length="voiceLength"
          :voice-url="personalInfo.voice"
          bg-color="#424148"
          class="voice-play-btn"
        />
        <text
          class="content"
          @click="onRecordBtnClick"
        >
          {{ voiceLength ? '编辑' : '立即录制' }}
        </text>
        <image
          class="right-arrow"
          src="@/static/icons/my/arrow-right-golden.svg"
        />
      </div>
      <!-- 第三个菜单项 -->
      <div
        class="menu-item third"
        @click="myWorkClick"
      >
        <image
          class="bg"
          src="@/static/images/my/menu-item-bg.svg"
        />
        <text class="title">
          我的作品
        </text>
        <text
          v-if="workList.length <= 0"
          class="content"
        >
          立即上传
        </text>
        <image
          class="right-arrow"
          src="@/static/icons/my/arrow-right-golden.svg"
        />
      </div>
      <!-- 第四个菜单项 -->
      <div
        v-if="userInfo.isShowVideoModel"
        class="menu-item fourth"
        @click="myActivityClick"
      >
        <image
          class="bg"
          src="@/static/images/my/menu-item-bg.svg"
        />
        <text class="title">
          我的动态
        </text>
        <text
          v-if="activityList.length <= 0"
          class="content"
        >
          编辑
        </text>
        <image
          class="right-arrow"
          src="@/static/icons/my/arrow-right-golden.svg"
        />
      </div>
      <!-- 第五个菜单项（我的预定） -->
      <div
        class="menu-item fifth"
        @click="navigateTo('my-bookings')"
      >
        <image
          class="bg"
          src="@/static/images/my/menu-item-bg.svg"
        />
        <text class="title">
          我的预定
        </text>
        <text
          v-if="newBookingCount"
          class="content"
        >
          新增{{ newBookingCount }}条预定
        </text>
        <image
          class="right-arrow"
          src="@/static/icons/common/right-white.svg"
        />
      </div>
      <!-- 第六个菜单项（我的邀请） -->
      <div
        class="menu-item sixth"
        @click="navigateTo('invite-workmate')"
      >
        <image
          class="bg"
          src="@/static/images/my/menu-item-bg.svg"
        />
        <text class="title">
          我的邀请
        </text>
        <text class="content">
          邀请同行赚收益
        </text>
        <image
          class="right-arrow"
          src="@/static/icons/common/right-white.svg"
        />
      </div>
      <!-- 第七个菜单（账号与安全） -->
      <div
        class="menu-item seventh"
        @click="navigateTo('account-and-safty')"
      >
        <image
          class="bg"
          src="@/static/images/my/menu-item-bg.svg"
        />
        <text class="title">
          账号与安全
        </text>
        <image
          class="right-arrow"
          src="@/static/icons/common/right-white.svg"
        />
      </div>
    </div>
  </div>
  <!-- 录音弹窗 -->
  <RecordAudioPopup
    ref="recordAudioPopup"
    work-id="435"
    @confirm="onRecordAudioFinish"
  />
  <!-- 照片裁切器 -->
  <div
    v-show="showCropper"
    class="cropper"
  >
    <BtCropper
      ref="cropper"
      :image-src="cropperSrc"
      :ratio="2 / 3"
    />
    <div
      class="cancel-text"
      @click="onCropperCancel"
    >
      取消
    </div>
    <div
      class="confirm-btn"
      @click="onCropperConfirm"
    >
      确定
    </div>
  </div>
  <CustomTabBar />
  <!-- 分享海报弹窗 -->
  <SharePosterPopup
    ref="sharePosterPopup"
    @menu-click="onSharePosterPopupMenuClick"
  />
</template>

<script lang="ts" setup>
import { reqGetAudioAndVideoMeta, reqUploadAnyFile } from '@/api/others';
import CustomTabBar from '@/components/CustomTabBar.vue';
import PhotoSwiper from '@/components/PhotoSwiper.vue';
import BtCropper from '@/components/bt-cropper/bt-cropper.vue';
import RecordAudioPopup from '@/components/wedding-link/RecordAudioPopup.vue';
import VoicePlayBtn from '@/components/wedding-link/VoicePlayBtn.vue';
import useActivity from '@/stores/activity-store';
import { useBooking } from '@/stores/booking-store';
import useUser from '@/stores/user-store';
import useWork from '@/stores/work-store';
import SharePosterPopup from '@/subpkg/components/SharePosterPopup.vue';
import { navigateTo } from '@/utils/navigate';
import { parseUploadFileUrl } from '@/utils/parse';
import { showToast } from '@/utils/tools';
import { uniChooseMedia } from '@/utils/uniapp-api-promised';
import { showActionSheet, showModal } from '@uni-helper/uni-promises';

const userStore = useUser();
const { personalInfo, userInfo } = storeToRefs(userStore);
const {
  getPersonalInfo, editPersonalInfo, addPhoto, deletePhoto, editPhoto,
} = userStore;

const workStore = useWork();
const { workList } = storeToRefs(workStore);

const activityStore = useActivity();
const { activityList } = storeToRefs(activityStore);

const bookingStore = useBooking();
const { bookingList } = storeToRefs(bookingStore);

const ctx = getCurrentInstance();

// #region 照片轮播相关

/** 当前图片的索引 */
const currentPhotoIndex = ref(0);

/** 当前背景照片 */
const currentPhoto = computed(
  () => personalInfo?.value?.photoList?.[currentPhotoIndex.value],
);

/** 轮播器切换事件 */
const photoSwiperChange = (index: number) => {
  currentPhotoIndex.value = index;
};

// #endregion

// #region 图片相关

/** 当前编辑的图片的索引 */
let editPhotoIndex = 0;

/** 当前操作类型 */
let currentOperateType = '';

/** 是否显示图片裁剪器 */
const showCropper = ref(false);

/** 图片裁剪器编辑的图片地址 */
const cropperSrc = ref('');

/**
 * 打开图片裁剪组件
 * @param {string} src 图片地址
 */
const openCropper = async (src: string) => {
  // hideTabBar({});
  cropperSrc.value = src;
  showCropper.value = true;
};

/** 裁剪图片点击取消 */
const onCropperCancel = () => {
  showCropper.value = false;
  // showTabBar({});
};

/** 裁剪图片点击确定 */
const onCropperConfirm = async () => {
  const cropper = ctx?.refs.cropper as InstanceType<typeof BtCropper>;
  const croppedImgUrl = await cropper.crop();
  showCropper.value = false;
  // showTabBar({});
  switch (currentOperateType) {
    case 'add': {
      const addRes = await addPhoto(croppedImgUrl);
      if (addRes) {
        showToast('添加成功');
        await getPersonalInfo();
        currentPhotoIndex.value = (personalInfo.value?.photoList?.length || 1) - 1;
        console.log('currentPhotoIndex', currentPhotoIndex.value);
      }
      break;
    }
    case 'edit': {
      const editRes = await editPhoto(editPhotoIndex, croppedImgUrl);
      if (editRes) {
        showToast('更换成功');
        await getPersonalInfo();
        currentPhotoIndex.value = editPhotoIndex;
        console.log('currentPhotoIndex', currentPhotoIndex.value);
      }
      break;
    }
    default:
      break;
  }
};

/**
 * 选择图片并返回图片地址
 * @param count 选择图片的数量，默认为1
 * @returns 返回选择的图片的本地地址列表
 */
const chooseImg = async (count = 1) => {
  const chooseRes = await uniChooseMedia({
    count,
    sizeType: ['original'],
    sourceType: ['album', 'camera'],
    mediaType: ['image'],
  });
  console.log('chooseRes', chooseRes);
  if (!chooseRes?.tempFiles?.[0]?.tempFilePath) {
    return [];
  }

  return chooseRes.tempFiles.map((item) => item.tempFilePath);
};

/** 点击上传图片提示事件 */
const clickUploadImgTip = async () => {
  const showActionSheetRes = await showActionSheet({ itemList: ['上传个人照片（可上传三张）'] });
  if (showActionSheetRes?.tapIndex === 0) {
    currentOperateType = 'add';
    const imageList = await chooseImg();
    if (imageList.length) {
      openCropper(imageList[0]);
    }
  }
};

/** 点击「添加照片」事件 */
const addPhotoClick = async () => {
  if ((personalInfo?.value?.photoList?.length || 0) >= 3) {
    showToast('已达到上传照片上限，不可添加照片了～');
  } else {
    currentOperateType = 'add';
    const imageList = await chooseImg();
    if (imageList.length) {
      openCropper(imageList[0]);
    }
  }
};

/** 「更换照片」点击事件 */
const changePhotoClick = async () => {
  const url = (await chooseImg(1))[0];
  currentOperateType = 'edit';
  openCropper(url);
};

/** 「删除照片」点击事件 */
const deletePhotoClick = async () => {
  if (personalInfo?.value?.photoList?.length === 1) {
    showToast('不可删除，请最少保留一张照片');
  } else {
    const showModalRes = await showModal({ content: '是否删除这张照片？' } as AnyObject);
    console.log('showModalRes', showModalRes);
    if (showModalRes?.confirm) {
      const result = await deletePhoto(editPhotoIndex);
      if (result) {
        showToast('删除成功');
        await getPersonalInfo();
      } else {
        showToast('删除失败，请稍后重试');
      }
    }
  }
};

/**
 * 图片编辑按钮点击事件
 * @param {number} index 当前图片的索引
 */
const photoEditBtnClick = async (index: number) => {
  editPhotoIndex = index;
  try {
    const showActionSheetRes = await showActionSheet({ itemList: ['添加照片', '更换照片', '删除照片'] });
    switch (showActionSheetRes.tapIndex) {
      case 0:
        addPhotoClick();
        break;
      case 1:
        changePhotoClick();
        break;
      case 2:
        deletePhotoClick();
        break;
      default:
        break;
    }
  } catch (e) {
    console.error(e);
  }
};

// #endregion

// #region 工作所在地设置相关
/** 工作所在地修改事件 */
const workPlaceChange = async (e: any) => {
  console.log('e', e);
  // 如何和原来的值相同，就不修改
  if (e.detail.value === personalInfo?.value?.workPlace) {
    return;
  }
  const result = await editPersonalInfo({ workPlace: e.detail.value });
  if (result) {
    showToast('修改成功');
    await getPersonalInfo();
  } else {
    showToast('修改失败，请稍后重试');
  }
};
// #endregion

// #region 录音相关

/** 录音长度 */
const voiceLength = ref(0);

// 监听personalInfo，更新innerAudioContext.src
watch(
  personalInfo,
  async (newVal) => {
    // 获取并设置音频长度
    if (personalInfo.value.voice) {
      const resData = (
        await reqGetAudioAndVideoMeta(personalInfo?.value?.voice)
      )?.data as AnyObject;
      voiceLength.value = Number(resData.format.duration);
    } else {
      voiceLength.value = 0;
    }
  },
  { immediate: true },
);

/** 「立即录制」按钮点击事件 */
const onRecordBtnClick = () => {
  // 如果已经有声音了，就先出现底部菜单，让用户选择「重新录制」和「删除」
  if (voiceLength.value > 0) {
    uni.showActionSheet({
      itemList: ['重新录制', '删除'],
      success: async (res) => {
        if (res.tapIndex === 0) {
          const recordAudioPopup = ctx?.refs.recordAudioPopup as InstanceType<
            typeof RecordAudioPopup
          >;
          recordAudioPopup.open();
        } else if (res.tapIndex === 1) {
          const result = await editPersonalInfo({ voice: '' });
          if (result) {
            showToast('删除成功');
            await getPersonalInfo();
          } else {
            showToast('删除失败，请稍后重试');
          }
        }
      },
    });
  } else {
    const recordAudioPopup = ctx?.refs.recordAudioPopup as InstanceType<
      typeof RecordAudioPopup
    >;
    console.log('recordAudioPopup', recordAudioPopup);
    recordAudioPopup.open();
  }
};

/**
 * 录音完成事件
 * @param {string} filePath 录音文件路径
 */
const onRecordAudioFinish = async (filePath: string) => {
  console.log('onRecordAudioFinish', filePath);
  const uploadRes = await reqUploadAnyFile(filePath);
  console.log('uploadRes', uploadRes);
  const url = parseUploadFileUrl(uploadRes.data);
  const result = await editPersonalInfo({ voice: url });
  if (result) {
    await getPersonalInfo();
  } else {
    showToast('修改声音失败，请稍后重试');
  }
};
// #endregion

// #region 点击「我的作品」和「我的动态」相关
/** 点击「我的作品」事件 */
const myWorkClick = () => {
  if (workList.value.length > 0) {
    navigateTo('works');
  } else {
    navigateTo('add-work');
  }
};

/** 点击「我的动态」事件 */
const myActivityClick = async () => {
  if (activityList.value.length > 0) {
    navigateTo('activities');
  } else {
    const showActionSheetRes = await showActionSheet({ itemList: ['照片', '视频'] });
    if (showActionSheetRes?.tapIndex === undefined) return;

    let activityType: 'image' | 'video' | 'mix' = 'mix';
    if (showActionSheetRes.tapIndex === 0) {
      activityType = 'image';
    } else if (showActionSheetRes.tapIndex === 1) {
      activityType = 'video';
    }

    // 选择图片/视频，并且在选择后跳转到「发送动态」页面
    try {
      const chooseMediaRes = await uniChooseMedia({
        count: 9,
        mediaType: [activityType],
      });
      if (
        chooseMediaRes?.tempFiles?.length
        && chooseMediaRes?.tempFiles?.length > 0
      ) {
        uni.showLoading();
        navigateTo('send-activity', {
          type: activityType,
          tempFiles: JSON.stringify(chooseMediaRes.tempFiles),
        });
        uni.hideLoading();
      }
    } catch (e) {
      console.error(e);
    }
  }
};
// #endregion

// #region 「我的预定」相关

/** 新增的预定数量 */
const newBookingCount = computed(
  () => bookingList.value.filter((item) => !item.hasBeenResolved).length,
);

// #endregion

// #region 分享海报相关
const currentInstance = getCurrentInstance();

/** 打开分享海报弹窗 */
const openSharePosterPopup = () => {
  if (personalInfo?.value?.photoList?.length === 0) {
    showToast('请先上传个人照片后再分享新人，效果更佳哦~');
    return;
  }
  const sharePosterPopup = currentInstance?.refs?.sharePosterPopup as
  InstanceType<typeof SharePosterPopup>;
  if (sharePosterPopup?.open) { sharePosterPopup.open(); }
};

/** 关闭分享海报弹窗 */
const closeSharePosterPopup = () => {
  const sharePosterPopup = currentInstance?.refs?.sharePosterPopup as
  InstanceType<typeof SharePosterPopup>;
  if (sharePosterPopup?.close) { sharePosterPopup.close(); }
};

/** 页面分享 */
onShareAppMessage(() => ({
  title: '快来查看我的主持案例，让你成为婚礼焦点',
  path: `/subpkg/wedding-link/my-preview-share?userId=${userInfo.value.id}`,
  imageUrl: personalInfo?.value?.photoList?.[0],
}));

/** 海报分享弹窗按钮点击事件 */
const onSharePosterPopupMenuClick = (index: number) => {
  console.log('onSharePosterPopupMenuClick', index);
  switch (index) {
    case 0:
      navigateTo('create-personal-business-card');
      break;
    case 1:
      navigateTo('create-custom-poster');
      break;
    case 2:
    default:
      break;
  }
  closeSharePosterPopup();
};

// #endregion
</script>

<style scoped lang="scss">
.container {
  position: relative;

  min-height: 100vh;

  background-color: #212125;

  display: grid;
  grid-template:
    'nav-bar' auto
    'main' auto;

  // 照片背景

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

    .nav-bar-left-text {
      margin-left: 16px;

      font-size: 3.8462vw;
      color: #fff;
    }
  }

  // 主体部分
  .main {
    grid-area: main;

    padding: 12px 0 90px;
    display: grid;
    grid-template:
      'photo photo photo photo photo' auto
      '. . . . .' 30px
      'first-icon second-icon third-icon fourth-icon fifth-icon' 10.2564vw
      '. . . . .' 30px
      'first-menu first-menu first-menu first-menu first-menu' min-content
      '. . . . .' 10px
      'second-menu second-menu second-menu second-menu second-menu' min-content
      '. . . . .' 10px
      'third-menu third-menu third-menu third-menu third-menu' min-content
      '. . . . .' 10px
      'fourth-menu fourth-menu fourth-menu fourth-menu fourth-menu' min-content
      '. . . . .' 10px
      'fifth-menu fifth-menu fifth-menu fifth-menu fifth-menu' min-content
      '. . . . .' 10px
      'sixth-menu sixth-menu sixth-menu sixth-menu sixth-menu' min-content
      '. . . . .' 10px
      'seventh-menu seventh-menu seventh-menu seventh-menu seventh-menu' min-content
      / 1fr 1fr 1fr 1fr 1fr;
    justify-items: center;

    // 点击上传图片提示
    .upload-img-tip {
      grid-area: photo;

      position: relative;

      width: 100%;
      height: 54.1026vw;

      background-color: #2c2c33;

      // 虚线边框
      border: 1px dashed #dbdbdb;

      .bg {
        position: absolute;
        top: 0;
        left: 0;

        width: 100%;
        height: 100%;
      }

      .text {
        position: absolute;
        top: calc(50% + 9.2308vw);
        left: 50%;

        width: auto;

        transform: translate(-50%, -50%);

        font-size: 2.5641vw;
        color: #8b8b8b;
      }
    }

    .photo-swiper {
      grid-area: photo;

    }

    // 图标按钮
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
        width: 4.6154vw;
        height: 4.6154vw;
      }

      // XXX 微信小程序不支持:nth-of-type(n)选择器，所以暂时用这种方法
      &.first {
        grid-area: first-icon;
      }

      &.second {
        grid-area: second-icon;
      }

      &.third {
        grid-area: third-icon;
      }

      &.fourth {
        grid-area: fourth-icon;
      }

      &.fifth {
        grid-area: fifth-icon;
      }
    }

    // 菜单项
    .menu-item {
      grid-area: first-menu;

      position: relative;

      width: calc(100% - 24px);
      height: 15.641vw;

      padding: 0 16px;
      display: grid;
      grid-template:
        'title content . right-arrow' 1fr
        / 1fr auto 4px auto;
      align-items: center;

      .bg {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 0;

        width: 100%;
        height: 100%;
      }

      .title {
        grid-area: title;

        z-index: 1;

        font-size: 3.8462vw;
        color: #fff;
      }

      .content {
        grid-area: content;
        justify-self: flex-end;

        z-index: 1;

        font-size: 3.8462vw;
        color: #f8d58f;
      }

      .right-arrow {
        grid-area: right-arrow;
        justify-self: flex-end;

        z-index: 1;

        width: 3.5897vw;
        height: 3.5897vw;
      }

      // XXX 微信小程序不支持:nth-of-type(n)选择器，所以暂时用这种方法
      // 第一个菜单项
      &.first {
        grid-area: first-menu;
      }

      // 第二个菜单项
      &.second {
        grid-area: second-menu;

        // 声音播放按钮
        .voice-play-btn {
          grid-area: 1/1/1/1;
          align-self: center;
          justify-self: end;
          margin-right: 10px;

          z-index: 1;
        }
      }

      // 第三个菜单项
      &.third {
        grid-area: third-menu;
      }

      // 第四个菜单项
      &.fourth {
        grid-area: fourth-menu;
      }

      // 第五个菜单项
      &.fifth {
        grid-area: fifth-menu;

        .content {
          color: #fff;
        }
      }

      &.sixth {
        grid-area: sixth-menu;

        .content {
          color: #fff;
        }
      }

      &.seventh {
        grid-area: seventh-menu;
      }
    }
  }
}

// 照片裁切器
.cropper {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;

  width: 100vw;
  height: 100vh;

  background-color: #0e0e0e;

  .cancel-text {
    position: absolute;
    bottom: 50px;
    left: 30px;

    width: 60px;
    height: 30px;

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 14px;
    color: #ccc;
    text-align: center;
  }

  .confirm-btn {
    position: absolute;
    right: 30px;
    bottom: 50px;

    width: 60px;
    height: 30px;

    background-color: #fcc65a;
    border-radius: 5px;

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 14px;
    color: #fff;
    text-align: center;
  }
}
</style>
