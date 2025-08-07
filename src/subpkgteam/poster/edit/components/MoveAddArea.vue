<template>
  <div class="container">
    <movable-area class="move-area" :style="{ height: `${containerHeight}px` }">
      <movable-view
        v-for="item in squareList"
        :key="item.index"
        :x="item.x"
        :y="item.y"
        :style="{ width: item.width + 'px', height: item.height + 'px' }"
        direction="all"
        class="move-view"
        @touchstart="onTouchStart(item.index)"
        @touchend="onTouchEnd"
        @change="onChange"
      >
        <div class="inner-box">
          <image
            :src="item.value.src"
            class="poster-image"
            mode="scaleToFill"
            v-if="item.value.mediaType === 'image'"
          />
          <video
            :src="item.value.src"
            class="poster-image"
            v-if="item.value.mediaType === 'video'"
          ></video>
          <div class="top-operate">
            <uni-icons type="more" size="18" color="#9E9E9E"></uni-icons>
            <uni-icons
              type="closeempty"
              size="18"
              color="#9E9E9E"
              @click="deletePoster(item.index)"
            ></uni-icons>
          </div>
        </div>
      </movable-view>
      <div
        class="add-btn"
        :style="{
          width: `${addSquareItem.width}px`,
          height: `${addSquareItem.height}px`,
          top: `${addSquareItem.y}px`,
          left: `${addSquareItem.x}px`,
        }"
        @click="addPoster"
      >
        <uni-icons type="plusempty" size="35" color="#9E9E9E"></uni-icons>
      </div>
    </movable-area>
  </div>
</template>

<script lang="ts" setup>
export type TPoster = {
  index: number;
  value: TMeida;
};
type TMeida = {
  src: string;
  mediaType: "image" | "video";
};
type TSquareItem = {
  index: number;
  x: number;
  y: number;
  width: number;
  height: number;
  value: TMeida;
};

type Props = {
  direction: "vertical" | "horizontal";
  windowWidth: number;
  posterList: Array<TPoster>;
};
const props = withDefaults(defineProps<Props>(), {
  direction: "vertical",
  windowWidth: 0,
  posterList: () => [],
});

const emit = defineEmits<{
  (e: "orderChange", newPosterList: Array<TPoster>): void;
  (e: "posterAdd"): void;
  (e: "posterDelete", index: number): void;
}>();

const addSquareItem = reactive({
  x: 0,
  y: 0,
  width: 0,
  height: 0,
});
const setAddSquareItem = (
  width: number,
  height: number,
  length: number,
  direction: "vertical" | "horizontal"
) => {
  addSquareItem.width = width;
  addSquareItem.height = height;
  addSquareItem.x = getX(direction, length, width);
  addSquareItem.y = getY(direction, length, height);
};

const getX = (
  direction: "vertical" | "horizontal",
  index: number,
  width: number
) => {
  if (direction === "vertical") {
    return (index % 3) * (width + 10);
  } else {
    return (index % 2) * (width + 10);
  }
};
const getY = (
  direction: "vertical" | "horizontal",
  index: number,
  height: number
) => {
  if (direction === "vertical") {
    return Math.floor(index / 3) * (height + 20);
  } else {
    return Math.floor(index / 2) * (height + 20);
  }
};
const getWidth = (direction: "vertical" | "horizontal") => {
  if (direction === "vertical") {
    return props.windowWidth * 0.29;
  } else {
    return props.windowWidth * 0.45;
  }
};
const getHeight = (direction: "vertical" | "horizontal", width: number) => {
  if (direction === "vertical") {
    return width * 1.79;
  } else {
    return width * 0.56;
  }
};
const setContainerHeight = (
  direction: "vertical" | "horizontal",
  length: number,
  height: number
) => {
  if (direction === "vertical") {
    // 1.算出有几行
    const lineCount = Math.ceil((length + 1) / 3);
    // 2.函数乘以(行高+间距)
    containerHeight.value = lineCount * (height + 20);
  } else {
    // 1.算出有几行
    const lineCount = Math.ceil((length + 1) / 2);
    // 2.函数乘以(行高+间距)
    containerHeight.value = lineCount * (height + 20);
  }
};
const containerHeight = ref(0);

const squareList = ref<TSquareItem[]>([]);
watch(
  () => {
    return {
      direction: props.direction,
      posterList: props.posterList,
    };
  },
  (newVal) => {
    const width = getWidth(newVal.direction);
    const height = getHeight(newVal.direction, width);
    squareList.value = newVal.posterList.map((item, index) => {
      return {
        index,
        x: getX(newVal.direction, index, width),
        y: getY(newVal.direction, index, height),
        width,
        height,
        value: item.value,
      };
    });
    setAddSquareItem(width, height, newVal.posterList.length, newVal.direction);
    setContainerHeight(newVal.direction, newVal.posterList.length, height);
    console.log("squareList", squareList.value);
  },
  {
    immediate: true,
  }
);
const currentMoveInfo = reactive({
  squareIndex: -1, // 移动的是哪个方块
  startX: 0, // 开始移动的x坐标
  startY: 0, // 开始移动的y坐标
  moveX: 0, // 移动的x坐标
  moveY: 0, // 移动的y坐标
});
/**
 * 判断当前移动信息在哪个方块范围内，并返回交换的方块索引
 */
const checkRange = (squareItem: TSquareItem, moveX: number, moveY: number) => {
  const { x, y, width, height } = squareItem;
  if (
    moveX >= x - 0.5 * width &&
    moveX <= x + width &&
    moveY >= y - height &&
    moveY <= y + height
  ) {
    return true;
  }
  return false;
};
const checkExchangeIndex = () => {
  const targetIndexes: number[] = [];
  squareList.value.forEach((squareItem, index) => {
    if (checkRange(squareItem, currentMoveInfo.moveX, currentMoveInfo.moveY)) {
      targetIndexes.push(index);
    }
  });
  if (targetIndexes.length > 0) {
    return targetIndexes[0];
  } else {
    return -1;
  }
};
const onTouchStart = (index: number) => {
  // 记录移动方块的信息
  currentMoveInfo.squareIndex = index;
  currentMoveInfo.startX = squareList.value[index].x;
  currentMoveInfo.startY = squareList.value[index].y;
};
const onChange = (e: any) => {
  currentMoveInfo.moveX = e.detail.x;
  currentMoveInfo.moveY = e.detail.y;
};
const onTouchEnd = () => {
  // 1. 计算交换的方块索引
  const toExchangeIndex = checkExchangeIndex();
  console.log("toExchangeIndex", toExchangeIndex);
  if (toExchangeIndex > -1) {
    // 2. 交换方块的value内容
    const tempValue = squareList.value[currentMoveInfo.squareIndex].value;
    squareList.value[currentMoveInfo.squareIndex].value =
      squareList.value[toExchangeIndex].value;
    squareList.value[toExchangeIndex].value = tempValue;
  }
  // 3. 还原方块的位置
  squareList.value[currentMoveInfo.squareIndex].x = currentMoveInfo.moveX;
  squareList.value[currentMoveInfo.squareIndex].y = currentMoveInfo.moveY;
  setTimeout(() => {
    if (squareList.value[currentMoveInfo.squareIndex]) {
      squareList.value[currentMoveInfo.squareIndex].x = currentMoveInfo.startX;
      squareList.value[currentMoveInfo.squareIndex].y = currentMoveInfo.startY;
      emit(
        "orderChange",
        squareList.value.map((item) => ({
          index: item.index,
          value: item.value,
        }))
      );
    }
  }, 50);
};

const addPoster = () => {
  emit("posterAdd");
};
const deletePoster = (index: number) => {
  emit("posterDelete", index);
};
</script>

<style scoped lang="scss">
.container {
  .move-area {
    width: 100%;
    height: 100vh;
    position: relative;
    .poster-image {
      width: 100%;
      height: 100%;
    }
    .add-btn {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #f2f4f7;
      position: absolute;
    }
    .move-view {
      .inner-box {
        width: 100%;
        height: 100%;
        position: relative;
        .top-operate {
          height: 30rpx;
          width: 100%;
          position: absolute;
          top: 0;
          left: 0;
          display: flex;
          justify-content: space-between;
          padding: 0 13rpx;
        }
      }
    }
  }
}
</style>
