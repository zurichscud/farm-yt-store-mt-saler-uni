<!-- 点单 -->
<template>
  <view v-if="locationStore.locationAuth">
    <view class="container" v-if="!loading">
      <view class="main" v-if="menu.length">
        <!-- 导航 -->
        <view class="nav">
          <view class="header">
            <view class="left" v-if="orderType == 'takein'" @tap="router.go('/pages/store/list')">
              <view class="store-name">
                <text>{{ store.name }}</text>
                <view class="iconfont icon-arrow-right"></view>
              </view>
              <view class="store-location">
                <i class="iconfont icon-ditu_dingwei"></i>
                <text>距离您 {{ formatDistance(store.distance || 0) }}</text>
              </view>
            </view>
            <view class="left overflow-hidden" v-else>
              <!-- 外送 -->
              <view class="font-size-sm text-color-assist overflow-hidden text-truncate">
                由
                <text class="text-color-base" style="margin: 0 10rpx">{{ store.name }}</text>
                配送
              </view>
            </view>

            <view class="right">
              <view
                class="dinein"
                :class="{ active: orderType == 'takein' }"
                @tap="orderType = 'takein'"
              >
                <text>自取</text>
              </view>
              <view
                class="takeout"
                :class="{ active: orderType == 'takeout' }"
                @tap="handleTakeout"
              >
                <text>外送</text>
              </view>
            </view>
          </view>
          <view class="coupon" v-if="true">
            <text class="title">购券活动，赶紧去购买</text>
            <view class="iconfont icon-arrow-right"></view>
          </view>
        </view>
        <view class="content">
          <scroll-view class="menus" scroll-with-animation scroll-y>
            <!-- 左侧分类 -->
            <view class="wrapper">
              <view
                :id="`menu-${item.id}`"
                class="menu"
                :class="{ current: item.id === currentCateId }"
                v-for="(item, index) in menu"
                :key="index"
                @tap="handleMenuTap(item.id)"
              >
                <text>{{ item.name }}</text>
                <!-- 分类按钮旁将展示已选的商品的数量 -->
                <view class="dot" v-if="selectedMenuNum(item.id)">
                  {{ selectedMenuNum(item.id) }}
                </view>
              </view>
            </view>
          </scroll-view>
          <!-- goods list begin -->
          <scroll-view
            class="goods"
            scroll-with-animation
            scroll-y
            :scroll-top="cateScrollTop"
            @scroll="handleGoodsScroll"
          >
            <view class="wrapper">
              <swiper class="ads" id="ads" autoplay :interval="3000" indicator-dots circular>
                <swiper-item v-for="(item, index) in ads" :key="index">
                  <image :src="item.image"></image>
                </swiper-item>
              </swiper>
              <view class="list">
                <!-- 商品项，每一个商品项是由分类标签以及分类下的goodslist组成 begin -->
                <view
                  class="category"
                  v-for="(item, index) in menu"
                  :key="index"
                  :id="`cate-${item.id}`"
                >
                  <view class="title">
                    <text>{{ item.name }}</text>
                    <image :src="item.icon" class="icon"></image>
                  </view>
                  <view class="items">
                    <!-- 商品 begin -->
                    <view class="good" v-for="(good, key) in item.productList" :key="key">
                      <image
                        :src="good.externalUrl"
                        class="image"
                        @tap="showGoodDetailModal(good)"
                      ></image>
                      <view class="right">
                        <text class="name">{{ good.name }}</text>
                        <text class="tips">{{ good.content || '' }}</text>
                        <view class="price_and_action">
                          <text class="price">￥{{ good.retailPrice }}</text>
                          <!-- 选规格 -->
                          <view class="btn-group" v-if="good.use_property">
                            <button
                              type="primary"
                              class="btn property_btn"
                              hover-class="none"
                              @tap="showGoodDetailModal(good)"
                            >
                              选规格
                            </button>
                            <view class="dot" v-if="selectedGoodNum(good.id)">
                              {{ selectedGoodNum(good.id) }}
                            </view>
                          </view>
                          <!-- 减少按钮 -->
                          <view class="btn-group" v-else>
                            <button
                              type="default"
                              v-if="selectedGoodNum(good.id)"
                              plain
                              class="btn reduce_btn"
                              hover-class="none"
                              @tap="cartStore.reduceCart(item, good)"
                            >
                              <view class="iconfont icon-jianhao"></view>
                            </button>
                            <view class="number" v-if="selectedGoodNum(good.id)">
                              {{ selectedGoodNum(good.id) }}
                            </view>
                            <!-- 添加按钮 -->
                            <button
                              type="primary"
                              class="btn add_btn"
                              hover-class="none"
                              @tap="cartStore.addCart(good, 1)"
                            >
                              <view class="iconfont icon-jiahao"></view>
                            </button>
                          </view>
                        </view>
                      </view>
                    </view>
                    <!-- 商品 end -->
                  </view>
                </view>
                <!-- category end -->
              </view>
            </view>
          </scroll-view>
          <!-- goods list end -->
        </view>
        <!-- content end -->
        <!-- 购物车栏 begin -->
        <view class="cart-box" v-if="cartStore.cart.length > 0" @tap="openCartPopup">
          <view class="mark">
            <!-- <image src="/static/images/menu/cart.png" class="cart-img"></image> -->
            <i class="iconfont icon-gouwu"></i>
            <view class="tag">{{ cartStore.getCartGoodsNumber }}</view>
          </view>
          <view class="price">￥{{ cartStore.getCartGoodsPrice }}</view>
          <!-- 去结算按钮 -->
          <button type="primary" class="pay-btn" @tap.stop="toSettle" :disabled="disabledPay">
            {{ disabledPay ? `差${spread}元起送` : '去结算' }}
          </button>
        </view>
        <!-- 购物车栏 end -->
      </view>
      <good-modal v-model="showGoodModal" :data="good" />
      <cart-popup v-model="showCartPopup" />
    </view>
    <my-loading v-else />
  </view>
  <location-error v-else />
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import goodModal from './components/good-modal.vue'
import cartPopup from './components/cart-popup.vue'
import myLoading from '@/components/my-loading/my-loading.vue'
import { onShow } from '@dcloudio/uni-app'
import { useCartStore } from '@/stores/modules/cart'
import type { Goods, Menu, ModalGood } from '@/types/menu'
import type { Store } from '@/types/store'
import { formatDistance } from '@/utils/location'
import { useShopStore, useLocationStore } from '@/stores'
import * as ProductApi from '@/apis/product'
import * as ShopAPI from '@/apis/shop'
import router from '@/utils/router'

const shopStore = useShopStore()
const locationStore = useLocationStore()
const ads = [
  {
    image:
      'https://images.qmai.cn/s23107/2020/04/30/b3af19e0de8ed42f61.jpg?imageView2/2/w/600/h/600',
  },
  {
    image:
      'https://img-shop.qmimg.cn/s23107/2020/04/17/8aeb78516d63864420.jpg?imageView2/2/w/600/h/600',
  },
]
const loading = ref(false)
const currentCateId = ref<string>('')
const cateScrollTop = ref(0)
const showGoodModal = ref(false)
const showCartPopup = ref(false)
const good = ref<ModalGood>({} as ModalGood)
const sizeCalcState = ref(false)
const store = ref<Store>({} as Store)
const orderType = ref('takein')
const cartStore = useCartStore()
const menu = ref<Menu[]>([])
const isMenuTap = ref(false)
const location = ref({
  latitude: 39.9042,
  longitude: 116.4074,
})
const disabledPay = computed(() => {
  //TODO 是否满足起送金额
  return false
})
const spread = computed(() => {
  //TODO 差多少元起送
  return 0
})

onShow(async () => {
  loading.value = true
  try {
    const res = await locationStore.getLocation()
    if (res) {
      location.value = {
        latitude: res.latitude,
        longitude: res.longitude,
      }
    }
    //如果不存在选择的门店，则进行定位获取最近的一家
    if (shopStore.store) {
      store.value = shopStore.store
    } else {
      await getStoreData()
    }
    getProductList()
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
})
async function getStoreData() {
  const { data } = await ShopAPI.getNearbyStores({
    latitude: location.value.latitude,
    longitude: location.value.longitude,
    limit: 1,
  })
  store.value = data[0]
}
async function getProductList() {
  const { data } = await ProductApi.getProductList({
    shopId: store.value.id.toString(),
  })
  menu.value = data || []
  currentCateId.value = menu.value[0].id
}

// 商品项显示购物车数量
const selectedGoodNum = (id: string) => {
  return cartStore.cart.reduce((acc, cur) => {
    if (cur.id === id) {
      return acc + cur.number
    }
    return acc
  }, 0)
}

// 分类显示购物车数量
const selectedMenuNum = (cateId: string) => {
  return cartStore.cart.reduce((acc, cur) => {
    // TODO：当分类信息存入cartStore时，需要修改
    const category = menu.value.find((item) => item.productList.some((good) => good.id === cur.id))
    // 如果商品属于当前分类，累加数量
    if (category && category.id === cateId) {
      return acc + cur.number
    }
    return acc
  }, 0)
}

//点击分类跳转对应分类
const handleMenuTap = (id: string) => {
  if (!sizeCalcState.value) {
    calcHeight()
  }
  isMenuTap.value = true
  currentCateId.value = id
  nextTick(() => {
    cateScrollTop.value = menu.value.find((item) => item.id === id)!.top
  })
}

//滚动商品列表同步分类滚动
const handleGoodsScroll = ({ detail }: any) => {
  if (isMenuTap.value) {
    isMenuTap.value = false
    return
  }

  if (!sizeCalcState.value) {
    calcHeight()
  }
  const { scrollTop } = detail
  let tabs = menu.value.filter((item) => item.top <= scrollTop).reverse()
  if (tabs.length) {
    currentCateId.value = tabs[0].id
  }
}

const calcHeight = () => {
  let h = 10
  let view = uni.createSelectorQuery().select('#ads')
  view
    .fields(
      {
        size: true,
      },
      (data) => {
        const info = data as { height: number; width: number }
        h += Math.floor(info.height)
      },
    )
    .exec()
  menu.value.forEach((item) => {
    let view = uni.createSelectorQuery().select(`#cate-${item.id}`)
    view
      .fields(
        {
          size: true,
        },
        (data) => {
          const info = data as { height: number; width: number }
          item.top = h
          h += info.height
          item.bottom = h
        },
      )
      .exec()
  })
  sizeCalcState.value = true
}

const showGoodDetailModal = (g: Goods) => {
  good.value = JSON.parse(JSON.stringify({ ...g, number: 1 }))
  showGoodModal.value = true
}

const openCartPopup = () => {
  showCartPopup.value = !showCartPopup.value
}

const toSettle = () => {
  showCartPopup.value = false
  router.go('/pages/order/confirm', {
    shopId: store.value.id,
    shopName: store.value.name,
  })
}
const handleTakeout = () => {
  // orderType.value = 'takeout'
  uni.showToast({
    title: '敬请期待',
    icon: 'error',
    mask: true,
  })
}
</script>

<style lang="scss" scoped>
/* #ifdef H5 */
page {
  height: auto;
  min-height: 100%;
}
/* #endif */

.container {
  overflow: hidden;
  position: relative;
}

.stores {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-bottom: -40rpx;
  .store {
    width: 100%;
    background-color: $bg-color-grey;
    padding: 20rpx;
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;
    border-radius: 6rpx;

    .iconfont {
      font-size: 50rpx;
      margin-right: 15rpx;

      &.iconradio-button-off {
        color: $text-color-assist;
      }

      &.iconradio-button-on {
        color: $color-primary;
      }
    }

    .infos {
      flex: 1;
      display: flex;
      flex-direction: column;
      color: $text-color-base;
      overflow: hidden;

      .name_and_distance {
        width: 100%;
        display: flex;
        justify-content: space-between;
        margin-bottom: 10rpx;
        overflow: hidden;

        .name {
          flex: 1;
          flex-shrink: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: $font-size-lg;
        }

        .distance {
          flex-shrink: 0;
          font-size: $font-size-lg;
          font-weight: bold;
          margin-left: 20rpx;
        }
      }

      .street {
        color: $text-color-assist;
        font-size: $font-size-sm;
      }
    }
  }
}

.main {
  width: 100%;
  height: 100%;
  position: relative;
}

.nav {
  width: 100%;
  // height: 200rpx;
  display: flex;
  flex-direction: column;

  .header {
    width: 100%;
    height: 140rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20rpx;
    background-color: #ffffff;

    .left {
      flex: 1;
      display: flex;
      flex-direction: column;

      .store-name {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        font-size: $font-size-lg;
        margin-bottom: 10rpx;

        .iconfont {
          margin-left: 10rpx;
          line-height: 100%;
        }
      }

      .store-location {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        color: $text-color-assist;
        font-size: $font-size-sm;

        .iconfont {
          vertical-align: middle;
          display: table-cell;
          color: $color-primary;
          line-height: 100%;
        }
      }
    }

    .right {
      background-color: $bg-color-grey;
      border-radius: 38rpx;
      display: flex;
      align-items: center;
      font-size: $font-size-sm;
      padding: 0 38rpx;
      color: $text-color-assist;

      .dinein,
      .takeout {
        position: relative;
        display: flex;
        align-items: center;
        &.active {
          padding: 14rpx 38rpx;
          color: #ffffff;
          background-color: $color-primary;
          border-radius: 38rpx;
        }
      }

      .takeout {
        margin-left: 20rpx;
        height: 100%;
        flex: 1;
        padding: 14rpx 0;
      }

      .dinein.active {
        margin-left: -38rpx;
      }

      .takeout.active {
        margin-right: -38rpx;
      }
    }
  }

  .coupon {
    width: 100%;
    height: 40rpx;
    background-color: #ffffff;
    font-size: $font-size-sm;
    color: $color-primary;
    padding: 0 20rpx;
    display: flex;
    align-items: center;
    overflow: hidden;

    .title {
      flex: 1;
      margin-left: 10rpx;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .iconfont {
      line-height: 100%;
    }
  }
}

.content {
  width: 100%;
  height: calc(100vh - 180rpx);
  /* #ifdef H5 */
  height: calc(100vh - 180rpx - 188rpx);
  /* #endif */
  display: flex;

  .menus {
    width: 200rpx;
    height: 100%;
    overflow: hidden;
    background-color: $bg-color-grey;

    .wrapper {
      width: 100%;
      height: 100%;

      .menu {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        padding: 30rpx 20rpx;
        font-size: 26rpx;
        color: $text-color-assist;
        position: relative;

        &.current {
          background-color: #ffffff;
          color: $text-color-base;
        }

        .dot {
          position: absolute;
          width: 34rpx;
          height: 34rpx;
          line-height: 34rpx;
          font-size: 22rpx;
          background-color: $color-primary;
          color: #ffffff;
          top: 16rpx;
          right: 10rpx;
          border-radius: 100%;
          text-align: center;
        }
      }
    }
  }

  .goods {
    flex: 1;
    height: 100%;
    overflow: hidden;
    background-color: #ffffff;

    .wrapper {
      width: 100%;
      height: 100%;
      padding: 20rpx;

      &::after {
        content: '';
        display: block;
        height: 150rpx;
        width: 100%;
      }

      .ads {
        height: calc(300 / 550 * 510rpx);

        image {
          width: 100%;
          height: 100%;
          border-radius: 8rpx;
        }
      }

      .list {
        width: 100%;
        font-size: $font-size-base;

        .category {
          width: 100%;

          .title {
            padding: 30rpx 0;
            display: flex;
            align-items: center;
            color: $text-color-base;

            .icon {
              width: 38rpx;
              height: 38rpx;
              margin-left: 10rpx;
            }
          }
        }

        .items {
          display: flex;
          flex-direction: column;
          padding-bottom: -30rpx;

          .good {
            display: flex;
            align-items: center;
            margin-bottom: 30rpx;

            .image {
              width: 160rpx;
              height: 160rpx;
              margin-right: 20rpx;
              border-radius: 8rpx;
            }

            .right {
              flex: 1;
              height: 160rpx;
              overflow: hidden;
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              justify-content: space-between;
              padding-right: 14rpx;

              .name {
                font-size: $font-size-base;
                margin-bottom: 10rpx;
              }

              .tips {
                width: 100%;
                height: 40rpx;
                line-height: 40rpx;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-size: $font-size-sm;
                color: $text-color-assist;
                margin-bottom: 10rpx;
              }

              .price_and_action {
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: center;

                .price {
                  font-size: $font-size-base;
                  font-weight: 600;
                }

                .btn-group {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  position: relative;

                  .btn {
                    padding: 0 20rpx;
                    box-sizing: border-box;
                    font-size: $font-size-sm;
                    height: 44rpx;
                    line-height: 44rpx;

                    &.property_btn {
                      border-radius: 24rpx;
                    }

                    &.add_btn,
                    &.reduce_btn {
                      padding: 0;
                      width: 44rpx;
                      border-radius: 44rpx;
                    }
                  }

                  .dot {
                    position: absolute;
                    background-color: #ffffff;
                    border: 1px solid $color-primary;
                    color: $color-primary;
                    font-size: $font-size-sm;
                    width: 36rpx;
                    height: 36rpx;
                    line-height: 36rpx;
                    text-align: center;
                    border-radius: 100%;
                    right: -12rpx;
                    top: -10rpx;
                  }

                  .number {
                    width: 44rpx;
                    height: 44rpx;
                    line-height: 44rpx;
                    text-align: center;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

.modal-box {
  max-height: 90vh;
}

.cart-box {
  position: absolute;
  bottom: 30rpx;
  left: 30rpx;
  right: 30rpx;
  height: 96rpx;
  border-radius: 48rpx;
  box-shadow: 0 0 20rpx rgba(0, 0, 0, 0.2);
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 9999;

  .cart-img {
    width: 96rpx;
    height: 96rpx;
    position: relative;
    margin-top: -48rpx;
  }

  .pay-btn {
    height: 100%;
    padding: 0 30rpx;
    color: #ffffff;
    border-radius: 0 50rpx 50rpx 0;
    display: flex;
    align-items: center;
    font-size: $font-size-base;
  }

  .mark {
    padding-left: 46rpx;
    margin-right: 30rpx;
    position: relative;

    .iconfont {
      font-size: 80rpx;
      color: $color-primary;
    }

    .tag {
      background-color: $color-primary;
      color: $text-color-white;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: $font-size-sm;
      position: absolute;
      right: -20rpx;
      top: -20rpx;
      border-radius: 100%;
      padding: 4rpx;
      width: 40rpx;
      height: 40rpx;
      opacity: 0.9;
    }
  }

  .price {
    flex: 1;
    color: $text-color-base;
  }
}
</style>
