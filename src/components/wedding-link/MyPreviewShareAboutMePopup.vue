<!-- 「关于我」弹窗 -->
<template>
  <uni-popup
    ref="popup"
    type="center"
  >
    <div class="container">
      <!-- 标题 -->
      <div class="title">
        关于我
      </div>
      <!-- 年龄 -->
      <div class="age">
        <image
          class="icon"
          mode="aspectFit"
          src="@/static/icons/my/sapling.svg"
        />
        <text class="text">
          {{ age }}岁
        </text>
      </div>
      <!-- 身高 -->
      <div class="height">
        <image
          class="icon"
          mode="aspectFit"
          src="@/static/icons/my/rule.svg"
        />
        <text class="text">
          {{ height }}cm
        </text>
      </div>
      <!-- 体重 -->
      <div class="weight">
        <image
          class="icon"
          mode="aspectFit"
          src="@/static/icons/my/human.svg"
        />
        <text class="text">
          {{ weight }}kg
        </text>
      </div>
      <!-- 主持熟练度 -->
      <div class="proficiency">
        <image
          class="icon"
          mode="aspectFit"
          src="@/static/icons/my/medal.svg"
        />
        <text class="text">
          {{ PROFICIENCY_LIST[proficiency] }}
        </text>
      </div>
      <!-- 关闭按钮 -->
      <div class="close-area">
        <image
          class="close-icon"
          mode="aspectFit"
          src="@/static/icons/common/cancel-circle-gray.svg"
          @click="onClickClose"
        />
      </div>
    </div>
  </uni-popup>
</template>

<script setup lang="ts">
import type { UniPopup } from '@uni-helper/uni-ui-types';
import { PROFICIENCY_LIST } from '@/static/constants/view-constants';

const ctx = getCurrentInstance();

type Props = {
  /** 年龄 */
  age: string
  /** 身高 */
  height: string
  /** 体重 */
  weight: string
  /** 主持熟练度 */
  proficiency: number
}

const props = defineProps<Props>();

/** 打开弹窗 */
const open = () => {
  const popup = ctx?.refs.popup as UniPopup;
  popup.open();
};

/** 关闭弹窗 */
const close = () => {
  const popup = ctx?.refs.popup as UniPopup;
  popup.close();
};

/** 点击「关闭」按钮 */
const onClickClose = () => {
  close();
};

defineExpose({
  open,
  close,
});
</script>

<style scoped lang="scss">
.container{
  width: 74.359vw;
  height: 82.5641vw;

  background: #666;
  border-radius: 4px;

  display: grid;
  grid-template:
    'title title' 13.5897vw
    'age height' 26.9231vw
    'weight proficiency' 26.9231vw
    'close-area close-area' 1fr
    /1fr 1fr;
  gap: 1px;

  // 标题
  .title{
    grid-area: title;

    width: 100%;
    height: 100%;

    background-color: #333;

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 15px;
    color: #fff;
  }

  // 年龄
  .age{
    grid-area: age;
  }

  // 身高
  .height{
    grid-area: height;
  }

  // 体重
  .weight{
    grid-area: weight;
  }

  // 主持熟练度
  .proficiency{
    grid-area: proficiency;
  }

  .age,
  .height,
  .weight,
  .proficiency{
    width: 100%;
    height: 100%;

    background-color: #333;

    display: flex;
    flex-direction: column;
    row-gap: 5px;
    align-items: center;
    justify-content: center;

    .icon{
      width: 20px;
      height: 20px;
    }

    .text{
      font-size: 11px;
      color: #fff;
    }
  }

  // 关闭按钮
  .close-area{
    grid-area: close-area;

    width: 100%;
    height: 100%;

    background-color: #333;

    display: flex;
    align-items: center;
    justify-content: center;

    .close-icon{
      width: 20px;
      height: 20px;
    }
  }
}
</style>
