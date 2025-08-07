<template>
  <div @click="cancel">
    <div
      v-if="visible"
      class="reserve-box-placeholder"
    />
    <div
      v-if="visible"
      class="reserve-box-wrap"
    >
      <div
        class="reserve-box"
        :style="'bottom: '+bottom+'px'"
        @click.stop="()=>{}"
      >
        <div class="input-wrap">
          <div class="name-wrap">
            您的姓名:
          </div>
          <div class="content-wrap">
            <input
              v-model="name"
              type="text"
              class="input"
              placeholder="请输入姓名"
              :disabled="hasReserve"
            >
          </div>
        </div>
        <div class="input-wrap">
          <div class="name-wrap">
            联系方式:
          </div>
          <div class="content-wrap">
            <button
              :disabled="hasReserve"
              open-type="getPhoneNumber"
              class="hm-btn input"
              @getphonenumber="getPhoneNumber"
            >
              <div v-if="!phone">
                获取手机号
              </div>
              <div v-if="phone">
                {{ phone }}
              </div>
            </button>
          </div>
        </div>

        <div class="input-wrap">
          <div class="name-wrap">
            预定日期:
          </div>
          <div class="picker-wrap">
            <picker
              mode="date"
              :disabled="hasReserve"
              @change="bindDateChange"
            >
              <div class="picker-content">
                {{ date?date:'请选择日期' }}
              </div>
            </picker>
          </div>
        </div>
        <div class="input-wrap">
          <div class="name-wrap">
            预定时段:
          </div>
          <div class="picker-wrap">
            <picker
              mode="selector"
              :disabled="hasReserve"
              :value="currentTimeIndex"
              :range="timeList"
              range-key="name"
              @change="bindTimeChange"
            >
              <div class="picker-content">
                {{ reserveTime === '' ? '请选择时段' : reserveTime }}
              </div>
            </picker>
          </div>
        </div>
        <div class="input-wrap text-area-wrap">
          <div class="name-wrap">
            留言备注:
          </div>
          <div class="content-wrap">
            <textarea
              v-model="remark"
              :disabled="hasReserve"
              placeholder="请输入内容"
              class="input"
              maxlength="140"
              placeholder-style="color:rgba(0, 0, 0, 0.25)"
            />
          </div>
        </div>
        <div class="btn-group">
          <div
            class="cancel-btn"
            @click="cancel"
          >
            取消
          </div>
          <div
            v-if="!hasReserve"
            class="sure-btn"
            @click="submit"
          >
            确定
          </div>
          <div
            v-if="hasReserve"
            class="sure-btn finash"
            @click="submit"
          >
            已预订
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { authGetPhone, authGetPhoneByCode, reserveHost, getReserveInfo } from '@/api/hlr-api'
import { getLocalHlrData } from '@/utils/hlr'
import { showToast } from '@/utils/tools'

const compareVersion = (v1, v2:string) => {
  v1 = v1.split('.')
  v2 = v2.split('.')
  const len = Math.max(v1.length, v2.length)

  while (v1.length < len) {
    v1.push('0')
  }
  while (v2.length < len) {
    v2.push('0')
  }

  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1[i])
    const num2 = parseInt(v2[i])

    if (num1 > num2) {
      return 1
    } if (num1 < num2) {
      return -1
    }
  }

  return 0
}

const emit = defineEmits(['update'])

const props = defineProps({
  visible: {
    type: Boolean,
    default: true,
  },
  bottom: {
    type: Number,
    default: 0,
  },
  splid: {
    type: String,
    default: '',
  },
})

const hasReserve = ref(false)
const reserveTime = ref('')
const reserveTimeReal = ref('')
const remark = ref('')
const time = ref('')
const timeLable = ref('')
const name = ref('')
const phone = ref('')
const date = ref('')
const currentTimeIndex = ref('')
const timeList = ref([
  {
    id: '1',
    name: '午宴',
  },
  {
    id: '2',
    name: '晚宴',
  },
])

const initData = () => {
  getReserveInfo(props.splid)
    .then((res) => {
      console.log(res)
      if (!res.data) {
        return
      }
      if (res.data.size === 0) {
        hasReserve.value = false
      } else {
        hasReserve.value = true
        const reserveInfo = res.data.list[0]
        date.value = reserveInfo.date
        reserveTime.value = reserveInfo.time_interval === '1' ? '午宴' : '晚宴'
        reserveTimeReal.value = reserveInfo.time_interval
        name.value = reserveInfo.customer_name
        phone.value = reserveInfo.customer_phone
        remark.value = reserveInfo.remark
      }
    })
    .catch((err) => {
      console.log(err)
    })
}

const cancel = () => {
  emit('update', { boxVisible: false })
}

const fetchReserveHost = () => {
  uni.showLoading({
    title: '预定中...',
    icon: 'none',
  })
  const params = {
    splid: props.splid,
    date: date.value,
    time_interval: reserveTimeReal.value,
    customer_name: name.value,
    customer_phone: phone.value,
    remark: remark.value,
    kind: '2',
    type: '2',
  }
  const cachedHlrData = getLocalHlrData()
  if (cachedHlrData.hlrAvatar) {
    params.headimg = cachedHlrData.hlrAvatar
  }
  reserveHost(params).then((res) => {
    uni.hideLoading()
    emit('update', { boxVisible: false })
    hasReserve.value = true
    setTimeout(() => {
      showToast('预定成功')
    }, 800)
    console.log(res)
  })
    .catch((err) => {
      console.log(err)
      uni.hideLoading()
    })
}
const submit = () => {
  if (hasReserve.value) {
    showToast('已经预订过了')
    return
  }
  if (!name.value) {
    showToast('请输入您的姓名')
    return
  }
  if (!phone.value) {
    showToast('请选择您的联系方式')
    return
  }
  if (!date.value) {
    showToast('请选择预定日期')
    return
  }
  if (!reserveTimeReal.value) {
    showToast('请选择预定时段')
    return
  }
  if (!remark.value) {
    showToast('请输入备注')
    return
  }

  fetchReserveHost()
}

const bindDateChange = (e) => {
  date.value = e.detail.value
}

const bindTimeChange = (e) => {
  reserveTime.value = timeList.value[e.detail.value].name
  reserveTimeReal.value = timeList.value[e.detail.value].id
}
const getPhoneNumberByCode = (e) => {
  console.log(e)
  console.log(e.detail.code)
  if (e.detail.code) {
    authGetPhoneByCode(e.detail.code)
      .then((res) => {
        console.log(res)
        if (res && res.phone_info && res.phone_info.phoneNumber) {
          phone.value = res.phone_info.phoneNumber
        } else {
          showToast('获取手机号失败!请删除小程序重新进入!')
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }
}

const getPhoneNumberByIv = (e) => {
  if (e.detail.encryptedData) {
    authGetPhone(e.detail.encryptedData, e.detail.iv)
      .then((res) => {
        console.log(res)
        if (res && res.phoneNumber) {
          phone.value = res.phoneNumber
        } else {
          showToast('获取手机号失败!请删除小程序重新进入!')
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }
}
const getPhoneNumber = (e) => {
  const { SDKVersion } = uni.getSystemInfoSync()
  console.log(SDKVersion)
  const canUse = compareVersion(SDKVersion, '2.21.2')
  if (canUse > -1) {
    getPhoneNumberByCode(e)
  } else {
    getPhoneNumberByIv(e)
  }
}

onMounted(() => {
  const cachedHlrData = getLocalHlrData()
  name.value = cachedHlrData.hlrName
  const { SDKVersion } = uni.getSystemInfoSync()
  console.log(SDKVersion)
  const canUse = compareVersion(SDKVersion, '2.21.2')
  console.log(canUse)
  if (canUse > -1) {
    return
  }

  uni.checkSession({
    success() {
      console.log('不需要重新登录')
    },
    fail() {
      // session_key 已经失效，需要重新执行登录流程
      uni.login({
        success: () => {
          console.log('登录成功')
        },
      }) // 重新登录
      console.log('重新登录')
    },
  })
})

function onPageShow() {
  initData()
}

</script>

<style scoped>
.reverse-box-placeholder {
  width: 750rpx;
  height: 76rpx;
  box-sizing: content-box;
}
.reserve-box-wrap {
  position: fixed;
  width: 750rpx;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  bottom: 0rpx;
  left: 0;
  z-index: 10;
}
.reserve-box-wrap .reserve-box {
  width: 750rpx;
  min-height: 814rpx;
  bottom: 0rpx;
  position: fixed;
  padding-top: 62rpx;
  background: #fff;
  box-shadow: 0rpx -4rpx 8rpx 0rpx rgba(0, 0, 0, 0.1);
  border-radius: 0rpx;
  border-top-left-radius: 30rpx;
  border-top-right-radius: 30rpx;
  font-size: 32rpx;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}
.reserve-box-wrap .reserve-box .input-wrap {
  width: 686rpx;
  height: 108rpx;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-bottom: 2rpx solid #f0f0f0;
}
.reserve-box-wrap .reserve-box .input-wrap.text-area-wrap {
  height: 208rpx;
  align-items: center;
}
.reserve-box-wrap .reserve-box .input-wrap.text-area-wrap .name-wrap {
  width: 180rpx;
  height: 108rpx;
  font-size: 32rpx;
  color: #333333;
}
.reserve-box-wrap .reserve-box .input-wrap .name-wrap {
  width: 180rpx;
  font-size: 32rpx;
  color: #333333;
}
.reserve-box-wrap .reserve-box .input-wrap .content-wrap {
  flex-grow: 1;
  box-sizing: border-box;
}
.reserve-box-wrap .reserve-box .input-wrap .content-wrap .input {
  color: rgba(0, 0, 0, 0.25);
  width: 100%;
  height: 108rpx;
  border: 0;
}
.reserve-box-wrap .reserve-box .input-wrap .picker-wrap {
  flex-grow: 1;
  height: 108rpx;
  box-sizing: border-box;
}
.reserve-box-wrap .reserve-box .input-wrap .picker-wrap .picker-content {
  color: rgba(0, 0, 0);
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 28rpx;
  color: #333333;
  padding-left: 10rpx;
  height: 108rpx;
  flex-grow: 1;
}
.reserve-box-wrap .reserve-box .btn-group {
  width: 750rpx;
  height: 128rpx;
  background: #ffffff;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.reserve-box-wrap .reserve-box .btn-group .sure-btn,
.reserve-box-wrap .reserve-box .btn-group .cancel-btn {
  width: 330rpx;
  height: 76rpx;
  border-radius: 8rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 28rpx;
}
.reserve-box-wrap .reserve-box .btn-group .sure-btn {
  background: #000;
  color: #fff;
}
.reserve-box-wrap .reserve-box .btn-group .sure-btn.finash {
  background: #DCDCDC;
}
.reserve-box-wrap .reserve-box .btn-group .cancel-btn {
  background: transparent;
  color: rgba(0, 0, 0, 0.4);
}
.hm-btn {
  background-color: transparent;
  border: none;
  margin: 0;
  padding: 0;
  color: rgba(0, 0, 0);
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 28rpx;
  color: #333333;
  padding-left: 10rpx;
}
.hm-btn::after {
  border: none;
}

</style>
