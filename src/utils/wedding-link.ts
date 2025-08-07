// 「Wedding Rite」项目专用的函数
import { reqTemUserSilentLogin } from '@/api/user-api';
import { WEDDING_LOGIN_PAGE_NAME_LIST, WEDDING_SHARE_PAGE_NAME_LIST_NORMAL, WEDDING_SHARE_PAGE_NAME_LIST_WORKMATE } from '@/static/constants/other-constants';
import { useBooking } from '@/stores/booking-store';
import { useSchedule } from '@/stores/schedule-store';
import { useTempUser } from '@/stores/temp-user-store';
import useUser from '@/stores/user-store';
import useWork from '@/stores/work-store';
import { clearToken, getIsTokenExpire, getLocalToken, isFormalToken, setToken } from './token';
import { showToast } from './tools';
import { uniLogin } from './uniapp-api-promised';

/**
 * 显示的视频缩略图，如果是第一个视频，则优先显示封面图，否则显示视频第一帧
 * @param {number} index 视频索引
 * @param {string} videoUrl 视频地址
 * @param {string} coverUrl 封面图地址
 * @returns {string} 视频地址
 */
export const getVideoThumbnail = (index:number, videoUrl:string, coverUrl:string|undefined) => {
  if (index === 0 && coverUrl) {
    return coverUrl;
  }
  return `${videoUrl}?vframe/jpg/offset/0`;
};

/** 判断用户是否是vip用户 */
export const judgeIsVip = () => {
  const userStore = useUser();
  const { userInfo } = storeToRefs(userStore); if (userInfo.value?.vipEndTime) {
    const current = Date.now();
    const vipTime = new Date(userInfo.value.vipEndTime).getTime();
    console.log('isVip', vipTime > current);
    return vipTime > current;
  }
  return false;
};

/** 非分享情况进入小程序的逻辑 */
export const enterWeddingRiteNotShare = async () => {
  const isTokenValid = getLocalToken() && isFormalToken() && !getIsTokenExpire();
  if (!isTokenValid) {
    clearToken();
    uni.reLaunch({ url: '/subpkg/wedding-link/login' });
    if (getIsTokenExpire()) {
      showToast('登录过期，请重新登录');
    }
    return;
  }

  // 更新token

  // 获取自己的各种信息

  const userStore = useUser();
  const { getPersonalInfo } = userStore;

  const scheduleStore = useSchedule();
  const { getSchedulePosterData, getScheduleListAfterToday } = scheduleStore;

  const work = useWork();
  const { getWorkList } = work;

  const bookingStore = useBooking();
  const { getAndSetBookingList } = bookingStore;

  getPersonalInfo();
  getScheduleListAfterToday();
  getSchedulePosterData();
  getWorkList();
  getAndSetBookingList();
};

/** 一般分享情况进入小程序的逻辑 */
export const enterWeddingRiteNormalShare = async () => {
  const isTokenValid = getLocalToken() && isFormalToken() && !getIsTokenExpire();
  if (!isTokenValid) {
    // 非正式用户静默登录
    clearToken();
    const uniLoginRes = await uniLogin();
    const loginResData = (await reqTemUserSilentLogin(uniLoginRes.code))?.data as AnyObject;
    if (loginResData?.code !== 200) {
      console.error('reqTemUserSilentLogin', loginResData);
      return;
    }
    setToken(loginResData?.data.token || '');
    uni.setStorageSync('isFormalToken', false);
  }

  // 获取临时用户信息

  const tempUserStore = useTempUser();
  const { getTempUserInfo } = tempUserStore;
  getTempUserInfo();
};

/** 分享给同行情况进入小程序的逻辑 */
export const enterWeddingRiteWorkmateShare = async () => {
  if (!isFormalToken()) {
    clearToken();
  }
};

/** 进入到Wedding Rite页面时的相关逻辑
 * @param options
 */
export const enterWeddingRite = async (options: App.LaunchShowOption) => {
  const path = options?.path || '';
  /** 是否是分享相关的页面 */
  const isNormalShare = WEDDING_SHARE_PAGE_NAME_LIST_NORMAL.includes(path);
  const isWorkmateShare = WEDDING_SHARE_PAGE_NAME_LIST_WORKMATE.includes(path);
  const isAboutLogin = WEDDING_LOGIN_PAGE_NAME_LIST.includes(path);

  if (isAboutLogin) {
    return;
  }

  if (!isNormalShare && !isWorkmateShare) {
    enterWeddingRiteNotShare();
  }

  // 如果是一般分享的页面
  if (isNormalShare) {
    enterWeddingRiteNormalShare();
  }

  // 如果是分享给同行的页面
  if (isWorkmateShare) {
    enterWeddingRiteWorkmateShare();
  }
};
