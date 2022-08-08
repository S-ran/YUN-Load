<template>
    <div class="fication">
        <nav-bar class="nav-bar">
            <div slot="left" class="font icon-fanhui" @click="backUser"></div>
            <div slot="center" style="font-size:16px;">
                <i>{{isType}}分类管理</i>
            </div>
            <div  slot="right"  class="nav-bar-right " @click="swperValue = !swperValue">
                {{isType}}
                <span class="font icon-xiala" style="font-size:15px;"></span>       
            </div>
        </nav-bar> 
        <div class="additem">
            <div @click="frameON">
               新建{{isType}}分类
            </div>
        </div>
        <!-- 分类列表 -->
        <div class="sortswitch">
            <span>&nbsp;&nbsp;&nbsp;点击开关可调整排序&nbsp;&nbsp;&nbsp;</span>
            <el-switch v-model="isDraggable" active-color="#13ce66" inactive-color="#ff4949"/>

            <div class="type" v-show="swperValue">
                <div v-for="(item,index) in choiceType" :key="index" @click="SwitchType(index)">
                {{item.name}}
            </div>

            </div>
        </div>
        <ul v-infinite-scroll="load">
            <draggable  :list="ClassItemData" :disabled="!isDraggable" @update="datadragEnd" v-if="ClassItemData.length">
                <li v-for="(item,index) in ClassItemData" :key="index" >
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{item}}
                    <div class="font icon-del" @click="submitRemoveClass(index)"></div>
                </li>
                
            </draggable>
            <div class="tips font icon-zanwushuju" v-else>
                    暂无数据
            </div>
        </ul>

        <!-- 输入弹框 -->
        <div class="frame" v-show="isShow">
            <div class="frame-item">
                <div class="title">新建相册分类
                    <div class="font icon-cuowuguanbiquxiao" @click="frameOff"></div>
                </div>
                <div class="transport">
                    <input type="text" v-model="input" placeholder="输入分类名称,不超过12个字">
                </div>
                <div class="but" :style="activeStyle" @click="submitAddClass">
                    确定
                </div>
                 
            </div>
           
        </div>
        <!-- 遮罩 -->
        <div class="mask" v-show="isShow" @click="frameOff"></div>
        <!-- 提示弹框 -->
        <Tips ref="classtips"/>

        <!-- 判断弹框 -->
        <Judge ref="judgeLoginOut" @Sendconfirm = 'Sendconfirm'/>       </div>
</template>

<script>
import draggable from 'vuedraggable'

import Tips from "@/components/common/Tips"
import Judge from '@/components/common/Judge'
import NavBar from '@/components/common/NavBar'

export default {
    components:{
        draggable,NavBar,Tips,Judge
    },      
    data(){
        return{
            isShow:false,     //添加弹框isshow  
            input:'',         //输入框绑定值
            temp:'',          //输入框绑定暂存值
            isButstyle:false, //提交按钮样式
            choiceType:[
                {name:'相片',title:'相片'},
                {name:'相册',title:'相册'},
                {name:'标签',title:'相册子集'}],
            choiceTypeInedx:0,
            ClassItemData:[], //分类数据
            ClassItemCloseData:[], //相集分类数据


            isDraggable:false,
            removeIndex:0,


            swperValue:false,
            typeText:'相片'
        }
    },
    computed: {
	    activeStyle() {
			return this.isButstyle ? {'background': 'rgb(0, 0, 0)'} : {'background': 'rgb(229, 229, 229)'}
      },
        isType(){
            return this.choiceType[this.choiceTypeInedx].name
        }
    },
    watch:{
       input(){
           if(this.input)this.isButstyle = true;
           else this.isButstyle = false;
           if(this.input.length<=12){
               this.temp = this.input
           }else{
                this.input = this.temp
           }
       }
    },
    methods:{
        backUser(){//返回上一级
            this.$router.back()
        },
        frameON(){//添加分类
            this.isShow = true
             
        },
        frameOff(){//关闭清空弹窗
            this.isShow = false
            this.input = ''
        },
        submitAddClass(){//请求添加分类
            let obj = {
                value:this.input,
                type:this.typeText
            }
            this._getData_AddClassImgs(obj);          
        },
        submitRemoveClass(index){//删除图片分类确认删除?
            // console.log(this.ClassItemData[index]);
            this.removeIndex = index;
            this.$refs.judgeLoginOut.isTipsShow('确认删除?',1);
            
        },
        Sendconfirm(){//确认删除
            let obj = {
                index:this.removeIndex,
                type:this.typeText
            }
            this._getData_RemoveClassImgs(obj)         
        },
        load(){

        }, 
        datadragEnd (evt) {//拖拽
            // evt.preventDefault();
            // console.log('拖动前的索引 :' + evt.oldIndex)
            // console.log('拖动后的索引 :' + evt.newIndex)
            this._getData_SortClassImgs({
                value:this.ClassItemData,
                type:this.typeText
            })
        },

        SwitchType(index){//切换类型       
            this.choiceTypeInedx = index
            this.typeText = this.choiceType[index].title
            this.swperValue = false
            this._getData_ClassImgs(this.typeText)
        },
        /*******************网络请求*********************/
        _getData_ClassImgs(type){//请求图片分类数据
            this.$api.getData_ClassImgs(type).then(res=>{
                // console.log(res.data);
                this.ClassItemData = res.data
            })
        },
        _getData_AddClassImgs(data){//添加图片分类
                this.$api.getData_AddClassImgs(data).then(res=>{
                    this.frameOff();
                    this.$refs.classtips.isTipsShow('添加成功!',1000);
                    this.ClassItemData = res.data
                })
        },
        _getData_RemoveClassImgs(data){//删除图片分类
            this.$api.getData_RemoveClassImgs(data).then(res => {
                 this.ClassItemData = res.data
                 this.$refs.classtips.isTipsShow('已删除',1000);
             })
        },
        _getData_SortClassImgs(data){ //分类排序
            this.$api.getData_SortClassImgs(data).then(res => {
                // console.log(res);
             })
        }


    },
    created(){
            this._getData_ClassImgs(this.typeText)
    }
}
</script>

<style lang="scss" scoped>
.nav-bar-right{
    font-size: 15px;
    text-align: center;
}
.fication{
    position: relative;
    width: 100vw;
    height: 100vh;
    .sortswitch{
        width: 100%;
        height: 36px;
        line-height: 36px;
        color: rgb(200, 197, 197);
        border-bottom: 2px solid #eee;
        position: relative;
        .type{
            width: 60px;
            height: 150px;
            position: absolute;
            right: 0;top: 0;
            background: #fff;
            z-index: 9;
            color: black;
            div{
              height: 50px;  
              line-height: 50px;
              text-align: center;
              box-sizing: border-box; 
              border-bottom: 2px solid #eee;
            }
        }
    }
    ul{
        width: 100%;
        height: calc(100% - 140px);
        overflow: auto;
        li{
            width: 100%;
            height: 60px;
            line-height: 60px;
            font-size: 15px;
            border-bottom: 2px solid #eee;
            position: relative;
            div{
                position: absolute;
                width: 60px;
                height: 60px;
                line-height: 60px;
                top: 0;right: 0;
                text-align: center;
            }
        }
        .tips{
            width: 100%;
            height: 60px;
            line-height: 60px;
            text-align: center;
        }
    }
    .mask{
        width: 100%;
        height: 100%;
        position:absolute; 
        top: 0;
        background: rgb(0, 0, 0,.4);
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
.frame{
    width: 100%;
    height: 100%;
    position:absolute;
    top: 0;
    .frame-item{
        color: rgb(0, 0, 0);
        z-index: 99;
        width: 90vw;
        height: 200px;
        background: rgb(255, 255, 255);
        position: absolute;
        top: 20%;right: 50%;
        transform: translate(50%,0);
        .title{
            width: 100%; 
            height: 50px;  
            line-height: 50px;
            text-align: center; 
            font-size: 20px;
            font-weight: bolder;  
            position: relative;  
            div{
                position:absolute;
                right: 4px;
                top: 0;
                line-height: 30px;
            } 
        }
        .transport{
            width: 100%; 
            height: 100px;
            line-height: 100px;
            text-align: center; 
            input{
                width: 90%;
                height: 35px;  
                font-size: 15px;
            }
        }
        .but{
          width: 100%; 
          height: 50px;
          line-height: 50px;
          text-align: center;
          font-size: 15px;
          color: #fff;
          background: rgb(229, 229, 229); 
          position: absolute;
          bottom: 0;
        }
    }

}


</style>