<template>
  <div id="app">
    <router-view/>
    <MainTabbar/>
  </div>
</template>
<script>
import MainTabbar from '@/components/content/mainTabbar/MainTabBar'

export default ({
   components:{
     MainTabbar
  }
})
</script>

<style lang="scss" scoped>
#app{
  height: 100vh;
}

</style>