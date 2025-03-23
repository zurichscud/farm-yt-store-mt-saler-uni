<template>
  <view class="coupon" :style="{ opacity: disabled ? '0.5' : '1' }">
    <view class="coupon__content w-100">
      <view
        class="coupon__tag flex items-center justify-center"
        :class="{ 'disabled-bg-color': isDisable }"
      >
        {{ data.discountType === 1 ? '满减券' : '折扣券' }}
      </view>
      <view class="coupon__main">
        <view class="flex items-center justify-between">
          <view class="coupon__name flex-1" :class="isDisable ? 'disabled-color' : 'info-color'">
            {{ data.name }}
          </view>
          <view
            class="coupon__value flex items-end"
            :class="isDisable ? 'disabled-color' : 'price-text'"
          >
            <view class="coupon__value--reduce flex items-end">
              <view class="coupon__reduce-unit" v-if="data.discountType === 1">￥</view>
              <view class="coupon__reduce-price">
                {{ data.discountType === 1 ? data.discountPrice : data.discountPercent! / 10.0 }}
              </view>
            </view>
            <view class="coupon__value--discount" v-if="data.discountType === 2">折</view>
          </view>
        </view>
        <!-- 有效期  -->
        <view class="coupon__condition flex items-center justify-between">
          <!--情况一 领取之后-->
          <view
            class="coupon__date"
            :class="isDisable ? 'disabled-color' : 'subtitle-color'"
            v-if="data.validityType === 2"
          >
            有效期：领取后 {{ data.fixedEndTerm }} 天内可用
          </view>
          <!--情况二 固定日期 -->
          <view
            class="coupon__date"
            :class="isDisable ? 'disabled-color' : 'subtitle-color'"
            v-else
          >
            有效期: {{ formatDate(data.validStartTime) }} 至
            {{ formatDate(data.validEndTime) }}
          </view>

          <!-- 门槛  -->
          <view class="coupon__enough" :class="isDisable ? 'disabled-color' : 'subtitle-color'">
            {{ usePrice }}
          </view>
        </view>
      </view>
    </view>
    <!--底栏 -->
    <view class="coupon__footer flex items-center justify-between">
      <view>
        <view class="coupon__desc">{{ data.description }}</view>
        <view>
          <slot name="reason" />
        </view>
      </view>
      <view class="coupon__button">
        <slot />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import dayjs from 'dayjs'
import type { UserCoupon } from '@/types/coupon'
interface CouponProps {
  id: number
  name: string
  status: number
  usePrice: number
  productScope: number
  productScopeValues: string[]
  validityType: number //有效期类型
  validStartTime: string
  validEndTime: string
  fixedEndTerm: number //领取后有效期
  discountType: number
  discountPercent?: number
  discountPrice: number
  discountLimitPrice: number
  description: string
  canTake: boolean //是否允许领取
  mismatchReason?: string //不可用原因
}
enum ComponentType {
  // 领券中心
  Coupon = 1,
  // 用户优惠券
  User,
}

const props = withDefaults(
  defineProps<{
    data: any
    disabled: boolean
    type: ComponentType
  }>(),
  {
    type: 1,
    disabled: false,
  },
)

const isDisable = computed(() => {
  if (props.type === 1 && !props.data.canTake) {
    return true
  } else if (props.data.status === 2 || props.data.status === 3) {
    return true
  } else {
    return false
  }
})
const usePrice = computed(() => {
  if (props.data.usePrice === 0) {
    return '无门槛'
  }
  return `满${props.data.usePrice}元可用`
})

// 格式化日期，只显示年月日
const formatDate = (dateString: string) => {
  if (!dateString) {
    return ''
  }
  return dayjs(dateString).format('YYYY-MM-DD')
}
</script>

<style lang="scss" scoped>
.info-bg-color {
  background: linear-gradient(90deg, var(--ui-BG-Main), var(--ui-BG-Main-gradient));
}

.disabled-bg-color {
  background-color: #999 !important;
}

.info-color {
  color: #333;
}

.subtitle-color {
  color: #666;
}

.disabled-color {
  color: #999;
}
.price-text {
  color: #ff0000;
}
.coupon {
  margin: 15rpx 30rpx;

  .coupon__content {
    background: #fff;
    border-radius: 20rpx;

    .coupon__tag {
      color: #fff;
      font-size: 24rpx;
      height: 42rpx;
      width: 100rpx;
      background-color: rgb(228, 36, 36);
      border-radius: 20rpx 0 20rpx 0;
    }

    .coupon__main {
      margin: 0 30rpx;
      padding-top: 18rpx;
      padding-bottom: 22rpx;
      // 优惠券分割线
      border-bottom: 2rpx dashed #d3d3d3;

      .coupon__name {
        font-size: 35rpx;
        font-weight: 700;
        margin-right: 14rpx;
      }
      .coupon__value {
        .coupon__reduce-price {
          font-size: 64rpx;
          font-weight: 500;
          line-height: normal;
        }

        .coupon__reduce-unit {
          line-height: normal;
          font-size: 32rpx;
          margin-bottom: 10rpx;
        }

        .coupon__value-discount {
          line-height: normal;
          font-size: 28rpx;
          margin-bottom: 10rpx;
          margin-left: 4rpx;
        }
      }
      .coupon__condition {
        margin-top: 16rpx;
        .coupon__date {
          font-size: 24rpx;
          font-weight: 400;
        }

        .coupon__enough {
          font-size: 24rpx;
          font-weight: 400;
        }
      }

      .value-text {
        font-size: 32rpx;
        font-weight: 600;
      }
    }
  }
  .coupon__footer {
    background: #fff;
    width: 100%;
    box-shadow: rgba(#000, 0.1);
    box-sizing: border-box;
    padding: 24rpx 30rpx;
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.04);
    border-radius: 20rpx;

    .coupon__desc {
      font-size: 24rpx;
      color: #999;
      font-weight: 400;
    }
  }
}
</style>
