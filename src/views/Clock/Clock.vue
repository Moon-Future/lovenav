<template>
  <div class="clock-container">
    <div class="clock"></div>
    <div class="time">{{ currentDay }}</div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import dayjs from 'dayjs'

const currentDay = ref(dayjs().format('YYYY 年 MM 月 DD 日'))

onMounted(() => {
  /**
   * DailyCounter | HourlyCounter | MinuteCounter | TwelveHourClock | TwentyFourHourClock | Counter
   * 天,时,分,12小时制,24小时制,计数
   */
  //设置时间格式的时钟
  // 　var date = new Date('2014-01-01 05:02:12 pm');
  //       clock = $('.clock').FlipClock(date, {
  //       clockFace: 'TwentyFourHourClock'
  //   });

  const clock = $('.clock').FlipClock({
    clockFace: 'TwentyFourHourClock',
    language: 'chinese',
  })
  // const now = new Date()
  // clock.setTime(now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds())
  // clock.start()
})
</script>

<style lang="less" scoped>
.clock-container {
  display: flex;
  justify-content: center;
  position: relative;
  .clock {
    margin: 0;
    width: initial;
    scale: 2;
  }
  .time {
    position: absolute;
    top: -100px;
    font-size: 60px;
    color: #fff;
  }
}
</style>
