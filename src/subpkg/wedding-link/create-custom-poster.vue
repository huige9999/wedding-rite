<!-- 「创建自定义海报」页面 -->
<template>
  <web-view :src="src" />
  <button style="background-color: red">
    test
  </button>
</template>

<script setup lang="ts">
import useUser from '@/stores/user-store';

const userStore = useUser();
const { userInfo, personalInfo } = storeToRefs(userStore);
const { getPersonalInfo } = userStore;

const src = computed(() => `${import.meta.env.VITE_H5_URL}/#/custom-poster?userId=${userInfo.value.id}&title=${personalInfo.value.realName}`);

const checkAndGetDate = () => {
  if (!userInfo.value.id) {
    getPersonalInfo();
  }
};

onShow(() => {
  checkAndGetDate();
});
</script>
