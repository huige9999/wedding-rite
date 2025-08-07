/**
  * 后端接口返回数据类型定义
  * @author: Ruan Jiazhen
  * @date: 2024-04-28 17:55:57
* */

/** 请求数据 */
interface ResData<T> {
  code: number | string;
  data: T;
  msg: string;
}

/** Wedding Rite用户类型 */
type WeddingUserType = '1' | '3'

/** 登录返回的用户信息 */
interface LoginUserInfo {
  all_my_money?: number;
  browses?: number;
  deposit_price?: string;
  fan_size?: number;
  follow_size?: number;
  good_comment_size?: number;
  haibao_content?: string;
  id?: string;
  is_conner?: string;
  is_login_app?: string;
  my_qrcode?: string;
  new_fan_size?: number;
  passwd?: string;
  personalInfo?: string;
  phonenumber?: string;
  poster_json?: string;
  remain_my_money?: number;
  share_rate?: number;
  team_id?: string;
  teamInfo: object;
  token?: string;
  total_price?: string;
  uesr_birthday?: string;
  user_age?: string;
  user_city?: string;
  user_desc?: string;
  user_headimg?: string;
  user_height?: string;
  user_lbt?: string;
  user_qm_name?: string;
  user_sex?: string;
  user_type?: '1'|'2'|'3';
  user_weight?: string;
  user_wx?: string;
  userId?: string;
  wedding_link_user_type: WeddingUserType
}

/** 使用密码登录返回数据 */
type LoginByPasswordRes = ResData<{
  // 失败的时候的返回
  IP?: string,
  errMsg?: string,
  passwd?: string,
  phonenumber?: string,
  user_end_type?: string,
  // 成功的时候的返回
  code?: '200' | '500'
}& LoginUserInfo>

/** 发送验证码返回数据 */
type SendCodeRes = {
  code: '200' | undefined
  msg: string
  data: {
    ext: string,
    codeId: string,
    code: '200' | undefined
  }
}

/** 验证码登录返回数据 */
type LoginByCodeRes = ResData<{
  /** 200成功 201验证码过期 202验证码错误 203手机号未注册 */
  code?: '200' | '201' | '202' | '203',
  errMsg?: string,
  // 成功的时候的返回
} & LoginUserInfo>

/** 修改密码返回数据 */
type ChangePasswordRes = {
  msg: string;
  codeId: string;
  code: '200'|'500';
  passwd: string;
  IP: string;
  phonenumber: string;
  source: number;
  sms_status: string;
  token: string;
}

/** 获取个人用户信息返回数据 */
type GetUserAndPersonalInfoResData = {
  all_my_money: number;
  browses: number;
  fan_size: number;
  follow_size: number;
  good_comment_size: number;
  is_conner: string;
  is_login_app: string;
  my_qrcode: string;
  new_fan_size: number;
  passwd: string;
  personalInfo: string;
  phonenumber: string;
  poster_json: string;
  remain_my_money: number;
  team_id: string;
  teamInfo: object;
  user_age: string;
  user_headimg: string;
  user_height: string;
  user_qm_name: string;
  user_type: '1'|'2'|'3';
  user_weight: string;
  user_wx: string;
  userId: string;
}

/** 返回数据中单项作品信息 */
type WorkItemResData = {
  case_cover: string;
  case_cover_type: string;
  case_id: number;
  case_name: string;
  case_picture_json: string;
  case_style: string;
  case_type: string;
  case_video_json: string;
  likes: number;
  more_information_json: string;
  sort: number;
  is_delete: string;
  userId: string;
}

/** 请求作品列表返回数据中的data */
type GetWorksListResDataData = {
  currentPage: number;
  totalResult: number;
  totalPage: number;
  list: WorkItemResData[];
}

/** 请求作品列表返回数据 */
type GetWorksListResData = ResData<GetWorksListResDataData>

/** 请求返回的单条预定数据 */
type BookingItemResData = {
  /** 预定id */
  schedule_id: string;
  /** 备注 */
  remark?: string;
  /** 预定时间 */
  date?: string;
  /** 是否已处理 */
  hasBeenResolved: boolean;
  /** 预定时间段 */
  time_interval?: Period;
  /** 预定人姓名 */
  customer_name?: string;
  /** 预定人电话 */
  customer_phone?: string;
}

/** 请求预定列表返回数据 */
type GetBookingsListResData = ResData<{
  /** 本次请求返回的数据量 */
  size: number
  /** 总数据量 */
  totalResult: number
  /** 总页数 */
  totalPage: number
  /** 预定列表数据 */
  list: BookingItemResData[]
}>
