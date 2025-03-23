<template>
  <view class="container" style="padding: 20rpx 30rpx">
    <view class="w-100 d-flex flex-column">
      <view class="user-box">
        <view class="qrcode d-flex just-content-center align-items-center">
          <uqrcode
            ref="uqrcode"
            canvas-id="qrcode"
            :value="voucherCode"
            :options="options"
          ></uqrcode>
        </view>
        <view
          class="tips d-flex just-content-center align-items-center"
          style="margin-bottom: 50rpx"
        >
          <view class="font-size-sm text-color-assist">出示二维码</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { onLoad, onUnload } from '@dcloudio/uni-app'
import { useMemberStore } from '@/stores'
import { ref } from 'vue'
import { Api } from '@/utils/api'

const integration = ref(0)
const couponList = ref([])
const memberStore = useMemberStore()
const voucherCode = ref(null)
let interval: NodeJS.Timeout | null = null
onLoad(async (options) => {
  voucherCode.value = options.voucherCode
  await checkStatus()
})
onUnload(() => {
  if (interval) {
    clearInterval(interval)
    interval = null
    console.log('页面卸载，清除轮询')
  }
})
const checkStatus = async () => {
  interval = setInterval(async () => {
    const result = await Api.apiCall('GET', Api.voucher.getVoucherRetailOrderStatus, { voucherCode: voucherCode.value })
    if (result) {
      clearInterval(interval)
      interval = null
      uni.showToast({
        title: '已核销',
        icon: 'success',
      })
      setTimeout(() => {
        uni.navigateBack()
      }, 2000)
    }
  }, 2000)
}
</script>

<style lang="scss" scoped>

.user-box {
  width: 100%;
  position: relative;
  border-radius: 8rpx;
  background-color: #ffffff;
  margin-top: 75rpx;
  padding-top: 105rpx;
  padding-bottom: 75rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 0 20rpx rgba($color: #000000, $alpha: 0.1);
}

.user-grid {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  &::after {
    content: ' ';
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    border-right: 1rpx solid $text-color-assist;
    transform: scaleX(0.2) scaleY(0.5);
  }

  &:nth-last-child(1)::after {
    border-right: 0;
  }

  .value {
    font-size: $font-size-base;
    font-weight: bold;
    margin-bottom: 10rpx;
  }
}
</style>
