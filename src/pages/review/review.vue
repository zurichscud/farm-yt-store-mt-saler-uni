<script lang="ts" setup>
import listCell from '@/components/list-cell/list-cell'
import rateFormItem from './rate-form-item'
import { ref, reactive } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const form = reactive({
  score_service: 0,
  score_order: 0,
  score_speed: 0,
  score_product: 0,
  score_enviroment: 0,
  opinion: '',
})
const storename = ref('')
const typeCate = ref(1)
const date = ref('')
onLoad((options) => {
  storename.value = options.storename
  typeCate.value = options.typeCate
  date.value = options.date
})
const submit = async () => {
  if (!form.score_service || form.score_order || form.score_speed || form.score_product || form.score_enviroment) {
    uni.showToast({
      title: '请先选择评论内容',
      icon: 'none',
    })
    return
  }
  let stars = form.score_service + ',' + form.score_order + ',' + form.score_speed + ',' + form.score_product + ',' + form.score_enviroment
  let params = { storeId: 1, memo: form.opinion, pic: stars, star: form.score_service }
  let groupHotGoodsList = await Api.apiCall('post', Api.member.addStoreComment, params)
  uni.showToast({
    title: '提交成功',
  })
  uni.navigateBack()
}
</script>

<template>
  <view class="container">
    <view class="content">
      <list-cell last class="mb-20" :hover="false">
        <view class="w-100 d-flex justify-content-between align-items-center">
          <view class="font-size-lg text-color-base flex-fill">{{ storename }}</view>
          <view class="font-size-base text-color-assist mr-10">{{ date }}</view>
          <view class="font-size-base text-color-assist">{{ typeCate === 1 ? '堂食' : '自提' }}</view>
        </view>
      </list-cell>
      <view class="review-form">
        <view class="review-rate-form mb-20">
          <rate-form-item v-model:modelValue="form.score_service" label="服务"
                          tips="能感受到良好的服务态度吗？"></rate-form-item>
          <rate-form-item v-model:modelValue="form.score_order" label="点单"
                          tips="点单有恰当的介绍，快速准确地下单吗？"></rate-form-item>
          <rate-form-item v-model:modelValue="form.score_speed" label="速度"
                          tips="出品的速度您认为可接受吗？"></rate-form-item>
          <rate-form-item v-model:modelValue="form.score_product" label="产品"
                          tips="您享用的茶饮或面包，如您所期待吗？"></rate-form-item>
          <rate-form-item v-model:modelValue="form.score_enviroment" label="环境"
                          tips="门店环境和清洁卫生，您满意吗？"></rate-form-item>
        </view>
        <view class="review-textarea-form">
					<textarea v-model="form.opinion" placeholder="如果您有什么意见和建议,请告诉我们,我们会认真聆听"
                    placeholder-class="font-size-sm text-color-assist" />
          <view class="text-right font-size-sm text-color-assist">{{ form.opinion.length }}/500</view>
        </view>
      </view>
    </view>
    <view class="btn-box">
      <button type="primary" @tap="submit">提交评论</button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.content {
  padding-bottom: 120rpx;
}

.btn-box {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 120rpx;
  background-color: #FFFFFF;
  padding: 20rpx 0;
  display: flex;
  justify-content: center;

  button {
    width: 90%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50rem !important;
  }
}

.review-form {
  background-color: #FFFFFF;
  padding: 20rpx 0;
}

.review-textarea-form {
  padding: 0 30rpx;

  textarea {
    width: 100%;
    background-color: $bg-color;
    padding: 30rpx;
    font-size: $font-size-sm;
    color: $font-size-base;
  }
}
</style>
