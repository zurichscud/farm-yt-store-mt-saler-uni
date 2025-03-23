<template>
  <view class="list w-100 h-100">
    <wd-tabs v-model="state.currentTab" animated swipeable @click="handleTab">
      <template v-for="tab in tabMaps" :key="tab.value">
        <wd-tab :title="tab.title">
          <scroll-view class="list__scroll" scroll-y>
            <template v-for="item in state.pagination.list" :key="item.id">
              <coupon :data="item" :disabled="false" :type="state.type">
                <template v-if="state.type === 1">
                  <wd-button size="small" :disabled="!item.canTake" @click="handleTake(item.id)">
                    {{ item.canTake ? '立即领取' : '已领取' }}
                  </wd-button>
                </template>
                <template v-else>
                  <wd-button size="small" :disabled="item.status !== 1" @click="handleWatch(item)">
                    {{ userBtn(item) }}
                  </wd-button>
                </template>
              </coupon>
            </template>

            <uni-load-more
              :content-text="loadText"
              :status="state.loadStatus"
              @tap="handleLoadMore"
            />
          </scroll-view>
        </wd-tab>
      </template>
    </wd-tabs>
    <wd-message-box />
  </view>
</template>
<script lang="ts" setup>
import coupon from './components/s-coupon/s-coupon.vue'
import tabMaps from './data/tabMaps'
import { reactive, ref, watch, computed, unref } from 'vue'
import { onShow, onLoad } from '@dcloudio/uni-app'
import type { TakeCouponTemplate } from '@/types/coupon'
import type { Coupon } from './components/s-coupon/index'
import { useMemberStore } from '@/stores'
import * as CouponApi from '@/apis/marketing/coupon'
import { useMessage } from 'wot-design-uni'
import { formatCouponInfo } from './util'

const message = useMessage()
const props = defineProps<{
  tabIndex: number
}>()

const memberStore = useMemberStore()
const state = reactive({
  currentTab: 0,
  type: 1, //1:领取优惠券 2:用户优惠券
  loadStatus: 'more' as 'more' | 'loading' | 'noMore',
  pagination: {
    list: [] as Array<TakeCouponTemplate | Coupon>,
    total: 0,
    pageNum: 1,
    pageSize: 3,
  },
})
const loadText = {
  contentdown: '点击加载更多',
  contentrefresh: '正在加载...',
  contentnomore: '没有更多数据了',
}

//查询优惠券
async function query() {
  state.loadStatus = 'loading'
  if (state.currentTab === 0) {
    /*领券中心 */
    const { code, data } = await CouponApi.getCouponAllList({
      isPaging: true,
      pageNum: state.pagination.pageNum,
      pageSize: state.pagination.pageSize,
      userId: memberStore.member?.id,
    })
    if (code) {
      const { list, total } = data
      updateState(list, total)
    }
  } else {
    /*用户优惠券 */
    console.log('[ state.currentTab ]', state.currentTab)
    const { code, data } = await CouponApi.getCouponListByUserId({
      status: state.currentTab,
      userId: memberStore.member?.id,
      isPaging: true,
      pageNum: state.pagination.pageNum,
      pageSize: state.pagination.pageSize,
    })
    if (code === 200) {
      const { list, total } = data
      updateState(list, total)
    }
  }
}

function handleTab({ index }: { index: number }) {
  resetState()
  query()
}
const handleWatch = (item: TakeCouponTemplate | Coupon) => {
  message.alert({
    msg: formatCouponInfo(unref(item) as Coupon),
    title: item.name,
  })
}

function resetState() {
  state.pagination.list = []
  state.pagination.pageNum = 1
  state.pagination.total = 0
  state.loadStatus = 'more'
}

//更新状态
function updateState(list: TakeCouponTemplate[] | Coupon[], total: number) {
  state.pagination.list = [...state.pagination.list, ...list]
  state.pagination.total = total
  state.pagination.pageNum++
  state.loadStatus = 'more'
  if (total <= state.pagination.list.length) {
    state.loadStatus = 'noMore'
  }
}

function userBtn(item: TakeCouponTemplate | Coupon) {
  if (item.status === 1) {
    return '查看详情'
  } else if (item.status === 2) {
    return '已使用'
  } else {
    return '已失效'
  }
}

//加载更多
function handleLoadMore() {
  if (state.loadStatus === 'noMore') {
    return
  }
  state.loadStatus = 'loading'
  query()
}

async function handleTake(id: number) {
  console.log('takeid', id)
  const { code, data } = await CouponApi.userGetCoupon({
    userId: memberStore.member?.id,
    templateId: id,
  })
  console.log('[ data ]', data)
  if (code === 200) {
    resetState()
    query()
  }
}
//当currentTab=0时，state.type=1。其他为2
watch(
  () => state.currentTab,
  (newTab) => {
    state.type = newTab === 0 ? 1 : 2
  },
)

onShow(() => {
  query()
})

onLoad(() => {
  if (props.tabIndex) {
    state.currentTab = Number(props.tabIndex)
    state.type = state.currentTab === 0 ? 1 : 2
  }
})
</script>

<style lang="scss" scoped>
.list {
  .list__scroll {
    height: 100%;
  }
}

.bottom-box {
  height: 80rpx;
  flex-shrink: 0;

  .item {
    position: relative;
    padding: 0 20rpx;

    &::after {
      content: ' ';
      border-right: 1rpx solid $text-color-assist;
      height: 100%;
      position: absolute;
      right: 0;
      top: 0;
      transform: scaleX(0.5) scaleY(0.8);
    }

    &:nth-last-child(1)::after {
      border-right: 0;
    }
  }
}

:deep(.wd-tab) {
  background-color: #f5f5f5;
}

:deep(.wd-tab__body) {
  /**--wot-tabs-nav-height:42px */
  height: calc(100vh - 42px);
}

:deep(.nut-empty) {
  height: 100%;
}
</style>
