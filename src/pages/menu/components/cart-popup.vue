<template>
  <!-- 购物车详情popup -->
  <view class="cart-popup">
    <wd-popup position="bottom" v-model="showPopup">
      <view class="top">
        <i class="iconfont icon-shanchu"></i>
        <text @tap="handleClearCart">清空</text>
      </view>
      <scroll-view class="cart-list" scroll-y>
        <view class="wrapper">
          <view class="item" v-for="(item, index) in cartStore.cart" :key="index">
            <view class="left">
              <view class="name">{{ item.name }}</view>
              <view class="props">{{ item.props_text }}</view>
            </view>
            <view class="center">
              <text>￥{{ item.retailPrice }}</text>
            </view>
            <view class="right">
              <button
                type="default"
                plain
                class="btn"
                hover-class="none"
                @tap="cartStore.handleCartItemReduce(index)"
              >
                <view class="iconfont icon-jianhao"></view>
              </button>
              <view class="number">{{ item.number }}</view>
              <button
                type="primary"
                class="btn"
                hover-class="none"
                @tap="cartStore.handleCartItemAdd(index)"
              >
                <view class="iconfont icon-jiahao"></view>
              </button>
            </view>
          </view>

          <view class="item" v-if="orderType == 'takeout' && store.packing_fee">
            <view class="left">
              <view class="name">包装费</view>
            </view>
            <view class="center">
              <text>￥{{ parseFloat(store.packing_fee) }}</text>
            </view>
            <view class="right invisible">
              <button type="default" plain class="btn" hover-class="none">
                <view class="iconfont iconsami-select"></view>
              </button>
              <view class="number">1</view>
              <button type="primary" class="btn" hover-class="none">
                <view class="iconfont iconadd-select"></view>
              </button>
            </view>
          </view>
        </view>
      </scroll-view>
    </wd-popup>
  </view>
  <!-- 购物车详情popup -->
</template>
<script setup lang="ts">
import { useCartStore } from '@/stores/modules/cart'
import { ref, onUnmounted, computed } from 'vue'
const cartStore = useCartStore()
const store = ref({
  name: '肴小六龙岩大洋店',
  address: '胜利路',
  packing_fee: '0',
})
const orderType = ref('takein')
const props = defineProps<{
  modelValue: boolean
}>()
const showPopup = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})
const emit = defineEmits(['update:modelValue'])
const handleClearCart = () => {
  cartStore.clearCart()
  emit('update:modelValue', false)
}

// 监听购物车为空的事件
uni.$on('cartEmpty', () => {
  emit('update:modelValue', false)
})

// 组件卸载时移除事件监听
onUnmounted(() => {
  uni.$off('cartEmpty')
})
</script>
<style lang="scss" scoped>
.cart-popup {
  .top {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    background-color: $bg-color-primary;
    color: $color-primary;
    padding: 10rpx 30rpx;
    font-size: 24rpx;
    text-align: right;
  }
  .cart-list {
    background-color: #ffffff;
    width: 100%;
    overflow: hidden;
    min-height: 1vh;
    max-height: calc(60vh - 44px);

    .wrapper {
      height: 100%;
      display: flex;
      flex-direction: column;
      padding: 0 30rpx;
      margin-bottom: 156rpx;

      .item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 30rpx 0;
        position: relative;

        &::after {
          content: ' ';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          background-color: $border-color;
          height: 2rpx;
          transform: scaleY(0.6);
        }

        .left {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          margin-right: 30rpx;

          .name {
            font-size: $font-size-sm;
            color: $text-color-base;
          }
          .props {
            color: $text-color-assist;
            font-size: 24rpx;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }

        .center {
          margin-right: 120rpx;
          font-size: $font-size-base;
        }

        .right {
          display: flex;
          align-items: center;
          justify-content: space-between;

          .btn {
            width: 46rpx;
            height: 46rpx;
            border-radius: 100%;
            padding: 0;
            text-align: center;
            line-height: 46rpx;
          }

          .number {
            font-size: $font-size-base;
            width: 46rpx;
            height: 46rpx;
            text-align: center;
            line-height: 46rpx;
          }
        }
      }
    }
  }
}
</style>
