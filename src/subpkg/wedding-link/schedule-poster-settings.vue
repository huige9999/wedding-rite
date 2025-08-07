<!--
  * 个人档期设置页面
  * @author: Ruan Jiazhen
  * @date: 2024-04-28  17:48:46
-->
<template>
  <div class="container">
    <uni-nav-bar
      class="nav-bar"
      left-icon="left"
      title="档期海报设置"
      status-bar
      :border="false"
      @click-left="back"
    />
    <!-- 主体部分 -->
    <div class="main">
      <!-- 设置文字 -->
      <div class="setting-item text">
        <span class="title">文字</span>
        <switch
          class="switch text-switch"
          color="#0cc164"
          :checked="isShowText"
          @change="textSwitchClick"
        />
        <!-- 分隔线 -->
        <div class="hr" />
        <!-- 文字内容 -->
        <textarea
          v-show="isShowText"
          v-model="textContent"
          class="text-content"
          maxlength="150"
          auto-height
          :disabled="!isEditableText"
          :focus="isFocusText"
        />
        <!-- 按钮 -->
        <div class="btns">
          <div
            class="write-btn"
            @click="clickWriteBtn"
          >
            自己写
          </div>
          <div
            class="change-btn"
            @click="onClickExchangeBtn"
          >
            换一换
          </div>
        </div>
      </div>
      <!-- 设置电话 -->
      <div class="setting-item phone">
        <span class="title">电话</span>
        <switch
          class="switch phone-switch"
          color="#0cc164"
          :checked="isShowPhone"
          @change="phoneSwitchClick"
        />
        <!-- 分隔线 -->
        <div class="hr" />
      </div>
      <!-- 「确定按钮」 -->
      <div
        class="confirm-btn"
        @click="clickConfirmBtn"
      >
        确定
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { CHANGE_TEXT_LIST } from '@/static/constants/other-constants';
import { useSchedule } from '@/stores/schedule-store';
import { back } from '@/utils/navigate';
import { showToast } from '@/utils/tools';
import type { SwitchOnChangeEvent } from '@uni-helper/uni-app-types';

const scheduleStore = useSchedule();
const { schedulePosterData } = storeToRefs(scheduleStore);
const { getSchedulePosterData, editSchedulePosterData } = scheduleStore;

// #region 设置相关

onShow(() => {
  getSchedulePosterData();
});

/** 是否显示文字 */
const isShowText = ref(schedulePosterData.value.isShowText);

/** 是否可编辑文字 */
const isEditableText = ref(false);

/** 是否聚焦文字输入框 */
const isFocusText = ref(false);

/** 文字开关点击事件 */
const textSwitchClick = (e: SwitchOnChangeEvent | Event) => {
  isShowText.value = (e as SwitchOnChangeEvent).detail.value;
};

/** 文字内容 */
const textContent = ref(schedulePosterData.value.text);

/** 「自己写」按钮点击事件 */
const clickWriteBtn = () => {
  isEditableText.value = true;
  isFocusText.value = false;
  nextTick(() => {
    isFocusText.value = true;
  });
};

/** 是否显示电话 */
const isShowPhone = ref(schedulePosterData.value.isShowPhone);

/** 电话开关点击事件 */
const phoneSwitchClick = (e: SwitchOnChangeEvent | Event) => {
  isShowPhone.value = (e as SwitchOnChangeEvent).detail.value;
};

// #endregion

// #region 按钮点击事件

/** 「换一换」按钮点击事件 */
const onClickExchangeBtn = () => {
  textContent.value = CHANGE_TEXT_LIST[Math.floor(Math.random() * CHANGE_TEXT_LIST.length)];
};

/** 确定按钮点击事件 */
const clickConfirmBtn = async () => {
  schedulePosterData.value.isShowText = isShowText.value;
  schedulePosterData.value.text = textContent.value;
  schedulePosterData.value.isShowPhone = isShowPhone.value;
  try {
    const result = await editSchedulePosterData(schedulePosterData.value);
    if (result) {
      showToast('保存成功');
      setTimeout(() => {
        back();
      }, 500);
    } else {
      showToast('保存失败，请稍后重试');
    }
  } catch (e) {
    console.error(e);
  }
};

// #endregion
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;

  display: grid;
  grid-template:
    'nav-bar' auto
    'main' 1fr;

  .nav-bar {
    grid-area: nav-bar;
  }

  .main {
    grid-area: main;

    padding: 21px 12px 30px;
    display: grid;
    grid-template:
      'text' auto
      'phone' auto
      '. ' 1fr
      'confirm-btn' 12.3077vw
      / 1fr;
    row-gap: 20px;

    .setting-item {
      .title {
        margin-right: 12px;

        font-size: 3.8462vw;
        font-weight: 500;
        color: #333;
      }

      .switch {
        transform: scale(0.7);
      }

      .hr {
        margin: 12px 0;

        width: 100%;
        height: 1px;

        background-color: #e5e5e5;
      }

      // 文字设置
      &.text {
        display: grid;
        grid-template:
          'title switch' 7.4359vw
          '. .' 7px
          'hr hr' 1px
          '. .' 17px
          'text-content text-content' auto
          '. .' 16px
          'btns btns' 3.8462vw
          /1fr 10.2564vw;
        align-items: center;

        .title {
          grid-area: title;
        }

        .switch {
          grid-area: switch;
        }

        .hr {
          grid-area: hr;
        }

        .text-content {
          grid-area: text-content;

          width: 100%;
          min-height: 50px;

          font-size: 4.359vw;
          line-height: 1.5;
          color: #333;
        }

        .btns {
          grid-area: btns;

          display: grid;
          grid-template:
            '. write-btn change-btn' 24px
            /1fr 12.5641vw 12.5641vw;
          grid-gap: 16px;

          .change-btn,
          .write-btn {
            width: 100%;
            height: 100%;

            background: linear-gradient(297deg, #ffd175 0%, #ffe8b7);
            border-radius: 2px;

            display: flex;
            align-items: center;
            justify-content: center;

            font-size: 13px;
            color: #fff;
          }

          .change-btn {
            grid-area: change-btn;
          }

          .write-btn {
            grid-area: write-btn;
          }
        }
      }

      &.phone {
        display: grid;
        grid-template:
          'title switch' 7.4359vw
          '. .' 7px
          'hr hr' 1px
          /1fr 10.2564vw;
        align-items: center;

        .title {
          grid-area: title;
        }

        .switch {
          grid-area: switch;
        }

        .hr{
          grid-area: hr;
        }
      }
    }

    // 「确定」按钮
    .confirm-btn {
      grid-area: confirm-btn;
      align-self: center;
      justify-self: center;

      width: 82.0513vw;
      height: 100%;

      background: linear-gradient(279deg, #ffd175 0%, #ffe8b7);
      border-radius: 40px;

      display: flex;
      align-items: center;
      justify-content: center;

      font-size: 3.5897vw;
      color: #704c00;
    }
  }
}
</style>
