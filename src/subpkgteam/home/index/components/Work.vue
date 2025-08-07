<template>
  <div class="work-container">
    <div class="title">
      作品
      <uni-icons type="right" size="21" color="#FFFFFF" @click="toMoreWork"></uni-icons>
    </div>
    <div class="list">
      <div class="list-item" v-for="item in workList" :key="item.find_id">
        <div class="cover">
          <image
            class="cover-img"
            :src="item.cover"
          />
          <span class="CustomFont play-icon">&#xe6b6;</span>
        </div>
        <div class="bottom">{{ item.title }}</div>  
      </div>

      <div class="more-work_btn" @click="toMoreWork">更多作品</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reqGetWorksList } from "@/api/team-api";
import useTeam from "@/stores/team-store";

export type TWork = {
  cover: string;
  find_id: string;
  title: string;
}
const workList = ref<TWork[]>([]);

const teamStore = useTeam();
const { teamId } = storeToRefs(teamStore);


const initData = async (teamId) => {
  try {
    const res = await reqGetWorksList(teamId);
    console.log(res);
    workList.value = res.data.data.list.slice(0, 2);
  } catch (err) {
    console.log(err);
  }
};
watch(teamId, (newVal) => {
  if(newVal) {
    initData(newVal);
  }
})

const toMoreWork = () => {
  uni.navigateTo({
    url: '/subpkgteam/work/index/index'
  })
}
</script>

<style scoped lang="scss">
.work-container {
  margin-bottom: 15rpx;
  padding: 45rpx 23rpx 45rpx 23rpx;
  .title {
    display: flex;
    align-items: center;
    font-size: 40rpx;
    font-weight: 500;
    color: #ffffff;
    margin-right: 8rpx;
    margin-bottom: 45rpx;
  }
  .list {
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
          color: #fff;
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
        color: #ffffff;
      }
    }
    .more-work_btn {
      margin-top: 31rpx;
      height: 77rpx;
      background: #424148;
      border-radius: 62rpx;
      box-shadow: 0px 3.85rpx 15.38rpx 0px rgba(52, 51, 47, 0.25);
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 25rpx;
      font-weight: 500;
      color: #ffffff;
    }
  }
}
</style>
