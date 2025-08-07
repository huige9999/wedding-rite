<template>
  <div class="content">
    <uni-nav-bar
      title="作品详情"
      status-bar
      :border="false"
      left-icon="left"
      fixed
      @click-left="back"
    />
    <div class="title">
      {{ caseName }}
    </div>
    <div class="gapLine" />
    <div
      v-if="moreInformationJson"
      class="description"
    >
      <rich-text :nodes="moreInformationJson" />
    </div>
    <div
      v-if="imageList.length > 0 || videoList.length > 0"
      class="previewArea"
    >
      <image
        v-for="item in imageList"
        :key="item.imagePath"
        :src="item.imagePath"
        mode="widthFix"
        class="previewImg"
      />
      <div
        v-for="item in videoList"
        :key="item.videoPath"
        class="previewVideo"
        @click="previewVideo(item.videoPath)"
      >
        <img
          :src="item.videoPath + '?vframe/jpg/offset/0'"
          mode="widthFix"
          class="previewImg"
        >
        <div class="shade" />
        <img
          src="https://ustatic.hudongmiao.com/joymewApp/playIconBig.png"
          class="playIcon"
        >
      </div>
    </div>
    <div class="commentTit">
      作品评价 <text class="num">
        ({{ commentList.length }})
      </text>
    </div>
    <div class="commentIpt">
      <img
        :src="avator"
        class="avator"
      >
      <input
        v-model="commentCt"
        type="text"
        placeholder="爱评论的人运气都不会差"
        class="ipt"
        placeholder-style="font-size: 26rpx"
        :focus="isFocus"
        @keyup.enter="sendComment"
        @blur="handleBlur"
      >
      <div
        class="sendBtn"
        @click="sendComment"
      >
        发送
      </div>
    </div>
    <div
      v-if="commentList.length === 0"
      class="noCommentsBlock"
    >
      <image
        src="https://ustatic.joymew.com/joymewApp/emptyComt.png"
        class="emptyComment"
      />
      <div class="tip">
        期待您的评论~
      </div>
    </div>
    <div
      v-if="commentList.length > 0"
      class="commentsBlock"
    >
      <div
        v-for="item in commentList"
        :key="item.comment_id"
        class="commentsItem"
      >
        <image
          :src="item.headimg_url"
          class="avator"
        />
        <div class="rightCt">
          <div class="rTop">
            <div class="name">
              {{ item.nickname }}
            </div>
            <div class="ctTime">
              {{ item.create_time }}
            </div>
          </div>
          <div class="rBottom">
            {{ item.content }}
          </div>
        </div>
      </div>
    </div>
    <div
      class="commentBar"
      :style="{paddingBottom: safeAreaBottom + 'rpx'}"
    >
      <div class="leftBar">
        <div class="barItem">
          <div
            class="bBox"
            @click="toggleLike"
          >
            <img
              v-if="!isLike"
              src="https://ustatic.joymew.com/joymewApp/mp/lv1.png"
              class="loveIcon"
            >
            <img
              v-if="isLike"
              src="https://ustatic.joymew.com/joymewApp/mp/lv2.png"
              class="loveIcon"
            >
          </div>
          <div class="des">
            {{ likes }}
          </div>
        </div>
        <div
          v-if="shareType === '1'"
          class="barItem"
          @click="callPhone"
        >
          <div class="bBox">
            <img
              src="https://ustatic.joymew.com/joymewApp/mp/phone.png"
              class="phoneIcon"
            >
          </div>
          <div class="des">
            电话
          </div>
        </div>
        <div
          class="barItem"
          @click="toSchedule"
        >
          <div class="bBox">
            <img
              src="https://ustatic.joymew.com/joymewApp/mp/schedules.png"
              class="scheduleIcon"
            >
          </div>
          <div class="des">
            查看档期
          </div>
        </div>
      </div>
      <div
        class="rightBar"
        @click="toComment"
      >
        <img
          src="https://ustatic.joymew.com/joymewApp/mp/cts.png"
          class="commentIcon"
        >
        评论
      </div>
    </div>
  </div>
  <auth-dialog-hlr
    :need-auth-avatar-name="needAuthAvatarName"
    @updated="updated"
  />
</template>

<script lang="ts" setup>
import { getComments, getCaseDetail, praise, unpraise, saveComment } from '@/api/hlr-api';
import { getLocalHlrData, setHlrData } from '@/utils/hlr';
import { showToast } from '@/utils/tools';
import useHlr from '@/stores/hlr-store';
import { back } from '@/utils/navigate';
import authDialogHlr from '../../components/authDialogHlr.vue';

let caseId = '';
const caseName = ref('');
const moreInformationJson = ref('');
const imageList = ref<any[]>([]);
const videoList = ref<any[]>([]);
const commentCt = ref('');
const commentList = ref<any[]>([]);
const likes = ref(0);
const isLike = ref(false);
const avator = ref('');
let userId = '';
let phone = '';
let name = '';
const shareType = ref('2');
const isFocus = ref(false);
let hlrUserType = '';
const hlrStore = useHlr();
const { hlrServiceData } = storeToRefs(hlrStore);
const { updateHlrNeedRefreshCaseList } = hlrStore;
const needAuthAvatarName = ref(false);
// 获取tabbar高度和安全区高度
const systemInfo = uni.getSystemInfoSync();
const safeAreaBottom = ref(systemInfo.screenHeight - (systemInfo?.safeArea?.height || 0));
console.log('safeAreaBottom', safeAreaBottom);

interface CaseDetailResult {
  code: number
  msg: string
  data: {
    case_cover: string
    case_cover_type: string
    case_id: string
    case_name: string
    case_picture_json: string
    case_style: string
    case_type: string
    case_video_json: string
    isLike: string
    likes: number
    more_information_json: string
    userId: string
  }
}

interface CommentsResult {
  code: number
  msg: string
  data: {
    list: any[]
    totalPage: number
    totalResult: number
  }
}

const initCaseDetail = () => {
  getCaseDetail(caseId)
    .then((res) => {
      console.log(res);
      const tmpRes = res as CaseDetailResult;
      caseName.value = tmpRes.data.case_name;
      moreInformationJson.value = tmpRes.data.more_information_json.replace(/\n/g, '<br/>');
      if (tmpRes.data.case_picture_json.length > 0) {
        imageList.value = JSON.parse(tmpRes.data.case_picture_json);
      }
      if (tmpRes.data.case_video_json.length > 0) {
        videoList.value = JSON.parse(tmpRes.data.case_video_json);
      }
      likes.value = tmpRes.data.likes;
      isLike.value = tmpRes.data.isLike === '1';
    })
    .catch((err) => {
      console.log(err);
    });
};

const initComments = () => {
  getComments(caseId).then((res) => {
    console.log(res);
    const tmpRes = res as CommentsResult;
    commentList.value = tmpRes.data.list;
  });
};

const initData = () => {
  initCaseDetail();
  initComments();
};

const handleBlur = () => {
  isFocus.value = false;
};

const toComment = () => {
  isFocus.value = true;
};

const sendComment = () => {
  if (!commentCt.value) {
    showToast('评论内容不能为空!');
    return;
  }

  saveComment(commentCt.value, caseId, hlrUserType)
    .then((res) => {
      console.log(res);
      showToast('评论成功!');
      commentCt.value = '';
      initComments();
    })
    .catch((err) => {
      console.log(err);
    });
};

const toggleLike = () => {
  if (isLike.value) {
    unpraise(caseId).then(() => {
      isLike.value = false;
      likes.value -= 1;
      showToast('取消点赞成功!');
      updateHlrNeedRefreshCaseList('1');
    });
  } else {
    praise(caseId, hlrUserType).then(() => {
      isLike.value = true;
      likes.value += 1;
      showToast('点赞成功!');
      updateHlrNeedRefreshCaseList('1');
    });
  }
};

const callPhone = () => {
  if (!phone) {
    showToast('没有电话!');
  } else {
    uni.makePhoneCall({
      phoneNumber: phone,
      success: () => {
        console.log('成功拨打电话');
      },
    });
  }
};

const toSchedule = () => {
  uni.navigateTo({ url: `/pages/hlr/schedules/checkSchedules/checkSchedules?name=${name}&userId=${userId}` });
};

const previewVideo = (videoPath: string) => {
  uni.navigateTo({ url: `/pages/hlr/videoPlay/videoPlay?videoPath=${videoPath}` });
};

const updated = () => {
  const cachedHlrData = getLocalHlrData();
  avator.value = cachedHlrData.hlrAvatar;
  initData();
};

onLoad((options) => {
  if (options?.caseId) {
    caseId = options.caseId;
  }
  if (options?.userId) {
    userId = options.userId;
    setHlrData({ hlrUserId: options.userId });
  }
  if (options?.phone) {
    phone = options.phone;
  }
  if (options?.name) {
    name = options.name;
  }
  const cachedHlrData = getLocalHlrData();
  if (cachedHlrData && cachedHlrData.hlrAvatar) {
    avator.value = cachedHlrData.hlrAvatar;
  }
  if (cachedHlrData && cachedHlrData.hlrShareType) {
    shareType.value = cachedHlrData.hlrShareType;
  }
  if (cachedHlrData && cachedHlrData.hlrUserType) {
    hlrUserType = cachedHlrData.hlrUserType;
  }
  if (cachedHlrData && cachedHlrData.hlrToken) {
    initData();
  } else {
    // 监听hlrServiceData.hlrToken
    watch(
      () => hlrServiceData.hlrToken,
      (newValue) => {
        console.log('监听hlrServiceData.hlrToken', newValue);
        if (!newValue.value.hlrAvatar || !newValue.value.hlrName) {
          needAuthAvatarName.value = true;
        } else {
          initData();
        }
      },
      { deep: true },
    );
  }
});
</script>

<style scoped>
.content {
  padding-bottom: 200rpx;
}

.content .title {
  font-size: 44rpx;
  font-weight: 600;
  color: #010101;
  line-height: 72rpx;
  padding: 0 40rpx;
}

.content .gapLine {
  width: 80rpx;
  height: 10rpx;
  background: #010101;
  margin-top: 44rpx;
  margin-bottom: 40rpx;
  margin-left: 40rpx;
}

.content .description {
  color: #010101;
  font-size: 28rpx;
  font-weight: 400;
  line-height: 45rpx;
  margin-bottom: 20rpx;
  padding: 0 40rpx;
  position: relative;
  z-index: 1;
  background-color: #ffffff;
}

.content .previewArea {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 40rpx;
  position: relative;
  z-index: 1;
  background-color: #ffffff;
}

.content .previewArea .previewImg {
  width: 668rpx;
  margin-bottom: 20rpx;
}
.content .previewArea .previewVideo {
  margin-bottom: 20rpx;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}
.previewVideo .shade {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
}
.previewVideo .playIcon {
  width: 200rpx;
  height: 200rpx;
  position: absolute;
}
.content .commentTit {
  padding-top: 76rpx;
  font-size: 32rpx;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #010101;
  line-height: 72rpx;
  padding: 0 40rpx;
  position: relative;
  z-index: 1;
  background-color: #ffffff;
}

.content .commentTit .num {
  color: #848a9a;
  font-size: 24rpx;
}

.content .commentIpt {
  display: flex;
  position: relative;
  z-index: 1;
  background-color: #ffffff;
  padding: 0 40rpx;
  margin-top: 40rpx;
}

.content .commentIpt .avator {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
}

.content .commentIpt .ipt {
  margin-left: 20rpx;
  width: 400rpx;
  height: 64rpx;
  background: #e5e9f0;
  border-radius: 52rpx;
  padding: 0 20rpx;
}

.content .commentIpt .sendBtn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 140rpx;
  height: 64rpx;
  border-radius: 52rpx;
  font-size: 28rpx;
  color: #ffffff;
  background-color: #010101;
  margin-left: 20rpx;
}

.content .noCommentsBlock {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 70rpx;
  padding-bottom: 180rpx;
}

.content .noCommentsBlock .tip {
  margin-top: 75rpx;
  font-size: 28rpx;
  font-weight: 400;
  color: #868c9b;
  line-height: 28rpx;
}

.content .noCommentsBlock .emptyComment {
  width: 264rpx;
  height: 187rpx;
}

.content .commentsBlock {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 40rpx;
  padding-bottom: 120rpx;
}

.content .commentsBlock .commentsItem {
  width: 682rpx;
  border-bottom: 2rpx solid rgba(204, 204, 204, 0.4);
  margin-bottom: 40rpx;
  padding-bottom: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.content .commentsBlock .commentsItem .avator {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
}

.content .commentsBlock .commentsItem .rTop {
  width: 584rpx;
  display: flex;
  justify-content: space-between;
  font-size: 24rpx;
  font-weight: 400;
  color: #848a9a;
  margin-bottom: 5rpx;
}

.content .commentsBlock .commentsItem .rTop .name {
  width: 300rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.content .commentsBlock .commentsItem .rBottom {
  width: 584rpx;
  font-size: 28rpx;
  font-weight: 400;
  color: #010101;
  line-height: 32rpx;
}

.content .commentBar {
  display: flex;
  position: fixed;
  bottom: 0rpx;
  left: 0;
  width: 750rpx;
  height: 98rpx;
  background: #ffffff;
  box-shadow: 0rpx -2rpx 2rpx 0rpx rgba(195, 201, 218, 0.25);
  z-index: 1;
  box-sizing: content-box;
}

.content .commentBar .leftBar {
  flex: 1;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.content .commentBar .leftBar .barItem {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.content .commentBar .leftBar .barItem .bBox {
  width: 58rpx;
  height: 58rpx;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: 0rpx 8rpx 18rpx 0rpx rgba(145, 167, 184, 0.21);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.content .commentBar .leftBar .barItem .bBox .loveIcon {
  width: 24rpx;
  height: 24rpx;
}

.content .commentBar .leftBar .barItem .bBox .phoneIcon {
  width: 24rpx;
  height: 24rpx;
}

.content .commentBar .leftBar .barItem .bBox .scheduleIcon {
  width: 26rpx;
  height: 24rpx;
}

.content .commentBar .leftBar .barItem .des {
  font-size: 20rpx;
  color: #656972;
  margin-top: 10rpx;
}

.content .commentBar .rightBar {
  width: 210rpx;
  background-color: #010101;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  font-size: 28rpx;
}

.content .commentBar .rightBar .commentIcon {
  margin-right: 12rpx;
  width: 32rpx;
  height: 32rpx;
}
</style>
