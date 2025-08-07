<template>
  <div class="infoPopupContent">
    <div
      class="shade"
      @click="closePopup"
    />
    <div class="infoBox">
      <div class="infoItem">
        <image
          src="https://ustatic.joymew.com/joymewApp/home/heightIcon.png"
          class="icon height"
        />
        <text>{{ pHeight }}cm</text>
      </div>
      <div class="infoItem">
        <image
          src="https://ustatic.joymew.com/joymewApp/home/weightIcon.png"
          class="icon weight"
        />
        <text>{{ pWeight }}kg</text>
      </div>
      <div class="infoItem">
        <image
          src="https://ustatic.joymew.com/joymewApp/home/ageIcon.png"
          class="icon year"
        />
        <text>{{ pYear }}岁</text>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  pHeight: {
    type: String,
    default: '',
  },
  pWeight: {
    type: String,
    default: '',
  },
  pYear: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['close']) // 定义close事件

const closePopup = () => {
  emit('close')
}
</script>

<style scoped>
.infoPopupContent {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.infoPopupContent .shade {
  background-color: rgba(0, 0, 0, 0.65);
  position: absolute;
  width: 100%;
  height: 100%;
}

.infoPopupContent .infoBox {
  width: 502rpx;
  height: 250rpx;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 16rpx;
  box-shadow: 0rpx 0rpx 216rpx 168rpx rgba(0, 0, 0, 0.25) inset;
  backdrop-filter: blur(16rpx);
  display: flex;
  align-items: center;
  justify-content: space-around;
  position: relative;
}

.infoBox .infoItem {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.infoBox .infoItem .icon {
  margin-bottom: 32rpx;
}

.infoBox .infoItem .icon.height {
  width: 32rpx;
  height: 36rpx;
}

.infoBox .infoItem .icon.weight {
  width: 44rpx;
  height: 36rpx;
}

.infoBox .infoItem .icon.year {
  width: 42rpx;
  height: 40rpx;
}

.infoBox .infoItem text {
  font-size: 24rpx;
  font-weight: 400;
  color: #ffffff;
}
</style>
