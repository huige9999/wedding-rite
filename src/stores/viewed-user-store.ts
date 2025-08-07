/**
  * 当前被查看用户（非当前操作用户）的用户信息的store
  * @author: Ruan Jiazhen
  * @date: 2024-04-28 17:28:14
* */

import { reqGetUserInfoById } from '@/api/user-api';
import { DEFAULT_PERSONAL_INFO, DEFAULT_USER_INFO } from '@/static/constants/default-constant';
import { parseUserInfo } from '@/utils/parse';
import _ from 'lodash';

export const useViewedUser = defineStore('viewedUser', () => {
  /** 分享页面的用户数据 */
  const userInfo = ref(_.cloneDeep(DEFAULT_USER_INFO));

  /** 个人简介、照片等个人信息以外的数据 */
  const personalInfo = ref(_.cloneDeep(DEFAULT_PERSONAL_INFO));

  /**
   * 根据用户id获取并设置用户基本信息和个人信息
   * @param userId 用户id
   */
  const getUserInfoAndPersonalInfoById = async (userId: string) => {
    console.log('view user id', userId);
    const res = await reqGetUserInfoById(userId);

    userInfo.value = parseUserInfo(res?.data as AnyObject);
    console.log('view user userInfo', userInfo.value);

    const resPersonalInfo = (res?.data as AnyObject).data?.personalInfo;
    if (!resPersonalInfo) {
      console.log('没有获取到被查看的用户的信息');
      return;
    }

    personalInfo.value = JSON.parse(resPersonalInfo);

    console.log('viewed user personalInfo', personalInfo.value);
  };

  return {
    userInfo,
    personalInfo,
    getUserInfoAndPersonalInfoById,
  };
});
