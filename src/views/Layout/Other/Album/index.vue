<template>
    <div class="album">
        <nav-bar class="nav-bar">
            <div slot="left" class="font icon-fanhui" @click="backUser"></div>
            <div slot="center" class="center">
                <el-input placeholder="搜索关键字" v-model="input" @keyup.enter.native="keyWord" clearable class="elinput"/>
                <div class="font icon-a-sousuotupiansousuozhaopian" @click="keyWord"></div>
            </div>
            <span slot="right" style="color: rgb(199, 195, 195);" @click='input = ""'>取消</span>        
        </nav-bar> 
        <div class="album-config">
            <div class="top">
                <div @click="classClick">
                    相册分类
                    <span class="font icon-xiala"></span>
                </div>
                <div>
                    起始日期
                    <span class="font icon-xiala"></span>
                </div>
            </div>
            
            <div class="center">
                <div class="title" @click="onRelease">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;发布
                    <span class="font icon-qianwang"></span>
                </div>

                <div class="content"  v-infinite-scroll="load" infinite-scroll-distance="52">
                    <div class="item" v-for="(item,index) in ImgsData" :key="index">
                        <div class="item-left" @click="lookImg(index)">
                            <img :src="item.small_imgurl" alt="">
                        </div>
                        <div class="item-right">
                            <div class="time" >
                                {{showDate(item.timeStamp)}}
                            </div>
                            <div class="titleclass" >
                                <div class="titles">
                                    {{item.title}}
                                </div>
                                <div class="class">
                                    <i  v-for="(item,index) in item.class" :key="index">{{item}} </i>
                                </div>     
                            </div>
                            <div  class="describe" >
                                    {{item.describe}}
                            </div>
                            <div class="operation" >
                               <div @click="onEdit(index)">编辑</div>
                               <div @click="onRemove(index)">删除</div>
                               <div @click="onTopping(index)">置顶</div>
                            </div>
                        </div>
                    </div>

                    <div class="d icon-shengqi" v-if="ImgsData.length == total"> 我也是有底限的 </div>
                    <div class="d icon-jiazai" v-else> 正在赶来 </div>     
                
                </div>
            
                
            </div>

            <div class="bomoot font icon-xiangce1" @click="preview">
                相册预览
            </div>
            <!-- 回顶 -->
            <el-backtop style="z-index:9" target=".content" :bottom="70" :right="20"></el-backtop>
            <!-- 分类弹框 -->
            <kask ref="masks" :ClassItemData = 'ClassItemData' @frameSend = 'frameSend' />

            <!-- 判断弹框 -->
            <Judge ref="judgeremove" @Sendconfirm = 'Sendconfirm'/>
            <!-- 提示弹框 -->
            <Tips ref="albumtips"/>
            <!-- 大图 -->
            <div class="bigimg" v-show="bigShow_imgUrl" @click="imgBigShow = false;bigShow_imgUrl = ''">
                    <img :src="bigShow_imgUrl" >    
            </div>
            <!-- 预览 -->
            <PreView ref="prv" :previewData = 'previewData' @clearPreView = 'previewData = []'/>
        </div>
    </div>
</template>

<script>
import {formatDate} from '@/common/utils'

import NavBar from '@/components/common/NavBar'
// import Masks from '@/components/content/Masks.vue'
import Judge from '@/components/common/Judge'
import Tips from "@/components/common/Tips"
import PreView from '@/components/content/preView'

import kask from '../../../../components/content/Masks/index.vue'
export default {
    components:{
        NavBar,Judge,Tips,PreView,kask
        
    },
    data(){
        return{
            input:'',
            ClassItemData:[],   //所有分类数据
            selectedData:[],    //选中的分类数据
            historyClass:[],    //选中的历史分类
            ImgsData:[],        //所有图片数据
            page:0,             //页码
            pageSize:10,
            total:0,            //总条数
            isLoad:true,        //是否加载
            Loadtype:'获取所有', //加载类型
            removeIndex:0,      //记录要删除的索引值    
            imgBigShow:false,   //大图显示
            bigShow_imgUrl:'',  //大图链接
            previewData:[],     //预览数据 
            swperValue:false,        
        }
    },
    computed:{
    },
    watch:{
        input(){
            if(!this.input) {
                this.Loadtype = '获取所有'
                this.ImgsData = []
                this.isLoad = true
                this._getData_Resources(this.page)
            }
        },
        swperValue(){
            if(!this.swperValue)this.$refs.swper.stopTimer();
            else this.$refs.swper.startTimer();
        }
    },
    methods:{
        backUser(){//返回上一级
            this.$router.back()
        },
        classClick(){//获取分类
            this._getData_ClassImgs();
            
            this.$refs.masks.classShow = true
            

        },
        onRelease(){//跳转发布
            this.$router.push('/release')
        },
        onEdit(index){//跳转编辑
            this.$router.push({
              path:'/release',
                query: {
                    title:'编辑图片',
                    data:this.ImgsData[index]
                }  
            })
        },
        load(){//懒加载
            if(this.isLoad){
                this.page += 1;
                // console.log(this.Loadtype);
                if(this.Loadtype == '获取所有'){
                        
                    this._getData_Resources(this.page)
                }else if(this.Loadtype == '获取分类'){
                    let obj = {
                        page:this.page,
                        pageSize:this.pageSize,
                        value:this.selectedData
                    }
                    this._getData_ImgsSearch(obj)
                }else{
                    let obj = {
                        page:this.page,
                        pageSize:this.pageSize,
                        value:this.input
                    }
                    this._getData_ImgsSearch(obj)
                }
            }
        },
        frameSend(data){ //分类筛选
            this.Loadtype = '获取分类'
            this.selectedData = []
            this.page = 1
                this.historyClass = [...data]
                for(let i in data){
                    if(data[i]){   
                        this.selectedData.push(this.ClassItemData[i]);
                    }              
                }
                this.$refs.masks.frameOff()
                let obj = {
                    page:this.page,
                    pageSize:this.pageSize,
                    value:this.selectedData,
                    isType:'imgs'
                }
                this.ImgsData = []
                this.isLoad = true
                if(!this.selectedData.length)
                    this._getData_Resources(this.page)
                else 
                    this._getData_ImgsSearch(obj);
        },
        keyWord(){//获取搜索内容
            this.Loadtype = '获取关键'
            this.page = 1;
            let obj = {
                page:this.page,
                pageSize:this.pageSize,
                value:this.input,
                isType:'imgs'
            }         
            this.ImgsData = []       
            this._getData_ImgsKeyword(obj);
        },
        onRemove(index){//是否删除？
            this.$refs.judgeremove.isTipsShow('是否确认删除?',1);
            this.removeIndex = index;
        },
        Sendconfirm(){//确定删除
            const data = this.ImgsData[this.removeIndex]
            this._getData_ImgsRemove({data,isType:'imgs'})
        },
        lookImg(index){//查看原图
            this.bigShow_imgUrl = this.ImgsData[index].big_imgurl
        },
        preview(){//预览
            this._getData_ImgsPreview();
        },
        onTopping(index){ //置顶
           this.$api.getData_onTopping(index,'imgs').then(res=>{
                this.$refs.albumtips.isTipsShow('已置顶',1000);
                location.reload();
            })
            // this._getData_ToppingResourcesImgs({value:this.ImgsData})
        },
        /*******************网络请求*********************/
        _getData_ClassImgs(){//请求图片分类数据

         this.$api.getData_ClassImgs('相片').then(res=>{
                res.data.splice(0,0,'全部')
                this.ClassItemData = res.data
                this.$refs.masks.getLength(this.ClassItemData.length,this.historyClass)          
            })

            // this.$api.getData_ClassImgs().then(res=>{
            //     this.ClassItemData = res.data
            //     this.$refs.masks.getLength(this.ClassItemData.length,true)
            //     if(this.historyClass.length){
            //         this.$refs.masks.isActivePart = [...this.historyClass]
            //         this.$refs.masks.isActiveWhole = true          
            //         this.historyClass.forEach(i => {                      
            //                 if(i != 1) this.$refs.masks.isActiveWhole = false                                                     
            //         });
            //     }
            // })
        },
        _getData_Resources(page){//获取所有图片数据
            this.Loadtype = '获取所有'
            this.$api.getData_Resources(page,this.pageSize,'imgs').then(res => {
                // console.log(res.data);      
                this.total = res.data.total
                this.ImgsData.push(...res.data.data)
                if(this.ImgsData.length == this.total){
                    this.isLoad = false
                }
                // console.log(this.ImgsData);
            })
        },
        _getData_ImgsSearch(data){//获取分类筛选数据
            this.$api.getData_ImgsSearch(data).then(res => {     
                // console.log(res.data);          
                this.total = res.data.total
                this.ImgsData.push(...res.data.data)
                if(this.ImgsData.length == this.total){
                    
                    this.isLoad = false
                }
            })
        },
        _getData_ImgsKeyword(data){//获取关键筛选数据
            this.$api.getData_ImgsKeyword(data).then(res => {       
                this.total = res.data.total
                this.ImgsData.push(...res.data.data)
                this.isLoad = true  
                if(this.ImgsData.length == this.total){            
                    this.isLoad = false
                }
            })
        },
        _getData_ImgsRemove(data){ //删除操作
            this.$api.getData_ImgsRemove(data).then(res =>  {
                    // console.log(res);
                    this.$refs.albumtips.isTipsShow('删除成功!',1000);
                    this.ImgsData = []
                    this.isLoad = true
                    this.page = 1
                    this._getData_Resources(this.page)
            })
        },
        _getData_ImgsPreview(){ //获取预览数据
            this.$api.getData_ImgsPreview().then(res => {
                // console.log(res);
                this.previewData = res.data.data
                this.$refs.albumtips.isTipsShow('加载中...',500);
                this.$refs.prv.setsetCurrentIndex(1)
            })
        },
        //时间转换
        showDate(value){     
            const time = new Date(value)//将时间戳转化为data对象 
            return formatDate(time,'yy/MM/dd hh:mm:ss')//将data格式化
        }
    },
    created(){
        
    },
}
</script>

<style lang="scss" scoped>

.album{
    width: 100%;
    height: 100vh;
    
}
.center{
    position: relative;
    .elinput{
        width: 80%;
        position: absolute;
        left: 0;
        // margin-right: 100px;
    }
    .font{
        width: 40px;
        height: 52px;
        line-height: 52px;
        text-align: center;
        position: absolute;
        top: 0px; right: 0px;
        // transform: translate(50%,0);
    }
}

.album-config{
    width: 100%;
    height: calc(100% - 104px);
    .top{
         width: 100%;
         height: 52px;
         display: flex;
         div{
             flex: 1;
             height: 52px;
             line-height: 52px;
             text-align: center;

             span{
                 font-size: 5px;
             }
         }
    }
    .center{
        width: 100%;
        height: calc(100% - 52px);
         .title{
            width: 100%;
            height:52px;
            line-height: 52px;
            font-size: 16px;
            background: #eee;

         }
         .content{
            width: 100%;
            height:calc(100% - 52px); 
            overflow: auto;
            position: relative;
            .item:first-child::before{
                /*必须添加content属性，否则后期不可见::after*/
                content: '';
                /*默认是行级元素，想设置宽高必须转换为块级*/
                position: absolute; 
                left: 0px;
                top: 0px;
                width: 60px;
                height: 60px;
                // background-color: rgb(0, 0, 0);
                // border-radius: 50%;
                box-sizing:border-box;
                border: 30px solid rgb(0, 0, 0,.01);
                border-top-color:red;
                border-left-color:red;
            }
            .item:first-child::after{
                 content: '置顶';
                 color: rgb(255, 255, 255);
                /*默认是行级元素，想设置宽高必须转换为块级*/
                position: absolute; 
                left: 16px;
                top: -8px;
                width: 60px;
                height: 60px;
                transform: rotate(-45deg);
                // background-color: rgb(0, 0, 0);
            }
            .item{
                width: 100%;
                height: 150px;
                display: flex;
                // overflow: auto;
                // border-bottom: 2px solid #fff;
                box-shadow: 0 4px 4px rgb(100, 100, 100,0.2);
                .item-left{
                    width: 170px; 
                    height: 150px;
                    padding-left: 20px;
                    text-align: center;
                    line-height: 150px;
                    // background: #000;
                    img{
                        max-width: 145px;
                        max-height: 145px;
                    }
                }
                .item-right{
                    width:calc(100% - 190px);
                    height: 150px;
                    padding-left: 20px;
                    //  padding-right: 20px;
                    display: flex;
                    flex-flow: nowrap column;

                    .time{
                        height: 25%;  
                        line-height: 37.5px;
                        color:rgba(221, 219, 219);  
                    }
                    .titleclass{
                        height: 25%;
                        display: flex;
                        
                            // /*3.文字溢出的时候用省略号来显示*/
                            
                        .titles{
                            width: 50%;
                            line-height: 140%;
                            font-size:19px;
                            color:rgb(0, 0, 0);
                            font-weight: bolder;
                            white-space:nowrap;
                            overflow:hidden;
                            text-overflow:ellipsis;
                        }
                        .class{
                            width: 50%; 
                            line-height: 140%;
                            font-size: 10px;
                            white-space:nowrap;
                            overflow:hidden;
                            text-overflow:ellipsis;
                        }
                    }   
                    .describe{
                        height: 25%;
                        white-space:nowrap;
                        overflow:hidden;
                        text-overflow:ellipsis;
                        line-height: 140%;color:rgba(20, 40, 218, 0.795)
                    }
                    .operation{
                        height: 25%;
                        display: flex;
                        justify-content: space-around;
                        div{
                            width: 100%;
                            height: 100%;
                            line-height: 37.5px;
                            font-size: 10px;
                            color: rgba(0, 0, 0, 0.41);
                            text-align: center;
                            flex-flow: wrap row;
                        }
                    }
                }
            }
         }
    }
    .bomoot{
        width: 100%;
        height: 52px;
        text-align: center;
        line-height: 52px;
        font-size: 20px;
    }
    .bigimg{
        width: 100%;
        height: 100vh;
        background: rgba(0, 0, 0, .7);
        position: absolute;
        top: 0;
        line-height: 100vh;
        text-align: center;
        img{
            max-width:  100%;
            max-height:  100%;  
        }
    }
}    

.d{
    font-family:"iconfont" !important;
    width: 100vw;
    height: 52px;
    font-size: 21px;
    margin: 20px 0;
    text-align: center;
    line-height: 52px;
    color:rgba(221, 219, 219);  
}
</style>