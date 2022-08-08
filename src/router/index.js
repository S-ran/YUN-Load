import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

//获取原型对象上的push函数
const originalPush = VueRouter.prototype.replace
//修改原型对象中的push方法
VueRouter.prototype.replace = function push(location) {
   return originalPush.call(this, location).catch(err => err)
}

import Login from '../views/Login'
import Layout from '../views/Layout'


const routes = [
    //配置映射关系
    {
      path: '/',
      component:Layout,
      meta:{//路由元信息
      isLogin:true
      },
      children:[
        {
          path:'',
          redirect:'/user'
        },
        {
          path:'/user',
          component:()=> import('@/views/Layout/childComps/User')
        },
        {
          path:'/find',
          component:()=> import('@/views/Layout/childComps/Find')
        },
        {
          path:'/follow',
          component: ()=> import('@/views/Layout/childComps/Follow')
        },
        {
          path:'/cation',
          component:()=> import('@/views/Layout/childComps/Cation')
        },
        {
          path:'/download',
          component:()=> import('@/views/Layout/childComps/Download')
        },



        {
          path:'/album',
          component:()=> import('@/views/Layout/Other/Album')
        },
        {
          path:'/release',
          component:()=> import('@/views/Layout/Other/Album/childComps/Release')
        },


        {
          path:'/phaseset',
          component:()=> import('@/views/Layout/Other/Phaseset')
        },
        {
          path:'/group',
          component:()=> import('@/views/Layout/Other/Phaseset/childComps/Group')
        },


        {
          path:'/classification',
          component:()=> import('@/views/Layout/Other/Classification')
        },

        {
          path:'/setup',
          component:()=> import('@/views/Layout/Other/Setup')
        }
      ]
    },
    {
      path:'/login',
      name:'Login',
      component:Login
    },
    {
      path:'/register',
      name:'Register',
      component:() =>import('@/views/Register')
    }
]

const router = new VueRouter({
  // base: process.env.BASE_URL,
  base: 'dist',
  // mode: 'history',
  mode: 'hash',
  routes,
  
})

export default router
