<!-- 录音弹窗组件 -->
<template>
  <uni-popup
    ref="popup"
    type="bottom"
    :safe-area="false"
    @mask-click="initStatus"
  >
    <div class="container">
      <!-- 秒数 -->
      <text
        v-show="!Number.isNaN(currentTime)"
        class="second"
      >
        {{ currentTime }}s
      </text>
      <!-- 删除按钮 -->
      <div
        v-if="status === 'recorded'||status==='paused'||status==='playing'"
        class="delete-btn"
        @click="initStatus"
      >
        <image
          src="@/static/icons/my/trash.svg"
          mode="scaleToFill"
          class="icon"
        />
      </div>
      <!-- 中心按钮 -->
      <div
        class="center-btn"
        @click="onCenterBtnClick"
      >
        <!-- 中心的圆形 -->
        <div
          class="inner"
          :class="status"
        />
        <!-- 环型进度条 -->
        <CircleProgress
          v-show="targetProgress"
          class="circle-progress"
          :percent="targetProgress"
          :line-width="4"
          width="25vw"
          height="25vw"
          color="#f9d898"
        />
        <!-- 麦克风图标 -->
        <image
          v-show="status === 'not-record'"
          src="@/static/icons/my/microphone.svg"
          mode="scaleToFill"
          class="record-btn-icon"
        />
        <!-- 声波图标 -->
        <image
          v-show="status === 'recorded'||status==='paused'||status==='playing'"
          src="@/static/icons/my/wave.svg"
          mode="scaleToFill"
          class="icon"
          @click="onPlayBtnClick"
        />
      </div>
      <!-- 确定按钮 -->
      <div
        v-if="status === 'recorded'||status==='paused'||status==='playing'"
        class="confirm-btn"
        @click="onConfirmBtnClick"
      >
        <image
          src="@/static/icons/my/check.svg"
          mode="scaleToFill"
          class="icon"
        />
      </div>
      <!-- 播放提示 -->
      <text class="tip">
        {{ tipText }}
      </text>
    </div>
  </uni-popup>
</template>

<script setup lang="ts">
import CircleProgress from '@/components/CircleProgress.vue';
import type { UniPopupInstance } from '@uni-helper/uni-ui-types';

const ctx = getCurrentInstance();

type Emits = {
  (e: 'confirm', audioTemPath:string): void
}

const emit = defineEmits<Emits>();

/** 当前状态 */
const status = ref<'not-record' | 'recording' | 'recorded' | 'playing'| 'paused'>('not-record');

// #region 秒数显示相关

/** 录音秒数 */
const recordTime = ref(0);

/** 录音定时器 */
let recordTimer:number;

/** 真实录音文件时长 */
let realRecordTime:number;

/** 启动录音时间定时器 */
const startRecordTimeTimer = () => {
  recordTimer = setInterval(() => {
    recordTime.value += 0.01;
    // 如果recordTime达到真实录音时长，则结束定时器
    if (recordTime.value >= realRecordTime) {
      clearInterval(recordTimer);
    }
  }, 10);
};

/** 播放秒数 */
const playTime = ref(0);

/** 音频上下文 */
const innerAudioContext = uni.createInnerAudioContext();

/** 播放计时器 */
let playTimer:number;

/** 启动播放定时器 */
const startPlayTimer = () => {
  playTimer = setInterval(() => {
    // 更新播放时间
    playTime.value += 0.01;
    if (playTime.value >= innerAudioContext.duration) {
      clearInterval(playTimer);
    }
  }, 10);
};

// #endregion

// #region 各种变量

/** 目标进度 */
const targetProgress = computed(() => {
  // 录音时
  if (status.value === 'recording') {
    return (recordTime.value / 60) * 100;
  }

  // 播放时
  if (status.value === 'playing' || status.value === 'paused') {
    return (playTime.value / innerAudioContext.duration) * 100;
  }

  return 0;
});

// #endregion

// #region 录音相关

/** 录音时间上限 */
const RECORD_LIMIT = 60;

/** 录音文件地址 */
const recordSrc = ref('');

/** 录音管理器 */
const recorderManager = uni.getRecorderManager();

/** 初始化状态 */
const initStatus = () => {
  console.log('初始化状态');
  status.value = 'not-record';
  recordTime.value = 0;
  clearInterval(recordTimer);
  realRecordTime = NaN;

  playTime.value = 0;
  clearInterval(playTimer);

  recordSrc.value = '';
  recorderManager.stop();
  innerAudioContext.stop();
  innerAudioContext.src = '';
};

/** 打开弹窗 */
const open = () => {
  initStatus();
  const popup = ctx?.refs?.popup as unknown as UniPopupInstance;
  if (popup.open) {
    popup.open();
  }
};

/** 关闭弹窗 */
const close = () => {
  const popup = ctx?.refs?.popup as unknown as UniPopupInstance;
  if (popup.close) {
    popup.close();
    initStatus();
  }
};
// #endregion

// #region 录音相关

// 页面加载时初始化录音管理器
onLoad(() => {
  console.log('onLoad record');
  // 录音开始事件
  recorderManager.onStart(() => {
    console.log('录音开始');
    status.value = 'recording';
    recordTime.value = 0;
    startRecordTimeTimer();
  });
  // 录音结束事件
  recorderManager.onStop((res) => {
    status.value = 'recorded';
    clearInterval(recordTimer);
    recordSrc.value = res.tempFilePath;
    realRecordTime = res.duration / 1000;
    console.log('录音结束', res);
  });
});

/** 中心按钮点击事件 */
const onCenterBtnClick = () => {
  // 如果当前状态是未录音，则开始录音
  if (status.value === 'not-record') {
    uni.vibrateShort(); // 震动
    recorderManager.start({
      duration: 60000,
      format: 'mp3',
    });
    return;
  }

  // 如果当前状态是录音中，则停止录音
  if (status.value === 'recording') {
    recorderManager.stop();
  }
};

/** 确定按钮点击事件 */
const onConfirmBtnClick = () => {
  // 如果当前是播放中，则停止播放
  if (status.value === 'playing') {
    innerAudioContext.stop();
  }
  emit('confirm', recordSrc.value);
  close();
  initStatus();
};

// #endregion

// #region 播放相关

/** 播放停止事件 */
const onStop = () => {
  console.log('播放停止');
  innerAudioContext.seek(0);
  status.value = 'recorded';
  clearInterval(playTimer);
  playTime.value = 0;
};

// 页面加载时挂载音频事件
onLoad(() => {
  // 播放开始事件
  innerAudioContext.onPlay(() => {
    console.log('播放开始', innerAudioContext.duration);
    status.value = 'playing';
    startPlayTimer();
  });

  // 播放停止事件
  innerAudioContext.onStop(onStop);

  // 播放结束事件
  innerAudioContext.onEnded(onStop);
});

/** 播放按钮点击事件 */
const onPlayBtnClick = () => {
  console.log('innerAudioContext', innerAudioContext);
  console.log('status', status.value);
  // 如果正在播放，则结束播放
  // if (innerAudioContext.paused === false) {
  //   innerAudioContext.stop();
  //   return;
  // }
  if (status.value === 'playing') {
    innerAudioContext.stop();
    return;
  }
  // 如果尚未播放，则进行播放
  innerAudioContext.src = recordSrc.value;
  // 重置播放进度
  innerAudioContext.seek(0);
  setTimeout(() => {
    innerAudioContext.play();
  }, 100);
};

// #endregion

// #region 界面显示元素相关

/** 提示文本 */
const tipText = computed(() => {
  if (status.value === 'not-record') {
    return '点击录音';
  }
  if (status.value === 'recording') {
    return '点击结束';
  }

  return '点击播放';
});

/** 当前显示的秒数 */
const currentTime = computed(() => {
  switch (status.value) {
    case 'not-record':
      return 0;
    case 'recording':
      if (recordTime.value >= RECORD_LIMIT - 0.3) {
        return RECORD_LIMIT;
      }
      return Math.floor(recordTime.value);
    case 'recorded':
      return Math.floor(realRecordTime);
    case 'playing':
    case 'paused':
      if (playTime.value >= RECORD_LIMIT - 0.3) {
        return RECORD_LIMIT;
      }
      return Math.floor(playTime.value);
    default:
      return 0;
  }
});

// #endregion
defineExpose({
  open,
  close,
});

</script>

<style scoped lang="scss">
.container{
  width: 100%;
  height: 60.7692vw;

  background-color: #fff;
  border-radius: 20px 20px 0 0;

  padding: 28px 0 24px;
  box-sizing: content-box;
  display: grid;
  grid-template:
    '. top .' 7.6923vw
    'delete-btn middle confirm-btn' 1fr
    '. bottom .' 28px
    / 1fr 26vw 1fr;
  row-gap: 10px;
  column-gap: 30px;
  align-items: center;
  justify-items: center;

  // 秒数
  .second{
    grid-area: top;

    font-size: 24px;
    font-weight: bold;
    color: #000;
  }

  // 删除按钮
  .delete-btn{
    grid-area: delete-btn;
    justify-self: end;

    width: 13.8462vw;
    height: 10.2564vw;

    background: #ededed;
    border-radius: 7.6923vw;

    display: flex;
    align-items: center;
    justify-content: center;

    .icon{
      width: 6.1538vw;
      height: 6.1538vw;
    }
  }

  // 播放按钮
  .center-btn{
    grid-area: middle;

    position: relative;

    width: 26vw;
    height: 26vw;

    border: 6px solid rgb(248 213 143 / 30%);
    border-radius: 50%;
    box-shadow: 2px 8px 13px 0 rgb(248 213 143 / 25%);

    display: grid;
    place-items: center;

    // 内圈背景
    .inner{
      width: 20vw;
      height: 20vw;

      background: #f8d58f;
      border-radius: 50%;

      transition: scale 0.3s ease-in-out;

      // 录音中状态
      &.recording{
        // 缩小小圆点
        scale: 0.3;
      }
    }

    // 环型进度条
    .circle-progress{
      position: absolute;
      top: 50%;
      left: 50%;

      transform: translate(-50%, -50%);
    }

    // 录音按钮图标
    .record-btn-icon{
      position: absolute;
      top: 50%;
      left: 50%;
      z-index: 100;

      width: 11.2821vw;
      height: 11.5385vw;

      transform: translate(-50%, -50%);
    }

    .icon{
      position: absolute;
      top: 50%;
      left: 50%;

      width: 6.1538vw;
      height: 6.1538vw;

      transform: translate(-50%, -50%);
    }
  }

  // 确认按钮
  .confirm-btn{
    grid-area: confirm-btn;
    justify-self: start;

    width: 13.8462vw;
    height: 10.2564vw;

    background: #F8D58F;
    border-radius: 7.6923vw;

    display: flex;
    align-items: center;
    justify-content: center;

    .icon{
      width: 6.1538vw;
      height: 6.1538vw;
    }
  }

  // 播放提示
  .tip{
    grid-area: bottom;

    font-size: 4.6154vw;
    color: #333;
  }
}
</style>
