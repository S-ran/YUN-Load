export default{
    namespaced:true,
    state: {
        userInfo:{
            user:'',    //账号
            token:'',   //token
            data:{
                headportrait:'',    //头像
                nickname:'',        //昵称
                background_imgurl:''//主页背景图
            }
        }
    },
    mutations:{
        //设置用户信息
        setUser(state,obj){
            state.userInfo.user = obj.user;
            state.userInfo.token = obj.token;
            // console.log(state.userInfo);
        },
        setNickname(state,nickname){
            state.userInfo.data.nickname = nickname;
        },
        setHeader(state,headportrait){//设置头像        
            state.userInfo.data.headportrait = headportrait;
        },
        setBackground(state,url){//设置背景
            state.userInfo.data.background_imgurl = url;
        },
        //清空
        clearUser(state){
            state.userInfo = {
                user:'',    //账号
                token:'',   //token
                data:{
                    headportrait:'',    //头像
                    nickname:'',        //昵称
                    background_imgurl:''//主页背景图
                }
            }
        }
    },
    getters: {
    },
    actions: {
    }
}