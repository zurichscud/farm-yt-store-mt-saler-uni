import { useMemberStore } from '@/stores/modules/member'
type Response<T> = {
  code: number
  msg: string
  data: T
}
export const Api = {
  BASEURL: import.meta.env.VITE_BASE_URL,
  source: 1, //1 weixinApplet 2 h5Source 3 pcSource 4 android 5ios
  FAIL: 'fail', //访问失败会返回该状态
  /**
   * 接口名称
   */
  index: {},
  member: {
    weixinLogin: '/miniapp/user/weixin',
    h5Login: '/miniapp/user/h5login',
  },
  menu: {
    getStoreList: '/miniapp/store/getShopList',
    getNearbyStores: '/miniapp/store/getNearbyStores',
    getProductList: '/miniapp/product/getProductList',
  },
  order: {
    getRetailOrderList: '/miniapp/retail/getMiniAppRetailOrderList',
    getMiniAppOrderDetails: '/miniapp/retail/getMiniAppOrderDetails',
    saveRetailOrder: '/miniapp/retail/saveRetailOrder',
  },
  pay: {
    lakalaPay: '/pay/lakalaPay/lakalaPayActive',
  },
  voucher: {
    getVoucherRetailOrderStatus: '/miniapp/retail/getVoucherRetailOrderStatus',
  },
  /**
   * method	   请求方式（大写）
   * endpoint    接口方法名
   * data		   所需传递参数，如果是GET请求，data会自动转为query参数
   */
  async apiCall<T>(method: UniApp.RequestOptions['method'], endpoint: string, data?: any) {
    const source = 'weixin'
    const fullurl = this.BASEURL + endpoint
    const memberStore = useMemberStore()
    try {
      const response = await uni.request({
        url: fullurl,
        data,
        method,
        header: {
          'Content-Type': 'application/json',
          'Authorization-Token-Access': memberStore.getMemberInfo('tokenAccess'),
          'Authorization-Token-Refresh': memberStore.getMemberInfo('tokenRefresh'),
          source,
        },
      })
      const res = response.data as Response<T>
      if (res.code >= 200 && res.code < 300) {
        return res.data
      } else if (res.code === 401) {
        uni.removeStorageSync('tokenAccess')
        uni.removeStorageSync('tokenRefresh')
        uni.removeStorageSync('member')
        uni.navigateTo({ url: '/pages/login/login' })
        uni.showToast({
          icon: 'none',
          title: '请重新登录',
        })
      } else {
        uni.showToast({
          icon: 'none',
          title: res.msg || '请求错误',
        })
      }
    } catch (e) {
      uni.reLaunch({
        url: '/pages/error/network',
      })
    }
  },
}
