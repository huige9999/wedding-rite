/**
  * @description: 分享时展示的用户数据（分享给同行的场景）的store
  * @author: Ruan Jiazhen
  * @date: 2024-04-28 17:26:30
* */

import { reqEditTemUserInfo, reqGetPersonalInfo, reqGetTemUserInfo, reqGetUserInfoById } from '@/api/user-api';
import { DEFAULT_PERSONAL_INFO, DEFAULT_USER_INFO } from '@/static/constants/default-constant';
import { parseUserInfo } from '@/utils/parse';
import _ from 'lodash';

export default defineStore('shareWorkmate', () => {
  /** 分享页面的用户数据 */
  const shareUserInfo = ref(_.cloneDeep(DEFAULT_USER_INFO));

  /**
   * 设置用户信息
   * @param newUserInfo 新的用户信息
   */
  const setTmpUserInfo = (newUserInfo: UserInfo) => {
    shareUserInfo.value = newUserInfo;
    return shareUserInfo.value;
  };

  /** 个人简介、照片等个人信息以外的数据 */
  const personalInfo = ref<PersonalInfo>(JSON.parse(JSON.stringify(DEFAULT_PERSONAL_INFO)));

  /**
   * 设置个人信息
   * @param newPersonalInfo 新的个人信息
   * @returns 新的个人信息
   */
  const setPersonalInfo = (newPersonalInfo: PersonalInfo) => {
    personalInfo.value = newPersonalInfo;
    return personalInfo.value;
  };

  /** 获取并设置个人信息和用户信息 */
  const getPersonalInfo = async () => {
    const res = await reqGetPersonalInfo();
    const resPersonalInfo = (res?.data as AnyObject).data?.personalInfo;
    if (!resPersonalInfo) return;

    personalInfo.value = {
      ...personalInfo.value,
      ...JSON.parse(resPersonalInfo),
    };
    console.log('personalInfo', personalInfo.value);

    shareUserInfo.value = setTmpUserInfo(parseUserInfo(res?.data as AnyObject));
    console.log('shareUserInfo', shareUserInfo.value);
  };

  /**
   * 根据用户id获取用户信息，并设置到userInfo和personalInfo中
   * @param userId 用户id
   */
  const getUserInfoById = async (userId: string) => {
    const res = await reqGetUserInfoById(userId);
    const resPersonalInfo = (res?.data as AnyObject).data?.personalInfo;
    if (!resPersonalInfo) return;

    personalInfo.value = {
      ...personalInfo.value,
      ...JSON.parse(resPersonalInfo),
    };

    shareUserInfo.value = setTmpUserInfo(parseUserInfo(res?.data as AnyObject));
    console.log('shareUserInfo', shareUserInfo.value);
  };

  /** 临时用户 */
  /** 临时用户信息 */
  const tempUserInfo = ref<TempUserInfo>({
    id: '',
    avatar: '',
    nickname: '',
    type: '1',
  });

  /** 获取并设置临时用户信息 */
  const getTempUserInfo = async () => {
    const res = await reqGetTemUserInfo();
    const resData = res?.data as ResData<AnyObject>;
    tempUserInfo.value = {
      id: resData.data.userId,
      nickname: resData.data.user_name || '',
      avatar: resData.data.user_headimg || '',
      type: resData.data.user_type || '1',
    };
  };

  /** 编辑临时用户信息 */
  const editTemUserInfo = async (newTempUserInfo: Partial<TempUserInfo>) => {
    const res = await reqEditTemUserInfo(newTempUserInfo);
    console.log('editTempUserInfo', res);
    if ((res?.data as AnyObject).code === 200) {
      return true;
    }
    return false;
  };

  return {
    shareUserInfo,
    personalInfo,
    setTmpUserInfo,
    setPersonalInfo,
    getPersonalInfo,
    getUserInfoById,

    tempUserInfo,
    getTempUserInfo,
    editTemUserInfo,
  };
});
