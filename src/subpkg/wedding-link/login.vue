<!-- 「登录」页面 -->
<template>
  <div class="login">
    <uni-nav-bar title="登录" status-bar :border="false" />
    <!-- 账号密码登录 -->
    <LoginByPassword
      v-if="state === 'password'"
      ref="loginByPassword"
      @forget-password-click="state = 'forget'"
      @confirm="LoginByPasswordConfirm"
      @code-login-click="state = 'code'"
    />
    <!-- 验证码登录 -->
    <LoginByCode
      v-else-if="state === 'code'"
      ref="loginByCode"
      @password-login-click="state = 'password'"
      @get-code-click="LoginByCodeGetCodeClick"
      @confirm="LoginByCodeConfirm"
    />
    <!-- 忘记密码 -->
    <LoginForgetPassword
      v-else
      ref="LoginForgetPassWord"
      @get-code-click="LoginForgetPasswordGetCodeClick"
      @back-to-login="state = 'password'"
      @confirm="LoginForgetPasswordConfirm"
    />
    <!-- 「随便逛逛」按钮 -->
    <div class="explore-btn" @click="navigateTo('explore')">随便逛逛</div>
    <!-- 用户协议提示 -->
    <div class="user-agreement-tip">
      <image
        v-if="isAgreeUserAgreement"
        class="check-box"
        src="@/static/icons/common/checked-fill.svg"
        mode="scaleToFill"
        @click="CheckBoxClick"
      />
      <image
        v-else
        class="check-box"
        src="@/static/icons/common/circle-gray.svg"
        mode="scaleToFill"
        @click="CheckBoxClick"
      />
      <div class="text">使用前请同意</div>
      <div class="user-agreement" @click="navigateTo('user-agreement')">
        《用户与隐私协议》
      </div>
    </div>
  </div>
  <LoginAgreePopup
    ref="loginAgreePopup"
    @agree-btn-click="LoginAgreePopupAgree"
  />
  <QueryBeforeLogin ref="queryBeforeLoginRef" @roleChoose="onRoleChoose" />
</template>

<script lang="ts" setup>
import {
  recordInvite,
  reqChangePassword,
  reqLoginByCode,
  reqLoginByPassword,
  reqSendCode,
} from "@/api/user-api";
import LoginAgreePopup from "@/components/wedding-link/LoginAgreePopup.vue";
import LoginByCode from "@/components/wedding-link/LoginByCode.vue";
import LoginByPassword from "@/components/wedding-link/LoginByPassword.vue";
import LoginForgetPassword from "@/components/wedding-link/LoginForgetPassword.vue";
import QueryBeforeLogin from "@/components/wedding-link/QueryBeforeLogin.vue";
import useActivity from "@/stores/activity-store";
import { useBooking } from "@/stores/booking-store";
import { useSchedule } from "@/stores/schedule-store";
import useTeam from "@/stores/team-store";
import useUser from "@/stores/user-store";
import useWork from "@/stores/work-store";
import { navigateTo } from "@/utils/navigate";
import { setLocalTokenExpireTime, setToken } from "@/utils/token";
import { showToast } from "@/utils/tools";

const userStore = useUser();
const { getPersonalInfo, setUserName } = userStore;
const { inviteWorkMateID } = storeToRefs(userStore);

const scheduleStore = useSchedule();
const { getSchedulePosterData, getScheduleListAfterToday } = scheduleStore;

const workStore = useWork();
const { getWorkList } = workStore;

const activityStore = useActivity();
const { getActivityList } = activityStore;

const bookingStore = useBooking();
const { getAndSetBookingList } = bookingStore;

const teamStore = useTeam();
const { setTeamInfo } = teamStore;

const ctx = getCurrentInstance();

/** 页面状态 */
const state = ref<"password" | "code" | "forget">("password");

// #region 用户协议相关

/** 是否已勾选同意用户协议 */
const isAgreeUserAgreement = ref(false);

/** checkbox点击事件 */
const CheckBoxClick = () => {
  isAgreeUserAgreement.value = !isAgreeUserAgreement.value;
};

/** 用户协议弹窗同意事件 */
const LoginAgreePopupAgree = () => {
  isAgreeUserAgreement.value = true;
  switch (state.value) {
    case "password":
      (
        ctx?.refs.loginByPassword as InstanceType<typeof LoginByPassword>
      ).confirm();
      break;
    case "code":
      (ctx?.refs.loginByCode as InstanceType<typeof LoginByCode>).confirm();
      break;
    default:
      break;
  }
};

// #endregion

/** 密码登录模块，确定事件 */
const LoginByPasswordConfirm = async (e: {
  account: string;
  password: string;
}) => {
  // 检查是否同意了用户协议，如果没有同意，则弹出用户协议弹窗
  if (!isAgreeUserAgreement.value) {
    (ctx?.refs.loginAgreePopup as InstanceType<typeof LoginAgreePopup>).open();
    return;
  }
  try {
    const loginResData = (await reqLoginByPassword(e.account, e.password))
      ?.data;
    if (loginResData?.data.code === "200") {
      let role = "host";
      // 拥有团队权限的账号登录
      if (loginResData.data.teamInfo?.id) {
        setUserName(loginResData.data.user_qm_name);
        setTeamInfo(loginResData.data.teamInfo);
        role = (await askIdentityBeforeLogin()) as any;
      }
      uni.showLoading({
        title: "登录中...",
      });
      // 设置 token
      setToken(loginResData.data.token || "");
      setLocalTokenExpireTime(loginResData.data.expireTime);
      // 标记当前token为正式token
      uni.setStorageSync("isFormalToken", true);
      // 设置用户信息和个人信息
      getPersonalInfo();
      // 请求获取其他信息
      await Promise.all([
        getSchedulePosterData(),
        getScheduleListAfterToday(),
        getWorkList(),
        getActivityList(),
        getAndSetBookingList(),
        recordInviteMsg(),
      ]);
      setTimeout(() => {
        if (role === "team") {
          uni.navigateTo({
            url: "/subpkgteam/home/index/index",
            success: () => {
              uni.hideLoading();
            },
          });
        } else {
          // 清空teamInfo
          uni.removeStorageSync("teamInfo");
          uni.hideLoading();
          navigateTo("works");
        }
      }, 300);
    } else {
      showToast(loginResData?.data.errMsg || "登录失败");
    }
  } catch {
    uni.hideLoading();
  }
};

/** 验证码登录模块，点击「获取验证码」事件 */
const LoginByCodeGetCodeClick = async (phoneNumber: string) => {
  console.log("LoginByCodeGetCodeClick", phoneNumber);
  const getCodeRes = (await reqSendCode(phoneNumber, "6"))?.data;
  console.log("getCodeRes", getCodeRes);
  if (getCodeRes.code === "200") {
    // 设置 codeToken
    uni.setStorageSync("codeToken", getCodeRes.data.ext);
    showToast(getCodeRes.msg || "验证码已发送");
  } else {
    showToast(getCodeRes.msg || "验证码发送失败");
    const loginByCode = ctx?.refs.loginByCode as InstanceType<
      typeof LoginByCode
    >;
    loginByCode.closeGetCodeTime();
  }
};

/** 验证码登录模块，点击「确定」事件 */
const LoginByCodeConfirm = async (e: { phoneNumber: string; code: string }) => {
  // 检查是否同意了用户协议，如果没有同意，则弹出用户协议弹窗
  if (!isAgreeUserAgreement.value) {
    (ctx?.refs.loginAgreePopup as InstanceType<typeof LoginAgreePopup>).open();
    return;
  }
  console.log("LoginByCodeConfirm", e);
  const loginResData = // 提取 codeToken进行登录请求
    (
      await reqLoginByCode(
        e.phoneNumber,
        e.code,
        uni.getStorageSync("codeToken")
      )
    )?.data;
  console.log("loginResData", loginResData);
  if (loginResData?.data.code === "200") {
    // 设置用户信息和个人信息
    getPersonalInfo();
    // 设置 token及相关信息
    setToken(loginResData.data?.token || "");
    setLocalTokenExpireTime(loginResData.data?.expireTime);
    uni.setStorageSync("isFormalToken", true);

    // 请求获取其他信息
    await Promise.all([
      getSchedulePosterData(),
      getScheduleListAfterToday(),
      getWorkList(),
      getActivityList(),
      getAndSetBookingList(),
    ]);
    showToast("登录成功");
    setTimeout(() => {
      navigateTo("works");
    }, 300);
  } else {
    showToast(loginResData?.data.errMsg || "登录失败");
  }
};

/** 忘记密码模块，点击「获取验证码」 */
const LoginForgetPasswordGetCodeClick = async (phoneNumber: string) => {
  console.log("LoginForgetPasswordGetCodeClick", phoneNumber);
  const getCodeRes = (await reqSendCode(phoneNumber, "2"))?.data;
  console.log("getCodeRes", getCodeRes);
  if (getCodeRes.code === "200") {
    // 设置 codeToken
    uni.setStorageSync("codeToken", getCodeRes.data.ext);
    showToast(getCodeRes.msg || "验证码已发送");
  } else {
    showToast(getCodeRes.msg || "验证码发送失败");
    const LoginForgetPassWordRef = ctx?.refs
      ?.LoginForgetPassWord as InstanceType<typeof LoginForgetPassword>;
    LoginForgetPassWordRef.closeGetCodeTime();
  }
};

/** 忘记密码模块，点击「确定」事件 */
const LoginForgetPasswordConfirm: InstanceType<
  typeof LoginForgetPassword
>["onConfirm"] = async (e) => {
  console.log("LoginForgetPasswordConfirm", e);
  const changePasswordResDate = // 提取 codeToken进行登录请求
    (
      await reqChangePassword(
        e.phoneNumber,
        e.newPassword,
        e.code,
        uni.getStorageSync("codeToken")
      )
    )?.data;
  console.log("loginResData", changePasswordResDate);
  if (changePasswordResDate?.code === "200") {
    showToast(changePasswordResDate.msg || "修改成功");
    state.value = "password";
  } else {
    showToast(changePasswordResDate?.msg || "修改失败");
  }
};

/** 记录邀请 */
const recordInviteMsg = async () => {
  const res = await recordInvite(inviteWorkMateID.value);
};

/**
 * 分享
 */
onShareAppMessage(() => ({
  title: "欢迎使用WeddingRite",
  path: `/subpkg/wedding-link/login`,
}));

let askIdentityResolve: any = null;
/**
 * 多身份登录的情况下，登录之前询问以哪种身份登录
 */
const askIdentityBeforeLogin = async () => {
  return new Promise((resolve) => {
    askIdentityResolve = resolve;
    (
      ctx?.refs.queryBeforeLoginRef as InstanceType<typeof QueryBeforeLogin>
    ).open();
  });
};

/**
 * 选择身份完成登录
 */
const onRoleChoose = (role: "host" | "team") => {
  showToast("登录成功");
  if (askIdentityResolve) {
    askIdentityResolve(role);
  }
};
</script>

<style lang="scss" scoped>
.login {
  width: 100vw;
  min-height: 100vh;

  padding-bottom: 24.6154vw;
  display: grid;
  grid-template:
    "nav" min-content
    "main" auto
    "explore" min-content
    "." 52px
    "user-agreement-tip" min-content
    / 1fr;
  justify-items: center;

  .explore-btn {
    font-size: 14px;
    color: #b0b0b0;
  }

  // 用户协议
  .user-agreement-tip {
    grid-area: user-agreement-tip;

    display: flex;
    align-items: center;
    justify-content: center;

    .check-box {
      margin-right: 8px;

      width: 16px;
      height: 16px;
    }

    .text {
      font-size: 12px;
      color: #8d8d8d;
    }

    .user-agreement {
      font-size: 12px;
      color: #333;
    }
  }
}
</style>
