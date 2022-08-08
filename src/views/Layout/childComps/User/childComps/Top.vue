<template>

        <div class="user-item">
            <div class="user-content">
                <div class="imgF">
                    <!-- <div>
                        <img :src="userInfo.headportrait" alt="">
                    </div> -->
                    <!-- <div>
                        <div class="font icon-chuangjiantianjiapiliangtianjia" @click="uploadHeadportrait"></div>
                    </div> -->            
                    <div>  
                        <!-- <el-upload  class="avatar-uploader"
                                    action="http://124.220.5.192/Xy_Request/head_load"
                                    :show-file-list="false"
                                    :on-success="handleAvatarSuccess"
                                    >
                            <img v-if="userInfo.data.headportrait" :src="userInfo.data.headportrait" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload> -->
                        <div class="head-uploader"  @click="switchHead">
                            <img v-if="userInfo.data.headportrait" :src="userInfo.data.headportrait" class="avatar">
                            <i v-else class="font icon-chuangjiantianjiapiliangtianjia"></i>
                            
                            <!-- 用于上传文件 -->
	                        <input class="head-upload" type="file" @change="upladHead"  name="" style="display: none;"/>

                        </div>
                    </div>                   
                </div>   
                <i style=" color: #eee;">{{userInfo.data.nickname}}</i> <br>            
                <i class="font icon-tuichudenglu" @click="LoginOut"></i>
            </div>
            <div class="top-but">
                <el-button type="success" size='mini' @click="switchBackground">更换背景</el-button>
                <!-- 用于上传文件 -->
	            <input class="background-upload" type="file" @change="upladBackground"  name="" style="display: none;"/>
            </div>
            <!-- 判断弹框 -->
            <Judge ref="judgeLoginOut" @Sendconfirm = 'Sendconfirm'/>   
        </div>
</template>

<script>
import * as imageConversion from 'image-conversion'

import {BaseURL} from "@/network/request"
import {mapState,mapMutations} from 'vuex'
import Judge from '@/components/common/Judge'
    export default {
         components:{Judge},
        props:['isCollapse'],
        data() {
            return {
                
            };
        },
        computed:{
            ...mapState('loginModule',['userInfo']),
        },
        methods:{  
        ...mapMutations('loginModule',['clearUser']),  
        LoginOut(){ //退出登录
            this.$refs.judgeLoginOut.isTipsShow('退出登录?',1);
        },
        Sendconfirm(){//确认退出
            this.clearUser();
            localStorage.removeItem('user');
            this.$router.push('/login')
        },
        switchHead(){//切换头像
            document.querySelector('.head-upload').click();
        },
        async upladHead(){ //上传头像
            let File = document.querySelector('.head-upload').files[0]
            const blob = await imageConversion.compressAccurately(File,300);
            let formatData = new FormData()
            formatData.append("file",blob, 'small-' + File.name)
            this.$api.UpLoad_headData(formatData).then(res => {
                 this.$emit('handleUpload',BaseURL+'upload/'+this.userInfo.user+'/head/'+res.data.name)
            })   
        },
        switchBackground(){//切换背景
            document.querySelector('.background-upload').click();
        },
        async upladBackground(){//上传背景
            let File = document.querySelector('.background-upload').files[0]
            const blob = await imageConversion.compressAccurately(File,300);
            let formatData = new FormData()
            formatData.append("file",blob, 'small-' + File.name)
            this.$api.UpLoad_backgroundData(formatData).then(res => {
                 this.$emit('backgroundUpload',BaseURL+'upload/'+this.userInfo.user+'/background/'+res.data.name)
            })   
        }
      }
}
</script>

<style lang="scss" scoped>
.user-item{
    width: 100%;
    height: 100%;
    // line-height: 10rem;
    text-align: center;
    position: relative;
    .user-content{
    //  line-height: 100%;   
        background: rgba(0, 0, 0, 0.411);
         border-radius: 30%;
        position: absolute;
        top: 50%;left: 50%;
        /*transform来改变当前偏移位置，往回偏移自生的一半*/
        transform: translate(-50%,-50%); 
        text-align: center;
        font-size: 22px;
        .icon-tuichudenglu{
            font-size: 30px;
            background-color:rgba(246, 246, 246, 0.5) ;
            border-radius: 20%;
        }
        .imgF{
            // margin-bottom: 30px;
            div{
                width: 80px;
                height: 80px;
                line-height:80px ;
                border: 1px solid #eee;
                border-radius: 40%;
                img{
                    width: 80px;
                    height:80px;
                    border-radius: 40%;
                    object-fit:cover;
                }
                i{
                   
                    width: 80px;
                    height: 80px;
                    line-height:80px ;
                }
            }
        }  
    }

}

.top-but{
    position: absolute;
    right: 0;
    opacity: .6;
}

.icon-chuangjiantianjiapiliangtianjia{
    background: #eee;
}

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 20px;
    color: #8c939d;
    width: 5rem;
    height: 5rem;
    line-height: 5rem;
    text-align: center;
  }
  .avatar {
    width: 5rem;
    height: 5rem;
    display: block;
  }
</style>