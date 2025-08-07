import { reqGet, reqPost } from './request';

/**
 * 获取作品列表
 * @param userId 用户id 默认为空字符串
 * @param page 页码，默认为1
 * @param size 每页数量 默认10
 */
export const reqGetWorkList = (userId = '', page = 1, size = 10) => reqGet('/qiMiao/getCaseList', {
  obj_userId: userId,
  currentPage: page,
  showCount: size,
});

/** 获取作品详情 */
export const reqGetWorkDetail = (id: string) => reqGet('/qiMiao/getCase', { case_id: id });

/**
 * 删除作品
 * @param id 作品id
 */
export const reqDeleteWork = (id: string) => reqGet('/qiMiao/editCase', {
  case_id: id,
  is_delete: '1',
});

/**
 * 保存作品
 * @param workInfo
 */
export const reqSaveWork = (workInfo: WorkInfo) => reqPost('/qiMiao/saveCase', {
  case_name: workInfo.title,
  case_cover: workInfo.coverUrl,
  case_style: workInfo.tags.join(','),
  more_information_json: workInfo.desc,
  case_video_json: JSON.stringify(workInfo.videoUrl.map((url) => ({ videoPath: url }))),
  case_picture_json: JSON.stringify(workInfo.imgUrl.map((url) => ({ imagePath: url }))),
});
