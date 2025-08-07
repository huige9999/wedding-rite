<!-- 基于uni-calendar-item修改的日历项组件 -->
<template>
  <view
    class="uni-calendar-item__weeks-box"
    :class="{
      'uni-calendar-item--disable':weeks.disable,
      'uni-calendar-item--isDay':calendar.fullDate === weeks.fullDate && weeks.isDay,
      'uni-calendar-item--checked':(calendar.fullDate === weeks.fullDate && !weeks.isDay) ,
      'uni-calendar-item--before-checked':weeks.beforeMultiple,
      'uni-calendar-item--multiple': weeks.multiple,
      'uni-calendar-item--after-checked':weeks.afterMultiple,
    }"
  >
    <view class="uni-calendar-item__weeks-box-item">
      <text
        v-if="selected&&weeks.extraInfo"
        class="uni-calendar-item__weeks-box-circle"
      />
      <text
        class="uni-calendar-item__weeks-box-text"
        :class="{
          'uni-calendar-item--isDay-text': weeks.isDay,
          'uni-calendar-item--isDay':calendar.fullDate === weeks.fullDate && weeks.isDay,
          'uni-calendar-item--checked':calendar.fullDate === weeks.fullDate && !weeks.isDay,
          'uni-calendar-item--before-checked':weeks.beforeMultiple,
          'uni-calendar-item--multiple': weeks.multiple,
          'uni-calendar-item--after-checked':weeks.afterMultiple,
          'uni-calendar-item--disable':weeks.disable,
        }"
      >
        {{ weeks.date }}
      </text>
      <text
        v-if="!lunar&&!weeks.extraInfo && weeks.isDay"
        class="uni-calendar-item__weeks-lunar-text"
        :class="{
          'uni-calendar-item--isDay-text':weeks.isDay,
          'uni-calendar-item--isDay':calendar.fullDate === weeks.fullDate && weeks.isDay,
          'uni-calendar-item--checked':calendar.fullDate === weeks.fullDate && !weeks.isDay,
          'uni-calendar-item--before-checked':weeks.beforeMultiple,
          'uni-calendar-item--multiple': weeks.multiple,
          'uni-calendar-item--after-checked':weeks.afterMultiple,
        }"
      >
        {{ todayText }}
      </text>
      <text
        v-if="selected&&weeks.extraInfo"
        class="uni-calendar-item__weeks-lunar-text"
        :class="{
          'uni-calendar-item--isDay-text':weeks.isDay,
          'uni-calendar-item--isDay':calendar.fullDate === weeks.fullDate && weeks.isDay,
          'uni-calendar-item--checked':calendar.fullDate === weeks.fullDate && !weeks.isDay,
          'uni-calendar-item--before-checked':weeks.beforeMultiple,
          'uni-calendar-item--multiple': weeks.multiple,
          'uni-calendar-item--after-checked':weeks.afterMultiple,
          'uni-calendar-item--disable':weeks.disable,
        }"
      >
        {{ weeks.isDay ? todayText : (weeks.lunar.IDayCn === '初一'?weeks.lunar.IMonthCn:weeks.lunar.IDayCn) }}
      </text>
    </view>
  </view>
</template>

<script>
import { initVueI18n } from '@dcloudio/uni-i18n'
import i18nMessages from './i18n/index.js'

const {	t	} = initVueI18n(i18nMessages)

export default {
  props: {
    weeks: {
      type: Object,
      default() {
        return {}
      },
    },
    calendar: {
      type: Object,
      default: () => ({}),
    },
    selected: {
      type: Array,
      default: () => [],
    },
    lunar: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['change'],
  computed: {
    todayText() {
      return t('uni-calender.today')
    },
  },
}
</script>

<style lang="scss" scoped>
$uni-font-size-base: 14px;
$uni-text-color: #333;
$uni-font-size-sm: 12px;
$uni-color-error: #e43d33;
$uni-opacity-disabled: 0.3;
$uni-text-color-disable: #c0c0c0;
$uni-primary: #2979ff !default;

.uni-calendar-item__weeks-box {
  /* #ifndef APP-NVUE */
  display: flex;
  flex: 1;

  /* #endif */
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.uni-calendar-item__weeks-box-item {
  position: relative;

  width: 13.3333vw;
  height: 13.3333vw;

  display: grid;
  grid-template:
    'text'1fr
    'extra'1fr;
  align-items: center;
  justify-items: center;
}

.uni-calendar-item__weeks-box-text {
  grid-area: text;

  font-size: 14px;
  color: $uni-text-color;
}

.uni-calendar-item__weeks-lunar-text {
  grid-area: extra;
  align-self: start;

  font-size: 10px;
  color: #C0C4CC;
}

.uni-calendar-item__weeks-box-circle {
  position: absolute;
  bottom: 5px;
  left: 50%;

  width: 4px;
  height: 4px;

  background-color: #1979FF;
  border-radius: 8px;

  transform: translateX(-50%);

}

.uni-calendar-item--disable {
  background-color: rgba(249, 249, 249, $uni-opacity-disabled);

  color: $uni-text-color-disable;
}

.uni-calendar-item--isDay {
  .uni-calendar-item__weeks-box-item{
    .uni-calendar-item__weeks-box-text{
      position: relative;
      z-index: 0;

      color: #fff;

      // 圆形背景

      &::before{
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: -1;

        width: 25px;
        height: 25px;

        content: '';

        background: #1979ff;
        border: 2.08px solid #d0e3ff;
        border-radius: 25px;

        transform: translate(-50%, -50%);
      }
    }
  }
}

.uni-calendar-item--extra {
  color: #C0C4CC;
}

.uni-calendar-item--checked {
  background-color: $uni-primary;
  opacity: 0.8;

  color: #fff;
}

.uni-calendar-item--multiple {
  background-color: $uni-primary;
  opacity: 0.8;

  color: #fff;
}

.uni-calendar-item--before-checked {
  background-color: #ff5a5f;

  color: #fff;
}

.uni-calendar-item--after-checked {
  background-color: #ff5a5f;

  color: #fff;
}
</style>
