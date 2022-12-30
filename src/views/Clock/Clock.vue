<template>
  <div class="clock-container">
    <div class="clock large"></div>
    <div class="time">
      {{ currentDay }} 星期{{ dayMark }}
      <el-popover placement="bottom" :width="200" trigger="click">
        <div class="tools-list">
          <div class="tools-item">
            <span>F11可切换全屏显示</span>
          </div>
          <div class="tools-item">
            <span>时钟进制</span>
            <el-switch
              :model-value="settting.format24"
              class="ml-2"
              inline-prompt
              style="--el-switch-on-color: #409eff; --el-switch-off-color: #67c23a"
              active-text="24"
              inactive-text="12"
              @change="settingChange('format24')"
            />
          </div>
          <div class="tools-item">
            <span>是否显示秒</span>
            <el-switch
              :model-value="settting.hasSecond"
              class="ml-2"
              inline-prompt
              style="--el-switch-on-color: #409eff; --el-switch-off-color: #67c23a"
              active-text="是"
              inactive-text="否"
              @change="settingChange('hasSecond')"
            />
          </div>
        </div>
        <template #reference>
          <svg-icon class="setting-icon" iconName="icon-setting" color="#fff" />
        </template>
      </el-popover>
      <!-- <span class="fullscreen-icon" @click="handleFullScreen" :title="isFullScreen ? '退出全屏' : '进入全屏'">
        <svg-icon :iconName="isFullScreen ? 'icon-full-full' : 'icon-fullscreen'" color="#fff" />
      </span> -->
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import dayjs from 'dayjs'
import { useUserStore } from '@/stores/user'
import { userConfigType } from '@/config'
import { getGlobalProperties } from '@/utils/index'

const currentDay = ref(dayjs().format('YYYY年MM月DD日'))
const dayMark = ref('')
let clockIns = null
let isFullScreen = ref(false)
const userStore = useUserStore()
const globalProperties = getGlobalProperties()

// const settting = reactive({
//   format24: true,
//   hasSecond: true,
// })

const settting = computed(() => {
  const config = {
    [userConfigType.format24.id]: true,
    [userConfigType.hasSecond.id]: true,
    ...userStore.userConfig
  }
  return config
})

onMounted(() => {
  isFullScreen.value = getFullScreenStatus()
  initClock()
  getDayMark()
})

const initClock = () => {
  /**
   * DailyCounter | HourlyCounter | MinuteCounter | TwelveHourClock | TwentyFourHourClock | Counter
   * 天,时,分,12小时制,24小时制,计数
   */
  //设置时间格式的时钟
  // 　var date = new Date('2014-01-01 05:02:12 pm');
  //       clock = $('.clock').FlipClock(date, {
  //       clockFace: 'TwentyFourHourClock'
  //   });
  // const now = new Date()
  // clock.setTime(now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds())
  // clock.start()
  clockIns = $('.clock').FlipClock({
    clockFace: 'TwentyFourHourClock',
    language: 'chinese',
  })
  setClock()
}

const getDayMark = () => {
  let day = dayjs().day()
  switch (day) {
    case 1:
      day = '一'
      break
    case 2:
      day = '二'
      break
    case 3:
      day = '三'
      break
    case 4:
      day = '四'
      break
    case 5:
      day = '五'
      break
    case 6:
      day = '六'
      break
    case 0:
      day = '日'
      break
  }
  dayMark.value = day
}

const settingChange = (type) => {
  const userConfig = userStore.userConfig
  let value = ''
  switch (type) {
    case 'format24':
      userConfig.format24 = !settting.value.format24
      value = userConfig.format24
      break
    case 'hasSecond':
      userConfig.hasSecond = !settting.value.hasSecond
      value = userConfig.hasSecond
      break
  }
  setUserConfig(type, value)
  userStore.setUserConfig(userConfig)
  setClock()
}

const setClock = () => {
  clockIns.loadClockFace(settting.value.format24 ? 'TwentyFourHourClock' : 'TwelveHourClock', {
    showSeconds: settting.value.hasSecond,
  })
}

const setUserConfig = async (type, value) => {
  try {
    await globalProperties.$api.setUserConfig({ type, value })
  } catch (e) {
    console.log(e)
  }
}

const handleFullScreen = () => {
  isFullScreen.value ? exitFullscreen() : enterFullscreen()
  isFullScreen.value = !isFullScreen.value
}

const enterFullscreen = () => {
  const docElm = document.documentElement
  //W3C
  if (docElm.requestFullscreen) {
    docElm.requestFullscreen()
  }
  //火狐
  else if (docElm.mozRequestFullScreen) {
    docElm.mozRequestFullScreen()
  }
  //谷歌
  else if (docElm.webkitRequestFullScreen) {
    docElm.webkitRequestFullScreen()
  }
  //IE
  else if (docElm.msRequestFullscreen) {
    docElm.msRequestFullscreen()
  }
}
// 退出全屏方法
const exitFullscreen = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen()
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen()
  } else if (document.webkitCancelFullScreen) {
    document.webkitCancelFullScreen()
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen()
  }
}
// 判断当前页面是否全屏
const getFullScreenStatus = () => {
  return document.fullscreen || document.mozFullScreen || document.webkitIsFullScreen || document.webkitFullScreen || document.msFullScreen || false
}

</script>

<style lang="less" scoped>
@clockLarge: 150px;

.clock-container {
  width: 100%;
  display: flex;
  justify-content: center;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  :deep(.clock) {
    margin: 0;
    width: initial;
    &.large {
      ul {
        width: @clockLarge;
        height: calc(90 / 60 * @clockLarge);
        // margin-right: 10px;
        li {
          line-height: calc(90 / 60 * @clockLarge);
          a div.up:after {
            top: calc(90 / 60 * @clockLarge / 2 - 2px);
          }
          a div div.inn {
            font-size: calc(70 / 60 * @clockLarge);
          }
        }
        &.flip-clock-meridium {
          font-size: calc(1 / 1.5 * @clockLarge) !important;
        }
      }
      .flip-clock-divider {
        // height: calc(90 / 60 * @clockLarge);
        top: 50%;
        transform: translate(0, -50%);
      }
    }
  }
  .time {
    position: absolute;
    top: -100px;
    font-size: 60px;
    color: #fff;
    // background: #333;
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    border-radius: 8px;
    .setting-icon {
      font-size: 30px;
      position: absolute;
      right: -20px;
      bottom: 0;
      cursor: pointer;
    }
    .fullscreen-icon {
      font-size: 30px;
      position: absolute;
      right: -70px;
      bottom: 0px;
      cursor: pointer;
    }
  }
}
.tools-list {
  .tools-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    line-height: 32px;
  }
}
</style>
