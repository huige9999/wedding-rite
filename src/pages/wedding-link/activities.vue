<!--
  * 动态页面
  * @author: Ruan Jiazhen
  * @date: 2024-04-28  17:14:28
-->
<template>
  <div class="container">
    <uni-nav-bar
      class="nav-bar"
      title="我的动态"
      :status-bar="true"
      :border="false"
    />
    <!-- 没有动态时的提示 -->
    <div
      v-if="activityList.length === 0"
      class="no-activity-tip"
    >
      <image
        src="@/static/images/schedules/no-activity.svg"
        class="no-activity-img"
        mode="aspectFill"
      />
      <div
        class="no-activity-text"
        @click="plusBtnClick"
      >
        暂无动态，点击添加动态
      </div>
    </div>
    <!-- 有动态时出现的动态列表 -->
    <div
      v-else
      class="activities-list"
    >
      <div
        v-for="(activity, activityIndex) in activityList"
        :key="activity.id"
        class="activity"
        @click="navigateTo('activity-detail',{activityId:activity.id})"
      >
        <!-- 头像 -->
        <image
          class="avatar"
          :src="activity.avatar"
          mode="aspectFill"
        />
        <!-- 昵称 -->
        <div class="nickname">
          {{ activity.nickname }}
        </div>
        <!-- 更新时间 -->
        <div class="update-time">
          {{ getUpdateTime(activity.createTime) }}
        </div>
        <!-- 「...」按钮 -->
        <image
          class="more-btn"
          src="@/static/icons/common/more-black.svg"
          @click.stop="moreBtnClick(activity.id)"
        />
        <!-- 内容 -->
        <div class="content">
          <!-- 文字内容 -->
          <div
            class="content-text"
            :style="expandStatusList[activityIndex] ? {maxHeight: 'none'} : {}"
          >
            {{ activity.content }}
            <!-- 「...全文」按钮 -->
            <!-- 使用「??」以便在expandStatusList未正常生成时默认显示「全文」按钮 -->
            <div
              v-if="!(expandStatusList[activityIndex]??true)"
              class="all-text-btn"
              @click.stop="expandBtnClick(activityIndex)"
            >
              ...全文
            </div>
            <!-- 用于计算文字内容是否超过设定范围的区块 -->
            <div
              id="content-text-hidden"
              ref="contentText"
              class="content-text-hidden"
            >
              {{ activity.content }}
            </div>
          </div>
          <!-- 媒体内容 -->
          <div class="media">
            <!-- 视频媒体项 -->
            <div
              v-for="videoIndex in Math.min(3,activity?.videoUrl?.length||0)"
              :key="videoIndex"
              class="media-item"
              @click.stop="videoClick(activity?.videoUrl?.[videoIndex-1]||'')"
            >
              <!-- 视频缩略图 -->
              <image
                class="video-thumbnail"
                :src="activity?.videoUrl?.[videoIndex-1]+'?vframe/jpg/offset/0'||''"
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
              v-for="imageIndex in Math.min(3,activity?.imgUrl?.length||0)"
              :key="imageIndex"
              class="media-item"
              :src="activity?.imgUrl?.[imageIndex-1]||''"
              mode="aspectFill"
              @click.stop="imageClick(activity.id, imageIndex-1)"
            />
          </div>
        </div>
        <!-- 「分享」按钮 -->
        <div
          class="share-btn"
          @click.stop
        >
          <!-- 隐藏的分享按钮 -->
          <button
            class="share-btn-hidden"
            :data-work-id="activity.id"
            :data-work-cover="activity.coverUrl
              || activity.imgUrl?.[0]
              ||( activity.videoUrl?.[0] + '?vframe/jpg/offset/0')"
            open-type="share"
          />
          <image
            class="icon"
            src="@/static/icons/common/arrow-up-right-gray.svg"
          />
          <div class="text">
            分享
          </div>
        </div>
        <!-- 喜欢按钮 -->
        <div
          class="like-btn"
          @click.stop="likeBtnClick(activity.id)"
        >
          <image
            v-if="activity.isLike"
            class="icon"
            src="@/static/icons/common/heart-red.svg"
          />
          <image
            v-else
            class="icon"
            src="@/static/icons/common/heart.svg"
          />
          <div class="text">
            {{ activity.likeCount }}
          </div>
        </div>
        <!-- 评论按钮 -->
        <div
          class="comment-btn"
          @click.stop="commentClick(activity.id)"
        >
          <image
            class="icon"
            src="@/static/icons/common/dialogue-bubble.svg"
          />
          <div class="text">
            评论
          </div>
        </div>
        <!-- 评论列表 -->
        <div class="comment-list">
          <!-- 单条评论内容 -->
          <div
            v-for="comment in activity.commentList"
            :key="comment.id"
            class="comment"
          >
            <!-- 头像 -->
            <image
              class="avatar"
              :src="comment.avatar"
            />
            <!-- 昵称 -->
            <span class="nickname">{{ comment.nickname }}：</span>
            <!-- 评论内容 -->
            <div class="content">
              {{ comment.content }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 添加作品按钮 -->
  <image
    class="add-activity-btn"
    src="@/static/icons/works/circle-plus-yellow.svg"
    @click="plusBtnClick"
  />
  <CustomTabBar />

  <!-- 编辑作品弹窗 -->
  <EditActivityPopup
    ref="editActivityPopup"
    :activity-id="currentEditActivityId"
    @delete="deleteBtnClick"
    @edit="editBtnClick"
  />
  <!-- 评论输入框 -->
  <KeyboardFollowInput
    :is-show="showCommentInput"
    @click-send-btn="sendClick"
    @blur="commentInputBlur"
  />
  <!-- 视频播放器 -->
  <video
    v-show="videoSrc"
    id="videoPlayer"
    class="video-player"
    :src="videoSrc"
    :show-fullscreen-btn="false"
    @fullscreenchange="onVideoFullscreenChange"
  />
</template>

<script lang="ts" setup>
import { reqCancelLikeActivity, reqCommentActivity, reqDeleteActivity, reqLikeActivity } from '@/api/activity-api';
import CustomTabBar from '@/components/CustomTabBar.vue';
import KeyboardFollowInput from '@/components/KeyboardFollowInput.vue';
import EditActivityPopup from '@/components/wedding-link/editActivityPopup.vue';
import useActivity from '@/stores/activity-store';
import useUser from '@/stores/user-store';
import { navigateTo } from '@/utils/navigate';
import { showToast } from '@/utils/tools';
import { uniChooseMedia } from '@/utils/uniapp-api-promised';
import type { VideoOnFullscreenchangeEvent } from '@uni-helper/uni-app-types';

const activityStore = useActivity();
const { activityList } = storeToRefs(activityStore);
const { getActivityList, appendActivityList } = activityStore;

const userStore = useUser();
const { userInfo } = storeToRefs(userStore);

const ctx = getCurrentInstance();

onLoad(() => {
  if (activityList.value.length === 0) {
    getActivityList();
  }
});

/**
 * 根据发布时间和创建时间，返回要显示的文本
 * @param {string} create 发布时间
 */
const getUpdateTime = (create: string) => {
  const now = new Date();
  const createTime = new Date(create);
  const diff = now.getTime() - createTime.getTime();
  const diffDay = Math.floor(diff / (24 * 3600 * 1000));
  const diffHour = Math.floor(diff / (3600 * 1000));
  const diffMinute = Math.floor(diff / (60 * 1000));
  const diffSecond = Math.floor(diff / 1000);

  if (diffDay > 0) {
    return `${diffDay}天前更新`;
  } if (diffHour > 0) {
    return `${diffHour}小时前更新`;
  } if (diffMinute > 0) {
    return `${diffMinute}分钟前更新`;
  } if (diffSecond > 0) {
    return `${diffSecond}秒前更新`;
  }
  return '刚刚更新';
};

/**
 * 点击「+」按钮事件
 */
const plusBtnClick = () => {
  uni.showActionSheet({
    itemList: ['照片', '视频'],
    success: async (res) => {
      let activityType: 'image' | 'video' | 'mix' = 'mix';
      if (res.tapIndex === 0) {
        activityType = 'image';
      } else if (res.tapIndex === 1) {
        activityType = 'video';
      }

      // 选择图片/视频，并且在选择后跳转到「发送动态」页面
      try {
        const chooseMediaRes = await uniChooseMedia({
          count: 9,
          mediaType: [activityType],
        });
        if (chooseMediaRes?.tempFiles?.length
              && (chooseMediaRes?.tempFiles?.length > 0)) {
          uni.showLoading();
          navigateTo('send-activity', {
            type: activityType,
            tempFiles: JSON.stringify(chooseMediaRes.tempFiles),
          });
          uni.hideLoading();
        }
      } catch (e) { console.error(e); }
    },
  });
};

onReachBottom(() => {
  appendActivityList();
});

// #region 分享相关

onLoad(() => {
  // 关闭菜单中的分享按钮
  uni.hideShareMenu({ hideShareItems: [] });
});
// 分享回调
onShareAppMessage((options) => {
  console.log('onShareAppMessage', options);
  const shareData = {
    title: '我的动态已更新，快来查看吧',
    path: `/subpkg/wedding-link/activity-detail-share?userId=${userInfo.value.id}&activityId=${options.target.dataset.workId}&inviterId=${userInfo.value.id}`,
    imageUrl: options.target.dataset.workCover,
  };
  return shareData;
});

// #endregion

// #region 点击图片/视频预览相关

/**
 * 点击图片事件
 * @param {string} activityId 作品id
 * @param {number} imgIndex 图片索引
 */
const imageClick = (activityId: string, imgIndex:number) => {
  const activity = activityList.value.find((item) => item.id === activityId);
  if (activity) {
    const urls = activity.imgUrl || [];
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
 * @param videoUrl 视频地址
 */
const videoClick = (videoUrl:string) => {
  if (videoUrl) {
    videoSrc.value = videoUrl;
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

// #region 编辑作品弹窗相关

/** 当前编辑的作品的id */
const currentEditActivityId = ref('');

/**
 * 「...」按钮点击事件
 * @param {string} activityId 作品id
 */
const moreBtnClick = (activityId: string) => {
  currentEditActivityId.value = activityId;

  const editActivityPopup = ctx?.refs.editActivityPopup as InstanceType<typeof EditActivityPopup>;
  if (editActivityPopup.open) {
    editActivityPopup.open();
  }
};

/**
 * 弹窗菜单点击删除事件
 * @param {string} activityId 作品id
 */
const deleteBtnClick = (activityId: string) => {
  uni.showModal({
    content: '确定要删除该动态吗？',
    success: async (res) => {
      if (res.confirm) {
        const deleteRes = await reqDeleteActivity(activityId);
        if (deleteRes) {
          showToast('删除成功');
          getActivityList();
        }
      }
    },
  });
};

/**
 * 弹窗菜单点击编辑事件
 * @param {string} activityId 作品id
 */
const editBtnClick = (activityId: string) => {
  navigateTo('edit-activity', { activityId });
};

// #endregion

// #region 点赞功能相关

/**
 * 点赞按钮点击事件
 * @param {string} activityId 作品id
 */
const likeBtnClick = async (activityId: string) => {
  const activity = activityList.value.find((item) => item.id === activityId);
  if (activity) {
    const isLike = !activity.isLike;
    activity.isLike = isLike;
    activity.likeCount += isLike ? 1 : -1;
  }

  // 根据点赞状态，发送请求
  if (activity?.isLike) {
    reqLikeActivity(activityId, userInfo.value.type);
  } else {
    reqCancelLikeActivity(activityId);
  }
};

// #endregion

// #region 评论相关

/** 是否显示评论输入框 */
const showCommentInput = ref(false);

/** 当前要评论的动态的id */
const commentActivityId = ref('');

/**
 * 点击评论按钮事件
 * @param {string} activityId 动态id
 */
const commentClick = (activityId:string) => {
  showCommentInput.value = true;
  commentActivityId.value = activityId;
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
      await reqCommentActivity(commentActivityId.value, comment, userInfo.value.type)
    )?.data as ResData<AnyObject>;
    if (resData.code !== 200) {
      showToast('评论失败，请稍后重试');
    }
  } catch (e) {
    console.error(e);
  }

  getActivityList();
  showToast('评论成功');
};
// #endregion

// #region 展开全文相关

/** 各个动态展开状态列表，true代表已展开全文，false代表未展开 */
const expandStatusList = ref<boolean[]>([]);

/** 文字内容高度上限，单位px */
const TEXT_HEIGHT_LIMIT = 60;

// 页面加载时，初始化展开状态列表
onMounted(() => {
  nextTick(() => {
    const selectorQuery = uni.createSelectorQuery().in(ctx);
    selectorQuery.selectAll('.content-text-hidden').boundingClientRect((res) => {
      console.log('res', res);
      (res as UniApp.NodeInfo[]).forEach((item) => {
        expandStatusList.value.push((item?.height || 0) <= TEXT_HEIGHT_LIMIT);
      });
      console.log('expandStatusList', expandStatusList.value);
    }).exec();
  });
});

/**
 * 展开全文按钮点击事件
 * @param {number} index 动态在列表中的索引
 */
const expandBtnClick = (index: number) => {
  expandStatusList.value[index] = true;
};

// #endregion

</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;

  display: grid;
  grid-template:
    'nav-bar' auto
    'main' 1fr;

  .nav-bar {
    grid-area: nav-bar;
  }

  .no-activity-tip {
    grid-area: main;

    padding-top: 146px;
    padding-bottom: 24vw;
    display: flex;
    flex-direction: column;
    align-items: center;

    .no-activity-img {
      width: 58.6667vw;
      height: 37.8667vw;
    }

    .no-activity-text {
      margin-top: 126px;

      font-size: 3.7333vw;
      line-height: 3.7333vw;
      color: #868c9b;
    }
  }

  // 动态列表
  .activities-list {
    grid-area: main;

    padding-bottom: 70px;
    display: flex;
    flex-direction: column;

    .activity {
      width: 100%;

      padding: 12px;
      display: grid;
      grid-template:
        'avatar nickname nickname nickname more-btn' 4.6154vw
        'avatar update-time update-time update-time more-btn' 4.6154vw
        '. . . . .' 16px
        '. content content content content' auto
        '. . . . .' 16px
        '. share-btn .  like-btn comment-btn ' 4.6154vw
        '. . . . .' 16px
        '. comment-list comment-list comment-list comment-list' auto
        / 9.2308vw auto 1fr auto auto;
      column-gap: 8px;
      align-items: center;

      // 头像
      .avatar {
        grid-area: avatar;

        width: 9.2308vw;
        height: 9.2308vw;

        border-radius: 50%;
      }

      // 昵称
      .nickname {
        grid-area: nickname;

        font-size: 3.7333vw;
        font-weight: 400;
        color: #000;
      }

      // 更新时间
      .update-time {
        grid-area: update-time;

        font-size: 3.3333vw;
        color: #8d8d8d;
      }

      // 「...」按钮
      .more-btn {
        grid-area: more-btn;
        justify-self: end;

        width: 4.6154vw;
        height: 4.6154vw;
      }

      // 内容
      .content {
        grid-area: content;

        display: flex;
        flex-direction: column;
        row-gap: 8px;

        // 文字内容
        .content-text {
          position: relative;

          max-height: 60px;
          overflow: hidden;

          font-size: 15px;
          line-height: 20px;

          // 文字两端对齐
          text-align: justify;
          text-overflow: ellipsis;

          // 「...全文」按钮
          .all-text-btn {
            position: absolute;
            right: 0;
            bottom: 0;

            width: 20vw;

            background: linear-gradient(to right, rgb(255 255 255 / 0%), #fff 40%);

            color: #438eff;
            text-align: end
          }

          // 用于计算文字内容高度的元素
          .content-text-hidden {
            position: absolute;
            top: 0;
            left: 0;

            width: 100%;

            visibility: hidden;

            font-size: 15px;
            line-height: 20px;
          }
        }

        // 图片和视频内容
        .media {
          height: 26.6667vw;

          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-gap: 6px;

          .media-item {
            position: relative;

            width: 100%;
            height: 100%;
            overflow: hidden;

            border-radius: 5px;

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
      }

      // 「分享」按钮
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
      }

      // 「喜欢」按钮
      .like-btn {
        grid-area: like-btn;
      }

      // 「评论」按钮
      .comment-btn {
        grid-area: comment-btn;
      }

      // 「分享」按钮、「喜欢」按钮、「评论」按钮
      .share-btn,
      .like-btn,
      .comment-btn {
        display: flex;
        column-gap: 4px;
        align-items: center;

        .icon {
          width: 3.5897vw;
          height: 3.5897vw;
        }

        .text {
          font-size: 3.3333vw;
          color: #8d8d8d;
        }
      }

      // 评论列表
      .comment-list{
        grid-area: comment-list;

        padding: 0 12px 0 0;
        display: grid;
        grid-template-columns: 1fr;
        row-gap: 5px;

        // 单条评论内容
        .comment{
          display: grid;
          grid-template:
            'avatar . nickname . content' auto
            /7.1795vw 8px auto 4px 1fr;
          align-items: start;

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

          .content {
            grid-area: content;

            font-size: 15px;
            color: #8d8d8d;
          }
        }
      }
    }
  }
}

// 添加动态按钮
.add-activity-btn {
  position: fixed;
  right: 20px;
  bottom: 40px + $tabBarHeight;

  width: 12.3077vw;
  height: 12.3077vw;
}
</style>
