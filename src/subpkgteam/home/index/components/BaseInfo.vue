<template>
  <div class="base-info_container">
    <div class="tags">
      <div class="tag-item">#首席司仪</div>
      <div class="tag-item">#好评收割机</div>
      <div class="tag-item">#年度单王</div>
    </div>
    <!-- 我的声音 -->
    <VoicePlayBtn
      class="voice"
      :voice-length="voiceLength"
      :voice-url="personalInfo.voice"
    />
    <div class="icon-btn-list">
      <!-- 第一个图标 -->
      <div class="icon-btn first" @click="onFirstBtnClick">
        <image class="icon" src="@/static/icons/my/blocks-white.svg" />
      </div>
      <!-- 第二个图标 -->
      <div
        class="icon-btn second"
        @click="navigateTo('personal-schedule-share')"
      >
        <image class="icon" src="@/static/icons/my/calendar-white.svg" />
      </div>
      <!-- 第三个图标 -->
      <div class="icon-btn third" @click="onThirdBtnClick">
        <image class="icon" src="@/static/icons/my/location-white.svg" />
      </div>
      <!-- 第四个图标 -->
      <div class="icon-btn fourth">
        <button class="share-btn-hidden" open-type="share" />
        <image class="icon" src="@/static/icons/my/arrow-up-right-white.svg" />
      </div>
    </div>
    <!-- 「关于我」弹窗 -->
    <MyPreviewShareAboutMePopup
      ref="MyPreviewShareAboutMePopup"
      :age="userInfo.age"
      :height="userInfo.height"
      :weight="userInfo.weight"
      :proficiency="personalInfo.proficiency"
    />
    <MyPreviewShareMyAddressPopup
      ref="MyPreviewShareMyAddressPopup"
      :address="personalInfo.workPlace || ['']"
    />
  </div>
</template>

<script lang="ts" setup>
import { reqGetAudioAndVideoMeta } from "@/api/others";
import MyPreviewShareAboutMePopup from "@/components/wedding-link/MyPreviewShareAboutMePopup.vue";
import MyPreviewShareMyAddressPopup from "@/components/wedding-link/MyPreviewShareMyAddressPopup.vue";
import VoicePlayBtn from "@/components/wedding-link/VoicePlayBtn.vue";
import { useViewedUser } from "@/stores/viewed-user-store";
import { navigateTo } from "@/utils/navigate";

const viewedUserStore = useViewedUser();
const { userInfo, personalInfo } = storeToRefs(viewedUserStore);
const ctx = getCurrentInstance();
/** 录音长度 */
const voiceLength = ref(0);
// 监听personalInfo，更新录音长度和地址
watch(
  personalInfo,
  async (newVal) => {
    // 获取并设置音频长度
    if (newVal.voice) {
      const resData = (await reqGetAudioAndVideoMeta(newVal?.voice || ""))
        ?.data as AnyObject;
      voiceLength.value = Number(resData.format.duration);
    }
  },
  { immediate: true }
);

/** 第一个按钮点击事件 */
const onFirstBtnClick = () => {
  const myPreviewShareAboutMePopup = ctx?.refs
    .MyPreviewShareAboutMePopup as InstanceType<
    typeof MyPreviewShareAboutMePopup
  >;
  myPreviewShareAboutMePopup?.open();
};

/** 第三个按钮点击事件 */
const onThirdBtnClick = () => {
  const myPreviewShareMyAddressPopup = ctx?.refs
    .MyPreviewShareMyAddressPopup as InstanceType<
    typeof MyPreviewShareMyAddressPopup
  >;
  myPreviewShareMyAddressPopup?.open();
};
</script>

<style scoped lang="scss">
.base-info_container {
  padding: 33rpx 0 46rpx 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 15rpx;
  .tags {
    margin-bottom: 37rpx;
    display: flex;
    column-gap: 45rpx;
    .tag-item {
      font-size: 27rpx;
      font-weight: 400;
      color: rgba(255, 255, 255, 0.7);
    }
  }
  .voice {
    margin-bottom: 65rpx;
  }
  .icon-btn-list {
    display: flex;
    column-gap: 28px;
    align-items: center;
    justify-content: space-between;

    .icon-btn {
      width: 10.2564vw;
      height: 10.2564vw;

      background: #424148;
      border-radius: 32px;
      box-shadow: 0 2px 8px 0 rgb(52 51 47 / 25%);

      display: flex;
      align-items: center;
      justify-content: center;

      // 第四个按钮是分享按钮
      &.fourth {
        position: relative;

        .share-btn-hidden {
          position: absolute;
          top: 0;
          left: 0;

          width: 100%;
          height: 100%;

          opacity: 0;
        }
      }

      .icon {
        width: 6.4103vw;
        height: 5.1282vw;
      }
    }
  }
}
</style>
