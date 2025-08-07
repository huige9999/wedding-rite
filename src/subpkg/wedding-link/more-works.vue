<!-- 「更多作品」页面 -->
<template>
  <uni-nav-bar
    title="更多作品"
    :status-bar="true"
    :border="false"
    left-icon="left"
    @click-left="back"
  />
  <div class="cases-content">
    <!-- 「暂无作品」提示 -->
    <div
      v-if="workList.length <= 0"
      class="no-case-block"
    >
      <image
        src="https://ustatic.joymew.com/joymewApp/home/emptyCase.png"
        class="empty-case"
      />
      <div class="tip">
        TA暂未发布过作品
      </div>
    </div>
    <div
      v-else
      class="cases-block"
    >
      <div class="cases-list">
        <!-- 单个作品 -->
        <div
          v-for="(item, index) in workList"
          :key="index"
          class="cases-item"
          @click="navigateTo('work-detail-share',{workId:item.id})"
        >
          <!-- 封面 -->
          <div class="cover">
            <image
              class="cover-img"
              mode="aspectFill"
              :src="item.coverUrl || item.imgUrl[0]"
            />
          </div>
          <!-- 标题 -->
          <div class="title">
            {{ item.title }}
          </div>
          <!-- 标签 -->
          <div class="tags">
            <div
              v-for="(tag, tagIndex) in item.tags"
              :key="tagIndex"
              class="tag"
            >
              #{{ tag }}
            </div>
          </div>
          <!-- 分享按钮 -->
          <div
            class="share-btn"
            @click.stop
          >
            <!-- 隐藏的分享按钮 -->
            <button
              class="share-btn-hidden"
              open-type="share"
              :data-work-id="item.id"
              :data-work-cover="item.coverUrl||item.imgUrl[0]"
            />
            <image
              class="icon"
              src="/static/icons/common/arrow-up-left.svg"
            />
            <text class="text">
              分享
            </text>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reqGetWorkList } from '@/api/work-api';
import useUser from '@/stores/user-store';
import { back, navigateTo } from '@/utils/navigate';
import { parseWorkInfo } from '@/utils/parse';

const userStore = useUser();
const { tempUserInfo, userInfo } = storeToRefs(userStore);

// #region  作品列表获取及展示

/** 作品列表 */
const workList = ref<WorkInfo[]>([]);

/** 作品总数 */
const totalWorkCount = ref(0);

/** 每页获取作品数量 */
const WORK_PAGE_SIZE = 10;

/** 上次获取作品列表请求是否完成 */
const isLastReqFinished = ref(true);

/**
 * 获取并设置作品列表
 * @param {string} userId 用户id
 */
const getWorkList = async (userId:string) => {
  if (!isLastReqFinished.value) return;

  isLastReqFinished.value = false;
  try {
    const resData = (await reqGetWorkList(userId))?.data as ResData<AnyObject>;
    // 记录总作品数
    totalWorkCount.value = resData.data.totalResult;
    console.log('workList res', resData);
    if (resData.code === 200) {
      workList.value = (resData.data.list as Array<any>).map((item) => parseWorkInfo(item));
    } else {
      console.log('获取作品列表失败');
    }
  } catch (err) {
    console.error('getWorkList', err);
  }
  isLastReqFinished.value = true;
};

/**
 * 获取并追加作品列表
 * @param {string} userId 用户id
 */
const appendWorkList = async (userId:string) => {
  console.log('appendWorkList', isLastReqFinished.value);
  if (!isLastReqFinished.value) return;

  isLastReqFinished.value = false;
  try {
    // 如果当前显示的作品数量大于等于总作品数，就不再获取
    if (workList.value.length >= totalWorkCount.value) {
      isLastReqFinished.value = true;
      return;
    }

    // 要获取的页码
    const page = Math.ceil(workList.value.length / WORK_PAGE_SIZE) + 1;

    const resData = (await reqGetWorkList(userId, page))?.data as ResData<AnyObject>;
    totalWorkCount.value = resData.data.totalResult;
    const newWorkList = (resData.data.list as Array<any>).map((item) => parseWorkInfo(item));
    workList.value = workList.value.concat(newWorkList);
    console.log('totalResult', totalWorkCount.value);
    console.log('appendWorkList', workList.value);
  } catch (err) {
    console.error('appendWorkList', err);
  }
  isLastReqFinished.value = true;
};

/** 用户id */
let userId = '';

// 页面挂载时，根据用户id获取作品列表
onLoad(async (options) => {
  console.log('more-works onLoad', options);
  userId = options?.userId;
  if (userId) {
    await getWorkList(userId);
  }
});

// 下拉刷新时重新获取作品列表
onPullDownRefresh(async () => {
  await getWorkList(userId);
  uni.stopPullDownRefresh();
});

// 滚动到底部时加载更多
onReachBottom(() => {
  console.log('onReachBottom');
  appendWorkList(userId);
});

// #endregion

// #region 分享相关

onShareAppMessage((options) => ({
  title: '我的作品已更新，快来查看吧',
  path: `/subpkg/wedding-link/work-detail-share?userId=${userInfo.value.id}&workId=${options.target.dataset.workId}&inviter=${tempUserInfo.value.id}`,
  imageUrl: options.target.dataset.workCover,
}));

// #endregion

</script>

<style lang="scss" scoped>
.cases-content {
  .no-case-block {
    padding-top: 146px;
    padding-bottom: 24vw;
    display: flex;
    flex-direction: column;
    align-items: center;

    .empty-case {
      width: 58.6667vw;
      height: 37.8667vw;
    }

    .tip {
      margin-top: 126px;

      font-size: 3.7333vw;
      font-weight: 400;
      line-height: 3.7333vw;
      color: #868c9b;
    }
  }

  // 有作品时显示的结构
  .cases-block {
    padding: 20px 12px;

    // 作品列表
    .cases-list {
      padding-bottom: 70px;
      box-sizing: border-box;
      display: grid;
      row-gap: 12px;

      .cases-item {
        width: 100%;

        padding-bottom: 16px;
        display: grid;
        grid-template:
          'cover cover' 52.8205vw
          '. .' 16px
          'title share-btn' 4.6154vw
          '. share-btn' 12px
          'tags share-btn' 5.3846vw
          / 1fr 9.2308vw;
        align-items: start;

        // 封面
        .cover {
          grid-area: cover;

          position: relative;

          width: 100%;
          height: 100%;
          overflow: hidden;

          border-radius: 2px;

          .cover-img {
            position: absolute;
            top: 0;
            left: 0;

            width: 100%;
            height: 100%;
          }

          // 更多按钮
          .more-btn {
            position: absolute;
            top: 10px;
            right: 6px;

            width: 5.1282vw;
            height: 5.1282vw;
          }

        }

        // 标题
        .title {
          grid-area: title;

          font-size: 17px;
          line-height: 17px;
          color: #333;
        }

        // 所有标签
        .tags {
          grid-area: tags;

          height: 100%;

          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          align-items: center;

          // 标签
          .tag {
            height: 21px;

            line-height: 21px;
            color: #5e5e5e;
          }
        }

        // 分享按钮
        .share-btn {
          grid-area: share-btn;
          justify-self: start;

          position: relative;

          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;

          .share-btn-hidden{
            position: absolute;
            top: 0;
            left: 0;

            width: 100%;
            height: 100%;

            opacity: 0;
          }

          .icon {
            width: 5.1282vw;
            height: 5.1282vw;
          }
        }
      }
    }
  }
}

// 添加作品按钮
.add-work-btn {
  position: fixed;
  right: 20px;
  bottom: 20px;

  width: 12.3077vw;
  height: 12.3077vw;
}
</style>
