<!-- 创建个人名片页面 -->
<template>
  <uni-nav-bar
    :title="personalInfo.realName"
    left-icon="back"
    status-bar
    :border="false"
    @click-left="back"
  />
  <div class="main">
    <div class="text">
      选择照片以生成名片
    </div>
    <div class="image-list">
      <div
        v-for="(photo,index) in personalInfo.photoList"
        :key="index"
        class="photo"
        @click="checkPhoto(index)"
      >
        <image
          :src="photo"
          mode="aspectFill"
        />
        <image
          v-if="checkedIndex === index"
          class="check-mark"
          src="https://static.hudongmiao.com/wedding-rite/check-circle-green.png"
        />
      </div>
    </div>
    <div
      class="btn"
      @click="clickCreate"
    >
      立即生成
    </div>
  </div>
  <PersonalBusinessCardPopup
    ref="personalBusinessCardPopup"
    :photo="personalInfo?.photoList?.[checkedIndex] || ''"
    :qr-code="schedulePosterData?.qrCodeImg || ''"
    :name="personalInfo?.realName || ''"
    @i-know="navigateTo('my')"
  />
</template>

<script setup lang="ts">
import { useSchedule } from '@/stores/schedule-store';
import useUser from '@/stores/user-store';
import { navigateTo, back } from '@/utils/navigate';
import PersonalBusinessCardPopup from '../components/PersonalBusinessCardPopup.vue';

const userStore = useUser();
const { personalInfo } = storeToRefs(userStore);
const { getPersonalInfo } = userStore;

const scheduleStore = useSchedule();
const { schedulePosterData } = storeToRefs(scheduleStore);
const { getSchedulePosterData } = scheduleStore;

/** 检查并获取个人信息 */
const checkAndGetData = () => {
  if (!personalInfo.value) {
    getPersonalInfo();
  }
};

onShow(checkAndGetData);
const checkedIndex = ref<number>(0);

const checkPhoto = (index: number) => {
  checkedIndex.value = index;
};

// #region 弹窗及生成个人名片相关

const currentInstance = getCurrentInstance();

const open = () => {
  const popup = currentInstance?.refs?.personalBusinessCardPopup as
  InstanceType<typeof PersonalBusinessCardPopup>;
  if (popup.open) { popup.open(); }
};

const clickCreate = async () => {
  if (!schedulePosterData.value.qrCodeImg) {
    await getSchedulePosterData();
  }

  open();
};

// #endregion

</script>

<style scoped lang="scss">
.main{
  width: 100vw;
  min-height: 100vh;

  padding: 16px;
  display: flex;
  flex-direction: column;
  row-gap: 20px;

  .text{
    font-size: 16px;
    color: #333;
  }

  .image-list{
    width: calc(100vw - 32px);

    display: grid;
    grid-template-rows: repeat(auto-fill, 200px);
    grid-template-columns: repeat(3, 1fr);
    row-gap: 10px;
    column-gap: 10px;

    .photo{
      position: relative;

      width: 100%;
      height: 100%;

      image{
        width: 100%;
        height: 100%;

        border-radius: 8px;
      }

      .check-mark{
        position: absolute;
        top: 0;
        right: 0;

        width: 20px;
        height: 20px;
      }
    }
  }

  .btn{
    position: fixed;
    bottom: 224px;
    left: 50%;

    width: 320px;
    height: 48px;

    background: linear-gradient(279deg,#ffd175 0%, #ffe8b7);
    border-radius: 40px;

    transform: translateX(-50%);

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 14px;
    color:#704C00;
  }
}

</style>
