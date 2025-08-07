// 档期相关的接口

import { reqGet, reqPost, reqUploadFile } from './request';

/**
 * 获取档期列表
 * @param isAll 是否获取全部档期
 * @param userId 要查询的用户的id，不传则默认查自己的
 */
export const reqGetScheduleList = (isAll: boolean, userId = '') => reqGet('/schedule/getScheduleInfo', {
  isShowAll: isAll ? '1' : '0',
  obj_userId: userId,
});

/**
 * 获取指定日期后的档期列表
 * @param startDate 指定日期
 * @param userId 要查询的用户的id，不传则默认查自己的
 */
export const reqGetScheduleListAfterDate = (startDate: string, userId = '') => (
  reqGet('/schedule/getScheduleInfo', {
    start_date: startDate,
    obj_userId: userId,
  })
);

/**
 * 保存档期
 * @param 档期信息
 */
export const reqSaveSchedule = (scheduleInfo: ScheduleInfo) => {
  const reqData = {
    date: scheduleInfo.date,
    time_interval: scheduleInfo.period,
    type: '1',
    address: scheduleInfo.address,
    customer_name: scheduleInfo.customerName,
    customer_phone: scheduleInfo.customerPhone,
    price: scheduleInfo.totalPrice.toString(),
    paid: scheduleInfo.deposit.toString(),
    kind: '1',
    remark: scheduleInfo.remark,
    price_is_settle: scheduleInfo.hasBeenPaid ? '1' : '0',
    schedule_type: scheduleInfo.type === 'booked' ? '1' : '0',
  };

  return reqPost('/schedule/save', reqData);
};

/**
 * 获取年单量总览
 * @param year 年份
 */
export const reqGetYearSchedule = (year: number) => reqGet('/schedule/scheduleZongLan', { year });

/**
 * 根据档期id获取档期详情
 * @param scheduleId 档期id
 */
export const reqGetScheduleDetail = (scheduleId: string) => reqGet('/schedule/getScheduleData', { schedule_id: scheduleId });

/**
 * 删除档期
 * @param scheduleId 档期id
 */
export const reqDeleteSchedule = (scheduleId: string) => reqGet('/schedule/editScheduleData', {
  schedule_id: scheduleId,
  is_delete: '1',
});

/**
 * 编辑档期
 * @param scheduleInfo 档期信息
 */
export const reqEditSchedule = (scheduleInfo: ScheduleInfo) => {
  const reqData = {
    schedule_id: scheduleInfo.id,
    date: scheduleInfo.date,
    time_interval: scheduleInfo.period,
    type: '1',
    address: scheduleInfo.address,
    customer_name: scheduleInfo.customerName,
    customer_phone: scheduleInfo.customerPhone,
    price: scheduleInfo.totalPrice.toString(),
    paid: scheduleInfo.deposit.toString(),
    kind: '1',
    remark: scheduleInfo.remark,
    price_is_settle: scheduleInfo.hasBeenPaid ? '1' : '0',
    schedule_type: scheduleInfo.type === 'booked' ? '1' : '0',
  };

  return reqPost('/schedule/editScheduleData', reqData);
};

/**
 * 获取档期海报信息
 * @param userId 用户id 默认为空字符串，即获取自己的
 */
export const reqGetSchedulePoster = (userId = '') => reqGet('/qiMiao/getPosterInfo', { obj_userId: userId });

/**
 * 上传档期海报
 * @param filePath 文件路径
 */
export const reqUploadSchedulePosterBg = (filePath: string) => reqUploadFile('/beiJing/shangchuanTomcat', filePath);

/** 编辑档期海报信息 */
export const reqEditSchedulePoster = (posterInfo: SchedulePosterInfo) => (
  reqPost('/qiMiao/editUserInfo', { poster_json: JSON.stringify(posterInfo) })
);
