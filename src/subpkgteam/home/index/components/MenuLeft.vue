<template>
  <div class="menu-left_container">
    <!-- 用于覆盖顶部导航栏 -->
    <div
      class="top-nav"
      v-if="topNavVisible"
      :style="{
        height: `${topNavHeight}px`,
      }"
    >
      <uni-icons
        type="closeempty"
        size="18"
        color="#333333"
        @click="hideMenu"
      ></uni-icons>
    </div>
    <uni-drawer
      ref="uniDrawerRef"
      mode="left"
      @change="onDrawerChange"
      :width="300"
    >
      <div class="menu-wrap" :style="{ paddingTop: `${topNavHeight}px` }">
        <!-- 一级主菜单 -->
        <div class="menu-main" v-if="!subTitle">
          <!-- 头像昵称信息 -->
          <div class="team-info">
            <image
              class="avatar"
              :src="avator"
              mode="aspectFill"
              @click="onUploadPhoto"
            ></image>
            <div class="text-info">
              <input
                v-model="name"
                placeholder="请输入团队名称"
                class="team-name_input"
                maxlength="20"
                @focus="tmpSaveOldName"
                @blur="onSaveTeamName"
              />
              <div class="team-phone">{{ phone }}</div>
            </div>
          </div>
          <!-- 菜单列表 -->
          <div class="menu-list">
            <div
              class="menu-item"
              @click="navigateTo('/subpkgteam/brandInfo/index/index')"
            >
              <div class="menu-name">品牌信息</div>
              <span class="CustomFont arrow-right">&#xe642;</span>
            </div>
            <div
              class="menu-item"
              @click="navigateTo('/subpkgteam/teamManage/index/index')"
            >
              <div class="menu-name">团队管理</div>
              <span class="CustomFont arrow-right">&#xe642;</span>
            </div>
            <div
              class="menu-item"
              @click="navigateTo('/subpkgteam/quotation/index/index')"
            >
              <div class="menu-name">报价设置</div>
              <span class="CustomFont arrow-right">&#xe642;</span>
            </div>
            <div
              class="menu-item"
              @click="navigateTo('/subpkgteam/schedules/index/index')"
            >
              <div class="menu-name">档期管理</div>
              <span class="CustomFont arrow-right">&#xe642;</span>
            </div>
            <div
              class="menu-item"
              @click="navigateTo('/subpkgteam/clientInfo/index/index')"
            >
              <div class="menu-name">客资</div>
              <span class="CustomFont arrow-right">&#xe642;</span>
            </div>
            <div class="menu-item" @click="changeSubTitle('setting')">
              <div class="menu-name">设置</div>
              <span class="CustomFont arrow-right">&#xe642;</span>
            </div>
            <div class="menu-item" @click="changeSubTitle('share')">
              <div class="menu-name">分享</div>
              <span class="CustomFont arrow-right">&#xe642;</span>
            </div>
          </div>
        </div>
        <!-- 二级菜单 -->
        <div class="menu-sub" v-if="subTitle">
          <!-- 设置的二级菜单 -->
          <div class="menu-sub-setting" v-if="subTitle === 'setting'">
            <div class="sub-nav_title">
              <uni-icons
                type="back"
                size="21"
                color="#333333"
                @click="backToMainMenu"
              ></uni-icons>
              <span class="title">设置</span>
            </div>
            <div
              class="menu-item"
              @click="navigateTo('/subpkgteam/setting/message/index')"
            >
              <div class="menu-name">消息设置</div>
              <span class="CustomFont arrow-right">&#xe642;</span>
            </div>
            <div class="menu-item">
              <div class="menu-name">访客通过分享内容查看主页</div>
              <switch class="switch auth-switch" color="#333333" />
            </div>
          </div>
          <!-- 分享的二级菜单 -->
          <div class="menu-sub-share" v-if="subTitle === 'share'">
            <div class="sub-nav_title">
              <uni-icons
                type="back"
                size="21"
                color="#333333"
                @click="backToMainMenu"
              ></uni-icons>
              <span class="title">分享</span>
            </div>
            <div
              class="menu-item"
              @click="navigateTo('/subpkgteam/poster/index/index')"
            >
              <div class="menu-name">生成个人海报</div>
              <span class="CustomFont arrow-right">&#xe642;</span>
            </div>
            <div class="shareimg_set">
              <div class="tit">设置转发分享封面图</div>
              <div class="shareimg-box">
                <image
                  class="share-img"
                  :src="shareCover"
                />
                <div class="change-btn" @click="changeShareCover">点击更换</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </uni-drawer>
  </div>
</template>

<script lang="ts" setup>
import { reqUploadAnyFile } from "@/api/others";
import { reqEditTeamInfo } from "@/api/team-api";
import useTeam from "@/stores/team-store";
import { parseUploadFileUrl } from "@/utils/parse";
import { showToast } from "@/utils/tools";
import { uniChooseMedia } from "@/utils/uniapp-api-promised";
import type { UniDrawer } from "@uni-helper/uni-ui-types";

type Props = {
  topNavHeight: number;
};
withDefaults(defineProps<Props>(), {
  topNavHeight: 0,
});

const topNavVisible = ref(false);
const subTitle = ref<"setting" | "share" | undefined>(undefined);

const ctx = getCurrentInstance();
const showMenu = () => {
  (ctx?.refs.uniDrawerRef as UniDrawer).open();
};

const hideMenu = () => {
  (ctx?.refs.uniDrawerRef as UniDrawer).close();
};

const onDrawerChange = (state: boolean) => {
  if (state) {
    topNavVisible.value = true;
  } else {
    topNavVisible.value = false;
    backToMainMenu();
  }
};

const navigateTo = (path: string) => {
  uni.navigateTo({ url: path });
};

const backToMainMenu = () => {
  subTitle.value = undefined;
};
const changeSubTitle = (title: "setting" | "share") => {
  subTitle.value = title;
};
let tmpOldName = "";
const tmpSaveOldName = () => {
  tmpOldName = name.value;
};

const onSaveTeamName = async () => {
  if (!name.value.trim()) {
    showToast("请输入团队名称!");
    return;
  }
  if (name.value === tmpOldName) {
    return;
  }
  try {
    const res = await reqEditTeamInfo({
      teamId: teamStore.teamId,
      name: name.value,
    });
    console.log(res);
    showToast("修改成功!");
  } catch (err) {
    console.log(err);
    showToast("修改失败!");
  }
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

/**
 * 点击上传照片
 */
const onUploadPhoto = async () => {
  try {
    const chooseRes = await chooseImg();
    const uploadRes = await reqUploadAnyFile(chooseRes[0]);
    avator.value = parseUploadFileUrl(uploadRes.data);
    const res = await reqEditTeamInfo({
      teamId: teamStore.teamId,
      avator: avator.value,
    });
    console.log(res);
    showToast("上传成功!");
  } catch (err) {
    console.log(err);
    showToast("上传失败!");
  }
};

/**
 * 点击更换分享海报
 */
const changeShareCover = async () => {
  try {
  const chooseRes = await chooseImg();
  const uploadRes = await reqUploadAnyFile(chooseRes[0]);
  const tmpUrl = parseUploadFileUrl(uploadRes.data);
  teamStore.setShareCover(tmpUrl);
  showToast("更换成功!");
  }catch(err){
    console.log(err);
    showToast("更换失败!");
  }
}

const teamStore = useTeam();
const { phone, name, avator, shareCover } = storeToRefs(teamStore);

defineExpose({
  showMenu,
});
</script>

<style scoped lang="scss">
.arrow-right {
  color: rgba(0, 0, 0, 0.25);
  font-size: 44rpx;
}
.menu-left_container {
  position: relative;
  .top-nav {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    background-color: #fff;
    z-index: 9999;
    padding-left: 38rpx;
    padding-bottom: 34rpx;
    display: flex;
    align-items: flex-end;
  }
  .menu-wrap {
    position: relative;
    .menu-main {
      padding: 0 32rpx;
      .team-info {
        display: flex;
        align-items: center;
        .avatar {
          width: 100rpx;
          height: 100rpx;
          border-radius: 50%;
        }
        .text-info {
          margin-left: 30rpx;
          .team-name_input {
            width: 320rpx;
            font-size: 38rpx;
            font-weight: 600;
            color: #000000;
            outline: none;
            border: none;
            background-color: transparent;
          }
          .team-phone {
            margin-top: 8rpx;
            font-size: 27rpx;
            font-weight: 400;
            color: rgba(0, 0, 0, 0.4);
          }
        }
      }
      .menu-list {
        margin-top: 30rpx;
        .menu-item {
          height: 84rpx;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 27rpx;
          font-weight: 600;
          text-align: LEFT;
          color: #000000;
        }
      }
    }
    .menu-sub {
      .sub-nav_title {
        display: flex;
        align-items: center;
        height: 121rpx;
        padding-left: 30rpx;
        .title {
          font-size: 38rpx;
          font-weight: 600;
          color: #000000;
          margin-left: 30rpx;
        }
      }
      .menu-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 85rpx;
        padding: 0 23rpx 0 38rpx;
        .menu-name {
          font-size: 27rpx;
          font-weight: 600;
          color: #000000;
        }
      }
      .menu-sub-setting {
        .auth-switch {
          transform: scale(0.7);
          transform-origin: right;
        }
      }
      .menu-sub-share {
        .shareimg_set {
          padding: 0 23rpx 0 38rpx;
          margin-top: 30rpx;
          .tit {
            font-size: 23rpx;
            font-weight: 400;
            color: rgba(0, 0, 0, 0.4);
          }
          .shareimg-box {
            width: 400rpx;
            height: 317rpx;
            display: block;
            margin-top: 23rpx;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            &::before {
              content: "";
              display: block;
              width: 100%;
              height: 100%;
              position: absolute;
              top: 0;
              left: 0;
              background-color: rgba(0, 0, 0, 0.5);
            }
            .share-img {
              width: 100%;
              height: 100%;
            }
            .change-btn {
              color: #fff;
              font-size: 24rpx;
              font-weight: 400;
              position: absolute;
            }
          }
        }
      }
    }
  }
}
</style>
