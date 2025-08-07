// 将部分有回调函数参数的 uniapp API 转换为 Promise 形式

/** Promise化的uni.authorize请求授权 */
export const uniAuthorize = (scope: string) => new Promise((resolve, reject) => {
  uni.authorize({
    scope,
    success: resolve,
    fail: reject,
    complete: () => {
      resolve('complete');
    },
  });
});

/** Promise化的uni.chooseLocation */
export const uniChooseLocation = () => new Promise((resolve) => {
  uni.chooseLocation({
    success: resolve,
    fail: (err) => { throw (err); },
    complete: () => {
      resolve('complete');
    },
  });
});

/**
 * Promise化的uni.chooseMedia
 * @param options uni.chooseMedia的参数
 */
export const uniChooseMedia = (options: UniApp.ChooseMediaOption) => {
  const promise = new Promise<Partial<UniApp.ChooseMediaSuccessCallbackResult>>((resolve) => {
    uni.chooseMedia({
      ...options,
      success: resolve,
      fail: (err) => { throw (err); },
      complete: resolve,
    });
  });
  return promise;
};

/**
 * Promise化的uni.login
 */
export const uniLogin = () => new Promise<UniApp.LoginRes>((resolve) => {
  uni.login({
    success: resolve,
    fail: (err) => { throw (err); },
    complete: (res) => {
      resolve(res);
    },
  });
});
