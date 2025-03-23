module.exports = {
  getTokenAccess() {
    return uni.getStorageSync('tokenAccess')
  },
  setTokenAccess(tokenAccess) {
    uni.setStorageSync('tokenAccess', tokenAccess)
  },
  removeTokenAccess() {
    uni.removeStorageSync('tokenAccess')
  },
  getTokenRefresh() {
    return uni.getStorageSync('tokenRefresh')
  },
  setTokenRefresh(tokenRefresh) {
    uni.setStorageSync('tokenRefresh', tokenRefresh)
  },
  removeTokenRefresh() {
    uni.removeStorageSync('tokenRefresh')
  },
  getUser() {
    const user = uni.getStorageSync('user')
    return user ? JSON.parse(user) : user
  },
  setUser(user) {
    uni.setStorageSync('user', JSON.stringify(user))
  },
  removeUser() {
    uni.removeStorageSync('user')
  },
}
