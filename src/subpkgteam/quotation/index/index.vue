<template>
  <div class="container">
    <uni-nav-bar
      class="nav-bar"
      left-icon="left"
      status-bar
      title="报价设置"
      :border="false"
      background-color="#ffffff"
      @click-left="back"
    />
    <!-- 没有报价的情况 -->
    <div class="no-quotation_wrap" v-if="!offers.length">
      <div class="add-tip">请完善您的项目报价</div>
      <div class="add-rec_btn" @click="toAdd('')">
        <uni-icons type="plusempty" size="35" color="#9E9E9E"></uni-icons>
      </div>
    </div>
    <!-- 有报价的情况 -->
    <div class="quotation_wrap" v-else>
      <div class="quotation-card" v-for="(item, index) in offers" :key="item.id">
        <div class="live-type">{{ item.kind }}</div>
        <div class="price-list">
          <div class="price-item">
            <div class="value">{{ item.deposit }}</div>
            <div class="name">定金</div>
          </div>
          <div class="price-item">
            <div class="value">{{ item.quote }}</div>
            <div class="name">报价</div>
          </div>
        </div>
        <div class="bottom">
          <div class="left-info">{{ item.content }}</div>
          <div class="operate-btns">
            <div class="btn" @click="deleteIt(item.id)">删除</div>
            <div class="btn" @click="editIt(item)">编辑</div>
          </div>
        </div>
      </div>
      <div class="add-rec_btn" @click="toAdd('')">
        <uni-icons type="plusempty" size="35" color="#9E9E9E"></uni-icons>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reqEditOffer, reqGetOfferList } from "@/api/team-api";
import useTeam from "@/stores/team-store";
import { back } from "@/utils/navigate";
import { showToast } from "@/utils/tools";

const teamStore = useTeam();

type TOffer = {
  id: string;
  kind: string;
  quote: string;
  deposit: string;
  content: string;
  usecase: string;
};

const offers = ref<TOffer[]>([]);

const toAdd = (param: string = "") => {
  uni.navigateTo({
    url: `/subpkgteam/quotation/add/index${param}`,
  });
};

const deleteIt = (offerId: string) => {
  uni.showModal({
    title: "提示",
    content: "你确定要删除吗？",
    success: async function (res) {
      if (res.confirm) {
        console.log("用户点击确定");
        try {
          const res = await reqEditOffer({
            offerId,
            is_delete: '1'
          });
          console.log(res);
          showToast('删除成功!');
          initData();
        }catch (err) {
          showToast('删除失败!');
        }

      } else if (res.cancel) {
        console.log("用户点击取消");
      }
    },
  });
};

const editIt = (item: TOffer) => {
  toAdd(`?offerId=${item.id}&category=${item.kind}&price=${item.quote}&deposit=${item.deposit}&additional=${item.content}`);
};

const initData = async () => {
  try {
    const res = await reqGetOfferList(teamStore.teamId);
    console.log(res);
    offers.value = res.data.data.list;
  } catch (err) {
    console.log(err);
  }
};
onShow(() => {
  if (teamStore.needRefreshOffer) {
    initData();
    teamStore.setNeedRefreshOffer(false);
  }
});

initData();
</script>

<style scoped lang="scss">
.container {
  position: relative;
  .add-rec_btn {
    margin: 0 auto;
    margin-top: 30rpx;
    width: 688rpx;
    height: 200rpx;
    background: #ffffff;
    border: 2rpx dashed #dddddd;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .no-quotation_wrap {
    padding: 40rpx 30rpx 0 30rpx;
    .add-tip {
      font-size: 38rpx;
      font-weight: 400;
      color: #000000;
    }
  }
  .quotation_wrap {
    padding-top: 39rpx;
    .quotation-card {
      margin: 0 auto;
      width: 688rpx;
      height: 346rpx;
      background: #ebeff1;
      border-radius: 4rpx;
      padding: 42rpx 38rpx 0rpx 46rpx;
      position: relative;
      margin-bottom: 20rpx;
      .live-type {
        font-size: 38rpx;
        font-weight: 500;
        color: #000000;
      }
      .price-list {
        margin-top: 60rpx;
        display: flex;
        column-gap: 40rpx;
        .price-item {
          font-size: 27rpx;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.4);
          display: flex;
          flex-direction: column;
          align-items: center;
          .value {
            margin-bottom: 5rpx;
          }
        }
      }
      .bottom {
        position: absolute;
        left: 0;
        bottom: 21rpx;
        width: 100%;
        display: flex;
        justify-content: space-between;
        padding: 0 38rpx 0rpx 46rpx;
        .left-info {
          font-size: 27rpx;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.4);
        }
        .operate-btns {
          display: flex;
          align-items: center;
          column-gap: 60rpx;
          .btn {
            font-size: 27rpx;
            font-weight: 500;
            color: #333333;
          }
        }
      }
    }
  }
}
</style>
