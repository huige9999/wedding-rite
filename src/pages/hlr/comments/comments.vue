<template>
  <div class="“content”">
    <uni-nav-bar
      :title="navBarTitle"
      status-bar
      :border="false"
      left-icon="left"
      fixed
      @click-left="back"
    />
    <div
      v-if="commentsLen === 0"
      class="noCommentsBlock"
    >
      <img
        src="https://ustatic.joymew.com/joymewApp/home/emptyComment.png"
        class="emptyComment"
      >
      <div class="tip">
        暂无评价
      </div>
    </div>
    <div
      v-if="commentsLen > 0"
      class="commentsBlock"
    >
      <div class="commentsLabelsWrap">
        <div
          class="comments"
          :class="{ active: isLabelMore, type1: labelList.length <= 4 }"
        >
          <div
            v-for="item in labelList"
            :key="item.id"
            class="ctsItem"
          >
            {{ item.bg_name }}{{ item.size }}
          </div>
        </div>
        <image
          src="https://ustatic.joymew.com/joymewApp/home/dArrow.png"
          class="dArrow"
          :class="{ active: isLabelMore }"
          @click="toggleLableMore"
        />
      </div>
      <div
        v-for="item in commentList"
        :key="item.album_comment_id"
        class="commentsItem"
      >
        <div class="top">
          <div class="left">
            <img
              :src="item.avatar"
              class="avator"
            >
            <div class="ct">
              <div class="name">
                {{ item.nickname }}
              </div>
              <div class="rateWrap">
                <rateStar
                  :rate="item.satisfaction"
                  size="5"
                />
              </div>
            </div>
          </div>
          <div class="right">
            {{ item.comment_time }}
          </div>
        </div>
        <div class="bottom">
          {{ item.content }}
        </div>
      </div>
    </div>
    <div
      v-if="showLoadMore"
      class="loadMore"
    >
      {{ loadMoreText }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { getUserComments } from '@/api/hlr-api';
import { back } from '@/utils/navigate';
import rateStar from '../components/rateStar.vue';

interface UserCommentsResult {
  code: number
  msg: string
  data: {
    labelInfo: {
      labelList: any[]
    }
    list: any[]
    totalPage: number
    totalResult: number
  }
}

const name = ref('');
let userId = '';
const navBarTitle = ref('');
const commentList = ref<any[]>([]);
const labelList = ref<any[]>([]);
let currentPage = 1;
const showCount = 10;
let totalPage = 1;
const showLoadMore = ref(false);
const commentsLen = ref(0);
const loadMoreText = ref('加载中...');
const isLabelMore = ref(false);

const getComments = () => {
  getUserComments(userId, currentPage, showCount)
    .then((res) => {
      const tmpRes = res as UserCommentsResult;
      const list = tmpRes.data.list || [];
      totalPage = tmpRes.data.totalPage || 1;
      commentsLen.value = tmpRes.data.totalPage;
      labelList.value = tmpRes.data.labelInfo.labelList;
      commentList.value = commentList.value.concat(list);
      showLoadMore.value = false;
      uni.stopPullDownRefresh();
    })
    .catch((err) => {
      console.log(err);
    });
};

const initComments = () => {
  commentList.value = [];
  currentPage = 1;
  totalPage = 1;
  getComments();
};

const toggleLableMore = () => {
  isLabelMore.value = !isLabelMore.value;
};
onLoad((options) => {
  if (options?.name) {
    name.value = options.name;
    navBarTitle.value = `${name.value}的评价`;
  }
  if (options?.userId) {
    userId = options.userId;
  }
  initComments();
});

onPullDownRefresh(() => {
  console.log('onPullDownRefresh');
  initComments();
});

onReachBottom(() => {
  console.log('reach bottom');
  if (currentPage < totalPage) {
    currentPage += 1;
    setTimeout(() => {
      getComments();
    }, 300);
  } else {
    loadMoreText.value = '没有更多数据了!';
  }
  showLoadMore.value = true;
});
</script>

<style scoped>
.noCommentsBlock {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 70rpx;
  padding-bottom: 180rpx;
}

.noCommentsBlock .emptyComment {
  width: 440rpx;
  height: 284rpx;
}

.noCommentsBlock .tip {
  margin-top: 75rpx;
  font-size: 28rpx;
  font-weight: 400;
  color: #868c9b;
  line-height: 28rpx;
}

.commentsBlock {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 40rpx;
  padding-bottom: 40rpx;
}

.commentsBlock .commentsLabelsWrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 12rpx;
  border-bottom: 2rpx solid #c7ccdb;
  margin-bottom: 40rpx;
  width: 750rpx;
}

.commentsBlock .commentsLabelsWrap .comments {
  width: 668rpx;
  justify-content: center;
  margin-bottom: 28rpx;
  display: flex;
  flex-wrap: wrap;
  overflow: hidden;
  height: 50rpx;
}

.commentsBlock .commentsLabelsWrap .comments.type1 {
  height: auto;
}

.commentsBlock .commentsLabelsWrap .comments.active {
  height: auto;
}

.commentsBlock .commentsLabelsWrap .comments .ctsItem {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 180rpx;
  height: 50rpx;
  background: #e5e9f0;
  border-radius: 48rpx;
  margin: 0 16rpx;
  margin-bottom: 20rpx;
  font-size: 24rpx;
  font-weight: 500;
  color: #848a9a;
}

.commentsBlock .commentsLabelsWrap .dArrow {
  width: 32rpx;
  height: 26rpx;
}

.commentsBlock .commentsLabelsWrap .dArrow.active {
  transform: rotate(180deg);
}

.commentsBlock .commentsItem {
  width: 682rpx;
  border-bottom: 2rpx solid rgba(204, 204, 204, 0.4);
  margin-bottom: 40rpx;
  padding-bottom: 20rpx;
}

.commentsBlock .commentsItem .top {
  display: flex;
  justify-content: space-between;
}

.commentsBlock .commentsItem .top .left {
  display: flex;
  align-items: center;
}

.commentsBlock .commentsItem .top .left .avator {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
}

.commentsBlock .commentsItem .top .left .ct {
  margin-left: 20rpx;
}

.commentsBlock .commentsItem .top .left .ct .name {
  width: 300rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 24rpx;
  font-weight: 400;
  color: #848a9a;
  line-height: 24rpx;
}

.commentsBlock .commentsItem .top .left .ct .rateWrap {
  margin-top: 10rpx;
}

.commentsBlock .commentsItem .top .right {
  color: #848a9a;
  font-size: 24rpx;
  font-weight: 400;
}

.commentsBlock .commentsItem .bottom {
  margin-top: 32rpx;
  font-size: 28rpx;
  font-weight: 400;
  color: #010101;
  width: 680rpx;
  line-height: 42rpx;
}

.loadMore {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100rpx;
  color: #010101;
  font-size: 24rpx;
}
</style>
