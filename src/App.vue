<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
// import request from '@/utils/request'
/*
  测试接口
  request({
    method: 'GET',
    // 某个后台接口 url
    // url: 'http://eduboss.lagou.com/boss/v2/api-docs?group=edu-boss-boot'
    // 某个前台接口 url
    // url: 'http://edufront.lagou.com/front/ad/getAdList'
    url: '/front/ad/getAdList'
  }).then(res => {
    console.log(res)
  })
*/
export default {
  name: 'App'
}
</script>

<style lang="scss"></style>
