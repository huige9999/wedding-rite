<!-- 「更多动态」页面 -->
<template>
  <div class="container">
    <uni-nav-bar
      class="nav-bar"
      title="动态列表"
      :status-bar="true"
      :border="false"
      left-icon="left"
      @click-left="back"
    />
    <div class="dynamic-list">
      <div class="list-item" v-for="(item ,index) in dynamicList" :key="index">
        <div class="content">{{ item.content }}</div>
        <div class="card-list" v-if="item.mediaInfo.length > 0">
          <div
            class="card-list_item"
            v-for="(media, mediaIndex) in item.mediaInfo"
            :key="mediaIndex"
          >
            <image class="cover-img" :src="media.src" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reqGetDynamicList } from "@/api/team-api";
import useTeam from "@/stores/team-store";
import { back } from "@/utils/navigate";

type TDynamic = {
  mediaInfo: string;
  content: string;
}
type TMeida = {
  src: string;
  mediaType: 'image' | 'video'
}

const teamStore = useTeam();
const { teamId } = storeToRefs(teamStore);

const dynamicList = ref<TDynamic[]>([]);
const currentPage = ref(1);
const totalPage = ref(1);

const initData = async () => {
  try {
    const res = await reqGetDynamicList(teamId.value);
    dynamicList.value = res.data.data.list.map((item) => {
      const mediaInfo = JSON.parse(item.mediaInfo);
      return {
        content: item.content,
        mediaInfo,
      }
    })
    console.log(res);
  } catch (err) {
    console.log(err);
  }
};

initData();

</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  .dynamic-list {
    padding: 30rpx 20rpx 120rpx 20rpx;
    .list-item {
      margin-bottom: 20rpx;
      .content {
        font-size: 33rpx;
        font-weight: 500;
        color: #000000;
        margin-bottom: 38rpx;
      }
      .card-list {
        display: grid;
        grid-template-columns: repeat(3, min-content);
        column-gap: 5rpx;
        row-gap: 5rpx;
        .card-list_item {
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
