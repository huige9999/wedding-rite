<template>
  <div class="listWrap">
    <div
      v-if="scheduleTotal === 0"
      class="noSchedule"
    >
      <image
        src="https://ustatic.joymew.com/joymewApp/noSchedules.png"
        mode="widthFix"
        class="noImg"
      />
      <div class="tip">
        没有档期
      </div>
    </div>
    <div
      v-if="scheduleTotal > 0"
      class="schedules"
    >
      <div class="pickerWrap">
        <picker
          mode="selector"
          :range="yearRange"
          range-key="name"
          class="myPicker"
          @change="bindYearChange"
        >
          {{ currentYear }}
        </picker>
        <div class="unit">
          年
        </div>
      </div>
      <div
        v-if="scheduleListDisplay.length === 0"
        class="noSchedule"
      >
        <image
          src="https://ustatic.joymew.com/joymewApp/noSchedules.png"
          mode="widthFix"
          class="noImg"
        />
        <div class="tip">
          没有档期
        </div>
      </div>
      <div
        v-for="item in scheduleListDisplay"
        :key="item.year"
        class="yearItem"
      >
        <div class="year">
          {{ item.year }}年
        </div>
        <div
          v-for="itemMonth in item.dataList"
          :key="itemMonth.month"
          class="monthItem"
        >
          <div class="month">
            {{ itemMonth.month }}月
          </div>
          <div class="day">
            <div
              v-for="itemDay in itemMonth.dataList"
              :key="itemDay.schedule_id"
              class="dayItem"
            >
              <text>{{ itemDay.day }}日</text>
              <text>{{ itemDay.time_interval }}</text>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  scheduleList: {
    type: Array,
    default: () => [],
  },
  scheduleTotal: {
    type: Number,
    default: 0,
  },
});

const scheduleListDisplay = ref([]);
const currentYear = ref(2023);
const yearRange = ref([]);

const updateScheduleListDisplay = () => {
  const scheduleListTmp = props.scheduleList;
  if (scheduleListTmp.length === 0) {
    return;
  }
  const scheduleListDisplayTmp = scheduleListDisplay.value;
  scheduleListDisplayTmp.splice(0);
  const targetIndex = scheduleListTmp.findIndex((item) => item.year === String(currentYear.value));
  if (targetIndex > -1) {
    scheduleListDisplayTmp.push(scheduleListTmp[targetIndex]);
  }
  scheduleListDisplay.value = scheduleListDisplayTmp;
};

const bindYearChange = (e) => {
  currentYear.value = yearRange.value[e.detail.value].id;
  updateScheduleListDisplay();
};

const initYearInfo = () => {
  const tmpYearRange = [];
  for (let i = 2022; i < 2050; i += 1) {
    tmpYearRange.push({
      id: i,
      name: `${i}年`,
    });
  }
  currentYear.value = new Date().getFullYear();
  yearRange.value = tmpYearRange;
};

// 监听sheduleTotal是否发生变化
watch(
  () => props.scheduleTotal,
  (newVal) => {
    if (newVal > 0) {
      updateScheduleListDisplay();
    }
  },
);

onMounted(() => {
  initYearInfo();
});
</script>

<style scoped>
.noSchedule {
  padding-top: 266rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.noSchedule .noImg {
  width: 442rpx;
  height: 304rpx;
}

.noSchedule .tip {
  font-size: 28rpx;
  font-weight: 400;
  color: #868c9b;
  line-height: 40rpx;
  margin-top: 46rpx;
}

.schedules {
  padding: 74rpx 40rpx;
  padding-bottom: 100rpx;
}

.schedules .title {
  display: flex;
  align-items: center;
  font-size: 28rpx;
  font-weight: 600;
  color: #010101;
  line-height: 72rpx;
  margin-bottom: 42rpx;
}

.schedules .title .attentionIcon {
  margin-left: 8rpx;
}

.schedules .yearItem .year {
  font-size: 28rpx;
  font-weight: 500;
  color: #010101;
  line-height: 72rpx;
  margin-bottom: 10rpx;
}

.schedules .yearItem .monthItem {
  margin-bottom: 100rpx;
  display: flex;
}

.schedules .yearItem .monthItem .month {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 88rpx;
  height: 88rpx;
  background: #ffffff;
  box-shadow: 0rpx 8rpx 18rpx 0rpx rgba(145, 167, 184, 0.21);
  border: 1rpx solid #ebedef;
  font-size: 28rpx;
  font-weight: 500;
  color: #010101;
  border-radius: 50%;
}

.schedules .yearItem .monthItem .day {
  display: flex;
  flex-wrap: wrap;
  width: 630rpx;
}

.schedules .yearItem .monthItem .day .dayItem {
  width: 88rpx;
  height: 88rpx;
  background: #ffffff;
  box-shadow: 0rpx 8rpx 18rpx 0rpx rgba(145, 167, 184, 0.21);
  border: 1rpx solid #ebedef;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin-left: 24rpx;
  margin-bottom: 20rpx;
}

.schedules .yearItem .monthItem .day .dayItem text:nth-child(1) {
  font-size: 24rpx;
  font-weight: 400;
  color: #010101;
  line-height: 34rpx;
}

.schedules .yearItem .monthItem .day .dayItem text:nth-child(2) {
  font-size: 20rpx;
  font-weight: 400;
  color: #b6bac4;
  line-height: 28rpx;
}

.schedules .yearItem .monthItem .day .dayItem.overdate {
  background: #d9dce3;
}

.schedules .yearItem .monthItem .day .dayItem.overdate text:nth-child(1) {
  color: #ffffff;
}

.schedules .yearItem .monthItem .day .dayItem.overdate text:nth-child(2) {
  color: #ffffff;
}

.pickerWrap {
  display: flex;
  align-items: center;
  margin-bottom: 40rpx;
}
.myPicker {
  background-color: #fff;
  border-radius: 8rpx;
  border: 2rpx solid #dcdfe6;
  box-sizing: border-box;
  color: #606266;
  height: 60rpx;
  line-height: 60rpx;
  text-align: center;
  width: 120rpx;
}

.unit {
  color: #010101;
  font-size: 28rpx;
  font-weight: 400;
  margin-left: 10rpx;
}
</style>
