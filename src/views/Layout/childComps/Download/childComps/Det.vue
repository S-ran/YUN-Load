<template>
    
           <ul class="advers">
                <li v-for="(item,index) in categoryData" :key="index" @click="onItem(index)"
                    :style="{'width':Liheight +'px','height': Liheight +'px','line-height':Liheight +'px' }">
                   <img :src="item.small_imgurl" alt="">
                </li>
                <div class="last">
                    <slot></slot>
                </div>
               
           </ul>


</template>

<script>
    export default {
        data(){
            return{
             Liheight:0
            }
        },
        props:{
             categoryData:{
                 type:Array,
                 defaul(){
                     return []
                 }
             }  
        },  
        wacth:{
            categoryData(){
                console.log('asd');
            }
        },
        methods:{
            onItem(index){
                this.$emit('clickItem',index)
            },
           //图片显示初始化
            ImgInit(flage){
            setTimeout(()=> {
                //获取主容器的宽度
                let content = document.getElementsByClassName('advers')
                let contentWidth = content[0].offsetWidth
                
                if(contentWidth%2)contentWidth += 1;
                //获取单个图片宽度
                let imgs = content[0].children       
                let imgsWidth = imgs[0].offsetWidth
               
                //得到每行排列个数
                let nums = Math.floor(contentWidth/imgsWidth)
                //收集第一排所有高度
                let arrHeight = []
                for( let i = 0; i < imgs.length; i++ ){
                    if( i < nums ){//所有的第一行高度
                        arrHeight.push(imgs[i].offsetHeight)

                    }else{
                        //创建第一个元素的对象
                        let obj = {
                            minH:arrHeight[0],
                            minI:0
                        }
                        for( let j = 0; j < arrHeight.length; j++ ){
                            if(arrHeight[j] < obj.minH){
                                obj.minH = arrHeight[j];
                                obj.minI = j
                            }
                        }
           
                            imgs[i].style.position = 'absolute';
                            imgs[i].style.left = imgs[obj.minI].offsetLeft + 'px';
                            imgs[i].style.top = obj.minH + 'px';
                            arrHeight[obj.minI] = arrHeight[obj.minI] + imgs[i].offsetHeight                      
                    }
                }
                if(!flage){
                    let Last = document.getElementsByClassName('last')
                    Last[0].style.top = 0 + 'px'
                    Last[0].style.left = 0 + 'px'
                }            
            },500);

            },    
        },
        created(){
            this.Liheight = (window.innerWidth ) /2
            // console.log(this.Liheight);
        }     
    }
</script>

<style lang="scss" scoped>
ul{
    width: 100%;
    height: 100%;
    position: relative;
    // column-count: 2;
    // column-gap: 0;
    li{
        cursor: pointer;
        // width: 50%;
        float: left;
        box-sizing: border-box;
        border: 1px solid #ccc;
        padding: 1%;
        position: relative;
        text-align: center;
        img{
            
            // max-width: 100%;
            // max-height: 100%;
            //   display: block;
            // width: 100%;
            // height: auto;
            width: 100%;
            height: 100%;
            object-fit:cover;
        }
    }
    .last{

       width: 100%;
       height:1px;
       
    }
}
</style>