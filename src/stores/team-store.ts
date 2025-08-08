import { reqGetHomeInfo } from '@/api/team-api';

const STORAGE_TEAM_KEY = 'teamInfo';
const setStorageTeamInfo = (pData: { [x: string]: any }) => {
  const tmpStorageDataStr = uni.getStorageSync(STORAGE_TEAM_KEY);
  const storageData = tmpStorageDataStr ? JSON.parse(tmpStorageDataStr) : {};
  Object.keys(pData).forEach((key) => {
    if (pData[key] !== undefined) {
      storageData[key] = pData[key];
    }
  });
  uni.setStorageSync(STORAGE_TEAM_KEY, JSON.stringify(storageData));
};

const getStorageTeamInfo = () => {
  const tmpStorageDataStr = uni.getStorageSync(STORAGE_TEAM_KEY);
  const storageData = tmpStorageDataStr ? JSON.parse(tmpStorageDataStr) : {};
  return storageData;
};

type TeamBaseParam = {
  id?: string;
  name?: string;
};

/**
 * 团队信息相关的数据仓库
 */
export default defineStore('team', () => {
  const teamId = ref('');
  const brandInfo = ref(''); // 菜单栏品牌信息所有字段(JSON字符串对象)
  const phone = ref('');
  const name = ref('');
  const avator = ref('');
  const headImg = ref(''); // 首页头图 可选横版、竖版
  const needRefreshOffer = ref(false); // 是否需要刷新团队报价
  const needRefreshDynamic = ref(false); // 是否需要刷新动态
  const shareCover = ref(''); // 分享封面图
  const sharePosterBgList = ref<string[]>([]); // 分享海报背景图列表

  const setShareCover = (url?: string) => {
    if (url) {
      shareCover.value = url;
      setStorageTeamInfo({ teamShareCover: url });
    } else {
      shareCover.value = getStorageTeamInfo().teamShareCover;
    }
  };

  const setSharePosterBgList = (url?: string, isDelete?: boolean) => {
    let tmpSharePosterBgList: string[] = [];
    const storageSharePosterBgListStr = getStorageTeamInfo().sharePosterBgList;
    if (storageSharePosterBgListStr) {
      tmpSharePosterBgList = [...JSON.parse(storageSharePosterBgListStr)];
    }
    // 删除的情况
    if (isDelete && url) {
      sharePosterBgList.value = sharePosterBgList.value.filter((item) => item !== url);
      tmpSharePosterBgList = tmpSharePosterBgList.filter((item) => item !== url);
      setStorageTeamInfo({ sharePosterBgList: JSON.stringify(tmpSharePosterBgList) });
      return;
    }

    if (url) {
      tmpSharePosterBgList.push(url);
      sharePosterBgList.value = tmpSharePosterBgList;
      setStorageTeamInfo({ sharePosterBgList: JSON.stringify(tmpSharePosterBgList) });
    } else {
      sharePosterBgList.value = tmpSharePosterBgList;
    }
  };

  const setTeamInfo = ({ id, name: teamNameParam }: TeamBaseParam = {}) => {
    // teamName 的设置逻辑被合并到 getHomeInfo 和 MenuLeft 组件中对 name 的直接修改

    if (id) {
      teamId.value = id;
      setStorageTeamInfo({ teamId: id });
    } else {
      teamId.value = getStorageTeamInfo().teamId;
    }
  };

  const getHomeInfo = async () => {
    setTeamInfo();
    setShareCover();
    setSharePosterBgList();
    const res = await reqGetHomeInfo(teamId.value);
    const resData = res.data.data;
    brandInfo.value = resData.brand_info;
    phone.value = resData.phone;
    name.value = resData.name;
    avator.value = resData.avator;
    headImg.value = resData.head_img;
  };

  const setNeedRefreshOffer = (needRefresh: boolean) => {
    needRefreshOffer.value = needRefresh;
  };

  const setNeedRefreshDynamic = (needRefresh: boolean) => {
    needRefreshDynamic.value = needRefresh;
  };

  return {
    phone,
    name,
    avator,
    headImg,
    teamId,
    brandInfo,
    needRefreshOffer,
    shareCover,
    needRefreshDynamic,
    sharePosterBgList,
    setSharePosterBgList,
    setNeedRefreshDynamic,
    setTeamInfo,
    getHomeInfo,
    setNeedRefreshOffer,
    setShareCover,
  };
});
