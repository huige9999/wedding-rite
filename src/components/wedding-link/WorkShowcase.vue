<!-- 「作品展示模块」 -->
<!-- 目前用于「我的预览」和「我的预览-分享」页面的作品展示 -->
<template>
  <div class="works">
    <!-- 标题 -->
    <div
      class="works-title"
      @click="onTitleClick"
    >
      <span class="text">作品</span>
      <image
        class="icon"
        src="@/static/icons/common/right-white.svg"
        mode="scaleToFill"
      />
    </div>
    <!-- tab栏 -->
    <div class="tab-bar">
      <div
        v-for="item in TAB_LIST"
        :key="item"
        class="tab-item"
        :class="currentWorkTab === item ? 'active' : ''"
        @click="onTabClick(item)"
      >
        {{ item }}
      </div>
    </div>
    <!-- 作品列表 -->
    <div class="work-list">
      <!-- 单个作品内容 -->
      <div
        v-for="item in currentWorkList"
        :key="item.id"
        class="work"
        @click="onWorkClick(item.id)"
      >
        <!-- 作品封面 -->
        <image
          class="cover"
          :src="item.coverUrl"
          mode="aspectFill"
        />
        <!-- 播放图标 -->
        <image
          v-if="item.videoUrl.length"
          class="play-icon"
          src="@/static/icons/my/play-circle-white.svg"
        />
        <!-- 作品标题 -->
        <div class="title ellipsis">
          {{ item.title }}
        </div>
      </div>
    </div>
    <!-- 更多作品按钮 -->
    <div
      v-if="props.workList.length > 4"
      class="more-works-btn"
      @click="onTitleClick"
    >
      更多作品
    </div>
  </div>
</template>

<script setup lang="ts">
import { navigateTo } from '@/utils/navigate';

type Props = {
  /** 作品列表 */
  workList: WorkInfo[];
  /** 是否分享给他人查看 */
  isShare: boolean;
  /** 当前展示用户的id */
  userId: string;
  /** 是否分享给同行 */
  isShareWorkmate: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  isShare: false,
  userId: '',
  isShareWorkmate: false,
});

onMounted(() => {
  console.log('workList', props.workList);
});

// #region tab栏以及作品列表显示相关
/** tab列表（Set） */
// XXX 类型推断不正确，待修改
const TAB_LIST = computed(() => new Set(
  props.workList.reduce((prev, cur) => {
    prev.push(...cur.tags);
    return prev;
  }, ['全部标签'] as string[]),
));

/** 当前作品tab栏激活项 */
const currentWorkTab = ref('全部标签');

/** tab点击事件 */
const onTabClick = (tab: string) => {
  currentWorkTab.value = tab;
};

/** 当前要显示的作品 */
const currentWorkList = computed(() => {
  if (currentWorkTab.value === '全部标签') {
    return props.workList.slice(0, 4);
  }

  // 被过滤过的作品列表
  const filteredWorkList = props.workList.filter((item) => {
    if (item.tags.includes(currentWorkTab.value)) {
      return true;
    }
    return false;
  });

  return filteredWorkList.slice(0, 2);
});

// #endregion

// #region 各种事件

/** 标题点击事件 */
const onTitleClick = () => {
  if (props.isShare) {
    navigateTo('more-works', { userId: props.userId });
    return;
  }

  if (props.isShareWorkmate) {
    navigateTo('more-works-share-workmate', { userId: props.userId });
    return;
  }
  navigateTo('works');
};

/**
 * 单个作品点击事件
 * @param workId 作品id
 */
const onWorkClick = (workId: string) => {
  console.log('是否分享给同行', props);

  if (props.isShare) {
    navigateTo('work-detail-share', { workId });
    return;
  }
  if (props.isShareWorkmate) {
    console.log('跳转到新版');
    navigateTo('work-detail-share-workmate', { workId });
    return;
  }
  navigateTo('work-detail', { workId });
};

</script>

<style scoped lang="scss">
// 作品
.works {
  width: 100vw;

  padding: 24px 12px;
  display: grid;
  grid-template:
    'title' 7.4359vw
    '.' 24px
    'tab-bar' 4.6154vw
    '.' 20px
    'works-list' min-content
    'more-works-btn' min-content
    / 1fr;

  .works-title {
    grid-area: title;

    display: flex;
    column-gap: 8px;
    align-items: center;

    .text {
      font-size: 5.3846vw;
      font-weight: bold;
      color: #fff;
    }

    .icon {
      width: 3.5897vw;
      height: 3.5897vw;
    }
  }

  // 标签栏
  .tab-bar {
    grid-area: tab-bar;

    height: 4.6154vw;

    display: grid;
    grid-template-columns: repeat(auto-fit, 13.3333vw);
    column-gap: 8px;

    .tab-item {
      font-size: 3.3333vw;
      color: rgba($color: #fff, $alpha: 70%);

      // 激活状态
      &.active {
        background-color: #2c2b32;
        border-radius: 20px;

        color: #fff;
      }
    }
  }

  // 作品列表
  .work-list {
    grid-area: works-list;

    display: grid;
    grid-template-rows: repeat(auto-fit, 33.3333vw);
    grid-template-columns: 1fr 1fr;
    row-gap: 20px;
    column-gap: 12px;

    .work {
      position: relative;

      display: grid;
      grid-template:
        'cover' 25.641vw
        'title' 4.6154vw
        / 1fr;
      row-gap: 12px;
      justify-items: center;

      .cover {
        grid-area: cover;

        width: 100%;
        height: 25.641vw;
      }

      .play-icon {
        position: absolute;
        top: 18.9744vw;
        left: 10px;

        width: 4.1026vw;
        height: 4.1026vw;
      }

      .title {
        grid-area: title;

        width: 44.359vw;
        height: 100%;

        font-size: 3.3333vw;
        color: #fff;
      }
    }
  }

  .more-works-btn {
    grid-area: more-works-btn;
    margin-top: 36px;

    width: 93.8462vw;
    height: 10.2564vw;

    background: #424148;
    border-radius: 8.2051vw;
    box-shadow: 0 2px 8px 0 rgb(52 51 47 / 25%);

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 3.3333vw;
    color: #fff;
  }
}
</style>
