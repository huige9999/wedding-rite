import { reqGet, reqPost } from "@/api/request";

type EffectParams = {
  [key: string]: string | number | undefined;
};
const getEffectParams = (param: EffectParams) => {
  const newObj: { [key: string]: string } = {};
  Object.keys(param).forEach((key) => {
    if (param[key] !== undefined) {
      newObj[key] = param[key] as string;
    }
  });
  return newObj;
};

/**
 * 获取团队首页信息
 * @returns {{
 *  data: {
 *    brand_info: string, // 品牌信息json自定义字符串
 *    create_time: string, // 2024-08-21T10:42:22
 *    phone: string,
 *    head_img: string, // 首页头图
 *    name: string,
 *    avator: string,
 *    id: string,
 *    userId: string,
 *  }
 * }}
 */
export const reqGetHomeInfo = (teamId: string) =>
  reqGet("/weddingRiteTeam/getIndex", { teamId });

/**
 * 个人风采
 * @returns {{
 *  totalPage: number,
 *  list: Array<{
 *    user_qm_name: string,
 *    userId: string,
 *    personalInfo: {}
 *  }>
 * }}
 */
export const reqGetPersonalStyle = () =>
  reqGet("/weddingRiteTeam/personalStyleList");

type EditTeamInfoParams = {
  teamId: string;
  avator?: string;
  name?: string;
  brandInfo?: string;
  headImg?: string;
};
/**
 * 编辑团队信息
 */
export const reqEditTeamInfo = ({
  teamId,
  avator,
  name,
  brandInfo,
  headImg,
}: EditTeamInfoParams) => {
  const params = getEffectParams({
    teamId,
    avator,
    name,
    brandInfo,
    headImg,
  });

  return Promise.resolve(params);
  // return reqPost("/weddingRiteTeam/editTeamInfo", params); TODO 待解开注释
};

type AddWorkParams = {
  title: string;
  cover: string;
  mediaInfo: string;
  teamId: string;
};

/**
 * 发布作品
 */
export const reqAddWork = ({
  title,
  cover,
  mediaInfo,
  teamId,
}: AddWorkParams) => {
  const params = getEffectParams({
    title,
    cover,
    mediaInfo,
    teamId,
  });

  return reqPost("/weddingRiteTeam/addWorks", params);
};
/**
 * 作品列表
 */
export const reqGetWorksList = (teamId: string) => {
  return reqPost("/weddingRiteTeam/worksList", {
    teamId,
  });
};

/**
 * 作品详情/动态详情
 */
export const reqGetWorksDetail = (find_id: string) =>
{
  return reqPost("/weddingRiteTeam/worksDetail", {
    find_id,
  });
}

type EditWorksParams = {
  find_id: string;
  cover?: string;
  title?: string;
  mediaInfo?: string;
};

/**
 * 编辑作品/编辑动态
 */
export const reqEditWorks = ({
  find_id,
  cover,
  title,
  mediaInfo,
}: EditWorksParams) => {
  const params = getEffectParams({
    find_id,
    cover,
    title,
    mediaInfo,
  });

  return reqPost("/weddingRiteTeam/editWorks", params);
};

/**
 * 删除作品/删除动态
 */
export const reqRemoveWorks = (find_id: string) =>
  reqPost("/weddingRiteTeam/removeWorks", {
    find_id,
  });

/**
 * 发布动态
 */

type AddDynamicParams = {
  teamId: string;
  content: string;
  mediaInfo: string;
};

/**
 * 发布动态
 */
export const reqAddDynamic = ({
  teamId,
  content,
  mediaInfo,
}: AddDynamicParams) => {
  const params = getEffectParams({
    teamId,
    content,
    mediaInfo,
  });

  return reqPost("/weddingRiteTeam/addDynamic", params);
};
/**
 * 动态列表
 */
export const reqGetDynamicList = (teamId: string) => {
  return reqPost("/weddingRiteTeam/dynamicList", {
    teamId
  });
}

/**
 * 客资访客记录
 */
export const reqGetVisitorList = ({
  teamId,
  currentPage,
  showCount,
}: ScheduleListParams) => {
  const params = getEffectParams({
    teamId,
    currentPage,
    showCount,
  });
  return reqPost("/weddingRiteTeam/visitorList", params);
};

type ScheduleListParams = {
  teamId: string;
  currentPage: number;
  showCount: number;
};

/**
 * 客资预约记录
 */
export const reqGetScheduleList = ({
  teamId,
  currentPage,
  showCount,
}: ScheduleListParams) => {
  const params = getEffectParams({
    teamId,
    currentPage,
    showCount,
  });
  return reqPost("/weddingRiteTeam/scheduleList", params);
};

type AddOfferParams = {
  teamId: string;
  kind: string;
  quote: string;
  deposit: string;
  content: string;
};
/**
 * 添加报价
 */
export const reqAddOffer = ({
  teamId,
  kind,
  quote,
  deposit,
  content,
}: AddOfferParams) => {
  const params = getEffectParams({
    teamId,
    kind,
    quote,
    deposit,
    content,
  });
  return reqPost("/weddingRiteTeam/addOffer", params);
};
/**
 * 报价列表
 */

export const reqGetOfferList = (teamId: string) =>
  reqPost("/weddingRiteTeam/offerList", {
    teamId,
  });

/**
 * 编辑报价/删除报价
 */
type EditOfferParams = {
  offerId: string;
  quote?: string;
  deposit?: string;
  content?: string;
  kind?: string;
  is_delete?: "1" | undefined;
};

export const reqEditOffer = ({
  offerId,
  quote,
  deposit,
  content,
  kind,
  is_delete,
}: EditOfferParams) => {
  const params = getEffectParams({
    offerId,
    quote,
    deposit,
    content,
    kind,
    is_delete,
  });
  return reqPost("/weddingRiteTeam/editOffer", params);
};
