import type { CartItem, Goods, ModalGood } from '@/types/menu'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import useGoodProps from '@/hooks/useGoodProps'
import Big from 'big.js'
import { persist } from '@/utils/persist'
// 定义 Store
export const useCartStore = defineStore(
  'cart',
  () => {
    // 购物车
    const cart = ref<CartItem[]>([])
    const { getGoodSelectedProps } = useGoodProps()

    // 获取购物车商品数量
    const getCartGoodsNumber = computed(() => {
      return cart.value.reduce((acc, cur) => {
        return acc + cur.number
      }, 0)
    })
    // 获取购物车商品总价
    const getCartGoodsPrice = computed(() => {
      return cart.value.reduce((acc, cur) => {
        return acc.plus(cur.retailPrice).times(cur.number)
      }, new Big(0))
    })
    const addCart = (good: ModalGood | Goods, number: number) => {
      const index = cart.value.findIndex((item) => {
        if (good.use_property) {
          return item.id === good.id && item.props === (good as ModalGood).props
        } else {
          return item.id === good.id
        }
      })
      if (index > -1) {
        cart.value[index].number += number
      } else {
        cart.value.push({
          id: good.id,
          name: good.name,
          retailPrice: new Big(good.retailPrice),
          number: number,
          externalUrl: good.externalUrl,
          use_property: good.use_property,
          props_text: good.use_property ? (getGoodSelectedProps(good, 'text') as string) : '',
          props: good.use_property ? (getGoodSelectedProps(good, 'ids') as string[]) : [],
          price: new Big(good.retailPrice).times(number),
        })
      }
    }
    //从购物车中减少商品
    const reduceCart = (item: any, good: Goods) => {
      const index = cart.value.findIndex((item) => item.id === good.id)
      cart.value[index].number -= 1
      cart.value[index].price = new Big(good.retailPrice).times(cart.value[index].number)
      if (cart.value[index].number <= 0) {
        cart.value.splice(index, 1)
      }
    }

    const clearCart = () => {
      uni.showModal({
        title: '提示',
        content: '确定清空购物车么',
        success: ({ confirm }) => {
          if (confirm) {
            cart.value = []
            uni.$emit('cartEmpty')
          }
        },
      })
    }
    const destoryCart = () => {
      cart.value = []
    }
    const handleCartItemAdd = (index: number) => {
      cart.value[index].number += 1
    }
    const handleCartItemReduce = (index: number) => {
      cart.value[index].number -= 1
      if (cart.value[index].number <= 0) {
        cart.value.splice(index, 1)
        if (cart.value.length === 0) {
          uni.$emit('cartEmpty')
        }
      }
    }

    return {
      cart,
      addCart,
      reduceCart,
      clearCart,
      handleCartItemAdd,
      handleCartItemReduce,
      getCartGoodsNumber,
      getCartGoodsPrice,
      destoryCart,
    }
  },
  {
    persist,
  },
)
