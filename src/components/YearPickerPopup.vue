<!-- 底部年份选择器弹窗 -->
<template>
  <uni-popup
    ref="yearPickerPopup"
    type="bottom"
    background-color="#fff"
  >
    <div class="year-picker">
      <div class="year-picker-title">
        <div
          class="left"
          @click="cancelBtnClick"
        >
          取消
        </div>
        <div class="center">
          选择年份
        </div>
        <div
          class="right"
          @click="confirmBtnClick"
        >
          确定
        </div>
      </div>
      <picker-view
        class="year-picker-view"
        :value="initialValue"
        indicator-style="height: 50px"
        @change="yearPickerChange"
      >
        <picker-view-column>
          <view
            v-for="item in yearList"
            :key="item"
            class="year-item"
          >
            {{ item }}
          </view>
        </picker-view-column>
      </picker-view>
    </div>
  </uni-popup>
</template>

<script setup lang="ts">
import type { UniPopup } from '@uni-helper/uni-ui-types';

const ctx = getCurrentInstance();

type Props = {
  /** 起始年份 */
  startYear: number
  /** 结束年份 */
  endYear: number
  /** 初始显示年份 */
  currentYear: number
}

const props = withDefaults(defineProps<Props>(), {
  startYear: 2022,
  endYear: new Date().getFullYear(),
  currentYear: new Date().getFullYear(),
});

onMounted(() => {
  console.log('props', props);
});

const emit = defineEmits<{(e: 'change', value: number): void }>();

/** 当前选择年份 */
const selectedYear = ref(new Date().getFullYear());

/** 取消按钮点击事件 */
const cancelBtnClick = () => {
  (ctx?.refs.yearPickerPopup as UniPopup).close();
};

/** 确定按钮点击事件 */
const confirmBtnClick = () => {
  emit('change', selectedYear.value);
  const yearPickerPopup = ctx?.refs?.yearPickerPopup as UniPopup;
  yearPickerPopup.close();
};

/** 可选择年份列表 */
const yearList = (() => Array.from(
  { length: props.endYear - props.startYear + 1 },
  (v, i) => props.startYear + i,
))();

/** 初始显示的选择器的值 */
const initialValue = (() => {
  const index = yearList.findIndex((item) => item === props.currentYear);
  return Array.from(
    { length: 1 },
    () => index,
  );
})();

/** 年份选择器修改事件 */
const yearPickerChange = (e: any) => {
  selectedYear.value = yearList[e.detail.value];
};

// 对外暴露的方法
defineExpose({
  open: () => {
    (ctx?.refs.yearPickerPopup as UniPopup).open();
  },
  close: () => {
    (ctx?.refs.yearPickerPopup as UniPopup).close();
  },
});
</script>

<style scoped lang="scss">
.year-picker {
  width: 100vw;
  height: calc(54.1026vw + env(safe-area-inset-bottom));
  height: calc(54.1026vw + constant(safe-area-inset-bottom));

  // 年份选择器标题
  .year-picker-title {
    width: 100%;
    height: 14.359vw;

    border-bottom: 1px solid #f3f3f3;

    padding: 15px 12px;
    display: grid;
    grid-template:
      'left center right' 1fr
      / 1fr 1fr 1fr;
    align-items: center;
    justify-items: center;

    // 左侧按钮
    .left {
      grid-area: left;
      justify-self: start;

      width: 11.5385vw;
      height: 6.4103vw;

      display: flex;
      align-items: center;
      justify-content: center;

      font-size: 3.0769vw;
      color: #8d8d8d;
    }

    // 中间标题
    .center {
      grid-area: center;

      display: flex;
      align-items: center;
      justify-content: center;

      font-size: 4.359vw;
      color: #333;
    }

    // 右侧按钮
    .right {
      grid-area: right;
      justify-self: end;

      width: 11.5385vw;
      height: 6.4103vw;

      background: linear-gradient(300deg, #ffd175 0%, #ffe8b7);
      border-radius: 4px;

      display: flex;
      align-items: center;
      justify-content: center;

      font-size: 3.0769vw;
      color: #fff;
    }
  }

  // 年份选择器view部分
  .year-picker-view {
    width: 100%;
    height: 38.4615vw;

    .year-item {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
