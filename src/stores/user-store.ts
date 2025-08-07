/**
  * 已正式登录用户的用户信息的store
  * @author: Ruan Jiazhen
  * @date: 2024-04-28 17:27:33
* */

import { reqUploadAnyFile } from '@/api/others';
import { reqEditPersonalInfo, reqEditUserInfoAndPersonInfo, reqGetInviteUserList, reqGetPersonalInfo, reqGetUserInfoById } from '@/api/user-api';
import { DEFAULT_PERSONAL_INFO, DEFAULT_USER_INFO } from '@/static/constants/default-constant';
import { parseUploadFileUrl, parseUserInfo } from '@/utils/parse';
import { isNetworkUrl, random8BitString } from '@/utils/tools';
import _ from 'lodash';

export default defineStore('user', () => {
  // #region 用户信息相关

  /** 用户基本信息（展示在「个人信息」页面的数据以及其他账户数据） */
  const userInfo = ref(_.cloneDeep(DEFAULT_USER_INFO));


  /**
   * 设置用户名称
   */
  const setUserName = (name: string) => {
    userInfo.value.nickname = name;
  };



  /** 获取并设置用户基本信息 */
  const getUserInfo = async () => {
    const { data: { data: resData } } = await reqGetPersonalInfo();
    userInfo.value = {
      id: resData.userId,
      nickname: resData.user_qm_name,
      avatar: resData.user_headimg,
      phone: resData.phonenumber,
      age: resData.user_age,
      height: resData.user_height,
      weight: resData.user_weight,
      type: resData.user_type,
      vipEndTime: resData.yh_use_time || '',
      openId: resData.yhOpenid,
      invite_key: resData.invite_key,
      zfb_account: resData.zfb_account,
      zfb_name: resData.zfb_name,
      account_remain: String(resData.yh_account) || '0',
      hasPurchasedWeddingLink: resData.hasPurchasedWeddingLink === '1',
      isShowVideoModel: resData.isShowVideoModel !== '0',
    };
    console.log('userInfo', userInfo.value);
  };

  /** 邀请同行的id */
  const inviteWorkMateID = ref('');

  /** 更新邀请同行的id */
  const updateInviteWorkMateID = (id: string) => {
    console.log('保存了邀请人Id', id);

    inviteWorkMateID.value = id;
  };

  /** 更新支付宝信息
   * @param {string} account 支付宝账号
   * @param {string} realName 支付宝姓名
   */
  const updateUserZfb = (account: string, realName: string) => {
    userInfo.value.zfb_account = account || '';
    userInfo.value.zfb_name = realName || '';
  };

  /** 更新余额 */
  const updateRemainMoney = (money: string) => {
    if (Number(userInfo.value.account_remain) < Number(money)) {
      userInfo.value.account_remain = '0';
      return;
    }
    userInfo.value.account_remain = String(Number(userInfo.value.account_remain) - Number(money));
  };

  // #region 个人非基本信息相关

  /** 个人非基本信息，即个人简介、照片等个人信息以外的数据 */
  const personalInfo = ref<PersonalInfo>(JSON.parse(JSON.stringify(DEFAULT_PERSONAL_INFO)));

  /** 获取并设置个人信息和用户信息 */
  const getPersonalInfo = async () => {
    const res = await reqGetPersonalInfo();
    const resPersonalInfo = (res?.data as AnyObject).data?.personalInfo;
    if (!resPersonalInfo) return;

    personalInfo.value = {
      ...personalInfo.value,
      ...JSON.parse(resPersonalInfo),
    };
    console.log('userStore personalInfo', personalInfo.value);

    userInfo.value = {
      ...userInfo.value,
      ...parseUserInfo(res?.data as AnyObject),
    };
    console.log('userInfo', userInfo.value);
  };

  // #endregion

  /**
   * 编辑用户信息和个人信息
   * @param newPersonalInfo 要编辑的个人信息
   * @param newUserInfo 要编辑的用户信息
   * @returns 是否编辑成功
   */
  const editUserInfoAndPersonalInfo = async (
    newPersonalInfo:Partial<PersonalInfo>,
    newUserInfo: Partial<UserInfo>,
  ) => {
    // 如果个人信息传空照片会直接被后端清空，所以这里采取替换的方式
    const res = await reqEditUserInfoAndPersonInfo({
      ...personalInfo.value,
      ...newPersonalInfo,
    }, newUserInfo);
    console.log('editUserInfo', res);

    if ((res?.data as AnyObject).code === 200) {
      return true;
    }
    return false;
  };

  /**
   * 编辑个人简介、照片等个人信息以外的数据
   * @param newPersonalInfo 新的个人信息
   * @returns 是否编辑成功
   */
  const editPersonalInfo = async (newPersonalInfo: Partial<PersonalInfo>) => {
    const reqPersonalInfo = {
      ...personalInfo.value,
      ...newPersonalInfo,
    };
    const res = await reqEditPersonalInfo(reqPersonalInfo);
    console.log('editPersonalInfo', res);

    if ((res?.data as AnyObject).code === 200) {
      return true;
    }
    return false;
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
    console.log('userStore userId set personalInfo', personalInfo.value);

    userInfo.value = {
      ...userInfo.value,
      ...parseUserInfo(res?.data as AnyObject),
    };
  };

  // #endregion

  // #region 编辑个人照片相关

  /**
   * 添加个人照片
   * @param newPhoto 新的照片
   * @returns 是否添加成功
   */
  const addPhoto = async (newPhotoUrl: string) => {
    // 检查新的照片是否是本地临时照片
    const isLocalPhoto = !isNetworkUrl(newPhotoUrl);
    let newPhoto = newPhotoUrl;
    if (isLocalPhoto) {
      const uploadRes = await reqUploadAnyFile(newPhotoUrl);
      newPhoto = parseUploadFileUrl(uploadRes.data);
    }

    const newPhotoList = [...(personalInfo?.value?.photoList || []), newPhoto];
    const result = await editPersonalInfo({ photoList: newPhotoList });
    return result;
  };

  /**
   * 删除个人照片
   * @param photoIndex 要删除的照片的索引
   * @returns 是否删除成功
   */
  const deletePhoto = async (photoIndex: number) => {
    const newPhotoList = [...(personalInfo?.value?.photoList || [])];
    newPhotoList.splice(photoIndex, 1);
    const result = await editPersonalInfo({ photoList: newPhotoList });
    return result;
  };

  /**
   * 编辑个人照片
   * @param photoIndex 要编辑的照片的索引
   * @param newPhoto 新的照片
   * @returns 是否编辑成功
   */
  const editPhoto = async (photoIndex: number, newPhotoUrl: string) => {
    // 检查新的照片是否是本地临时照片
    const isLocalPhoto = !isNetworkUrl(newPhotoUrl);
    let newPhoto = newPhotoUrl;
    if (isLocalPhoto) {
      const uploadRes = await reqUploadAnyFile(newPhotoUrl);
      newPhoto = parseUploadFileUrl(uploadRes.data);
    }

    const newPhotoList = [...(personalInfo?.value?.photoList || [])];
    newPhotoList.splice(photoIndex, 1, newPhoto);
    const result = await editPersonalInfo({ photoList: newPhotoList });
    return result;
  };

  // #endregion
  // #region 邀请用户相关
  /** 已激活的邀请用户列表 */
  const activatedInviteUserList = ref<InviteUserItem[]>([]);

  /** 未激活的邀请用户列表 */
  const unactivatedInviteUserList = ref<InviteUserItem[]>([]);

  /**
   * 获取邀请用户列表
   * @param isActivated 是否已激活
   * @returns 用户列表
   */
  const getInviteUserList = async (isActivated: boolean) => {
    const resData = (await reqGetInviteUserList(isActivated))
      ?.data as ResData<InviteUserListResData>;
    if (resData.code !== 200) {
      return [];
    }
    return resData.data.list.map((item) => ({
      // XXX 因为后端返回的数据中没有id，所以这里用随机数代替
      userId: random8BitString(),
      avatar: item.avator,
      nickname: item.emcee_name,
      inviteTime: item.create_time,
      isActivate: item.kind === '1',
    }));
  };

  /** 获取并设置已激活用户列表 */
  const getActivatedInviteUserList = async () => {
    activatedInviteUserList.value = await getInviteUserList(true);
  };

  /** 获取并设置未激活用户列表 */
  const getUnactivatedInviteUserList = async () => {
    unactivatedInviteUserList.value = await getInviteUserList(false);
  };

  /** 更新邀请的用户列表（激活、未激活） */
  const updateInviteList = (list: any) => {
    activatedInviteUserList.value = list.activeList || [];
    unactivatedInviteUserList.value = list.unActiveList || [];
  };

  // #endregion

  /** 更新openid */
  const updateOpenId = (openId: string) => {
    userInfo.value.openId = openId || '';
  };

  /** 退出登录 */
  const logout = () => {
    userInfo.value = _.cloneDeep(DEFAULT_USER_INFO);
  };

  // #endregion
  return {
    userInfo,
    getUserInfo,
    setUserName,
    
    personalInfo,
    editUserInfoAndPersonalInfo,
    getPersonalInfo,
    editPersonalInfo,
    getUserInfoById,
    updateUserZfb,

    addPhoto,
    deletePhoto,
    editPhoto,

    activatedInviteUserList,
    unactivatedInviteUserList,
    getInviteUserList,
    getActivatedInviteUserList,
    getUnactivatedInviteUserList,

    logout,

    inviteWorkMateID,
    updateInviteWorkMateID,
    updateInviteList,
    updateOpenId,
    updateRemainMoney,
  };
});
