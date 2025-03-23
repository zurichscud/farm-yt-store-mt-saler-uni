// pinia持久化配置
export const persist = {
  storage: {
    setItem(key: string, value: any) {
      uni.setStorageSync(key, value)
    },
    getItem(key: string) {
      return uni.getStorageSync(key)
    },
  },
}
