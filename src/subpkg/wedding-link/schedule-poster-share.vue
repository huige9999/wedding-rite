<!--
  * 档期海报分享页面
  * @author: Ruan Jiazhen
  * @date: 2024-04-28  17:49:02
-->
<template>
  <div class="container">
    <!-- 背景 -->
    <image
      class="bg"
      :src="schedulePosterData.bgImg"
      mode="aspectFill"
    />
    <!-- 导航栏 -->
    <uni-nav-bar
      class="nav-bar"
      status-bar
      :border="false"
      background-color="#00000000"
      color="#ffffff"
      left-width="100px"
      @click-left="navigateTo('my-preview-share')"
    >
      <template #left>
        <uni-icons
          type="left"
          color="#fff"
        />
        <text class="nav-bar-left-text">
          档期海报
        </text>
      </template>
    </uni-nav-bar>
    <!-- 主体部分 -->
    <div class="main">
      <!-- 个人信息面板 -->
      <div class="info-board">
        <!-- 头像 -->
        <div class="avatar">
          <image
            class="avatar-img"
            :src="userInfo.avatar"
            mode="aspectFill"
          />
        </div>
        <!-- 姓名 -->
        <div class="name">
          {{ personalInfo.realName }}
        </div>
        <!-- 电话 -->
        <div class="phone">
          {{ schedulePosterData.isShowPhone ? userInfo.phone : '' }}
        </div>
        <!-- 文字 -->
        <div class="text">
          {{ schedulePosterData.isShowText ? schedulePosterData.text : '' }}
        </div>
        <div class="month-selector">
          <div class="text">
            本年
          </div>
        </div>
        <!-- 档期数量 -->
        <p class="schedule-count">
          共定档
          <span class="count">{{ scheduleCount }}</span>
          个
        </p>
        <!-- 分隔线 -->
        <div class="hr" />
        <!-- 档期列表 -->
        <div class="schedule">
          <div
            v-for="(monthList, index) in scheduleListAfterMonth"
            :key="index"
            class="month-schedule"
          >
            <div
              class="schedule-title"
            >
              <div class="month">
                {{ monthList.month }}月
              </div>
              <div class="year">
                {{ monthList.year }}
              </div>
            </div>
            <div class="schedule-list">
              <!-- 单个档期项 -->
              <div
                v-for="schedule in monthList.scheduleList"
                :key="schedule.id"
                class="schedule-list-item"
                :class="
                  lunisolar(schedule.date).format('YYYY-MM-DD') ===
                    lunisolar().format('YYYY-MM-DD') ?
                      'active' :
                      ''"
              >
                <div class="day">
                  {{ lunisolar(schedule.date).day }}日
                </div>
                <div class="period">
                  {{ schedule.period }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <HostInfoBar
    :id="userInfo.id"
    :avatar="userInfo.avatar"
    :phone="userInfo.phone"
    :real-name="personalInfo.realName||''"
  />
</template>
<script lang="ts" setup>
import { reqGetScheduleListAfterDate } from '@/api/schedule-api';
import HostInfoBar from '@/components/wedding-link/HostInfoBar.vue';
import { SCHEDULE_POSTER_SHARE_COVER } from '@/static/constants/view-constants';
import { useSchedule } from '@/stores/schedule-store';
import useUser from '@/stores/user-store';
import { navigateTo } from '@/utils/navigate';
import { parseScheduleList } from '@/utils/parse';
import lunisolar from 'lunisolar';

const scheduleStore = useSchedule();
const { schedulePosterData } = storeToRefs(scheduleStore);

const userStore = useUser();
const { userInfo, personalInfo, tempUserInfo } = storeToRefs(userStore);

// #region 档期相关

/** 本月及之后今年的档期 */
const scheduleListAfterMonth = ref<AllScheduleList>([]);

/** 共定档数量 */
const scheduleCount = computed(() => {
  const count = scheduleListAfterMonth.value.reduce((acc, cur) => acc + cur.scheduleList.length, 0);
  return count;
});

// 监听用户信息变化，当获取到用户信息后，获取档期列表
// XXX 之所以使用监听，是因为在App.vue中发出了获取用户信息的请求，但是不知道什么时候会获取到，后续有更好的方法再改
watch(userInfo, async () => {
  if (userInfo.value.id) {
    const res = await reqGetScheduleListAfterDate(lunisolar().format('YYYY-MM'), userInfo.value.id);
    scheduleListAfterMonth.value = parseScheduleList(res);
    console.log('scheduleListAfterMonth', scheduleListAfterMonth.value);
  }
}, { immediate: true });

// #endregion

// #region 分享相关

// 分享事件回调
onShareAppMessage(() => ({
  title: '我的档期己更新，快来查看吧',
  path: `/subpkg/wedding-link/schedule-poster-share?userId=${userInfo.value.id}&inviterId=${tempUserInfo.value.id}`,
  imageUrl: SCHEDULE_POSTER_SHARE_COVER,
}));

// #endregion
</script>
<style lang="scss" scoped>
.container {
  position: relative;

  width: 100vw;
  min-height: 100vh;

  display: grid;
  grid-template:
    'nav-bar' auto
    'main' auto;

  // 背景
  .bg {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;

    width: 100%;
    height: 100%;
  }

  .nav-bar {
    grid-area: nav-bar;

    .center {
      width: 100%;
      height: 100%;

      display: flex;
      justify-content: center;

      .gear-icon {
        align-self: center;

        width: 5.1282vw;
        height: 5.1282vw;
      }
    }
  }

  .main {
    grid-area: main;

    display: grid;
    grid-template:
      'change-image-btn' 39.2308vw
      'info-board' auto;
    justify-items: center;

    // 更换图片按钮
    .change-image-btn {
      grid-area: change-image-btn;
      align-self: center;
      justify-self: center;

      position: relative;

      width: 31.7949vw;
      height: 10.2564vw;

      .border {
        position: absolute;
        top: 0;
        left: 0;

        width: 100%;
        height: 100%;
      }

      .text {
        position: absolute;
        top: 50%;
        left: 50%;

        transform: translate(-50%, -50%);

        font-size: 3.5897vw;
        color: #fff;
      }
    }

    // 个人信息面板
    .info-board {
      grid-area: info-board;

      width: 100%;

      background: rgb(0 0 0 / 30%);
      backdrop-filter: blur(4px);

      padding: 8px 16px 30px;
      display: grid;
      grid-template:
        'avatar name' 5.3846vw
        'avatar phone' 4.6154vw
        '. .' 11px
        'text text' auto
        '. .' 38px
        'month-selector schedule-count' 5.3846vw
        '. .' 5px
        'hr hr' 1.5385vw
        '. .' 25px
        'schedule-list schedule-list' minmax(50vw, auto) 'qr-code qr-code' 40vw
        / 24.6154vw 1fr;

      // 头像
      .avatar {
        grid-area: avatar;

        width: 80px;
        height: 80px;
        overflow: hidden;

        border: 4px solid #fff;
        border-radius: 50%;

        transform: translateY(-50%);

        .avatar-img {
          width: 100%;
          height: 100%;
        }
      }

      // 姓名
      .name {
        grid-area: name;

        font-size: 3.8462vw;
        font-weight: bold;
        color: #fff;
      }

      // 电话
      .phone {
        grid-area: phone;

        font-size: 3.3333vw;
        color: #f8d58f;
      }

      // 文字
      .text {
        grid-area: text;
        justify-self: center;

        width: calc(100% - 12px);

        font-size: 4.359vw;
        line-height: 1.5;
        color: #fff;

        // 两端对齐
        text-align: justify;
      }

      // 月份选择器
      .month-selector {
        grid-area: month-selector;
        justify-self: start;

        width: 100%;

        display: flex;
        column-gap: 6px;
        align-items: center;
        justify-content: flex-start;

        .text {
          width: 10.5128vw;

          font-size: 5.1282vw;
          font-weight: bold;
          color: #fff;
        }

        .triangle-icon {
          width: 2.3077vw;
          height: 1.7949vw;
        }
      }

      // 定档数量
      .schedule-count {
        grid-area: schedule-count;
        justify-self: end;

        font-size: 3.8462vw;
        color: #fff;

        .count {
          color: #fd3055;
        }
      }

      // 分割线
      .hr {
        grid-area: hr;
        justify-self: center;

        width: calc(100% + 32px);
        height: 100%;

        background: #f3f3f3;
      }

      // 档期列表
      .schedule {
        grid-area: schedule-list;

        display: flex;
        flex-direction: column;
        row-gap: 10px;

        // 每月档期
        .month-schedule{
          display: grid;
          grid-template:
            'title list' auto
            / 13.3333vw 1fr;
          column-gap: 20px;

          // 标题
          .schedule-title {
            grid-area: title;

            width: 13.3333vw;
            height: 13.3333vw;

            background: #fff;
            border-radius: 2px;

            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            // 月份
            .month {
              font-size: 3.8462vw;
              color: #333;
            }

            // 年份
            .year {
              font-size: 2.8205vw;
              color: #8d8d8d;
            }
          }

          // 列表
          .schedule-list {
            grid-area: list;

            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            align-items: flex-start;
            justify-content: flex-start;

            // 档期项
            .schedule-list-item {
              width: 13.3333vw;
              height: 13.3333vw;

              background: #fff;
              border-radius: 2px;
              opacity: 0.5;

              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;

              .day {
                font-size: 3.8462vw;
                font-weight: bold;
                color: #333;
              }

              .period {
                font-size: 2.8205vw;
                font-weight: bold;
                color: #333;
              }

              // 激活状态
              &.active {
                opacity: 1;

                .day{
                  color: #F8D58F;
                }
              }
            }
          }
        }
      }

      // 二维码
      .qr-code {
        grid-area: qr-code;
        justify-self: center;

        width: 35.1282vw;
        height: 100%;

        display: flex;
        flex-direction: column;
        row-gap: 12px;
        align-items: center;
        justify-content: center;

        .qr-code-img {
          width: 28.7179vw;
          height: 28.7179vw;
        }

        .qr-code-text {
          font-size: 3.3333vw;
          color: #fff;
          text-align: center;
        }
      }
    }
  }
}

.share-btn {
  position: fixed;
  bottom: calc(38px + env(safe-area-inset-bottom));
  bottom: calc(38px + constant(safe-area-inset-bottom));
  left: 50%;

  width: 320px;
  height: 48px;

  background: linear-gradient(279deg, #ffd175 0%, #ffe8b7);
  border-radius: 40px;

  transform: translateX(-50%);

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 3.5897vw;
  color: #704c00;
}
</style>
