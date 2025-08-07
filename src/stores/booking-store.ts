/**
  * 预定数据相关的store
  * @author: Ruan Jiazhen
  * @date: 2024-04-28 17:25:39
* */

import { reqGetMyBookingList } from '@/api/booking-api';
import { parseBookingsList } from '@/utils/parse';

export const useBooking = defineStore('booking', () => {
  /** 预定列表 */
  const bookingList = ref<BookingInfo[]>([]);

  /** 分页参数 */
  const pagination = reactive({
    currentPage: 1,
    pageSize: 20,
    total: 0,
  });

  /**
   * 获取并设置预定列表
   * @param isRefresh 是否刷新
   */
  const getAndSetBookingList = async (isRefresh = false) => {
    if (isRefresh) {
      pagination.currentPage = 1;
      pagination.total = 0;
    }

    if (pagination.total !== 0 && bookingList.value.length >= pagination.total) return console.log('预定列表已全部加载完毕');

    const getMyBookingListResData = (await reqGetMyBookingList())?.data as GetBookingsListResData;

    if (getMyBookingListResData.code !== 200) return console.error(getMyBookingListResData.msg || '获取预定列表失败');

    pagination.total = getMyBookingListResData.data.totalResult;
    pagination.currentPage += 1;
    // 返回的数据默认是按照新增时间排序的，新的在后面，所以需要反转一下
    bookingList.value.push(...parseBookingsList(getMyBookingListResData).reverse());
    return console.log('获取预定列表成功', bookingList.value);
  };

  return {
    bookingList,
    getAndSetBookingList,
  };
});
