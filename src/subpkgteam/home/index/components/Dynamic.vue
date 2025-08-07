<template>
  <div class="dynamic_container" v-if="dynamicList.length">
    <div class="title">
      动态
      <uni-icons
        type="right"
        size="21"
        color="#FFFFFF"
        @click="toMoreDynamic"
      ></uni-icons>
    </div>
    <div class="dynamic-list">
      <div
        class="dynamic-item"
        v-for="(dynamic, index) in dynamicList"
        :key="index + 'outer'"
      >
        <div class="sub-title">{{ dynamic.content }}</div>
        <div class="list">
          <div
            class="list-item"
            :key="index + 'inner'"
            v-for="(item, index) in dynamic.mediaInfo"
          >
            <image class="cover-img" :src="item.src" v-if="item.mediaType === 'image'"/>
            <video :src="item.src" class="cover-img" v-if="item.mediaType === 'video'" autoplay></video>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reqGetDynamicList } from "@/api/team-api";
import useTeam from "@/stores/team-store";

type TDynamic = {
  mediaInfo: TMeida[];
  content: string;
};
type TMeida = {
  src: string;
  mediaType: "image" | "video";
};

const teamStore = useTeam();
const { teamId, needRefreshDynamic } = storeToRefs(teamStore);

const dynamicList = ref<TDynamic[]>([]);
const currentPage = ref(1);
const totalPage = ref(1);

const initData = async (teamId) => {
  try {
    const res = await reqGetDynamicList(teamId);
    dynamicList.value = res.data.data.list.slice(0, 3).map((item: any) => {
      const mediaInfo = JSON.parse(item.mediaInfo);
      return {
        content: item.content,
        mediaInfo,
      };
    });
    console.log(res);
  } catch (err) {
    console.log(err);
  }
};

watch(teamId, (newVal) => {
  if (newVal) {
    initData(newVal);
  }
});
watch(needRefreshDynamic, (newVal) => {
  if (newVal) {
    initData(teamId.value);
    teamStore.setNeedRefreshDynamic(false);
  }
});

const toMoreDynamic = () => {
  uni.navigateTo({
    url: "/subpkgteam/dynamic/index/index",
  });
};
</script>

<style scoped lang="scss">
.dynamic_container {
  margin-bottom: 15rpx;
  padding: 45rpx 31rpx 150rpx 31rpx;
  .title {
    display: flex;
    align-items: center;
    font-size: 40rpx;
    font-weight: 500;
    color: #ffffff;
    margin-right: 8rpx;
    margin-bottom: 60rpx;
  }
  .dynamic-list {
    .dynamic-item {
      margin-bottom: 20rpx;
      .sub-title {
        font-size: 33rpx;
        font-weight: 500;
        color: #ffffff;
        margin-bottom: 38rpx;
      }
      .list {
        display: grid;
        grid-template-columns: repeat(3, min-content);
        column-gap: 5rpx;
        row-gap: 5rpx;
        .list-item {
          width: 231rpx;
          height: 231rpx;
          .cover-img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
}
</style>
