<template>
  <div class="layout">
    <div class="app-content">
      <div class="app-tools">
        <svg-icon iconName="icon-minus-circle-fill" @click="close" />
        <svg-icon iconName="icon-roundclosefill" />
      </div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>

const close = () => {
  console.log('close')
}
</script>

<style lang="less" scoped>
.layout {
  height: 100%;
  .app-content {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, calc(-50% - 30px));
    width: 80%;
    height: calc(100% - 100px);
    border-radius: 6px;
    background: #fff;
    // border: 1px solid hsla(0,0%,100%,.18);
    box-shadow: 0 8px 32px 0 rgb(31 38 135 / 20%);
    opacity: 0.9;
    .app-tools {
      position: absolute;
      right: 0;
      height: 48px;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      width: 60px;
      font-size: 20px;
      svg {
        cursor: pointer;
      }
    }
  }
}
</style>
