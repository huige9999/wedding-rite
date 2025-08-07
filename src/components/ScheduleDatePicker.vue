<!-- 档期日期选择器 -->
<template>
  <!-- 日期 -->
  <picker-view
    class="date-picker"
    indicator-style="height: 13.3333vw;"
    :value="currentValues"
    @change="pickerViewChange"
  >
    <picker-view-column>
      <view
        v-for="(item, index) in years"
        :key="index"
        class="item"
      >
        {{ item }}年
      </view>
    </picker-view-column>
    <picker-view-column>
      <view
        v-for="(item, index) in months"
        :key="index"
        class="item"
      >
        {{ item }}月
      </view>
    </picker-view-column>
    <picker-view-column>
      <view
        v-for="(item, index) in days"
        :key="index"
        class="item"
      >
        {{ item }}日
      </view>
    </picker-view-column>
    <picker-view-column>
      <view
        v-for="(item, index) in periods"
        :key="index"
        class="item"
      >
        {{ item }}
      </view>
    </picker-view-column>
  </picker-view>
</template>

<script setup lang="ts">
import type { PickerViewOnChangeEvent } from '@uni-helper/uni-app-types';
import { getRemainingDayList } from '@/utils/tools';
import lunisolar from 'lunisolar';

type Emits = {
  (e: 'change', { date, period }: { date: string; period: string }): void
}

const emit = defineEmits<Emits>();

type Props = {
  date: string
  period: string
}

const props = defineProps<Props>();

/** 当前选择的值 */
const currentValues = ref([0, 0, 0, 0]);

/** 年份，从今年开始往后推 10 年 */
const years = computed(() => {
  const currentYear = lunisolar().year;
  const temYears = [];
  for (let i = 0; i < 10; i += 1) {
    temYears.push(currentYear + i);
  }
  return temYears;
});

/** 可选择的月份 */
const months = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

/** 可选择的日期 */
const days = computed(() => {
  const year = years.value[currentValues.value[0]];
  const month = months.value[currentValues.value[1]];

  return getRemainingDayList(year, month, '1900-01-01');
});

/** 当前选择的日期（字符串） */
const currentDate = computed(() => {
  const year = years.value[currentValues.value[0]];
  const month = months.value[currentValues.value[1]];
  const day = days.value[currentValues.value[2]];
  return lunisolar(`${year}-${month}-${day}`).format('YYYY-MM-DD');
});

/** 可选择的时段 */
const periods = ref(['早上', '上午', '午宴', '下午', '晚宴', '全天']);

// 挂载后根据 props.date 初始化 initValue
onMounted(() => {
  currentValues.value = (() => {
    const dateObj = new Date(props.date);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();

    const yearIndex = years.value.findIndex((item) => item === year);
    const monthIndex = months.value.findIndex((item) => item === month);
    const dayIndex = days.value.findIndex((item) => item === day);
    const periodIndex = periods.value.findIndex((item) => item === props.period);

    return [yearIndex, monthIndex, dayIndex, periodIndex];
  })();
});

/** 当前选择的时间段 */
const currentPeriod = computed(
  () => periods.value[currentValues.value[3]] as ScheduleInfo['period'],
);

/**
 * 选择器修改事件
 * @param e 事件对象
 */
const pickerViewChange = (e: PickerViewOnChangeEvent) => {
  currentValues.value = e.detail.value;
  emit('change', {
    date: currentDate.value,
    period: currentPeriod.value,
  });
};
</script>

<style scoped lang="scss">
// 日期
.date-picker {
  width: 100%;
  height: 49.2308vw;

  .item {
    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 15px;
    text-align: center;
  }
}
</style>
