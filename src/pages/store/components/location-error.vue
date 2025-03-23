<template>
  <view class="location-error">
    <nut-empty image="error" description="请先授权当前定位，以正常使用">
      <div style="margin-top: 10px">
        <wd-button open-type="openSetting" type="primary">开启位置授权</wd-button>
      </div>
    </nut-empty>
  </view>
</template>
<script setup lang="ts"></script>
<style lang="scss" scoped>
.location-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
</style>
