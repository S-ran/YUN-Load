<template>
    <div>
            <!-- 隐藏窗口 -->
            <div class="class-show" v-show="classShow">
                <div class="title">
                    请选择分类
                    <div v-if="ClassItemData[0] !== '全部'" @click="isAddShow = true">+</div>
                </div>
                <div class="config" v-infinite-scroll="load" infinite-scroll-distance="20">
                    <div :class="{active:isActivePart[index]}" v-for="(item,index) in ClassItemData" 
                         :key="index" @click="onPart(index)">
                        {{item}}
                    </div>
                </div>
                <div class="but">
                    <div @click="frameOff">取消</div>
                    <div @click="frameSend">确定</div>
                </div>
                 
            </div>
            <!-- 输入弹框 -->
            <div class="frame" v-show="isAddShow">
                <div class="frame-item">
                    <div class="title">新建相册分类
                        <div class="font icon-cuowuguanbiquxiao" @click="addOff"></div>
                    </div>
                    <div class="transport">
                        <input type="text" v-model="input" placeholder="输入分类名称,不超过12个字">
                    </div>
                    <div class="but" :style="activeStyle" @click="submitAddClass">
                        确定
                    </div>
                    
                </div>
            
            </div>
            <!-- 输入弹框 -->
            <div class="frame" v-show="isAddShow">
                <div class="frame-item">
                    <div class="title">新建相册分类
                        <div class="font icon-cuowuguanbiquxiao" @click="addOff"></div>
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
            <div class="mask" v-show="classShow" @click="frameOff"></div>
             <!-- 提示弹框 -->
            <Tips ref="classtips"/>
    </div>
</template>

<script>
import Tips from "@/components/common/Tips"

export default {
    components:{
        Tips
    },
    props:{  
           ClassItemData:{type:Array,default(){return []}},//分类数据
           historyClass:{type:Array,default(){return []}},//历史数据
    },
    data(){
        return{
            choiceType:'',          //分类类型
            input:'',
            isAddShow:false,        //添加弹框isshow  
            isButstyle:false,       //提交按钮样式

            classShow:false,        //分类弹窗
            isActivePart:[],        //选择按钮样式
        }  
    },
    computed: {
	    activeStyle() {
			return this.isButstyle ? {'background': 'rgb(0, 0, 0)'} : {'background': 'rgb(229, 229, 229)'}
      },
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
        frameOff(){//关闭分类选择弹窗
            this.classShow = false;
            this.isActivePart = [];
        },
        load(){},
        SetType(data){
            this.classShow = true 
            this.choiceType = data
        },
        getLength(length,flage_data){
            // console.log(flage_data);
            if(flage_data.length){
                this.isActivePart = [...flage_data] 
            }else{
                this.isActivePart = []
                for(let i=0;i<length;i++){
                    this.isActivePart.push(0)
                } 
            }
        
        },
        onPart(index){//选择部分分类     
            if(this.isActivePart[index])
                this.isActivePart.splice(index,1,0);     
            else 
                this.isActivePart.splice(index,1,1); 
        },
        frameSend(){
            // console.log(this.isActivePart);
            this.$emit('frameSend',this.isActivePart)
        },

        addOff(){//关闭清空弹窗
            this.isAddShow = false
            this.input = ''
        },        
        submitAddClass(){//请求添加分类
            this._getData_AddClassImgs({
                value:this.input,
                type:this.choiceType
            });
        },
        _getData_AddClassImgs(value){//添加图片分类
                this.$api.getData_AddClassImgs(value).then(res=>{
                    this.addOff();
                    this.frameOff();
                    this.$refs.classtips.isTipsShow('添加成功!',1000);
                })
        },
        
    }     
}
</script>

<style lang="scss" scoped>
    .class-show{
        width: 100%;
        height: 340px;
        position: absolute;
        bottom: 0;
        background: white;
        z-index: 9;
        .title{
            width: 100%;
            height: 40px;
            line-height: 40px;
            font-size: 15px;
            text-align: center;
            position: relative;
            div{
                width: 40px;
                height: 40px;
                font-size: 30px;
                line-height: 40px;
                position: absolute;
                right: 0;top: 0;
            }
        }
        .config{
            width: 100%;
            height: 249px;
            border-bottom: 1px #eee solid;
            // display: flex; 
            // flex-flow: wrap row;
            overflow: auto;
            font-size: 10px;
            div{
                float: left;
                 width: 48%;
                 height: 35px;
                 line-height: 35px;
                 text-align: center;
                 background: #eee;
                 margin:1%;     
            }
            
        }
        .but{
            display: flex;
            height: 50px;
            div{
                flex: 1;
                line-height: 50px;
                text-align: center;
            }
            div:last-child{
                background: rgb(0, 0, 0);
                color: #fff;
            }
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
    .mask{
        width: 100%;
        height: 100%;
        position:absolute; 
        top: 0;
        background: rgb(0, 0, 0,.3);  
    }
.active{
    box-sizing:border-box;
    border: 1px solid #000;
}
</style>