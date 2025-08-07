<!-- 带声波动画的声音播放按钮 -->
<template>
  <div
    class="container"
    @click="voicePlayBtnClick"
  >
    <image
      v-if="playStatus === 'stop' || playStatus === 'pause'"
      class="left-icon"
      src="@/static/icons/my/play-white.svg"
    />
    <image
      v-else
      class="left-icon"
      src="@/static/icons/my/pause.svg"
    />
    <div class="sound-wave">
      <div
        v-for="item in 5"
        :key="item"
        class="column"
        :class="playStatus!= 'stop'?'active':''"
        :style="{animationPlayState: playStatus === 'pause'?'paused':'running'}"
      />
    </div>
    <span
      v-if="voiceLength"
      class="second"
    >{{ Math.floor(voiceLength) }}S</span>
  </div>
</template>

<script setup lang="ts">

type Props = {
  /** 录音长度 */
  voiceLength: number;
  /** 音频地址 */
  voiceUrl: string;
  /** 组件缩放比例 */
  scale: number;
  /** 背景颜色 */
  bgColor: string;
}

const props = withDefaults(defineProps<Props>(), {
  voiceLength: 0,
  voiceUrl: '',
  scale: 1,
  bgColor: '#2c2b32',
});

/** 音频上下文 */
const innerAudioContext = uni.createInnerAudioContext();

// 监听音频地址变化，更新innerAudioContext.src
watch(() => props.voiceUrl, (newVal) => {
  innerAudioContext.src = newVal;
  console.log('innerAudioContext.src', innerAudioContext.src);
}, { immediate: true });

/** 播放状态 */
const playStatus = ref<'stop'| 'playing'|'pause'>('pause');

// 挂载时，初始化innerAudioContext
onMounted(() => {
  innerAudioContext.onPlay(() => {
    playStatus.value = 'playing';
  });
  innerAudioContext.onPause(() => {
    playStatus.value = 'pause';
  });
  innerAudioContext.onStop(() => {
    playStatus.value = 'stop';
  });
  innerAudioContext.onEnded(() => {
    playStatus.value = 'stop';
  });
});

/** 声音播放按钮点击事件 */
const voicePlayBtnClick = () => {
  console.log('voicePlayBtnClick', innerAudioContext);
  // 如果正在播放，就停止播放
  if (innerAudioContext.paused) {
    innerAudioContext.play();
  } else {
    innerAudioContext.pause();
  }
};

onHide(() => {
  console.log('onHide');
  innerAudioContext.stop();
});

onBeforeUnmount(() => {
  console.log('onBeforeUnmount');
  innerAudioContext.stop();
});

</script>

<style scoped lang="scss">
// 我的声音
.container {
  width: calc(30.5128vw * v-bind(scale));
  height: calc(8.2051vw * v-bind(scale));

  background: v-bind(bgColor);
  border-radius: calc(9.2308vw * v-bind(scale));

  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: 4px;
  place-items: center;

  .left-icon {
    justify-self: end;

    width: 7vw;
    height: 7vw;
  }

  .sound-wave {
    height: 100%;

    display: flex;
    column-gap: 4px;
    align-items: center;
    justify-content: space-between;

    .column {
      width: 2px;

      background-color: #fff;
      border-radius: 2px;

      &:nth-child(1),
      &:nth-child(5) {
        height: 20%;

        &.active {
          animation: sound-wave-animation-1 1s infinite linear;

          @keyframes sound-wave-animation-1 {
            0% {
              height: 20%;
            }

            50% {
              height: 80%;
            }

            100% {
              height: 20%;
            }
          }
        }
      }

      &:nth-child(3){
        height: 60%;

        &.active{
          animation: sound-wave-animation-2 1s infinite linear;

          @keyframes sound-wave-animation-2 {
            0% {
              height: 60%;
            }

            16.6%{
              height: 80%;
            }

            66%{
              height: 20%;
            }

            100% {
              height: 60%;
            }
          }
        }
      }

      &:nth-child(2),
      &:nth-child(4) {
        height: 40%;

        &.active {
          animation: sound-wave-animation-3 1s infinite linear;

          @keyframes sound-wave-animation-3 {
            0% {
              height: 40%;
            }

            33%{
              height: 80%;
            }

            83%{
              height: 20%;
            }

            100% {
              height: 40%;
            }
          }
        }
      }
    }
  }

  .second {
    justify-self: start;

    font-size: 3.0769vw;
    color: #fff;
  }
}
</style>
