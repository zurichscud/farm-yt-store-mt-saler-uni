import type { Coupon } from '.'
//格式化优惠券信息
export function formatCouponInfo(coupon: Coupon) {
  let couponInfo = `优惠券类型：${coupon.discountType === 1 ? '满减券' : '折扣券'}。\n`

  // 判断使用门槛是否为-1，若是则不显示
  if (coupon.usePrice !== -1) {
    couponInfo += `此优惠券适用于订单金额达到${coupon.usePrice}元及以上的情况。\n`
  }

  // 判断有效范围是否是全部商品，不显示指定商品范围
  if (coupon.productScope === 1) {
    couponInfo += `该优惠券适用于全部商品。\n`
  } else {
    couponInfo += `该优惠券适用于指定商品，包含：猪、牛、羊等。\n`
  }

  // 判断优惠券最多可以抵扣的金额是否为-1，若是则不显示
  if (coupon.discountLimitPrice !== -1) {
    couponInfo += `此优惠券最多可抵扣金额为：${coupon.discountLimitPrice}元。\n`
  }

  return couponInfo
}
