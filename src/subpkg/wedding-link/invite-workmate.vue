<!-- 「邀请同行」页面 -->
<template>
  <div class="container">
    <image
      class="page-bg"
      src="https://ustatic.hudongmiao.com/%20miao/shareBg.png"
      mode="aspectFill"
    ></image>
    <div class="withdrawBox">
      <div class="canWithdrawKey">可提现金额</div>
      <div class="canWithdrawMoney"><text class="unit">¥</text>{{ Number(userInfo.account_remain || 0).toFixed(2) }}</div>
      <div class="withDrawBtn" @click="navigateTo('instant-withdrawal')">
        去提现
      </div>
    </div>
    <!-- 我的邀请卡片 -->
    <div class="inviteInfoBox">
      <!-- 第一行 -->
      <div class="inviteInfoTitle">我的邀请</div>
      <!-- 第二行 -->
      <div class="typeData left" @click="navigateTo('activated-users')">
        <div class="inviteNum">
          {{ activatedInviteUserList.length }}
        </div>
        <div class="inviteKey">已开通服务用户</div>
      </div>
      <div class="verticalGap" />
      <div class="typeData right" @click="navigateTo('unactivated-users')">
        <div class="inviteNum blue">
          {{ unactivatedInviteUserList.length }}
        </div>
        <div class="inviteKey">未开通服务用户</div>
      </div>
      <!-- 第三行 -->
      <div class="inviteBeniftTip">
        通过您邀请的用户购买约婚服务后，您将获得20%佣金
      </div>
    </div>
    <!-- 邀请按钮 -->
    <div class="inviteColleaguesBtn">
      邀请同行赚收益
      <!-- 隐藏的分享按钮 -->
      <button
        class="share-btn-hidden"
        :open-type="isUploadPhoto ? 'share' : ''"
        @click="onClickShareBtn"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getInviteList } from '@/api/user-api';
import useUser from '@/stores/user-store';
import { navigateTo } from '@/utils/navigate';
import { showToast } from '@/utils/tools';
import Lunisolar from 'lunisolar';

const userStore = useUser();
const { updateInviteList } = userStore;
const {
  userInfo,
  personalInfo,
  activatedInviteUserList,
  unactivatedInviteUserList,
} = storeToRefs(userStore);

// #region 分享相关
// 点击分享的回调
// 分享给同行 shareTarget取值colleague
onShareAppMessage(() => ({
  title: '快来查看我的主持案例，相信你也可以',
  path: `/subpkg/wedding-link/invite-workmate-preview-share?userId=${userInfo.value.id}&inviteKey=${userInfo.value.invite_key}`,
  imageUrl: personalInfo?.value?.photoList?.[0],
}));

// 定义计算属性isUploadPhoto 是否上传过照片
// 如果没上传过照片 点击分享的时候要提示先上传照片
const isUploadPhoto = computed(
  () => (personalInfo.value.photoList?.length || 0) > 0
);

// 没上传照片情况下点击分享按钮的回调
const onClickShareBtn = () => {
  if (!isUploadPhoto.value) {
    showToast('请先上传照片');
  }
};

// #endregion

onShow(() => {
  getInviteListData();
});

/** 获取邀请列表 */
const getInviteListData = async () => {
  const res = (await getInviteList()) as any;
  if (res && res?.data && res?.data?.data) {
    const copy = res.data.data;
    console.log('数据', copy);
    const { activeList, unActiveList } = copy;
    const target = {
      activeList: [],
      unActiveList: []
    }
    if (activeList && activeList.length) {
      target.activeList = activeList.map((item: any) => {
        const { avator, create_time, emcee_name, invitee_emid } = item;
        return {
          userId: invitee_emid,
          avatar: avator,
          inviteTime: formatTime(create_time),
          nickname: emcee_name,
          isActivate: true
        }
      });
    }
    if (unActiveList && unActiveList.length) {
      target.unActiveList = unActiveList.map((item: any) => {
        const { avator, create_time, emcee_name, invitee_emid } = item;
        return {
          userId: invitee_emid,
          avatar: avator,
          inviteTime: formatTime(create_time),
          nickname: emcee_name,
          isActivate: false
        }
      });
    }
    /** 保存在store中 */
    updateInviteList(target)
  }
};

/**
 * 格式化显示的时间
 * @param {string} time 时间字符串
 * @returns {string} 格式化后的时间
 */
const formatTime = (time: string) =>
  Lunisolar(time).format('YYYY-MM-DD HH:MM:ss');
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  width: 100vw;
  min-height: 100vh;
  background-color: #f77b3f;
  z-index: 1;
  &::before,
  &::after {
    content: '';
    display: table;
    clear: both;
    overflow: hidden;
  }
  .page-bg {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1;
  }
  .withdrawBox {
    margin: 0 auto;
    width: 711.54rpx;
    height: 190.38rpx;
    background: #ffffff;
    border: 1.92rpx solid rgba(255, 255, 255, 0.6);
    border-radius: 15.38rpx;
    margin-top: 50vh;
    display: grid;
    grid-template:
      'canWithdrawKey canWithdrawKey' min-content
      'canWithdrawMoney withDrawBtn' min-content;
    row-gap: 19rpx;
    padding: 23rpx 32.69rpx 37rpx 32.69rpx;
    box-sizing: border-box;
    .canWithdrawKey {
      font-size: 30.77rpx;
      font-weight: 500;
      color: #333333;
      grid-area: canWithdrawKey;
    }
    .canWithdrawMoney {
      font-size: 53.85rpx;
      font-weight: 600;
      color: #fd3055;
      grid-area: canWithdrawMoney;
      .unit {
        font-size: 27rpx;
      }
    }
    .withDrawBtn {
      grid-area: withDrawBtn;
      width: 169.23rpx;
      height: 65.38rpx;
      background: #2f80ed;
      border-radius: 57.69rpx;
      box-shadow: 0px 0px 7.69rpx 0px rgba(255, 255, 255, 0.5) inset;
      text-align: center;
      line-height: 65.38rpx;
      font-size: 30.77rpx;
      font-weight: 400;
      color: #ffffff;
      justify-self: flex-end;
    }
  }
  .inviteInfoBox {
    display: grid;
    grid-template:
      'inviteInfoTitle  inviteInfoTitle  inviteInfoTitle' 61rpx
      'typeDataLeft  verticalGap  typeDataRight' 142rpx
      'inviteBeniftTip  inviteBeniftTip  inviteBeniftTip' min-content
      / 1fr 2px 1fr;
    width: 712rpx;
    margin: 0 auto;
    margin-top: 19rpx;
    background-color: #ffffff;
    border: 1.92rpx solid rgba(255, 255, 255, 0.6);
    border-radius: 15rpx;
    padding-top: 23rpx;
    padding-bottom: 30rpx;
    .inviteInfoTitle {
      grid-area: inviteInfoTitle;
      color: #333333;
      font-weight: 500;
      font-size: 31rpx;
      padding-left: 15px;
    }
    .typeData {
      display: flex;
      flex-direction: column;
      align-items: center;
      &.left {
        grid-area: typeDataLeft;
      }
      &.right {
        grid-area: typeDataRight;
      }
    }
    .inviteNum {
      font-size: 54rpx;
      color: #27ae60;
      font-weight: 600;
      &.blue {
        color: #2f80ed;
      }
    }
    .inviteKey {
      font-size: 27rpx;
      color: rgba(0, 0, 0, 0.4);
      font-weight: 400;
      margin-top: 8rpx;
    }
    .verticalGap {
      grid-area: verticalGap;
      width: 1.92rpx;
      height: 84.62rpx;
      background-color: rgba(0, 0, 0, 0.1);
    }
    .inviteBeniftTip {
      grid-area: inviteBeniftTip;
      width: 673.08rpx;
      height: 48.08rpx;
      background: rgba(255, 184, 0, 0.2);
      border-radius: 15.38rpx;
      justify-self: center;
      font-size: 23.08rpx;
      font-weight: 400;
      color: #ff6b00;
      text-align: center;
      line-height: 48.08rpx;
    }
  }
  .inviteColleaguesBtn {
    position: fixed;
    bottom: 100rpx;
    left: 50%;
    transform: translateX(-50%);
    width: 642.31rpx;
    height: 94.23rpx;
    background: linear-gradient(279deg, #ffd175 0%, #ffe8b7);
    border-radius: 90.38rpx;
    font-size: 30.77rpx;
    font-weight: 500;
    color: #704c00;
    display: flex;
    justify-content: center;
    align-items: center;
    .share-btn-hidden {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 100;
      width: 100%;
      height: 100%;
      opacity: 0;
    }
  }
  @media screen and (min-height: 800px) {
    .withdrawBox {
      margin-top: 30vh;
    }
  }
  @media screen and (max-height: 700px) {
    .withdrawBox {
      margin-top: 38vh;
    }
  }
}
</style>
