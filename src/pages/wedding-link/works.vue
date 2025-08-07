<template>
  <uni-nav-bar title="我的作品" :status-bar="true" :border="false" />
  <div class="cases-content">
    <!-- 「暂无作品」提示 -->
    <div v-if="workList.length <= 0" class="no-case-block">
      <image
        src="https://ustatic.joymew.com/joymewApp/home/emptyCase.png"
        class="empty-case"
      />
      <div class="tip" @click="navigateTo('add-work')">点击添加作品</div>
    </div>
    <div v-else class="cases-block">
      <div class="cases-list">
        <!-- 单个作品 -->
        <div
          v-for="(item, index) in workList"
          :key="index"
          class="cases-item"
          @click="navigateTo('work-detail', { workId: item.id })"
        >
          <!-- 封面 -->
          <div class="cover">
            <image
              class="cover-img"
              mode="aspectFill"
              :src="item.coverUrl || item.imgUrl[0]"
            />
            <!-- 封面右上角的按钮 -->
            <image
              class="more-btn"
              src="/static/icons/common/more.svg"
              @click.stop="onMoreBtnClick(item)"
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
          <div class="share-btn" @click.stop>
            <!-- 隐藏的分享按钮 -->
            <button
              class="share-btn-hidden"
              :data-work-id="item.id"
              :data-work-cover="item.coverUrl || item.imgUrl[0]"
              open-type="share"
            />
            <image class="icon" src="/static/icons/common/arrow-up-left.svg" />
            <text class="text"> 分享 </text>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- 添加作品按钮 -->
  <image
    class="add-work-btn"
    src="@/static/icons/works/circle-plus-yellow.svg"
    @click="addWorkClick"
  />
  <CustomTabBar />
  <!-- 编辑作品弹窗 -->
  <EditWorkPopup
    ref="editWorkPopup"
    :work-id="editWorkId"
    @delete="onDeleteBtnClick"
  />
</template>

<script lang="ts" setup>
import { reqDeleteWork } from "@/api/work-api";
import CustomTabBar from "@/components/CustomTabBar.vue";
import EditWorkPopup from "@/components/wedding-link/editWorkPopup.vue";
import useUser from "@/stores/user-store";
import useWork from "@/stores/work-store";
import { navigateTo } from "@/utils/navigate";
import { showToast } from "@/utils/tools";
import { judgeIsVip } from "@/utils/wedding-link";

const ctx = getCurrentInstance();

const userStore = useUser();
const { userInfo } = storeToRefs(userStore);

const work = useWork();
const { workList } = storeToRefs(work);
const { getWorkList, appendWorkList } = work;

// 显示时检查并获取数据
onShow(() => {
  if (!userInfo.value.id) {
    userStore.getPersonalInfo();
  }
  if (workList.value.length <= 0) {
    getWorkList();
  }
});

// 下拉刷新重新获取数据
onPullDownRefresh(async () => {
  await getWorkList();
  uni.stopPullDownRefresh();
});

// 滚动到底部时加载更多
onReachBottom(() => {
  console.log("onReachBottom");
  appendWorkList();
});
onLoad(() => {
  // 团队打开应用的情况直接重定向到团队首页
  if(uni.getStorageSync('teamInfo')) {
    uni.navigateTo({
      url: "/subpkgteam/home/index/index",
    });
    return;
  }
  // 关闭菜单中的分享按钮
  uni.hideShareMenu({ hideShareItems: [] });
});
// 分享回调
onShareAppMessage((options) => {
  console.log("onShareAppMessage", options);
  const shareData = {
    title: "我的作品已更新，快来查看吧",
    path: `/subpkg/wedding-link/work-detail-share?userId=${userInfo.value.id}&workId=${options.target.dataset.workId}&inviterId=${userInfo.value.id}`,
    imageUrl: options.target.dataset.workCover,
  };
  return shareData;
});

// #region 编辑作品弹窗相关
/** 要编辑的作品的id */
const editWorkId = ref<string>("");

/** 要编辑的作品的封面 */
const editWorkCover = ref<string>("");

/** 要编辑的作品的标题 */
const editWorkTitle = ref<string>("");

/**
 * 点击「...」按钮事件
 * @param editWork
 */
const onMoreBtnClick = (editWork: WorkInfo) => {
  editWorkId.value = editWork.id;
  editWorkCover.value = editWork.coverUrl || editWork.imgUrl[0];
  editWorkTitle.value = editWork.title;

  const popup = ctx?.refs.editWorkPopup as InstanceType<typeof EditWorkPopup>;
  if (popup?.open) {
    popup.open();
  }
};

/**
 * 点击删除按钮事件
 * @param workId 作品id
 */
const onDeleteBtnClick = async (workId: string) => {
  try {
    const resData = (await reqDeleteWork(workId))?.data as AnyObject;
    if (resData.code === 200) {
      await getWorkList();
    } else {
      showToast("删除失败，请稍后重试");
    }
    console.log("onDeleteBtnClick", resData);
  } catch (err) {
    console.error("onDeleteBtnClick", err);
  }
};

/** 添加作品 */
const addWorkClick = () => {
  // 判断作品数是否大于等于1，且是否为vip用户
  if (workList.value.length >= 1 && !judgeIsVip()) {
    uni.showModal({
      content:
        "您当前暂未开通会员，仅可上传一条作品如需上传多条作品，请先开通会员",
      confirmText: "去开通",
      confirmColor: "#007AFF",
      cancelColor: "#007AFF",
      cancelText: "取消",
      success: (res: any) => {
        if (res.confirm) {
          navigateTo("get-vip");
        }
      },
    });
    return;
  }
  // 跳转到发布作品页面
  navigateTo("add-work");
};

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
          "cover cover" 52.8205vw
          ". ." 16px
          "title share-btn" 4.6154vw
          ". share-btn" 12px
          "tags share-btn" 5.3846vw
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

          .share-btn-hidden {
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
  bottom: 40px + $tabBarHeight;

  width: 12.3077vw;
  height: 12.3077vw;
}
</style>
