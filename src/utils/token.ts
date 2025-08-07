import { reqUpdateToken } from '@/api/user-api';
import dayjs from 'dayjs';

// 设置token
export const setToken = (token: string) => {
  try {
    uni.setStorageSync('token', token);
  } catch (e) {
    console.error('set token error', e);
  }
};

// 获取token
export const getLocalToken = () => {
  try {
    return uni.getStorageSync('token');
  } catch (e) {
    console.error('get token error', e);
  }
  return '';
};

/** 当前token是否是正式token */
export const isFormalToken = () => (uni.getStorageSync('isFormalToken') || false) as boolean;

// 获取婚礼人token
export const getLocalHlrToken = (cachedName: 'hlr' | 'feedback' = 'hlr') => {
  try {
    let tmpResult = null;
    if (cachedName === 'hlr') {
      const cachedHlrData = uni.getStorageSync('hlrData');
      tmpResult = cachedHlrData ? JSON.parse(cachedHlrData).hlrToken : null;
    }
    return tmpResult;
  } catch (e) {
    console.error('get token error', e);
  }
  return '';
};

/** 获取当前token过期时间 */
export const getLocalTokenExpireTime = () => uni.getStorageSync('tokenExpireTime') || '2007-8-31';

/** 当前token是否已过期 */
export const getIsTokenExpire = () => dayjs().isAfter(dayjs(getLocalTokenExpireTime()));

/** 设置当前token过期时间 */
export const setLocalTokenExpireTime = (tokenExpireTime: string) => {
  try {
    uni.setStorageSync('tokenExpireTime', tokenExpireTime || '2007-8-31');
  } catch (e) {
    console.error('set tokenExpireTime error', e);
  }
};

/** 更新token */
export const updateToken = async () => {
  const res = await reqUpdateToken();
  if (res.data.code !== 200) {
    console.error('updateToken', res.data);
    return;
  }

  setToken(res.data.data.token);
  setLocalTokenExpireTime(res.data.data.expireTime);
};

/** 清除token及相关信息 */
export const clearToken = () => {
  try {
    uni.removeStorageSync('token');
    uni.removeStorageSync('tokenExpireTime');
    uni.removeStorageSync('isFormalToken');
  } catch (e) {
    console.error('clear token error', e);
  }
};
