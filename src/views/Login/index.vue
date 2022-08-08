<template>
    <div class="login">
    
        <div class="login-box">
            <Logo/>
            <el-form :model="loginForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="账号" prop="username">
                    <el-input type="text" v-model="loginForm.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="loginForm.password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button class="login_but font icon-dengluzhuce" type="primary" @click="submitForm('ruleForm')"></el-button>
                    <el-button class="login_but font icon-zhongzhi" @click="resetForm('ruleForm')"></el-button>
                </el-form-item>
            </el-form>            
        </div>

        <div class="register">
            还没有账号?立即<a  @click="onReg">注册</a>
        </div>

    </div>
</template>

<script>
import jwt from 'jwt-decode'
import Logo from './childComps/Logo.vue'

import {mapMutations} from 'vuex'

export default {
        components:{
            Logo
        },
        data(){
            let validateUser = (rule, value, callback) => {
                if (value === '') {
                callback(new Error('请输入用户名'));
                } else {
                callback();
                }
            };
            let validatePass = (rule, value, callback) => {
                if (value === '') {
                callback(new Error('请输入密码'));
                }else {
                callback();
                }
            };
            return{
                loginForm: {
                    username: '',
                    password: '',
                },
                rules: {
                    username: [
                        { validator: validateUser, trigger: 'blur' }
                    ],
                    password: [
                        { validator: validatePass, trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
         //映射store的mutations方法
        ...mapMutations('loginModule',['setUser']),
        submitForm(formName) { //提交表单
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$api.getLogin(this.loginForm).then(res=>{
                    if(res.response){
                        console.log(res.response.data.message);
                        this.Tips = this.$message({
                                message: res.response.data.message,
                                type: 'warning',
                                duration:1000                
                            });
                    }else{
                        this.$message({
                                message: '登陆成功',
                                type: 'success',
                                duration:1000                
                            });
                        let obj = {         
                            user:jwt(res.data.token).data.username,
                            token:res.data.token
                        }
                        localStorage.setItem('user',JSON.stringify(obj))//存储本地Ls                   
                        this.setUser(obj)   //存储到vuex
                        this.$router.replace('/')
                    }
                })
            }})},
            resetForm(formName) { //清空表单
                this.$refs[formName].resetFields();
            },
            onReg(){
                this.$router.push('/register')
            }
        }
}
</script>

<style lang="scss" scoped>
.login{
    width: 100%;
    height: 100%;
    background: #3ed;
    background-image: url('@/assets/img/yun.webp');
    background-repeat: no-repeat;
    background-size: cover;
    /*居中显示*/
    background-position: center;
    position: relative;
}

.login-box{
    width: 400px;
    height: 230px;
    margin: 100px auto;
    border-radius:10px ;
    // border: 2px solid #eee;
    text-align: center;
    padding-top:60px ;
    position: fixed;
    top: 5%;left: 50%;
    transform: translate(-50%,0);
}
.demo-ruleForm{
    margin: auto;
    padding-right: 70px;
    margin-top: 30px;
}
.login_but{
  opacity: 0.7;  
}

.register{
    font-size: 1rem;
    position: absolute;
    bottom: 2%;
    left: 50%;
    transform: translate(-50%,0);
}
</style>