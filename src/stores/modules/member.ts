import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { persist } from '@/utils/persist'
import type { Member } from '@/types/member'
/**
 * 会员信息
 */
export const useMemberStore = defineStore(
  'member',
  () => {
    const member = ref<Member>() // 会员信息
    const isLogin = computed(() => {
      return member.value !== undefined
    })

    function getMemberInfo(key: keyof Member) {
      if (!member.value) {
        return null
      }
      return member.value?.[key]
    }

    // 保存会员信息
    function setMember(val: Member) {
      member.value = val
    }

    // 退出登录
    function clearMember() {
      member.value = undefined
    }

    return {
      member,
      getMemberInfo,
      setMember,
      clearMember,
      isLogin,
    }
  },
  {
    persist,
  },
)
