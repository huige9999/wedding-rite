<template>
  <div class="container">
    <uni-nav-bar
      class="nav-bar"
      left-icon="left"
      status-bar
      title="报价设置"
      :border="false"
      background-color="#ffffff"
      @click-left="back"
    />
    <div class="form">
      <div class="form-item">
        <div class="label">类别</div>
        <input
          class="ipt"
          placeholder="例: 婚礼"
          maxlength="20"
          v-model="formData.category"
        />
      </div>
      <div class="form-item">
        <div class="label">报价</div>
        <input
          class="ipt"
          placeholder="请输入"
          maxlength="20"
          v-model="formData.price"
        />
      </div>
      <div class="form-item">
        <div class="label">定金</div>
        <input
          class="ipt"
          placeholder="请输入"
          maxlength="20"
          v-model="formData.deposit"
        />
      </div>
      <div class="form-item ud">
        <div class="label">
          补充说明<span class="extra-tip">(选填、100字以内)</span>
        </div>
        <textarea
          class="ta"
          placeholder="输入报价补充说明"
          maxlength="100"
          v-model="formData.additional"
        />
      </div>
      <div class="save-btn" @click="onSubmit">保存</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reqAddOffer, reqEditOffer } from "@/api/team-api";
import useTeam from "@/stores/team-store";
import { back } from "@/utils/navigate";
import { showToast } from "@/utils/tools";

const teamStore = useTeam();
const formData = reactive({
  category: "",
  price: "",
  deposit: "",
  additional: "",
});
const offerId = ref("");

const formValid = () => {
  if (!formData.category) {
    showToast("请输入类别!");
    return false;
  }
  if (!formData.price) {
    showToast("请输入报价!");
    return false;
  }
  if (!formData.deposit) {
    showToast("请输入定金!");
    return false;
  }
  return true;
};

const myShowToast = (status: 'success' | 'fail') => {
    if(status === 'success') {
      const msg = offerId.value? '修改报价成功!' : '添加报价成功!';
      showToast(msg);
    } else {
      const msg = offerId.value? '修改报价失败!' : '添加报价失败!';
      showToast(msg);
    }
}

const onSubmit = async () => {
  if (!formValid()) {
    return;
  }
  console.log(formData);
  try {
    if (offerId.value) {
      const res = await reqEditOffer({
        offerId: offerId.value,
        quote: formData.price,
        deposit: formData.deposit,
        content: formData.additional,
        kind: formData.category,
      });
      console.log(res);
    } else {
      const res = await reqAddOffer({
        teamId: teamStore.teamId,
        kind: formData.category,
        quote: formData.price,
        deposit: formData.deposit,
        content: formData.additional,
      });
      console.log(res);
    }
    myShowToast('success');
    teamStore.setNeedRefreshOffer(true);
    setTimeout(() => {
      back();
    }, 300);
  } catch (err) {
    console.log(err);
    showToast("添加报价失败!");
    myShowToast('fail');
  }
};

onLoad((options) => {
  if (options) {
    formData.category = options.category;
    formData.price = options.price;
    formData.deposit = options.deposit;
    formData.additional = options.additional;
    offerId.value = options.offerId;
  }
});
</script>

<style scoped lang="scss">
.container {
  position: relative;
  .form {
    width: 688rpx;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    .form-item {
      height: 120rpx;
      border-bottom: 2rpx solid #ededed;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      .label {
        font-size: 31rpx;
        font-weight: 400;
        color: #000000;
      }
      .ipt {
        font-size: 31rpx;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.4);
        text-align: right;
      }
      &.ud {
        height: 350rpx;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        padding-top: 37rpx;
        .label {
          display: flex;
          align-items: center;
          .extra-tip {
            font-size: 23rpx;
            font-weight: 400;
            color: rgba(0, 0, 0, 0.4);
            margin-left: 10rpx;
          }
        }
        .ta {
          font-size: 31rpx;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.4);
          width: 100%;
          height: 206rpx;
          margin-top: 31rpx;
        }
      }
    }
    .save-btn {
      width: 688rpx;
      height: 92rpx;
      background: #000000;
      font-size: 27rpx;
      font-weight: 500;
      color: #ffffff;
      text-align: center;
      line-height: 92rpx;
      position: fixed;
      bottom: 40rpx;
      z-index: 9999;
    }
  }
}
</style>
