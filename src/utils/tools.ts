import { reqUploadImg } from '@/api/others';
import { uniChooseMedia } from './uniapp-api-promised';

/** 生成8位的随机字符串（数字+字母） */
export const random8BitString = () => Math.random().toString(36).slice(2, 10);

/** 显示弹窗
 * @param {string} title 弹窗标题
 * @param {string} icon 弹窗图标
 * @param {string} duration 弹窗持续时间
 * @param {string} mask 是否显示透明蒙层，防止触摸穿透
 * @param {string} image 自定义图标的本地路径，image 的优先级高于 icon
 * @param {string} success 成功回调
 * @param {string} fail 失败回调
 * @param {string} complete 完成回调
 */
export const showToast = (
  title: string,
  icon: 'none' | 'success' | 'loading' | 'error' | undefined = 'none',
  duration = 1500,
  mask = false,
  image = '',
  success = () => { },
  fail = () => { },
  complete = () => { },
) => {
  uni.showToast({
    title,
    icon,
    duration,
    mask,
    image,
    success,
    fail,
    complete,
  });
};

/**
 * 返回传入年份剩余的月份
 * @param year 年份
 * @param currentDate 当前日期
 * @returns 月份列表
 */
export const getRemainingMonthList = (
  year: number,
  currentDate: string = new Date().toString(),
) => {
  console.log('year', year);
  console.log('currentDate', currentDate);
  const currentYear = new Date(currentDate).getFullYear();
  const currentMonth = new Date(currentDate).getMonth() + 1;
  const monthList = [];
  // 如果传入的年份等于当前年份，则返回当前年份剩余的月份
  if (year === currentYear) {
    for (let i = currentMonth; i <= 12; i += 1) {
      monthList.push(i);
    }
    // 否则返回12个月份
  } else {
    for (let i = 1; i <= 12; i += 1) {
      monthList.push(i);
    }
  }
  return monthList;
};

/**
 * 返回传入年份、月份剩余的天数
 * @param year 年份
 * @param month 月份
 * @param currentDate 当前日期
 * @returns 天数列表
 */
export const getRemainingDayList = (
  year: number,
  month: number,
  currentDate: string = new Date().toString(),
) => {
  const currentYear = new Date(currentDate).getFullYear();
  const currentMonth = new Date(currentDate).getMonth() + 1;
  const currentDay = new Date(currentDate).getDate();
  const dayCount = new Date(year, month, 0).getDate();

  const dayList = [];
  // 如果传入的年份、月份等于当前年份、月份，则返回当前年份、月份剩余的天数
  if (year === currentYear && month === currentMonth) {
    for (let i = currentDay; i <= dayCount; i += 1) {
      dayList.push(i);
    }
    // 否则返回传入年份、月份的天数
  } else {
    for (let i = 1; i <= dayCount; i += 1) {
      dayList.push(i);
    }
  }
  return dayList;
};

/**
 * 选择图片并上传
 * @param option 选择图片的配置
 * @returns 返回图片地址列表
 */
export const chooseImgAndUpload = async (option:UniApp.ChooseMediaOption) => {
  const chooseRes = await uniChooseMedia(option);
  console.log('chooseRes', chooseRes);
  const temFilePathList = chooseRes.tempFiles.map((item) => item.tempFilePath);
  const urlList = await temFilePathList.map(async (temFilePath) => {
    const uploadRes = (await reqUploadImg(temFilePath)) as any;
    console.log('uploadRes', uploadRes);
    const url = JSON.parse(uploadRes.data).data.filePath as string;
    return url;
  });
  return Promise.all(urlList);
};

/**
 * 检测输入字符串是否符合手机号码格式
 * @param {string} str 输入字符串
 */
export const isPhoneNum = (str: string) => {
  const reg = /^1[3456789]\d{9}$/;
  return reg.test(str);
};

/**
 * 将文字按照换行符分割成数组
 * @param {string} str 输入字符串
 */
export const splitStrByLineBreak = (str: string) => str.split('\n');

/** 将手机号中间的4位替换为「*」
 * @param phone 手机号
 * @returns 替换后的手机号
 */
export const replacePhone = (phone: string) => phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');

/**
 * 判断地址是否为网络地址
 * @param {string} url 地址
 * @returns {boolean} 是否为网络地址
 */
export const isNetworkUrl = (url: string) => {
  const reg = /^http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/;
  return reg.test(url);
};
