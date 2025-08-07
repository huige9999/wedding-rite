<!-- 照片轮播图组件 -->
<template>
  <uni-swiper-dot
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
          :src="photo"
          mode="aspectFill"
        />
        <!-- 编辑图片按钮 -->
        <div
          v-if="isShowEditBtn"
          class="edit-btn"
          @click="emit('photoEditBtnClick', index)"
        >
          <image
            class="icon"
            src="@/static/icons/my/edit-white.svg"
          />
          <text class="text">
            编辑图片
          </text>
        </div>
      </swiper-item>
    </swiper>
  </uni-swiper-dot>
</template>

<script setup lang="ts">
type Props = {
  photoList: string[];
  isShowEditBtn?: boolean
};
withDefaults(
  defineProps<Props>(),
  { isShowEditBtn: true },
);

const emit = defineEmits<
{(e: 'photoSwiperChange', index: number): void;
  (e: 'photoEditBtnClick', index: number): void;
}> ();

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
  emit('photoSwiperChange', index);
};

</script>

<style scoped lang="scss">
// 照片轮播
.photo-swiper {
  grid-area: photo;

  .photo-swiper {
    width: 100vw;
    height: 150.2564vw;

    .photo-swiper-item {
      position: relative;

      .photo {
        width: 100vw;
        height: 150.2564vw;
      }

      // 编辑图片按钮
      .edit-btn {
        position: absolute;
        right: 8px;
        bottom: 18px;

        width: 11.7949vw;
        height: 10.2564vw;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .icon {
          width: 6.1538vw;
          height: 6.1538vw;
        }

        .text {
          font-size: 2.8205vw;
          color: #fff;
        }
      }
    }
  }
}

</style>
