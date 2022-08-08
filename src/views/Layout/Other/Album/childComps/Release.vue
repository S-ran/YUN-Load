<template>
    <div class="release">
        <nav-bar class="nav-bar">
            <div slot="left" class="font icon-fanhui" @click="backAlbum"></div>
            <div slot="center" style="font-size:22px;font-weight: bolder;"><i>{{navtitle}}</i></div>
        </nav-bar> 
        <div class="release-main">
            <!-- 图片: -->
            <div class="main-img">
                 <!-- 用于上传文件 -->
	            <input class="file-upload" type="file" @change="lookImg"  name="" style="display: none;"/>
                <div>
                    <img :src="ItemimgData.loca_imgurl" v-if="ItemimgData.loca_imgurl" @click="imgBigShow = true">    
                    <div class="font icon-tupiantianjia" v-else @click="upLoadOn">
                    </div>    
                    <el-button class="but" type="danger" v-show="ItemimgData.loca_imgurl" @click="clearInputFile" icon="el-icon-delete" circle/>     
                </div>    
            </div>
            <!-- 图片标题 -->
            <div class="main-title">
                <el-input class="text" placeholder="请输入图片标题不超过12字"
                          v-model="ItemimgData.title" @input.native="onChang" clearable>
                </el-input>        
            </div>
            <!-- 图片描述 -->
            <el-input type="textarea" placeholder="请输入图片描述" show-word-limit class="inputs"
                      maxlength="300" v-model="ItemimgData.describe" :autosize="{minRows}" />
            <!-- 图片分类 -->
            <div class="main-class" @click="getClass">
                <div>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;相册分类-
                    <span style="color:rgba(255, 190, 238)" v-if="ItemimgData.singleClass">{{ItemimgData.singleClass}}</span>
                    <span style="color:rgba(255, 190, 238)" v-else>选择</span>
                </div>
    
                    
                <span class="font icon-qianwang"></span>
            </div>
        </div>

        <div class="additem">
            <div @click="submitImgs">{{buttitle}}</div>
        </div>
        <!-- 遮罩 -->
        <div class="zao" v-show="!isComplete"></div>
        <!-- 分类弹框 -->
        <Masks ref="masks" :ClassItemData = 'ClassItemData' @frameSend = 'frameSend' />
        <!-- 大图 -->
        <div class="bigimg" v-show="imgBigShow" @click="imgBigShow = false">
                <img :src="ItemimgData.big_imgurl" v-if="ItemimgData.big_imgurl">    
                <img :src="ItemimgData.loca_imgurl" v-else>    
        </div>
        <!-- 提示弹框 -->
        <Tips ref="classtips"/>
    </div>
</template>

<script>
import {BaseURL} from "@/network/request"
import {mapState} from 'vuex'
import * as imageConversion from 'image-conversion'

import NavBar from '@/components/common/NavBar'

import Masks from '../../../../../components/content/Masks/index.vue'
import Tips from "@/components/common/Tips"

export default {
    components:{
        NavBar,Masks,Tips
    },
    data(){
        return{
            navtitle:'发布图片',
            buttitle:'发布图片',
            ClassItemData:[], //分类数据                  
            minRows:7,           
            historyClass:[],  //历史分类
            ItemimgData:{
                title:'',         //标题数据   
                describe:'',      //描述数据
                singleClass:'',   //分类展示
                class:[],         //选中分类数据
                loca_imgurl:'',   //本地图片链接
                small_imgurl:'',  //压缩图链接
                big_imgurl:'',    //原图链接
                imgurl_name:'',   //图片原名称
                timeStamp:'',      
            },         
            imgBigShow:false, //大图预览
            editFlage:false,  //是否为编辑
            isComplete:true   //是否在上传
        }
    },
    computed:{
        Complete(){
            if(this.ItemimgData.loca_imgurl && this.ItemimgData.title && this.ItemimgData.class.length){
                return true
            }else 
             return false
        },
        ...mapState('loginModule',['userInfo'])
    },
    methods:{
        backAlbum(){//返回上一级
            this.$router.back()
        },
        getClass(){ //获取分类
            this.$refs.masks.classShow = true
            this.$refs.masks.SetType('相片')
            this._getData_ClassImgs('相片')
        },
        onChang(){ //输入限制
           if(this.ItemimgData.title.length<=12){
               this.temp = this.ItemimgData.title
           }else{
                this.ItemimgData.title = this.temp
           }
        },
        frameSend(data){//获取选中分类
            this.ItemimgData.class = []
            this.ItemimgData.singleClass = ''
            this.$refs.masks.classShow = false
            for(let i in data){
                if(data[i]){     
                        this.ItemimgData.singleClass += this.ClassItemData[i]+' '  
                        this.ItemimgData.class.push(this.ClassItemData[i]);
                }
            }
            this.historyClass = [...data];
        },
        upLoadOn(){//选择本地图片
            document.querySelector('.file-upload').click();
        },
        clearInputFile(){//清空上一次的文件内容
            this.ItemimgData.loca_imgurl = ''  
            let file = document.querySelector('.file-upload'); 
            let form = document.createElement('form'); 
            document.body.appendChild(form); 
            let pos = file.nextSibling; 
            form.appendChild(file); 
            form.reset(); 
            pos.parentNode.insertBefore(file, pos); 
            document.body.removeChild(form); 
        },
        lookImg(){    //生成本地图链接       
            let File = document.querySelector('.file-upload').files[0]; 
            let URL = window.URL || window.webkitURL;
            let imgURL = URL.createObjectURL(File);
            this.ItemimgData.loca_imgurl =  imgURL
        },
        submitImgs(){ //发布
            if(this.Complete){        
                if(this.isComplete){//上传标志位   
                    this.isComplete = false;
                    this.$refs.classtips.isTipsShow('准备资源中...',1);
                    if(this.buttitle == '保存'){
                        if(this.ItemimgData.small_imgurl == this.ItemimgData.loca_imgurl){ //图片一样直接上传数据库
                            // console.log(this.ItemimgData);
                            // console.log('数据库上传');
                            this._getData_ImgsEdit({value:this.ItemimgData})
                        }else{ //图片上传数据库上传
                            // console.log('图片+数据库上传');
                            this.uploadImg();
                        }
                    }else{
                        this.uploadImg();
                    }
                }      
            }else{
                    this.$refs.classtips.isTipsShow('请完善信息!',1000);
                }  

        },     
        async uploadImg(){ //压缩并上传大小图

            //获取图片数据describe
            let File = document.querySelector('.file-upload').files[0];
            console.log(File);
            //小图
            const blob = await imageConversion.compressAccurately(File,300);
            let formatDataSmall = new FormData();
            formatDataSmall.append("file",blob, 'small-' + File.name)
            await this._UpLoadImg(formatDataSmall).then(res=>{
                 this.ItemimgData.small_imgurl = BaseURL+"upload/"+this.userInfo.user+"/img/"+res.data.name;       
            })
            

            //大图
            let formatDataBig = new FormData();
            formatDataBig.append("file", File)
            console.log(formatDataBig);
            // this.$refs.classtips.isTipsShow('图片上传中: '+Strip+'%' ,1);

            await this._UpLoadImg(formatDataBig).then(res=>{
                 this.ItemimgData.big_imgurl = BaseURL+"upload/"+this.userInfo.user+"/img/"+res.data.name;
                 this.ItemimgData.imgurl_name = res.data.name;       
            })
            if(this.navtitle == '编辑图片')
                this._getData_ImgsEdit({value:this.ItemimgData}); 
            else 
                this.uploadData(new Date().getTime()); 


        },
        uploadData(time){   //上传总数据
              let obj = {
                title:this.ItemimgData.title,
                describe:this.ItemimgData.describe,
                class:this.ItemimgData.class,
                imgurl_name:this.ItemimgData.imgurl_name,
                small_imgurl:this.ItemimgData.small_imgurl,
                big_imgurl:this.ItemimgData.big_imgurl,
                timeStamp:time//转化为时间戳
            }
            // console.log(obj);
            this._getData_AddResourcesImgs(obj)
        },
        clearisComplete(){
            setTimeout(() => {
                this.isComplete = true;
            },790)
        },
        /*******************网络请求*********************/
        _getData_ClassImgs(type){//请求图片分类数据
            this.$api.getData_ClassImgs(type).then(res=>{
                this.ClassItemData = res.data
                if(this.navtitle == '编辑图片'){
                    let arr1 = []
                    
                    if(!this.historyClass.length){
                       for(let i in this.ItemimgData.class){                      
                                for(let j in this.ClassItemData){
                                if(this.ClassItemData[j].includes(this.ItemimgData.class[i])){
                                        arr1.push(Number(j))                              
                                }
                                }
                            }                      
                            for(let i in this.ClassItemData){
                                for(let j in arr1){
                                    if(i == arr1[j]){
                                        this.historyClass.push(1)
                                        break;
                                    }
                                    if(j == arr1.length-1){
                                         this.historyClass.push(0)
                                    }
                                }
                            } 
                    }      
                    this.$refs.masks.getLength(this.ClassItemData.length,this.historyClass) 

                }else{
                    this.$refs.masks.getLength(this.ClassItemData.length,this.historyClass)  
                }
            })
        },
        _getData_AddResourcesImgs(data){//图片相关数据上传
            this.$api.getData_AddResourcesImgs(data).then(res => {
                this.clearisComplete();
                this.$refs.classtips.isTipsShow(res.data.message,800);
                setTimeout(() => {
                    this.$router.back();
                },1000)     
            })
        },
        _getData_ImgsEdit(data){ //编辑请求
            this.$api.getData_ImgsEdit(data).then(res => {
                this.$refs.classtips.isTipsShow(res.data.message,800);
                setTimeout(() => {
                    this.$router.back();
                },1000) 
            })
        },
        _UpLoadImg(data){//图片上传
            return this.$api.UpLoad_imgData(data) 
        }
    },
    created(){
        if(this.$route.query.title == '编辑图片'){
            this.navtitle = this.$route.query.title
            this.buttitle = '保存'
            for(let i in this.$route.query.data){
                if(this.ItemimgData[i] == 'class'){
                    this.ItemimgData.class = [...this.$route.query.data[i]]
                }else
                    this.ItemimgData[i] = this.$route.query.data[i]
            }
            this.ItemimgData.loca_imgurl = this.$route.query.data.small_imgurl
            for(let i in this.$route.query.data.class){
                this.ItemimgData.singleClass += this.$route.query.data.class[i]+' '
            }
            
            this.editFlage = true
        }
    }
}
</script>

<style lang="scss" scoped>
.release{
    width: 100%;
    height: 100vh;
    font-size: 12px;
    .release-main{
        width: 100%;
        height: calc(100% - 52px); 
        .main-img{
             width: 100%;
             height: 150px;
             line-height: 145px;
            //  margin: 5px auto;
             position: relative;
             div{
                  width: 145px;
                  height: 145px;
                  position: absolute;
                  top: 50%;left: 50%;
                  transform: translate(-50%,-50%);     
                  text-align: center;
                  font-size: 40px;
                  background: rgba(0, 0, 0, 0.905);
                //   overflow: hidden;
                div{
                    width: 145px;
                    height: 145px;
                    background: rgba(180, 177, 177, 0.905);
                }
                img{
                        max-width:  100%;
                        max-height:  100%;
                }   
                .but{
                        position: absolute;
                        right: 0;
                        bottom: 0;
                        transform: translate(120%,0);
                }      
             }

        }        
        .main-title{
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
        }   
        .main-class{
             width: 100%;
             height:52px;
             line-height: 52px;
             font-size: 16px;
             background: #eee;
             position: relative;
             margin-top: 15px;

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
    .additem{
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
    .zao{
        width: 100vw;
        height: 100vh;
        position: absolute;
        top: 0;
        background: rgba(0, 0, 0, 0.1);
    }
}
</style>