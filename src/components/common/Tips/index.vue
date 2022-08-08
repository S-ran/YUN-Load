<template>
    <div class="tips" v-show="TipsShow">
         <span>{{Showdata}}</span>
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
            if(num > 1){
                setTimeout(()=>{
                    this.TipsShow = false;
                },num)
            }else{
                this.TipsShow = true;
            }

        }
    }
}
</script>

<style lang="scss" scoped>
.tips{
    width: auto;
    height: 50px;
    background: rgba(0, 0, 0, 0.6);
    color: white;
    position: absolute;
    bottom: 100px;left: 50%;
    transform: translate(-50%,0);
    line-height: 50px;
    text-align: center;
    border-radius: 10px;
    z-index: 29;
    padding: 0 25px;
}
</style>