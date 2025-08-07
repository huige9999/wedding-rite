<template>
  <div class="container">
    <uni-nav-bar
      class="nav-bar"
      left-icon="left"
      status-bar
      title="个人风采"
      :border="false"
      background-color="#ffffff"
      @click-left="back"
    />
    <div class="content-list">
      <div class="list-item" v-for="item in personStyleList" :key="item.userId">
        <div class="cover">
          <image
            class="cover-img"
            :src="item.personalInfo.carouseList[0].src"
            mode="aspectFill"
          />
        </div>
        <div class="info">
          <div class="name">{{ item.user_qm_name }}</div>
          <div class="more-btn" @click="showMoreOperate">
            <uni-icons
              type="more-filled"
              size="18"
              color="rgba(0,0,0,0.4)"
            ></uni-icons>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reqGetPersonalStyle } from "@/api/team-api";
import { back } from "@/utils/navigate";
import { showActionSheet } from "@uni-helper/uni-promises";

type TPersonStyleListItem = {
  userId: string;
  user_qm_name: string;
  personalInfo: {
    carouseList: Array<{
      src: string;
      mediaType: string;
    }>;
  };
};

const personStyleList = ref<Array<TPersonStyleListItem>>([]);

const showMoreOperate = async () => {
  console.log("showMoreOperate");
  const showActionSheetRes = await showActionSheet({
    itemList: ["排序", "查看档期", "查看报价", "取消合作"],
  });
  console.log(showActionSheetRes.tapIndex);
};

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
   }));
}
getPersonalStyle();
</script>

<style scoped lang="scss">
.container {
  position: relative;
  .top-nav {
    height: 108rpx;
    display: flex;
    align-items: center;
    padding-left: 65rpx;
    border-bottom: 2rpx solid #ededed;
    position: sticky;
    background-color: #fff;
    z-index: 1;
    top: 0;
    .nav-item {
      position: relative;
      color: rgba(0, 0, 0, 0.4);
      font-weight: 500;
      font-size: 31rpx;
      margin-right: 53rpx;
      display: flex;
      justify-content: center;
      &.active {
        color: #000;
        &::after {
          content: "";
          display: block;
          width: 35rpx;
          height: 6rpx;
          background: #000000;
          position: absolute;
          top: 58rpx;
        }
      }
    }
  }
  .content-list {
    padding: 0 31rpx;
    margin-top: 20rpx;
    display: grid;
    justify-content: center;
    grid-template-columns: repeat(2, min-content);
    row-gap: 30rpx;
    column-gap: 27rpx;
    padding-bottom: 120rpx;
    .list-item {
      .cover {
        position: relative;
        .cover-img {
          width: 331rpx;
          height: 438rpx;
        }
      }
      .info {
        margin-top: 34rpx;
        display: flex;
        justify-content: space-between;
        .name {
          width: 180rpx;
          font-size: 27rpx;
          font-weight: 500;
          color: #000000;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }
    }
  }
}
</style>
