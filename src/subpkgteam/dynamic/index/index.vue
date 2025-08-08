<!-- 「更多动态」页面 -->
<template>
  <div
    class="container"
    @click="console.log('aa')"
  >
    <uni-nav-bar
      class="nav-bar"
      title="动态列表"
      :status-bar="true"
      :border="false"
      left-icon="left"
      @click-left="back"
    />
    <div
      v-if="dynamicList.length === 0"
      class="empty-state"
    >
      还没有发布任何动态哦
    </div>
    <div
      v-else
      class="dynamic-list"
    >
      <div
        v-for="(item ,index) in dynamicList"
        :key="index"
        class="list-item"
      >
        <div class="content">
          {{ item.content }}
        </div>
        <div
          v-if="item.mediaInfo.length > 0"
          class="card-list"
        >
          <div
            v-for="(media, mediaIndex) in item.mediaInfo"
            :key="mediaIndex"
            class="card-list_item"
          >
            <image
              class="cover-img"
              :src="media.src"
            />
          </div>
        </div>
        <div class="actions">
          <div
            class="btn edit"
            @click="editDynamic(item.find_id)"
          >
            编辑
          </div>
          <div
            class="btn delete"
            @click="deleteDynamic(item.find_id)"
          >
            删除
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reqGetDynamicList, reqRemoveWorks } from '@/api/team-api';
import useTeam from '@/stores/team-store';
import { back } from '@/utils/navigate';

type TDynamic = {
  find_id: string;
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
        find_id: item.find_id,
        content: item.content,
        mediaInfo,
      };
    });
    console.log(res);
  } catch (err) {
    console.log(err);
  }
};

const editDynamic = (dynamicId: string) => {
  uni.navigateTo({ url: `/subpkgteam/dynamic/add/index?dynamicId=${dynamicId}` });
};

const deleteDynamic = (dynamicId: string) => {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这条动态吗？此操作不可撤销。',
    success: async (res) => {
      if (res.confirm) {
        await reqRemoveWorks(dynamicId);
        uni.showToast({
          title: '删除成功',
          icon: 'success',
        });
        initData();
      }
    },
  });
};

onShow(() => {
  initData();
});

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
      .actions {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        margin-top: 20rpx;
        gap: 40rpx;
        font-size: 26rpx;
        color: #666;
        .btn {
          padding: 5rpx 15rpx;
          border-radius: 8rpx;
          &:hover {
            background-color: #f0f0f0;
          }
        }
        .delete {
          color: #e54d42;
        }
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
  .empty-state {
    text-align: center;
    color: #999;
    padding-top: 200rpx;
    font-size: 30rpx;
  }
}
</style>
