// 对复杂数据进行解析的各种方法

import type { UserInfo } from '@/types/env';

/**
 * 从res中解析出作品信息
 * @param res 作品信息
 * @returns 作品信息
 */
export const parseWorkInfo = (workItemResData: WorkItemResData) => ({
  id: (workItemResData.case_id as number).toString(),
  coverUrl: workItemResData?.case_cover,
  title: workItemResData?.case_name,
  desc: workItemResData?.more_information_json,
  tags: workItemResData?.case_style.split(','),
  videoUrl: (JSON.parse(workItemResData.case_video_json || '[]') as Array<any>)
    .map((videoInfo) => videoInfo.videoPath),
  imgUrl: (JSON.parse(workItemResData.case_picture_json || '[]') as Array<any>)
    .map((imgInfo) => imgInfo.imagePath),
  likeCount: workItemResData?.likes,
});

/**
 * 从res中解析出上传后文件的url
 * @param res 上传后返回的信息
 * @returns 上传后文件的url
 */
export const parseUploadFileUrl = (resData: string): string => {
  console.log('parseUploadFileUrl', resData);
  return (JSON.parse(resData) as AnyObject).data.filePath;
};

/**
 * 从res中解析出动态信息
 * @param resData 动态信息请求数据
 * @returns 动态信息
 */
export const parseActivityInfo = (resData: ResData<ActivityResInfo>): ActivityInfo => {
  const item = resData?.data;
  const mediaInfo: MediaInfo = JSON.parse(item.mediaInfo);
  const imgUrl = mediaInfo?.type === 'image' ? mediaInfo?.mediaPath : [];
  const videoUrl = mediaInfo?.type === 'video' ? mediaInfo?.mediaPath : [];
  return {
    id: item.find_id.toString(),
    createTime: item.create_time,
    userId: item.userId,
    nickname: item.user_qm_name,
    avatar: item.user_headimg,
    coverUrl: item.cover,
    title: item.title,
    content: item.content,
    imgUrl,
    videoUrl,
    likeCount: item.likes,
    isLike: item.isLike === '1',
    commentCount: item.comment_size,
    commentList: [],
  };
};

/**
 * 从res中解析出动态列表信息
 * @param resData 动态信息请求数据
 * @returns 动态信息
 */
export const parseActivityList = (resData: ResData<ActivityData>): ActivityInfo[] => (
  resData?.data?.list.map((item) => {
    const mediaInfo: MediaInfo = JSON.parse(item.mediaInfo);
    const imgUrl = mediaInfo?.type === 'image' ? mediaInfo?.mediaPath : [];
    const videoUrl = mediaInfo?.type === 'video' ? mediaInfo?.mediaPath : [];
    return {
      id: item.find_id.toString(),
      createTime: item.create_time,
      userId: item.userId,
      nickname: item.user_qm_name,
      avatar: item.user_headimg,
      coverUrl: item.cover,
      title: item.title,
      content: item.content,
      imgUrl,
      videoUrl,
      likeCount: item.likes,
      isLike: item.isLike === '1',
      commentCount: item.comment_size,
      commentList: item.comment_list.map((comment) => ({
        id: comment.comment_id,
        avatar: comment.headimg_url,
        nickname: comment.nickname,
        content: comment.content,
      })),
    };
  })
);

/**
   * 处理res数据，返回整理好的档期列表数据
   * @param res
   * @returns scheduleList
   */
export const parseScheduleList = (
  res: UniApp.RequestSuccessCallbackResult|null,
): AllScheduleList => {
  if (!res) return [];
  const data = res.data as ResData<ResScheduleListData>;
  const dataList = data.data.list;
  return dataList.map((item) => ({
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

/**
 * 从res中解析并返回用户信息
 * @param resData 用户信息请求数据
 * @returns 用户信息
 */
// XXX 多个接口返回的用户信息字段不一致，所以暂时使用AnyObject
export const parseUserInfo = (
  resData: AnyObject,
): UserInfo => ({
  id: resData?.data?.userId || '',
  nickname: resData?.data.user_qm_name || '',
  avatar: resData?.data.user_headimg || '',
  phone: resData?.data.phonenumber || '',
  age: resData?.data.user_age || '',
  height: resData?.data.user_height || '',
  weight: resData?.data.user_weight || '',
  type: resData?.data.user_type || '1',
  vipEndTime: resData?.data.yh_use_time || '',
  openId: resData?.data.yhOpenid || '',
  invite_key: resData?.data.invite_key || '',
  zfb_account: resData?.data.zfb_account || '',
  zfb_name: resData?.data.zfb_name || '',
  account_remain: String(resData?.data.yh_account) || '0',
  hasPurchasedWeddingLink: resData?.data.hasPurchasedWeddingLink === '1',
  isShowVideoModel: resData?.data.isShowVideoModel !== '0',
});

/**
 * 从res中解析并返回个人信息
 * @param resData 个人信息请求数据
 * @returns 个人信息
 */
// XXX 多个接口返回的用户信息字段不一致，所以暂时使用AnyObject
export const parsePersonalInfo = (
  resData: AnyObject,
) => {
  console.log('parsePersonalInfo', resData);
  const personalInfo = JSON.parse(resData.data.personalInfo || '{}') as PersonalInfo;
  console.log('personalInfo', personalInfo);
  return personalInfo;
};

/**
 * 从res中解析并返回作品列表
 * @param resData 作品列表请求数据
 * @returns 作品列表
 */
export const parseWorkList = (resData: GetWorksListResData) => resData.data.list.map(
  (item) => parseWorkInfo(item),
);

/**
 * 从res中解析并返回预定列表
 * @param resData 预定列表请求数据
 * @returns 预定列表
 */
export const parseBookingsList = (
  resData: GetBookingsListResData,
):BookingInfo[] => resData.data.list.map(
  (item) => ({
    id: item.schedule_id,
    name: item?.customer_name,
    phone: item?.customer_phone,
    date: item?.date,
    period: item?.time_interval,
    remark: item?.remark,
    hasBeenResolved: item.hasBeenResolved,
  }),
);
