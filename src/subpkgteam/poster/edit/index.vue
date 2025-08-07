<template>
  <div class="container">
    <uni-nav-bar
      class="nav-bar"
      left-icon="left"
      status-bar
      title="海报图编辑"
      :border="false"
      background-color="#ffffff"
      @click-left="back"
    />
    <div class="info-item">
      <div class="title">呈现方式</div>
      <div class="nav">
        <div
          class="nav-item"
          :class="{ active: direction === 'vertical' }"
          @click="chooseDirection('vertical')"
        >
          竖图
        </div>
        <div
          class="nav-item"
          :class="{ active: direction === 'horizontal' }"
          @click="chooseDirection('horizontal')"
        >
          横图
        </div>
      </div>
    </div>
    <div class="info-item display">
      <div class="title">
        管理展示区
        <div class="upload-num">{{ posterList.length }}/9</div>
      </div>
      <div class="tip">
        可传形象照/海报/视频等，建议宽高比{{
          sizeInfo
        }}，视频建议20s内，长按拖动可排序
      </div>
      <div
        class="upload-area"
        :class="{
          vertical: direction === 'vertical',
        }"
      >
        <move-add-area
          class="move-add-area"
          :direction="direction"
          :windowWidth="windowWidth"
          :poster-list="posterList"
          @order-change="onOrderChange"
          @poster-add="onPosterAdd"
          @poster-delete="onPosterDelete"
        />
      </div>
    </div>
    <div class="save-btn" @click="confirmEdit">完成编辑</div>
  </div>
</template>

<script lang="ts" setup>
import { reqUploadAnyFile } from "@/api/others";
import { reqEditTeamInfo } from '@/api/team-api';
import useTeam from '@/stores/team-store';
import { back } from "@/utils/navigate";
import { parseUploadFileUrl } from "@/utils/parse";
import { isNetworkUrl, showToast } from "@/utils/tools";
import { uniChooseMedia } from "@/utils/uniapp-api-promised";
import { showActionSheet } from "@uni-helper/uni-promises";
import type { TPoster } from "./components/MoveAddArea.vue";
import MoveAddArea from "./components/MoveAddArea.vue";

const teamStore = useTeam();
const { headImg } = storeToRefs(teamStore);

const direction = ref<"vertical" | "horizontal">("vertical");
const chooseDirection = (type: "vertical" | "horizontal") => {
  direction.value = type;
};
const sizeInfo = computed(() => {
  return direction.value === "vertical" ? "16:9" : "9:16";
});

const posterList = ref<Array<TPoster>>([]);

watch(headImg, (newVal) => {
  const headImgObj = JSON.parse(newVal);
  posterList.value = headImgObj.carouseList.map((item:any, index:number) => ({
    index,
    value: item
  }));
}, {
  immediate: true,
})



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
const { windowWidth } = uni?.getSystemInfoSync();

/**
 * 提交编辑信息
 */
const confirmEdit = async () => {
  if(posterList.value.length === 0) {
    showToast("请上传至少一张海报!");
    return;
  }
  const carouselList = posterList.value.map((item) => item.value);

  for(let i = 0; i < carouselList.length; i++) {
    if(!isNetworkUrl(carouselList[i].src)) {
      const uploadRes = await reqUploadAnyFile(carouselList[i].src);
      carouselList[i].src = parseUploadFileUrl(uploadRes.data);
    }
  }

  const headImgObj = {
    carouseList: carouselList,
    direction: direction.value,
  };
  console.log(headImgObj);
  const res = await reqEditTeamInfo({
    teamId: teamStore.teamId,
    headImg: JSON.stringify(headImgObj),
  });
  console.log(res);
  showToast("编辑成功!");
}
</script>

<style scoped lang="scss">
.container {
  position: relative;
  min-height: 100vh;
  background-color: #fff;
  padding-bottom: 120rpx;
  .info-item {
    width: 688rpx;
    margin: 0 auto;
    margin-top: 18rpx;
    .title {
      display: flex;
      justify-content: space-between;
      font-size: 31rpx;
      font-weight: 500;
      color: #000000;
      .upload-num {
        font-size: 27rpx;
      }
    }
    .nav {
      margin-top: 23rpx;
      width: 100%;
      height: 73rpx;
      background-color: #ebeced;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 4rpx;
      .nav-item {
        width: 337rpx;
        height: 65rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        &.active {
          background-color: #ffffff;
        }
      }
    }
    .tip {
      margin-top: 15rpx;
      font-size: 27rpx;
      color: rgba(0, 0, 0, 0.4);
    }
    .upload-area {
      margin-top: 23rpx;
      .move-add-area {
        width: 100%;
      }
    }
    &.display {
      margin-top: 46rpx;
    }
  }
  .save-btn {
    width: 688rpx;
    height: 92rpx;
    background: #000000;
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    left: 31rpx;
    bottom: 70rpx;
    z-index: 9999;
    font-size: 27rpx;
    font-weight: 500;
    color: #ffffff;
  }
}
</style>
