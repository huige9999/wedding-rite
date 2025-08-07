<template>
  <div class="wrapper">
    <image
      v-for="(item, index) in [1, 2, 3, 4, 5]"
      :key="index"
      class="star-icon"
      :class="size"
      :src="rate < item ? 'https://ustatic.joymew.com/joymewApp/mp/unstar.png' : 'https://ustatic.joymew.com/joymewApp/mp/star.png'"
      @click="setRate(item)"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  rate: {
    type: [Number, String],
    default: 0,
  },
  size: {
    type: [Number, String],
    default: 0,
  },
  edit: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['change'])
const setRate = (currentRate: number | string) => {
  if (!props.edit) {
    return
  }
  emit('change', currentRate)
}
</script>

<style scoped>
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.star-icon {
  width: 28rpx;
  height: 28rpx;
  margin-left: 12rpx;
}
.star-icon:nth-child(1) {
  margin-left: 0;
}
.big {
  width: 42rpx;
  height: 42rpx;
  margin-left: 12rpx;
}
</style>
