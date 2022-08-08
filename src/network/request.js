import axios from 'axios'

const BaseURL = 'https://www.relieved.wiki/';

export function request(config){
    //创建axios实列
    const instance = axios.create({
        // baseURL:'/api',
        baseURL:BaseURL+'Xy_Request',
        timeout:5000
    })
    
    //axios拦截器
    instance.interceptors.request.use(config => {
        //1.假如说config内容不符合服务器要求
        //2.比如每次发送网络请求时显示等待请求图标
        //3.某些网络请求(比如登录(token)令牌)必须携带一些特殊的信息
        if(localStorage.user){
            //设置请求头
            config.headers.Authorization = JSON.parse(localStorage.user).token;
        }
        return config
    },err => {
        return err
    })
    instance.interceptors.response.use(res => {
        
        return res
    },err => {
        return err
    })

    return instance(config)
}

export {BaseURL}