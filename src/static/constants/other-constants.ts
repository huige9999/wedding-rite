/**
  * 不好分类的其他常量
  * @author: Ruan Jiazhen
  * @date: 2024-04-28 17:18:04
* */

/**
 * 通过他人分享进入小程序的场景值
 */
export const SHARE_SCENES = [
  1007, // 单人聊天会话中的小程序消息卡片
  1008, // 群聊会话中的小程序消息卡片
  1011, // 扫描二维码
  1012, // 长按图片识别二维码
  1013, // 手机相册选取二维码
  1036, // App 分享消息卡片
  1044, // 带 shareTicket 的小程序消息卡片
  1047, // 扫描小程序码
  1048, // 长按图片识别小程序码
  1049, // 手机相册选取小程序码
  1073, // 客服消息列表下发的小程序消息卡片
  1074, // 公众号会话下发的小程序消息卡片
  1091, // 公众号文章商品卡片
  1202, // 企微客服号会话打开小程序卡片
];

/** 换一换文案列表 */
export const CHANGE_TEXT_LIST = [
  '千里之行，始于接单',
  '我想为你做好一场婚礼',
  '一辈子专心做一件事',
  '白茶清风无别事，我在等风也等你',
  '一场婚礼一个故事，荣幸与你一起书写别人的故事，感恩你出现在我的故事里',
  '我把你给的每一单，都当作一枚勋章，是我继续前行的力量',
  '没有你跟的订单，赢了世界又如何',
  '做一个用心的婚礼人，对得起别人的故事，对得起自己的青春',
];

/** 【Wedding Rite】模块分享的页面名称的列表 */
export const WEDDING_SHARE_PAGE_NAME_LIST_NORMAL = [
  'subpkg/wedding-link/my-preview-share',
  'subpkg/wedding-link/more-works',
  'subpkg/wedding-link/work-detail-share',
  'subpkg/wedding-link/more-activities',
  'subpkg/wedding-link/activity-detail-share',
  'subpkg/wedding-link/schedule-poster-share',
  'subpkg/wedding-link/personal-schedule-share',
];

/** Wedding Rite模块分享给同行的页面名称的列表 */
export const WEDDING_SHARE_PAGE_NAME_LIST_WORKMATE = [
  'subpkg/wedding-link/invite-workmate-preview-share',
  'subpkg/wedding-link/activity-detail-share-workmate',
  'subpkg/wedding-link/work-detail-share-workmate',
];

/** 【Wedding Rite】模块登录相关页面的名称的列表 */
export const WEDDING_LOGIN_PAGE_NAME_LIST = [
  'subpkg/wedding-link/login',
  'subpkg/wedding-link/explore',
];
