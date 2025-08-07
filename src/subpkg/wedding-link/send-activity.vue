<!-- 「发动态」页面 -->
<template>
  <div class="container">
    <uni-nav-bar
      class="nav-bar"
      left-icon="left"
      title="发动态"
      status-bar
      :border="false"
      @click-left="back"
    />
    <!-- 主体部分 -->
    <div class="main">
      <!-- 文字输入框 -->
      <textarea
        v-model="activityInfo.content"
        class="text-input"
        placeholder="这一刻的想法..."
        auto-height
        maxlength="1000"
      />
      <!-- 图片区域 -->
      <div class="img-area">
        <!-- 已有的视频 -->
        <div
          v-for="(video,index) in activityInfo.videos"
          :key="index"
          class="uploaded-video"
        >
          <video
            :src="video"
            class="video"
          />
          <!-- 删除按钮 -->
          <image
            class="icon"
            src="@/static/icons/common/circle-close-gray.svg"
            @click="deleteBtnClick(index)"
          />
        </div>
        <!-- 已有的图片 -->
        <div
          v-for="(img,index) in activityInfo.images"
          :key="index"
          class="uploaded-img"
        >
          <image
            class="img"
            :src="img"
            mode="aspectFill"
          />
          <!-- 删除按钮 -->
          <image
            class="icon"
            src="@/static/icons/common/circle-close-gray.svg"
            @click="deleteBtnClick(index)"
          />
        </div>
        <!-- 添加图片/视频按钮 -->
        <div
          v-if="addedMediaCount < 9"
          class="add-img-btn"
          @click="addBtnClick"
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
        <span class="text">完成</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reqSendActivity } from '@/api/activity-api';
import { reqUploadAnyFile } from '@/api/others';
import useActivity from '@/stores/activity-store';
import { back } from '@/utils/navigate';
import { parseUploadFileUrl } from '@/utils/parse';
import { showToast } from '@/utils/tools';
import { uniChooseMedia } from '@/utils/uniapp-api-promised';

const activityStore = useActivity();
const { getActivityList } = activityStore;

/** 发布的动态的类型 */
const activityType = ref<'image' | 'video'>('image');

/** 填写的动态信息 */
const activityInfo = ref<SendActivityInfo>({
  content: '',
  cover: '',
  videos: [] as string[],
  images: [] as string[],
});

// 页面加载时，设置动态类型，如果有选择的图片/视频，则设置到动态信息中
onLoad((option) => {
  if (!option) return;
  activityType.value = option.type;
  const tempFiles = JSON.parse(option?.tempFiles || '[]') as UniApp.ChooseMediaSuccessCallbackResult['tempFiles'];
  if (tempFiles && activityType.value === 'image') {
    activityInfo.value.images = tempFiles.map((item) => item.tempFilePath);
  } else if (tempFiles && activityType.value === 'video') {
    activityInfo.value.videos = tempFiles.map((item) => item.tempFilePath);
  }
});

/** 已添加的图片/视频的数量 */
const addedMediaCount = computed(() => activityInfo.value.images.length
+ activityInfo.value.videos.length);

/** 添加图片/视频按钮点击事件 */
const addBtnClick = async () => {
  const chooseRes = await uniChooseMedia({
    count: 9 - addedMediaCount.value,
    mediaType: [activityType.value],
  });
  console.log('chooseRes', chooseRes);
  if (chooseRes.errMsg !== 'chooseMedia:ok') return;
  const { tempFiles } = chooseRes;
  if (!tempFiles) return;

  const { images, videos } = activityInfo.value;
  // 根据动态类型，添加图片/视频，排除超过100M的文件
  if (activityType.value === 'image') {
    activityInfo.value.images = images.concat(
      tempFiles
        .filter((item) => item.size < 100 * 1024 * 1024)
        .map((item) => item.tempFilePath),
    );
  } else {
    activityInfo.value.videos = videos.concat(
      tempFiles
        .filter((item) => item.size < 100 * 1024 * 1024)
        .map((item) => item.tempFilePath),
    );
  }

  // 如果有超过100M的文件，则提示用户
  if (tempFiles.some((item) => item.size >= 100 * 1024 * 1024)) {
    showToast('单个文件大小不能超过100M');
  }
  console.log('activityInfo', activityInfo.value);
};

/**
 * 删除按钮点击事件
 * @param index 被点击的图片/视频的索引
 */
const deleteBtnClick = (index: number) => {
  if (activityType.value === 'image') {
    activityInfo.value.images.splice(index, 1);
  } else {
    activityInfo.value.videos.splice(index, 1);
  }
  console.log('activityInfo', activityInfo.value);
};

/**
 * 校验动态信息是否填写完整
 * @param temActivityInfo 动态信息
 * @returns 是否填写完整
 */
const validateActivityInfo = (temActivityInfo: typeof activityInfo.value) => {
  const { content, images, videos } = temActivityInfo;
  if (!content) {
    showToast('请输入文字内容');
    return false;
  }
  if (activityType.value === 'image' && images.length === 0) {
    showToast('请添加图片');
    return false;
  }
  if (activityType.value === 'video' && videos.length === 0) {
    showToast('请添加视频');
    return false;
  }
  return true;
};

/** 是否有未完成的「完成」按钮点击事件 */
const hasUnfinishedFinishBtnClick = ref(false);

/** 「完成」按钮点击事件 */
const finishBtnClick = async () => {
  // 防止重复点击
  if (hasUnfinishedFinishBtnClick.value) {
    return;
  }
  if (!validateActivityInfo(activityInfo.value)) return;

  hasUnfinishedFinishBtnClick.value = true;

  // 根据动态类型，上传图片/视频
  const { images, videos } = activityInfo.value;
  // 上传图片
  if (activityType.value === 'image') {
    const uploadRes = await Promise.all(
      images.map((item) => reqUploadAnyFile(item)),
    ) as UniApp.UploadFileSuccessCallbackResult[];
    // 上传失败
    if (uploadRes.some((item) => item.errMsg !== 'uploadFile:ok')) {
      showToast('上传失败');
      hasUnfinishedFinishBtnClick.value = false;
      return;
    }
    // 上传成功，获取上传后的图片的 url
    activityInfo.value.images = uploadRes.map((item) => parseUploadFileUrl(item.data));

    [activityInfo.value.cover] = activityInfo.value.images;

  // 上传视频
  } else {
    const uploadRes = await Promise.all(
      videos.map((item) => reqUploadAnyFile(item)),
    ) as UniApp.UploadFileSuccessCallbackResult[];
    // 上传失败
    if (uploadRes.some((item) => item.errMsg !== 'uploadFile:ok')) {
      showToast('上传失败');
      hasUnfinishedFinishBtnClick.value = false;
      return;
    }

    // 上传成功，获取上传后的视频的 url
    activityInfo.value.videos = uploadRes.map((item) => parseUploadFileUrl(item.data));

    activityInfo.value.cover = `${activityInfo.value.videos[0]}?x-oss-process=video/snapshot,t_0,f_jpg`;
  }

  console.log('activityInfo', activityInfo.value);
  const sendRes = await reqSendActivity(activityInfo.value);
  console.log('sendRes', sendRes);
  if ((sendRes?.data as ResData<AnyObject>).code !== 200) {
    showToast('发布失败，请稍后再试');
  // 发布成功
  } else {
    showToast('发布成功');
    await getActivityList();
    back();
  }
  hasUnfinishedFinishBtnClick.value = false;
};
</script>

<style lang="scss" scoped>
.container {
  width: 100vw;
  min-height: 100vh;

  display: grid;
  grid-template:
    'nav-bar' auto
    'main' 1fr
    /100vw;

  .nav-bar {
    grid-area: nav-bar;
  }

  .main {
    grid-area: main;

    min-height: 18.9744vw;

    padding: 12px 12px 30px;
    display: grid;
    grid-template:
      'text-input' min-content
      '.' 10px
      'img-area' auto
      '.' 1fr
      'finish-btn' auto
      '.' 30px;

    // 文字输入框
    .text-input {
      grid-area: text-input;

      width: 100%;
      min-height: 18.9744vw;

      font-size: 3.5897vw;
      text-align: justify;
    }

    // 图片区域
    .img-area {
      grid-area: img-area;

      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-gap: 11px;

      // 已选择的图片和视频
      .uploaded-img,
      .uploaded-video {
        position: relative;

        width: 29.4872vw;
        height: 29.4872vw;

        .img,
        .video {
          width: 100%;
          height: 100%;

          border-radius: 6px;
        }

        .icon {
          position: absolute;
          top: 0;
          right: 0;

          width: 4.1026vw;
          height: 4.1026vw;

          transform: translate(50%, -50%);
        }
      }

      .add-img-btn {
        width: 29.4872vw;
        height: 29.4872vw;

        border: 0.5px solid #e8e8e8;
        border-radius: 6px;

        display: flex;
        align-items: center;
        justify-content: center;

        .icon {
          width: 10vw;
          height: 10vw;
        }
      }
    }

    // 「完成」按钮
    .finish-btn {
      grid-area: finish-btn;
      align-self: center;
      justify-self: center;

      width: 82.0513vw;
      height: 12.3077vw;

      background: linear-gradient(279deg, #ffd175 0%, #ffe8b7);
      border-radius: 10.2564vw;

      display: flex;
      align-items: center;
      justify-content: center;

      .text {
        font-size: 16px;
        color: #704C00;
      }
    }

  }
}
</style>
