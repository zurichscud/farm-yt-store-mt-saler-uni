export const isLogin = () => {
  return uni.getStorageSync('tokenAccess') || ''
}
