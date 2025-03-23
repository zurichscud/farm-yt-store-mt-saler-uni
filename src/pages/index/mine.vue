<script lang="ts" setup>
import { useMemberStore } from '@/stores'
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import router from '@/utils/router'

const growthValue = ref(0)
const memberStore = useMemberStore()
const { isLogin } = storeToRefs(memberStore)
const memberCode = () => {
  router.go('/pages/member/member-code')
}
const login = () => {
  router.go('/pages/index/login')
}
const coupons = () => {}
const userinfo = () => {
  router.go('/pages/member/settings')
}
function integrals() {}
</script>

<template>
  <view class="container">
    <!-- 会员背景 -->
    <view class="relative">
      <view class="bg"></view>
      <button type="default" size="mini" class="hym-btn" @tap="memberCode" v-if="isLogin">
        <image src="/static/images/mine/hym.png"></image>
        <text>会员码</text>
      </button>
    </view>
    <!-- 会员信息 -->
    <view class="px-2">
      <view class="flex flex-col bg-white user-box">
        <view class="flex items-center">
          <view class="avatar" @tap="router.go('/pages/member/settings')">
            <image
              :src="
                memberStore.isLogin
                  ? '/static/images/mine/default.png'
                  : '/static/images/mine/default.png'
              "
            ></image>
            <view class="badge" v-if="memberStore.isLogin">
              <image src="/static/images/mine/level.png"></image>
              <view>1</view>
            </view>
          </view>
          <view class="flex flex-col flex-fill" style="margin-top: 20rpx">
            <view
              v-if="isLogin"
              class="font-size-lg font-weight-bold flex justify-start items-center"
              @tap="userinfo"
            >
              <view>{{ memberStore.getMemberInfo('fullname') }}</view>
              <view class="iconfont icon-arrow-right line-height-100"></view>
            </view>
            <view
              v-else
              class="font-size-lg font-weight-bold"
              @tap="router.go('/pages/index/login')"
            >
              请点击授权登录
            </view>
            <view class="font-size-sm text-color-assist">当前积分 0/0</view>
            <view class="w-100">
              <progress
                activeColor="#ADB838"
                height="8rpx"
                :percent="growthValue"
                border-radius="8rpx"
              />
            </view>
          </view>
          <view
            class="level-benefit flex items-center justify-content-end text-color-white bg-warning font-size-sm"
          >
            <view>会员权益</view>
            <view class="iconfont icon-arrow-right line-height-100"></view>
          </view>
        </view>
        <view class="w-100 flex items-center justify-center">
          <view class="user-grid" @tap="coupons">
            <view class="value font-size-extra-lg font-weight-bold text-color-base">
              {{ isLogin ? 0 : '***' }}
            </view>
            <view class="font-size-sm text-color-assist">优惠劵</view>
          </view>
          <view class="user-grid" @tap="integrals">
            <view class="value font-size-extra-lg font-weight-bold text-color-base">
              {{ isLogin ? 0 : '***' }}
            </view>
            <view class="font-size-sm text-color-assist">积分商城</view>
          </view>
          <view class="user-grid">
            <view class="value font-size-extra-lg font-weight-bold text-color-base">
              {{ isLogin ? 0 : '***' }}
            </view>
            <view class="font-size-sm text-color-assist">余额</view>
          </view>
          <view class="user-grid">
            <view class="value font-size-extra-lg font-weight-bold text-color-base">
              {{ isLogin ? 0 : '***' }}
            </view>
            <view class="font-size-sm text-color-assist">礼品卡</view>
          </view>
        </view>
      </view>
      <view class="level-benefit-box" v-if="!isLogin">
        <view class="flex items-center justify-content-between font-size-base">
          <view class="text-color-base">新用户加入会员，享会员权益</view>
          <view class="text-color-primary" @tap="router.go('/pages/index/login')">立即加入</view>
        </view>
        <view class="row">
          <view class="grid">
            <image src="/static/images/mine/rhyl.png"></image>
            <view>入会有礼</view>
          </view>
          <view class="grid">
            <image src="/static/images/mine/jfdh.png"></image>
            <view>积分兑换</view>
          </view>
          <view class="grid">
            <image src="/static/images/mine/sjtq.png"></image>
            <view>升级特权</view>
          </view>
          <view class="grid">
            <image src="/static/images/mine/nxbz.png"></image>
            <view>会员优惠</view>
          </view>
        </view>
      </view>
      <!-- 我的服务 -->
      <view class="service-box">
        <view class="font-size-lg text-color-base font-weight-bold" style="margin-bottom: 20rpx">
          我的服务
        </view>
        <view class="row">
          <view class="grid">
            <image src="/static/images/mine/jfqd.png"></image>
            <view>积分签到</view>
          </view>
          <view class="grid">
            <image src="/static/images/mine/nxsc.png"></image>
            <view>小六商城</view>
          </view>
          <view class="grid">
            <image src="/static/images/mine/lxkf.png"></image>
            <view>联系客服</view>
          </view>
          <view class="grid" @tap="router.go('/pages/pay/pay-result')">
            <image src="/static/images/mine/gdfw.png"></image>
            <view>更多服务</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
page {
  height: auto;
  min-height: 100%;
}

.bg {
  width: 100%;
  height: 300rpx;
  background-image: linear-gradient(
    to right,
    #ff8177 0%,
    #ff867a 0%,
    #ff8c7f 21%,
    #f99185 52%,
    #cf556c 78%,
    #b12a5b 100%
  );
}

.hym-btn {
  position: absolute;
  top: 40rpx;
  right: 40rpx;
  color: $color-primary;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50rem;
  font-size: $font-size-sm;
  box-shadow: 0 0 20rpx rgba(66, 66, 66, 0.1);

  &::after {
    border: 0;
  }

  image {
    width: 30rpx;
    height: 30rpx;
    margin-right: 10rpx;
  }
}

.user-box {
  position: relative;
  border-radius: 8rpx;
  margin-bottom: 30rpx;
  margin-top: -115rpx;
  box-shadow: $box-shadow;
}

.avatar {
  position: relative;
  margin-top: -35rpx;
  margin-left: 35rpx;
  margin-right: 35rpx;
  width: 160rpx;
  height: 160rpx;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  box-shadow: 0 0 20rpx rgba($color: #000000, $alpha: 0.2);

  image {
    width: 140rpx;
    height: 140rpx;
    border-radius: 100%;
  }

  .badge {
    position: absolute;
    right: -10rpx;
    bottom: -10rpx;
    background-color: #ffffff;
    border-radius: 50rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $color-warning;
    font-size: 24rpx;
    padding: 8rpx 16rpx;
    box-shadow: 0 0 20rpx rgba($color: #000000, $alpha: 0.2);

    image {
      width: 30rpx;
      height: 30rpx;
    }
  }
}

.level-benefit {
  margin-left: 35rpx;
  padding: 10rpx 0 10rpx 30rpx;
  border-radius: 50rem 0 0 50rem;
}

.user-grid {
  width: 25%;
  padding: 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .value {
    margin-bottom: 20rpx;
  }
}

.level-benefit-box {
  border-radius: 8rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 10rpx 8rpx rgba($color: #878889, $alpha: 0.1);
  width: 100%;
  display: flex;
  padding: 30rpx;
  flex-direction: column;
  background-color: #ffffff;

  .row {
    display: flex;
    padding: 30rpx 0 20rpx;
    justify-content: space-around;
    align-items: center;

    .grid {
      width: 20%;
      display: flex;
      flex-direction: column;
      font-size: $font-size-sm;
      color: $text-color-assist;
      align-items: center;

      image {
        width: 80rpx;
        height: 80rpx;
        margin-bottom: 10rpx;
      }
    }
  }
}

.banner {
  width: 100%;
  border-radius: 8rpx;
  margin-bottom: 30rpx;
}

.service-box {
  width: 100%;
  background-color: #ffffff;
  padding: 32rpx 30rpx 10rpx;
  box-shadow: $box-shadow;

  .row {
    display: flex;
    flex-wrap: wrap;
    color: $text-color-base;
    font-size: $font-size-base;
    padding-bottom: -40rpx;

    .grid {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-bottom: 40rpx;
      width: 25%;

      image {
        width: 80rpx;
        height: 80rpx;
        margin-bottom: 20rpx;
      }
    }
  }
}
</style>
