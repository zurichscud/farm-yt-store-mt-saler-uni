import http from '@/utils/http'

interface LaKalaPayActiveParams {
  orderId: string
  orderAmt: number
  openId: string
  accountType: string
}

export function lakalaPayActive(data: LaKalaPayActiveParams) {
  return http<any>({
    url: '/pay/lakalaPay/lakalaPayActive',
    method: 'POST',
    data,
    custom: {
      showLoading: true,
      loadingMsg: '请稍后...',
    },
  })
}
