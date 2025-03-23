import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Store } from '@/types/store'
/**
 * 门店列表
 */
export const useShopStore = defineStore('shop', () => {
  const store = ref<Store>()

  const setStore = (val: Store) => {
    store.value = val
  }
  return {
    store,
    setStore,
  }
})
