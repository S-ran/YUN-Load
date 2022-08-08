<template>
    <div class="N1" v-if="JSON.stringify(imgItemData) !== '{}'">
        <div class="font icon-xingzhuanggongnengtubiao- pav-left" @click="clearItem"></div>
        <div class="title">
            {{imgItemData.title}}
        </div>
        <div class="look">
            <div class="item">
                <img :src="imgItemData.big_imgurl" alt="">
            </div>
            <div class="describe">
                {{imgItemData.describe}}
            </div>
        </div>

    </div>
</template>

<script>
export default {
    props:{
        imgItemData:{
            type:Object,
            defaul(){
                     return {}
            }
        }
    },
    computed:{
        isShow(){
          
        }
    },
    methods:{
        clearItem(){
            this.$parent.clearItem()
        }
    },
    created(){

    }     
}
</script>

<style lang="scss" scoped>
.N1{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;left: 0;
    background: rgb(0, 0, 0,.7);
    z-index: 10;
    .font{
        position: absolute;
        top: 10px; left: 10px;
    }
    .title{
        position: absolute;
        top: 10px; left: 50%; 
        transform: translate(-50%,0); 
        color: #fff;    
        font-size: 20px;
    }
    .look{
        width: 100%;
        height: 50%;
        position: absolute;
        top: 20%; left: 0; 
        transform: translate(0,0); 
        text-align: center;
        background: #000;
        .item{
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0; left: 0; 
            text-align: center;
            line-height: 50vh;
            img{
                max-width: 100%;
                max-height: 100%;
            }
        }
        .describe{
            width: 100%;
            position: absolute;
            bottom: 0; left: 0;  
            transform: translate(0,100%); 
            color: #FFF;     
            font-size: 15px; 
        }
    }

}
</style>