<template>
  <div
    class="poster-container"
    :style="{
      height: `${posterHeightLast}px`,
      '--poster-height': `${posterHeightLast}px`,
    }"
  >
    <!-- 海报 -->
    <div class="poster-area">
      <!-- 未上传海报的情况 -->
      <div
        v-if="!photoList.length"
        class="upload-img-tip"
        @click="onClickUploadPoster"
      >
        <image
          class="bg"
          src="@/static/images/my/upload-img.svg"
        />
        <div class="text">
          点击上传图片
        </div>
      </div>
      <!-- 上传过海报的情况 -->
      <div class="has-upload">
        <uni-swiper-dot
          v-if="photoList.length > 0"
          class="photo-swiper"
          :current="currentPhotoIndex"
          :info="photoList"
          :dots-styles="indicatorStyle"
        >
          <swiper
            class="photo-swiper"
            :autoplay="true"
            :interval="3000"
            :duration="500"
            :current="currentPhotoIndex"
            circular
            @change="photoSwiperChange($event.detail.current)"
          >
            <swiper-item
              v-for="(photo, index) in photoList"
              :key="index"
              class="photo-swiper-item"
            >
              <image
                class="photo"
                :src="photo.src"
                mode="aspectFill"
              />
            </swiper-item>
          </swiper>
        </uni-swiper-dot>
        <div
          class="setting-btn"
          @click="toEditPoster"
        >
          <uni-icons
            type="gear"
            size="18"
            color="#fff"
          />
        </div>
      </div>
    </div>
    <!-- 标题 -->
    <div class="title">
      主持人上小官的作品合集
    </div>
  </div>
</template>

<script lang="ts" setup>
import useTeam from '@/stores/team-store';

const teamStore = useTeam();
const { headImg } = storeToRefs(teamStore);

type Props = {
  posterHeight: number;
};
const props = withDefaults(defineProps<Props>(), { posterHeight: 0 });

const posterHeightLast = computed(() => {
  if (direction.value === 'horizontal') {
    return 0.5 * props.posterHeight;
  }
  return props.posterHeight;
});

const photoList = computed(() => {
  if (headImg.value) {
    const headImgObj = JSON.parse(headImg.value);
    return headImgObj.carouseList;
  }
  return [];
});

const direction = computed(() => {
  if (headImg.value) {
    const headImgObj = JSON.parse(headImg.value);
    return headImgObj.direction;
  }
  return 'vertical';
});

/** 指示点样式 */
const indicatorStyle = {
  backgroundColor: 'rgba(217,217,217,0.4)',
  selectedBackgroundColor: 'rgba(217,217,217,1)',
  border: '1px rgba(255,255,255,1) solid',
  selectedBorder: '1px rgba(255,255,255,1) solid',
};

const currentPhotoIndex = ref(0);

const photoSwiperChange = (index: number) => {
  currentPhotoIndex.value = index;
};
/**
 * 点击上传海报事件
 */
const onClickUploadPoster = () => {
  console.log('点击上传海报');
};

/**
 * 跳转到编辑海报页面
 */
const toEditPoster = () => {
  uni.navigateTo({ url: '/subpkgteam/poster/edit/index' });
};
</script>

<style scoped lang="scss">
.poster-container {
  position: relative;
  .poster-area {
    height: calc(100% - 121rpx);
    .upload-img-tip {
      position: relative;
      width: 100%;
      height: 100%;
      background-color: #2c2c33;
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
    .has-upload {
      width: 100%;
      height: calc(var(--poster-height) - 121rpx);
      position: relative;
      .setting-btn {
        width: 38rpx;
        height: 38rpx;
        background: rgba(0, 0, 0, 0.6);
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 25rpx;
        right: 25rpx;
        z-index: 1;
      }
      .photo-swiper {
        width: 100%;
        height: calc(var(--poster-height) - 121rpx);
        .photo-swiper-item {
          position: relative;
          .photo {
            width: 100%;
            height: calc(var(--poster-height) - 121rpx);
          }
        }
      }
    }
  }
  .title {
    width: 100%;
    height: 121rpx;
    background-color: #212125;
    font-size: 48rpx;
    font-weight: 500;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
