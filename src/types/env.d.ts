/**
  * 全局类型定义
  * @author: Ruan Jiazhen
  * @date: 2024-04-28 17:55:39
* */
/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

/** 时间段 */
type Period = '早上' | '上午' | '午宴' | '下午' | '晚宴' | '全天'

/** 档期信息 */
type ScheduleInfo = {
  /** id */
  id: string
  /** 档期时间 */
  date: string
  /** 时间段 */
  period:Period
  /** 档期类型 booked 已预定 unbooked 未预定 */
  type: 'booked' | 'unbooked'
  /** 举办地点 */
  address: string
  /** 客户名称 */
  customerName: string
  /** 客户电话 */
  customerPhone: string
  /** 收款是否已结清 */
  hasBeenPaid: boolean
  /** 总价 */
  totalPrice: string
  /** 定金 */
  deposit: string
  /** 备注 */
  remark: string
}

/** 档期列表，将档期按照月份进行分类 */
type AllScheduleList = Array<{
  /** 年份 */
  year: number
  /** 月份 */
  month: number
  /** 合计收入，保留两位小数 */
  totalIncomeString: string
  /** 档期列表 */
  scheduleList: ScheduleInfo[]
}>

/** 请求返回的档期列表数据（按照月份进行分组） */
type ResScheduleListData = {
  list: Array<{
    date: string;
    size: number;
    totalPrice: number;
    dataList: Array<{
      date: string;
      emcee_name: string;
      address: string;
      kind: string;
      customer_phone: string;
      remark: string;
      type: string;
      time_interval: string;
      userId: string;
      is_delete: string;
      price: string;
      paid: string;
      avator: string;
      customer_name: string;
      schedule_id: number;
    }>;
  }>;
  user: {
    game_income100_size: number;
    bar_self_rate: number;
    user_describe: string;
    team_id: string;
    is_user_h5: string;
    carnival_level: number;
    wx_openid_xin: string;
    wx_openid: string;
    price: string;
    wx_nickname_xin: string;
    super_level: number;
    kbx_game_level: number;
    game_level: number;
    id: string;
    register_ip: string;
    hhr_type: string;
    uesr_kind: string;
    remain_album_money: number;
    high_privilege: number;
    all_may_money: number;
    create_time: string;
    login_times: number;
    vip_grade: number;
    record_size: number;
    all_album_money: number;
    time_lastlogin: string;
    is_hide_super: string;
    sign_show_phone: string;
    passwd: string;
    hhr_userId: string;
    avator: string;
    vip_level: number;
    is_banned: string;
    invite_pcount: number;
    is_free_heart: string;
    time_last2login: string;
    keep_kbx_share: string;
    unionid: string;
    works: string;
    applied: string;
    invite_key: string;
    wx_headimgurl_xin: string;
    remain_may_money: number;
    phonenumber: string;
    id_card: string;
    real_name: string;
    user_end_type: string;
    start_vip_level: string;
    is_hide_zfb: string;
    phone_location: string;
    remain_like: number;
    is_can_create_user: string;
    all_like: number;
    common_address: string;
    emcee_name: string;
    id_card_photo: string;
    bar_parent_rate: number;
    stage_photo: string;
    sex: string;
    auth_state: string;
    inviter_like: number;
    wedding_switch: string;
    powder_switch: string;
    keep_dzp_share: string;
    end_ip_location: string;
  }
}

/** 用户信息 */
type UserInfo = typeof import('@/static/constants/default-constant').DEFAULT_USER_INFO

/** 个人信息 */
type PersonalInfo = Partial<typeof import('@/static/constants/default-constant').DEFAULT_PERSONAL_INFO>

/** 年单量总览数据 */
type YearOverviewDate = {
  /** 年份 */
  year: number
  /** 总单量 */
  totalOrderCount: number
  /** 总收入 */
  totalIncome: number
  /** 各月份数据 */
  monthData: Array<{
    /** 月份 */
    month: string
    /** 单量 */
    orderCount: number
    /** 收入 */
    income: number
  }>
}

/** 档期海报信息 */
type SchedulePosterInfo = {
  /** 背景图片地址 */
  bgImg: string
  /** 是否显示电话号码 */
  isShowPhone: boolean
  /** 是否显示文字内容 */
  isShowText: boolean
  /** 文字内容 */
  text: string
}

/** 作品信息 */
type WorkInfo = {
  /** 作品id */
  id: string
  /** 作品封面地址 */
  coverUrl: string
  /** 作品标题 */
  title: string
  /** 作品描述 */
  desc: string
  /** 作品标签 */
  tags: string[]
  /** 作品视频地址 */
  videoUrl: string[]
  /** 作品图片地址 */
  imgUrl: string[]
  /** 喜欢数 */
  likeCount: number
}

/** 评论内容 */
type CommentInfo = {
  /** 评论id */
  id: string;
  /** 头像 */
  avatar: string;
  /** 昵称 */
  nickname: string;
  /** 评论内容 */
  content: string;
}

/** 动态信息 */
type ActivityInfo = {
  /** 动态id */
  id: string
  /** 动态创建时间 */
  createTime: string
  /** 动态发布者昵称 */
  nickname: string
  /** 动态发布者用户id */
  userId: string
  /** 动态发布者头像 */
  avatar: string
  /** 动态封面地址 */
  coverUrl: string
  /** 动态标题 */
  title: string
  /** 动态正文 */
  content: string
  /** 动态视频地址 */
  videoUrl?: string[]
  /** 动态图片地址 */
  imgUrl?: string[]
  /** 喜欢数 */
  likeCount: number
  /** 自己是否喜欢该动态 */
  isLike: boolean
  /** 评论数 */
  commentCount: number
  /** 评论列表 */
  commentList: CommentInfo[]
}

/** 单条动态的请求数据 */
type ActivityResInfo = {
  find_id: number;
  create_time: string;
  user_qm_name: string;
  isLike: '0' | '1';
  subject: string;
  comment_size: number;
  read_size: number;
  title: string;
  type: string;
  userId: string;
  content: string;
  file_size: string;
  cover: string;
  grade: string;
  user_headimg: string;
  file_times: string;
  mediaInfo: string;
  likes: number;

  comment_list: Array<{
    comment_id: string,
    content: string,
    headimg_url: string,
    is_delete: string,
    nickname: string,
    target_id: string,
    type: string,
    userId: string
  }>
}

/** 动态数据 */
type ActivityData = {
  totalResult: number;
  totalPage: number;
  list: ActivityResInfo[];
  currentPage: number;
}

/** 返回的动态数据中的媒体信息（经过JSON解析后） */
type MediaInfo = {
  type: 'video' | 'image';
  mediaPath: string[];
}

/** 发送的动态数据 */
type SendActivityInfo = {
  /** 动态正文 */
  content: string;
  /** 动态封面 */
  cover: string;
  /** 动态视频 */
  videos: string[];
  /** 动态图片 */
  images: string[];
}

/** 编辑的动态数据 */
type EditActivityInfo = SendActivityInfo & {
  /** 动态id */
  activityId: string;
}

/** 请求评论数据时返回的单个评论数据 */
type CommentResCommentInfo = {
  is_read: string;
  create_time: string;
  nickname: string;
  target_id: string;
  comment_id: number;
  type: string;
  userId: string;
  content: string;
  headimg_url: string;
  is_delete: string;
}

type CommentResInfoData = {
  totalResult: number;
  totalPage: number;
  list: CommentResCommentInfo[];
}

/** 获取评论请求返回的数据 */
type CommentRes = {
  code: number;
  data: CommentResInfoData;
  msg: string;
}

/** 邀请的用户信息 */
type InviteUserItem = {
  /** 用户id */
  userId: string;
  /** 用户头像 */
  avatar: string;
  /** 用户昵称 */
  nickname: string;
  /** 受邀时间 */
  inviteTime: string;
  /** 是否已激活 */
  isActivate: boolean;
}

/** 单个收邀用户的数据 */
type InviteUserItemRes = {
  emcee_name: string;
  create_time: string;
  money: string;
  is_new: string;
  kind: string;
  avator: string;
}

/** 邀请的用户列表请求数据 */
type InviteUserListResData = {
  totalResult: number;
  totalPage: number;
  list: InviteUserItemRes[];
}

interface HlrServiceData {
  hlrToken?: string
  hlrUserType?: string
  hlrAvatar?: string
  hlrName?: string
  hlrUserId?: string
  hlrShareType?: string
  [key: string]: string | undefined
}

/** 临时用户信息 */
type TempUserInfo = {
  /** 用户id */
  id: string
  /** 用户昵称 */
  nickname: string
  /** 用户头像 */
  avatar: string
  /** 用户类型 */
  type: string
}

/** 预定信息 */
type BookingInfo = {
  /** 预定id */
  id: string
  /** 预定者姓名 */
  name?: string
  /** 预定者电话 */
  phone?: string
  /** 预定日期 */
  date?: string
  /** 预定时间段 */
  period?: Period
  /** 预定备注 */
  remark?: string
  /** 是否已处理 */
  hasBeenResolved: boolean
}

/** 提交的预定信息 */
type BookingSubmitData = {
  name: string;
  phone: string;
  date: string;
  period: string;
  remark: string;
}

/** 提现记录 */
type WithDrawRecordItem = {
  user_id: string;
  user_avator: string;
  time: string,
  account: string
}
