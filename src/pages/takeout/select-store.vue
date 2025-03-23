<template>
  <view class="container" v-if="authStore.locationAuth">
    <!-- 导航 -->
    <view class="nav">
      <wd-cell
        title="收货地址"
        icon="location"
        title-width="200px"
        is-link
        to="/pages/index/index"
        style="padding: 0"
      >
        <template #label>
          <view class="label">胜利路</view>
          <view class="label">张飞（先生） 18065908868</view>
        </template>
      </wd-cell>
    </view>
    <view class="scroll" v-if="!loading">
      <scroll-view class="list" scroll-with-animation scroll-y>
        <view class="tip">收货地址附近可供配送的门店</view>
        <wd-card v-for="item in storeList" :key="item.name">
          <template #title>
            <view class="card-title">
              <view class="title">{{ item.name }}</view>
              <view class="distance">距离{{ item.distance }}</view>
            </view>
          </template>
          <template #default>
            <view class="content">
              <view class="left">
                <view>福建省三明市三元桥9号606</view>
                <view>10:00-22:00</view>
                <wd-tag type="primary" bg-color="#9e2224">可外送</wd-tag>
                <wd-tag type="primary" bg-color="#9e2224">营业中</wd-tag>
              </view>
              <view class="right">
                <image class="img" src="/static/images/takeout/电话.png" @tap="handlePhoneCall" />
                <image class="img" src="/static/images/takeout/导航.png" />
              </view>
            </view>
          </template>
        </wd-card>
      </scroll-view>
    </view>
    <loading v-else />
  </view>
  <view v-else>
    <location-error />
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { calculateDistance } from '@/utils/location'
import Loading from '@/components/loading/loading.vue'
const loading = ref(true)
// 示例：计算北京天安门（39.9042° N, 116.4074° E）到上海东方明珠（31.2397° N, 121.4998° E）的距离
// const distance = calculateDistance(39.9042, 116.4074, 31.2397, 121.4998);
const location = ref({
  latitude: 39.9042,
  longitude: 116.4074,
})
const stores = [
  {
    name: '肴小六北京天安门',
    latitude: 39.9042,
    longitude: 116.4074,
  },
  {
    name: '肴小六上海东方明珠',
    latitude: 31.2397,
    longitude: 121.4998,
  },
]
onLoad(async () => {})

const storeList = computed(() => {
  return stores
    .map((store) => ({
      ...store,
      distance: calculateDistance(
        location.value.latitude,
        location.value.longitude,
        store.latitude,
        store.longitude,
        false,
      ),
    }))
    .sort((a, b) => (a.distance as number) - (b.distance as number))
    .map((store) => ({
      ...store,
      distance: calculateDistance(
        location.value.latitude,
        location.value.longitude,
        store.latitude,
        store.longitude,
        true,
      ),
    }))
})
const handlePhoneCall = () => {
  uni.makePhoneCall({
    phoneNumber: '18065908868',
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
  height: 100vh;

  .nav {
    width: 100%;
    height: 150rpx;
    background-color: #ffffff;
    .label {
      font-size: $font-size-sm;
      color: $text-color-assist;
      line-height: $font-size-lg;
    }
  }

  .scroll {
    width: 100%;
    height: calc(100vh - 150rpx);
    overflow: hidden;

    .list {
      height: 100%;

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
