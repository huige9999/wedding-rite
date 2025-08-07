<!-- 添加档期弹窗 -->
<template>
  <uni-popup
    ref="popup"
    type="bottom"
    :safe-area="false"
  >
    <div class="container">
      <!-- 姓名输入栏 -->
      <div class="input-item name">
        <div class="label">
          您的姓名：
        </div>
        <input
          v-model="bookingData.name"
          class="input"
          inputmode="text"
          placeholder="请填写姓名"
        >
      </div>
      <!-- 联系方式输入栏 -->
      <div class="input-item phone">
        <div class="label">
          联系方式：
        </div>
        <input
          v-model="bookingData.phone"
          class="input"
          inputmode="tel"
          placeholder="请填写电话号码"
        >
      </div>
      <!-- 预定日期输入栏 -->
      <div class="input-item date">
        <div class="label">
          预定日期：
        </div>
        <picker
          class="input"
          :class="bookingData.date? '':'placeholder'"
          mode="date"
          :value="bookingData.date"
          :start="Lunisolar().format('YYYY-MM-DD')"
          @change="onDateChange"
        >
          {{ bookingData.date? bookingData.date:'请选择日期' }}
        </picker>
      </div>
      <!-- 时间段选择栏 -->
      <div class="input-item period">
        <div class="label">
          预定时段：
        </div>
        <uni-data-select
          v-model="periodDefaultValue"
          class="input"
          :localdata="periodList"
          placeholder="请选择时段"
          @change="onPeriodChange"
        />
      </div>
      <!-- 留言备注输入栏 -->
      <div class="input-item remark">
        <div class="label">
          留言备注：
        </div>
        <textarea
          class="input"
          :value="bookingData.remark"
          maxlength="100"
          placeholder="输入内容"
          @input="onTextareaInput"
        />
      </div>
      <!-- 「取消」按钮 -->
      <div
        class="btn cancel"
        @click="close"
      >
        取消
      </div>
      <!-- 「确定」按钮 -->
      <div
        class="btn confirm"
        @click="onConfirmClick"
      >
        确定
      </div>
    </div>
  </uni-popup>
</template>

<script setup lang="ts">
import { showToast } from '@/utils/tools';
import type { UniDataSelectOnChange, UniPopupInstance } from '@uni-helper/uni-ui-types';
import Lunisolar from 'lunisolar';

const ctx = getCurrentInstance();

type Emit = {
  (e: 'onConfirmClick', data: BookingSubmitData): void
}

const emit = defineEmits<Emit>();

/** 时间段列表 */
const periodList = (() => ['早上', '上午', '午宴', '下午', '晚宴', '全天'].map((item, index) => ({
  value: index,
  text: item,
})))();

/** 时间段默认选择值 */
const periodDefaultValue = ref(-1);

/** 输入的预定数据 */
const bookingData = ref<BookingSubmitData>({
  name: '',
  phone: '',
  date: '',
  period: '',
  remark: '',
});

/** 打开弹窗 */
const open = () => {
  if (!ctx) return;
  const popup = ctx.refs.popup as UniPopupInstance;
  if (!popup.open) return;
  popup?.open();
};

/** 关闭弹窗 */
const close = () => {
  if (!ctx) return;
  const popup = ctx.refs.popup as UniPopupInstance;
  if (!popup.close) return;
  popup?.close();
};

/** 重置数据 */
const resetData = () => {
  bookingData.value = {
    name: '',
    phone: '',
    date: '',
    period: '',
    remark: '',
  };
  periodDefaultValue.value = -1;
};

/**
 * 日期选择事件
 * @param {string} e 选择的日期
 */
const onDateChange = (e:AnyObject) => {
  console.log('onDateChange', e.detail.value);
  bookingData.value.date = e.detail.value;
};

/**
 * 时间段选择事件
 * @param {string} e 选择的时间段的value
 */
const onPeriodChange:UniDataSelectOnChange = (e) => {
  console.log('onPeriodChange', e);
  bookingData.value.period = periodList.find((item) => item.value === e)?.text || '';
};

/**
 * 文本域输入事件
 * @param {string} e 输入的内容
 */
const onTextareaInput = (e:AnyObject) => {
  console.log('onTextareaInput', e.detail.value);
  bookingData.value.remark = e.detail.value;
};

/**
 * 校验表单数据
 * @param {BookingSubmitData} data 表单数据
 * @returns {string} 校验结果
 */
const validate = (data:BookingSubmitData) => {
  if (!data.name) return '请填写姓名';
  if (!data.phone) return '请填写联系方式';
  if (!/^1[3456789]\d{9}$/.test(data.phone)) return '请填写正确的联系方式';
  if (!data.date) return '请选择预定日期';
  return '';
};

/** 「确定」按钮点击事件 */
const onConfirmClick = () => {
  const validateResult = validate(bookingData.value);
  if (validateResult) {
    showToast(validateResult);
    return;
  }
  emit('onConfirmClick', bookingData.value);
};

defineExpose({
  open,
  close,
  resetData,
});

</script>

<style scoped lang="scss">
.container{
  overflow: hidden;

  background: #fff;
  border-radius: 15px 15px 0 0;
  box-shadow: 0 -2px 4px 0 rgb(0 0 0 / 10%);

  padding: 0 16px 48px;
  display: grid;
  grid-template:
    'name name' min-content
    'phone phone' min-content
    'date date' min-content
    'period period' min-content
    'remark remark' min-content
    '. .' 41px
    'cancel confirm' min-content
    / 1fr 1fr;
  place-items: center;

  .input-item{
    width: 100%;
    min-height: 16.9231vw;

    padding: 8px 0;
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: minmax(80px, min-content) 1fr;
    grid-column-gap: 8px;
    align-items: center;
  }

  // 姓名输入栏
  .name{
    grid-area: name;

    border-bottom: 1px solid #f1f1f1;
  }

  // 联系方式输入栏
  .phone{
    grid-area: phone;

    border-bottom: 1px solid #f1f1f1;
  }

  // 预定日期输入栏
  .date{
    grid-area: date;
    justify-self: stretch;

    .input{
      height: 33px;

      background: #fff;
      border: 1px solid #f1f1f1;
      border-radius: 2px;

      padding-left: 16px;
      display: grid;
      align-items: center;

      &.placeholder{
        color: #6a6a6a;
      }
    }
  }

  // 时间段选择栏
  .period{
    grid-area: period;

    .input{
      width: 121px;
      height: 33px;

      background: #fff;
      border-radius: 2px;

      display: grid;
      align-items: center;
    }
  }

  // 留言备注输入栏
  .remark{
    grid-area: remark;

    height: 88px;

    .label{
      align-self: start;

      height: 100%;

    }

    .input{
      justify-self: stretch;

      width: 100%;
      height: 80px;

      background-color: #F7F7F7;

      padding: 7px 16px;
    }
  }

  // 「取消」按钮
  .cancel{
    grid-area: cancel;

    font-size: 14px;
    color: #8d8d8d;
  }

  // 「确定」按钮
  .confirm{
    grid-area: confirm;

    width: 165px;
    height: 38px;

    background: linear-gradient(283deg,#ffd175 0%, #ffe8b7);
    border-radius: 39px;

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 14px;
    color: #fff;
  }

}
</style>
