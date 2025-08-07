import { authUserApp, newAuthUser } from '@/api/hlr-api';
import { setHlrData, getLocalHlrData } from '@/utils/hlr';

// 婚礼人相关的store
export default defineStore('hlr', () => {
  const hlrServiceData = reactive<HlrServiceData>({
    hlrToken: '',
    hlrUserType: '',
    hlrAvatar: '',
    hlrName: '',
    hlrUserId: '',
    hlrShareType: '',
  });
  const byeToken = ref<string>('');

  const hlrNeedRefreshCaseList = ref<'0' | '1'>('0');

  const initHlrServiceData = async () => {
    const localHlrData = getLocalHlrData();
    if (localHlrData) {
      const keys = Object.keys(hlrServiceData);
      for (let i = 0; i < keys.length; i += 1) {
        // 获取当前key值
        const key = keys[i];
        // 如果缓存中的对象有对应的key值，则更新当前对象的属性值
        if (Object.prototype.hasOwnProperty.call(localHlrData, key)) {
          hlrServiceData[key] = localHlrData[key];
        }
      }
    } else {
      const { code } = await uni.login({ provider: 'weixin' });
      const authRawData = (await authUserApp(code)) as AnyObject;
      console.log('authRawData:', authRawData);
      hlrServiceData.hlrToken = authRawData?.data?.token;
      hlrServiceData.hlrUserType = authRawData?.data?.user?.end_user_type;
      hlrServiceData.hlrAvatar = authRawData?.data?.user?.user_headimg;
      hlrServiceData.hlrName = authRawData?.data?.user?.user_name;
      setHlrData(hlrServiceData);
    }
  };

  const initByeServiceData = async () => {
    const { code } = await uni.login({ provider: 'weixin' });
    const authRawData = (await newAuthUser(code)) as AnyObject;
    console.log('authRawData:', authRawData);
    byeToken.value = authRawData?.data?.token;
    console.log('initByeServiceData:', byeToken.value);
  };

  const updateHlrServiceData = (hlrServiceDataParam: HlrServiceData) => {
    // hlrServiceDataParam的值更新hlrServiceData的值 以及更新缓存中的hlrServiceData的值
    const keys = Object.keys(hlrServiceDataParam);
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      if (Object.prototype.hasOwnProperty.call(hlrServiceData, key)) {
        hlrServiceData[key] = hlrServiceDataParam[key];
      }
    }
    setHlrData(hlrServiceData);
  };

  const updateHlrNeedRefreshCaseList = (hlrNeedRefreshCaseListParam: '0' | '1') => {
    hlrNeedRefreshCaseList.value = hlrNeedRefreshCaseListParam;
  };

  return {
    initHlrServiceData,
    hlrServiceData,
    updateHlrServiceData,
    hlrNeedRefreshCaseList,
    updateHlrNeedRefreshCaseList,
    initByeServiceData,
    byeToken,
  };
});
