<template>
    <div class="phaseset">
        <nav-bar class="nav-bar">
            <div slot="left" class="font icon-fanhui" @click="$router.back()"></div>
            <div slot="center" class="center">
                <el-input placeholder="搜索关键字" v-model="input" @keyup.enter.native="keyWord" clearable class="elinput"/>
                <div class="font icon-a-sousuotupiansousuozhaopian" @click="keyWord"></div>
            </div>
            <span slot="right" style="color: rgb(199, 195, 195);" @click='input = ""'>取消</span>        
        </nav-bar> 
        <div class="phaseset-config">
            <div class="top">
                <div v-for="(item,index) in ['标签分类','相册分类','起始日期']" :key='index' @click="classClick(index)" >
                    {{item}}
                    <span class="font icon-xiala"></span>
                </div>
            </div>
            <div class="cen">
                <div class="title" @click="onRelease">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;发布
                    <span class="font icon-qianwang"></span>
                </div>
                <div class="content"  v-infinite-scroll="load" infinite-scroll-distance="52">
                    <div class="item" v-for="(item,index) in ImgsData" :key="index">
                        <div class="item-left"  @click="preview(index)">
                            <img :src="item.small_imgurl[0]" alt="">
                            <div class="much">+{{item.small_imgurl.length}}</div>
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
                                    <i>
                                       <span v-for="(item) in item.class[1]" :key="item">    
                                        {{item}} 
                                       </span>  
                                    </i>
                                     <i>
                                       <span v-for="(item) in item.class[0]" :key="item">    
                                        {{item}} 
                                       </span>  
                                    </i>
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
            
        </div>

        <!-- 回顶 -->
        <el-backtop style="z-index:9" target=".content" :bottom="70" :right="20"></el-backtop>        
        <!-- 分类弹框 -->
        <Masks ref="masks" :ClassItemData = 'ClassItemData' @frameSend = 'frameSend' />
        <!-- 判断弹框 -->
        <Judge ref="judgeremove" @Sendconfirm = 'Sendconfirm'/>    
        <!-- 提示弹框 -->
        <Tips ref="albumtips"/>    
        <!-- 缩率图 -->
        <ThumBnail ref="thum"/>
    </div>
</template>

<script>
import {formatDate} from '@/common/utils'
import NavBar from '@/components/common/NavBar'
import Judge from '@/components/common/Judge'
import Tips from "@/components/common/Tips"
import ThumBnail from './childComps/Thumbnail'
import Masks from '../../../../components/content/Masks/index.vue'

export default {
  components:{
        NavBar,Masks,Judge,Tips,ThumBnail
    },      
    data(){
        return{
            input:'',
            ClassItemData:[],   //所有分类数据
            ImgsData:[],        //所有图片数据
            page:0,             //页码
            pageSize:10,
            total:0,            //总条数
            isLoad:true,        //是否加载
            Loadtype:'所有',    //加载类型
            removeIndex:0,      //记录要删除的索引值 
            previewData:[],     //预览数据 
            swperValue:false,        


            choiceType:[{
                title:'相册子集',
                singleClass:'',   //分类展示
                selectedData:[],  //选中的分类数据
                historyClass:[],  //选中的历史分类样式
            },{
                title:'相册',
                singleClass:'',   //分类展示
                selectedData:[],  //选中的分类数据
                historyClass:[],  //选中的历史分类样式
            }],
            typeIndex:0
        }
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
        classClick(index){//获取分类
            if(index<2){
                this.typeIndex = index
                this._getData_ClassImgs(this.choiceType[index].title);
                this.$refs.masks.classShow = true    
            }
        },
        frameSend(data){ //分类筛选
            this.choiceType[this.typeIndex].selectedData = []
            this.page = 1
            this.choiceType[this.typeIndex].historyClass = [...data]
                for(let i in data){
                    if(data[i]){   
                        this.choiceType[this.typeIndex].selectedData.push(this.ClassItemData[i]);
                    }              
                }
                this.$refs.masks.frameOff() 
                this.ImgsData = []
                this.isLoad = true
                // console.log(this.choiceType);          
               
                    
                if(this.choiceType[0].selectedData.length){
                    if(this.choiceType[0].selectedData[0] == '全部')
                        this._getData_Resources(this.page)
                    else{
                        let obj = {
                                page:this.page,
                                pageSize:this.pageSize,
                                value:this.choiceType[0].selectedData,
                                isType:'books',
                                Subclass:0
                            }
                        this._getData_ImgsSearch(obj);
                    }
                        
                }else if(this.choiceType[1].selectedData.length){
                    if(this.choiceType[1].selectedData[0] == '全部')
                        this._getData_Resources(this.page)
                    else{
                        let obj = {
                                page:this.page,
                                pageSize:this.pageSize,
                                value:this.choiceType[1].selectedData,
                                isType:'books',
                                Subclass:1
                            }
                        this._getData_ImgsSearch(obj);
                    }
                        
                } else {
                     this._getData_Resources(this.page)
                }

        },
        keyWord(){// 关键字筛选
            this.Loadtype = '获取关键'
            this.page = 1;
            let obj = {
                page:this.page,
                pageSize:this.pageSize,
                value:this.input,
                isType:'books'
            }         
            this.ImgsData = []       
            this._getData_ImgsKeyword(obj);
        },
        onRelease(){ //发布
            this.$router.push('/group')
        },
        load(){
            if(this.isLoad){
                this.page += 1;
                if(this.Loadtype == '所有'){

                    this._getData_Resources(this.page)
                }else if(this.Loadtype == '分类'){
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
        preview(index){ //查看缩率图
            this.$refs.thum.isShow = true
            this.$refs.thum.setRowData(this.ImgsData[index])
            let imgItemHeight = (window.innerWidth *0.9 / 3) + (window.innerWidth *0.02) //获取每列高度，每张图片长宽 + 内边距
            let column = this.ImgsData[index].small_imgurl.length / 3   //获取列数
            if(this.ImgsData[index].small_imgurl.length % 3) {          //取余为真加一列
                column += 1;
                column = Math.floor(column)   
            }
            let Ul = document.querySelector('.ul')
            Ul.style.height = column * imgItemHeight + 'px'  //设置UL总高度
            this.$refs.thum.Bottomlimit = column * imgItemHeight - window.innerHeight + 100 //设置下移限制值
        },
        onRemove(index){ //是否删除？
            this.$refs.judgeremove.isTipsShow('是否确认删除?',1);
            this.removeIndex = index;
        },
        Sendconfirm(){//确定删除
            const data = this.ImgsData[this.removeIndex]
            this._getData_ImgsRemove({data,isType:'books'})
        },
        onEdit(index){ //编辑
            this.$router.push({
              path:'/group',
                query: {
                    title:'编辑相集',
                    data:this.ImgsData[index]
                }  
            })
        },
        onTopping(index){
            this.$api.getData_onTopping(index,'books').then(res=>{
                 this.$refs.albumtips.isTipsShow('已置顶',1000);
                 location.reload();
            })
        },
         /*******************网络请求*********************/
        _getData_ClassImgs(type){//请求图片分类数据
            this.$api.getData_ClassImgs(type).then(res=>{
                res.data.splice(0,0,'全部')
                this.ClassItemData = res.data
                this.$refs.masks.getLength(this.ClassItemData.length,this.choiceType[this.typeIndex].historyClass)          
            })
        },
        _getData_Resources(page){//获取所有图片数据
            this.Loadtype = '所有'
            this.$api.getData_Resources(page,this.pageSize,'books').then(res => {
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
                    console.log(res);
                    this.$refs.albumtips.isTipsShow('删除成功!',1000);
                    this.ImgsData = []
                    this.isLoad = true
                    this.page = 1
                    this._getData_Resources(this.page)
            })
        },
         //时间转换
        showDate(value){     
            const time = new Date(value)//将时间戳转化为data对象 
            return formatDate(time,'yy/MM/dd hh:mm:ss')//将data格式化
        }
    }  
}
</script>

<style lang="scss" scoped>
.phaseset{
    width: 100%;
    height: 100vh;
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
    .phaseset-config{
        width: 100%;
        height: calc(100% - 52px);
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
        .cen{
            width: 100%;
            height: calc(100% - 52px);
            .title{
                width: 100%;
                height:52px;
                line-height: 52px;
                font-size: 16px;
                background: #eee;
                position: relative;
                span{
                    display: block;
                    position: absolute;
                    right: 0;top: 0;
                }
            }
            .content{
                height: calc(100% - 52px);
                overflow: auto;
                width: 100%;
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
                z-index: 1;
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
                z-index: 1;
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
                    background: rgba(177, 177, 177, 0.089);
                    position: relative;
                    img{
                        max-width: 145px;
                        max-height: 145px;
                    }
                    .much{
                        width: 50px;
                        height: 20px;
                        line-height: 20px;
                        position: absolute;
                        bottom: 10px;right: 0px;
                        font-size: 20px;
                        color: rgb(248, 4, 106);
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
                            i{
                                display: block;
                            }
                        }
                    }   
                    .describe{
                        height: 25%;
                        line-height: 140%;color:rgba(20, 40, 218, 0.795);
                         white-space:nowrap;
                        overflow:hidden;
                        text-overflow:ellipsis;
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