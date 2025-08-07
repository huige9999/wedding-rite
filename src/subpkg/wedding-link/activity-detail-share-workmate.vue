<!-- 「动态详情-分享」页面 -->
<template>
  <div class="container">
    <uni-nav-bar
      class="nav-bar"
      left-icon="left"
      title="动态详情"
      status-bar
      :border="false"
      @click-left="back"
    />
    <!-- 主体部分 -->
    <div class="main">
      <!-- 动态内容 -->
      <div class="activity-content">
        <!-- 文字 -->
        <div class="activity-content-text">
          {{ activityInfo.content }}
        </div>
        <!-- 图片列表 -->
        <div class="activity-content-media-list">
          <!-- 视频缩略图 -->
          <div
            v-for="(video,index) in activityInfo.videoUrl"
            :key="index"
            class="media-item"
            @click="videoClick(index)"
          >
            <image
              class="video-thumbnail"
              :src="`${video}?vframe/jpg/offset/0`"
              mode="aspectFill"
            />
            <!-- 视频播放按钮 -->
            <image
              class="video-play-btn"
              src="@/static/icons/common/play-circle.svg"
              mode="aspectFill"
            />
          </div>
          <!-- 照片 -->
          <image
            v-for="(img,index) in activityInfo.imgUrl"
            :key="index"
            class="media-item"
            :src="img"
            mode="aspectFill"
            @click="imageClick(index)"
          />
        </div>
        <!-- 时间 -->
        <span class="activity-content-time">{{ parseTime(activityInfo.createTime) }}</span>
        <!-- 喜欢按钮 -->
        <div
          class="like-btn"
          @click="likeClick"
        >
          <!-- 未点赞时的普通心型图标 -->
          <image
            v-if="!activityInfo.isLike"
            class="icon"
            src="@/static/icons/common/heart.svg"
          />
          <!-- 点赞后的心型图标 -->
          <image
            v-else
            class="icon"
            src="@/static/icons/common/heart-red.svg"
          />
          <span class="text">{{ activityInfo.likeCount }}</span>
        </div>
        <!-- 评论按钮 -->
        <div
          class="comment-btn"
          @click.stop="commentClick"
        >
          <image
            class="icon"
            src="@/static/icons/common/dialogue-bubble.svg"
          />
          <span class="text">评论</span>
        </div>
      </div>
      <!-- 分隔线 -->
      <div class="hr" />
      <!-- 评论内容 -->
      <div class="comment-content">
        <!-- 标题 -->
        <span class="comment-content-title">最新热评（{{ commentList.length }}）</span>
        <!-- 评论列表 -->
        <div class="comment-content-list">
          <!-- 单条评论 -->
          <div
            v-for="comment in commentList"
            :key="comment.id"
            class="comment-item"
          >
            <!-- 头像 -->
            <image
              class="avatar"
              :src="comment.avatar"
              mode="aspectFill"
            />
            <!-- 昵称 -->
            <span class="nickname">{{ comment.nickname }}：</span>
            <!-- 评论文字 -->
            <span class="text">{{ comment.content }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- 评论输入框 -->
  <KeyboardFollowInput
    :is-show="showCommentInput"
    @click-send-btn="sendClick"
    @blur="commentInputBlur"
  />

  <video
    v-show="videoSrc"
    id="videoPlayer"
    class="video-player"
    :src="videoSrc"
    :show-fullscreen-btn="false"
    @fullscreenchange="onVideoFullscreenChange"
  />
  <!-- 授权昵称头像弹窗 -->
  <AvatarNicknameAuthPopup
    ref="AvatarNicknameAuthPopup"
    :avatar="tempUserInfo.avatar"
    :nickname="tempUserInfo.nickname"
    @confirm-click="onConfirmAuthAvatarNickname"
  />
</template>

<script lang="ts" setup>
import { reqCancelLikeActivity, reqCommentActivity, reqGetActivityCommentList, reqGetActivityDetail, reqLikeActivity } from '@/api/activity-api';
import { reqUploadAnyFile } from '@/api/others';
import KeyboardFollowInput from '@/components/KeyboardFollowInput.vue';
import AvatarNicknameAuthPopup from '@/components/wedding-link/avatarNicknameAuthPopup.vue';
import { useTempUser } from '@/stores/temp-user-store';
import { useViewedUser } from '@/stores/viewed-user-store';
import { back } from '@/utils/navigate';
import { parseActivityInfo, parseUploadFileUrl } from '@/utils/parse';
import { isFormalToken } from '@/utils/token';
import { showToast } from '@/utils/tools';
import type { VideoOnFullscreenchangeEvent } from '@uni-helper/uni-app-types';

const ctx = getCurrentInstance();

const tempUserStore = useTempUser();
const { tempUserInfo } = storeToRefs(tempUserStore);
const { editTemUserInfo, getTempUserInfo } = tempUserStore;

const viewedUserStore = useViewedUser();
const { userInfo } = storeToRefs(viewedUserStore);

// #region 页面数据获取和展示
/** 动态id */
let activityId = '';

/** 动态信息 */
const activityInfo = ref<ActivityInfo>({
  id: '',
  content: '',
  nickname: '',
  userId: '',
  avatar: '',
  coverUrl: '',
  title: '',
  videoUrl: [],
  imgUrl: [],
  likeCount: 0,
  isLike: false,
  createTime: '',
  commentCount: 0,
  commentList: [],
});

/** 评论信息 */
const commentList = ref<CommentInfo[]>([]);

/**
 * 返回最新的评论列表
 * @param resActivityId 动态id
 * @returns 最新的评论列表
 */
const getNewCommentList = async (resActivityId: string):Promise<CommentInfo[]> => {
  const commentResData = (await reqGetActivityCommentList(resActivityId))?.data as CommentRes;
  if (commentResData.code !== 200) {
    showToast('获取评论失败，请稍后重试');
    return [];
  }
  return commentResData.data.list.map((item) => ({
    id: item.comment_id.toString(),
    avatar: item.headimg_url,
    content: item.content,
    nickname: item.nickname,
    time: item.create_time,
  }));
};

// 页面加载时，获取动态id，并且根据id获取动态详情
onLoad(async (option) => {
  activityId = option?.activityId;
  const resData = (
    await reqGetActivityDetail(activityId)
  )?.data as ResData<ActivityResInfo>;
  console.log('resData', resData);
  if (resData.code !== 200) {
    showToast('获取动态失败，请稍后重试');
    return;
  }
  activityInfo.value = parseActivityInfo(resData);
  commentList.value = await getNewCommentList(activityId);
});

/**
 * 传入时间，返回发布时间文本，返回格式：今天XX:XX、昨天XX:XX、XX月XX日XX:XX
 * @param time 时间戳
 * @returns 发布时间文本
 */
const parseTime = (time: string) => {
  if (!time) { return ''; }
  const date = new Date(time);
  const now = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
  const minute = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();

  if (year === now.getFullYear() && month === now.getMonth() + 1 && day === now.getDate()) {
    return `今天${hour}:${minute}`;
  } if (year === now.getFullYear() && month === now.getMonth() + 1 && day === now.getDate() - 1) {
    return `昨天${hour}:${minute}`;
  }
  return `${month}月${day}日${hour}:${minute}`;
};
// #endregion
// #region 授权头像昵称相关

// 监听我的用户信息变化，如果没有头像或昵称，则弹出授权弹窗
// XXX 之所以不进行获取用户信息，然后判断是否有头像和昵称，是因为在App.vue中就已经请求了用户信息了，但是没有好的方法判断这个请求是否完成，所以只能在这里监听
watch(tempUserInfo, (newVal) => {
  console.log('myUserInfo watch', newVal);
  if (!newVal.nickname || !newVal.avatar) {
    const avatarNicknameAuthPopup = (
      ctx?.refs.AvatarNicknameAuthPopup as InstanceType<typeof AvatarNicknameAuthPopup>);
    avatarNicknameAuthPopup?.openTipPopup();
  }
});

// TODO 删除头像昵称后测试一下
/**
 * 确认授权头像昵称事件
 * @param {avatar, nickname} 授权头像昵称
 */
const onConfirmAuthAvatarNickname = async (e:{ avatar: string, nickname: string }) => {
  console.log('onConfirmAuthAvatarNickname', e);
  // 如果返回的头像昵称和原来的一样，则不用修改
  if ((e.avatar === tempUserInfo.value.avatar && e.nickname === tempUserInfo.value.nickname)) {
    return;
  }

  // 如果返回的头像和原来的不同，则判断是否是新的头像，如果是则上传头像
  const newUserInfo = {
    avatar: tempUserInfo.value.avatar,
    nickname: tempUserInfo.value.nickname,
  };
  // 如果添加了新的头像，则上传头像
  if (e.avatar !== tempUserInfo.value.avatar) {
    const uploadRes = await reqUploadAnyFile(e.avatar);
    const filePath = parseUploadFileUrl(uploadRes?.data);
    newUserInfo.avatar = filePath;
  }

  // 如果添加了新的昵称，则修改昵称
  if (e.nickname !== tempUserInfo.value.nickname) {
    newUserInfo.nickname = e.nickname;
  }
  const editResult = (await editTemUserInfo(newUserInfo));

  if (editResult) {
    await getTempUserInfo();
    console.log('new myUserInfo', tempUserInfo);
  }
};

// #endregion

// #region 分享相关
onShareAppMessage(() => ({
  title: '我的动态已更新，快来查看吧',
  path: `/subpkg/wedding-link/activity-detail-share?userId=${userInfo.value.id}&activityId=${activityInfo.value?.id}&inviter=${tempUserInfo.value.id}`,
  imageUrl: activityInfo.value?.coverUrl
  || activityInfo.value?.imgUrl?.[0]
  || `${activityInfo.value.videoUrl?.[0]}?vframe/jpg/offset/0`,
}));
// #endregion

// #region 图片/视频相关

/**
 * 点击图片事件
 * @param {number} imgIndex 图片索引
 */
const imageClick = (imgIndex:number) => {
  if (activityInfo) {
    const urls = activityInfo.value.imgUrl || [];
    uni.previewImage({
      urls,
      current: urls[imgIndex],
    });
  }
};

/** 要播放的视频地址 */
const videoSrc = ref('');

/**
 * 点击视频缩略图事件
 * @param {number} videoIndex 视频索引
 */
const videoClick = (videoIndex:number) => {
  if (activityInfo) {
    const urls = activityInfo.value.videoUrl || [];
    videoSrc.value = urls[videoIndex];
    const videoContext = uni.createVideoContext('videoPlayer', ctx);
    videoContext.requestFullScreen({ direction: 0 });
  }
};

/**
 * 视频全屏切换事件
 * @param e 事件
 */
const onVideoFullscreenChange = (e:VideoOnFullscreenchangeEvent) => {
  console.log('fullscreenchange', e.detail);
  // 如果是打开全屏，则进行播放
  if (e.detail.fullScreen) {
    const videoContext = uni.createVideoContext('videoPlayer', ctx);
    videoContext.play();
    return;
  }
  // 如果是退出全屏，则清空src
  videoSrc.value = '';
};

// #endregion
// #region 点赞相关

/**
 * 修改点赞状态
 * @param 点赞还是取消点赞
 * @returns boolean 是否修改成功
 */
const changeLikeStatus = async (isLike: boolean) => {
  if (isLike) {
    const resData = (
    // TODO 因为后端返回的user_type不对，所以暂时使用isFormalToken来判断
      await reqLikeActivity(activityId, isFormalToken() ? '1' : '3')
    )?.data as ResData<AnyObject>;
    if (resData.code !== 200) {
      console.error('点赞失败', resData.msg);
      return false;
    }
    return true;
  }

  const resData = (await reqCancelLikeActivity(activityId))?.data as ResData<AnyObject>;
  if (resData.code !== 200) {
    console.error('取消点赞失败', resData.msg);
    return false;
  }
  return true;
};

/** 点击点赞按钮事件 */
const likeClick = () => {
  activityInfo.value.isLike = !activityInfo.value.isLike;
  changeLikeStatus(activityInfo.value.isLike);
  if (activityInfo.value.isLike) {
    activityInfo.value.likeCount += 1;
  } else {
    activityInfo.value.likeCount -= 1;
  }
};

// #endregion

// #region 评论相关

/** 是否显示评论输入框 */
const showCommentInput = ref(false);

/** 点击评论按钮事件 */
const commentClick = () => {
  showCommentInput.value = true;
};

/** 评论输入框失去焦点事件 */
const commentInputBlur = () => {
  setTimeout(() => {
    showCommentInput.value = false;
  }, 100);
};

/** 点击「发送」 按钮 */
const sendClick = async (comment:string) => {
  if (comment.trim() === '') {
    showToast('请输入评论内容');
    return;
  }
  try {
    const resData = (
    // TODO 因为后端返回的user_type不对，所以暂时使用isFormalToken来判断
      await reqCommentActivity(activityId, comment, isFormalToken() ? '1' : '3')
    )?.data as ResData<AnyObject>;
    if (resData.code !== 200) {
      showToast('评论失败，请稍后重试');
    }
  } catch (e) {
    console.error(e);
  }

  commentList.value = await getNewCommentList(activityId);
  showToast('评论成功');
};
// #endregion
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

    padding: 12px;
    display: grid;
    grid-template:
      'activity-content' max-content
      'hr' 6px
      'comment-content' auto;

    .activity-content {
      grid-area: activity-content;

      padding-bottom: 20px;
      display: grid;
      grid-template:
        'text text text text' auto
        'img-list img-list img-list img-list' min-content
        'time share-btn like-btn comment-btn' 4.6154vw
        /3fr 1fr 1fr 1fr;
      row-gap: 12px;

      .activity-content-text {
        grid-area: text;

        color: #333;
      }

      .activity-content-media-list {
        grid-area: img-list;

        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-gap: 10px;
        align-items: center;
        justify-items: center;

        .media-item {
          position: relative;

          width: 29.4872vw;
          height: 29.4872vw;
          overflow: hidden;

          border-radius: 8px;

          // 视频缩略图
          .video-thumbnail{
            width: 100%;
            height: 100%;
          }

          // 视频播放按钮
          .video-play-btn {
            position: absolute;
            top: 50%;
            left: 50%;

            width: 10.2564vw;
            height: 10.2564vw;

            transform: translate(-50%, -50%);
          }
        }
      }

      .activity-content-time {
        grid-area: time;

        font-size: 12px;
        color: #999;
      }

      .share-btn,
      .like-btn,
      .comment-btn {
        display: flex;
        align-items: center;

        .icon {
          margin-right: 4px;

          width: 3.5897vw;
          height: 3.5897vw;
        }

        .text {
          font-size: 12px;
          color: #999;
        }
      }

      .share-btn {
        grid-area: share-btn;

        position: relative;

        .share-btn-hidden{
          position: absolute;
          top: 0;
          left: 0;

          width: 100%;
          height: 100%;

          opacity: 0;
        }

        .icon {
          width: 11px;
          height: 11px;
        }
      }

      .like-btn {
        grid-area: like-btn;
      }

      .comment-btn {
        grid-area: comment-btn;
      }
    }

    .hr {
      grid-area: hr;
      align-self: center;
      justify-self: center;

      width: 100%;
      height: 100%;

      background-color: #F9F9F9;
    }

    .comment-content {
      grid-area: comment-content;

      padding: 16px 0;
      display: flex;
      flex-direction: column;
      row-gap: 16px;

      .comment-content-title {
        margin-bottom: 8px;

        font-size: 14px;
        color: #333;
      }

      .comment-content-list {
        display: flex;
        flex-direction: column;
        row-gap: 8px;

        .comment-item {
          display: grid;
          grid-template:
            'avatar . nickname . text' auto
            /7.1795vw 8px auto 4px 1fr;

          .avatar {
            grid-area: avatar;

            width: 7.1795vw;
            height: 7.1795vw;

            border-radius: 50%;

            transform: translateY(-5px);
          }

          .nickname {
            grid-area: nickname;

            font-size: 15px;
            color: #333;
          }

          .text {
            grid-area: text;

            font-size: 15px;
            color: #8d8d8d;
          }
        }
      }
    }
  }
}

// 评论输入框
.comment-input{
  position: fixed;
  bottom: 0;
  left: 0;

  width: 100vw;
  height: 50px;

  background-color: #fff;

  padding: 0 12px;
  display: flex;
  align-items: center;

  .input {
    height: 100%;

    border: none;
    outline: none;
    flex: 1;

    font-size: 14px;
    color: #333;
  }

  .send-btn {
    width: 50px;
    height: 100%;

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 14px;
    color: #999;

    // 激活状态
    &.active {
      color: #fca800;
    }
  }
}

// 视频播放器
.video-player{
  position: absolute;
  top: 0;
  left: 0;

  transform: translateY(-100%);
}
</style>
