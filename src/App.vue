<script setup lang="ts">
import useHlr from "./stores/hlr-store";
import { enterWeddingRite } from "./utils/wedding-link";

const hlrStore = useHlr();
const { initHlrServiceData, initByeServiceData } = hlrStore;

onShow(async (options) => {
  if (!options) return;
  const path = options?.path || "";

  // 婚礼人相关业务
  if (path.indexOf("hlr") > -1) {
    initHlrServiceData();
    return;
  }
  if (path.indexOf("bye") > -1) {
    // 谢幕相关业务
    initByeServiceData();
    return;
  }

  const isWeddingRitePage = path.split("/")[1] === "wedding-link";
  if (isWeddingRitePage) {
    enterWeddingRite(options);
  }
});
</script>
<style lang="scss">
@import "./static/styles/common";

@import "./static/styles/patch";
</style>
