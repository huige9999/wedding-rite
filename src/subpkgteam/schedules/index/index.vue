<template>
  <div class="container">
    <uni-nav-bar
      class="nav-bar"
      left-icon="left"
      status-bar
      title="档期表"
      :border="false"
      background-color="#ffffff"
      @click-left="back"
    />
    <div class="title-box">成员档期</div>
    <div class="setform">
      <div class="formItem">
        <div class="key">允许访客查询成员档期</div>
        <switch class="switch" color="#27AE60" />
      </div>
      <div class="formItem">
        <div class="key">请选择日期以查询当日有空的<br />团队成员：</div>
        <picker
          mode="date"
          :value="currentDate"
          :start="startDate"
          :end="endDate"
          @change="bindDateChange"
        >
          <view class="datepicker">
            {{ date }}
            <span class="CustomFont arrow-down">&#xe643;</span>
          </view>
        </picker>
      </div>
    </div>
    <div class="list">
      <div class="list-header">
        <div class="header-item" v-for="item in periodOptions" :key="item.id" @click="choosePeriod(item.id)" :class="{selected: item.id === activePeriod}">{{ item.name }}</div>
      </div>
      <div class="list-body">
        <div class="data-item" v-for="item in 10" :key="item">
          <image
            class="avatar"
            src="https://ustatic.hudongmiao.com/joymewMp/defaultAvatar/45.png"
          />
          <div class="text-box">
            <div class="nickname">向前进.妮娜</div>
            <div class="period">全天: 有空</div>
          </div>
          <div class="quotation">报价:8800-12000</div>
        </div>
      </div>
    </div>
    <div class="bottom-operate">
      <div class="btn left">转发给客户查档</div>
      <div class="btn right">分享以上成员</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { back } from "@/utils/navigate";

const getDate = (type?: string) => {
  const date = new Date();
  let year = date.getFullYear();
  let month: any = date.getMonth() + 1;
  let day: any = date.getDate();

  if (type === "start") {
    year = year - 5;
  } else if (type === "end") {
    year = year + 2;
  }
  month = month > 9 ? month : "0" + month;
  day = day > 9 ? day : "0" + day;
  return `${year}-${month}-${day}`;
};

const startDate = computed(() => getDate("start"));
const endDate = computed(() => getDate("end"));
const currentDate = getDate();
const date = ref(currentDate);
const periodOptions = [{
  id: "all",
  name: "不限"
}, {
  id: "morning",
  name: "中午"
}, {
  id: "afternoon",
  name: "下午"
}, {
  id: "night",
  name: "晚上"
}, {
  id: "full",
  name: "全天"
}];
const activePeriod = ref("all");

const choosePeriod = (id: string) => {
  console.log(id);
  activePeriod.value = id;
}



const bindDateChange = (e: any) => {
  date.value = e.detail.value;
};
</script>

<style scoped lang="scss">
.arrow-down {
  font-size: 44rpx;
  color: #000000;
}
.container {
  position: relative;
  padding-bottom: 220rpx;
  .title-box {
    width: 681rpx;
    height: 65rpx;
    background: #ffffff;
    margin: 19rpx auto 20rpx auto;
    font-size: 27rpx;
    font-weight: 500;
    color: #000000;
    border: 8rpx solid #ebeced;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .setform {
    width: 681rpx;
    margin: 0 auto;
    .formItem {
      height: 65rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 50rpx;
      .key {
        width: 325px;
        font-size: 25rpx;
        font-weight: 400;
        color: #000000;
      }
      .switch {
        transform: scale(0.7);
        transform-origin: right;
      }
      .datepicker {
        width: 315rpx;
        height: 65rpx;
        background: #f5f5f5;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-left: 23rpx;
        padding-right: 11rpx;
        font-size: 31rpx;
        font-weight: 500;
        color: #000000;
      }
    }
  }
  .list {
    width: 681rpx;
    margin: 0 auto;
    margin-top: 10rpx;
    .list-header {
      display: flex;
      align-items: center;
      column-gap: 31rpx;
      .header-item {
        font-size: 27rpx;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.4);
        position: relative;
        display: flex;
        justify-content: center;
        &.selected {
          color: #000000;
          &::after {
            content: "";
            display: block;
            width: 42rpx;
            height: 4rpx;
            background: #000000;
            position: absolute;
            top: 57rpx;
          }
        }
      }
    }
    .list-body {
      margin-top: 53rpx;
      .data-item {
        margin-bottom: 30rpx;
        display: flex;
        align-items: flex-start;
        .avatar {
          width: 100rpx;
          height: 100rpx;
          border-radius: 50%;
        }
        .text-box {
          margin-left: 19rpx;
          padding-top: 4rpx;
          .nickname {
            width: 180rpx;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            font-size: 27rpx;
            color: #000;
            font-weight: 500;
            margin-bottom: 7rpx;
          }
          .period {
            font-size: 23rpx;
            font-weight: 400;
            color: rgba(0, 0, 0, 0.4);
          }
        }
        .quotation {
          margin-top: 4rpx;
          margin-left: 20rpx;
          background: #eeeeee;
          padding: 4rpx 8rpx;
          font-size: 23rpx;
          font-weight: 400;
          color: #333333;
        }
      }
    }
  }
  .bottom-operate {
    display: flex;
    position: fixed;
    width: 100%;
    bottom: 67rpx;
    justify-content: center;
    column-gap: 31rpx;
    .btn {
      text-align: center;
      line-height: 92rpx;
      height: 92rpx;
      font-size: 27rpx;
      &.left {
        width: 254rpx;
        background: #ffffff;
        border: 2rpx solid #dddddd;
        color: #000000;
      }
      &.right {
        width: 396rpx;
        background: #000000;
        border-radius: 4rpx;
        color: #ffffff;
      }
    }
  }
}
</style>
