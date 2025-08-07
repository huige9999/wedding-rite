<template>
  <div class="hm-page bye">
    <uni-nav-bar
      title="谢幕信息填写"
      status-bar
      :border="false"
      fixed
    />
    <scroll-view
      class="formWrap"
      scroll-y
    >
      <div class="titleWrap">
        <div class="title">
          您的身份是：
        </div>
      </div>

      <div class="userWrap">
        <div
          v-for="(item, index) in userTagList"
          :key="index"
          class="userTag"
          :class="{ active: index === currentUserIndex }"
          @click="changeCurrentIndex(index)"
        >
          {{ item.name }}
        </div>
      </div>

      <div class="titleWrap">
        <div class="title">
          填写名称：
        </div>
      </div>

      <input
        v-model="name"
        type="text"
        class="nameInput"
      >

      <div class="titleWrap">
        <div class="title">
          上传图片<text class="text">
            （推荐比例 16:9）
          </text>:
        </div>
      </div>

      <div
        v-if="url"
        class="imgWrapper"
      >
        <image
          :src="url"
          class="urlImg"
        />
        <image
          src="https://static.joymew.com/joymew-feedback-mp/bye/close2.png"
          class="close"
          @click="handleRemoveImg"
        />
      </div>
      <div
        v-else
        class="imgInput"
        @click="chooseImg"
      >
        <image
          src="https://ustatic.hudongmiao.com/joymewApp/hd/bye/demoImgMP.png"
          class="demoImgMP"
        />
        <div class="text">
          点击上传
        </div>
      </div>

      <div class="place" />
    </scroll-view>

    <div class="btnWrap">
      <div
        class="sureBtn"
        @click="submit"
      >
        确定
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reqUploadSchedulePosterBg } from '@/api/schedule-api';
import { getByeData, updateByeData } from '@/api/hlr-api';
import useHlr from '@/stores/hlr-store';
import { showToast } from '@/utils/tools';

const BLOCKLIST = [
  {
    name: '新郎,新娘:',
    key: 'xnxl',
    index: 0,
  },
  {
    name: '婚礼主持:',
    key: 'host',
    index: 1,
  },
  {
    name: '婚庆公司:',
    key: 'company',
    index: 2,
  },
  {
    name: '婚礼摄影:',
    key: 'photographer',
    index: 3,
  },
  {
    name: '婚礼摄像:',
    key: 'cameraman',
    index: 4,
  },
  {
    name: '婚礼策划:',
    key: 'plan',
    index: 5,
  },
  {
    name: '婚礼DJ:',
    key: 'dj',
    index: 6,
  },
  {
    name: '婚礼管家:',
    key: 'manager',
    index: 7,
  },
  {
    name: '酒店:',
    key: 'hotel',
    index: 8,
  },
  {
    name: '化妆师:',
    key: 'dresser',
    index: 9,
  },
];

const tmpUserTagList = BLOCKLIST.map((item) => ({
  ...item,
  name: item.name.replace(':', ''),
}));
const hlrStore = useHlr();
const { byeToken } = storeToRefs(hlrStore);

const name = ref('');
const url = ref('');
const currentUserIndex = ref('');
const splid = ref('');
const fileList = ref([]);
const userTagList = ref(tmpUserTagList);
const loading = ref(false);
const formData = reactive({
  weddingTitle: '',
  xnxl: '',
  host: '',
  company: '',
  photographer: '',
  cameraman: '',
  plan: '',
  dj: '',
  manager: '',
  hotel: '',
  dresser: '',
  tip1: '',
  tip2: '',
});

onLoad((options) => {
  const fileList2 = [];
  const tempLen = 0;
  if (tempLen < 10) {
    for (let i = tempLen; i < 10; i += 1) {
      fileList2.push({ url: '' });
    }
  }

  fileList.value = fileList2;

  if (options.splid) {
    splid.value = options.splid;
  }
  watch(byeToken, (newValue) => {
    console.log('监听byeToken', newValue);
    if (newValue) {
      initData();
    }
  });
});

onShareAppMessage(() => ({ path: `/pages/bye/index/index?splid=${splid.value}` }));
const initCurrentInfo = () => {
  let resUrl = '';
  let resName = '';

  console.log(currentUserIndex.value, BLOCKLIST, fileList.value);
  if (currentUserIndex.value === '') {
    name.value = resName;
    url.value = resUrl;
    return;
  }
  const target = BLOCKLIST[currentUserIndex.value].key;
  if (fileList.value[currentUserIndex.value].url) {
    resUrl = fileList.value[currentUserIndex.value].url;
  }
  if (formData[target]) {
    resName = formData[target];
  }

  name.value = resName;
  url.value = resUrl;

  console.log(name.value, url.value);
};

const changeCurrentIndex = (index) => {
  if (currentUserIndex.value === index) {
    return;
  }
  currentUserIndex.value = index;

  console.log('changeCurrentIndex', currentUserIndex.value);
  initCurrentInfo();
};

const initData = () => {
  if (loading.value) {
    return;
  }
  loading.value = true;

  getByeData(splid.value, byeToken.value)
    .then((res) => {
      loading.value = false;

      if (res.data.xiemu) {
        const xiemuObj = JSON.parse(res.data.xiemu);
        if (xiemuObj.weddingTitle) {
          formData.weddingTitle = xiemuObj.weddingTitle;
        }
        if (xiemuObj.xnxl) {
          formData.xnxl = xiemuObj.xnxl;
        }
        if (xiemuObj.host) {
          formData.host = xiemuObj.host;
        }
        if (xiemuObj.company) {
          formData.company = xiemuObj.company;
        }
        if (xiemuObj.photographer) {
          formData.photographer = xiemuObj.photographer;
        }
        if (xiemuObj.cameraman) {
          formData.cameraman = xiemuObj.cameraman;
        }
        if (xiemuObj.plan) {
          formData.plan = xiemuObj.plan;
        }
        if (xiemuObj.dj) {
          formData.dj = xiemuObj.dj;
        }
        if (xiemuObj.manager) {
          formData.manager = xiemuObj.manager;
        }
        if (xiemuObj.hotel) {
          formData.hotel = xiemuObj.hotel;
        }
        if (xiemuObj.dresser) {
          formData.dresser = xiemuObj.dresser;
        }
        if (xiemuObj.tip1) {
          formData.tip1 = xiemuObj.tip1;
        }
        if (xiemuObj.tip2) {
          formData.tip2 = xiemuObj.tip2;
        }
        if (xiemuObj.imgList) {
          console.log('xiemuObj.imgList', xiemuObj.imgList);
          fileList.value = xiemuObj.imgList;
        }
        const tempLen = fileList.value.length;
        if (tempLen < 10) {
          for (let i = tempLen; i < 10; i += 1) {
            fileList.value.push({ url: '' });
          }
        }
        console.log('formData', formData);
        console.log('fileList', fileList);
        initCurrentInfo();
      }
    })
    .catch((err) => {
      console.log(err);
      loading.value = false;
    });
};

const chooseImg = () => {
  uni.chooseMedia({
    count: 1,
    mediaType: ['image'],
    sourceType: ['album'],
    success: (res) => {
      if (res.tempFiles.length > 0) {
        const { size, tempFilePath } = res.tempFiles[0];
        if (size > 1024 * 1024 * 20) {
          showToast('上传图片不能超过20M!');
          return;
        }
        url.value = tempFilePath;
      }
    },
  });
};

const handleRemoveImg = () => {
  url.value = '';
};

const confirmInfo = () => {
  const pureFileList = JSON.parse(JSON.stringify(fileList.value));
  const pureFormData = JSON.parse(JSON.stringify(formData));

  pureFileList[currentUserIndex.value].url = url.value;

  const target = BLOCKLIST[currentUserIndex.value].key;

  pureFormData[target] = name.value;
  const newFormData = {
    xiemu: JSON.stringify({
      ...pureFormData,
      imgList: pureFileList,
    }),
    splid: splid.value,
  };
  console.log(pureFormData, pureFileList);
  console.log(newFormData);

  updateByeData(newFormData, byeToken.value).then((res) => {
    console.log(res);
    initData();
    showToast('保存成功');
  });
};

const submit = () => {
  if (currentUserIndex.value === '') {
    showToast('请选择您的身份');
    return;
  }
  if (name.value === '') {
    showToast('请输入您的姓名');
    return;
  }
  if (url.value === '') {
    showToast('请选择图片');
    return;
  }
  if (url.value.indexOf('hudongmiao') > -1) {
    confirmInfo();
    return;
  }
  reqUploadSchedulePosterBg(url.value)
    .then((res) => {
      const tmpRes = JSON.parse(res.data);
      console.log(tmpRes.data.filePath);
      url.value = tmpRes.data.filePath;
      confirmInfo();
    })
    .catch((err) => {
      console.log(err);
      showToast('上传失败');
    });
};
</script>

<style scoped>
.hm-page {
  box-sizing: border-box;
}
.hm-page.bye {
  background-size: 100% 100%;
  height: 100vh;
}
.hm-page.bye .formWrap {
  box-sizing: border-box;
  width: 750rpx;
  padding: 32rpx;
  height: calc(100vh - 280rpx);
  display: flex;
  flex-direction: column;
}
.hm-page.bye .formWrap .titleWrap {
  height: 60rpx;
  margin: 32rpx 0;
}
.hm-page.bye .formWrap .titleWrap .title {
  color: #333333;
  font-size: 36rpx;
}
.hm-page.bye .formWrap .titleWrap .title .text {
  color: rgba(0, 0, 0, 0.4);
  font-size: 28rpx;
}
.hm-page.bye .formWrap .userWrap {
  display: flex;
  flex-wrap: wrap;
}
.hm-page.bye .formWrap .userWrap .userTag {
  margin-top: 32rpx;
  width: 212rpx;
  height: 92rpx;
  background: #ffffff;
  border: 1rpx solid #ebedef;
  border-radius: 58rpx;
  box-shadow: 0rpx 8rpx 18rpx 0rpx rgba(145, 167, 184, 0.21);
  display: flex;
  justify-content: center;
  align-items: center;
}
.hm-page.bye .formWrap .userWrap .userTag.active {
  background: #010101;
  border: 1rpx solid #ebedef;
  border-radius: 58rpx;
  color: #fff;
  box-shadow: 0rpx 8rpx 18rpx 0rpx rgba(184, 145, 145, 0.21);
}
.hm-page.bye .formWrap .nameInput {
  width: 686rpx;
  box-sizing: border-box;
  padding-left: 36rpx;
  height: 72rpx;
  border: 2rpx solid rgba(0, 0, 0, 0.2);
  /* border-radius: 8rpx; */
}
.hm-page.bye .formWrap .imgWrapper {
  position: relative;
  width: 686rpx;
  height: 386rpx;
  margin: 0 auto;
  box-sizing: border-box;
}
.hm-page.bye .formWrap .imgWrapper .urlImg {
  width: 686rpx;
  height: 386rpx;
  box-sizing: border-box;
  border: 1rpx solid #dcdcdc;
}
.hm-page.bye .formWrap .imgWrapper .close {
  position: absolute;
  top: 32rpx;
  right: 32rpx;
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
}
.hm-page.bye .formWrap .imgInput {
  width: 686rpx;
  height: 386rpx;
  margin: 0 auto;
  box-sizing: border-box;
  background: #f7f7f7;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.hm-page.bye .formWrap .imgInput .demoImgMP {
  width: 162rpx;
  height: 148rpx;
}
.hm-page.bye .formWrap .imgInput .text {
  margin-top: 32rpx;
  color: rgba(0, 0, 0, 0.4);
  font-size: 32rpx;
}
.hm-page.bye .formWrap .place {
  width: 686rpx;
  height: 26rpx;
}
.hm-page.bye .btnWrap {
  height: 150rpx;
  width: 750rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 0;
  left: 0;
}
.hm-page.bye .btnWrap .sureBtn {
  width: 668rpx;
  height: 90rpx;
  background: #010101;
  border-radius: 12rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  font-size: 32rpx;
  font-weight: 600;
}
</style>
