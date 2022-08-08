<template>
    <div>
        <nav-bar class="nav-bar">
            <div slot="left" class="font icon-wode"></div>
            <div slot="center" style="font-size:17px;"><i>我的</i></div>
        </nav-bar> 
        <div class="user">
            <div class="top-item">
                <Top @handleUpload='handleUpload' @backgroundUpload='backgroundUpload'/>
            </div>
            <div class="center-item"> 
                <Center/>
            </div>
            <div class="bottom-item">
        
            </div>

        </div>
       
    </div>

</template>

<script>
import {mapState,mapMutations} from 'vuex'
import NavBar from '@/components/common/NavBar'

import Top from './childComps/Top'
import Center from './childComps/Center'

export default {
    components:{
        NavBar,Top,Center
    },
    data(){
        return {
           
        }
    },
    computed:{
        ...mapState('loginModule',['userInfo']),
    },
    methods:{
        //映射store的mutations方法
        ...mapMutations('loginModule',['setNickname','setHeader','setBackground']),
        handleUpload(headportrait){ //上传头像
            this._getSetheadportrait({headportrait})
        },
        backgroundUpload(data){ //上传背景
            let background_imgurl = "url("+data+")";
            // console.log(background_imgurl);
            this._getData_background({background_imgurl});
        },
        SetBackImgs(){//设置背景       
            let Ground = document.querySelector('.top-item');
            Ground.style.backgroundImage = this.userInfo.data.background_imgurl;
        },
        
        /*******************网络请求*******************/
        _getSetheadportrait(data){ //设置头像
            this.$api.getSetheadportrait(data).then(res => {
                this.setHeader(res.data)   //存储到vuex
            })
        },
        _getData_background(data){ //设置背景图
            this.$api.getData_background(data).then(res => {
                // console.log(res);
                this.setBackground(res.data)   //存储到vuex
                this.SetBackImgs();
            })
        },
        _getLoginConfig(){ //请求头像昵称背景图
            this.$api.getLoginConfig().then(res => {
                // console.log(res);
                this.setHeader(res.data.data.headportrait)   //存储到vuex
                this.setBackground(res.data.data.background_imgurl)   //存储到vuex
                this.setNickname(res.data.data.nickname)   //存储到vuex
                this.SetBackImgs();
                // console.log(this.userInfo);
            })
        }
    },
    /*******************生命周期*******************/
    created(){
        this._getLoginConfig()
        setTimeout(()=>{
            this.SetBackImgs();
        },300)
    }
}
</script>

<style lang="scss" scoped>
.user{
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.483);
}
.top-item{
    width: 100vw;
    height: 15rem;
    background: #fff;
    // background-image: url('https://gimg2.baidu.com/image_search/src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20191110%2F9aad2c59dbf34aa6a1cfef6a0775d139.jpeg&refer=http%3A%2F%2F5b0988e595225.cdn.sohucs.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1655884802&t=88401845491fa671554578cb381cf30d');
    background-repeat: no-repeat;
    background-size: cover;
    /*居中显示*/
    background-position: center;
    position: relative;
    // border-bottom: 7px rgba(181, 182, 182, 0.7) solid ;
}
.center-item{
    width: 100vw;
    height: 24rem;
}
.bottom-item{
    width: 100vw;
    height: 24rem;
}
</style>