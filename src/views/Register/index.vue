<template>
    <div class="register-demo">
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="reg-ruleForm">
            <el-form-item label="昵称" prop="nickname" >
                <el-input v-model="ruleForm.nickname" ></el-input>
            </el-form-item>
            <el-form-item label="账号" prop="username" >
                <el-input v-model="ruleForm.username" ></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password" >
                <el-input type="password" v-model="ruleForm.password" autocomplete="off" ></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPass" >
                <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off" ></el-input>
            </el-form-item>
            <el-form-item class="but">
                <el-button type="primary" class="font" @click="submitForm('ruleForm')">注册</el-button>
                <el-button type="warning" @click="resetForm('ruleForm')" class="font icon-zhongzhi" ></el-button>
            </el-form-item>
            
        </el-form> 
    </div>
</template>

<script>
export default {
    data(){
        var validatePass = (rule, value, callback) => {
            if (value === '') {
            callback(new Error('请输入密码'));
            } else {
            if (this.ruleForm.checkPass !== '') {
                this.$refs.ruleForm.validateField('checkPass');
            }
            callback();
            }
        };
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
            callback(new Error('请再次输入密码'));
            } else if (value !== this.ruleForm.password) {
            callback(new Error('两次输入密码不一致!'));
            } else {
            callback();
            }
        };
        var checkUser = (rule, value, callback) => {
            let reg = /^[A-Za-z0-9]+$/;
            let reg2 = /^[A-Za-z0-9]{5,10}$/;
            if (!value) {
                callback(new Error('账号不能为空'));
            }else if(!reg.test(value)){ 
                callback(new Error('只能是字母数字'));
            }else if(!reg2.test(value)){ 
                callback(new Error('请输入5~10个字符'));
            }else {
                callback();
            }
            
        }
        var checkNick = (rule, value, callback) => {
            let reg = /^.{2,10}$/;
            if (!value) {
                callback(new Error('昵称不能为空'));
            }else if(!reg.test(value)){ 
                callback(new Error('请输入2~10个字符'));
            }else{
                callback();
            }
        }
        return{
            password:'',
            headportrait:'',
             ruleForm: {
                username:'',
                nickname:'',
                password: '',
                checkPass: '',
            },
            rules: {
            password: [
                { validator: validatePass, trigger: 'blur' }
            ],
            checkPass: [
                { validator: validatePass2, trigger: 'blur' }
            ],
            username: [
                { validator: checkUser, trigger: 'blur' }
            ],
            nickname: [
                { validator: checkNick, trigger: 'blur' }
            ]
            }
        }
    },
    methods: {
      submitForm(formName){
          this.$refs[formName].validate(valid=>{
             if (valid) {
                    this._getRegister(this.ruleForm)
            }
          })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },

      //网络请求
      _getRegister(data){
          this.$api.getRegister(data).then(res => {
              if(res.response){
                        console.log(res.response.data.message);
                        this.Tips = this.$message({
                                message: res.response.data.message,
                                type: 'warning',
                                duration:1000                
                            });
                    }else{
                        this.$message({
                                message: '注册成功',
                                type: 'success',
                                duration:1000                
                            });
                        this.$router.replace('/login')
                    }
            //   console.log(res);
          })
      }
    }        
}
</script>

<style lang="scss" scoped>
.register-demo{
    width: 100%;
    height: 100%;
    padding-top:60px ;
    position: fixed;
    left: 50%;
    transform: translate(-50%,0);
    text-align: center;
    background-image: url('https://t7.baidu.com/it/u=4100449257,1502828373&fm=193&f=GIF');
    background-repeat: no-repeat;
    background-size: cover;
    /*居中显示*/
    background-position: center;
    position: relative;
}
.reg-ruleForm{
    margin: auto;
    padding-top: 70px;
    padding-right: 70px;
    margin-top: 30px;
    .but{
       opacity: 0.7;   
    }
}
</style>