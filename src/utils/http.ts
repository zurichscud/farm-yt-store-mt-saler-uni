import Request from 'luch-request'
import { getTerminal } from '@/enums/terminal'
import { useMemberStore } from '@/stores'
import router from '@/utils/router'

/** 自定义配置选项类型 */
interface CustomOptions {
  /** 显示操作成功消息 默认不显示 */
  showSuccess?: boolean
  /** 成功提醒 默认使用后端返回值 */
  successMsg?: string
  /** 显示失败消息 默认显示 */
  showError?: boolean
  /** 失败提醒 默认使用后端返回信息 */
  errorMsg?: string
  /** 显示请求时loading模态框 默认不显示 */
  showLoading?: boolean
  /** loading提醒文字 */
  loadingMsg?: string
  /** 是否需要鉴权，只有登录状态才会发送请求 */
  auth?: boolean
}

/** 扩展请求配置类型 */
interface RequestConfig {
  baseURL?: string
  timeout?: number
  method?:
    | 'GET'
    | 'POST'
    | 'PUT'
    | 'DELETE'
    | 'CONNECT'
    | 'HEAD'
    | 'OPTIONS'
    | 'TRACE'
    | 'UPLOAD'
    | 'DOWNLOAD'
  header?: Record<string, string>
  custom?: CustomOptions
  [key: string]: any
}

/** 扩展响应类型 */
interface ResponseData<T = any> {
  code: number
  data: T
  msg: string
}

/** 错误响应类型 */
interface ErrorResponse {
  config?: RequestConfig
  statusCode?: number
  errMsg?: string
  data?: {
    msg?: string
  }
}

/** 错误码映射表类型 */
interface ErrorCodeMap {
  [key: number]: string
}

// 默认配置选项
const options: CustomOptions = {
  // 显示操作成功消息 默认不显示
  showSuccess: false,
  // 成功提醒 默认使用后端返回值
  successMsg: '',
  // 显示失败消息 默认显示
  showError: true,
  // 失败提醒 默认使用后端返回信息
  errorMsg: '',
  // 显示请求时loading模态框 默认不显示
  showLoading: false,
  // loading提醒文字
  loadingMsg: '加载中',
  // 是否需要鉴权，只有登录状态才会发送请求
  auth: false,
}

// Loading全局实例
const LoadingInstance = {
  count: 0,
}

/**
 * 关闭loading
 */
function closeLoading(): void {
  if (LoadingInstance.count > 0) {
    LoadingInstance.count--
  }
  if (LoadingInstance.count === 0) {
    uni.hideLoading()
  }
}

/**
 * 显示loading
 * @param {string} msg - loading提示文字
 */
function showLoading(msg: string): void {
  LoadingInstance.count++
  if (LoadingInstance.count === 1) {
    uni.showLoading({
      title: msg,
      mask: true,
      fail: () => {
        uni.hideLoading()
      },
    })
  }
}

/**
 * 显示错误提示
 * @param {string} message - 错误信息
 * @param {string} icon - 图标类型
 */
function showErrorToast(
  message: string,
  icon: 'success' | 'loading' | 'error' | 'none' | 'fail' | 'exception' = 'none',
): void {
  uni.showToast({
    title: message,
    icon,
    mask: true,
  })
}

// 错误码映射表
const ERROR_CODE_MAP: Record<number, string> = {
  400: '请求错误',
  401: '登录已过期',
  403: '拒绝访问',
  404: '请求出错',
  408: '请求超时',
  429: '请求频繁, 请稍后再访问',
  500: '服务器开小差啦,请稍后再试~',
  501: '服务未实现',
  502: '网络错误',
  503: '服务不可用',
  504: '网络超时',
  505: 'HTTP 版本不受支持',
}

/**
 * @description 使用默认配置创建请求实例
 */
const http = new Request({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 10000,
  method: 'GET',
  header: {
    Accept: '*/*',
    'Content-Type': 'application/json',
    source: 'weixin',
  },
  custom: options,
})

/**
 * @description 请求拦截器
 */
http.interceptors.request.use(
  (config: RequestConfig) => {
    const memberStore = useMemberStore()
    if (!config.header) config.header = {}
    if (config.custom?.auth && !memberStore.isLogin) {
      return Promise.reject('请先登录')
    }
    if (config.custom?.showLoading) {
      showLoading(config.custom.loadingMsg || '加载中')
    }
    // 增加 token 令牌、terminal 终端、请求头
    const token = memberStore.getMemberInfo('tokenAccess')
    if (token) {
      config.header['Authorization-Token-Access'] = String(token)
    }
    const refreshToken = memberStore.getMemberInfo('tokenRefresh')
    if (refreshToken) {
      config.header['Authorization-Token-Refresh'] = String(refreshToken)
    }
    // config.header['terminal'] = String(getTerminal())
    return config
  },
  (error: any) => {
    return Promise.reject(error)
  },
)

/**
 * @description 响应拦截器
 */
http.interceptors.response.use(
  (response: any) => {
    const memberStore = useMemberStore()
    if (response.config.custom?.showLoading) {
      closeLoading()
    }
    if (response.data.code !== 200) {
      // 特殊：如果 401 错误码，则跳转到登录页
      if (response.data.code === 401) {
        memberStore.clearMember()
        router.go('/pages/index/login')
        uni.showToast({
          icon: 'none',
          title: '请重新登录',
        })
      }
      if (response.config.custom?.showError) {
        showErrorToast(response.data.message || '服务器开小差啦,请稍后再试~', 'none')
      }
      // 未知状态码抛出服务器异常
      return Promise.reject(response.data)
    }
    // 自定义处理【showSuccess 成功提示】：如果需要显示成功提示，则显示成功提示
    if (
      response.config.custom?.showSuccess &&
      response.config.custom.successMsg !== '' &&
      response.data.code === 200
    ) {
      uni.showToast({
        title: response.config.custom.successMsg,
        icon: 'success',
      })
    }
    return Promise.resolve(response.data)
  },
  (error: ErrorResponse) => {
    const memberStore = useMemberStore()
    let errorMessage = '网络不给力哦，请稍后再试'
    if (error !== undefined) {
      // 使用错误码映射表获取错误信息
      if (error.statusCode && ERROR_CODE_MAP[error.statusCode]) {
        errorMessage = ERROR_CODE_MAP[error.statusCode]

        // 特殊处理401错误
        if (error.statusCode === 401) {
          errorMessage = memberStore.isLogin ? '您的登陆已过期' : '请先登录'
        }
      }

      // 处理超时错误
      if (error.errMsg && error.errMsg.includes('timeout')) {
        errorMessage = '请求超时'
      }
    }

    if (error && error.config) {
      // 显示错误提示
      if (error.config.custom?.showError) {
        showErrorToast(error.data?.msg || errorMessage, 'none')
        // router.redirect('/pages/error/network')
      }

      // 关闭loading
      if (error.config.custom?.showLoading) {
        closeLoading()
      }
    }
    return Promise.reject(error)
  },
)

export default <T = any>(config: RequestConfig) => {
  return http.middleware(config) as Promise<ResponseData<T>>
}
