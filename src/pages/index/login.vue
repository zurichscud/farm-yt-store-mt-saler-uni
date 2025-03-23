<!-- 登录 -->
<script lang="ts" setup>
import { onLoad } from '@dcloudio/uni-app'
import { Api } from '@/utils/api'
import type { LoginRes } from '@/types/member'
import { useMemberStore } from '@/stores/modules/member'
import { ref } from 'vue'
import router from '@/utils/router'
import * as MemberApi from '@/apis/member'
const memberStore = useMemberStore()
const loading = ref(false)

const weixinLogin = async (phoneCode?: string) => {
  // loading.value = true
  const { code } = await uni.login()
  const { data } = await MemberApi.weixinLogin({
    loginCode: code,
    phoneCode,
  })
  if (data) {
    data.user.tokenAccess = data.tokenAccess
    data.user.tokenRefresh = data.tokenRefresh
    memberStore.setMember(data.user)
    setTimeout(() => {
      router.back()
    }, 1000)
  }
}

const getPhoneNumber: UniHelper.ButtonOnGetphonenumber = ({ detail }) => {
  weixinLogin(detail.code)
}

async function quickLogin() {
  loading.value = true
  try {
    const res = await Api.apiCall<LoginRes>('GET', Api.member.h5Login, {
      phone: '18065908868',
    })
    if (res) {
      uni.setStorageSync('tokenAccess', res.tokenAccess)
      uni.setStorageSync('tokenRefresh', res.tokenRefresh)
      memberStore.setMember(res.user)
      uni.navigateBack({
        success() {
          uni.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 1000,
          })
        },
      })
    }
  } catch (error) {
    uni.showToast({
      title: '登录失败',
      icon: 'error',
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <view class="container">
    <view class="intro">
      <wd-img :width="100" :height="100" round src="/static/images/mine/default.png" />
      <view class="tips">
        肴小六，好猪肉
        <br />
        在肴小六吃肉
      </view>
    </view>
    <view class="bottom">
      <!-- #ifdef H5 -->
      <button class="login-btn" size="default" type="primary" @tap="quickLogin">登录</button>
      <!-- #endif -->
      <!-- #ifdef MP-WEIXIN -->
      <button
        class="h-10 w-full flex justify-center items-center py-2 rounded-3xl"
        lang="zh_CN"
        type="primary"
        open-type="getPhoneNumber"
        @getphonenumber="getPhoneNumber"
        :loading="loading"
      >
        手机号一键登录
      </button>
      <!-- #endif -->
      <view
        class="flex flex-col justify-evenly align-items-center text-center"
        style="height: 30vh"
      >
        <view class="w-100 font-size-base text-color-assist">新用户登录即加入会员，享会员权益</view>
        <view
          class="w-full row d-flex just-content-around align-items-center font-size-sm text-color-assist"
        >
          <view class="w-1/5 flex flex-col justify-center align-items-center">
            <image src="/static/images/mine/rhyl.png"></image>
            <view>入会有礼</view>
          </view>
          <view class="w-1/5 flex flex-col justify-center align-items-center">
            <image src="/static/images/mine/jfdh.png"></image>
            <view>积分兑换</view>
          </view>
          <view class="w-1/5 flex flex-col justify-center align-items-center">
            <image src="/static/images/mine/sjtq.png"></image>
            <view>升级特权</view>
          </view>
          <view class="w-1/5 flex flex-col justify-center align-items-center">
            <image src="/static/images/mine/nxbz.png"></image>
            <view>会员优惠</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss">
.intro {
  width: 100%;
  height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  font-size: $font-size-base;
  color: $text-color-assist;

  image {
    width: 165rpx;
    height: 165rpx;
  }

  .tips {
    line-height: 72rpx;
    text-align: center;
  }
}

.bottom {
  height: 40vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0 40rpx;

  .login-btn {
    width: 100%;
    border-radius: 50rem !important;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10rpx 0;

    image {
      width: 36rpx;
      height: 30rpx;
      margin-right: 10rpx;
    }
  }

  .row {
    image {
      width: 60rpx;
      height: 60rpx;
      margin-bottom: 10rpx;
    }
  }
}
</style>
