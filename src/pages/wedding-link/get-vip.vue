<template>
  <div class="get-vip-page">
    <!-- <uni-nav-bar
      class="nav-bar"
      title="VIP介绍"
      status-bar
      :border="false"
      background-color="#00000000"
      color="#fff"
    /> -->
    <!-- 白色隐藏标题栏 -->
    <uni-nav-bar
      class="hidden-nav-bar"
      title="VIP介绍"
      :border="false"
      status-bar
      fixed
      color="#000"
      background-color="#fff"
    />
    <image
      class="banner-img"
      src="https://ustatic.hudongmiao.com/%20miao/riteVip/banner-bg.png"
      mode="aspectFill"
    />
    <!-- 页面主体 -->
    <div class="page-main">
      <!-- 顶部用户信息 -->
      <div class="user-info">
        <image
          class="user-avator"
          :src="userInfo.avatar || DEFAULT_AVATAR"
          mode="aspectFill"
        />
        <div class="info">
          <div class="top">
            <div class="user-name">
              {{ userInfo.nickname || '嗨喵用户' }}
            </div>
            <image
              class="vip-icon"
              :src="isVip ? VIP_ACTIVE_LOGO : VIP_UNACTIVE_LOGO"
            />
          </div>
          <div class="deadline">
            {{ isVip ? '到期时间：' + userInfo.vipEndTime : '您当前还不是VIP' }}
          </div>
        </div>
        <div
          class="handler-btn"
          @click="buyVip"
        >
          {{ isVip ? '续费会员' : '开通会员' }}
        </div>
      </div>
      <!-- 查看案例 -->
      <div
        class="watch-ep"
        @click="
          navigateTo('my-preview-share', {
            userId: EXPLORE_CONSTANTS.EXAMPLE_USER_ID,
            from: 'explore',
            canBack: true,
          })
        "
      >
        查看案例
      </div>
      <!-- 底部vip特权 -->
      <image
        class="vip-feature-img"
        src="https://ustatic.hudongmiao.com/%20miao/riteVip/Group 427319432@3x.png"
        mode="heightFill"
      />
      <!-- 介绍部分1 -->
      <div class="dsp">
        <!-- 半圆装饰 -->
        <image
          class="dec-one"
          src="https://ustatic.hudongmiao.com/%20miao/riteVip/half-circle.png"
        />
        <div class="top">
          <div class="title">
            个人作品展示
          </div>
          <div class="dsp-content">
            上传个人作品，展示个人动态并易于维护，让您在主持圈子脱颖而出
          </div>
        </div>
        <div class="bottom">
          <image
            class="detail-img"
            src="https://ustatic.hudongmiao.com/%20miao/riteVip/detail-img1.png"
          />
          <div class="dsp-container">
            <div class="title">
              个人档期管理
            </div>
            <div class="dsp-content">
              记录个人档期的同时记录客户资料，统计全年收益查找空档时间，档期分享功能等
            </div>
          </div>
        </div>
      </div>
      <!-- 介绍部分2 -->
      <div class="dsp">
        <image
          class="dsc2"
          src="https://ustatic.hudongmiao.com/%20miao/riteVip/while-circle.png"
        />
        <div class="top">
          <div class="title">
            易分享传播
          </div>
          <div class="dsp-content">
            与微信等社交平台深度结合，大大提高推广效率，降低获客成本
          </div>
        </div>
        <div class="bottom">
          <image
            class="detail-img"
            style="width: 166px; height: 153px"
            src="https://ustatic.hudongmiao.com/%20miao/riteVip/detail-img2.png"
          />
          <div class="dsp-container">
            <div class="title">
              方便客户咨询
            </div>
            <div class="dsp-content">
              现场来宾在您主持的大屏互动婚礼过程中，在手机上点击约婚按钮，即可看到您的主页全部信息。有需求可以在您主页直接联系您，让您边主持边获客
            </div>
          </div>
        </div>
      </div>
      <!-- 介绍部分3 -->
      <div class="dsp">
        <image
          class="dsc3"
          src="https://ustatic.hudongmiao.com/%20miao/riteVip/while-circle.png"
        />
        <image
          class="dsc4"
          src="https://ustatic.hudongmiao.com/%20miao/riteVip/while-circle.png"
        />
        <div class="bottom">
          <div class="dsp-container">
            <div class="title">
              精准获客
            </div>
            <div class="dsp-content">
              通过您的分享和嗨喵大屏展示，极大提高您的曝光率，有需求的用户可以主动电话联系您或直接预定
            </div>
          </div>
          <image
            style="width: 179px; height: 213px"
            src="https://ustatic.hudongmiao.com/%20miao/riteVip/detail-img3.png"
          />
        </div>
      </div>
    </div>
    <!-- 开通按钮 -->
    <div
      class="get-btn"
      @click="buyVip"
    >
      <div class="inner-txt">
        支付¥599，{{ isVip ? '续费' : '开通' }}一年会员
      </div>
      <!-- <div class="btn-dec">
        <image
          class="dec-img"
          src="https://ustatic.hudongmiao.com/%20miao/riteVip/txt-bg.png"
        ></image>
        <div class="txt">次日生效</div>
      </div> -->
    </div>
  </div>
  <CustomTabBar />
</template>

<script setup lang="ts">
import { getOpenId, getVip } from '@/api/user-api';
import CustomTabBar from '@/components/CustomTabBar.vue';
import { DEFAULT_AVATAR,
  VIP_ACTIVE_LOGO,
  VIP_UNACTIVE_LOGO } from '@/static/constants/default-constant';
import { EXPLORE_CONSTANTS } from '@/static/constants/view-constants';
import useUser from '@/stores/user-store';
import { navigateTo } from '@/utils/navigate';
import { showToast } from '@/utils/tools';
import { judgeIsVip } from '@/utils/wedding-link';

const userStore = useUser();
const { userInfo } = storeToRefs(userStore);
const { updateOpenId, getPersonalInfo } = userStore;

/** 是否为VIP */
const isVip = computed(() => judgeIsVip());

/** 顶部导航栏透明度 */
const whiteNavBarOpacity = ref(0);
/** 页面头部高度 */
const pageHeadHeight = ref(0);
onLoad(() => {
  pageHeadHeight.value = (uni?.getSystemInfoSync()?.statusBarHeight || 0) + 44;
});
onShow(() => {
  // 判断当前用户是否有openid,没有则进行静默授权
  if (userInfo.value.openId) return;
  slientLogin();
});

/** 静默授权获取code */
const slientLogin = () => {
  uni.login({
    success: async (res: any) => {
      const { code } = res;
      const getRes = (await getOpenId(code)) as any;
      if (getRes && getRes?.data && getRes?.data?.data) {
        const { yhOpenid } = getRes.data.data;
        // 更新openid
        updateOpenId(yhOpenid);
      }
    },
  });
};

/** 点击开通/续费 */
const buyVip = async () => {
  getOrderInfo();
};

/** 获取订单信息 */
const getOrderInfo = async () => {
  const res = (await getVip()) as any;
  if (res && res?.data && res?.data?.data) {
    const target = JSON.parse(res.data.data);
    const {
      timeStamp, nonceStr, packageValue, signType, paySign, appId,
    } = target.obj;
    uni.requestPayment({
      provider: 'wxpay',
      orderInfo: { appid: appId },
      timeStamp: String(timeStamp),
      nonceStr,
      package: packageValue,
      signType,
      paySign,
      success: (res) => {
        console.log('调用购买结果', res);
        showToast('开通成功', 'none', 1500, true, '', () => {
          // 重新获取个人信息
          getPersonalInfo();
        });
      },
      fail: (err) => {
        console.log('错误信息', err);
      },
    });
  }
};

onPageScroll((e) => {
  const { scrollTop } = e;
  if (scrollTop >= pageHeadHeight.value) {
    whiteNavBarOpacity.value = 1;
    return;
  }
  whiteNavBarOpacity.value = scrollTop / pageHeadHeight.value;
});
</script>

<style scoped lang="scss">
.get-vip-page {
  position: relative;

  width: 100vw;
  height: 100%;
  min-height: 100vh;

  background-color: #100f0d;

  .hidden-nav-bar {
    width: 100vw;
  }

  .banner-img {
    position: absolute;

    width: 100%;
    height: 948rpx;
  }

  .page-main {
    position: relative;

    width: 100%;

    padding: 31rpx 23rpx;
    padding-bottom: calc(55px + $tabBarHeight);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;

    color: #fff;

    .user-info {
      margin-bottom: 762rpx;

      width: 100%;

      background-color: rgb(255 255 255 / 20%);
      border: 4rpx solid rgb(255 255 255 / 30%);
      border-radius: 8rpx;

      padding: 23rpx 33rpx;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .user-avator {
        margin-right: 23rpx;

        width: 108rpx;
        height: 108rpx;

        border: 4rpx solid #fff;
        border-radius: 50%;

        box-sizing: border-box;
        flex-shrink: 0;
      }

      .info {
        flex: 1;

        .top {
          margin-bottom: 8rpx;

          width: 100%;

          display: flex;
          align-items: center;
          justify-content: flex-start;

          .user-name {
            margin-right: 35rpx;

            max-width: 288rpx;
            overflow: hidden;

            font-size: 33rpx;
            font-weight: bold;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .vip-icon {
            width: 75rpx;
            height: 40rpx;
            flex-shrink: 0;
          }
        }

        .deadline {
          font-size: 27rpx;
        }
      }

      .handler-btn {
        width: 196rpx;
        height: 71rpx;

        background-image: linear-gradient(270deg, #ffbe48, #ffedb4);
        border-radius: 43px;

        font-size: 31rpx;
        font-weight: bold;
        line-height: 71rpx;
        color: #a95100;
        text-align: center;
      }
    }

    .watch-ep {
      position: absolute;
      top: 258rpx;
      right: 0;

      width: fit-content;

      background-color: rgb(255 255 255 / 50%);
      border: 2rpx solid rgb(255 255 255 / 80%);
      border-radius: 31rpx 0 0 31rpx;

      padding: 12rpx 15rpx 12rpx 23rpx;
      box-sizing: border-box;
    }

    .vip-feature-img {
      margin-top: -29rpx;
      margin-bottom: 187rpx;

      width: 100%;
      height: 944rpx;
    }

    .dsp {
      margin-bottom: 154rpx;

      position: relative;
      z-index: 1;

      width: 100%;

      .top {
        margin-bottom: 154rpx;

        width: 50%;

        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .dec-one {
        position: absolute;
        top: 58rpx;
        left: -31rpx;
        z-index: -1;

        width: 242rpx;
        height: 435rpx;
      }

      .dsc2 {
        position: absolute;
        top: 231rpx;
        left: 50%;
        z-index: -1;

        width: 265rpx;
        height: 265rpx;

        transform: translateX(-50%);
      }

      .dsc3 {
        position: absolute;
        top: 19rpx;
        left: -15rpx;
        z-index: -1;

        width: 135rpx;
        height: 135rpx;
      }

      .dsc4 {
        position: absolute;
        right: 0;
        bottom: 0;
        z-index: -1;

        width: 200rpx;
        height: 200rpx;
      }

      .title {
        margin-bottom: 52rpx;

        position: relative;

        font-size: 33rpx;
        font-weight: 500;

        &::after {
          position: absolute;
          bottom: -15rpx;
          left: 50%;

          width: 75rpx;
          height: 6rpx;

          content: '';

          background-color: #fff;

          transform: translateX(-50%);

          display: block;
        }
      }

      .dsp-content {
        font-size: 29rpx;
        font-size: 400;
      }

      .bottom {
        width: 100%;

        display: flex;
        align-items: center;
        justify-content: space-between;

        .detail-img {
          width: 358rpx;
          height: 350rpx;
          flex-shrink: 0;
        }
      }

      &:last-of-type {
        margin-bottom: 38rpx;
      }
    }

    .dsp-container {
      width: 45%;

      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }

  .get-btn {
    position: fixed;
    bottom: calc(50px + $tabBarHeight);
    left: 50%;
    z-index: 3;

    width: 619rpx;
    height: 104rpx;

    background-image: linear-gradient(270deg, #ffbe48 0%, #ffedb4);
    border-radius: 77rpx;

    transform: translateX(-50%);

    font-size: 38rpx;
    font-weight: bold;
    line-height: 104rpx;
    color: #a95100;
    text-align: center;

    .btn-dec {
      position: absolute;
      top: -50%;
      right: 19rpx;
      z-index: 1;

      width: 144rpx;
      height: 63rpx;

      .dec-img {
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;

        width: 100%;
        height: 100%;
      }

      .txt {
        position: absolute;
        top: -50%;
        left: 50%;

        width: 100%;

        transform: translateX(-50%);

        font-size: 25rpx;
        color: #fff;
      }
    }
  }
}
</style>
