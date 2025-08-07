<!-- 「我的预定」页面 -->
<template>
  <div class="container">
    <uni-nav-bar
      class="nav-bar"
      title="我的预定"
      status-bar
      :border="false"
      left-icon="left"
      @click-left="back"
    />
    <div class="main">
      <div class="tab-bar">
        <div
          v-for="tab in TAB_BAR_LIST"
          :key="tab"
          class="tab"
          :class="tab === currentTab ? 'active' : ''"
          @click="currentTab = tab"
        >
          {{ tab }}
        </div>
      </div>
      <div class="content">
        <MyBookingsItem
          v-for="item in showBookingsList"
          :key="item.id"
          :booking-id="item.id"
          :date="item.date"
          :period="item.period"
          :has-been-resolved="item.hasBeenResolved"
          :name="item.name"
          :phone="item.phone"
          :remark="item.remark"
          @on-contact-click="onContactClick"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reqSetBookingResolved } from '@/api/booking-api';
import MyBookingsItem from '@/components/wedding-link/MyBookingsItem.vue';
import { useBooking } from '@/stores/booking-store';
import { back } from '@/utils/navigate';
import { makePhoneCall } from '@uni-helper/uni-promises';

const bookingStore = useBooking();
const { bookingList } = storeToRefs(bookingStore);
const { getAndSetBookingList } = bookingStore;

// #endregion

// #region tabbar和对应显示的预定列表相关

onReachBottom(() => {
  getAndSetBookingList();
});

const TAB_BAR_LIST = [
  '新增预定',
  '已处理',
];

const currentTab = ref(TAB_BAR_LIST[0]);

/** 显示的预定列表 */
const showBookingsList = computed(() => {
  if (currentTab.value === TAB_BAR_LIST[0]) {
    return bookingList.value.filter((item) => !item.hasBeenResolved);
  }
  return bookingList.value.filter((item) => item.hasBeenResolved);
});

// #endregion

/** 点击「立即联系」回调事件 */
const onContactClick = (id: string) => {
  const bookingInfo = bookingList.value.find((item) => item.id === id);
  if (!bookingInfo) return;

  makePhoneCall({ phoneNumber: bookingInfo.phone || '' });

  // 如果已处理，则不再请求设置预定已处理
  if (bookingInfo.hasBeenResolved) return;

  // 请求设置预定已处理
  reqSetBookingResolved(id)
    .then((res) => {
      const resData = res?.data as ResData<null>;
      if (resData.code !== 200) {
        console.error(resData.msg || '设置预定已处理失败');
        return;
      }
      console.log('设置预定已处理成功', resData);
      bookingInfo.hasBeenResolved = true;
    })
    .catch((err) => {
      console.error('设置预定已处理失败', err);
    });
};

</script>

<style lang="scss" scoped>
.container{
  min-height: 100vh;

  background-color: #F9F9F9;

  display: grid;
  grid-template:
    'nav-bar' min-content
    'hr' 1px
    'main' 1fr;

  .main{
    grid-area: main;

    display: grid;
    grid-template:
      'tab-bar' min-content
      'content' 1fr
      /1fr;

    .tab-bar{
      grid-area: tab-bar;

      width: 100%;
      height: 10.5128vw;

      background: #fff;

      display: grid;
      grid-template-columns: repeat(auto-fill, 1fr);
      grid-auto-flow: column;
      place-items: center;

      .tab{
        height: 100%;

        display: flex;
        place-items: center;

        font-size: 15px;
        color: #333;

        // 选中
        &.active{
          position: relative;

          color: #2F80ED;

          &::after{
            position: absolute;
            bottom: 0;
            left: 50%;

            width: 28px;
            height: 2px;

            content: '';

            background: #2F80ED;

            transform: translateX(-50%);
          }
        }
      }
    }

    .content{
      grid-area: content;

      padding: 10px;
      display: flex;
      flex-direction: column;
      row-gap: 10px;
    }
  }
}
</style>
