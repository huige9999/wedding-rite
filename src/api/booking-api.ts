// 预定相关接口

import { reqGet, reqPost } from './request';

/**
 * 获取我的预定列表
 * @param currentPage 当前页码 默认1
 * @param pageSize 每页条数 默认20
 */
export const reqGetMyBookingList = (currentPage = 1, pageSize = 20) => reqGet('/schedule/getUserSchedule2', {
  currentPage,
  showCount: pageSize,
});

/**
 * 将预定状态改为已处理
 * @param bookingId 预定id
 */
export const reqSetBookingResolved = (bookingId: string) => reqGet('/schedule/setBookingResolved', { bookingId });

/**
 * 提交预定
 * @param targetUserId 要预定的主持人的用户id
 * @param bookingSubmitData 预定信息
 */
export const reqSubmitBooking = (targetUserId:string, bookingSubmitData: BookingSubmitData) => reqPost('/schedule/submitBooking', {
  targetUserId,
  customer_name: bookingSubmitData.name,
  customer_phone: bookingSubmitData.phone,
  date: bookingSubmitData.date,
  time_interval: bookingSubmitData.period,
  remark: bookingSubmitData.remark,
});
