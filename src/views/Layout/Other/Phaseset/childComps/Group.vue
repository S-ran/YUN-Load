<template>
    <div class="load">
         <nav-bar class="nav-bar">
            <div slot="left" class="font icon-fanhui" @click="Back"></div>
            <div slot="center" style="font-size:22px;font-weight: bolder;"><i>{{navtitle}}</i></div>
        </nav-bar>
        <div class="content">
            <div class="show">
                <!-- 用于上传文件 -->
	            <input class="file-upload" type="file" @change="lookImg"  name="" style="display: none;" multiple="multiple"/>
                <!-- 展示 -->
                <div class="show-item" v-show="ItemimgData.loca_imgurl.length" style="background: #000;"
                    :style="{'lineHeight':imgheight + 'px','height':imgheight + 'px'}"
                     v-for="(item,index) in ItemimgData.loca_imgurl" @click="SeeBigSHow(index)" :key="index">
                    <img :src="item" alt="">
                
                    <div class="font icon-cuowuguanbiquxiao" @click.stop = "clearimgItemData(index)">

                    </div>
                </div>
                <div  class="show-item  font icon-tupiantianjia" :style="{'lineHeight':imgheight + 'px','height':imgheight + 'px' }"  @click="upLoadOn">

                </div>   
            </div> 
            <!-- 图片标题 -->
            <div class="title">
                <el-input class="text" placeholder="请输入图集标题不超过12字"
                          v-model="ItemimgData.title" @input.native="onChang" clearable>
                </el-input>        
            </div>
               <!-- 图片描述 -->
            <el-input type="textarea" placeholder="请输入图集描述" show-word-limit class="inputs"
                      maxlength="300" v-model="ItemimgData.describe" :autosize="{minRows:8}" />

            <div class="class" v-for="(item,index) in choiceType" :key="index" @click="getClass(index)" >
                <div>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{item.name}}分类-
                    <span style="color:rgba(255, 190, 238)" v-if="item.singleClass">{{item.singleClass}}</span>
                    <span style="color:rgba(255, 190, 238)" v-else>{{item.tips}}</span>
                </div>                  
                <span class="font icon-qianwang"></span>
            </div> 

        </div>
        <div class="but">
            <div @click="submitImgs">{{buttitle}}</div>
        </div>
        <!-- 遮罩 -->
        <div class="zao" v-show="!isComplete"></div>
        <!-- 分类弹框 -->
        <kask ref="masks" :ClassItemData = 'ClassItemData'  @frameSend = 'frameSend' />
        <!-- 大图 -->
        <div class="bigimg" v-show="bigShowSrc" @click="bigShowSrc = ''">
                <!-- <img :src="ItemimgData.big_imgurl" v-if="ItemimgData.big_imgurl">     -->
            <img :src="bigShowSrc">    
        </div>
        <!-- 提示弹框 -->
        <Tips ref="classtips"/>

    </div>
</template>

<script>
import {getArrDifference,getArrCrux} from '@/common/utils'
import {BaseURL} from "@/network/request"
import {mapState} from 'vuex'
import * as imageConversion from 'image-conversion'

import NavBar from '@/components/common/NavBar'
import kask from '../../../../../components/content/Masks/index.vue'
import Tips from "@/components/common/Tips"

export default {
      components:{
        NavBar,kask,Tips
    },  
    data(){
        return{
            imgheight:0,
            navtitle:'发布相集',
            buttitle:'发布相集',
            filesLength:0,
            isComplete:true,   //是否在上传
            editFlage:false,
            editOriginalData:[],

            ItemimgData:{ 
                title:'',         // 标题数据   
                describe:'',      // 描述数据
                imgData:[],       // 图片组数据
                selectedData:[[],[]],// 选中分类数据               
                loca_imgurl:[],   // 本地图片链接
                small_imgurl:[],  // 压缩图链接
                big_imgurl:[],    // 原图链接
                imgurl_name:[],   // 图片原名称
                
                timeStamp:'',      
            },
            ClassItemData:[],   // 所有分类数据
            choiceType:[{
                name:'标签',
                title:'相册子集',
                tips:'可选',
                singleClass:'',   // 分类展示
                historyClass:[],  // 选中的历史分类样式
            },{
                name:'相册',
                title:'相册',
                tips:'请选择',
                singleClass:'',   // 分类展示
                historyClass:[],  // 选中的历史分类样式
            }],
            typeIndex:0,
            bigShowSrc:'',
        }
    },
    computed:{
        Complete(){
            if(this.ItemimgData.loca_imgurl.length && this.ItemimgData.title && this.ItemimgData.selectedData[1].length){
                return true
            }else 
             return false
        },
        ...mapState('loginModule',['userInfo'])
    },
    watch:{
    },
    methods:{
        Back(){// 返回上一级
            this.$router.back()
        },
        onChang(){ //输入限制
           if(this.ItemimgData.title.length<=12){
               this.temp = this.ItemimgData.title
           }else{
                this.ItemimgData.title = this.temp
           }
        },
        SeeBigSHow(index){// 查看大图
            this.bigShowSrc = this.ItemimgData.loca_imgurl[index]
        },
        clearimgItemData(index){//清除对应图片

            this.ItemimgData.loca_imgurl.splice(index,1)
            this.ItemimgData.imgData.splice(index,1)
            if(this.navtitle == '编辑相集'){
                this.ItemimgData.small_imgurl.splice(index,1)
                this.ItemimgData.big_imgurl.splice(index,1)
            }
            // console.log(this.ItemimgData);
        },
        lookImg(){  // 生成本地图链接
            let File = []
            File = [...document.querySelector('.file-upload').files]
            this.filesLength = File.length
            for(let i in File){
                let URL = window.URL || window.webkitURL;
                let imgURL = URL.createObjectURL(File[i]);
                this.ItemimgData.loca_imgurl.push(imgURL)
                this.ItemimgData.imgData.push(File[i])
            }
            // console.log(this.ItemimgData.imgData);

        },
        upLoadOn(){// 选择本地图片
            document.querySelector('.file-upload').click();
        },
        getClass(index){//获取类别数据
            this.typeIndex = index
            this.$refs.masks.SetType(this.choiceType[index].title)
            this._getData_ClassImgs(this.choiceType[index].title)
        },
        frameSend(data){//记录选中的类别数据
            this.ItemimgData.selectedData[this.typeIndex] = []
            this.choiceType[this.typeIndex].historyClass = [...data]
            this.choiceType[this.typeIndex].singleClass = ''
                for(let i in data){
                    if(data[i]){   
                        this.choiceType[this.typeIndex].singleClass += this.ClassItemData[i]+' ' 
                        this.ItemimgData.selectedData[this.typeIndex].push(this.ClassItemData[i])
                    }              
                }
                // console.log(this.choiceType[this.typeIndex].singleClass);
                this.$refs.masks.frameOff()  
        },
        submitImgs(){
            if(this.Complete){ //上传标志位            
                if(this.isComplete){
                    this.isComplete = false;
                    if(this.navtitle == '编辑相集'){
                        this.$refs.classtips.isTipsShow('正在上传',1);
                        let compare = getArrDifference(this.editOriginalData,this.ItemimgData.loca_imgurl); //与原数组比较获取删除和新增               
                        if(!compare.length){ //图片一样直接上传数据库
                            // console.log('数据库上传');
                            this.uploadData(this.ItemimgData.timeStamp); 
                        }else{ //图片上传数据库上传
                            // console.log('图片+数据库上传');
                            let DeleteData = getArrCrux(compare,'124.220.5.192')  //删除数据
                            let AddData = getArrCrux(compare,'blob:')             //新增数据
                            // console.log(DeleteData,AddData);
                            if(DeleteData.length){ //要删除的图片
                                this.$api.getData_RemoveGroupimg({DeleteData}).then(res=>{
                                    console.log(res.data);                                
                                })
                            }   
                            if(AddData.length){ //要新增的图片
                                this.uploadImg();
                            }else{
                                this.uploadData(this.ItemimgData.timeStamp); 
                            }   
                        }

                    }else{
                        this.$refs.classtips.isTipsShow('准备上传',1);
                        this.uploadImg();
                    }
                }       
            }else{
                    this.$refs.classtips.isTipsShow('请完善信息!',1000);
            }             
        },     
        async uploadImg(){ //压缩并上传大小图
            let cnt = 0;
            for(let i of this.ItemimgData.imgData){//压缩图
                const blob = await imageConversion.compressAccurately(i,200);
                let formatDataSmall = new FormData();
                formatDataSmall.append("file",blob, 'small-' + i.name)               
                await this._UpLoadImg(formatDataSmall,true).then(res=>{
                    this.ItemimgData.small_imgurl.push(BaseURL+"upload/"+this.userInfo.user+"/imgs/"+res.data.name);
                })
                cnt++;
                this.$refs.classtips.isTipsShow('图片上传中: '+ Math.round((cnt/(this.filesLength * 2)) * 100) + '%' ,1);
            }
            for(let i of this.ItemimgData.imgData){//原图
                cnt++;
                this.$refs.classtips.isTipsShow('图片上传中: '+ Math.round((cnt/(this.filesLength * 2)) * 100) + '%' ,1);
                let formatDataBig = new FormData();
                formatDataBig.append("file",i)
                await  this._UpLoadImg(formatDataBig,true).then(res=>{
                    this.ItemimgData.big_imgurl.push(BaseURL+"upload/"+this.userInfo.user+"/imgs/"+res.data.name);
                    this.ItemimgData.imgurl_name.push(res.data.name)
                })
            }
            this.$refs.classtips.isTipsShow('相关数据上传中' ,1);
            if(this.navtitle == '编辑相集'){ 
                this.uploadData(this.ItemimgData.timeStamp); 
            }else{ //新增
                this.uploadData(new Date().getTime()); 
            }
            
        },
        uploadData(time){   //上传总数据
              let obj = {
                title:this.ItemimgData.title,
                describe:this.ItemimgData.describe,
                class:this.ItemimgData.selectedData,
                imgurl_name:this.ItemimgData.imgurl_name,
                small_imgurl:this.ItemimgData.small_imgurl,
                big_imgurl:this.ItemimgData.big_imgurl,
                timeStamp:time//转化为时间戳
            }
            // console.log(obj);
            if(this.navtitle == '编辑相集'){ 
                this._getData_EditResourcesBooks(obj)
            }else{ //新增
                this._getData_AddResourcesBooks(obj)
            }         
        },
         /*******************网络请求*********************/
        _getData_ClassImgs(type){//请求图片分类数据
            this.$api.getData_ClassImgs(type).then(res=>{
                // console.log(res.data);
                this.ClassItemData = res.data
                if(this.navtitle == '编辑相集'){
                    let arr1 = []
                    let arr2 = []
                    
                    if(type == '相册子集'){
                        if(!this.choiceType[0].historyClass.length){
                            for(let i in this.ItemimgData.selectedData[0]){                      
                                for(let j in this.ClassItemData){
                                if(this.ClassItemData[j].includes(this.ItemimgData.selectedData[0][i])){
                                        arr1.push(Number(j))                              
                                }
                                }
                            }                       
                            for(let i in this.ClassItemData){
                                for(let j in arr1){
                                    if(i == arr1[j]){
                                        this.choiceType[0].historyClass.push(1)
                                        break;
                                    }
                                    if(j == arr1.length-1){
                                        this.choiceType[0].historyClass.push(0)
                                    }
                                }
                            }
                        }
                        this.$refs.masks.getLength(this.ClassItemData.length,this.choiceType[0].historyClass) 

                    }else if(type == '相册'){
                        if(!this.choiceType[1].historyClass.length){
                            for(let i in this.ItemimgData.selectedData[1]){                      
                                for(let j in this.ClassItemData){
                                if(this.ClassItemData[j].includes(this.ItemimgData.selectedData[1][i])){
                                        arr2.push(Number(j))                              
                                }
                                }
                            }  
                            for(let i in this.ClassItemData){
                                for(let j in arr2){
                                    if(i == arr2[j]){
                                        this.choiceType[1].historyClass.push(1)
                                        break;
                                    }
                                    if(j == arr2.length-1){
                                        this.choiceType[1].historyClass.push(0)
                                    }
                                }
                            }
                        }
                        
                        this.$refs.masks.getLength(this.ClassItemData.length,this.choiceType[1].historyClass) 
                    }


                }else{
                    this.$refs.masks.getLength(this.ClassItemData.length,this.choiceType[this.typeIndex].historyClass)  
                }            
            })
        },
        _UpLoadImg(data){//图片上传
            return this.$api.UpLoad_imgsData(data)
        },
        _getData_AddResourcesBooks(data){//图片相关数据上传
            this.$api.getData_AddResourcesBooks(data).then(res => {
                this.$refs.classtips.isTipsShow(res.data.message,200);
                setTimeout(() => {
                    this.$router.back();
                },1000)     
            })
        },
        _getData_EditResourcesBooks(data){
            this.$api.getData_EditResourcesBooks(data).then(res=>{
                this.$refs.classtips.isTipsShow(res.data.message,200);
                setTimeout(() => {
                    this.$router.back();
                },1000)  
            })
        }
    },
    created(){
        this.imgheight = window.innerWidth*0.24 
        if(this.$route.query.title == '编辑相集'){
            this.navtitle = this.$route.query.title
            this.buttitle = '保存'
            // console.log(this.$route.query.data);       

            for(let i in this.$route.query.data){
                if(i == 'class'){
                    for(let j in this.$route.query.data[i]){
                        this.ItemimgData.selectedData[j] = [...this.$route.query.data[i][j]]
                        for(let k in this.$route.query.data[i][j]){
                            this.choiceType[j].singleClass += this.$route.query.data[i][j][k]+' '     
                        }
                    }                
                }else
                    this.ItemimgData[i] = this.$route.query.data[i]
            }
            this.ItemimgData.loca_imgurl = [...this.$route.query.data.small_imgurl]
            this.editOriginalData = [...this.$route.query.data.small_imgurl]
            // console.log(this.ItemimgData);
        }
    
    }
}
</script>

<style lang="scss" scoped>
.load{
    width: 100vw;
    height: 100%;

    .content{
        width: 100%;
       .show{
             width: 100vw;
             height: 200px;
             line-height: 145px;
            //  margin: 5px auto;
             position: relative;
             overflow: auto;
             .show-item{
                float: left;
                width: 24%;
                background: rgba(163, 163, 163, 0.642);
                margin-top: 1%;
                margin-left: 1%;
                text-align: center;
                position: relative;
                img{
                    max-width: 100%;
                    max-height: 100%;
                }
                .font{
                    width: 25px;
                    height: 25px;
                    line-height: 25px;
                    position: absolute;
                    top: 0;right:0;
                    background: rgba(238, 238, 238, 0.6);
                }
             }
        } 
        .title{
            width: 100%;
            height: 50px;
            .text{
                width: 100%;
                height: 35px;  
                font-size: 13px;
            }
          
        }
        .inputs{
            width: 100%;
            height:155px;
            font-size: 13px;
            margin-bottom: 15px;
        }   
        .class{
             width: 100%;
             height:52px;
             line-height: 52px;
             font-size: 16px;
             background: #eee;
             position: relative;
            //  margin-top: 15px;

            div{
             width: 90%;
             overflow: hidden;
             white-space: nowrap;
             text-overflow: ellipsis;
            }
             .font{
                 display: block;
                 position: absolute;
                 right: 0;top: 0;
             }
             div:first-child{
                margin-top: 15px;
             }
         }

    }
    .but{
        width: 100%;
        height: 52px;
        line-height: 52px;
        border-top: 2px #eee solid;
        position: absolute;
        bottom: 0;
        text-align: center;
        div{
            width: 95%;
            height: 44px;
            line-height: 44px;
            margin: 4px auto;
            color: rgb(255, 255, 255);
            background-color: rgb(0, 0, 0);
        }
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
        .zao{
        width: 100vw;
        height: 100vh;
        position: absolute;
        top: 0;
        background: rgba(0, 0, 0, 0.1);
    }
}
</style>