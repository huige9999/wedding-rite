import { reqGet, reqUploadFile } from './request';

// XXX 目前所有类型的文件的上传都是上传到同一地址（七牛云）的，后续考虑合并上传方法
/**
 * 上传图片
 * @param filePath 文件路径
 */
export const reqUploadImg = (filePath: string) => reqUploadFile('/beiJing/shangchuanTomcat', filePath);

/**
 * 上传文件
 * @param filePath 文件路径
 */
export const reqUploadAnyFile = (filePath: string) => reqUploadFile('/beiJing/shangchuanTomcat', filePath);

/**
 * 获取音视频元信息
 * @param fileUrl 文件路径
 */
export const reqGetAudioAndVideoMeta = (fileUrl: string) => {
  if (!fileUrl) {
    return Promise.reject(new Error('文件路径不能为空'));
  }

  return uni.request({
    url: `${fileUrl}?avinfo`,
    method: 'GET',
    header: { 'content-type': 'application/json' },
  });
};
