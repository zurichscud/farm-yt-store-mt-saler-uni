<!-- 首页 -->
<script lang="ts" setup>
import { ref } from 'vue'
import { useMemberStore } from '@/stores'
import router from '@/utils/router'

const memberStore = useMemberStore()
const currDot = ref(0)
const dotsStyles = ref({
  backgroundColor: 'rgba(0, 0, 0, .3)',
  border: '1px rgba(0, 0, 0, .3) solid',
  color: '#fff',
  selectedBackgroundColor: '#fff',
  selectedBorder: '1px #fff solid',
})
const info = ref([
  {
    colorClass: 'uni-bg-red',
    url: 'https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/shuijiao.jpg',
    content: '内容 A',
  },
  {
    colorClass: 'uni-bg-green',
    url: 'https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/shuijiao.jpg',
    content: '内容 B',
  },
  {
    colorClass: 'uni-bg-blue',
    url: 'https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/shuijiao.jpg',
    content: '内容 C',
  },
])
const dev = () => {
  uni.showToast({
    title: '敬请期待',
    icon: 'error',
  })
}

//自取
function takein() {
  router.go('/pages/menu/menu')
}

//外送
function takeout() {
  dev()
}

function toMyCoupon() {
  router.go('/pages/coupon/list', {
    tabIndex: 1,
  })
}

function toTakeCoupon() {
  router.go('/pages/coupon/list', {
    tabIndex: 0,
  })
}

const toGroup = () => {
  dev()
}

function toMemberCode() {
  router.go('/pages/member/member-code')
}

function changeSwiper(e: any) {
  currDot.value = e.detail.current
}
</script>

<template>
  <view class="container">
    <view class="banner">
      <image class="bg" src="https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/shuijiao.jpg"></image>
      <view class="intro">
        <view class="greet">
          您好，{{ memberStore.isLogin ? memberStore.getMemberInfo('fullname') : '游客' }}
        </view>
        <view class="note">欢迎光临肴小六</view>
      </view>
    </view>
    <view class="content">
      <view class="entrance">
        <view class="item" @tap="takein">
          <image src="/static/images/index/zq.png" class="icon"></image>
          <view class="title">自取</view>
        </view>
        <view class="item" @tap="takeout">
          <image src="/static/images/index/wm.png" class="icon"></image>
          <view class="title">外送</view>
        </view>
      </view>
      <!-- 我的积分 -->
      <view class="info">
        <view class="integral_section" @tap="dev">
          <view class="top">
            <text class="title">我的积分</text>
            <text class="value">{{ memberStore.isLogin ? memberStore.member?.score : '***' }}</text>
          </view>
          <view class="bottom">
            进入积分商城兑换肴小六券及周边好礼
            <view class="iconfont icon-arrow-right"></view>
          </view>
        </view>
        <view class="qrcode_section" @tap="toMemberCode">
          <image src="/static/images/index/qrcode.png"></image>
          <text>会员码</text>
        </view>
      </view>
      <!-- 功能导航 -->
      <view class="navigators">
        <!-- 领券中心 -->
        <view class="left" @tap="toTakeCoupon">
          <view class="grid flex-col justify-center">
            <view class="flex items-center">
              <image src="/static/images/index/csc.png" class="mark-img"></image>
              <view class="font-size-sm text-color-base">领劵中心</view>
            </view>
            <view class="text-color-assist" style="margin-left: 40rpx; font-size: 20rpx">
              天天领券
            </view>
          </view>
          <view class="grid justify-content-end items-end">
            <image src="/static/images/index/yzclh.png" class="yzclh-img" mode="heightFix"></image>
          </view>
        </view>
        <view class="right">
          <view class="tea-activity" @tap="toGroup">
            <image src="/static/images/index/mcsb.png" class="mark-img"></image>
            <view>加入社群</view>
            <view class="right-img">
              <image src="/static/images/index/mcsb_bg.png" mode="widthFix"></image>
            </view>
          </view>
          <view class="member-gifts" @tap="toMyCoupon">
            <image src="/static/images/index/hyjb.png" class="mark-img"></image>
            <view>会员劵包</view>
            <view class="right-img">
              <image src="/static/images/index/hyjb_bg.png" mode="widthFix"></image>
            </view>
          </view>
        </view>
      </view>
      <view class="member-news">
        <view class="header">
          <view class="title">会员新鲜事</view>
          <view class="iconfont icon-arrow-right-circle"></view>
        </view>
        <uni-swiper-dot
          class="uni-swiper-dot-box"
          :info="info"
          :current="currDot"
          mode="default"
          :dotsStyles="dotsStyles"
        >
          <swiper class="list" :autoplay="true" @change="changeSwiper" :circular="true">
            <swiper-item class="item" v-for="(item, index) in info" :key="index">
              <!-- 690*250 -->
              <image :src="item.url"></image>
            </swiper-item>
          </swiper>
        </uni-swiper-dot>
      </view>
    </view>
  </view>
</template>

<style lang="scss">
/* #ifdef H5 */
page {
  height: auto;
  min-height: 100%;
}
/* #endif */

.banner {
  position: relative;
  width: 100%;
  height: 600rpx;

  .bg {
    width: 100%;
    height: 600rpx;
  }

  .intro {
    position: absolute;
    top: calc(50rpx + var(--status-bar-height));
    left: 40rpx;
    color: #ffffff;
    display: flex;
    flex-direction: column;

    .greet {
      font-size: $font-size-lg;
      margin-bottom: 10rpx;
    }

    .note {
      font-size: $font-size-sm;
    }
  }
}

.content {
  padding: 0 30rpx;
}

.entrance {
  position: relative;
  margin-top: -80rpx;
  margin-bottom: 30rpx;
  border-radius: 10rpx;
  background-color: #ffffff;
  box-shadow: $box-shadow;
  padding: 30rpx 0;
  display: flex;
  align-items: center;
  justify-content: center;

  .item {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;

    &:nth-child(1):after {
      content: '';
      position: absolute;
      width: 1rpx;
      background-color: $text-color-assist;
      right: 0;
      height: 100%;
      transform: scaleX(0.5) scaleY(0.8);
    }

    .icon {
      width: 84rpx;
      height: 84rpx;
      margin: 20rpx;
    }

    .title {
      font-size: 30rpx;
      color: $text-color-base;
      font-weight: 600;
    }
  }
}

.info {
  position: relative;
  margin-bottom: 30rpx;
  border-radius: 10rpx;
  background-color: #ffffff;
  box-shadow: $box-shadow;
  padding: 30rpx;
  display: flex;
  align-items: center;
  justify-content: center;

  .integral_section {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .top {
      display: flex;
      align-items: center;

      .title {
        color: $text-color-base;
        font-size: $font-size-base;
        margin-right: 10rpx;
      }
      .value {
        font-size: 44rpx;
        font-weight: bold;
      }
    }

    .bottom {
      font-size: $font-size-sm;
      color: $text-color-assist;
      display: flex;
      align-items: center;
    }
  }

  .qrcode_section {
    color: $color-primary;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: $font-size-sm;

    image {
      width: 50rpx;
      height: 50rpx;
      margin-bottom: 10rpx;
    }
  }
}

.navigators {
  width: 100%;
  margin-bottom: 20rpx;
  border-radius: 10rpx;
  background-color: #ffffff;
  box-shadow: $box-shadow;
  padding: 20rpx;
  display: flex;
  align-items: stretch;

  .left {
    width: 340rpx;
    margin-right: 20rpx;
    display: flex;
    padding: 0 20rpx;
    flex-direction: column;
    font-size: $font-size-sm;
    color: $text-color-base;
    background-color: #f2f2e6;

    .grid {
      height: 50%;
      display: flex;
    }
  }

  .right {
    width: 290rpx;
    display: flex;
    flex-direction: column;

    .tea-activity,
    .member-gifts {
      width: 100%;
      display: flex;
      padding: 20rpx;
      font-size: $font-size-sm;
      color: $text-color-base;
      align-items: center;
      position: relative;
    }

    .tea-activity {
      background-color: #fdf3f2;
      margin-bottom: 20rpx;
    }

    .member-gifts {
      background-color: #fcf6d4;
    }

    .right-img {
      flex: 1;
      position: relative;
      margin-left: 20rpx;
      margin-right: -20rpx;
      margin-bottom: -20rpx;
      display: flex;
      align-items: flex-end;

      image {
        width: 100%;
      }
    }
  }

  .mark-img {
    width: 30rpx;
    height: 30rpx;
    margin-right: 10rpx;
  }

  .yzclh-img {
    height: 122.96rpx;
    width: calc(173 / 99 * 122.96rpx);
  }
}

.member-news {
  width: 100%;
  margin-bottom: 30rpx;
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20rpx 0;

    .title {
      font-size: $font-size-lg;
      font-weight: bold;
    }

    .iconfont {
      font-size: 50rpx;
      color: $text-color-assist;
    }
  }

  .list {
    width: 100%;
    display: flex;
    flex-direction: column;

    .item {
      width: 100%;
      height: 240rpx;
      position: relative;

      image {
        width: 100%;
        height: 100%;
        border-radius: 8rpx;
      }

      .title {
        position: relative;
        font-size: 32rpx;
        font-weight: 500;
        width: 100%;
        top: -70rpx;
        left: 16rpx;
        color: #ffffff;
      }
    }
  }
}
</style>
