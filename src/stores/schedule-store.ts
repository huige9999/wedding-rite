/**
  * 档期数据的store
  * @author: Ruan Jiazhen
  * @date: 2024-04-28 17:26:14
* */

import { reqEditSchedulePoster, reqGetScheduleList, reqGetSchedulePoster } from '@/api/schedule-api';
import { DEFAULT_SCHEDULE_POSTER_BG, DEFAULT_SCHEDULE_POSTER_TEXT } from '@/static/constants/view-constants';
import { showToast } from '@/utils/tools';

export const useSchedule = defineStore('schedule', () => {
  // #region 档期列表相关
  /** 今天之后的档期列表 */
  const scheduleListAfterToday = ref<AllScheduleList>([]);

  /** 全部档期列表 */
  const scheduleListAll = ref<AllScheduleList>([]);

  /**
   * 处理res数据，返回整理好的档期列表数据
   * @param res
   * @returns scheduleList
   */
  const parseScheduleList = (res: any): AllScheduleList => {
    const dataList = res.data.data.list as Array<AnyObject>;

    return dataList.map((item: any) => ({
      year: new Date(item.date).getFullYear(),
      month: new Date(item.date).getMonth() + 1,
      totalIncomeString: (item.totalPrice as number).toFixed(2),
      scheduleList: (item.dataList as Array<AnyObject>)?.map((schedule) => ({
        id: schedule.schedule_id.toString(),
        date: schedule.date,
        period: schedule.time_interval,
        type: schedule.schedule_type === '1' ? 'booked' : 'unbooked',
        address: schedule.address,
        customerName: schedule.customer_name,
        customerPhone: schedule.customer_phone,
        hasBeenPaid: schedule.price_is_settle === '1',
        totalPrice: schedule.price,
        deposit: schedule.paid,
        remark: schedule.remark,
      })) || [],
    }));
  };

  /** 获取今天之后的档期列表，并设置 */
  const getScheduleListAfterToday = async () => {
    const res = await reqGetScheduleList(false) as any;
    console.log('getScheduleListAfterToday', res);
    // 未获取成功的情况
    if (res.data.code !== 200) {
      showToast('获取档期列表失败，请稍后重试');
    } else {
      console.log('date list', res.data.data.list);
      scheduleListAfterToday.value = parseScheduleList(res);
      uni.hideLoading();
    }

    console.log('scheduleListAfterToday', scheduleListAfterToday.value);
  };

  /** 获取全部档期列表，并设置
   * @param userId 要查询的用户的id，不传则默认查自己的
   */
  const getScheduleListAll = async (userId = '') => {
    uni.showLoading();
    const res = await reqGetScheduleList(true, userId) as any;
    console.log('getScheduleListAll', res);

    // 未获取成功的情况
    if (res.data.code !== 200) {
      uni.hideLoading();
      showToast('获取档期列表失败，请稍后重试');
    } else {
      console.log('date list', res.data.data.list);
      scheduleListAll.value = parseScheduleList(res);
      uni.hideLoading();
    }

    console.log('scheduleListAll', scheduleListAll.value);
  };

  // #endregion

  // #region 档期海报相关

  /** 档期海报数据 */
  const schedulePosterData = ref({
    /** 背景图片地址 */
    bgImg: DEFAULT_SCHEDULE_POSTER_BG,
    /** 是否显示电话号码 */
    isShowPhone: true,
    /** 是否显示文字内容 */
    isShowText: true,
    /** 文字内容 */
    text: DEFAULT_SCHEDULE_POSTER_TEXT,
    /** 二维码图片地址 */
    qrCodeImg: '',
  });

  /**
   * 获取并设置档期海报数据
   * @param userId 要查询的用户的id，默认为空字符串，即查询自己的
   */
  const getSchedulePosterData = async (userId = '') => {
    const resData = (await reqGetSchedulePoster(userId))?.data as ResData<AnyObject>;
    const posterInfo = resData?.data?.posterInfo as typeof schedulePosterData.value;
    console.log('getSchedulePosterData', resData);
    console.log('posterInfo', posterInfo);
    if (!posterInfo) return;
    schedulePosterData.value = {
      bgImg: posterInfo.bgImg || DEFAULT_SCHEDULE_POSTER_BG,
      isShowPhone: posterInfo.isShowPhone || false,
      isShowText: posterInfo.isShowText || false,
      text: posterInfo.text || DEFAULT_SCHEDULE_POSTER_TEXT,
      qrCodeImg: resData.data.my_qrcode || '',
    };
    console.log('schedulePosterData', schedulePosterData.value);
  };

  /**
   * 编辑档期海报信息
   * @param posterInfo
   */
  const editSchedulePosterData = async (posterInfo: SchedulePosterInfo) => {
    try {
      const res = await reqEditSchedulePoster(posterInfo) as any;
      if (res.data.code === 200) {
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  // #endregion

  return {
    scheduleListAfterToday,
    getScheduleListAfterToday,
    scheduleListAll,
    getScheduleListAll,

    schedulePosterData,
    getSchedulePosterData,
    editSchedulePosterData,
  };
});
