<!-- 「个人信息」页面 -->
<template>
  <div class="container">
    <uni-nav-bar
      class="nav-bar"
      left-icon="left"
      title="个人信息"
      status-bar
      :border="false"
      background-color="#00000000"
      @click-left="back"
    />
    <!-- 主体部分 -->
    <div class="main">
      <!-- 信息列表 -->
      <div class="info-list">
        <!-- 头像 -->
        <div class="avatar item">
          <div class="label">
            头像
          </div>
          <div
            v-if="!pageUserInfo.avatar"
            class="right"
          >
            点击上传
          </div>
          <image
            :src="pageUserInfo.avatar"
            mode="aspectFill"
            class="right img"
          />
          <button
            class="right img btn"
            open-type="chooseAvatar"
            @chooseavatar="avatarClick"
          />
        </div>
        <!-- 昵称 -->
        <div class="nickname item">
          <div class="label">
            昵称
          </div>
          <input
            v-model="pageUserInfo.nickname"
            class="right input"
            inputmode="text"
            placeholder="请输入昵称"
          >
        </div>
        <!-- 电话号码 -->
        <div class="phone item">
          <div class="label">
            电话号码
          </div>
          <input
            v-model="pagePersonalInfo.phone"
            class="right input"
            inputmode="tel"
            placeholder="请输入号码"
          >
        </div>
        <!-- 年龄 -->
        <div class="age item">
          <div class="label">
            年龄
          </div>
          <input
            v-model="pageUserInfo.age"
            class="right input"
            inputmode="numeric"
            placeholder="请输入年龄"
          >
        </div>
        <!-- 身高 -->
        <div class="height item">
          <div class="label">
            身高
          </div>
          <input
            v-model="pageUserInfo.height"
            class="right input"
            inputmode="numeric"
            placeholder="请输入身高"
          >
          <span class="unit">CM</span>
        </div>
        <!-- 体重 -->
        <div class="weight item">
          <div class="label">
            体重
          </div>
          <input
            v-model="pageUserInfo.weight"
            class="right input"
            inputmode="numeric"
            placeholder="请输入体重"
          >
          <span class="unit">KG</span>
        </div>
        <!-- 主持熟练度 -->
        <div class="hosting-skill item">
          <div class="label">
            主持熟练度
          </div>
          <picker
            class="right"
            mode="selector"
            :range="PROFICIENCY_LIST"
            :value="hasProficiency? pagePersonalInfo.proficiency : 0"
            @change="proficiencyChange"
          >
            <div class="picker-box">
              <span
                class="text"
                :class="hasProficiency? 'has-proficiency':''"
              >
                {{ hasProficiency ?
                  PROFICIENCY_LIST[pagePersonalInfo.proficiency] :
                  '请选择' }}
              </span>
              <image
                v-if="!hasProficiency"
                class="icon"
                src="@/static/icons/common/right-gray.svg"
                mode="scaleToFill"
              />
            </div>
          </picker>
        </div>
      </div>
      <!-- 「完成」按钮 -->
      <div
        class="complete-btn"
        @click="finishBtnClick"
      >
        完成
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reqUploadAnyFile } from '@/api/others';
import { PROFICIENCY_LIST } from '@/static/constants/view-constants';
import useUser from '@/stores/user-store';
import { back } from '@/utils/navigate';
import { parseUploadFileUrl } from '@/utils/parse';
import { showToast } from '@/utils/tools';
import type { ButtonOnChooseavatarEvent, SelectorPickerOnChangeEvent } from '@uni-helper/uni-app-types';

const userStore = useUser();
const { userInfo, personalInfo } = storeToRefs(userStore);
const { editUserInfoAndPersonalInfo, getPersonalInfo } = userStore;

/** 页面上的用户信息 */
const pageUserInfo = ref({ ...userInfo.value });

/** 页面上的个人信息 */
const pagePersonalInfo = ref({
  ...personalInfo.value,
  phone: personalInfo.value.phone || userInfo.value.phone,
});

// #region 编辑信息相关

/** 头像信息点击事件 */
const avatarClick = async (event:ButtonOnChooseavatarEvent) => {
  if (!event.detail.avatarUrl) {
    return;
  }

  try {
    uni.showLoading({ title: '上传中' });
    const uploadRes = await reqUploadAnyFile(event.detail.avatarUrl);
    pageUserInfo.value.avatar = parseUploadFileUrl(uploadRes.data) || pageUserInfo.value.avatar;
    uni.hideLoading();
  } catch (e) {
    console.error(e);
  }
};

/**
 * 是否有设置主持熟练度
 * @returns 是否有设置主持熟练度
 */
const hasProficiency = computed(() => pagePersonalInfo.value.proficiency >= 0);

/**
 * 主持熟练度选择器修改事件
 * @param e 事件对象
 */
const proficiencyChange = (e: SelectorPickerOnChangeEvent) => {
  pagePersonalInfo.value.proficiency = e.detail.value;
};

// #endregion
/** 「完成」按钮点击事件 */
const finishBtnClick = async () => {
  const result = await editUserInfoAndPersonalInfo(pagePersonalInfo.value, pageUserInfo.value);
  if (result) {
    showToast('保存成功');
    getPersonalInfo();
    setTimeout(() => {
      back();
    }, 300);
  } else {
    showToast('保存失败，请稍后重试');
  }
};

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

    padding: 16px 12px;
    display: grid;
    grid-template:
      'info-list' min-content
      '.' 44px
      'complete-btn' 12.3077vw
      /1fr;
    justify-items: center;

    .info-list {
      grid-area: info-list;

      width: 100%;

      background-color: #fff;
      border-radius: 2px;

      padding-top: 8px;
      display: grid;
      grid-template-rows: repeat(auto-fill, auto);

      .item {
        height: 14.359vw;

        border-bottom: 1px solid #f9f9f9;

        padding: 0 24px;
        display: grid;
        grid-template:
          'label right' 1fr
          /1fr 1fr;
        align-items: center;

        &:last-child {
          border-bottom: none;
        }

        .label {
          grid-area: label;

          font-size: 3.8462vw;
          color: #333;
        }

        .right {
          grid-area: right;
          justify-self: end;

          font-size: 3.8462vw;

          &.input {
            text-align: end;
          }
        }
      }

      // 头像
      .avatar {
        position: relative;

        .right {
          color: #8d8d8d;

          &.img{
            width: 12.3077vw;
            height: 12.3077vw;

            border-radius: 50%;
          }

          // 隐藏的授权头像按钮
          &.btn{
            opacity: 0;
          }
        }
      }

      // 身高、体重
      .height,
      .weight {
        display: grid;
        grid-template-columns: 1fr 1fr auto;
        column-gap: 6px;
        align-items: center;

        .input {
          justify-self: end;

          font-size: 3.8462vw;
        }

        .unit {
          font-size: 3.8462vw;
          color: #333;
          text-align: center;
        }
      }

      // 主播熟练度
      .hosting-skill {
        .picker-box {
          display: flex;
          align-items: center;
          justify-content: space-between;

          .text {
            font-size: 3.8462vw;
            color: #8d8d8d;

            // 已经选择了主持熟练度
            &.has-proficiency {
              color: #333;
            }
          }

          .icon {
            width: 4.6154vw;
            height: 4.6154vw;
          }
        }
      }
    }

    // 「完成」按钮
    .complete-btn {
      grid-area: complete-btn;

      width: 82.0513vw;
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
