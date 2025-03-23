import http from '@/utils/http'

interface NearbyStoresParams {
  latitude: number
  longitude: number
  limit?: number //分页参数
}

//获取门店列表
export const getStoreList = () => {
  return http({
    url: '/miniapp/store/getShopList',
    method: 'GET',
  })
}

//获取附近的门店，默认显示10条
export const getNearbyStores = (data: NearbyStoresParams) => {
  return http({
    url: '/miniapp/store/getNearbyStores',
    method: 'GET',
    params: data,
  })
}
