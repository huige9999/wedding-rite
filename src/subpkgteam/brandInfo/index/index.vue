<template>
  <div class="container">
    <uni-nav-bar
      class="nav-bar"
      left-icon="left"
      status-bar
      :border="false"
      background-color="#ffffff"
      @click-left="back"
    />
    <div class="form">
      <div class="form-item lr">
        <input
          class="ipt"
          placeholder="请输入品牌名称"
          v-model="formData.brandName"
          maxlength="20"
        />
        <div class="logo-box">
          <!-- 未上传logo的情况 -->
          <div
            class="upload-logo_wrap"
            v-if="!formData.logoUrl"
            @click="onUploadPhoto"
          >
            <uni-icons type="camera" size="18" color="#ffffff"></uni-icons>
          </div>
          <!-- 已上传logo的情况 -->
          <img
            :src="formData.logoUrl"
            class="logo"
            @click="onUploadPhoto"
            v-else
          />
        </div>
      </div>
      <div class="form-item ud-input">
        <div class="label">公司/机构名称</div>
        <input
          class="ipt"
          placeholder="请输入公司/机构名称"
          maxlength="20"
          v-model="formData.companyName"
        />
      </div>
      <div class="form-item ud-input">
        <div class="label">对外联系电话</div>
        <input
          class="ipt"
          placeholder="请输入对外联系电话"
          type="number"
          maxlength="11"
          v-model="formData.contactPhone"
        />
      </div>
      <div class="form-item ud-input">
        <div class="label">对外联系微信</div>
        <input
          class="ipt"
          placeholder="请输入对外联系微信"
          maxlength="20"
          v-model="formData.contactWechat"
        />
      </div>
      <div class="form-item ud-value">
        <div class="label">对外联系地址</div>
        <div class="value-wrap">
          <div class="address">
            {{ contactAdressView }}
          </div>
          <div class="icon-btn" @click="getLocation">
            <uni-icons type="location" size="24" color="#000000"></uni-icons>
            定位
          </div>
        </div>
      </div>
      <!-- <div class="form-item ud-input">
        <div class="label">对外联系地址</div>
        <input class="ipt" placeholder="请输入对外联系地址" maxlength="20" v-model="formData.contactAddress" />
      </div> -->
      <div class="form-item ud-multi">
        <div class="label">
          服务地区<span class="sub-label"
            >（完善业务涵盖地区，便于客户在该地区搜索到您，最多支持添加3个地区）</span
          >
        </div>
        <div
          class="add-item"
          v-for="(item, index) in serviceAreaOptions"
          :key="index"
        >
          <input
            placeholder="请输入服务地区"
            class="ipt"
            v-model="serviceAreaOptions[index]"
          />
          <div
            class="add-btn"
            @click="addServiceArea"
            v-if="
              index === serviceAreaOptions.length - 1 &&
              index !== MAXSERVICEAREA - 1
            "
          >
            <uni-icons type="plus" size="18" color="#333333"></uni-icons>
          </div>
          <div class="sub-btn" v-else @click="removeServiceArea(index)">
            <uni-icons type="minus" size="18" color="#333333"></uni-icons>
          </div>
        </div>
      </div>
      <div class="form-item ud-multi">
        <div class="label">品牌标签</div>
        <div
          class="add-item"
          v-for="(item, index) in brandTagOptions"
          :key="index"
        >
          <input
            placeholder="请输入品牌标签"
            class="ipt"
            v-model="brandTagOptions[index]"
          />
          <div
            class="add-btn"
            @click="addBrandTag"
            v-if="
              index === brandTagOptions.length - 1 && index !== MAXBRANDTAG - 1
            "
          >
            <uni-icons type="plus" size="18" color="#333333"></uni-icons>
          </div>
          <div class="sub-btn" v-else @click="removeBrandTag(index)">
            <uni-icons type="minus" size="18" color="#333333"></uni-icons>
          </div>
        </div>
      </div>
      <div class="save-btn" @click="onSubmit">保存</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reqUploadAnyFile } from "@/api/others";
import { reqEditTeamInfo } from "@/api/team-api";
import useTeam from "@/stores/team-store";
import { back } from "@/utils/navigate";
import { parseUploadFileUrl } from "@/utils/parse";
import { isNetworkUrl, showToast } from "@/utils/tools";
import {
  uniAuthorize,
  uniChooseLocation,
  uniChooseMedia,
} from "@/utils/uniapp-api-promised";

const formData = reactive({
  brandName: "",
  logoUrl: "",
  companyName: "",
  contactPhone: "",
  contactWechat: "",
  contactAddress: "", // json字符串 格式为: {address: "", lat: "", lng: "",name: ""}
  serviceArea: [],
  brandTag: [],
});

const serviceAreaOptions = ref<string[]>([]);
const brandTagOptions = ref<string[]>([]);
const MAXSERVICEAREA = 3;
const MAXBRANDTAG = 3;

const teamStore = useTeam();
const { brandInfo } = storeToRefs(teamStore);

const contactAdressView = computed(() => {
  if (formData.contactAddress) {
    const { address, lat, lng, name } = JSON.parse(formData.contactAddress);
    return `${address} ${name} ${lat} ${lng}`;
  }
  return "";
});
const brandInfoObj = computed(() => {
  if (brandInfo.value) {
    return JSON.parse(brandInfo.value);
  }
  return {};
});

/**
 * 添加服务地区
 */
const addServiceArea = () => {
  if (serviceAreaOptions.value.length >= MAXSERVICEAREA) {
    showToast("最多只能添加3个服务地区");
    return;
  }
  serviceAreaOptions.value.push("");
};

/**
 * 移除服务地区
 */
const removeServiceArea = (index: number) => {
  serviceAreaOptions.value.splice(index, 1);
};

/**
 * 添加品牌标签
 */
const addBrandTag = () => {
  console.log("addBrandTag");
  if (brandTagOptions.value.length >= MAXBRANDTAG) {
    showToast("最多只能添加3个品牌标签");
    return;
  }
  brandTagOptions.value.push("");
};

/**
 * 移除品牌标签
 */
const removeBrandTag = (index: number) => {
  brandTagOptions.value.splice(index, 1);
};

/**
 * 根据serviceDataOptions计算formData.serviceArea
 */
const getServiceArea = () => {
  (formData.serviceArea as string[]) = serviceAreaOptions.value.filter(
    (item) => item
  );
};
/**
 * 根据brandTagOptions计算formData.brandTag
 */
const getBrandTag = () => {
  (formData.brandTag as string[]) = brandTagOptions.value.filter(
    (item) => item
  );
};

/**
 * 点击上传照片
 */
const onUploadPhoto = async () => {
  const chooseRes = await chooseImg();
  console.log("chooseRes", chooseRes);
  formData.logoUrl = chooseRes[0];
};

/**
 * 选择图片并返回图片地址
 * @param count 选择图片的数量，默认为1
 * @returns 返回选择的图片的本地地址列表
 */
const chooseImg = async (count = 1) => {
  const chooseRes = await uniChooseMedia({
    count,
    sizeType: ["original"],
    sourceType: ["album", "camera"],
    mediaType: ["image"],
  });
  if (!chooseRes?.tempFiles?.[0]?.tempFilePath) {
    return [];
  }

  return chooseRes.tempFiles.map((item) => item.tempFilePath);
};

const formValid = () => {
  if (!formData.brandName) {
    showToast("请输入品牌名称!");
    return false;
  }
  if (!formData.logoUrl) {
    showToast("请上传品牌logo");
    return false;
  }
  if (!formData.companyName) {
    showToast("请输入公司/机构名称");
    return false;
  }
  if (formData.contactPhone.length !== 11) {
    showToast("请输入正确的对外联系电话");
    return false;
  }
  if (!formData.contactWechat) {
    showToast("请输入对外联系微信");
    return false;
  }
  // if (!formData.contactAddress) {
  //   showToast("请输入对外联系地址");
  //   return false;
  // }
  return true;
};

const onSubmit = async () => {
  if (!formValid()) {
    return;
  }
  getServiceArea();
  getBrandTag();
  uni.showLoading({
    title: "正在提交中...",
  });
  try {
    if (!isNetworkUrl(formData.logoUrl)) {
      const uploadRes = await reqUploadAnyFile(formData.logoUrl);
      formData.logoUrl = parseUploadFileUrl(uploadRes.data);
    }
    const res = await reqEditTeamInfo({
      teamId: teamStore.teamId,
      brandInfo: JSON.stringify(formData),
    });
    console.log("提交成功", res);
    showToast("提交成功!");
  } catch {
    showToast("提交失败!");
  } finally {
    uni.hideLoading();
  }
  console.log(formData);
};

const getLocation = async () => {
  try {
    await uniAuthorize("scope.userLocation");
    const res = (await uniChooseLocation()) as UniApp.ChooseLocationSuccess;
    console.log("授权成功", res);
    const tmpObj = {
      address: res.address,
      lat: res.latitude,
      lng: res.longitude,
      name: res.name,
    };
    formData.contactAddress = JSON.stringify(tmpObj);
  } catch (e) {
    console.error("用户拒绝授权", e);
  }
};

const initData = () => {
  console.log("brandInfoObj>>>", brandInfoObj);
  formData.brandName = brandInfoObj.value.brandName || "";
  formData.logoUrl = brandInfoObj.value.logoUrl || "";
  formData.companyName = brandInfoObj.value.companyName || "";
  formData.contactPhone = brandInfoObj.value.contactPhone || "";
  formData.contactWechat = brandInfoObj.value.contactWechat || "";
  formData.contactAddress = brandInfoObj.value.contactAddress || "";
  formData.serviceArea = brandInfoObj.value.serviceArea || [];
  formData.brandTag = brandInfoObj.value.brandTag || [];
  formData.serviceArea.forEach((item) => {
    serviceAreaOptions.value.push(item);
  });
  if (serviceAreaOptions.value.length === 0) {
    serviceAreaOptions.value.push("");
  }
  formData.brandTag.forEach((item) => {
    brandTagOptions.value.push(item);
  });
  if (brandTagOptions.value.length === 0) {
    brandTagOptions.value.push("");
  }
};
initData();
</script>

<style scoped lang="scss">
.container {
  .form {
    width: 688rpx;
    margin: 0 auto;
    padding-bottom: 250rpx;
    .form-item {
      border-bottom: 2rpx solid #ededed;
      // 左右类型form-item
      &.lr {
        display: flex;
        align-items: center;
        height: 136rpx;
        .ipt {
          font-size: 46rpx;
          font-weight: 600;
          color: #000000;
          height: 80rpx;
        }
        .logo-box {
          width: 92rpx;
          height: 92rpx;
          .upload-logo_wrap {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: rgba(0, 0, 0, 0.6);
            border-radius: 50%;
          }
          .logo {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }
      }
      // 上下input类型form-item
      &.ud-input {
        height: 182rpx;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        .label {
          font-size: 27rpx;
          font-weight: 400;
          color: #333333;
        }
        .ipt {
          width: 500rpx;
          font-size: 31rpx;
          font-weight: 500;
          color: #000000;
          margin-top: 30rpx;
        }
      }
      // 上下value类型form-item
      &.ud-value {
        height: 182rpx;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        .label {
          font-size: 27rpx;
          font-weight: 400;
          color: #333333;
        }
        .value-wrap {
          margin-top: 31rpx;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 31rpx;
          font-weight: 500;
          color: #000000;
          width: 100%;
          .address {
            width: 527rpx;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
          .icon-btn {
            display: flex;
            align-items: center;
            font-size: 28rpx;
          }
        }
      }
      // 上下multi类型form-item
      &.ud-multi {
        padding: 39rpx 0 28rpx 0;
        .label {
          font-size: 27rpx;
          font-weight: 400;
          color: #333333;
          margin-bottom: 10rpx;
          .sub-label {
            color: rgba(0, 0, 0, 0.4);
          }
        }
        .add-item {
          display: flex;
          justify-content: space-between;
          margin-top: 20rpx;
          .ipt {
            font-size: 31rpx;
            font-weight: 500;
            color: #000;
          }
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
