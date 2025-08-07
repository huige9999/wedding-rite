/**
  * 未登录时的用户信息的 store
  * @author: Ruan Jiazhen
  * @date: 2024-04-28 17:27:12
* */

import { reqEditTemUserInfo, reqGetTemUserInfo } from '@/api/user-api';

export const useTempUser = defineStore('tmpUser', () => {
  /** 临时用户信息 */
  const tempUserInfo = ref({
    id: '',
    avatar: '',
    nickname: '',
    type: '1',
  });

  /** 获取并设置临时用户信息 */
  const getTempUserInfo = async () => {
    const res = await reqGetTemUserInfo();
    const resData = res?.data as ResData<AnyObject>;
    console.log('getTempUserInfo', resData);
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
    tempUserInfo,
    getTempUserInfo,
    editTemUserInfo,
  };
});
