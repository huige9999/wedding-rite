// 动态相关的api
import { reqGet, reqPost } from './request';

/**
 * 获取动态列表
 * @param {string} userId 用户id 默认空，即查询自己的动态
 * @param {number} page 页码 默认1
 * @param {number} size 每页数量 默认10
 */
export const reqGetActivityList = (
  userId = '',
  page = 1,
  size = 10,
) => {
  const query = {
    currentPage: page,
    showCount: size,
    query_userId: userId,
  };
  return reqGet('/qmFind/getDongTaiList', query);
};

/**
 * 发动态
 * @param 动态内容
 */
export const reqSendActivity = (sendActivityInfo: SendActivityInfo) => {
  console.log('activityInfo', sendActivityInfo);
  const mediaInfo = JSON.stringify({
    type: sendActivityInfo.videos.length > 0 ? 'video' : 'image',
    mediaPath:
      sendActivityInfo.videos.length > 0
        ? sendActivityInfo.videos
        : sendActivityInfo.images,
  });
  const data = {
    cover: sendActivityInfo.cover,
    content: sendActivityInfo.content,
    mediaInfo,
  };
  return reqPost('/qmFind/saveFind', data);
};

/**
 * 删除动态
 * @param 动态id
 */
export const reqDeleteActivity = (activityId: string) => {
  const data = {
    find_id: activityId,
    is_delete: '1',
  };
  return reqPost('/qmFind/editFind', data);
};

/**
 * 获取动态详情
 * @param 动态id
 */
export const reqGetActivityDetail = (activityId: string) => {
  const data = { find_id: activityId };
  return reqPost('/qmFind/getDongTaiInfo', data);
};

/**
 * 编辑动态
 * @param 动态id
 */
export const reqEditActivity = (editActivityInfo: EditActivityInfo) => {
  const mediaInfo = JSON.stringify({
    type: editActivityInfo.videos.length > 0 ? 'video' : 'image',
    mediaPath:
      editActivityInfo.videos.length > 0
        ? editActivityInfo.videos
        : editActivityInfo.images,
  });
  const data = {
    find_id: editActivityInfo.activityId,
    content: editActivityInfo.content,
    mediaInfo,
  };
  return reqPost('/qmFind/editFind', data);
};
/**
 * 获取动态评论列表
 * @param {number} page 页码 默认1
 * @param {number} size 每页数量 默认10
 * @param {string} activityId 动态id
 */
export const reqGetActivityCommentList = (
  activityId = '',
  page = 1,
  size = 10,
) => {
  const query = {
    currentPage: page,
    showCount: size,
    target_id: activityId,
    type: '3',
  };
  return reqGet('/qiMiao/getCommentList', query);
};

/**
 * 点赞动态
 * @param {string} activityId 动态id
 * @param {string} userType 用户类型
 */
export const reqLikeActivity = (activityId: string, userType: string) => {
  const data = {
    target_id: activityId,
    user_type: userType,
  };
  return reqPost('/qmFind/hlrSaveLike', data);
};

/**
 * 取消点赞动态
 * @param {string} activityId 动态id
 */
export const reqCancelLikeActivity = (activityId: string) => {
  const data = { target_id: activityId };
  return reqPost('/qmFind/hlrRemoveLike', data);
};

/**
 * 评论动态
 * @param {string} activityId 动态id
 * @param {string} content 评论内容
 * @param {string} userType 用户类型
 */
export const reqCommentActivity = (activityId: string, content: string, userType: string) => {
  const data = {
    target_id: activityId,
    content,
    user_type: userType,
  };
  return reqPost('/qmFind/hlrSaveComment', data);
};
