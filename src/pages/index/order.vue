<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { isLogin } from '@/utils/auth'
import { Api } from '@/utils/api'
import type { OrderList } from '@/types/order'
import myLoading from '@/components/my-loading/my-loading.vue'
import ZTabs from '@zxlee/z-tabs/components/z-tabs/z-tabs.vue'
import ZPaging from 'z-paging/components/z-paging/z-paging.vue'

onShow(() => {
  loading.value = true
  if (paging.value) {
    paging.value.reload()
  }
})
const loading = ref(false)
const dataList = ref([])
const tabList = ref(['未核销', '待付款', '已付款','全部'])
const orderList = ref<OrderList>([])
type Query = {
  pageNum: number
  pageSize: number
  status: string
}
const query = reactive<Query>({
  pageNum: 1,
  pageSize: 10,
  status: '未核销',
})
const getOrderList = async (query: Query) => {
  if (!isLogin()) {
    return null
  } else {
    const res = await Api.apiCall('GET', Api.order.getRetailOrderList, query)
    return res.list
  }
}
const vouchersCode = (voucherCode: string, voucherStatus: number) => {
  if (voucherStatus !== 1) {
    uni.navigateTo({
      url: `/pages/order/vouchers-code?voucherCode=${voucherCode}`,
    })
  }
}
const paging = ref(null)
const tabsChange = (index: number) => {
  query.status = index
  if (index === 0) {
    query.status = '未核销'
  }
  if (index === 1) {
    query.status = '待付款'
  }
  if (index === 2) {
    query.status = '已付款'
  }
  if(index===3){
    query.status = ''
  }
  paging.value.reload()
}
const queryList = async (pageNo: number, pageSize: number) => {
  query.pageNum = pageNo
  query.pageSize = pageSize
  let result = await getOrderList(query)
  paging.value.complete(result)
  loading.value = false
}
const detail = (item, index) => {
  uni.navigateTo({
    url: '/pages/order/detail?orderId=' + item.orderId,
  })
}
const review = () => {
  uni.navigateTo({
    url: '/pages/review/review?id=' + 1,
  })
}
</script>

<template>
  <view class="content">
    <z-paging ref="paging" v-model="orderList" @query="queryList">
      <template #top>
        <z-tabs :list="tabList" @change="tabsChange" activeColor="#dd524d" />
      </template>
      <view v-if="!loading">
        <view
          class="list"
          v-for="(item, index) in orderList"
          :key="index"
          @tap="detail(item, index)"
        >
          <view class="box">
            <view class="title">
              <view class="title-left">
                <view class="tabs">自提</view>
                <view class="address">{{ item.shopName }}</view>
              </view>
              <view class="title-right">
                <view v-if="item.orderStatus === 0">未支付</view>
                <view v-if="item.orderStatus === 1">
                  <view v-if="item.voucherStatus === 0">未核销</view>
                  <view v-if="item.voucherStatus === 1">已核销</view>
                </view>
              </view>
            </view>
            <view class="content">
              <view class="content-left">
                <view class="product-box">
                  <view class="product" v-for="(item2, index2) in item.products" :key="index2">
                    <img class="img" :src="item2.productImg" />
                    <!--                  <view class="text">{{ item2.productName }}</view>-->
                  </view>
                </view>
              </view>
              <view class="content-right">
                <view class="price">￥{{ item.orderAmount }}</view>
                <view class="total">共{{ item.quantity }}件</view>
              </view>
            </view>
            <view class="bottom" v-if="item.voucherStatus === 0">
              <wd-button
                plain
                size="small"
                @tap.prevent="vouchersCode(item.voucherCode, item.voucherStatus)"
              >
                核销
              </wd-button>
            </view>
          </view>
        </view>
      </view>
      <my-loading v-else />
    </z-paging>
  </view>
</template>

<style lang="scss" scoped>
.content {
  .list {
    margin-top: 15rpx;
    width: 100%;
    padding: 0rpx $spacing-row-base;

    .box {
      width: 100%;
      box-sizing: border-box;
      background-color: #fff;
      border-radius: $border-radius-lg;
      padding: $spacing-row-lg;
      margin-bottom: 15rpx;

      .title {
        display: flex;
        justify-content: space-between;

        .title-left {
          display: flex;

          .tabs {
            border: 1px solid $color-error;
            padding: $spacing-col-sm;
            font-size: $font-size-sm;
            color: $color-error;
            margin-right: 10rpx;
          }
        }

        .title-right {
          color: $color-error;
        }
      }

      .content {
        width: 100%;
        display: flex;
        padding: $spacing-col-lg 0;
        position: relative;

        .content-left {
          width: 85%;

          .product-box {
            display: flex;
            align-items: center;
            justify-content: left;
            gap: 10rpx;

            .product {
              display: flex;
              flex-direction: column;
              justify-content: center;
              width: 80rpx;
              text-align: center;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;

              .img {
                width: $img-size-lg;
                height: $img-size-lg;
                border-radius: $border-radius-base;
              }

              .text {
                font-size: $font-size-sm;
              }
            }
          }
        }

        .content-right {
          width: 15%;
          display: flex;
          flex-direction: column;
          justify-content: center;

          .price {
            text-align: right;
            font-weight: 700;
            font-size: $font-size-lg;
            padding-bottom: $spacing-col-sm;
          }

          .total {
            text-align: right;
            font-size: $font-size-base;
          }
        }
      }
    }

    .bottom {
      display: flex;
      justify-content: flex-end;
    }
  }
}

:deep(.wd-tabs__line) {
  background: $color-error !important;
}

:deep(.wd-button) {
  margin: 0;
  border-radius: $border-radius-lg !important;
  color: $text-color-base !important;
}
</style>
