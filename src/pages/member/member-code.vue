<template>
  <view class="container" style="padding: 20rpx 30rpx">
    <view class="w-100 d-flex flex-column">
      <view class="d-flex just-content-center align-items-center">
        <view class="avatar-wrapper">
          <image :src="memberStore.member?.avatarId || '/static/images/mine/default.png'"></image>
          <view class="tag">
            <image mode="widthFix" src="/static/images/mine/level.png"></image>
            <view>{{ 'LV1' }}</view>
          </view>
        </view>
      </view>
      <!-- user box begin -->
      <view class="user-box">
        <view
          class="d-flex just-content-center text-color-assist font-size-base font-weight-bold mb-30"
        >
          {{ memberStore.member?.fullname }}
        </view>
        <!-- user grids begin -->
        <view class="w-100 d-flex font-size-sm text-color-assist mb-30">
          <view class="user-grid">
            <view class="value">{{ couponList.length }}</view>
            <view>优惠券</view>
          </view>
          <view class="user-grid">
            <view class="value">{{ memberStore.member?.score }}</view>
            <view>积分</view>
          </view>
          <view class="user-grid">
            <view class="value">{{ memberStore.member?.balance }}</view>
            <view>余额</view>
          </view>
          <view class="user-grid">
            <view class="value">{{ integration }}</view>
            <view>礼品卡</view>
          </view>
        </view>
        <!-- user grids end -->
        <!-- qrcode begin -->
        <view class="qrcode d-flex just-content-center align-items-center">
          <uqrcode
            ref="uqrcode"
            canvas-id="qrcode"
            :value="memberStore.member?.id"
            :options="options"
          ></uqrcode>
        </view>
        <!-- qrcode end -->
        <view
          class="tips d-flex just-content-center align-items-center"
          style="margin-bottom: 50rpx"
        >
          <view class="font-size-sm text-color-assist">支付前出示可累计积分</view>
        </view>
      </view>
      <!-- user box end -->
    </view>
    <image
      class="w-100"
      mode="widthFix"
      src="https://img-shop.qmimg.cn/s16/images/2020/04/26/4a36d33657677787.png"
    ></image>
  </view>
</template>

<script lang="ts" setup>
import { onLoad, onShow } from '@dcloudio/uni-app'
import { useMemberStore } from '@/stores'
import { ref } from 'vue'
const integration = ref(0)
const couponList = ref([])
const memberStore = useMemberStore()
const options = {
  sizeUnit: 'rpx',
  margin: 20,
  auto: true,
}

onLoad(async () => {})

const integrals = () => {
  uni.navigateTo({
    url: '/pages/integrals/integrals',
  })
}
</script>

<style lang="scss" scoped>
.avatar-wrapper {
  width: 150rpx;
  height: 150rpx;
  border-radius: 100%;
  background-color: #ffffff;
  box-shadow: 0 0 20rpx rgba($color: #000000, $alpha: 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 10;

  image {
    width: 130rpx;
    height: 130rpx;
    border-radius: 100%;
  }

  .tag {
    background-color: #ffffff;
    position: absolute;
    right: -30rpx;
    bottom: -6rpx;
    display: flex;
    align-items: center;
    color: $color-warning;
    font-size: 22rpx;
    padding: 6rpx 16rpx;
    border-radius: 50rem !important;
    box-shadow: 2rpx 2rpx 20rpx rgba($color: #000000, $alpha: 0.1);

    image {
      width: 26rpx;
    }
  }
}

.user-box {
  width: 100%;
  position: relative;
  border-radius: 8rpx;
  background-color: #ffffff;
  margin-top: -75rpx;
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
