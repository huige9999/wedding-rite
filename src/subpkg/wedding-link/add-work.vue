<!-- 「添加作品」页面 -->
<template>
  <div class="container">
    <uni-nav-bar
      class="nav-bar"
      left-icon="left"
      title="添加作品"
      status-bar
      :border="false"
      @click-left="back"
    />
    <!-- 主体部分 -->
    <div class="main">
      <!-- 填写作品名称提示 -->
      <div class="title-tip">
        请填写作品名称（必填）
      </div>
      <!-- 作品名称输入框 -->
      <input
        v-model="workInfo.title"
        type="text"
        class="title-input"
        placeholder="点击填写"
        maxlength="20"
      >
      <!-- 填写作品描述提示 -->
      <div class="desc-tip">
        请填写作品描述（必填）
      </div>
      <!-- 作品描述输入框 -->
      <textarea
        v-model="workInfo.desc"
        class="desc-input"
        placeholder="点击填写"
        :data-count="`${workInfo.desc.length}/200`"
        maxlength="200"
      />
      <!-- 选择标签提示 -->
      <div class="tags-tip">
        请选择婚礼标签
      </div>
      <!-- 标签选择器 -->
      <div class="tags-selector">
        <div
          v-for="tag in WORK_TAG_LIST"
          :key="tag"
          class="tag"
          :class="isTagSelected(tag)? 'active':''"
          @click="onTagClick(tag)"
        >
          {{ tag }}
          <!-- 关闭图标 -->
          <image
            v-if="isTagSelected(tag)"
            class="close-icon"
            src="@/static/icons/my/close-circle-yellow.svg"
            mode="scaleToFill"
          />
        </div>
      </div>
      <!-- 上传图片提示 -->
      <div
        class="upload-img-tip"
      >
        上传照片{{ userInfo.isShowVideoModel? '/视频':'' }}（推荐比例16:9）
      </div>
      <!-- 上传图片按钮 -->
      <div
        v-if="tempVideoUrlList.length === 0 && tempImgUrlList.length === 0"
        class="upload-img-big-btn"
        @click="onUploadImgBtnClick"
      >
        <image
          class="icon"
          src="@/static/icons/common/plus-gray.svg"
        />
      </div>
      <!-- 已上传的图片或视频 -->
      <div
        v-else
        class="upload-area"
      >
        <!-- 已上传的视频 -->
        <div
          v-for="(video, index) in tempVideoUrlList"
          :key="video"
          class="video-block"
          @click="videoClick(video)"
        >
          <video
            class="video"
            :controls="false"
            :show-center-play-btn="false"
            :src="video"
          />
          <!-- 删除按钮 -->
          <image
            class="delete-btn"
            src="@/static/icons/common/circle-close-gray.svg"
            @click.stop="deleteBtnClick('video', index)"
          />
          <!-- 视频播放按钮 -->
          <image
            class="video-play-btn"
            src="@/static/icons/common/play-circle.svg"
            mode="aspectFill"
          />
        </div>
        <!-- 已上传的图片 -->
        <!-- TODO 上传相同图片时，可能会在删除时出现bug，检查是否是:key的问题 -->
        <div
          v-for="(img, index) in tempImgUrlList"
          :key="img"
          class="img-block"
          @click="imageClick(index)"
        >
          <image
            class="img"
            :src="img"
            mode="aspectFill"
          />
          <!-- 删除按钮 -->
          <image
            class="delete-btn"
            src="@/static/icons/common/circle-close-gray.svg"
            @click.stop="deleteBtnClick('img', index)"
          />
        </div>
        <!-- 上传图片、视频按钮 -->
        <div
          v-if="uploadedCount < 9"
          class="upload-img-small-btn"
          @click.stop="onUploadImgBtnClick"
        >
          <image
            class="icon"
            src="@/static/icons/common/plus-gray.svg"
          />
        </div>
      </div>
      <!-- 「完成」按钮 -->
      <div
        class="finish-btn"
        @click="finishBtnClick"
      >
        完成
      </div>
    </div>
  </div>
  <!-- 添加照片/视频弹窗 -->
  <BottomMenuPopup
    ref="popup"
    :menu-list="menuList"
    @menu-click="bottomMenuClick"
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
import { back } from '@/utils/navigate';
import { WORK_TAG_LIST } from '@/static/constants/view-constants';
import { uniChooseMedia } from '@/utils/uniapp-api-promised';
import BottomMenuPopup from '@/components/BottomMenuPopup.vue';
import { showToast } from '@/utils/tools';
import { parseUploadFileUrl } from '@/utils/parse';
import { reqUploadAnyFile } from '@/api/others';
import { reqSaveWork } from '@/api/work-api';
import useWork from '@/stores/work-store';
import useUser from '@/stores/user-store';

const ctx = getCurrentInstance();

const userStore = useUser();
const { userInfo } = storeToRefs(userStore);

const workStore = useWork();
const { getWorkList } = workStore;

/** 已填写的作品信息 */
const workInfo = ref<WorkInfo>({
  id: '1',
  title: '',
  desc: '',
  tags: [],
  videoUrl: [],
  imgUrl: [],
  coverUrl: '',
  likeCount: 0,
});
// #region 标签相关
/**
 * 判断标签是否已被选择
 * @param tag 标签
 * @returns 是否已被选择
 */
const isTagSelected = (tag: string) => workInfo?.value?.tags?.includes(tag);

/** 作品标签点击事件 */
const onTagClick = (tag: string) => {
  const index = workInfo.value.tags.indexOf(tag);
  if (index === -1) {
    workInfo.value.tags.push(tag);
  } else {
    workInfo.value.tags.splice(index, 1);
  }
};
// #endregion

// #region 上传图片和视频相关

/** 临时图片地址列表 */
const tempImgUrlList = ref<string[]>([]);

/** 临时视频地址列表 */
const tempVideoUrlList = ref<string[]>([]);

/** 已上传图片或视频总数 */
const uploadedCount = computed(() => tempImgUrlList.value.length + tempVideoUrlList.value.length);

/**
 * 上传图片或视频
 * @param type 类型
 */
const uploadImgOrVideo = async (type: 'image'|'video') => {
  const chooseMediaRes = await uniChooseMedia({
    count: 9 - uploadedCount.value,
    mediaType: [type],
  });
  if (chooseMediaRes.errMsg === 'chooseMedia:ok') {
    const { tempFiles } = chooseMediaRes;
    if (type === 'image') {
      tempImgUrlList.value.push(...tempFiles.map((file) => file.tempFilePath));
    } else {
      tempVideoUrlList.value.push(
        ...tempFiles
          .filter((file) => file.size <= 100 * 1024 * 1024)
          .map((file) => file.tempFilePath),
      );

      // 判断视频体积是否超过100M
      const isOverSize = tempFiles.some((file) => file.size > 100 * 1024 * 1024);
      if (isOverSize) {
        showToast('视频体积不能超过100M');
      }
    }
  }
};

/** 底部弹窗的菜单列表 */
const menuList = computed(() => {
  if (userInfo.value.isShowVideoModel) {
    return [
      {
        name: '添加照片',
        action: 'add-photo',
      },
      {
        name: '添加视频',
        action: 'add-video',
      },
    ];
  }

  return [
    {
      name: '添加照片',
      action: 'add-photo',
    },
  ];
});

/** 上传照片、视频按钮点击事件 */
const onUploadImgBtnClick = async () => {
  const popup = ctx?.refs.popup as InstanceType<typeof BottomMenuPopup>;
  if (popup.open) {
    popup.open();
  }
};

/**
 * 底部菜单点击事件
 * @param action 动作类型
 */
const bottomMenuClick = (action: string) => {
  console.log('action', action);
  if (action === 'add-photo') {
    uploadImgOrVideo('image');
  } else if (action === 'add-video') {
    uploadImgOrVideo('video');
  }
};

/**
 * 视频或图片删除按钮点击事件
 * @param type 视频还是图片
 * @param index 索引
 */
const deleteBtnClick = (type:'img'|'video', index: number) => {
  console.log('type', type, index);
  if (type === 'img') {
    tempImgUrlList.value.splice(index);
  } else if (type === 'video') {
    tempVideoUrlList.value.splice(index);
  }
};

// #endregion

// #region 点击图片/视频相关
/**
 * 点击图片事件
 * @param {number} imgIndex 图片索引
 */
const imageClick = (imgIndex:number) => {
  if (workInfo) {
    const urls = tempImgUrlList.value || [];
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

// #region 点击「完成」按钮相关

/**
 * 校验作品是否符合要求
 * @param targetWorkInfo 作品信息
 * @returns 'ok'表示符合要求，否则返回错误信息
 */
const validateWorkInfo = (targetWorkInfo: WorkInfo) => {
  if (!targetWorkInfo.title) {
    return '请填写作品名称';
  }
  if (!targetWorkInfo.desc) {
    return '请填写作品描述';
  }
  if (targetWorkInfo.tags.length === 0) {
    return '请选择标签';
  }
  if (targetWorkInfo.imgUrl.length === 0 && targetWorkInfo.videoUrl.length === 0) {
    return '请上传照片或视频';
  }
  return 'ok';
};

/** 是否有未完成的「完成」按钮点击事件 */
const hasUnfinishedFinishBtnClick = ref(false);

/** 「完成」按钮点击事件 */
const finishBtnClick = async () => {
  // 防止重复点击
  if (hasUnfinishedFinishBtnClick.value) {
    return;
  }
  hasUnfinishedFinishBtnClick.value = true;

  // 检验作品信息是否符合要求
  const result = validateWorkInfo({
    ...workInfo.value,
    imgUrl: tempImgUrlList.value,
    videoUrl: tempVideoUrlList.value,
  });

  if (result !== 'ok') {
    showToast(result);
    hasUnfinishedFinishBtnClick.value = false;
    return;
  }

  console.log('result', result);
  // 上传照片或视频
  const uploadImg = (await Promise.all(
    tempImgUrlList.value.map((imgUrl) => reqUploadAnyFile(imgUrl)),
  ))
    .map((res:any) => parseUploadFileUrl(res.data));
  console.log('uploadImg', uploadImg);

  const uploadVideo = (await Promise.all(
    tempVideoUrlList.value.map((videoUrl) => reqUploadAnyFile(videoUrl)),
  ))
    .map((res:any) => parseUploadFileUrl(res.data));

  workInfo.value.imgUrl = uploadImg;
  workInfo.value.videoUrl = uploadVideo;

  // 如果有视频，封面图为视频第一帧，否则为第一张图片
  if (workInfo.value.videoUrl.length > 0) {
    workInfo.value.coverUrl = `${workInfo.value.videoUrl[0]}?vframe/jpg/offset/0`;
  } else if (workInfo.value.imgUrl.length > 0) {
    [workInfo.value.coverUrl] = workInfo.value.imgUrl;
  }
  const saveResult = await reqSaveWork(workInfo.value) as AnyObject;
  console.log('saveResult', saveResult);
  if (saveResult?.data?.code === 200) {
    showToast('保存成功');
    await getWorkList();
    setTimeout(() => {
      back();
    }, 200);
  } else {
    showToast('保存失败');
  }
  hasUnfinishedFinishBtnClick.value = false;
};

// #endregion
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;

  background-color: #F9F9F9;

  display: grid;
  grid-template:
    'nav-bar' auto
    'main' 1fr;

  .nav-bar {
    grid-area: nav-bar;
  }

  .main {
    grid-area: main;

    padding: 20px 12px 30px;
    display: grid;
    grid-template: 'title-tip' 5.3846vw
      '.' 12px
      'title-input' 14.359vw
      '.' 20px
      'desc-tip' 5.3846vw
      '.' 12px
      'desc-input' 50.5128vw
      '.' 20px
      'tags-tip' 5.3846vw
      '.' 12px
      'tags-selector' min-content
      '.' 20px
      'upload-img-tip' 5.3846vw
      '.' 12px
      'upload-area' auto;

    .title-tip {
      grid-area: title-tip;

      font-size: 3.8462vw;
      color: #8d8d8d;
    }

    .title-input {
      grid-area: title-input;

      width: 100%;
      height: 100%;

      background: #fff;
      border-radius: 2px;

      padding: 0 12px;
      box-sizing: border-box;
    }

    .desc-tip {
      grid-area: desc-tip;

      font-size: 3.8462vw;
      color: #8d8d8d;
    }

    .desc-input {
      grid-area: desc-input;

      width: 100%;
      height: 100%;

      background: #fff;
      border-radius: 2px;

      padding: 12px 12px 16px;
      box-sizing: border-box;

      // 字数统计
      &::after {
        position: absolute;
        right: 12px;
        bottom: 8px;

        content: attr(data-count);

        font-size: 3.3333vw;
        color: #b0b0b0;
      }
    }

    .tags-tip {
      grid-area: tags-tip;

      font-size: 3.8462vw;
      color: #8d8d8d;
    }

    .tags-selector {
      grid-area: tags-selector;

      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(20vw, auto));
      grid-auto-flow: row dense;
      row-gap: 7px;

      // 紧凑布局

      column-gap: 7px;

      .tag {
        width: 100%;
        height: 9.4872vw;

        border: 1px solid rgb(0 0 0 / 25%);
        border-radius: 2px;

        display: flex;
        align-items: center;
        justify-content: center;

        font-size: 3.8462vw;
        color: #8d8d8d;

        // 激活状态
        &.active {
          position: relative;

          background: rgb(248 213 143 / 30%);
          border: 1px solid #f8d58f;
          border-radius: 2px;

          // 关闭图标
          .close-icon {
            position: absolute;
            top: 0;
            right: 0;

            width: 12px;
            height: 12px;

            transform: translate(50%, -50%);
          }
        }
      }
    }

    .upload-img-tip {
      grid-area: upload-img-tip;

      font-size: 3.8462vw;
      color: #8d8d8d;
    }

    // 没有视频和照片时的上传按钮
    .upload-img-big-btn {
      grid-area: upload-area;

      position: relative;

      width: 100%;
      height: 52.8205vw;

      background: #fff;
      border-radius: 2px;

      .icon {
        position: absolute;
        top: 50%;
        left: 50%;

        width: 25vw;
        height: 25vw;

        transform: translate(-50%, -50%);
      }
    }

    // 已经有视频和照片时的上传区域
    .upload-area{
      grid-area: upload-area;

      width: 100%;

      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;

      // 视频区块和图片区块
      .video-block,
      .img-block{
        position: relative;

        width: 100%;
        height: 25.641vw;
        overflow: hidden;

        border-radius: 2px;

        .delete-btn{
          position: absolute;
          top: 8px;
          right: 8px;

          width: 4.1026vw;
          height: 4.1026vw;
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

      // 视频区块
      .video-block{
        .video{
          width: 100%;
          height: 100%;
        }
      }

      // 图片区块
      .img-block{
        .img{
          width: 100%;
          height: 100%;
        }
      }

      // 上传图片、视频按钮
      .upload-img-small-btn{
        width: 100%;
        height: 25.641vw;
        overflow: hidden;

        background-color: #fff;
        border-radius: 2px;

        display: flex;
        align-items: center;
        justify-content: center;

        .icon{
          width: 15vw;
          height: 15vw;
        }
      }
    }

    .finish-btn {
      position: fixed;
      bottom: calc(30px + env(safe-area-inset-bottom));
      bottom: calc(30px + constant(safe-area-inset-bottom));
      left: 50%;

      width: 82.0513vw;
      height: 12.3077vw;

      background: linear-gradient(279deg, #ffd175 0%, #ffe8b7);
      border-radius: 40px;

      transform: translate(-50%, 0);

      display: flex;
      align-items: center;
      justify-content: center;

      color: #704C00;
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
