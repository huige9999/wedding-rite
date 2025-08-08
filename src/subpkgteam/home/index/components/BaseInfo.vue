<template>
  <div class="base-info_container">
    <div
      v-if="parsedBrandInfo.brandTag?.length"
      class="tags"
    >
      <div
        v-for="(tag, index) in parsedBrandInfo.brandTag"
        :key="index"
        class="tag-item"
      >
        #{{ tag }}
      </div>
    </div>
    <div
      v-else
      class="placeholder-div"
    />
    <div class="icon-btn-list">
      <!-- 第一个图标 -->
      <div
        class="icon-btn first"
        @click="onFirstBtnClick"
      >
        <image
          class="icon"
          src="@/static/icons/my/blocks-white.svg"
        />
      </div>
      <!-- 第二个图标 -->
      <div
        class="icon-btn second"
        @click="onSecondBtnClick"
      >
        <image
          class="icon"
          src="@/static/icons/my/calendar-white.svg"
        />
      </div>
      <!-- 第三个图标 -->
      <div
        class="icon-btn third"
        @click="onThirdBtnClick"
      >
        <image
          class="icon"
          src="@/static/icons/my/location-white.svg"
        />
      </div>
      <!-- 第四个图标 -->
      <div class="icon-btn fourth">
        <button
          class="share-btn-hidden"
          open-type="share"
        />
        <image
          class="icon"
          src="@/static/icons/my/arrow-up-right-white.svg"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import useTeam from '@/stores/team-store';

const teamStore = useTeam();
const { brandInfo } = storeToRefs(teamStore);

const parsedBrandInfo = computed(() => {
  try {
    if (brandInfo.value) {
      return JSON.parse(brandInfo.value);
    }
  } catch (e) {
    console.error('解析brandInfo失败', e);
  }
  return {} as any;
});

/** 第一个按钮点击事件 */
const onFirstBtnClick = () => {
  const info = parsedBrandInfo.value || {};
  uni.showModal({
    title: '团队信息',
    content: `公司/机构: ${info.companyName || '未设置'}\n联系电话: ${info.contactPhone || '未设置'}\n联系微信: ${info.contactWechat || '未设置'}`,
    showCancel: false,
    confirmText: '好的',
  });
};

/** 第二个按钮点击事件，跳转到团队档期页 */
const onSecondBtnClick = () => {
  uni.navigateTo({ url: '/subpkgteam/schedules/index/index' });
};

/** 第三个按钮点击事件, 显示团队地址 */
const onThirdBtnClick = () => {
  if ((parsedBrandInfo.value as any).contactAddress) {
    try {
      const addr = JSON.parse((parsedBrandInfo.value as any).contactAddress);
      uni.showModal({
        title: '团队地址',
        content: `${addr.address || ''}${addr.name || ''}`,
        showCancel: false,
        confirmText: '好的',
      });
    } catch (e) {
      uni.showToast({
        title: '地址信息格式错误',
        icon: 'none',
      });
    }
  } else {
    uni.showToast({
      title: '团队还未设置地址',
      icon: 'none',
    });
  }
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
  .placeholder-div {
    /* 用于在没有标签时占位，保持按钮组位置不变 */
    height: 37rpx;
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
