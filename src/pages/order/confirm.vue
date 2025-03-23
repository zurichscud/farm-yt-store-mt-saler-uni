<!-- 确认订单 -->
<template>
  <view class="container relative">
    <view class="pb-7">
      <view class="mb-20">
        <wd-cell :title="shopName || '请选择门店'" is-link @click="handleSelectStore" />
        <wd-cell title="联系电话" border>
          <template>
            <view class="flex justify-between items-center w-100">
              <input class="flex-1 text-right" type="tel" v-model="mobile" />
              <view class="contact-tip text-sm ml-2" @tap="handleInputMobile">自动填写</view>
            </view>
          </template>
        </wd-cell>
        <view class="mb-4"></view>
        <!-- 购物车列表  -->
        <wd-cell-group border>
          <wd-cell v-for="(item, index) in orderInfo?.productDetails" :key="index">
            <template #title>
              <view class="flex items-center">
                <image :src="item.productUrl" mode="aspectFill" class="product-image" />
                <view class="ml-2">
                  <view class="text-color-base mb-2">
                    {{ item.productName }}
                  </view>
                  <view class="text-color-base product-quantity text-color-secondary">
                    ×{{ item.quantity }}
                  </view>
                </view>
              </view>
            </template>
            <view class="text-color-primary font-weight-bold">￥{{ item.subtotalAmount }}</view>
          </wd-cell>
        </wd-cell-group>
        <view class="section-2">
          <wd-cell-group border>
            <wd-cell title="商品金额">
              <template>
                <view class="text-color-primary">￥{{ orderInfo?.originalTotalAmount }}</view>
              </template>
            </wd-cell>
            <wd-cell title="优惠券" is-link @click="handleCoupon">
              <template>
                <view class="text-color-primary">{{ couponText }}</view>
              </template>
            </wd-cell>
            <wd-cell title="礼品卡" is-link @click="goToPackages">
              <template>
                <view class="text-color-primary">暂未开放</view>
              </template>
            </wd-cell>
            <wd-cell>
              <view class="text-color-primary font-weight-bold">
                合计：￥{{ orderInfo?.payAmount }}
              </view>
            </wd-cell>
          </wd-cell-group>
        </view>

        <view class="flex items-center justify-start font-size-sm text-color-warning py-3">
          <view class="iconfont icon-bangzhu1"></view>
          <view>优惠券不与满赠、满减活动共享</view>
        </view>
        <!-- 支付方式  -->
        <!-- <wd-cell-group>
          <wd-cell title="支付方式" />
          <wd-cell title="微信支付" border>
            <template #icon>
              <view class="iconfont icon-weixinzhifu mr-2" style="color: #7eb73a"></view>
            </template>
          </wd-cell>
        </wd-cell-group> -->
        <view class="mb-4"></view>
        <!-- 备注  -->
        <wd-cell title="备注" value="点击填写备注" is-link @click="handleRemark" />
      </view>
    </view>
    <!-- 付款栏  -->
    <view
      class="w-100 pay-box position-fixed fixed-bottom flex items-center justify-between bg-white"
      v-if="!state.showCoupon"
    >
      <view class="font-size-sm" style="margin-left: 20rpx">合计：</view>
      <view class="font-size-lg flex-fill">￥{{ orderInfo?.payAmount }}</view>
      <view
        class="bg-primary h-100 flex items-center justify-center text-color-white font-size-base"
        style="padding: 0 60rpx"
        @tap="beforePay"
      >
        付款
      </view>
    </view>
    <!-- 确认下单门店 dialog-->
    <wd-message-box />
    <!-- 优惠券弹窗 -->
    <coupon-popup
      v-model:visible="state.showCoupon"
      :list="orderInfo?.coupons || []"
      @confirm="handleConfirm"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import CouponPopup from '@/pages/coupon/components/s-coupon-popup/s-coupon-popup.vue'
import { onLoad } from '@dcloudio/uni-app'
import { useCartStore, useMemberStore } from '@/stores'
import type { Retail } from '@/types/retail'
import Big from 'big.js'
import validate from '@/utils/validate'
import router from '@/utils/router'
import * as lakalaPayAPI from '@/apis/pay/lakalaPay'
import * as RetailAPI from '@/apis/order/retail'
import type { SettlementOrderResponse } from '@/apis/order/retail'
import { useMessage } from 'wot-design-uni'
const message = useMessage()

const query = defineProps<{
  shopId: string
  shopName: string
}>()
const cartStore = useCartStore()
const memberStore = useMemberStore()
const mobile = ref(memberStore.member?.phone || '')
const state = ref({
  couponId: undefined as number | undefined,
  showCoupon: false, // 是否展示优惠劵
  showDiscount: false, // 是否展示营销活动
  pointStatus: false, //是否使用积分
})
const retailOrder = ref<Retail>() // 零售订单
const orderId = ref<string>() // 零售订单ID
const payOrderInfo = ref() // 支付订单信息
const orderInfo = ref<SettlementOrderResponse>()
const couponText = computed(() => {
  if (state.value.couponId) {
    return `-￥${orderInfo.value?.couponAmount}`
  }
  if (orderInfo.value?.coupons.length) {
    if (orderInfo.value?.coupons.filter((item) => item.match).length > 0) {
      return orderInfo.value.coupons.filter((item) => item.match).length + '张可用'
    }
  }
  return '暂无优惠券可用'
})
const handleRemark = () => {}

//根据用户选择获取订单信息
async function getOrderInfo() {
  const { data, code } = await RetailAPI.settlementOrder({
    couponId: state.value.couponId,
    userId: memberStore.getMemberInfo('id') as string,
    goodsList: cartStore.cart.map((item) => {
      return {
        productId: item.id,
        count: item.number,
      }
    }),
  })
  orderInfo.value = data
}

// 构建零售订单
async function saveRetailOrder() {
  const products = orderInfo.value?.productDetails
  retailOrder.value = {
    shopId: query.shopId,
    orderAmount: orderInfo.value?.payAmount!,
    quantity: products?.length!,
    memberId: memberStore.getMemberInfo('id') as string,
    discountAmount: new Big(0),
    retailOrderProducts: products!.map((item) => {
      return {
        productId: item.productId,
        name: item.productName,
        discountAmount: new Big(0),
        boughtNum: item.quantity,
        price: item.subtotalAmount,
      }
    }),
  }
  const { data } = await RetailAPI.saveRetailOrder(retailOrder.value)
  orderId.value = data
}

// 调用拉卡拉获取支付参数
async function getPayParams() {
  const { data } = await lakalaPayAPI.lakalaPayActive({
    orderId: orderId.value!,
    orderAmt: cartStore.getCartGoodsPrice.toNumber(),
    openId: memberStore.member!.openId!,
    accountType: 'WECHAT',
  })
  payOrderInfo.value = data
}

//付款之前确认
function beforePay() {
  if (!validate.mobile(mobile.value)) {
    uni.showToast({
      title: '请检查手机号',
      icon: 'error',
    })
    return
  }
  if (!query.shopId) {
    uni.showToast({
      title: '请选择门店',
      icon: 'error',
    })
    return
  }
  if (!orderInfo.value?.productDetails?.length) {
    uni.showModal({
      title: '温馨提示',
      content: '当前订单缺少商品数据，请重新选择商品后再点单',
      showCancel: false,
      confirmText: '重新点单',
      success: () => {
        router.go('/pages/menu/menu')
      },
    })
    return
  }
  message
    .confirm({
      title: '请再次确认下单门店',
      msg: query.shopName,
      confirmButtonText: '确认并下单',
      cancelButtonText: '取消',
    })
    .then(() => {
      handlePay()
    })
}

//发起支付
async function handlePay() {
  // 1. 调用后端创建订单接口，获取订单ID
  await saveRetailOrder()
  //TODO：订单金额为0时的处理逻辑
  // 2. 调用后端获取支付参数
  await getPayParams()
  // 3. 调用微信支付
  if (payOrderInfo.value) {
    const res = await uni.requestPayment({
      provider: 'wxpay',
      orderInfo: payOrderInfo.value,
    })
    console.log(res)
    cartStore.destoryCart()
    router.redirect('/pages/pay/pay-result', { orderId: orderId.value! })
  }
}

//打开礼品卡popup
const goToPackages = () => {
  uni.showToast({
    title: '敬请期待',
    icon: 'error',
  })
}

//自动填写手机号
function handleInputMobile() {
  const phone = memberStore.getMemberInfo('phone') as string
  if (phone) {
    mobile.value = phone
  }
}

//选择门店
function handleSelectStore() {
  cartStore.destoryCart() //防止出现不同门店的商品不同
  router.redirect('/pages/menu/select-store')
}

//打开优惠券popup
function handleCoupon() {
  state.value.showCoupon = true
}

//确认选择优惠券
function handleConfirm(couponId: number) {
  console.log(couponId)
  state.value.couponId = couponId
  getOrderInfo()
}

onLoad(() => {
  getOrderInfo()
})
</script>

<style lang="scss" scoped>
.container {
  padding: 30rpx;
}

.contact-tip {
  border: 2rpx solid $color-primary;
  color: $color-primary;
}

.pay-box {
  box-shadow: 0 0 20rpx rgba(0, 0, 0, 0.1);
  height: 100rpx;
}

.product-image {
  width: 100rpx;
  height: 100rpx;
  border-radius: 8rpx;
}

.product-quantity {
  font-size: 28rpx;
}
</style>
