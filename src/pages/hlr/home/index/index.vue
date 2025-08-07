<template>
  <div class="hlr-home">
    <uni-nav-bar
      :title="navBarTitle"
      status-bar
      :border="false"
      fixed
    />
    <div class="cover">
      <image
        v-if="homeCarouseList.length > 0 && homeCarouseList[0].type === 'image'"
        :src="homeCarouseList[0].mediaPath"
        class="coverImage"
      />
      <div
        v-if="homeCarouseList.length > 0 && homeCarouseList[0].type === 'video'"
        class="coverVideo"
        @click="previewVideo"
      >
        <image
          :src="homeCarouseList[0].mediaPath + '?vframe/jpg/offset/0'"
          class="coverImage"
        />
        <image
          v-if="playIconVisible"
          src="https://ustatic.hudongmiao.com/joymewApp/playIconBig.png"
          class="playIcon"
        />
      </div>
      <div
        v-if="homeCarouseList.length === 0"
        class="coverDeco"
      >
        <div class="noCover">
          <image
            src="https://ustatic.joymew.com/joymewApp/mp/cases.png"
            class="noIcon"
          />
          <text class="noCoverTip">
            暂无封面
          </text>
        </div>
      </div>
      <div class="visitNum">
        访问量: {{ browses }}
      </div>
    </div>
    <div class="userInfoWrap">
      <image
        :src="avator"
        class="avator"
      />
      <div class="nickname">
        {{ name }}
      </div>
      <div class="description">
        {{ teamName }}
      </div>
      <div class="city">
        {{ city }}<span v-if="city && userType"> / </span>{{ userType }}
      </div>
      <div class="btnWrap">
        <div
          class="checkScheduleBtn"
          @click="toSchedule"
        >
          查询档期
        </div>
      </div>
      <div class="intro">
        <rich-text :nodes="description" />
      </div>
      <div class="infoCheckFuncs">
        <image
          v-if="shareType === '1'"
          src="https://ustatic.joymew.com/joymewApp/home/phoneIcon.png"
          mode="widthFix"
          class="funcIcon"
          @click="showFunc('0')"
        />
        <image
          v-if="shareType === '1'"
          src="https://ustatic.joymew.com/joymewApp/home/pIcon.png"
          mode="widthFix"
          class="funcIcon"
          @click="showFunc('1')"
        />
        <image
          src="https://ustatic.joymew.com/joymewApp/home/pcIcon.png"
          mode="widthFix"
          class="funcIcon"
          @click="showFunc('2')"
        />
        <div class="shareFunc">
          <image
            src="https://ustatic.joymew.com/joymewApp/home/zfIcon.png"
            mode="widthFix"
            class="shareFuncIcon"
            @click="showFunc('3')"
          />
          <button
            open-type="share"
            type="primary"
            class="shareBtn"
          />
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="nav">
        <div
          v-for="item in navList"
          :key="item.id"
          class="navItem"
          :class="{ active: activeNavId === item.id }"
          @click="chooseNav(item.id)"
        >
          {{ item.name }}
        </div>
      </div>
      <cases
        v-if="activeNavId === 0"
        :case-list="caseList"
        :name="name"
        :user-id="userId"
        :phone="phone"
        :case-len="caseLen"
      />
      <comments
        v-if="activeNavId === 1"
        :comment-list="commentList"
        :comments-len="commentsLen"
        :name="name"
        :user-id="userId"
      />
    </div>
    <infoPopup
      v-if="infoPopupVisible"
      :p-height="pHeight"
      :p-weight="pWeight"
      :p-year="pYear"
      @close="handleInfoPopupClose"
    />
  </div>
  <auth-dialog-hlr
    :need-auth-avatar-name="needAuthAvatarName"
    @updated="updated"
  />
  <ReserveBox
    :visible="boxVisible && splid"
    :bottom="bottomLift"
    :splid="splid"
    @update="changeData"
  />
  <reserve-btn
    :visible="!boxVisible && splid"
    :bottom="bottomLift"
    @update="changeData"
  />
</template>

<script lang="ts" setup>
import { addBrowses, getCaseList, getUserInfo, getUserComments } from '@/api/hlr-api';
import useHlr from '@/stores/hlr-store';
import { getLocalHlrData } from '@/utils/hlr';
import { showToast } from '@/utils/tools';
import cases from '../components/cases/cases.vue';
import infoPopup from '../components/infoPopup/infoPopup.vue';
import comments from '../components/comments/comments.vue';
import authDialogHlr from '../../components/authDialogHlr.vue';
import ReserveBox from '../components/ReserveBox/ReserveBox.vue';
import ReserveBtn from '../components/ReserveBtn/ReserveBtn.vue';

interface CaseListResult {
  code: number
  msg: string
  data: {
    currentPage: number
    list: any[]
    totalPage: number
    totalResult: number
  }
}

interface UserCommentsResult {
  code: number
  msg: string
  data: {
    labelInfo: {
      labelList: any[]
    }
    list: any[]
    totalPage: number
    totalResult: number
  }
}

const NAVLIST = [
  {
    id: 0,
    name: '作品',
  },
  {
    id: 1,
    name: '评价',
  },
];
const navList = ref(NAVLIST);
let userId = '';
let shareType: '1' | '2' = '2'; // 取值1:直接转发 2:隐藏转发<隐藏手机号信息>
const boxVisible = ref(false);
const bottomLift = ref(0);
const splid = ref<undefined | string>(undefined);
const infoPopupVisible = ref(false);
const activeNavId = ref(0);
const navBarTitle = ref('主页');
const caseList = ref<any[]>([]);
const caseLen = ref(0);
const playIconVisible = ref(false);
const avator = ref('');
const name = ref('');
const homeCarouseList = ref([]);
const userType = ref('');
const browses = ref('0');
const description = ref('');
const city = ref('');
const phone = ref('');
const wechat = ref('');
const pHeight = ref('');
const pWeight = ref('');
const birthday = ref('');
const pYear = ref('');
const teamName = ref('');
const commentList = ref<any[]>([]);
const commentsLen = ref(0);
const needAuthAvatarName = ref(false);

const hlrStore = useHlr();
const { hlrServiceData, hlrNeedRefreshCaseList } = storeToRefs(hlrStore);

const { updateHlrServiceData, updateHlrNeedRefreshCaseList } = hlrStore;

const handleInfoPopupClose = () => {
  infoPopupVisible.value = false;
};

const showFunc = (type: string) => {
  if (type === '0') {
    if (!phone.value) {
      showToast('没有电话!');
    } else {
      uni.makePhoneCall({ phoneNumber: phone.value });
    }
  } else if (type === '1') {
    if (!wechat.value) {
      showToast('没有微信!');
    } else {
      uni.setClipboardData({
        data: wechat.value,
        success: () => {
          showToast('微信号复制成功!');
        },
        fail: () => {
          showToast('微信号复制失败!');
        },
      });
    }
  } else if (type === '2') {
    // 弹出身高、体重信息、生日信息
    infoPopupVisible.value = true;
  }
};
const chooseNav = (activeId: number) => {
  activeNavId.value = activeId;
};

const getHomeCarouseList = (pLbt: string) => {
  let tmpArr = [];
  if (pLbt) {
    try {
      tmpArr = JSON.parse(pLbt);
    } catch (err) {
      console.log(err);
    }
  }
  return tmpArr;
};

const getUserType = (pType: string) => {
  const OCCUPATION = [
    {
      id: '1',
      name: '主持人',
    },
    {
      id: '2',
      name: '摄像师',
    },
    {
      id: '3',
      name: '摄影师',
    },
    {
      id: '4',
      name: '化妆师',
    },
    {
      id: '5',
      name: '婚礼机构',
    },
  ];
  const tmpIndex = OCCUPATION.findIndex((item) => parseInt(item.id, 10) === parseInt(pType, 10));
  let ocp = '主持人';
  if (OCCUPATION[tmpIndex]) {
    ocp = OCCUPATION[tmpIndex].name;
  }
  return ocp;
};

const initData = () => {
  getUserInfo(userId, hlrServiceData.hlrUserType as string)
    .then((res) => {
      console.log(res);
      if (typeof res === 'object' && typeof res?.data === 'object' && res?.data !== null) {
        avator.value = res.data.user_headimg;
        name.value = res.data.user_qm_name;
        homeCarouseList.value = getHomeCarouseList(res.data.user_lbt);
        userType.value = getUserType(res.data.user_type);
        browses.value = res.data.browses || '0';
        description.value = res.data.user_desc.replace(/\n/g, '<br/>');
        city.value = res.data.user_city;
        phone.value = res.data.phonenumber;
        wechat.value = res.data.user_wx;
        pHeight.value = res.data.user_height;
        pWeight.value = res.data.user_weight;
        birthday.value = res.data.uesr_birthday;
        pYear.value = res.data.user_age;
        if (res.data.teamInfo) {
          teamName.value = res.data.teamInfo.team_name;
        }
        navBarTitle.value = `${name.value}的主页`;
      }
    })
    .catch((err) => {
      console.log(err);
    });
  getCaseList(userId)
    .then((res) => {
      console.log('getCaseList', res);
      const rawRes = res as CaseListResult;
      caseList.value = rawRes.data.list;
      caseLen.value = Number(rawRes.data.totalResult);
    })
    .catch((err) => {
      console.log(err);
    });
  getUserComments(userId, 1, 20)
    .then((res) => {
      console.log('getUserComments', res);
      const tmpRes = res as UserCommentsResult;
      commentList.value = tmpRes.data.list;
      commentsLen.value = Number(tmpRes.data.totalResult);
    })
    .catch((err) => {
      console.log(err);
    });
};
const updated = () => {
  initData();
};

const changeData = (e) => {
  console.log(e);
  if (e.boxVisible) {
    boxVisible.value = true;
  } else {
    boxVisible.value = false;
  }
};

const toSchedule = () => {
  uni.navigateTo({ url: `/pages/hlr/schedules/checkSchedules/checkSchedules?name=${name.value}&userId=${userId}` });
};
const previewVideo = () => {
  uni.navigateTo({ url: `/pages/hlr/videoPlay/videoPlay?videoPath=${homeCarouseList.value[0].mediaPath}` });
};

onLoad((options) => {
  const cachedHlrData = getLocalHlrData();
  if (options?.userId) {
    userId = options.userId;
    shareType = options.type;
  } else if (options?.scene) {
    userId = options.scene;
    shareType = '2';
  } else {
    const HLRUSERID = '278da07144af46e599b5546b2b75535e';
    if (cachedHlrData && cachedHlrData.hlrUserId) {
      userId = cachedHlrData.hlrUserId;
      shareType = cachedHlrData.hlrShareType || '2';
    } else {
      userId = HLRUSERID;
      shareType = '2';
    }
  }
  updateHlrServiceData({
    hlrUserId: userId,
    hlrShareType: shareType,
  });

  if (options?.reserveId) {
    splid.value = options.reserveId;
  }

  if (cachedHlrData && cachedHlrData.hlrToken) {
    initData();
  } else {
    // 监听hlrServiceData.hlrToken
    watch(
      () => hlrServiceData,
      (newValue) => {
        console.log('监听hlrServiceData.hlrToken', newValue.value);
        if (!newValue.value.hlrAvatar || !newValue.value.hlrName) {
          needAuthAvatarName.value = true;
        } else {
          initData();
        }
      },
      { deep: true },
    );
  }
});

onShow(() => {
  if (userId) {
    addBrowses(userId)
      .then((res) => {
        console.log('addBrowses', res);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  if (hlrNeedRefreshCaseList.value === '1') {
    getCaseList(userId)
      .then((res) => {
        console.log('getCaseList', res);
        const rawRes = res as CaseListResult;
        caseList.value = rawRes.data.list;
        caseLen.value = Number(rawRes.data.totalResult);
        updateHlrNeedRefreshCaseList('0');
      })
      .catch((err) => {
        console.log(err);
      });
  }
  playIconVisible.value = true;
  setTimeout(() => {
    playIconVisible.value = false;
  }, 3000);
});
</script>

<style scoped>
.cover {
  width: 750rpx;
  height: 422rpx;
  position: relative;
  background-color: #010101;
}

.cover .coverImage {
  width: 100%;
  height: 100%;
}

.cover .coverVideo {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.cover .coverVideo .playIcon {
  width: 120rpx;
  height: 120rpx;
  position: absolute;
}

.cover .coverDeco {
  position: absolute;
  top: 0;
  left: 0;
  width: 750rpx;
  height: 422rpx;
}

.cover .coverDeco .noCover {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.cover .coverDeco .noCover .noIcon {
  width: 192rpx;
  height: 120rpx;
}

.cover .coverDeco .noCover .noCoverTip {
  margin-top: 22rpx;
  font-size: 20rpx;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);
  line-height: 20rpx;
}

.cover .visitNum {
  position: absolute;
  right: 60rpx;
  top: 160rpx;
  font-size: 20rpx;
  font-weight: 400;
  color: #ffffff;
  line-height: 20rpx;
  height: 30rpx;
}

.userInfoWrap {
  position: relative;
  padding-top: 48rpx;
  background-color: #ffffff;
  padding-top: 160rpx;
  padding-bottom: 26rpx;
  border-bottom: 1rpx solid #c7ccdb;
}

.userInfoWrap .avator {
  width: 128rpx;
  height: 128rpx;
  position: absolute;
  right: 84rpx;
  top: -64rpx;
  border-radius: 64rpx;
}

.userInfoWrap .nickname {
  font-size: 36rpx;
  font-weight: 600;
  color: #010101;
  line-height: 72rpx;
  position: absolute;
  right: 274rpx;
  top: 18rpx;
  width: 428rpx;
  text-align: right;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.userInfoWrap .description {
  width: 428rpx;
  position: absolute;
  right: 274rpx;
  top: 86rpx;
  text-align: right;
  text-overflow: ellipsis;
  overflow: hidden;
  font-size: 24rpx;
  font-weight: 400;
  color: #010101;
  white-space: nowrap;
  line-height: 24rpx;
}

.userInfoWrap .description {
  width: 428rpx;
  position: absolute;
  right: 274rpx;
  top: 86rpx;
  text-align: right;
  text-overflow: ellipsis;
  overflow: hidden;
  font-size: 24rpx;
  font-weight: 400;
  color: #010101;
  white-space: nowrap;
  line-height: 24rpx;
}

.userInfoWrap .city {
  font-size: 24rpx;
  font-weight: 400;
  color: #010101;
  position: absolute;
  right: 36rpx;
  top: 86rpx;
  width: 250rpx;
  text-align: center;
  line-height: 24rpx;
}

.userInfoWrap .btnWrap {
  display: flex;
  justify-content: center;
}

.userInfoWrap .btnWrap .checkScheduleBtn {
  width: 324rpx;
  height: 76rpx;
  background: #010101;
  border-radius: 12rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24rpx;
  font-weight: 500;
  color: #ffffff;
}

.userInfoWrap .infoCheckFuncs {
  display: flex;
  justify-content: center;
  margin-top: 20rpx;
}
.userInfoWrap .infoCheckFuncs .shareFunc {
  width: 104rpx;
  height: 104rpx;
  position: relative;
}

.userInfoWrap .infoCheckFuncs .shareFunc .shareFuncIcon {
  width: 100%;
  height: 100%;
}
.userInfoWrap .infoCheckFuncs .shareFunc .shareBtn {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 0;
}
.userInfoWrap .infoCheckFuncs .funcIcon {
  width: 104rpx;
  height: 104rpx;
  margin-right: 10rpx;
}

.userInfoWrap .intro {
  font-size: 24rpx;
  font-weight: 400;
  color: #848a9a;
  line-height: 72rpx;
  margin-top: 18rpx;
  display: flex;
  justify-content: center;
  padding: 0 40rpx;
}

.bottom {
  position: relative;
  background-color: #ffffff;
}

.bottom .nav {
  display: flex;
  padding-top: 30rpx;
  padding-left: 40rpx;
}

.bottom .nav .navItem {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60rpx;
  font-size: 28rpx;
  font-weight: 400;
  color: #848a9a;
  line-height: 28rpx;
  margin-right: 40rpx;
  position: relative;
}

.bottom .nav .navItem.active {
  font-weight: 600;
  color: #010101;
}

.bottom .nav .navItem.active::after {
  content: '';
  display: block;
  width: 40rpx;
  height: 4rpx;
  background: #010101;
  position: absolute;
  bottom: 0;
}

.popCt {
  display: flex;
  justify-content: space-around;
}

.popCt .pctItem {
  padding-top: 45rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.popCt .pctItem .zfIcon {
  width: 140rpx;
  height: 140rpx;
}

.popCt .pctItem text {
  font-size: 20rpx;
  font-weight: 400;
  color: #656972;
  margin-top: 2rpx;
  line-height: 28rpx;
}
</style>
