<!-- 「个人简介」页面 -->
<template>
  <div class="container">
    <uni-nav-bar
      class="nav-bar"
      left-icon="left"
      title="个人简介"
      status-bar
      :border="false"
      @click-left="back"
    />
    <!-- 主体部分 -->
    <div class="main">
      <!-- 填写姓名提示 -->
      <span class="name-input-tip tip">请填写您的真实姓名</span>
      <!-- 姓名输入框 -->
      <input
        v-model="personalInfo.realName"
        type="text"
        class="name-input input"
        placeholder="例如：主持人 大熊"
      >
      <!-- 填写个人简介提示 -->
      <span class="intro-input-tip tip">请填写个人简介</span>
      <!-- 个人简介输入框 -->
      <textarea
        :value="personalInfo.intro"
        class="intro-input input"
        placeholder="点击填写"
        maxlength="200"
        :data-count="`${personalInfo.intro?.length||0}/200`"
        @input="onIntroInput"
      />
      <!-- 选择标签提示 -->
      <span class="select-tag-tip tip">请选择我的标签</span>
      <!-- 标签选择器 -->
      <div class="tag-selector">
        <!-- 标签 -->
        <div
          v-for="(tag,index) in TAG_LIST"
          :key="index"
          class="tag"
          :class="isTagSelected(tag)? 'active':''"
          @click="onTagClick(tag)"
        >
          {{ tag }}
          <!-- 关闭图标 -->
          <image
            v-if="isTagSelected(tag)"
            class="close-icon"
            src="@/static/icons/my/close-circle-yellow.svg"
            mode="scaleToFill"
          />
        </div>
      </div>
      <!-- 「确定」按钮 -->
      <div
        class="confirm-btn"
        @click="onConfirmBtnClick"
      >
        确定
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { TAG_LIST } from '@/static/constants/view-constants';
import useUser from '@/stores/user-store';
import { back } from '@/utils/navigate';
import { showToast } from '@/utils/tools';
import type { TextareaOnInputEvent } from '@uni-helper/uni-app-types';

const userStore = useUser();
const { personalInfo } = storeToRefs(userStore);
const { getPersonalInfo, editPersonalInfo } = userStore;

onMounted(() => {
  getPersonalInfo();
});

// #region 标签相关

/**
 * 判断标签是否已被选择
 * @param tag 标签
 * @returns 是否已被选择
 */
const isTagSelected = (tag: string) => personalInfo?.value?.tags?.includes(tag);

/**
 * 标签点击事件
 * @param tag 标签
 */
const onTagClick = (tag: string) => {
  const tags = personalInfo.value.tags || [];
  const index = tags.indexOf(tag);
  if (index === -1) {
    tags.push(tag);
  } else {
    tags.splice(index, 1);
  }
};

// #endregion

// #region 按钮点击事件

/** 「确定」按钮点击事件 */
const onConfirmBtnClick = async () => {
  console.log(personalInfo.value);
  const result = await editPersonalInfo(personalInfo.value);
  if (result) {
    back();
  } else {
    showToast('保存失败，请稍后重试');
  }
};

// #endregion

// #region 简介相关

/**
 * 个人简介输入事件
 * @param event 事件
 */
const onIntroInput = (event: TextareaOnInputEvent|Event) => {
  personalInfo.value.intro = (event as TextareaOnInputEvent).detail.value;
};

// #endregion

</script>

<style lang="scss" scoped>
.container {
  width: 100vw;
  min-height: 100vh;

  background-color: #f9f9f9;

  display: grid;
  grid-template:
    'nav-bar' auto
    'main' 1fr
    /100vw;

  .nav-bar {
    grid-area: nav-bar;
  }

  .main {
    grid-area: main;

    padding: 20px 12px 30px;
    display: grid;
    grid-template:
      'name-input-tip' 5.3846vw
      '.' 12px
      'name-input' 14.359vw
      '.' 20px
      'intro-input-tip' 5.3846vw
      '.' 12px
      'intro-input' 50.5128vw
      '.' 20px
      'select-tag-tip' 5.3846vw
      '.' 12px
      'tag-selector' min-content
      '.' 1fr
      'confirm-btn'  12.3077vw
      / 1fr;

    // 提示文字
    .tip {
      font-size: 3.8462vw;
      color: #8d8d8d;
    }

    // 输入框
    .input {
      background: #fff;
      border-radius: 2px;

      padding: 16px 12px;

      font-size: 4.359vw;
    }

    // 姓名输入
    .name-input-tip {
      grid-area: name-input-tip;
    }

    // 姓名输入框
    .name-input {
      grid-area: name-input;

      height: 100%;
    }

    // 个人简介输入提示
    .intro-input-tip {
      grid-area: intro-input-tip;
    }

    // 个人简介输入框
    .intro-input {
      grid-area: intro-input;

      position: relative;

      width: 100%;

      // 字数统计
      &::after {
        position: absolute;
        right: 12px;
        bottom: 12px;

        content: attr(data-count);

        font-size: 3.3333vw;
        color: #b0b0b0;
      }
    }

    // 选择标签提示
    .select-tag-tip {
      grid-area: select-tag-tip;
    }

    // 标签选择器
    .tag-selector {
      grid-area: tag-selector;

      display: flex;
      flex-wrap: wrap;
      gap: 12px;

      // 标签
      .tag {
        height: 10.2564vw;

        border: 1px solid rgb(0 0 0 / 25%);
        border-radius: 2px;

        padding: 8px 16px;

        font-size: 4.6154vw;
        color: #8d8d8d;
      }

      // 激活状态
      .active {
        position: relative;

        background: rgb(248 213 143 / 30%);
        border: 1px solid #f8d58f;
        border-radius: 2px;

        // 关闭图标
        .close-icon {
          position: absolute;
          top: 0;
          right: 0;

          width: 12px;
          height: 12px;

          transform: translate(50%, -50%);
        }
      }
    }

    // 「确定」按钮
    .confirm-btn {
      grid-area: confirm-btn;
      justify-self: center;

      width: 100%;
      height: 12.3077vw;

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
