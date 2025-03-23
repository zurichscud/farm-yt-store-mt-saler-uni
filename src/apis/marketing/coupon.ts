import http from '@/utils/http'

interface GetCouponAllListParams {
  isPaging: boolean
  pageNum: number
  pageSize: number
  userId?: string
}

interface GetCouponListByUserIdParams {
  status: number
  isPaging: boolean
  pageNum: number
  pageSize: number
  userId?: string
}

interface UserGetCouponParams {
  userId?: string
  templateId: number
}

interface GetUnusedCouponCountParams {
  userId?: string
}

/**
 * 获取优惠券模板信息
 */
export function getCouponTemplateInfo(data: any) {
  return http<any>({
    url: '/coupon/marketingCouponApi/getCouponTemplateInfo',
    method: 'GET',
    data,
  })
}

/**
 * 用户领取优惠券
 */
export function userGetCoupon(data: UserGetCouponParams) {
  return http<any>({
    url: '/coupon/marketingCouponApi/userGetCoupon',
    method: 'POST',
    data,
    custom: {
      showSuccess: true,
      successMsg: '领取成功',
      errorMsg: '领取失败',
      showLoading: true,
      loadingMsg: '领取中...',
    },
  })
}

/**
 * 用户优惠券列表
 */
export function getCouponListByUserId(data: GetCouponListByUserIdParams) {
  return http<any>({
    url: '/coupon/marketingCouponApi/getCouponListByUserId',
    method: 'GET',
    data,
  })
}

/**
 *领券中心列表
 */
export function getCouponAllList(data: GetCouponAllListParams) {
  return http<any>({
    url: '/coupon/marketingCouponApi/getCouponAllList',
    method: 'GET',
    data,
  })
}

/**
 * 获取未使用优惠券数量
 */
export function getUnusedCouponCount() {
  return http<any>({
    url: '/coupon/marketingCouponApi/getUnusedCouponCount',
    method: 'GET',
    custom: {
      auth: true,
    },
  })
}
