<!-- 环型进度条 -->
<template>
  <canvas
    id="canvas"
    canvas-id="canvas"
    :style="{ width: `${width}`, height: `${height}` }"
  />
</template>

<script setup lang="ts">
import { createSelectorQuery } from '@uni-helper/uni-promises';

const ctx = getCurrentInstance();
type Props = {
/** 总宽度 */
  width: string;
  /** 总高度 */
  height: string;
  /** 进度条颜色 */
  color: string;
  /** 进度条宽度 */
  lineWidth: number;
  // 进度条百分比
  percent: number;
};

const props = withDefaults(defineProps<Props>(), {
  width: '100px',
  height: '100px',
  color: '#000000',
  lineWidth: 10,
  percent: 0,
});

/** canvas上下文 */
let canvasCtx:UniApp.CanvasContext;

/** canvas位置大小信息 */
let canvasRect: UniApp.NodeInfo;

/**
 * 获取并设置canvas位置大小信息
 * 请在canvas显示后主动调用
 */
const getCanvasRect = async () => {
  const selectorQuery = createSelectorQuery().in(ctx);
  canvasRect = await new Promise((resolve) => {
    selectorQuery
      .select('#canvas')
      .boundingClientRect((rect) => {
        resolve(rect as UniApp.NodeInfo);
      })
      .exec();
  });
};

/**
 * 绘制进度条
 * @param {number} percent 进度条百分比
 */
const draw = async (percent: number) => {
  if (!canvasCtx || percent === 0) return;

  // 如果还没有获取到canvas位置大小信息，则主动获取
  if (!canvasRect) {
    await getCanvasRect();
  }

  const { color, lineWidth } = props;
  // 获取canvas长宽

  const x = (canvasRect?.width || 0) / 2;
  const y = (canvasRect?.height || 0) / 2;
  const radius = Math.min(x, y) - (lineWidth / 2);
  const startAngle = -Math.PI / 2;
  const endAngle = (percent * 2 * Math.PI) / 100 + startAngle;
  canvasCtx.setLineWidth(lineWidth);
  canvasCtx.setStrokeStyle(color);
  canvasCtx.setLineCap('round');
  canvasCtx.beginPath();
  canvasCtx.arc(x, y, radius, startAngle, endAngle, false);
  canvasCtx.stroke();

  canvasCtx.draw();
};

onReady(() => {
  canvasCtx = uni.createCanvasContext('canvas', ctx);
  draw(props.percent);
});

watch(() => props.percent, (percent) => {
  draw(percent);
});

defineExpose({ getCanvasRect });

</script>
