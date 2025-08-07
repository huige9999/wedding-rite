<!-- 「邀请好友，赚取现金」页面 -->
<template>
  <div class="container">
    <uni-nav-bar
      class="nav-bar"
      left-icon="left"
      title="邀请好友，赚取现金"
      status-bar
      :border="false"
      @click-left="back"
    />
    <!-- 主体部分 -->
    <div class="main">
      <!-- 背景 -->
      <image
        class="bg"
        src="https://ustatic.hudongmiao.com/joymewCustomer/screenTheme/1687774173740and31TYHJ4EV2HX"
        mode="widthFix"
      />
      <!-- 立即分享按钮 -->
      <div class="share-btn">
        立即分享
        <!-- 隐藏的分享按钮 -->
        <button
          class="share-btn-hidden"
          :open-type="isUploadPhoto ? 'share' : ''"
          @click="onClickShareBtn"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import useUser from '@/stores/user-store';
import { back } from '@/utils/navigate';
import { showToast } from '@/utils/tools';
import { hideShareMenu } from '@uni-helper/uni-promises';

const userStore = useUser();
const { userInfo, personalInfo } = storeToRefs(userStore);

/** 是否上传了照片 */
const isUploadPhoto = computed(() => ((personalInfo.value.photoList?.length || 0) > 0));

/** 点击「立即分享」按钮 */
const onClickShareBtn = () => {
  if (!isUploadPhoto.value) {
    showToast('请先上传照片');
  }
};

/** 分享回调 */
onShareAppMessage(() => ({
  title: '快来查看我的主持案例，让你成为婚礼焦点',
  path: `/subpkg/wedding-link/my-preview-share?userId=${userInfo.value.id}&inviterId=${userInfo.value.id}`,
  imageUrl: personalInfo?.value?.photoList?.[0],
}));

onMounted(() => {
  if (!isUploadPhoto.value) {
    hideShareMenu({ hideShareItems: [] });
  }
});

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

    background-color: #1c171e;

    display: flex;
    flex-direction: column;
    row-gap: 20px;
    align-items: center;

    // 背景
    .bg {
      width: 100vw;
      height: 112.8205vw;
    }

    // 立即分享按钮
    .share-btn {
      position: relative;

      width: 82.0513vw;
      height: 12.3077vw;

      background: linear-gradient(279deg, #ffd175 0%, #ffe8b7);
      border-radius: 40px;

      display: flex;
      align-items: center;
      justify-content: center;

      font-size: 3.5897vw;
      color: #704c00;

      .share-btn-hidden{
        position: absolute;
        top: 0;
        left: 0;
        z-index: 100;

        width: 100%;
        height: 100%;

        opacity: 0;
      }
    }
  }
}
</style>
