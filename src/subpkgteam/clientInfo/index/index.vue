<template>
  <div class="container">
    <uni-nav-bar
      class="nav-bar"
      left-icon="left"
      status-bar
      title="客资"
      :border="false"
      background-color="#ffffff"
      @click-left="back"
    />
    <div class="top-nav_container">
      <div class="nav-menu">
        <div
          class="nav-item"
          :class="activeNav === '0' ? 'active' : ''"
          @click="activeNav = '0'"
        >
          访客
        </div>
        <div
          class="nav-item"
          :class="activeNav === '1' ? 'active' : ''"
          @click="activeNav = '1'"
        >
          预约
        </div>
      </div>
      <div class="filter-search">
        <div class="search-item">
          全部
          <span class="CustomFont arrow-down">&#xe643;</span>
        </div>
        <div class="search-item">
          <picker
            mode="selector"
            :range="['上午', '下午']"
            class="search-item_picker"
          >
            <div class="search-item_picker">
              时间段
              <span class="CustomFont arrow-down">&#xe643;</span>
            </div>
          </picker>
        </div>
      </div>
    </div>
    <!-- 访客记录 -->
    <div class="list_container" v-if="activeNav === '0'">
      <div
        class="list-item"
        v-for="(item, index) in visitorData.list"
        :key="index"
      >
        <div class="datetime">{{ item.create_time }}</div>
        <div class="card-box">
          <image class="avatar" :src="item.avator" mode="aspectFill"></image>
          <div class="right-info">
            <div class="core">
              <div class="nickname">{{ item.name }}</div>
              <div class="source">来自{{ item.origin }}的访问</div>
            </div>
            <div class="time">访问{{ item.count }}次，共计{{ item.time }}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 预约记录 -->
    <div class="list_container" v-else>
      <div
        class="list-item"
        v-for="(item, index) in scheduleData.list"
        :key="index"
      >
        <div class="datetime">{{ item.create_time }}</div>
        <!-- 预约卡片 -->
        <div class="card-box reserve">
          <image class="avatar" :src="item.avator" mode="aspectFill"></image>
          <div class="right-info">
            <div class="core">
              <div class="nickname">{{ item.name }}</div>
              <div class="phone">联系电话：{{ item.phone }}</div>
              <div class="reserve-date">
                预约日期：{{ item.schedule_time }} {{ item.schedule_kind }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reqGetScheduleList, reqGetVisitorList } from "@/api/team-api";
import useTeam from "@/stores/team-store";
import { back } from "@/utils/navigate";
import { showToast } from "@/utils/tools";

const teamStore = useTeam();

type TVisitor = {
  name: string;
  avator: string;
  count: string;
  time: string;
  origin: string;
  create_time: string;
};

type TSchedule = {
  name: string;
  avator: string;
  phone: string;
  schedule_kind: string;
  schedule_time: string;
  create_time: string;
};

const visitorData = ref<{
  list: TVisitor[];
  currentPage: number;
  totalPage: number;
}>({
  list: [],
  currentPage: 1,
  totalPage: 1,
});

const scheduleData = ref<{
  list: TSchedule[];
  currentPage: number;
  totalPage: number;
}>({
  list: [],
  currentPage: 1,
  totalPage: 1,
});

const activeNav = ref("0");

watch(activeNav, () => {
  getData();
});

onReachBottom(() => {
  if (activeNav.value === "0") {
    if (visitorData.value.currentPage >= visitorData.value.totalPage) {
      showToast("没有更多数据了!");
      return;
    }
    visitorData.value.currentPage += 1;
    getData();
  } else {
    if (scheduleData.value.currentPage >= scheduleData.value.totalPage) {
      showToast("没有更多数据了!");
      return;
    }
    scheduleData.value.currentPage += 1;
    getData();
  }
});

const getData = async () => {
  try {
    if (activeNav.value === "0") {
      const res = await reqGetVisitorList({
        teamId: teamStore.teamId,
        currentPage: visitorData.value.currentPage,
        showCount: 10,
      });
      console.log(res);
      visitorData.value.totalPage = res.data.data.totalPage;
      visitorData.value.list = visitorData.value.list.concat(
        res.data.data.list
      );
    } else {
      const res = await reqGetScheduleList({
        teamId: teamStore.teamId,
        currentPage: scheduleData.value.currentPage,
        showCount: 10,
      });
      console.log(res);
      scheduleData.value.totalPage = res.data.data.totalPage;
      scheduleData.value.list = scheduleData.value.list.concat(
        res.data.data.list
      );
    }
  } catch (err) {
    console.log(err);
    showToast("数据获取失败!");
  }
};

getData();
</script>

<style scoped lang="scss">
.arrow-down {
  font-size: 44rpx;
  color: rgba(0, 0, 0, 0.4);
}
.container {
  position: relative;
  min-height: 100vh;
  background-color: #f2f4f7;
  .top-nav_container {
    height: 194rpx;
    background-color: #fff;
    .nav-menu {
      height: 125rpx;
      display: flex;
      align-items: center;
      padding-left: 28rpx;
      column-gap: 69rpx;
      .nav-item {
        font-size: 31rpx;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.4);
        position: relative;
        display: flex;
        justify-content: center;
        &.active {
          color: #000;
          &::after {
            content: "";
            display: block;
            position: absolute;
            width: 42rpx;
            height: 4rpx;
            background: #000000;
            top: 59rpx;
          }
        }
      }
    }
    .filter-search {
      display: flex;
      padding-left: 42rpx;
      column-gap: 14rpx;
      font-size: 27rpx;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.4);
      .search-item {
        display: flex;
        align-items: center;
        .search-item_picker {
          display: flex;
          align-items: center;
        }
      }
    }
  }
  .list_container {
    padding: 31rpx 38rpx;
    .list-item {
      margin-bottom: 31rpx;
      .datetime {
        font-size: 23rpx;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.4);
        margin-bottom: 23rpx;
      }
      .card-box {
        height: 200rpx;
        background: #ffffff;
        border-radius: 2rpx;
        display: flex;
        padding: 23rpx;
        .avatar {
          width: 77rpx;
          height: 77rpx;
          background: #d7dbe0;
          border-radius: 50%;
        }
        .right-info {
          margin-left: 19rpx;
          width: 520rpx;
          .core {
            border-bottom: 2rpx solid #ededed;
            padding-bottom: 15rpx;
            margin-bottom: 20rpx;
            .nickname {
              font-size: 27rpx;
              font-weight: 500;
              color: #000000;
              margin-bottom: 12rpx;
            }
            .source {
              font-size: 23rpx;
              font-weight: 400;
              color: rgba(0, 0, 0, 0.4);
            }
          }
          .time {
            font-size: 23rpx;
            font-weight: 500;
            color: #333333;
          }
        }
        &.reserve {
          .right-info {
            .core {
              padding-bottom: 31rpx;
              font-size: 23rpx;
              font-weight: 400;
              color: rgba(0, 0, 0, 0.4);
              .phone {
                margin-bottom: 11rpx;
              }
            }
          }
        }
      }
    }
  }
}
</style>
