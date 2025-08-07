<template>
  <div class="commentsContent">
    <div
      v-if="commentsLen === 0"
      class="noCommentsBlock"
    >
      <image
        src="https://ustatic.joymew.com/joymewApp/home/emptyComment.png"
        class="emptyComment"
      />
      <div class="tip">
        暂无评价
      </div>
    </div>
    <div
      v-if="commentsLen > 0"
      class="commentsBlock"
    >
      <div class="commentsNav">
        <div class="title">
          评价 <text class="numStastic">
            ({{ commentsLen }})
          </text>
        </div>
        <div
          class="more"
          @click="toMore"
        >
          MORE <image
            src="https://static.joymew.com/joymewApp/mp/rightArrow.png"
            class="arrowIcon"
          />
        </div>
      </div>
      <div
        v-for="item in commentList"
        :key="item.album_comment_id"
        class="commentsItem"
      >
        <div class="top">
          <div class="left">
            <image
              :src="item.avatar"
              class="avator"
            />
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
  </div>
</template>

<script setup lang="ts">
import rateStar from '../../../components/rateStar.vue'

const props = defineProps({
  commentList: {
    type: Array,
    default: [],
  },
  commentsLen: {
    type: Number,
    default: 0,
  },
  name: {
    type: String,
    default: '',
  },
  userId: {
    type: String,
    default: '',
  },
})

const rateVal = ref(4)

const toMore = () => {
  uni.navigateTo({ url: `/pages/hlr/comments/comments?userId=${props.userId}&name=${props.name}` })
}
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

.commentsBlock .commentsNav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 682rpx;
}

.commentsBlock .commentsNav .title {
  font-size: 28rpx;
  font-weight: 600;
  color: #010101;
  line-height: 72rpx;
}

.commentsBlock .commentsNav .title .numStastic {
  color: #848a9a;
  font-size: 24rpx;
  font-weight: 400;
  margin-left: 10rpx;
}

.commentsBlock .commentsNav .more {
  display: flex;
  align-items: center;
  font-size: 28rpx;
  font-weight: 400;
  color: #010101;
  line-height: 72rpx;
}

.commentsBlock .commentsNav .more .arrowIcon {
  margin-left: 10rpx;
  width: 26rpx;
  height: 32rpx;
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

.commentsBlock .commentsItem .left {
  display: flex;
  align-items: center;
}

.commentsBlock .commentsItem .left .avator {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
}

.commentsBlock .commentsItem .left .ct {
  margin-left: 20rpx;
}

.commentsBlock .commentsItem .left .ct .name {
  width: 300rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 24rpx;
  font-weight: 400;
  color: #848a9a;
  line-height: 24rpx;
}

.commentsBlock .commentsItem .left .ct .rateWrap {
  margin-top: 10rpx;
  display: flex;
}

.commentsBlock .commentsItem .right {
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
</style>
