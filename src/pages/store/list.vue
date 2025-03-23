<template>
  <view class="container" v-if="locationStore.locationAuth">
    <view>
      <view>
        <map class="map" :latitude="location.latitude" :longitude="location.longitude"></map>
      </view>
    </view>
    <view class="scroll" v-if="!loading">
      <scroll-view class="list" scroll-with-animation scroll-y>
        <view class="wrapper">
          <wd-card v-for="item in stores" :key="item.name" @tap="handleStoreSelect(item)">
            <template #title>
              <view class="card-title">
                <view class="title">{{ item.name }}</view>
                <view class="distance">距离{{ formatDistance(item.distance as number) }}</view>
              </view>
            </template>
            <template #default>
              <view class="content">
                <view class="left">
                  <view>{{ item.address }}</view>
                  <view>10:00-22:00</view>
                  <!-- <wd-tag type="primary" bg-color="#9e2224">可外送</wd-tag> -->
                  <wd-tag type="primary" bg-color="#9e2224">
                    {{ getStatusFormat(item.status) }}
                  </wd-tag>
                </view>
                <view class="right">
                  <image
                    class="img"
                    src="/static/images/takeout/电话.png"
                    @tap.stop="handlePhoneCall(item.mobile)"
                  />
                  <image class="img" src="/static/images/takeout/导航.png" />
                </view>
              </view>
            </template>
          </wd-card>
        </view>
      </scroll-view>
    </view>
    <my-loading v-else />
  </view>
  <view v-else>
    <location-error />
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onShow, onLoad } from '@dcloudio/uni-app'
import { formatDistance } from '@/utils/location'
import type { Store } from '@/types/store'
import { useShopStore, useLocationStore } from '@/stores'
import * as ShopAPI from '@/apis/shop'
import router from '@/utils/router'
import locationError from './components/location-error'

const locationStore = useLocationStore()
const shopStore = useShopStore()
const loading = ref(true)
const location = ref({
  latitude: 39.9042,
  longitude: 116.4074,
})
const stores = ref<Store[]>([])
onShow(async () => {
  const res = await locationStore.getLocation()
  if (res) {
    location.value = {
      latitude: res!.latitude,
      longitude: res!.longitude,
    }
  }
  const { data } = await ShopAPI.getNearbyStores({
    latitude: location.value.latitude,
    longitude: location.value.longitude,
    limit: 10,
  })
  if (data) {
    stores.value = data
  }

  loading.value = false
})
onLoad(async () => {})

const handlePhoneCall = (mobile: string) => {
  uni.makePhoneCall({
    phoneNumber: mobile,
  })
}
const getStatusFormat = (status: number) => {
  switch (status) {
    case 1:
      return '待营业'
    case 2:
      return '营业中'
    case 3:
      return '歇业'
    default:
      return '停业'
  }
}
const handleStoreSelect = (store: Store) => {
  shopStore.setStore(store)
  router.go('/pages/menu/menu')
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
  height: 100vh;

  .map {
    width: 100%;
    height: 500rpx;
    margin-bottom: 20rpx;
  }

  .list {
    width: 100%;
    height: calc(100vh - 520rpx);
    overflow: hidden;

    .wrapper {
      height: 100%;
      width: 100%;

      &::after {
        content: '';
        display: block;
        height: 150rpx;
        width: 100%;
      }

      .tip {
        font-size: $font-size-sm;
        color: $text-color-assist;
        line-height: $font-size-base;
        margin: 10rpx 30rpx;
      }

      .wd-card {
        .card-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .title {
            font-size: $font-size-lg;
          }
          .distance {
            font-size: $font-size-sm;
            color: $text-color-assist;
          }
        }

        .content {
          font-size: $font-size-sm;
          color: $text-color-base;
          line-height: $font-size-lg;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10rpx 0;
          .left {
            :deep(.wd-tag) {
              margin-right: 10rpx;
            }
          }

          .right {
            display: flex;
            gap: 20rpx;
          }
        }
      }
      .img {
        height: 50rpx;
        width: 50rpx;
      }
      :deep(.wd-card__footer) {
        padding: 10rpx 0;
      }
    }
  }
}
</style>
