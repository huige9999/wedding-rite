<template>
  <div
    v-if="needAuthAvatarName"
    class="mask"
  >
    <div class="dialog">
      <button
        class="avatar-wrapper"
        open-type="chooseAvatar"
        @chooseavatar="onChooseAvatar"
      >
        <image
          class="avatar"
          :src="avatarPath"
        />
      </button>
      <input
        v-model="nickname"
        type="nickname"
        class="weui-input"
        placeholder="请输入昵称"
        @blur="onUserNameBlur"
      >
      <div class="btn-wrap">
        <div
          class="btn"
          @click="update"
        >
          立即授权
        </div>
      </div>
      <div
        class="close"
        @click="handleClose"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { setHlrData, getLocalHlrData } from '@/utils/hlr'
import { updateHlUserInfo, wxGetUserProfile } from '@/api/hlr-api'
import { showToast } from '@/utils/tools'
import { reqUploadSchedulePosterBg } from '@/api/schedule-api'

interface WxUserProfileResult {
  encryptedData: string
  iv: string
}

let requestLock = false
const emit = defineEmits(['updated'])
const show = ref(false)
const avatarPath = ref('')
const nickname = ref('')
const onChooseAvatar = (e) => {
  console.log('onChooseAvatar', e.detail.avatarUrl)
  const { avatarUrl } = e.detail
  avatarPath.value = avatarUrl
}

const props = defineProps({
  needAuthAvatarName: {
    type: Boolean,
    default: false,
  },
})
const judgeShow = () => {
  const cachedHlrData = getLocalHlrData()
  if (!cachedHlrData) {
    return
  }
  const storageAvator = cachedHlrData.hlrAvatar
  const storageName = cachedHlrData.hlrName
  const HLRUSERID = '278da07144af46e599b5546b2b75535e'
  const storageUserId = cachedHlrData.hlrUserId
  if (!storageUserId) {
    return
  }
  if (storageUserId === HLRUSERID) {
    return
  }
  if (storageAvator && storageName) {
    return
  }
  show.value = true
}

const handleClose = () => {
  show.value = false
  emit('updated')
}
const onUserNameBlur = (e) => {
  console.log(e)
  nickname.value = e.target.value
}
const update = async () => {
  console.log(avatarPath.value, nickname.value)
  if (!avatarPath.value) {
    showToast('头像不能为空!')
    return
  }
  if (!nickname.value) {
    showToast('昵称不能为空!')
    return
  }
  if (requestLock) {
    return
  }
  requestLock = true
  uni.showLoading()
  const { encryptedData, iv } = await wxGetUserProfile() as WxUserProfileResult
  const uploadRes = await reqUploadSchedulePosterBg(avatarPath.value)
  const tmpImg = JSON.parse(uploadRes.data).data.filePath as string
  avatarPath.value = tmpImg
  const userInfo = {
    avatarUrl: avatarPath.value,
    nickName: nickname.value,
  }
  console.log(encryptedData, iv, userInfo)

  setHlrData({
    hlrAvatar: userInfo.avatarUrl,
    hlrName: userInfo.nickName,
  })

  updateHlUserInfo(encryptedData, iv, JSON.stringify(userInfo))
    .then((res) => {
      console.log(res)
      show.value = false
      requestLock = false
      emit('updated')
      uni.hideLoading()
    })
    .catch(() => {
      uni.hideLoading()
      requestLock = false
    })
}
onMounted(() => {
  // judgeShow()
})
</script>

<style scoped>
.hm-page {
  box-sizing: border-box;
}

.mask {
  position: fixed;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  top: 0;
  left: 0;
  z-index: 9999;
}

.mask .dialog {
  width: 552rpx;
  height: 548rpx;
  position: absolute;
  background-image: url('https://ustatic.joymew.com/joymewApp/mp/authBg.png');
  background-size: 100% 100%;
  box-sizing: border-box;
  top: 402rpx;
  left: 100rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.mask .dialog .logo {
  width: 174rpx;
  height: 176rpx;
}

.mask .dialog .close {
  width: 68rpx;
  height: 68rpx;
  background-image: url('https://ustatic.joymew.com/joymew-feedback-mp/comp/authDialog/authClose.png');
  background-size: 100% 100%;
  box-sizing: border-box;
  position: absolute;
  bottom: -112rpx;
  left: 50%;
  transform: translate(-50%, 0);
}

.mask .dialog .text-wrap {
  color: #000000;
  font-size: 32rpx;
  letter-spacing: 10rpx;
  font-weight: 600;
  margin-top: 12rpx;
}

.mask .dialog .btn-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 50rpx;
}

.mask .dialog .btn-wrap .btn {
  width: 360rpx;
  height: 90rpx;
  border-radius: 84rpx;
  align-items: center;
  display: flex;
  justify-content: center;
  color: #ffffff;
  font-size: 32rpx;
  background-color: #000000;
  border-radius: 20rpx;
}

.avatar-wrapper {
  display: flex;
}

.avatar {
  width: 174rpx;
  height: 176rpx;
}

.weui-input {
  margin-top: 40rpx;
  height: 60rpx;
  border: 2rpx solid #eaeaea;
}
</style>
