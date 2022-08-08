<template>
 <!-- 预览 -->
            <div class="prv" v-if="previewData.length" >
                <div class="prv-nav">
                     <div class="font icon-xingzhuanggongnengtubiao- pav-left" @click="clearPreView"></div>
                     <div class="pav-right">
                        轮播:
                        <el-switch v-model="swperValue" active-color="#13ce66" inactive-color="#ff4949">
                        </el-switch>
                     </div>
                </div>
                <swiper ref="swper" @clearValue='swperValue = false' v-show="isSwiperShow">
                    <swiper-item class="swiper-item" v-for="(item,index) in previewData" :key="index" >
                        <div class="prv-img">
                            <div class="prv-titlle" v-if="item.title">{{item.title}}</div>
                            <img :src="item.big_imgurl" alt="">
                            <div class="prv-describe" v-if="item.describe">{{item.describe}}</div>
                        </div>
                    </swiper-item>
                </swiper>      
            </div>
</template>

<script>

import {Swiper, SwiperItem} from "@/components/common/Swipers"
export default {
    components:{
        Swiper,
        SwiperItem
    },
    props:{
        previewData:{
            type:Array,
            defaul(){
                return []
            }
        }
    },

    data(){
        return{
            swperValue:false,
            isSwiperShow:false
        }
    },
    
    watch:{
        swperValue(){
            if(!this.swperValue)this.$refs.swper.stopTimer();
            else this.$refs.swper.startTimer();
        },
    },
    methods:{
        clearPreView(){
            this.swperValue = false
            this.isSwiperShow = false
            this.$emit('clearPreView')
        },
        setsetCurrentIndex(index){
            let t0 = setTimeout(()=>{
                this.$refs.swper.setCurrentIndex(index);
            },200)        
            let t1 = setTimeout(()=>{
                this.isSwiperShow = true;
            },500)     
        }
    }
}
</script>

<style lang="scss" scoped>
    .prv{
        width: 100%;
        height: 100vh;
        background: rgba(0, 0, 0, .7);
        position: absolute;
        top: 0;
        line-height: 100vh;
        text-align: center;
        z-index: 19;
        .prv-nav{
            width: 100%;
            height: 52px;
            background: rgb(29, 29, 29);
            position: absolute;
            // z-index: 99;
            .pav-left{
                 width: 52px;
                height: 52px;
                background: rgb(29, 29, 29);
                position: absolute;
                top: 0;left: 0;
                line-height: 52px;
                color: #fff;
                z-index: 99;
            }
            .pav-right{
                width: 100px;
                height: 52px;
                background: rgb(29, 29, 29);
                position: absolute;
                top: 0;right: 0;
                line-height: 52px;
                color: #fff;
                z-index: 99;
            }
        }
        .swiper-item{
            height: 50%;
            overflow: hidden;
            .prv-img{
                position: relative;
                .prv-titlle{
                    position: absolute;
                    line-height:52px;
                    top: 0;left: 50%;
                    transform: translate(-50%,0);
                    font-size: 17px;
                    color: #fff;
                    z-index: 100;
                }
                .prv-describe{
                    width: 100%;
                    height: 100px;
                    position: absolute;
                    line-height: 100px;
                    bottom: 152px;
                    color: #fff;
                    background: rgb(0, 0, 0,.4);
                }
            }
            
        }


        
    }
</style>