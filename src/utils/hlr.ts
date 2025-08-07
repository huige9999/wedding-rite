// 设置婚礼人业务的相关数据
export const setHlrData = (hlrData: AnyObject) => {
  try {
    // 获取缓存中的hlrData
    let cachedHlrData = uni.getStorageSync('hlrData')
    // 如果缓存中没有hlrData，则直接存入
    if (!cachedHlrData) {
      const keys = Object.keys(hlrData)
      const tmpObj:{[key:string]: string} = {}
      for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i]
        if (hlrData[key]) {
          tmpObj[key] = hlrData[key]
        }
      }
      uni.setStorageSync('hlrData', JSON.stringify(tmpObj))
      // uni.setStorageSync('hlrData', JSON.stringify(hlrData))
    } else {
      // 如果缓存中有hlrData，则将其转换为对象
      cachedHlrData = JSON.parse(cachedHlrData)
      // 获取传入的对象的key值数组
      const keys = Object.keys(hlrData)
      // 遍历key值数组
      for (let i = 0; i < keys.length; i += 1) {
        // 获取当前key值
        const key = keys[i]
        if (hlrData[key]) {
          console.log(hlrData[key])
          // 如果传入的对象的key值在缓存中的对象中存在，则更新缓存中的对象的对应属性值
          if (Object.prototype.hasOwnProperty.call(cachedHlrData, key)) {
            cachedHlrData[key] = hlrData[key]
          } else {
            // 如果传入的对象的key值在缓存中的对象中不存在，则新增到缓存中的对象的属性中
            cachedHlrData[key] = hlrData[key]
          }
        }
      }
      // 将更新后的缓存中的对象重新存入缓存
      uni.setStorageSync('hlrData', JSON.stringify(cachedHlrData))
    }
  } catch (e) {
    console.error('set hlrData error', e)
  }
}

// 获取婚礼人业务的相关数据
export const getLocalHlrData = () => {
  try {
    const cachedHlrData = uni.getStorageSync('hlrData')
    return cachedHlrData ? JSON.parse(cachedHlrData) : null
  } catch (e) {
    console.error('get hlrData error', e)
  }
}
