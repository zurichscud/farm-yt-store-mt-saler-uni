import http from '@/utils/http'

// 定义登录响应数据类型
interface LoginResponse {
  token: string
  refreshToken: string
  userId: string
  userName: string
}

// 定义登录请求数据类型
interface WeixinLoginData {
  loginCode: string
  phoneCode?: string
}

interface H5LoginData {
  username: string
  password: string
}

// 微信登录
export function weixinLogin(data: WeixinLoginData) {
  return http<LoginResponse>({
    url: '/miniapp/user/weixin',
    method: 'POST',
    data,
    custom: {
      showSuccess: true,
      successMsg: '登录成功',
      errorMsg: '登录失败',
      loadingMsg: '登录中...',
    },
  })
}

// H5登录，仅供测试
export function h5Login(data: H5LoginData) {
  return http<LoginResponse>({
    url: '/miniapp/user/h5login',
    method: 'POST',
    data,
  })
}
