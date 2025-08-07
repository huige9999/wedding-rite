// 婚礼人相关的api
import { reqHlrGet, reqHlrPost } from './request';

/**
 * 更新访问量
 * @param {string} userId 用户id
 */
export const addBrowses = (userId: string) => reqHlrPost('/qiMiao/addBrowses', { userId }, { baseUrlType: 'www' });

/**
 * 婚礼人授权登录
 * @param {string} code 微信登录code
 */
export const authUserApp = (code: string) => reqHlrPost('/wx_login/hl_oauth_user', { code }, {
  baseUrlType: 'x',
  contentType: 'application/x-www-form-urlencoded',
});

/**
 * 谢幕授权登录
 * @param {string} code 微信登录code
 */
export const newAuthUser = (code: string) => reqHlrPost('/wxAuth/hl_oauth_user', { code }, {
  baseUrlType: 'hm',
  contentType: 'application/x-www-form-urlencoded',
});

/**
 * 获取用户的作品列表
 * @param {string} id 用户id
 */
export const getCaseList = (id: string) => reqHlrGet('/qiMiao/getCaseList', { obj_userId: id }, { baseUrlType: 'www' });

/**
 * 获取用户信息
 * @param {string} id 用户id
 * @param {string} userType 用户类型
 */
export const getUserInfo = (id: string, userType: string) => reqHlrGet('/qiMiao/getOhterUserInfo', {
  obj_userId: id,
  user_type: userType,
}, { baseUrlType: 'www' });

/**
 * 获取评价列表
 * @param {string} userId 用户id
 * @param {number} currentPage 当前页
 * @param {number} showCount 每页条数
 */
export const getUserComments = (userId: string, currentPage: number, showCount: number) => reqHlrGet(
  '/splidComment/getMyCommentList',
  {
    is_need_label: '1',
    type: '3',
    currentPage,
    showCount,
    obj_userId: userId,
  },
  { baseUrlType: 'www' },
);

/**
 * 获取某个作品的评价列表
 * @param {string} targetId 作品id
 */
export const getComments = (targetId: string) => reqHlrPost('/qiMiao/getCommentList', {
  currentPage: 1,
  showCount: 20,
  type: '1',
  target_id: targetId,
}, { baseUrlType: 'www' });

/**
 * 获取作品详情
 * @param {string} caseId 作品id
 */
export const getCaseDetail = (caseId: string) => reqHlrPost('/qiMiao/getCase', { case_id: caseId }, { baseUrlType: 'www' });

/**
 * 点赞
 * @param {string} targetId 作品id
 * @param {string} userType 用户类型
 */
export const praise = (targetId: string, userType: string) => reqHlrPost('/qiMiao/saveLike', {
  target_id: targetId,
  user_type: userType,
}, { baseUrlType: 'www' });

/**
 * 取消点赞
 * @param {string} targetId 作品id
 */
export const unpraise = (targetId: string) => reqHlrPost('/qiMiao/removeLike', { target_id: targetId }, { baseUrlType: 'www' });

/**
 * 评论
 * @param {string} content 作品内容
 * @param {string} targetId 作品id
 * @param {string} userType 用户类型
 */
export const saveComment = (content: string, targetId: string, userType: string) => reqHlrPost('/qiMiao/saveComment', {
  target_id: targetId,
  type: '1',
  user_type: userType,
  content,
}, { baseUrlType: 'www' });

export const wxGetUserProfile = () => new Promise((resolve, reject) => {
  uni.getUserProfile({
    lang: 'zh_CN',
    desc: '业务需要',
    success: (res) => {
      resolve(res);
    },
    fail: (err) => {
      reject(err);
    },
  });
});

/**
 * 婚礼人更新用户头像昵称信息
 * @param {string} encryptedData
 *  @param {string} iv
 *  @param {string} userInfo
 */
export const updateHlUserInfo = (encryptedData: string, iv: string, userInfo: string) => reqHlrPost(
  '/wxAuth/updateHlUserInfo',
  {
    encryptedData,
    iv,
    userInfo,
  },
  {
    baseUrlType: 'hm',
    contentType: 'application/x-www-form-urlencoded',
  },
);

/**
 * 授权获取手机号
 * @param {string} encryptedData
 *  @param {string} iv
 */
export const authGetPhone = (encryptedData: string, iv: string) => reqHlrPost('/wxAuth/authPhone', {
  encryptedData,
  iv,
}, {
  baseUrlType: 'hm',
  contentType: 'application/x-www-form-urlencoded',
});

/**
 * 授权获取手机号(评价预定模块)
 * @param {string} code
 */
export const authGetPhoneByCode = (code: string) => reqHlrPost('/wxScan/getPhoneNumber', {
  code,
  type: '2',
}, {
  baseUrlType: 'hm',
  contentType: 'application/x-www-form-urlencoded',
});

/**
 * 预定主持
 * @param {AnyObject} pObj
 */
export const reserveHost = (pObj: AnyObject) => reqHlrPost('/schedule/save', pObj, {
  baseUrlType: 'www',
  contentType: 'application/x-www-form-urlencoded',
});

/**
 * 获取预定信息
 * @param {string} splid
 */
export const getReserveInfo = (splid: string) => reqHlrPost(
  '/schedule/getUserSchedule',
  { splid },
  {
    baseUrlType: 'www',
    contentType: 'application/x-www-form-urlencoded',
  },
);

/**
 * 获取用户的档期
 * @param {string} id
 */
export const getScheduleInfo = (id: string) => reqHlrGet(
  '/schedule/getScheduleInfo',
  { obj_userId: id },
  {
    baseUrlType: 'www',
    contentType: 'application/x-www-form-urlencoded',
  },
);

/**
 * 获取婚礼圈内容详情
 * @param {string} id
 */
export const getFindById = (id: string) => reqHlrGet(
  '/qmFind/getFindInfo',
  { find_id: String(id) },
  {
    baseUrlType: 'www',
    contentType: 'application/x-www-form-urlencoded',
  },
);

/**
 * 获取谢幕信息
 * @param {string} splid
 */
export const getByeData = (splid: string, token: string) => reqHlrGet(
  '/qiYeNe/liebiao',
  { splid },
  {
    baseUrlType: 'www',
    contentType: 'application/x-www-form-urlencoded',
    token,
  },
);

/**
 * 更新谢幕信息
 * @param {AnyObject} formData
 */
export const updateByeData = (formData: AnyObject, token: string) => reqHlrGet(
  '/qiYeNe/update',
  formData,
  {
    baseUrlType: 'www',
    contentType: 'application/x-www-form-urlencoded',
    token,
  },
);
