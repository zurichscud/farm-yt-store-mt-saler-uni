<template>
  <view class="good-detail-modal">
    <modal :show="modelValue" color="#5A5B5C" width="90%" custom padding="0rpx" radius="12rpx">
      <view class="cover">
        <image v-if="good.externalUrl" :src="good.externalUrl" class="image"></image>
        <view class="btn-group">
          <image
            src="/static/images/menu/close.png"
            @tap="emit('update:modelValue', false)"
          ></image>
        </view>
      </view>
      <scroll-view class="detail" scroll-y>
        <view class="wrapper">
          <!-- 商品基本信息 begin -->
          <view class="basic">
            <view class="name">{{ good.name }}</view>
            <view class="tips">{{ good.content }}</view>
          </view>
          <!-- 商品基本信息 end -->
          <!-- 商品属性 begin -->
          <view class="properties" v-if="good.use_property">
            <view class="property" v-for="(item, index) in good.property" :key="index">
              <view class="title">
                <text class="name">{{ item.name }}</text>
                <view class="desc" v-if="item.desc">({{ item.desc }})</view>
              </view>
              <view class="values">
                <view
                  class="value"
                  v-for="(value, key) in item.values"
                  :key="key"
                  :class="{ default: value.is_default }"
                  @tap="changePropertyDefault(index, key)"
                >
                  {{ value.value }}
                </view>
              </view>
            </view>
          </view>
          <!-- 商品属性 end -->
        </view>
      </scroll-view>
      <view class="action">
        <view class="left">
          <view class="price">￥{{ good.retailPrice }}</view>
          <view class="props" v-if="getGoodSelectedProps(good, 'text')">
            {{ getGoodSelectedProps(good, 'text') }}
          </view>
        </view>
        <view class="btn-group">
          <button type="default" plain class="btn" hover-class="none" @tap="handlePropertyReduce">
            <view class="iconfont icon-jianhao"></view>
          </button>
          <view class="number">{{ good.number }}</view>
          <button type="primary" class="btn" hover-class="none" @tap="handlePropertyAdd">
            <view class="iconfont icon-jiahao"></view>
          </button>
        </view>
      </view>
      <view class="add-to-cart-btn" @tap="handleAddToCartInModal">
        <view>加入购物车</view>
      </view>
    </modal>
  </view>
</template>
<script setup lang="ts">
import type { CartItem, Goods, SKUValue, ModalGood } from '@/types/menu'
import { computed } from 'vue'
import { useCartStore } from '@/stores/modules/cart'
import useGoodProps from '@/hooks/useGoodProps'
const props = defineProps<{
  modelValue: boolean
  data: ModalGood
}>()
const emit = defineEmits(['update:modelValue', 'update:data'])
const { getGoodSelectedProps } = useGoodProps()
const good = computed({
  get: () => props.data,
  set: (value) => emit('update:data', value),
})
const cartStore = useCartStore()
const changePropertyDefault = (index: number, key: number) => {
  good.value.property[index].values.forEach((value) => (value.is_default = 0))
  good.value.property[index].values[key].is_default = 1
  good.value.number = 1
}
const handlePropertyAdd = () => {
  console.log('handlePropertyAdd')
  good.value.number += 1
}
const handlePropertyReduce = () => {
  good.value.number -= 1
  if (good.value.number <= 0) {
    good.value.number = 1
  }
}
const handleAddToCartInModal = () => {
  if (good.value.use_property) {
    good.value.props_text = getGoodSelectedProps(good.value, 'text') as string
    good.value.props = getGoodSelectedProps(good.value, 'ids') as string[]
  }
  cartStore.addCart(good.value, good.value.number)
  emit('update:modelValue', false)
}
</script>
<style lang="scss" scoped>
.good-detail-modal {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .cover {
    height: 320rpx;
    padding: 30rpx 0;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    .image {
      width: 260rpx;
      height: 260rpx;
    }

    .btn-group {
      position: absolute;
      right: 10rpx;
      top: 30rpx;
      display: flex;
      align-items: center;
      justify-content: space-around;

      image {
        width: 80rpx;
        height: 80rpx;
      }
    }
  }

  .detail {
    width: 100%;
    min-height: 1vh;
    max-height: calc(90vh - 320rpx - 80rpx - 120rpx);

    .wrapper {
      width: 100%;
      height: 100%;
      overflow: hidden;

      .basic {
        padding: 0 20rpx 30rpx;
        display: flex;
        flex-direction: column;
        .name {
          font-size: $font-size-base;
          color: $text-color-base;
          margin-bottom: 10rpx;
        }
        .tips {
          font-size: $font-size-sm;
          color: $text-color-grey;
        }
      }

      .properties {
        width: 100%;
        border-top: 2rpx solid $bg-color-grey;
        padding: 10rpx 30rpx 0;
        display: flex;
        flex-direction: column;

        .property {
          width: 100%;
          display: flex;
          flex-direction: column;
          margin-bottom: 30rpx;
          padding-bottom: -16rpx;

          .title {
            width: 100%;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            margin-bottom: 20rpx;

            .name {
              font-size: 26rpx;
              color: $text-color-base;
              margin-right: 20rpx;
            }

            .desc {
              flex: 1;
              font-size: $font-size-sm;
              color: $color-primary;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }

          .values {
            width: 100%;
            display: flex;
            flex-wrap: wrap;

            .value {
              border-radius: 8rpx;
              background-color: $bg-color-grey;
              padding: 16rpx 30rpx;
              font-size: 26rpx;
              color: $text-color-assist;
              margin-right: 16rpx;
              margin-bottom: 16rpx;

              &.default {
                background-color: $color-primary;
                color: $text-color-white;
              }
            }
          }
        }
      }
    }
  }

  .action {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: $bg-color-grey;
    height: 120rpx;
    padding: 0 26rpx;

    .left {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-right: 20rpx;
      overflow: hidden;

      .price {
        font-size: $font-size-lg;
        color: $text-color-base;
      }

      .props {
        color: $text-color-assist;
        font-size: 24rpx;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .btn-group {
      display: flex;
      align-items: center;
      justify-content: space-around;

      .number {
        font-size: $font-size-base;
        width: 44rpx;
        height: 44rpx;
        line-height: 44rpx;
        text-align: center;
      }

      .btn {
        padding: 0;
        font-size: $font-size-base;
        width: 44rpx;
        height: 44rpx;
        line-height: 44rpx;
        border-radius: 100%;
      }
    }
  }

  .add-to-cart-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: $color-primary;
    color: $text-color-white;
    font-size: $font-size-base;
    height: 80rpx;
    border-radius: 0 0 12rpx 12rpx;
  }
}
</style>
