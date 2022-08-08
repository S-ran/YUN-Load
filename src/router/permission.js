import router from './index'
import store from '../store/index'

router.beforeEach((to,from,next)=>{ 
  if(to.matched.some(ele=>ele.meta.isLogin)){//判断是否需要登陆
    let token = store.state.loginModule.userInfo.token;
    // console.log(token);
    token? next():next('./login');
  }else next() 

})