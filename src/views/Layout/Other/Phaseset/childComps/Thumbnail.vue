<template>
    <div class="thum" v-show="isShow" >
        <div class="nav">
            <div class="font icon-xingzhuanggongnengtubiao- back" @click="offLokk"></div>
        </div>
        <div class="data">
            <div class="ul"  @touchstart="onDown"  @touchmove="onMove" @touchend="onEnd">
                <div class="data-item" v-show = "JSON.stringify(RowData) !== '{}' "
                    :style="{'width':imgheight + 'px','height':imgheight + 'px','line-height':imgheight + 'px'}"
                    v-for="(item,index) in RowData.small_imgurl"   :key="index" @click="lookBigShow(index)">
                    <img :src="item" alt="">
                </div>
            </div>
            
        </div>
        <!-- 大图 -->
            <div class="bigimg" v-show="bigShow_imgUrl" @click="imgBigShow = false;bigShow_imgUrl = ''">
                    <img :src="bigShow_imgUrl" >    
            </div>

    </div>
</template>

<script>
export default {
    props:{
    },
    data(){
        return{
            imgheight:0,
            isShow:false,
            RowData:{},
            imgBigShow:false,
            bigShow_imgUrl:'',

            Bottomlimit:0,      //下限制值
            StartReference:0,   //记录开始滑动参考位置
            OverReference:0,    //记录结束滑动参考位置
            leftReference:0,    //记录左滑过程参考位置
            rightReference:0,   //记录左滑过程参考位置

        }
    },
    methods:{
        setRowData(data){
            this.RowData = data
        },
        lookBigShow(index){
            this.imgBigShow = true
            this.bigShow_imgUrl = this.RowData.big_imgurl[index]
        },
        load(){

        },
        offLokk(){
            let Ul =  document.querySelector('.ul');   
            this.isShow = false;
            Ul.style.top = '0px'
            this.OverReference = 0;
        },
        onDown(e){
                this.reference = e.targetTouches[0].screenY;  //记录开始滑动的位置
            },
            onMove(e){
                let Ul =  document.querySelector('.ul');       
                let SlipValue = e.targetTouches[0].screenY;         //获取移动坐标
                let offsetValue = this.reference - SlipValue        //获取与开始移动时的偏移量            
                let topValue = this.OverReference + -offsetValue   //获取实际div偏移量
                if(topValue > 0 ){ //左限制
                    Ul.style.top = '0px'
                }else if(topValue < -this.Bottomlimit){ //右限制
                    Ul.style.top = -this.Bottomlimit + 'px'
                }else{  //正常移动
                    Ul.style.top = topValue + 'px'
                }
            } ,
            onEnd(e){
                let Ul =  document.querySelector('.ul');
                this.OverReference = Ul.offsetTop
            }
    },
    mounted(){
        this.imgheight = window.innerWidth *0.9 / 3 
    }
}
</script>

<style lang="scss" scoped>
    .thum{
        z-index:1;
        width: 100%;
        height: 100vh;
        background: rgba(0, 0, 0, .7);
        position: absolute;
        top: 0;
        line-height: 100vh;
        text-align: center;
        
        .nav{
            width: 100%;
            height: 50px;
            line-height: 50px;
            background: #000;
            .back{
                height: 50px;
                position: absolute;
                top: 0;left: 20px;
            }
        }
        .data{
            width: 100%;
            padding: 1%;
            height: calc(100% - 50px);
            position: relative;
            overflow: hidden;
            .ul{
                width: 100%;
                height: 1000px;
                position: absolute;
                // top: 0px;
                .data-item{
                    float: left;
                    margin: 1%;
                    background: rgb(0, 0, 0);
                    img{
                        max-width:  100%;
                        max-height:  100%;  
                        // display: block;
                        // width: 100%;
                        // height: auto;
                    }
                }
            }
            
        }
    .bigimg{
        width: 100%;
        height: 100vh;
        background: rgba(0, 0, 0, .7);
        position: absolute;
        top: 50px;
        line-height: 100vh;
        text-align: center;
        img{
            max-width:  100%;
            max-height:  100%;  
        }
    }
    }
</style>