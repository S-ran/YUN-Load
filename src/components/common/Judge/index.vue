<template>
<div class="judge" v-show="TipsShow">
    <div class="tips" >
        <div class="title">
            <span>{{Showdata}}</span>
        </div>
         <div class="left"  @click="TipsShow = false">
             取消
         </div>
        <div class="right"  @click="Sendconfirm">
             确认
        </div>
    </div>
    <div class="Mask" @click="TipsShow = false">

    </div>
</div>

</template>

<script>
export default {
    data(){
        return{
            Showdata:'',
            TipsShow:false 
        }
    },
    methods:{
        isTipsShow(config,num){
            this.Showdata = config;
            this.TipsShow = true;

        },
        Sendconfirm(){
            this.TipsShow = false;
            this.$emit('Sendconfirm')
        }
    }
}
</script>

<style lang="scss" scoped>
.judge{
    width: 100vw;
    height: 100vh;
    position: absolute;
    top: 0;left: 0;
}
.Mask{
    width: 100vw;
    height: 100vh;
    background: rgba(10, 10, 10, 0.3);   
}
.tips{
    width: 300px;
    height: 120px;
    background: rgba(255, 255, 255);
    z-index: 99;
    color: rgb(0, 0, 0);
    position: absolute;
    top: 50%;left: 50%;
    transform: translate(-50%,-50%);
    text-align: center;
    // border-radius: 10px;
    
    div{
        float: left;
    }
    .title{
        width: 300px;
        height: 80px;
        line-height: 80px;
        font-size: 15px;
    }
    .left{
         height: 40px;
         width: 50%;
         background: rgb(231, 231, 231);
         line-height: 40px;
         font-size: 10px;
    }
    .right{
         height: 40px;
         width: 50%;
         color: rgb(255, 255, 255);
         background: rgb(0, 0, 0);
         line-height: 40px;
         font-size: 10px;
    }
}
</style>