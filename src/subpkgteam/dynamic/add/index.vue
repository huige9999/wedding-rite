<template>
  <div class="container">
    <uni-nav-bar
      class="nav-bar"
      left-icon="left"
      status-bar
      title="发布动态"
      :border="false"
      background-color="#ffffff"
      @click-left="back"
    />
    <div class="form">
      <div class="form-item">
        <textarea
          v-model="formData.content"
          class="text-input"
          placeholder="这一刻的想法..."
          auto-height
          maxlength="1000"
        />
      </div>
      <div class="form-item">
        <div class="key">
          上传内容<span class="tip">(必填、长按可拖动排序)</span>
        </div>
        <div class="upload-area">
          <move-add-area
            class="move-add-area"
            direction="horizontal"
            :windowWidth="windowWidth"
            :poster-list="posterList"
            @order-change="onOrderChange"
            @poster-add="onPosterAdd"
            @poster-delete="onPosterDelete"
          />
        </div>
      </div>
      <div class="save-btn" @click="onSubmit">保存</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reqUploadAnyFile } from "@/api/others";
import { reqAddDynamic, reqEditWorks, reqGetWorksDetail } from "@/api/team-api";
import useTeam from "@/stores/team-store";
import { back } from "@/utils/navigate";
import { parseUploadFileUrl } from "@/utils/parse";
import { isNetworkUrl, showToast } from "@/utils/tools";
import { uniChooseMedia } from "@/utils/uniapp-api-promised";
import { showActionSheet } from "@uni-helper/uni-promises";
import type { TPoster } from "../../poster/edit/components/MoveAddArea.vue";
import MoveAddArea from "../../poster/edit/components/MoveAddArea.vue";

const { windowWidth } = uni?.getSystemInfoSync();

const posterList = ref<TPoster[]>([]);

const teamStore = useTeam();

const dynamicId = ref("");
const formData = reactive({
  content: "",
  mediaInfo: "",
  teamId: teamStore.teamId,
});
/**
 * 选择图片并返回图片地址
 * @param count 选择图片的数量，默认为1
 * @returns 返回选择的图片的本地地址列表
 */
const chooseImg = async (count = 1) => {
  const chooseRes = await uniChooseMedia({
    count,
    sizeType: ["original"],
    sourceType: ["album", "camera"],
    mediaType: ["image"],
  });
  if (!chooseRes?.tempFiles?.[0]?.tempFilePath) {
    return [];
  }

  return chooseRes.tempFiles.map((item) => item.tempFilePath);
};

/**
 * 调整顺序后更新posterList
 */
const onOrderChange = (newList: any) => {
  posterList.value = newList;
  console.log(newList);
};
/**
 * 添加poster
 */
const onPosterAdd = async () => {
  if (posterList.value.length >= 9) {
    showToast("上传超出限制!");
    return;
  }

  const showActionSheetRes = await showActionSheet({
    itemList: ["照片", "视频"],
  });
  if (showActionSheetRes?.tapIndex === undefined) return;

  let activityType: "image" | "video" = "image";
  if (showActionSheetRes.tapIndex === 0) {
    activityType = "image";
  } else if (showActionSheetRes.tapIndex === 1) {
    activityType = "video";
  }

  // 选择图片/视频
  try {
    const chooseMediaRes = await uniChooseMedia({
      count: 1,
      mediaType: [activityType],
    });
    if (
      chooseMediaRes?.tempFiles?.length &&
      chooseMediaRes?.tempFiles?.length > 0
    ) {
      const tempFile = chooseMediaRes.tempFiles[0];
      posterList.value = [
        ...posterList.value,
        {
          index: posterList.value.length,
          value: {
            src: tempFile.tempFilePath,
            mediaType: activityType,
          },
        },
      ];
    }
  } catch (e) {
    console.error(e);
  }
};
/**
 * 删除poster
 */
const onPosterDelete = (index: number) => {
  posterList.value = posterList.value.filter((item) => item.index !== index);
};

const validateForm = () => {
  if (formData.content.trim().length === 0) {
    showToast("请填写动态内容!");
    return false;
  }
  if (posterList.value.length === 0) {
    showToast("请上传动态内容!");
    return false;
  }
  return true;
};

const onSubmit = async () => {
  if (!validateForm()) {
    return;
  }
  try {
    const mediaInfo = posterList.value.map((item) => item.value);
    // 确保mediaInfo的资源都是上传到云端的
    for (let i = 0; i < mediaInfo.length; i++) {
      if (!isNetworkUrl(mediaInfo[i].src)) {
        const uploadRes = await reqUploadAnyFile(mediaInfo[i].src);
        mediaInfo[i].src = parseUploadFileUrl(uploadRes.data);
      }
    }
    formData.mediaInfo = JSON.stringify(mediaInfo);
    console.log(formData);
    if (dynamicId.value) {
      const res = await reqEditWorks({
        ...formData,
        find_id: dynamicId.value,
      });
      console.log(res);
    } else {
      const res = await reqAddDynamic(formData);
      console.log(res);
    }
    showToast("上传成功!");
    teamStore.setNeedRefreshDynamic(true);
    setTimeout(() => {
      back();
    }, 300);
  } catch (err) {
    console.log(err);
    showToast("上传失败，请稍后再试!");
  }
};

const getWorkDetail = async () => {
  try {
    const res = await reqGetWorksDetail(dynamicId.value);
    console.log(res);
    formData.content = res.data.data.content;
    const mediaInfo = JSON.parse(res.data.data.mediaInfo);
    posterList.value = mediaInfo.map((item, index) => ({
      index,
      value: item,
    }));
  } catch (err) {
    console.log(err);
  }
};

onLoad((options) => {
  if (options?.dynamicId) {
    dynamicId.value = options.dynamicId as string;
    getWorkDetail();
  }
});
</script>

<style scoped lang="scss">
.container {
  .form {
    width: 703rpx;
    margin: 0 auto;
    padding-top: 15rpx;
    padding-bottom: 250rpx;
    .cover {
      height: 396rpx;
      background: #f5f6fa;
      border-radius: 4rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 29rpx;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.4);
      position: relative;
      .cover-img {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
      }
    }
    .form-item {
      margin-top: 36rpx;
      .title-ipt {
        width: 621rpx;
        height: 65rpx;
        font-size: 46rpx;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.4);
        outline: none;
        background-color: transparent;
        border: none;
      }
      .key {
        font-size: 31rpx;
        font-weight: 500;
        color: #000000;
        .tip {
          font-size: 24rpx;
          font-weight: 400;
        }
      }
      .upload-area {
        margin-top: 23rpx;
        .move-add-area {
          width: 100%;
        }
      }
    }
    .save-btn {
      width: 688rpx;
      height: 92rpx;
      background: #000000;
      font-size: 27rpx;
      font-weight: 500;
      color: #ffffff;
      text-align: center;
      line-height: 92rpx;
      position: fixed;
      bottom: 40rpx;
      z-index: 9999;
    }
  }
}
</style>
