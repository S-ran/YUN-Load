import {request} from './request'
import {YUN} from "@/main.js"

const from = {'Content-Type': 'application/json'}
const from_data = {'Content-Type': 'multipart/form-data'}

let temp = 0
let temp_cnt = 0
let Strip = 0
const api = {
  UpLoad_headData(data){//上传头像图片
    return request({
      url:'/head_load',
      method:'post',
      headers:from_data,
      data
    })
  },
  UpLoad_backgroundData(data){//上传背景图片
    return request({
      url:'/background_load',
      method:'post',
      headers:from_data,
      data
    })
  },
  UpLoad_imgData(data){//上传图片资源
    return  request({
      url:'/img_load',
      method:'post',
      headers:from_data,
      data,
      onUploadProgress: (progressEvent) =>{ //原生获取上传进度的事件
            if(progressEvent.lengthComputable){
                //属性lengthComputable主要表明总共需要完成的工作量和已经完成的工作是否可以被测量
                //如果lengthComputable为false，就获取不到progressEvent.total和progressEvent.loaded

                Strip = Math.floor(progressEvent.loaded/progressEvent.total * 100)
                if(progressEvent.total != temp)temp_cnt++;                       
                  
                if(temp_cnt==1)
                  YUN.$children[0].$children[1].$children[0].$children[5].isTipsShow('准备资源中: '+ Strip+ '%',1);
                else if(temp_cnt==2){
                  YUN.$children[0].$children[1].$children[0].$children[5].isTipsShow('图片上传中: '+ Strip+ '%',1);
                  // temp_cnt = 0;
                  if(Strip==100)temp_cnt = 0;
                }
                temp = progressEvent.total
               
            }
        }
    })
  },
  UpLoad_imgsData(data){//上传图片组资源
    return request({
      url:'/imgs_load',
      method:'post',
      headers:from_data,
      data
    })
 
  },
  
  getRegister(data){ //注册
    return request({
      url:'/register',
      method:'post',
      headers:from,
      data
    })
  },
  getLogin(data){ //登录
    return request({
      url:'/login',
      method:'post',
      headers:from,
      data
    })
  },
  getLoginConfig(){ //获取登录用户信息
    return request({
      url:'/userconfig'
    })
  },
  getSetheadportrait(data){//设置头像
    return request({
      url:'/sethead',
      method:'post',
      headers:from,
      data
    })
  },
  getData_background(data){//设置data背景图
    return request({
      url:'/data_background',
      method:'post',
      headers:from,
      data
    })
  },
  getData_ClassImgs(type){ //获取分类
    return request({
      url:'/data_class_imgs/'+type
    })
  },
  
  getData_AddClassImgs(data){//添加分类
    return request({
      url:'/data_addClass_imgs',
      method:'post',
      headers:from,
      data
    })
  },
  getData_RemoveClassImgs(data){//删除分类
    return request({
      url:'/data_removeClass_imgs',
      method:'post',
      headers:from,
      data
    })   
  },
  getData_SortClassImgs(data){//排序分类
    return request({
      url:'/data_sortClass_imgs',
      method:'post',
      headers:from,
      data
    })   
  },
  getData_AddResourcesImgs(data){//添加图片资源
    return request({
      url:'/data_addResources_imgs',
      method:'post',
      headers:from,
      data
    })
  },
  getData_AddResourcesBooks(data){//添加相集资源
    return request({
      url:'/data_addResources_books',
      method:'post',
      headers:from,
      data
    })
  },
  
  getData_Resources(page,size,type){//获取分页资源
    return request({
      url:'/getData_resources/'+page+'/'+size+'/'+type
    })
  },
  getData_ToppingResourcesImgs(data){//置顶图片
    return request({
      url:'/data_toppingresources_imgs',
      method:'post',
      headers:from,
      data
    })   
  },
  getData_ImgsSearch(data){//获取分类图片资源
    return request({
      url:'/data_searchResources_imgs',
      method:'post',
      headers:from,
      data
    })
  },
  getData_ImgsKeyword(data){//获取关键字图片资源
    return request({
      url:'/data_keywordResources_imgs',
      method:'post',
      headers:from,
      data
    })
  },
  getData_ImgsRemove(data){//删除图片资源
      return request({
        url:'/data_removeResources_imgs',
        method:'post',
        headers:from,
        data
      })
  },
  getData_ImgsEdit(data){//编辑图片资源
    return request({
      url:'/data_editResources_imgs',
      method:'post',
      headers:from,
      data
    })
  },
  getData_RemoveGroupimg(data){//删除相集中图片数据
    return request({
      url:'/data_editResources_removeGroupimg',
      method:'post',
      headers:from,
      data
    })
  },
  getData_EditResourcesBooks(data){//编辑图片资源
    return request({
      url:'/data_editResources_books',
      method:'post',
      headers:from,
      data
    })
  },
  getData_onTopping(data,type){
    return request({
      url:'/data_onTopping/'+data+'/'+type,
    })  
  },
  getData_ImgsPreview(data){
    return request({
      url:'/data_preview_imgs',
      method:'post',
      headers:from,
      data
    })
  },
 }

export default api
