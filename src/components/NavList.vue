<template>
  <div class="nav-container">
    <ul class="nav-list" @mouseleave="handleMouseleave">
      <router-link :to="item.url" custom v-slot="{ navigate }" v-for="(item, index) in navList" :key="index">
        <li @click="navigate" :class="{ 'nav-item': true }" :title="item.name" @mousemove.stop="handleMousemove">
          <svg-icon :iconName="item.icon" />
        </li>
      </router-link>
    </ul>
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue'

const navList = [
  { name: '首页', url: '/', icon: 'icon-Home' },
  { name: '书签栏', url: '/bookmark', icon: 'icon-mianxingshoucangjia' },
  { name: '导航', url: '/nav', icon: 'icon-daohang' },
  { name: '时钟', url: '/clock', icon: 'icon-shishishijian' },
  { name: '设置', url: '/setting', icon: 'icon-setting2' },
  { name: '用户', url: '/user', icon: 'icon-User' },
]

const handleMousemove = (event) => {
  const tagName = event.srcElement.tagName
  let item = event.srcElement
  if (tagName === 'use') {
    item = event.srcElement.parentNode.parentNode
  } else if (tagName === 'svg') {
    item = event.srcElement.parentNode
  }
  let itemRect = item.getBoundingClientRect()
  let offset = Math.abs(event.clientX - itemRect.left) / itemRect.width
  let prev = item.previousElementSibling || null
  let next = item.nextElementSibling || null
  let scale = 0.6
  resetScale()
  if (prev) {
    prev.style.setProperty('--scale', 1 + scale * Math.abs(offset - 1))
  }
  item.style.setProperty('--scale', 1 + scale)
  if (next) {
    next.style.setProperty('--scale', 1 + scale * offset)
  }
}

const handleMouseleave = () => {
  resetScale()
}

const resetScale = () => {
  document.querySelectorAll('.nav-list li').forEach((li) => {
    li.style.setProperty('--scale', 1)
  })
}
</script>

<style lang="less" scoped>
.nav-container {
  position: absolute;
  z-index: 100;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 0);
  height: 60px;
  .nav-list {
    display: flex;
    justify-content: center;
    margin: auto;
    height: 100%;
    padding: 0;
    .nav-item {
      --scale: 1;
      padding: 0 10px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      // font-size: 40px;
      cursor: pointer;
      font-size: calc(40px * var(--scale));
      position: relative;
      top: calc((40px * var(--scale) - 40px) / 2 * -1);
      transition: 500ms all ease-out;
      &.loading {
        animation: 1s loading ease-in infinite;
      }
    }
  }
  @keyframes loading {
    0%,
    100% {
      transform: translateY(0px);
    }
    60% {
      transform: translateY(-40px);
    }
  }
}
</style>
