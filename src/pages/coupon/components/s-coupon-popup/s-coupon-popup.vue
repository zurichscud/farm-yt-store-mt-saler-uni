<!-- 选择优惠券弹出层 -->
<template>
  <wd-popup
    v-model="visible"
    position="bottom"
    closable
    custom-style="height: 70vh; background-color: #f5f5f5;"
  >
    <view class="flex flex-col">
      <view class="py-4 text-center text-lg font-bold border-b border-gray-200">优惠券</view>
      <scroll-view
        class="px-2 h-[54vh]"
        scroll-y
        :scroll-with-animation="false"
        :enable-back-to-top="true"
      >
        <!--可使用的优惠券-->
        <view class="text-base font-medium text-gray-700 py-2 ml-4">可使用优惠券</view>
        <view v-for="(item, index) in canUseCoupons" :key="index" class="mb-3">
          <Coupon :data="item" :type="2" :disabled="false" @tap.stop="handleClick(item.id)">
            <template #default>
              <label class="flex flex-col items-center justify-center">
                <radio
                  color="red"
                  style="transform: scale(0.8)"
                  :checked="state.couponId === item.id"
                />
              </label>
            </template>
            <template #reason>
              <view class="text-sm text-gray-500">{{ canUseText(item) }}</view>
            </template>
          </Coupon>
        </view>

        <!--不可使用的优惠券-->
        <view class="text-base font-medium text-gray-700 py-2 ml-4">不可使用优惠券</view>
        <view v-for="item in unCanUseCoupons" :key="item.id" class="mb-3">
          <Coupon :data="item" :type="2" :disabled="true">
            <template v-slot:reason>
              <view class="text-sm text-gray-500">
                不可用原因：{{ item?.mismatchReason || '未达到使用门槛' }}
              </view>
            </template>
          </Coupon>
        </view>
      </scroll-view>
      <view class="flex-1 mx-4 mt-2">
        <wd-button block @tap="handleConfirm">确认</wd-button>
      </view>
    </view>
  </wd-popup>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Coupon from '@/pages/coupon/components/s-coupon/s-coupon.vue'
import type { UserCoupon } from '@/types/coupon'

const visible = defineModel<boolean>('visible', { required: true })
const props = defineProps<{
  list: UserCoupon[]
}>()
const emit = defineEmits(['confirm']) // 返回选中的优惠券ID
const state = ref({
  couponId: null as number | null, //选中的优惠券ID
})
const canUseCoupons = computed(() => {
  return props.list.filter((item) => item.match)
})
const unCanUseCoupons = computed(() => {
  return props.list.filter((item) => !item.match)
})

// 可使用时下方显示的文本
function canUseText(item: UserCoupon) {
  if (item.discountLimitPrice) {
    return `最多可抵${item.discountLimitPrice}元`
  }
  return ''
}

// 选择优惠券
function handleClick(id: number) {
  //如果点击相同的优惠券取消选择
  if (state.value.couponId === id) {
    state.value.couponId = null
  } else {
    state.value.couponId = id
  }
}

// 确认选择优惠券
function handleConfirm() {
  emit('confirm', state.value.couponId)
  visible.value = false
}
</script>

<style lang="scss" scoped></style>
