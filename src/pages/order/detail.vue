<script lang="ts" setup>
import Orders from '@/api/orders'
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { Api } from '@/utils/api'

const order = ref()
const orderDetail = ref()
const query = defineProps<{
  id: number
  orderId: string
}>()
onLoad(async () => {
  const res = await Api.apiCall('GET', Api.order.getMiniAppOrderDetails, { orderId: query.orderId })
  orderDetail.value = res
  console.log(orderDetail.value)
  order.value = Orders.find((item) => item.id == query.id)
})
const review = () => {
  // const date = order.value.completed_time.split(' ')[0]
  // uni.navigateTo({
  //   url: `/pages/review/review?storename=${order.value.store.name}&typeCate=${order.value.typeCate}&date=${date}`,
  // })
  uni.showToast({
    title: '敬请期待',
    icon: 'error',
  })
}
</script>

<template>
  <view class="container" style="padding: 20rpx">
    <view style="padding-bottom: 100rpx">
      <view class="bg-white">
        <view class="section">
          <!--          <list-cell :hover="false">-->
          <!--            <view class="w-100 d-flex align-items-center">-->
          <!--              <view class="d-flex flex-column w-60">-->
          <!--                <view class="w-100 font-size-lg text-color-base text-truncate mb-10">{{ order?.store.name }}</view>-->
          <!--                <view class="w-100 d-flex align-items-center overflow-hidden">-->
          <!--                  <image src="/static/images/order/location.png" class="flex-shrink-0"-->
          <!--                         style="width: 30rpx; height: 30rpx;"></image>-->
          <!--                  <view class="text-truncate font-size-sm text-color-assist">{{ order?.store.address }}</view>-->
          <!--                </view>-->
          <!--              </view>-->
          <!--              <view class="d-flex justify-content-end align-items-center w-40">-->
          <!--                <image src="/static/images/order/mobile.png"-->
          <!--                       style="width: 60rpx; height: 60rpx;margin-right: 30rpx;"></image>-->
          <!--                <image src="/static/images/order/navigation.png" style="width: 60rpx; height: 60rpx;"></image>-->
          <!--              </view>-->
          <!--            </view>-->
          <!--          </list-cell>-->
          <list-cell :hover="false" padding="50rpx 30rpx">
            <view class="w-100 d-flex flex-column position-relative" style="margin-bottom: -40rpx">
              <view
                class="w-100 d-flex align-items-center mb-5"
                v-for="(good, index) in orderDetail?.products"
                :key="index"
              >
                <view class="d-flex flex-column w-60 overflow-hidden">
                  <view class="font-size-lg text-color-base mb-5 text-truncate">
                    {{ good.productName }}
                  </view>
                  <img :src="good.productImg" style="width:100rpx; height:100rpx;"/>
                </view>
                <view class="d-flex w-40 align-items-center justify-content-between pl-30">
                  <view class="font-size-base text-color-base">x{{ good.boughtNum }}</view>
                  <view class="font-size-base text-color-base font-weight-bold">
                    ￥{{ good.price }}
                  </view>
                </view>

              </view>
            </view>
          </list-cell>
        </view>
        <view class="section">
          <list-cell :hover="false" padding="50rpx 30rpx">
            <view class="w-100 d-flex flex-column">
              <view class="pay-cell">
                <view>支付方式</view>
                <view class="font-weight-bold">{{ orderDetail?.instructions === null ? '未支付' : orderDetail?.instructions}}</view>
              </view>
              <view class="pay-cell">
                <view>金额总计</view>
                <view class="font-weight-bold">￥{{ orderDetail?.orderAmount }}</view>
              </view>
            </view>
          </list-cell>
        </view>
        <view class="section">
          <list-cell :hover="false" padding="50rpx 30rpx">
            <view class="w-100 d-flex flex-column">
              <view class="pay-cell">
                <view>下单时间</view>
                <view class="font-weight-bold">
                  {{ orderDetail?.purchaseDate }}
                </view>
              </view>
              <view class="pay-cell">
                <view>下单门店</view>
                <view class="font-weight-bold">{{ orderDetail?.shopName }}</view>
              </view>
              <view class="pay-cell">
                <view>订单号</view>
                <view class="font-weight-bold">{{ orderDetail?.orderId }}</view>
              </view>
            </view>
          </list-cell>
        </view>
      </view>
      <view class="position-relative w-100">
        <image src="/static/images/order/bottom.png" mode="widthFix" class="w-100"></image>
<!--        <view class="invote-box" v-if="!order?.invoice_status">-->
<!--          <view class="font-size-base text-color-primary">去开发票</view>-->
<!--          <image src="/static/images/order/right.png"></image>-->
<!--        </view>-->
      </view>
    </view>
    <view class="btn-box">
      <view class="item" v-if="order?.invoice_status > 0">
        <button type="primary">查看发票</button>
      </view>
      <view class="item">
        <button type="primary" plain @tap="review">去评价</button>
      </view>
      <view class="item" @tap="review">
        <button type="primary">再来一单</button>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
@mixin arch {
  content: '';
  position: absolute;
  background-color: $bg-color;
  width: 30rpx;
  height: 30rpx;
  bottom: -15rpx;
  z-index: 10;
  border-radius: 100%;
}

.section {
  position: relative;

  &::before {
    @include arch;
    left: -15rpx;
  }

  &::after {
    @include arch;
    right: -15rpx;
  }
}

.img {
  width: $img-size-lg;
  height: $img-size-lg;
  border-radius: $border-radius-base;
}

.pay-cell {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: $font-size-base;
  color: $text-color-base;
  margin-bottom: 40rpx;

  &:nth-last-child(1) {
    margin-bottom: 0;
  }
}

.invote-box {
  position: absolute;
  width: 100%;
  left: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn-box {
  background-color: #ffffff;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 120rpx;
  box-shadow: 0 0 20rpx rgba($color: #000000, $alpha: 0.1);
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  z-index: 11;

  .item {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20rpx 10rpx;
    flex: 1;
    flex-shrink: 0;

    button {
      width: 100%;
      border-radius: 50rem !important;
      height: 80rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
    }
  }
}
</style>
