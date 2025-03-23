<template>
  <view class="bg-gray-100 min-h-screen">
    <!-- 店铺信息 -->
    <view class="bg-white mt-2 p-4">
      <view class="flex justify-between items-center">
        <view class="flex items-center">
          <text class="text-lg font-bold">福建三明三元夏商百货店</text>
          <text class="text-lg ml-1">。</text>
        </view>
        <view class="bg-gray-100 rounded-md px-2 py-1 flex items-center">
          <text class="text-gray-500 text-sm">距您450m</text>
          <text class="text-gray-500 ml-1">></text>
        </view>
      </view>
      <view class="flex items-center mt-2">
        <text class="text-gray-500 text-sm">福建省三明市三元区崇宁路6-1号夏商百货1...</text>
        <view class="ml-2 bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center">
          <text class="text-gray-400">◯</text>
        </view>
      </view>
      <view class="mt-4 text-base">
        <text>现在下单，立即制作</text>
      </view>
    </view>

    <!-- 预约时间 -->
    <view class="bg-white mt-2 p-4 flex justify-between items-center">
      <text class="text-base">预约时间</text>
      <view class="flex items-center">
        <text class="text-yellow-600">立即取餐</text>
      </view>
    </view>

    <!-- 订单商品 -->
    <view class="bg-white mt-2 p-4">
      <!-- 伯牙绝弦 -->
      <view class="flex justify-between py-3">
        <view class="flex">
          <image
            class="w-16 h-16 rounded"
            src="https://img.yzcdn.cn/vant/cat.jpeg"
            mode="aspectFill"
          ></image>
          <view class="ml-3">
            <text class="text-base font-medium">伯牙绝弦</text>
            <view class="flex items-center mt-1">
              <text class="text-gray-400 text-sm">≈ 268kcal/杯</text>
              <text class="text-gray-400 text-sm ml-2">大杯, 标准冰,标准糖</text>
            </view>
            <text class="text-gray-500 text-sm mt-1">×1</text>
          </view>
        </view>
        <text class="text-base">¥ 20</text>
      </view>

      <!-- 单杯保温袋 -->
      <view class="flex justify-between py-3 border-t border-gray-100">
        <view class="flex">
          <image
            class="w-16 h-16 rounded"
            src="https://img.yzcdn.cn/vant/apple-1.jpg"
            mode="aspectFill"
          ></image>
          <view class="ml-3">
            <text class="text-base font-medium">单杯保温袋</text>
            <text class="text-gray-500 text-sm mt-1">1</text>
          </view>
        </view>
        <text class="text-base">¥ 1</text>
      </view>
    </view>

    <!-- 超值加购 -->
    <view class="bg-white mt-2 p-4">
      <view class="mb-4">
        <text class="text-lg font-medium">超值加购</text>
        <text class="text-gray-400 text-sm ml-2">低至 ¥ 39起超值加购以下商品</text>
      </view>

      <view class="flex space-x-3">
        <!-- 加购商品1 -->
        <view class="w-1/3">
          <view class="relative">
            <image
              class="w-full h-32 rounded"
              src="https://img.yzcdn.cn/vant/leaf.jpg"
              mode="aspectFill"
            ></image>
            <view
              class="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs"
            >
              限购1件
            </view>
          </view>
          <view class="mt-2">
            <text class="text-sm">万里木兰 原叶袋...</text>
            <view class="flex justify-between items-center mt-1">
              <view class="flex items-center">
                <text class="text-red-500 text-sm">¥ 39</text>
                <text class="text-gray-400 text-xs line-through ml-1">¥49</text>
              </view>
              <view class="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center">
                <text class="text-yellow-600 text-lg">+</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 加购商品2 -->
        <view class="w-1/3">
          <view class="relative">
            <image
              class="w-full h-32 rounded"
              src="https://img.yzcdn.cn/vant/sand.jpg"
              mode="aspectFill"
            ></image>
            <view
              class="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs"
            >
              限购1件
            </view>
          </view>
          <view class="mt-2">
            <text class="text-sm">伯牙绝弦 原叶袋...</text>
            <view class="flex justify-between items-center mt-1">
              <view class="flex items-center">
                <text class="text-red-500 text-sm">¥ 39</text>
                <text class="text-gray-400 text-xs line-through ml-1">¥49</text>
              </view>
              <view class="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center">
                <text class="text-yellow-600 text-lg">+</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 加购商品3 -->
        <view class="w-1/3">
          <view class="relative">
            <image
              class="w-full h-32 rounded"
              src="https://img.yzcdn.cn/vant/tree.jpg"
              mode="aspectFill"
            ></image>
            <view
              class="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs"
            >
              限购1件
            </view>
          </view>
          <view class="mt-2">
            <text class="text-sm">花田乌龙 原叶袋...</text>
            <view class="flex justify-between items-center mt-1">
              <view class="flex items-center">
                <text class="text-red-500 text-sm">¥ 39</text>
                <text class="text-gray-400 text-xs line-through ml-1">¥49</text>
              </view>
              <view class="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center">
                <text class="text-yellow-600 text-lg">+</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 保温袋 -->
    <view class="bg-white mt-2 p-4 flex justify-between items-center">
      <view>
        <view class="flex items-center">
          <text class="text-base font-medium">保温袋</text>
          <text class="text-xs text-yellow-600 ml-2 border border-yellow-600 px-1 rounded">
            推荐选择
          </text>
        </view>
        <text class="text-gray-400 text-sm mt-1">保温保冷，锁住新鲜口感</text>
      </view>
      <view class="flex items-center">
        <text class="mr-2">¥ 1</text>
        <view class="w-6 h-6 rounded-full border border-gray-300"></view>
      </view>
    </view>

    <!-- 优惠券 -->
    <view class="bg-white mt-2 p-4 flex justify-between items-center">
      <view class="flex items-center">
        <view class="w-6 h-6 bg-red-100 rounded flex items-center justify-center mr-2">
          <text class="text-red-500 text-xs">券</text>
        </view>
        <text class="text-base">优惠券优惠</text>
      </view>
      <view class="flex items-center">
        <text class="text-red-500 mr-1">- ¥ 3</text>
        <text class="text-lg">›</text>
      </view>
    </view>

    <!-- 底部结算栏 -->
    <view
      class="fixed bottom-0 left-0 right-0 bg-white p-4 flex justify-between items-center border-t border-gray-200"
    >
      <view>
        <view class="flex items-center">
          <text class="text-gray-500">共2件 合计</text>
          <text class="text-lg font-bold ml-1">¥ 18</text>
        </view>
        <text class="text-red-500 text-sm">共优惠 ¥ 3</text>
      </view>
      <view class="bg-yellow-600 text-white px-6 py-3 rounded-full">
        <text class="font-medium">提交支付</text>
      </view>
    </view>
  </view>
</template>

<script setup>
// 这里可以添加页面逻辑
</script>

<style>
/* 可以添加额外的样式 */
</style>
