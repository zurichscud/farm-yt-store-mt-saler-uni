<template>
  <view class="container flex flex-col h-full">
    <image
      :src="member?.avatarId ? member?.avatarId : '/static/images/mine/default.png'"
      class="bg"
    ></image>
    <view class="flex-1 form">
      <list-cell :hover="false">
        <view class="form-input w-100 flex items-center">
          <view class="label">昵称</view>
          <view class="input flex-fill">
            <input
              type="text"
              placeholder="请填写昵称"
              placeholder-class="text-color-assist font-size-base"
              v-model="member.fullname"
            />
          </view>
        </view>
      </list-cell>
      <list-cell :hover="false">
        <view class="form-input w-100 flex items-center">
          <view class="label">手机号码</view>
          <view class="input flex-fill">
            <input type="text" v-model="member.phone" disabled />
          </view>
        </view>
      </list-cell>
      <list-cell :hover="false" :arrow="!member.birthday">
        <view class="form-input w-100 flex items-center">
          <view class="label">生日</view>
          <view class="input flex-fill">
            <picker
              disabled
              mode="date"
              :value="date"
              :start="startDate"
              :end="endDate"
              v-if="!member.birthday"
              @change="handleDateChange"
            >
              生日当天有惊喜
            </picker>
            <input type="text" v-else :value="member.birthday" disabled />
          </view>
        </view>
      </list-cell>
      <list-cell :hover="false" last>
        <view class="form-input w-100 flex items-center">
          <view class="label">入会时间</view>
          <view class="input flex-fill">
            <input type="text" v-model="member.crTime" disabled />
          </view>
        </view>
      </list-cell>
    </view>

    <view class="w-full mt-auto space-y-1">
      <wd-button :disabled="true" class="w-full" @click="saveSettings">保存</wd-button>
      <wd-button class="w-full" @click="logout">退出登录</wd-button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import listCell from '@/components/list-cell/list-cell'
import { useMemberStore } from '@/stores'
import { storeToRefs } from 'pinia'
const memberStore = useMemberStore()
const { member } = storeToRefs(memberStore)
const getDate = (type) => {
  const date = new Date()
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()

  if (type === 'start') {
    year = year - 60
  } else if (type === 'end') {
    year = year + 2
  }
  month = month > 9 ? month : '0' + month
  day = day > 9 ? day : '0' + day
  return `${year}-${month}-${day}`
}

const handleDateChange = (e) => {
  member.value.birthday = e.target.value
}

const currentDate = getDate({ format: true })
const date = ref(currentDate)

const startDate = computed(() => getDate('start'))
const endDate = computed(() => getDate('end'))

const saveSettings = () => {
  // 保存设置的逻辑
  uni.showToast({
    title: '保存成功',
    icon: 'success',
    duration: 1500,
  })
}

const logout = () => {
  uni.showModal({
    title: '确定退出登录？',
    content: '退出后将无法查看订单相关信息',
    success: (res) => {
      if (res.confirm) {
        memberStore.clearMember()
        uni.showToast({
          title: '退出成功',
          icon: 'success',
          duration: 1500,
          success: () => {
            uni.switchTab({
              url: '/pages/index/index',
            })
          },
        })
      }
    },
  })
}

onMounted(() => {})
</script>

<style lang="scss" scoped>
page {
  height: 100%;
}

:deep(.wd-button) {
  width: 100%;
}

.container {
  padding: 20rpx 30rpx;
  min-height: 100vh;
}

.form {
  border-radius: 8rpx;
}

.form-input {
  .label {
    width: 160rpx;
    font-size: $font-size-base;
    color: $text-color-base;
  }

  .radio-group {
    display: flex;
    justify-content: flex-start;

    .radio {
      padding: 10rpx 30rpx;
      border-radius: 6rpx;
      border: 2rpx solid $text-color-assist;
      color: $text-color-assist;
      font-size: $font-size-base;

      &.checked {
        background-color: $color-primary;
        color: $text-color-white;
        border: 2rpx solid $color-primary;
      }
    }
  }
}

.bg {
  width: 200rpx;
  height: 200rpx;
  object-fit: contain;
  border-radius: 50%;
  margin: 20rpx auto;
}
</style>
