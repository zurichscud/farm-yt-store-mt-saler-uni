import { persist } from '@/utils/persist'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Store } from '@/types/store'
// tabBar不支持传参只能使用store方式共享
export const useLocationStore = defineStore(
  'location',
  () => {
    const locationAuth = ref(false)
    /**
     * 获取当前位置
     * @returns 当前位置
     */
    const getLocation = async () => {
      try {
        const res = await uni.getLocation({
          type: 'gcj02',
        })
        locationAuth.value = true
        return res
      } catch (error) {
        locationAuth.value = false
        return null
      }
    }

    return {
      locationAuth,
      getLocation,
    }
  },
  {
    persist,
  },
)
