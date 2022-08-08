<template>
    <div>
        <nav-bar class="nav-bar">
            <div slot="left" class="font icon-liebiao"></div>
            <div slot="center">相册</div>
            <div slot="right" style="font-weight: bolder;" @click="onPreview(1)">预览</div>
        </nav-bar> 
        <div class="category">   
                <title-item class="top" :categories="categories" @onclick="onclick" />
                <Det ref="det" class="bommot" @clickItem = 'clickItem' :categoryData = 'categoryData' v-infinite-scroll="load" infinite-scroll-distance="52">
                    <div class="font icon-shengqi" v-if="isShowBotoom"> 我也是有底限的 </div>
                    <div  class="font icon-jiazai" v-else> 正在赶来 </div>

                </Det>               
        </div>

        <el-backtop style="z-index:9" target=".bommot" :bottom="70" :right="20"></el-backtop>
        <!-- 大图 -->
        <!-- <BigShow :imgItemData='imgItemData'/> -->
        <!-- 预览 -->
        <PreView ref="prv" :previewData = 'previewData' @clearPreView = 'previewData = []'/>
        <!-- 提示弹框 -->
        <Tips ref="cationtips"/>
    </div>
</template>

<script>
import NavBar from '@/components/common/NavBar'
import TitleItem from './childComps/Title'
import Det from './childComps/Det'
import BigShow from './childComps/bigShow.vue'
import PreView from '@/components/content/preView'
import Tips from "@/components/common/Tips"
export default {
    components:{
        NavBar,TitleItem,Det,BigShow,PreView,Tips
    } , 
    data(){
            return{
                categories: [],     //分类标题
                categoryData: [],   //详情对应分类数据
                currentIndex: 0,    //点击索引
                isLoad:false,       //是否懒加载
                categorTitle:'',    //获取请求数据分类字符串
                loadIndex:1,        //懒加载页数
                page:1,             //页数
                pageSize:10,        //每页长度
                tital:0,            //总数据长度
                isShowBotoom:false,
                previewData:[]       //预览数据
            }
    },
    created(){
            this._getData_ClassImgs()
    },
    methods:{
        onclick(index){ //点击分类
            this.categorTitle = this.categories[index];
            this.isLoad = true;
            this.categoryData = [];
            this.isShowBotoom = false ;
            this.page = 1;
            console.log( this.categorTitle );
  
                let obj = {
                    page:this.page,
                    pageSize:this.pageSize,
                    value:[this.categorTitle],
                    isType:'books',
                }
                this._getData_ImgsPreview(obj);
        },
        onTop(){
            let Element = document.querySelector('.bommot');
            console.log(Element.offsetTop);
            Element.style.position =  'absolute';
            Element.style.top = 0 + 'px'
        },
        load(){ //懒加载
            if(this.isLoad){
                // console.log('+',this.categorTitle);
                this.page += 1;
                let obj = {
                        page:this.page,
                        pageSize:this.pageSize, 
                        value:[this.categorTitle],
                        isType:'books'
                    }
                    this._getData_ImgsPreview(obj)            
            }
        },
        clickItem(index){//点击图片预览
            this.onPreview(index+1);
            // console.log(index);
        },
        clearItem(){ //清除单个图片预览数据
             this.imgItemData = {}
        },
        onPreview(index){//当前所有预览数据
            this.$refs.cationtips.isTipsShow('加载中...',500);
                        let obj = {
                        page:0,
                        pageSize:this.pageSize, 
                        value:[this.categorTitle],
                        isType:'books'
                        }
                        this.$api.getData_ImgsPreview(obj).then(res=>{
                                // console.log(res.data.data);
                                this.previewData = [...res.data.data]
                                this.$refs.prv.setsetCurrentIndex(index)
                        })
        },
        /*******************网络请求*********************/
        _getData_ClassImgs(){   //请求图片分类数据
                this.$api.getData_ClassImgs('相册').then(res=>{
                    // console.log(res.data);
                    this.categories = res.data;
                    let obj = {
                        page:this.page,
                        pageSize:this.pageSize, 
                        value:[this.categories[this.currentIndex]],
                        isType:'books'
                    }
                    this.categorTitle = this.categories[this.currentIndex];
                    this._getData_ImgsPreview(obj) 
               
                })
        },
        _getData_ImgsPreview(data){  //获取分类详情数据
                  console.log(data);
            this.$api.getData_ImgsPreview(data).then(res => {     
                console.log(res.data);     
                this.total = res.data.total
                this.categoryData.push(...res.data.data)
                // this.$refs.det.ImgInit(this.total)
                this.isLoad = true
                if(this.categoryData.length == this.total){       
                    this.isShowBotoom = true ;   
                    this.isLoad = false
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.category{
    width: 100%;
    height: calc(100vh - 104px);
    display: flex;
    flex-flow: wrap column;
    
}

.top {
  width: 100%;
  border-bottom: 1px solid #c800f0;;
  height: 41px;
}
.bommot {
  width: 100%;
  height: calc(100% - 42px);
  overflow: auto;
}
.font{
    height: 50px;
    line-height: 50px;
    font-size: 15px;
}

</style>