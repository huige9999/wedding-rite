<!--
  * 联系支持页面（已弃用，可删除）
  * @author: Ruan Jiazhen
  * @date: 2024-04-28  17:31:35
-->
<template>
  <div class="container">
    <uni-nav-bar
      title=""
      status-bar
      background-color="#00000000"
      left-icon="left"
      @click-left="back"
    />
    <div class="main" />
  </div>
</template>

<script lang="ts" setup>
import { back } from '@/utils/navigate';

</script>

<style lang="scss" scoped>
.container {
  width: 100vw;
  min-height: 100vh;

  display: grid;
  grid-template:
    'nav-bar' min-content
    'main' 1fr
    /100vw;
}
</style>
