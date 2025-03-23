<script lang="ts" setup>
import listCell from '@/components/list-cell/list-cell'

const emit = defineEmits(['update:modelValue'])
// 定义props
const props = defineProps({
  modelValue: {
    type: Number,
    default: 0,
  },
  label: {
    type: String,
    default: '',
  },
  tips: {
    type: String,
    default: '',
  },
})

// 处理评分点击事件
const handleScoreClick = (index) => {
  emit('update:modelValue', index + 1)
}
</script>
<template>
  <list-cell :hover="false" last class="w-100 d-flex align-items-baseline">
    <view class="font-size-extra-lg text-color-primary mr-40">{{ label }}</view>
    <view class="flex-fill d-flex flex-column">
      <view class="d-flex align-items-center mb-20">
        <view
          class="iconfont score"
          v-for="(item, index) in 5"
          :key="index"
          @tap="handleScoreClick(index)"
          :class="[modelValue > index ? 'icon-shixinwujiaoxing' : 'icon-kongxinwujiaoxing']"
          :style="{ opacity: modelValue <= index || !modelValue ? 1 : modelValue / 5 + 0.1 }"
        ></view>
      </view>
      <view class="font-size-base text-color-base">{{ tips }}</view>
    </view>
  </list-cell>
</template>

<style lang="scss" scoped>
.score {
  font-size: 56rpx;
  color: #ccc;
  margin-right: 20rpx;

  &.iconshoucangfill {
    color: $color-warning;
  }
}

.icon-shixinwujiaoxing {
  color: $color-warning;
}
</style>
