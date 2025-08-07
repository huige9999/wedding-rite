/**
  *各种默认值，非基础类型的默认值使用时注意进行深拷贝或不要修改
  * @author: Ruan Jiazhen
  * @date: 2024-04-28 17:17:38
* */

/** 默认的用户信息 */
export const DEFAULT_USER_INFO = {
  /** 用户id */
  id: '',
  /** 头像 */
  avatar: '',
  /** 昵称 */
  nickname: '',
  /** 电话号码 */
  phone: '',
  /** 年龄 */
  age: '',
  /** 身高 */
  height: '',
  /** 体重 */
  weight: '',
  /** 用户类型（只用于传递给后端，前端不需要了解含义） */
  type: <'1' | '2' | '3'> '1',
  /** vip到期时间 */
  vipEndTime: '',
  /** 邀请码 */
  invite_key: '',
  /** openid */
  openId: '',
  /** 支付宝账号 */
  zfb_account: '',
  /** 支付宝姓名 */
  zfb_name: '',
  /** 账户可提现余额 */
  account_remain: '0',
  /** 是否已购买Wedding Rite服务 */
  // XXX 已添加会员过期时间字段，待废弃
  hasPurchasedWeddingLink: false,
  /** 是否显示视频模块（用于在审核期间关闭） */
  isShowVideoModel: false,
};

/** 默认的个人信息 */
export const DEFAULT_PERSONAL_INFO = {
  photoList: <Array<string>>[],
  realName: '',
  intro: '',
  tags: <Array<string>>[],
  voice: '',
  workPlace: ['', '', ''],
  proficiency: -1,
  phone: '',
};

/** 默认嗨喵头像 */
export const DEFAULT_AVATAR = 'http://ustatic.joymew.com/emcee/common/b51d744c7b3f4f379d3f7f989c295daf';

/** VIP激活logo */
export const VIP_ACTIVE_LOGO = 'https://ustatic.hudongmiao.com/%20miao/riteVip/vipGoldenIcon.png';

/** VIP未激活logo */
export const VIP_UNACTIVE_LOGO = 'https://ustatic.hudongmiao.com/%20miao/riteVip/da659e961bcb2d002386ff5cd5102a8.png';
