<template>
  <div class="container">
    <uni-nav-bar
      class="nav-bar"
      left-icon="left"
      status-bar
      title="海报"
      :border="false"
      background-color="#ffffff"
      @click-left="back"
    />
    <div class="list-container">
      <div class="operate-tip">
        选择照片以生成名片
      </div>
      <div class="list-wrap">
        <div
          v-for="item in sharePosterBgList"
          :key="item"
          class="list-item"
          @click="choosePoster(item)"
        >
          <image
            class="share-img"
            :src="item"
          />
          <uni-icons
            v-if="choosedPoster === item"
            type="checkbox"
            size="18"
            color="#FF265C"
            class="check-icon"
          />
        </div>
        <div
          class="list-item add-item"
          @click="uploadPosterBg"
        >
          <uni-icons
            type="plusempty"
            size="32"
            color="#000"
          />
        </div>
      </div>
    </div>
    <div
      class="generate-btn"
      @click="toGeneratePoster"
    >
      立即生成
    </div>
    <posterPopup ref="posterPopupRef" />
  </div>
</template>

<script lang="ts" setup>
import { reqUploadAnyFile } from '@/api/others';
import useTeam from '@/stores/team-store';
import { back } from '@/utils/navigate';
import { parseUploadFileUrl } from '@/utils/parse';
import { showToast } from '@/utils/tools';
import { uniChooseMedia } from '@/utils/uniapp-api-promised';
import posterPopup from './components/posterPopup.vue';

const ctx = getCurrentInstance();
const teamStore = useTeam();
const { sharePosterBgList } = storeToRefs(teamStore);
const choosedPoster = ref<string>('');

const toGeneratePoster = () => {
  if (!choosedPoster.value) {
    showToast('请选择海报背景!');
    return;
  }
  const posterPopupRef = ctx?.refs.posterPopupRef as any;
  posterPopupRef.show(choosedPoster.value);
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
  if (!chooseRes?.tempFiles?.[0]?.tempFilePath) {
    return [];
  }

  return chooseRes.tempFiles.map((item) => item.tempFilePath);
};

/**
 * 选择图片、上传图片、保存图片
 */
const uploadPosterBg = async () => {
  const chooseRes = await chooseImg();
  const uploadRes = await reqUploadAnyFile(chooseRes[0]);
  const url = parseUploadFileUrl(uploadRes.data);
  teamStore.setSharePosterBgList(url);
};

const choosePoster = (item: string) => {
  choosedPoster.value = item;
};

</script>

<style scoped lang="scss">
.container {
  position: relative;
  .list-container {
    margin-top: 23rpx;
    padding: 0 31rpx;
    .operate-tip {
      font-size: 38rpx;
      font-weight: 400;
      color: #000000;
    }
    .list-wrap {
      margin-top: 17rpx;
      display: grid;
      grid-template-columns: repeat(3, min-content);
      column-gap: 11rpx;
      row-gap: 20rpx;
      .list-item {
        width: 223rpx;
        height: 384rpx;
        position: relative;
        .share-img {
          width: 100%;
          height: 100%;
        }
        .check-icon {
          position: absolute;
          top: 10rpx;
          right: 10rpx;
        }
        &.add-item {
          border: 2rpx solid #000;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }

  .generate-btn {
    width: 688rpx;
    height: 92rpx;
    background: #000000;
    font-size: 27rpx;
    font-weight: 500;
    color: #ffffff;
    text-align: center;
    line-height: 92rpx;
    position: fixed;
    bottom: 67rpx;
    left: 31rpx;
  }
}
</style>
