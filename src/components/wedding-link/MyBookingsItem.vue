<template>
  <div class="container">
    <!-- 预定日期 -->
    <div class="date">
      预定日期：{{ date }}
    </div>
    <!-- 时间段 -->
    <div
      class="period"
      :class="period ? periodClassMap[period] : ''"
    >
      {{ period }}
    </div>
    <!-- 状态 -->
    <div class="status">
      {{ hasBeenResolved?'':'等待处理' }}
    </div>
    <!-- 客户姓名 -->
    <div class="name">
      客户姓名：{{ name }}
    </div>
    <!-- 客户电话 -->
    <div class="phone">
      客户电话：{{ phone }}
    </div>
    <!-- 备注 -->
    <div class="remark">
      备注：{{ remark }}
    </div>
    <!-- 立即联系按钮 -->
    <div
      class="contact"
      @click="onContactClick"
    >
      立即联系
    </div>
  </div>
</template>

<script setup lang="ts">

type Props = {
  bookingId: string,
  date: string;
  period: ''|Period;
  /** 是否已处理 */
  hasBeenResolved: boolean;
  name: string;
  phone: string;
  remark: string;
}

const props = withDefaults(defineProps<Props>(), {
  date: '',
  period: '',
  hasBeenResolved: true,
  name: '',
  phone: '',
  remark: '',
});

type Emit = {
  /** 点击立即联系按钮 */
  (e: 'onContactClick', id:string): void
}

const emit = defineEmits<Emit>();

/** 各时间段对应的类名 */
const periodClassMap = {
  早上: 'morning',
  上午: 'forenoon',
  午宴: 'noon',
  下午: 'afternoon',
  晚宴: 'evening',
  全天: 'all-day',
};

/** 点击立即联系按钮 */
const onContactClick = () => {
  emit('onContactClick', props.bookingId);
};
</script>

<style scoped lang="scss">
.container{
  background-color: #fff;
  border-radius: 2px;

  padding: 13px 10px;
  display: grid;
  grid-template:
    'date period status' min-content
    '. . .' 16px
    'name name name' min-content
    '. . .' 10px
    'phone phone phone' min-content
    '. . .' 10px
    'remark remark remark' min-content
    '. . .' 16px
    '. . contact' min-content
    /170px 1fr 1fr;
  column-gap: 10px;

  .date{
    grid-area: date;

    font-size: 15px;
    font-weight: bold;
    color: #333;
  }

  .period{
    grid-area: period;

    width: 52px;
    height: 19px;

    border-radius: 2px;

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 12px;

    // 早上
    &.morning {
      background: #d5e4d8;

      color: #54BD6B;
    }

    // 上午
    &.forenoon {
      background: #DBF2FF;

      color: #61C6FF;
    }

    // 午宴
    &.noon {
      background: #FFF2DB;

      color: #EBBC6B;
    }

    // 下午
    &.afternoon {
      background: #DBE3FF;

      color: #003DB4;
    }

    // 晚宴
    &.evening {
      background: #F3E7FF;

      color: #470886;
    }

    // 全天
    &.all-day {
      background: #FFDBDB;

      color: #EB736B;
    }
  }

  .status{
    grid-area: status;
    justify-self: end;

    font-size: 15px;
    color: #2F80ED;
  }

  .name{
    grid-area: name;

    font-size: 15px;
    color: #333;
  }

  .phone{
    grid-area: phone;

    font-size: 15px;
    color: #333;
  }

  .remark{
    grid-area: remark;

    font-size: 15px;
    color: #333;
  }

  .contact{
    grid-area: contact;
    justify-self: end;

    width: 19.4872vw;
    height: 7.9487vw;

    background: #2f80ed;
    border-radius: 20px;;

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 11px;
    color: #fff;
  }
}
</style>
