<template>
        <div class="title">
            <div class="ul">
                <div :class="{active:currentIndex==index}" 
                    v-for="(item,index) in categories" 
                    :key="index" class="item"  @touchstart="onDown"  @touchmove="onMove" @touchend="onEnd"
                    @click="onClick(index)">
                    {{item}}
                </div> 
            </div> 
        </div> 
</template>

<script>

    export default{
        name:'Title',
        data(){
            return{
                currentIndex: 0,
                Rightlimit:0,       //右限制值
                StartReference:0,   //记录开始滑动参考位置
                OverReference:0,    //记录结束滑动参考位置
                leftReference:0,    //记录左滑过程参考位置
                rightReference:0,   //记录左滑过程参考位置
            }
        },
        props:{
             categories:{
                 type:Array,
                 defaul(){
                     return []
                 }
             }  
        },
        methods:{
            onClick(index){
               this.currentIndex=index
               this.$emit('onclick',index)
            },
            onDown(e){
                this.reference = e.targetTouches[0].screenX;  //记录开始滑动的位置
            },
            onMove(e){
                let Ul =  document.querySelector('.ul');
                let SlipValue = e.targetTouches[0].screenX;         //获取移动坐标
                let offsetValue = this.reference - SlipValue        //获取与开始移动时的偏移量
                let leftValue = this.OverReference + -offsetValue   //获取实际div偏移量
                if(leftValue > 0 ){ //左限制
                    Ul.style.left = '0px'
                }else if(leftValue < -this.Rightlimit){ //右限制
                    Ul.style.left = -this.Rightlimit + 'px'
                }else{  //正常移动
                    Ul.style.left = leftValue + 'px'
                }
            } ,
            onEnd(e){
                let Ul =  document.querySelector('.ul');
                this.OverReference = Ul.offsetLeft
            }
        },
        mounted(){
            setTimeout(() =>{
			    let item =  document.querySelector('.item');
                let Ul =  document.querySelector('.ul');
                let width = item.offsetWidth * this.categories.length
			    Ul.style.width =  width + 'px';         //设置ul为小item*length
                this.Rightlimit = width - document.body.clientWidth;
			}, 300);
        }, 
      
}
</script>

<style scoped>
.title{
    width: 100%;
    height: 100%; 
    overflow: hidden;
    position: relative;
}
.ul{
    width: 100%;
    height: 40px;     
    position: absolute;    
}
.item {
  /* float: left; */
  width: 100px;
  height: 100%;
  line-height: 40px;
  text-align: center;
    display: inline-block;
}
.active {
  color: #c800f0;
  background: #eee;
}
</style>