<template>
  <div
    v-if="visible"
    class="placeDiv"
  />
  <div
    class="reserve-btn-wrap"
    :style="{ transform: 'translateY(-' + (bottom + 5) + 'px)' }"
  >
    <div
      v-if="visible"
      class="reserve-btn"
      :animation="animationData"
      @click="showReseveModal"
    >
      <div class="add" />
      预定
    </div>
  </div>

  <div
    v-if="isReserveSuccessBoxShow"
    class="reserveSuccess"
  >
    <div class="reserveSuccessBox">
      <image
        src="https://static.joymew.com/joymewMp/reserveDetail/successIconReserveDetail.png"
        class="successIconReserveDetail"
      />
      <div class="tip1">
        预定成功
      </div>
      <div class="tip2">
        请等待主持人与您联系
      </div>
      <div
        class="exitBtn"
        @click="exitReserve"
      >
        退出
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  bottom: {
    type: Number,
    default: 0,
  },
})

const isReserveSuccessBoxShow = ref(false)

const emit = defineEmits(['update'])
const animationData = ref(null)
const animation = uni.createAnimation({
  duration: 300,
  timingFunction: 'ease-in-out',
})

const showReseveModal = () => {
  console.log('showReseveModal')
  animation.opacity(0.1).translateY('150%').step()
  animationData.value = animation.export()
  setTimeout(() => {
    emit('update', { boxVisible: true })
    animation.opacity('').translateY('').step()
    animationData.value = animation.export()
  }, 300)
}

</script>

<style scoped>
.placeDiv {
  width: 750rpx;
  height: 76rpx;
  box-sizing: content-box;
}
.reserve-btn-wrap {
  position: fixed;
  width: 750rpx;
  bottom: 20rpx;
  left: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}
.reserve-btn-wrap .reserve-btn {
  width: 606rpx;
  height: 76rpx;
  background: #000;
  border-radius: 12rpx;
  font-size: 32rpx;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}
.reserve-btn-wrap .reserve-btn .add {
  width: 24rpx;
  height: 24rpx;
  margin-right: 16rpx;
  background-size: 100% 100%;
  background-image: url(https://ustatic.hudongmiao.com/joymew-mp/review/reserve-add.png);
}
</style>
