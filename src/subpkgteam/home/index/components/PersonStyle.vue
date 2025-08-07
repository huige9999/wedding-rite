<template>
  <div class="person-style_container">
    <div class="title" @click="toPersonStyleMore">
      个人风采
      <uni-icons type="right" size="21" color="#FFFFFF"></uni-icons>
    </div>
    <div class="list">
      <div class="list-item" v-for="item in personStyleList" :key="item.userId">
        <div class="cover">
          <image
            class="cover-img"
            :src="item.personalInfo.carouseList[0].src"
          />
        </div>
        <div class="bottom">
          <div class="nickname">{{ item.user_qm_name }}</div>
          <span class="CustomFont more-icon">&#xe600;</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reqGetPersonalStyle } from '@/api/team-api';

type TPersonStyleListItem = {
  userId: string,
  user_qm_name: string,
  personalInfo: {
    carouseList: Array<{
      src: string,
      mediaType: string,
    }>
  }
}

const personStyleList = ref<Array<TPersonStyleListItem>>([])

/**
 * 跳转到个人风采更多页
 */
 const toPersonStyleMore = () => {
  uni.navigateTo({
    url: '/subpkgteam/teamManage/personStyle/index'
  })
}


/**
 * 请求个人风采数据
 */
const getPersonalStyle = async () => {
   const res = await reqGetPersonalStyle();
   console.log('个人风采数据>>>', res.data);
   personStyleList.value = res.data.data.list.map((item:any) => ({
    userId: item.userId,
    user_qm_name: item.user_qm_name,
    personalInfo: {
       carouseList: item.personalInfo.carouseList.map((carouse:any) => ({
        src: carouse.src,
        mediaType: carouse.mediaType,
       }))
    }
   })).slice(0, 2);
}
getPersonalStyle();
</script>

<style scoped lang="scss">
.person-style_container {
  margin-bottom: 15rpx;
  padding: 45rpx 31rpx 150rpx 31rpx;
  .title {
    display: flex;
    align-items: center;
    font-size: 40rpx;
    font-weight: 500;
    color: #ffffff;
    margin-right: 8rpx;
    margin-bottom: 38rpx;
  }
  .list {
    display: grid;
    justify-content: center;
    grid-template-columns: repeat(2, min-content);
    column-gap: 25rpx;
    row-gap: 30rpx;
    .list-item {
      width: 331rpx;
      .cover {
        height: 438rpx;
        .cover-img {
          width: 100%;
          height: 100%;
        }
      }
      .bottom {
        display: flex;
        justify-content: space-between;
        color: #ffffff;
        margin-top: 30rpx;
        .nickname {
          width: 180rpx;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          font-size: 27rpx;
          font-weight: 500;
        }
        .more-icon {
          font-size: 25rpx;
        }
      }
    }
  }
}
</style>
