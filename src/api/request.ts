/**
  * 网络请求方法
  * @author: Ruan Jiazhen
  * @date: 2024-04-28 13:35:08
* */

import { getLocalHlrToken, getLocalToken } from '@/utils/token';

/** 前置url */
const baseUrl = import.meta.env.VITE_BASE_URL;

/** x.hudongmiao.com前置url */
const authXUrl = import.meta.env.VITE_X_BASE_URL;

/** hm.hudomgmiao.com前置url */
const authHmUrl = import.meta.env.VITE_HM_BASE_URL;

/** 响应数据基本结构 */
type ResponseData<T> = {
  /** 响应状态码，200时表示成功，401时表示token失效 */
  code: number,
  data: T,
  /** 响应消息 */
  msg: string,
}

// 请求配置(域名、请求头内容类型)
interface RequestConfig {
  baseUrlType: 'www' | 'x' | 'hm',
  contentType?: 'application/json' | 'application/x-www-form-urlencoded',
  token?: string
}

// XXX 待优化为在请求前进行token校验，如果token过期则先刷新token，再进行请求
/**
 * 请求前置函数
 * @param mode 请求的模式
 */
const beforeRequest = async (mode: string) => {
  try {
    // console.log('beforeRequest', mode);
  } catch (err) {
    console.error('beforeRequest error', err);
  }
};

/**
 * 请求前置函数
 */
const afterRequest = () => {
  // console.log('afterRequest');
};

/**
 * 普通get请求
 * @param apiUrl 请求的api地址
 * @param data 请求的参数，可选
 * @param options 请求的其他参数，可选
 */
export const reqGet = async<T extends AnyObject> (
  apiUrl: string,
  data: AnyObject = {},
  options: AnyObject = {},
) => {
  await beforeRequest('base');
  let res;
  try {
    res = await uni.request({
      url: baseUrl + apiUrl,
      method: 'GET',
      header: { token: getLocalToken() || '' },
      data,
      ...options,
    });
  } catch (err) {
    console.error(`${apiUrl} get error`, err);
  } finally {
    afterRequest();
  }

  return res as UniApp.RequestSuccessCallbackResult & {data: ResponseData<T>};
};

/**
 * authHmUrl前缀的get请求（目前是https://hm.hudongmiao.com）
 * @param apiUrl 请求的api地址
 * @param data 请求的参数，可选
 * @param options 请求的其他参数，可选
 * @returns
 */
export const reqHmGet = async (
  apiUrl: string,
  data: AnyObject = {},
  options: Partial<UniApp.RequestOptions> = {},
) => {
  await beforeRequest('hm');

  try {
    const res = await uni.request({
      url: authHmUrl + apiUrl,
      method: 'GET',
      data,
      ...options,
      header: { token: getLocalToken() || '' },
    });
    return res;
  } catch (err) {
    console.error(`${apiUrl} get error`, err);
  } finally {
    afterRequest();
  }

  return null;
};

/**
 * 普通post请求
 * @param apiUrl 请求的api地址
 * @param data 请求的参数，可选
 * @param options 请求的其他参数，可选
 */
export const reqPost = async<T extends AnyObject> (
  apiUrl: string,
  data: AnyObject = {},
  options: Partial<UniApp.RequestOptions> = {},
) => {
  await beforeRequest('base');
  let res;
  try {
    res = await uni.request({
      url: baseUrl + apiUrl,
      method: 'POST',
      data,
      ...options,
      header: {
        token: getLocalToken() || '',
        ...options.header,
      },
    });
  } catch (err) {
    console.error(`${apiUrl} post error`, err);
  } finally {
    afterRequest();
  }

  return res as UniApp.RequestSuccessCallbackResult & {data: ResponseData<T>};
};

/**
 * authHmUrl前缀的post请求（目前是https://hm.hudongmiao.com）
 * @param apiUrl 请求的api地址
 * @param data 请求的参数，可选
 * @param options 请求的其他参数，可选
 * @returns
 */
export const reqHmPost = async (
  apiUrl: string,
  data: AnyObject = {},
  options: Partial<UniApp.RequestOptions> = { header: { 'Content-Type': 'application/json' } },
) => {
  await beforeRequest('base');
  try {
    const res = await uni.request({
      url: authHmUrl + apiUrl,
      method: 'POST',
      data,
      ...options,
      header: {
        token: getLocalToken() || '',
        ...options.header,
      },
    });
    return res;
  } catch (err) {
    console.error(`${apiUrl} post error`, err);
  } finally {
    afterRequest();
  }

  return null;
};

/**
 * 上传文件
 * @param apiUrl 请求的api地址
 * @param filePath 文件路径
 * @param formData 请求的参数，可选
 * @param options 请求的其他参数，可选
 */
export const reqUploadFile = async (
  apiUrl: string,
  filePath: string,
  formData: AnyObject = {},
  options: AnyObject = {},
): Promise<UniApp.UploadFileSuccessCallbackResult> => {
  await beforeRequest('token');

  try {
    const res = (await new Promise((resolve) => {
      uni.uploadFile({
        url: baseUrl + apiUrl,
        filePath,
        name: 'file',
        formData: { ...formData },
        ...options,
        success: (successRes) => {
          resolve(successRes);
        },
        fail: (err) => {
          throw err;
        },
        complete: () => {
          afterRequest();
        },
      });
    })) as UniApp.UploadFileSuccessCallbackResult;
    return res;
  } catch (err) {
    console.error(`${apiUrl} uploadFile error`, err);
  } finally {
    afterRequest();
  }

  return {
    data: '',
    statusCode: 0,
  };
};

/**
 *  前置url可以灵活改变的get请求(婚礼人业务专用)
 * @param apiUrl 请求的api地址
 * @param data 请求的参数，可选
 * @param options 请求的其他参数，可选
 */
export const reqHlrGet = async (apiUrl: string, data: AnyObject, options: AnyObject & RequestConfig = { baseUrlType: 'www' }) => {
  await beforeRequest('base');
  let hlrBaseUrl;
  if (options.baseUrlType === 'www') {
    hlrBaseUrl = baseUrl;
  } else if (options.baseUrlType === 'x') {
    hlrBaseUrl = authXUrl;
  } else if (options.baseUrlType === 'hm') {
    hlrBaseUrl = authHmUrl;
  }

  const tmpToken = options.token ? options.token : getLocalHlrToken('hlr');

  try {
    const res = await uni.request({
      url: hlrBaseUrl + apiUrl,
      method: 'GET',
      header: { token: tmpToken },
      data,
      ...options,
    });
    return res.data;
  } catch (err) {
    console.error(`${apiUrl} get error`, err);
  } finally {
    afterRequest();
  }

  return null;
};

/**
 * 前置url可以灵活改变的post请求(婚礼人业务专用)
 * @param apiUrl 请求的api地址
 * @param data 请求的参数，可选
 * @param options 请求的其他参数，可选
 */
export const reqHlrPost = async (
  apiUrl: string,
  data: AnyObject,
  options: AnyObject & RequestConfig = {
    baseUrlType: 'www',
    contentType: 'application/json',
  },
) => {
  await beforeRequest('base');
  let hlrBaseUrl;
  if (options.baseUrlType === 'www') {
    hlrBaseUrl = baseUrl;
  } else if (options.baseUrlType === 'x') {
    hlrBaseUrl = authXUrl;
  } else if (options.baseUrlType === 'hm') {
    hlrBaseUrl = authHmUrl;
  }
  const contentType = options.contentType ? options.contentType : 'application/json';

  const tmpToken = options.token ? options.token : getLocalHlrToken('hlr');

  try {
    const res = await uni.request({
      url: hlrBaseUrl + apiUrl,
      method: 'POST',
      header: {
        token: tmpToken,
        'Content-Type': contentType,
      },
      data,
      ...options,
    });
    return res.data;
  } catch (err) {
    console.error(`${apiUrl} post error`, err);
  } finally {
    afterRequest();
  }

  return null;
};
