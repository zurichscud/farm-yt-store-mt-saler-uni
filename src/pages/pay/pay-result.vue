<template>
  <view class="container">
    <!-- 空订单 -->
    <view
      v-if="!order"
      class="d-flex w-100 h-100 flex-column just-content-center align-items-center"
    >
      <image class="drinks-img" src="/static/images/loading.gif"></image>
      <view class="tips d-flex flex-column align-items-center font-size-base text-color-assist">
        <view>您还没有点单</view>
        <view>快去犒劳一下自己吧~</view>
      </view>
      <button class="drink-btn" size="default" type="primary" @tap="menu">去点餐</button>
      <view class="font-size-sm text-color-primary" @tap="orders">查看历史订单</view>
    </view>
    <template v-else>
      <view class="order-box">
        <view class="bg-white">
          <view class="section">
            <!-- store info begin -->
            <list-cell :hover="false">
              <view class="w-100 d-flex align-items-center">
                <view class="d-flex flex-column w-60">
                  <view class="w-100 font-size-lg text-color-base text-truncate">
                    {{ '门店名称' }}
                  </view>
                </view>
                <view class="d-flex justify-content-end align-items-center w-40">
                  <image
                    src="/static/images/order/mobile.png"
                    style="width: 60rpx; height: 60rpx; margin-right: 30rpx"
                  ></image>
                  <image
                    src="/static/images/order/navigation.png"
                    style="width: 60rpx; height: 60rpx"
                  ></image>
                </view>
              </view>
            </list-cell>
            <!-- store info end -->
            <list-cell :hover="false" padding="50rpx 30rpx">
              <view class="w-100 d-flex flex-column">
                <view class="d-flex align-items-center just-content-center">
                  <view class="sort-num">{{ '支付成功' }}</view>
                </view>
                <view
                  v-if="order.status <= 1"
                  class="d-flex just-content-center align-items-center font-size-base text-color-assist mb-40"
                >
                  您前面还有
                  <text class="text-color-primary mr-10 ml-10">4</text>
                  单待制作
                </view>
                <!-- goods begin -->
                <view
                  class="w-100 d-flex flex-column position-relative mt-30"
                  style="margin-bottom: -40rpx"
                >
                  <view
                    v-for="(good, index) in order.orderItemList"
                    :key="index"
                    class="w-100 d-flex align-items-center mb-40"
                  >
                    <view class="d-flex flex-column w-60 overflow-hidden">
                      <view class="font-size-lg text-color-base mb-10 text-truncate">
                        {{ good.productName }}
                      </view>
                      <view
                        v-if="good.productAttr"
                        class="font-size-sm text-color-assist text-truncate"
                      >
                        {{ good.productAttr }}
                      </view>
                    </view>
                    <view class="d-flex w-40 align-items-center justify-content-between pl-30">
                      <view class="font-size-base text-color-base">
                        x{{ good.productQuantity }}
                      </view>
                      <view class="font-size-base text-color-base font-weight-bold">
                        ￥{{ good.productPrice }}
                      </view>
                    </view>
                  </view>
                </view>
                <!-- goods end -->
              </view>
            </list-cell>
          </view>
          <view class="section">
            <!-- payment and amount begin -->
            <list-cell :hover="false" padding="50rpx 30rpx">
              <view class="w-100 d-flex flex-column">
                <view class="pay-cell">
                  <view>支付方式</view>
                  <view class="font-weight-bold">{{ order.payType }}</view>
                </view>
                <view class="pay-cell">
                  <view>金额总计</view>
                  <view class="font-weight-bold">￥{{ order.payAmount }}</view>
                </view>
              </view>
            </list-cell>
            <!-- payment and amount end -->
          </view>
          <view class="section">
            <!-- order info begin -->
            <list-cell :hover="false" padding="50rpx 30rpx">
              <view class="w-100 d-flex flex-column">
                <view class="pay-cell">
                  <view>下单时间</view>
                  <view class="font-weight-bold">{{ '订单创建时间' }}</view>
                </view>
                <view class="pay-cell">
                  <view>下单门店</view>
                  <view class="font-weight-bold">{{ order.storeName }}</view>
                </view>
                <view class="pay-cell">
                  <view>支付方式</view>
                  <view class="font-weight-bold">{{ order.payType }}</view>
                </view>
                <view class="pay-cell">
                  <view>订单号</view>
                  <view class="font-weight-bold">{{ order.orderSn }}</view>
                </view>
              </view>
            </list-cell>
            <!-- order info end -->
          </view>
          <!-- order other info begin -->
          <list-cell :hover="false" last padding="50rpx 30rpx 20rpx">
            <view class="w-100 d-flex flex-column">
              <view class="pay-cell">
                <view>取单号</view>
                <view class="font-weight-bold">{{ order.id }}</view>
              </view>
              <view class="pay-cell">
                <view>享用方式</view>
                <view class="font-weight-bold">自取</view>
              </view>
              <view class="pay-cell">
                <view>取餐时间</view>
                <view class="font-weight-bold">立即取餐</view>
              </view>
              <view class="pay-cell">
                <view>完成制作时间</view>
                <view class="font-weight-bold">{{ order.receiveTime }}</view>
              </view>
              <view class="pay-cell">
                <view>备注</view>
                <view class="font-weight-bold">{{ order.note }}</view>
              </view>
            </view>
          </list-cell>
          <!-- order other info end -->
        </view>
      </view>
    </template>
  </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { Api } from '@/utils/api'
const query = defineProps<{
  orderId: string
}>()
const order = {
  storeName: '张飞',
  id: '123456',
  status: 15,
  typeCate: 2,
  createTime: '2025-01-01 10:00:00',
}
onLoad(async () => {
  console.log(query.orderId)
  // const res = await Api.apiCall('GET', Api.order.getRetailOrder, {
  //   orderId: query.orderId,
  // })
  // console.log(res)
})
</script>

<style lang="scss" scoped>
/* #ifdef H5 */
page {
  min-height: 100%;
  background-color: $bg-color;
}

/* #endif */
.order-box {
  padding: 20rpx;
  /* #ifdef H5 */
  margin-bottom: 100rpx;
  /* #endif */
}

.drinks-img {
  width: 260rpx;
  height: 260rpx;
}

.tips {
  margin: 60rpx 0 80rpx;
  line-height: 48rpx;
}

.drink-btn {
  width: 320rpx;
  border-radius: 50rem !important;
  margin-bottom: 40rpx;
  font-size: $font-size-base;
  line-height: 3;
}

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

.sort-num {
  font-size: 64rpx;
  font-weight: bold;
  color: $text-color-base;
  line-height: 2;
}

.steps__img-column {
  display: flex;
  margin: 30rpx 0;

  .steps__img-column-item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;

    image {
      width: 80rpx;
      height: 80rpx;
    }
  }
}

.steps__text-column {
  display: flex;
  margin-bottom: 40rpx;

  .steps__text-column-item {
    flex: 1;
    display: inline-flex;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: $font-size-base;
    color: $text-color-assist;

    &.active {
      color: $text-color-base;
      font-weight: bold;

      .steps__column-item-line {
        background-color: $text-color-base;
      }
    }

    .steps__column-item-line {
      flex: 1;
      height: 2rpx;
      background-color: #919293;
      transform: scaleY(0.5);
    }

    .steps__text-column-item-text {
      margin: 0 8px;
    }
  }
}
</style>
