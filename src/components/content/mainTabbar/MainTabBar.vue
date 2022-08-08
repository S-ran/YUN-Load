<template>
  <tab-bar class="tabbar" v-show="isShow" >
    <tab-bar-item link="/find" :flageData='flageData' @sendBarShow="sendBarShow" >
        <div slot="icon" class="font icon-faxian1"></div>
        <div slot="active-icon" class="font icon-faxian"></div>
        <div slot="text">发现</div>
    </tab-bar-item>
    <tab-bar-item link="/follow" :flageData='flageData' @sendBarShow="sendBarShow">
        <div slot="icon" class="font icon-guanzhu"></div>
        <div slot="active-icon" class="font icon-guanzhu1"></div>
        <div slot="text">关注</div>
    </tab-bar-item>
    <tab-bar-item link="/user" :flageData='flageData' @sendBarShow="sendBarShow">
        <div slot="icon" class="font icon-shouye"></div>
        <div slot="active-icon" class="font icon-wode"></div>
        <div slot="text">我的</div>
    </tab-bar-item>
    <tab-bar-item link="/cation" :flageData='flageData' @sendBarShow="sendBarShow">
        <div slot="icon" class="font icon-fenlei"></div>
        <div slot="active-icon" class="font icon-xiangce2"></div>
        <div slot="text">相片分类</div>     
    </tab-bar-item>
    <tab-bar-item link="/download" :flageData='flageData' @sendBarShow="sendBarShow">
        <div slot="icon" class="font icon-fenlei"></div>
        <div slot="active-icon" class="font icon-xiangce"></div>
        <div slot="text">相册分类</div>     
    </tab-bar-item>
  </tab-bar>
</template>

  <script>
    import TabBar from '@/components/common/tabbar/TabBar'
    import TabBarItem from '@/components/common/tabbar/TabBarItem'

    export default {
      name: "MainTabBar",
      components: {
        TabBar, TabBarItem
      },
      data(){
        return{
          isShow:false,
          flageData:[]
        }
      },
      methods:{
        sendBarShow(val){
          this.flageData = [];
          this.isShow = val;
        }
      }
    }
  </script>

<style scoped>
.tabbar{
  z-index: 9;
  background: rgb(17, 212, 212);
}
.icon-zhuye{
 color: red;
}
</style>
