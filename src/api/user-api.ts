import { reqGet, reqHmGet, reqHmPost, reqPost } from '@/api/request';

/** 获取个人信息 */
export const reqGetPersonalInfo = () => reqGet <{
  all_my_money: number;
  browses: number;
  deposit_price: string;
  fan_size: number;
  follow_size: number;
  good_comment_size: number;
  haibao_content: string;
  hasPurchasedWeddingLink: string;
  hlq_label: string;
  id: string;
  invite_key: string;
  is_conner: string;
  is_login_app: string;
  isShowVideoModel: string;
  my_qrcode: string;
  new_fan_size: number;
  passwd: string;
  personalInfo: string;
  phonenumber: string;
  poster_json: string;
  remain_my_money: number;
  share_rate: number;
  team_id: string;
  teamInfo?: {
    create_date: string;
    is_boss: string;
    is_delete: string;
    kind: string;
    team_code: string;
    team_desc: string;
    team_icon: string;
    team_id: number;
    team_name: string;
    team_type: string;
    userId: string;
  };
  token: string;
  total_price: string;
  uesr_birthday: string;
  unReadSize: number;
  user_age: string;
  user_city: string;
  user_desc: string;
  user_headimg: string;
  user_height: string;
  user_lbt: string;
  user_qm_name: string;
  user_sex: string;
  user_type: '1' | '2'| '3';
  user_weight: string;
  user_wx: string;
  userId: string;
  wedding_link_user_type: string;
  yh_account: number;
  yhOpenid: string;
  yh_use_time?: string;
  zfb_account: string;
  zfb_name: string;
}>('/qiMiao/getUserInfo');

/**
 * 通过用户id获取用户信息
 * @param userId 用户id
 */
export const reqGetUserInfoById = (userId: string) => reqGet('/qiMiao/getOhterUserInfo', { obj_userId: userId });

/**
 * 编辑用户信息或个人信息，
 * @param personalInfo 个人信息，包括类似于录播照片地址、个人简介、录音地址等信息
 * @param userInfo  用户信息，包括头像、昵称、身高、体重、年龄、熟练度等
 * @defaultValue {}
 */
export const reqEditUserInfoAndPersonInfo = (
  personalInfo: Partial<PersonalInfo>,
  userInfo: Partial<UserInfo> = {},
) => {
  // 根据传入的数据有无，拼接请求数据
  const reqData = {
    user_headimg: userInfo.avatar,
    user_qm_name: userInfo.nickname,
    user_height: userInfo.height,
    user_weight: userInfo.weight,
    user_age: userInfo.age,
    personalInfo: JSON.stringify(personalInfo),
  };
  return reqPost('/qiMiao/editUserInfo', reqData);
};

/**
 * 编辑个人信息
 * @param personalInfo 个人信息，包括类似于录播照片地址、个人简介、录音地址等信息
 */
export const reqEditPersonalInfo = (personalInfo: PersonalInfo) => {
  const reqData = { personalInfo: JSON.stringify(personalInfo) };
  return reqPost('/qiMiao/editUserInfo', reqData);
};

/** 获取用户提现信息 */
export const reqGetWithdrawInfo = () => reqGet('/tiXian/getUserBaseInfo');

/**
 * 获取邀请用户列表
 * @param {boolean} 是否已激活
 */
export const reqGetInviteUserList = (isActivated: boolean) => reqGet('/info/weddingLinkInviteList', { kind: isActivated ? '1' : '0' });

/**
 * 账号密码登录
 * @param {string} account 账号
 * @param {string} password 密码
 */
export const reqLoginByPassword = (account: string, password: string) => reqPost('/qiMiao/qmLogin', {
  phonenumber: account,
  passwd: password,
});

/**
 * 发送验证码
 * @param {string} phone 手机号
 * @param {string} source 来源 2：忘记密码 6：验证码登录
 */
export const reqSendCode = (phone: string, source:'2'|'6') => reqPost('/dengLuHm/sendWeddingLinkCode', {
  phonenumber: phone,
  source,
});

/**
 * 使用验证码登录
 * @param {string} phone 手机号
 * @param {string} code 验证码
 * @param {string} codeToken 验证码标识符
 */
export const reqLoginByCode = (phone: string, code: string, codeToken:string) => reqPost('/qiMiao/codeLogin', {
  phonenumber: phone,
  code,
  token: codeToken,
});

/**
 * 修改密码
 * @param {string} phone 手机号
 * @param {string} newPassword 新密码
 * @param {string} code 验证码
 * @param {string} codeToken 验证码标识符
 */
export const reqChangePassword = (phone: string, newPassword: string, code: string, codeToken:string) => reqPost('/dengLuHm/updateMiMa', {
  phonenumber: phone,
  passwd: newPassword,
  code,
  token: codeToken,
});

/**
 * 正式用户静默登录
 * @param {string} code 用户登录凭证
 */
export const reqUserSilentLogin = (code: string) => reqHmGet(
  '/wxAuth/getFormalTokenSilentLogin',
  { code },
  {
    header: {
      'Content-Type': 'application/x-www-form-urlencoded',
      // 获取当前小程序的appid
      appid: uni.getAccountInfoSync().miniProgram.appId,
    },
  },
);

/**
 * 临时用户静默登录
 * @param {string} code 用户登录凭证
 */
export const reqTemUserSilentLogin = (code: string) => reqHmPost(
  '/wxAuth/getTempTokenSilentLogin',
  { code },
  {
    header: {
      'Content-Type': 'application/x-www-form-urlencoded',
      // 获取当前小程序的appid
      appid: uni.getAccountInfoSync().miniProgram.appId,
    },
  },
);

/** 获取临时用户信息 */
export const reqGetTemUserInfo = () => reqHmGet('/wxAuth/getTemUserInfo');

/** 编辑临时用户信息 */
export const reqEditTemUserInfo = (temUserInfo: Partial<TempUserInfo>) => reqHmPost(
  '/wxAuth/updateTemUserInfo',
  temUserInfo,
  { header: { 'Content-Type': 'application/x-www-form-urlencoded' } },
);

/** 更新token */
export const reqUpdateToken = () => reqGet<{
  expireTime: string;
  token: string;
}>('/qiMiao/updateToken');

/** 获取邀请列表 */
export const getInviteList = () => reqGet('/VipPay/inviteList');

/** 静默授权获取openid
 * @param {string} code 静默授权获取的code
 */
export const getOpenId = (code: string) => reqPost('/VipPay/yhOauthWx', { code });

/** 开通VIP */
export const getVip = () => reqPost('/VipPay/yhZf');

/** 记录邀请
 * @param {string} id 邀请人的用户id
 */
export const recordInvite = (id: string) => reqPost('/info/saveInvite', { inviter_id: id });

/** 绑定支付宝
 * @param {string} zfbAccount 支付宝账号
 * @param {string} zfbName 支付宝姓名
 */
export const bindZfbApi = (zfbAccount: string, zfbName: string) => reqPost('/VipPay/yhZfbBind', {
  zfbAccount,
  zfbName,
});

/** 提现接口
 * @param {string} money 提现的金额
 */
export const withdrawMyMoney = (money: string) => reqPost('/VipPay/yhWithdraw', { money });

/** 获取提现记录 */
export const getWithdrawRecord = () => reqPost('/VipPay/yhWithdrawList');
