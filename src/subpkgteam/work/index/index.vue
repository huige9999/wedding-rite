<template>
  <div class="container">
    <uni-nav-bar
      class="nav-bar"
      left-icon="left"
      status-bar
      title="作品列表"
      :border="false"
      background-color="#ffffff"
      @click-left="back"
    />
    <div class="list">
      <div class="list-item" v-for="item in workList" :key="item.find_id">
        <div class="cover">
          <image class="cover-img" :src="item.cover" />
          <span class="CustomFont play-icon">&#xe6b6;</span>
        </div>
        <div class="bottom">
            <div class="title">{{ item.title }}</div>
            <uni-icons type="more-filled" size="21" color="#000000" @click="showMoreAction(item.find_id)"></uni-icons>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { back } from "@/utils/navigate";
import { reqGetWorksList } from "@/api/team-api";
import useTeam from "@/stores/team-store";
import type { TWork } from "../../home/index/components/Work.vue";
import { showActionSheet } from "@uni-helper/uni-promises";

const workList = ref<TWork[]>([]);
const teamStore = useTeam();

const totalPage = ref(1);
const currentPage = ref(1);

const showMoreAction = async (workId) => {
    const res = await showActionSheet({
        itemList: ["分享","排序","编辑", "删除"]
    });
    console.log(res);
    if(res.tapIndex === 2) {
        uni.navigateTo({
            url: `/subpkgteam/work/add/index?workId=${workId}`
        })
    }
}

const initData = async () => {
  try {
    const res = await reqGetWorksList(teamStore.teamId);
    console.log(res);
    workList.value = res.data.data.list;
    totalPage.value = res.data.data.totalPage;
  } catch (err) {
    console.log(err);
  }
};

initData();
</script>

<style scoped lang="scss">
.container {
  .list {
    padding-top: 38rpx;
    margin: 0 auto;
    padding: 0 23rpx;
    padding-bottom: 120rpx;
    .list-item {
      margin-bottom: 38rpx;
      .cover {
        height: 396rpx;
        position: relative;
        .cover-img {
          width: 100%;
          height: 100%;
        }
        .play-icon {
          color: #000000;
          font-size: 34rpx;
          position: absolute;
          left: 38rpx;
          bottom: 37rpx;
        }
      }
      .bottom {
        margin-top: 31rpx;
        font-size: 38rpx;
        font-weight: 400;
        color: #000000;
        display: flex;
        justify-content: space-between;
      }
    }
  }
}
</style>
