<template>
  <div class="nav-container">
    <div class="glass">
      <ul class="dock">
        <li>😃</li>
        <li>😊</li>
        <li>😜</li>
        <li>😍</li>
        <li>🤩</li>
        <li>🥳</li>
        <li>🥶</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  document.querySelectorAll('.dock li').forEach((li) => {
    li.addEventListener('click', (e) => {
      e.currentTarget.classList.add('loading')
    })

    li.addEventListener('mousemove', (e) => {
      let item = e.target
      let itemRect = item.getBoundingClientRect()
      let offset = Math.abs(e.clientX - itemRect.left) / itemRect.width

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
    })
  })

  document.querySelector('.dock').addEventListener('mouseleave', (e) => {
    resetScale()
  })

  function resetScale() {
    document.querySelectorAll('.dock li').forEach((li) => {
      li.style.setProperty('--scale', 1)
    })
  }
})
</script>

<style lang="less" scoped>
.nav-container {
  position: absolute;
  z-index: 100;
  bottom: 0;
  width: 100%;
  height: 60px;
  background: #eee;
  opacity: 0.9;
  .glass {
    width: 100%;
    height: 8rem;
    background: rgba(255, 255, 255, 0.25);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    border: 1px solid rgba(255, 255, 255, 0.18);
    display: flex;
    justify-content: center;
  }

  .dock {
    --scale: 1;
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .dock li {
    font-size: calc(6rem * var(--scale));
    padding: 0 0.5rem;
    cursor: default;

    position: relative;
    top: calc((6rem * var(--scale) - 6rem) / 2 * -1);

    transition: 15ms all ease-out;
  }

  .dock li.loading {
    animation: 1s loading ease-in infinite;
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
