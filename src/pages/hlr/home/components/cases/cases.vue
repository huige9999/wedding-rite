<template>
  <div class="caseContent">
    <div
      v-if="caseLen === 0"
      class="noCaseBlock"
    >
      <image
        src="https://ustatic.joymew.com/joymewApp/home/emptyCase.png"
        class="emptyCase"
      />
      <div class="tip">
        暂无作品
      </div>
    </div>
    <div
      v-if="caseLen > 0"
      class="casesBlock"
    >
      <div class="casesNav">
        <div class="title">
          代表作品 <text class="numStastic">
            ({{ caseLen }})
          </text>
        </div>
        <div
          class="more"
          @click="toMore"
        >
          MORE <image
            src="https://ustatic.joymew.com/joymewApp/mp/rightArrow.png"
            class="arrowIcon"
          />
        </div>
      </div>
      <div class="casesList">
        <div
          v-for="item in caseList"
          :key="item.case_id"
          class="casesItem"
        >
          <div
            class="cover"
            :style="{ backgroundImage: `url(${item.case_cover})` }"
            @click="toCaseDetail(item.case_id)"
          />
          <div class="ct">
            <div class="title">
              {{ item.case_name }}
            </div>
            <div
              v-if="item.more_information_json"
              class="location"
            >
              {{ item.more_information_json }}
            </div>
          </div>
          <div class="bt">
            <div class="tags">
              #{{ item.case_type }} #{{ item.case_style }}
            </div>
            <div class="icons">
              <image
                src="https://ustatic.joymew.com/joymewApp/mp/loveIcon.png"
                class="loveIcon"
              />
              <text class="loveNum">
                {{ item.likes }}
              </text>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

const props = defineProps({
  caseList: {
    value: [],
    type: Array,
    default: [],
  },
  caseLen: {
    type: Number,
    default: 0,
  },
  name: {
    value: '',
    type: String,
    default: '',
  },
  userId: {
    value: '',
    type: String,
    default: '',
  },
  phone: {
    value: '',
    type: String,
    default: '',
  },
})

const toMore = () => {
  uni.navigateTo({ url: `/pages/hlr/cases/caseList/caseList?name=${props.name}&userId=${props.userId}&phone=${props.phone}` })
}

const toCaseDetail = (caseId: string) => {
  uni.navigateTo({ url: `/pages/hlr/cases/caseDetail/caseDetail?caseId=${caseId}&userId=${props.userId}&phone=${props.phone}&name=${props.name}` })
}
</script>

<style scoped>
.noCaseBlock {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 70rpx;
  padding-bottom: 180rpx;
}

.noCaseBlock .emptyCase {
  width: 440rpx;
  height: 284rpx;
}

.noCaseBlock .tip {
  margin-top: 75rpx;
  font-size: 28rpx;
  font-weight: 400;
  color: #868c9b;
  line-height: 28rpx;
}

.casesBlock {
  padding: 0 40rpx;
  padding-top: 40rpx;
}

.casesBlock .casesNav {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.casesBlock .casesNav .title {
  font-size: 28rpx;
  font-weight: 600;
  color: #010101;
  line-height: 72rpx;
}
.casesBlock .casesNav .title .numStastic {
  color: #848a9a;
  font-size: 24rpx;
  font-weight: 400;
  margin-left: 10rpx;
}
.casesBlock .casesNav .more {
  display: flex;
  align-items: center;
  font-size: 28rpx;
  font-weight: 400;
  color: #010101;
  line-height: 72rpx;
}

.casesBlock .casesNav .more .arrowIcon {
  margin-left: 10rpx;
  width: 26rpx;
  height: 32rpx;
}

.casesItem {
  margin-bottom: 65rpx;
}

.casesItem .cover {
  height: 344rpx;
  position: relative;
  background-color: #000000;
  background-size: cover;
  background-position: center;
}

.casesItem .ct {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.casesItem .ct .title {
  font-size: 28rpx;
  font-weight: 400;
  color: #010101;
  line-height: 72rpx;
  width: 370rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.casesItem .ct .location {
  font-size: 24rpx;
  font-weight: 400;
  color: #868c9b;
  line-height: 34rpx;
  width: 230rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.casesItem .bt {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.casesItem .bt .tags {
  background: rgba(229, 233, 240, 0.5);
  border-radius: 4rpx;
  padding: 6rpx 12rpx;
  font-size: 20rpx;
  font-weight: 400;
  color: #868c9b;
}

.casesItem .bt .icons {
  display: flex;
  align-items: center;
}

.casesItem .bt .icons .loveIcon {
  width: 32rpx;
  height: 32rpx;
}

.casesItem .bt .icons .loveNum {
  font-size: 32rpx;
  color: #000000;
  margin-right: 20rpx;
  margin-left: 5rpx;
}
</style>
