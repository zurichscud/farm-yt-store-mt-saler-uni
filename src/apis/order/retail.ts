import http from '@/utils/http'
import type { UserCoupon } from '@/types/coupon'
interface SettlementOrderParams {
  couponId?: number
  userId: string
  goodsList: GoodsList[]
}

interface GoodsList {
  productId: string
  count: number
}
export interface SettlementOrderResponse {
  originalTotalAmount: number //总原价
  couponAmount: number //总优惠
  payAmount: number //总支付
  usedCouponId: string //使用优惠券ID
  usedCouponName: string //使用优惠券名称
  coupons: UserCoupon[]
  productDetails: ProductDetail[]
}

interface ProductDetail {
  productId: string
  productName: string
  productUrl: string
  originalPrice: number //原价
  quantity: number //数量
  subtotalAmount: number //小计
  discountAmount: number //优惠
  payAmount: number //实付
}

//创建零售订单
export function saveRetailOrder(data: any) {
  return http<string>({
    url: '/miniapp/retail/saveRetailOrder',
    method: 'POST',
    data,
    custom: {
      showLoading: true,
      loadingMsg: '创建订单中...',
    },
  })
}

//根据用户选择获取订单信息
export function settlementOrder(data: SettlementOrderParams) {
  return http<SettlementOrderResponse>({
    url: '/miniapp/retail/orderCalcSettlement',
    method: 'POST',
    data,
    custom: {
      showLoading: true,
    },
  })
}
