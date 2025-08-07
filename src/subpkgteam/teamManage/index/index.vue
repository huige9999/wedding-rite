<template>
  <div class="container">
    <uni-nav-bar
      class="nav-bar"
      left-icon="left"
      status-bar
      title="团队管理"
      :border="false"
      background-color="#ffffff"
      @click-left="back"
    />
    <div class="invite-code_card">
      <div class="top-tit">
        <div class="top-left">
          团队邀请码
          <div class="invite-code">{{ inviteCode }}</div>
        </div>
        <div class="copy-btn" @click="onCopy">复制</div>
      </div>
      <div class="info">
        复制邀请码发送给主持人，主持人输入邀请码提交审核，审核通过即可加入您的团队
      </div>
    </div>
    <div class="menu-list">
      <div class="menu-item">
        <div class="menu-left">
          <div class="menu-name">推广方式</div>
          <uni-icons
            type="help"
            size="18"
            color="rgba(0,0,0,0.4)"
            @click="showSpreadTip"
          ></uni-icons>
        </div>
        <div class="menu-right" @click="showSpreadList">
          <span class="extra-desc">{{ spreadLabel }}</span>
          <uni-icons type="forward" size="12" color="#000000"></uni-icons>
        </div>
      </div>
      <div class="menu-item">
        <div class="menu-left">
          <div class="menu-name">预约权限</div>
          <uni-icons type="help" size="18" color="rgba(0,0,0,0.4)" @click="showReserveTip"></uni-icons>
        </div>
        <div class="menu-right" @click="showReserveList">
          <span class="extra-desc">{{ reserveLabel }}</span>
          <uni-icons type="forward" size="12" color="#000000"></uni-icons>
        </div>
      </div>
      <div class="menu-item" @click="toMemberManage">
        <div class="menu-left">
          <div class="menu-name">成员管理</div>
        </div>
        <div class="menu-right">
          <uni-icons type="forward" size="12" color="#000000"></uni-icons>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { back } from "@/utils/navigate";
import { showToast } from "@/utils/tools";
import { showActionSheet } from "@uni-helper/uni-promises";

const inviteCode = ref("akfe45");
const spreadValue = ref<"0" | "1" | "2" | "3">("0");
const spreadLabel = computed(
  () => SPREADMETHODS[spreadValue.value]
);
const SPREADMETHODS = {
  "0": "以团队形式推广",
  "1": "以个人形式推广",
  "2": "以个人形式推广(隐藏个人电话)",
  "3": "以团队形式推广(隐藏个人电话)",
};

const reserveValue = ref<"0" | "1">("0");
const reserveLabel = computed(() => RESERVES[reserveValue.value]);
const RESERVES = {
  "0": "统一预约到团队",
  "1": "可预约到个人",
};


const onCopy = () => {
  uni.setClipboardData({
    data: inviteCode.value,
    success: () => {
      showToast("邀请码复制成功!");
    },
    fail: () => {
      showToast("邀请码复制失败!");
    },
  });
};

const showSpreadTip = () => {
  uni.showModal({
    title: "推广方式说明",
    content:
      "以团队形式推广：分享后，访客均只能查看到团队主页；在商户端只以团队形象展示，不以单个成员形象展示。以个人形式推广：分享后，访客可以查看到个人主页；在商户端以单个成员形象展示。",
    confirmText: "我知道了",
    showCancel: false,
  });
};

const showReserveTip = () => {
  uni.showModal({
    title: "预约权限说明",
    content:
      "统一预约到团队：用户不管是从团队主页还是成员主页预约，均预约到团队，由团队负责人协调分配处理。可预约到个人：用户可以直接预约到团队成员，成员可自行处理。",
    confirmText: "我知道了",
    showCancel: false,
  });
};

const showSpreadList = async () => {
  const res = await showActionSheet({
    itemList: [
      "以团队形式推广",
      "以个人形式推广",
      "以个人形式推广(隐藏个人电话)",
      "以团队形式推广(隐藏个人电话)",
    ],
  });
  console.log(res);
  spreadValue.value = String(res.tapIndex) as any;
};

const showReserveList = async () => {
  const res = await showActionSheet({
    itemList: ["统一预约到团队", "可预约到个人"],
  });
  console.log(res);
  reserveValue.value = String(res.tapIndex) as any;
};

const toMemberManage = () => {
  console.log("toMemberManage");
  uni.navigateTo({
    url: "/subpkgteam/teamManage/member/index",
  });
}

</script>

<style scoped lang="scss">
.container {
  position: relative;
  .invite-code_card {
    width: 688rpx;
    height: 223rpx;
    background: #ffffff;
    border-radius: 15rpx;
    box-shadow: 0px 0px 62rpx 0px rgba(0, 0, 0, 0.06);
    padding: 31rpx;
    margin: 31rpx auto 38rpx auto;
    .top-tit {
      display: flex;
      justify-content: space-between;
      .top-left {
        font-size: 38rpx;
        font-weight: 600;
        color: #000000;
        margin-right: 15rpx;
        display: flex;
        align-items: center;
        .invite-code {
          width: 104rpx;
          height: 44rpx;
          border-radius: 4rpx;
          text-align: center;
          line-height: 44rpx;
          font-size: 23rpx;
          font-weight: 400;
          color: #ffffff;
          background-color: #ffcd68;
          margin-left: 15rpx;
        }
      }
      .copy-btn {
        font-size: 31rpx;
        font-weight: 500;
        color: #2f80ed;
      }
    }
    .info {
      font-size: 27rpx;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.4);
      margin-top: 30rpx;
      line-height: 40rpx;
    }
  }
  .menu-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 38rpx;
    .menu-item {
      width: 688rpx;
      height: 88rpx;
      border-bottom: 1rpx solid #eeeeee;
      margin-bottom: 15rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .menu-left {
        display: flex;
        align-items: center;
        .menu-name {
          font-size: 31rpx;
          font-weight: 600;
          color: #000000;
          margin-right: 8rpx;
        }
      }
      .menu-right {
        display: flex;
        align-items: center;
        .extra-desc {
          font-size: 27rpx;
          font-weight: 400;
          color: #000000;
          margin-right: 22rpx;
        }
      }
    }
  }
}
</style>
