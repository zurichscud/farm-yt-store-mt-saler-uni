import http from '@/utils/http'

// 定义商店列表响应数据类型
interface Store {
  id: string
  name: string
  address: string
  phone: string
  businessHours: string
  distance?: number
}

// 定义商品列表响应数据类型
interface Product {
  id: string
  name: string
  price: number
  description: string
  imageUrl: string
  stock: number
}

// 定义附近商店请求参数类型

// 定义商品列表请求参数类型
interface ProductListParams {
  shopId: string
}

export const getProductList = (data: ProductListParams) => {
  return http({
    url: '/miniapp/product/getProductList',
    method: 'GET',
    params: data,
  })
}
