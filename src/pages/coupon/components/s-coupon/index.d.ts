export interface TakeCouponTemplate {
  id: number
  name: string
  status: number
  usePrice: number
  productScope: number
  productScopeValues: number[]
  validStartTime: number
  validEndTime: number
  discountType: number
  discountPercent: number | null
  discountPrice: number
  discountLimitPrice: number
  description: string
  //是否允许领取
  canTake: boolean
}

export interface Coupon {
  id: number
  templateId: number
  name: string
  //优惠券状态(1-未使用,2-已使用,3-已失效)
  status: CouponStatus
  userId: string
  // 领取方式(1-用户主动领取, 2-后台自动发放)
  takeType: number
  //是否设置满多少金额可用，单位：元
  usePrice: number
  //生效开始时间
  validStartTime: string
  //生效结束时间
  validEndTime: string
  //使用范围
  productScope: 1 | 2
  productScopeValues: string[]
  //使用门槛
  usePrice: number
  //优惠类型：1-代金卷；2-折扣卷
  discountType: number
  //折扣百分比
  discountPercent: number
  //优惠券面值，仅在 discount_type 等于 1 时生效
  discountPrice: number
  //折扣金额上限，仅在 discount_type 等于 2 时生效
  discountLimitPrice: number
}
