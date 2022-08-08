<template>
    <div class="center">
        <ul>
            <li v-for="(item,index) in list" :key="index" @click="onClick(index)">
                <div class="Clr">
                    <div class="font" :class="item.font"></div>
                    <div>
                        {{item.name}}
                        <span class="font icon-qianwang"></span>
                    </div>
                </div>

            </li>
        </ul>
    </div>
</template>

<script>
export default {
    data(){
        return{
          list:[
            {name:'我的相片-独家记忆',font:'icon-xiangce2'},
            {name:'我的相册-五彩生活',font:'icon-xiangce'},
            {name:'图片分类管理',font:'icon-24gf-tags3'},      
            {name:'设置',font:'icon-icon_shezhi'}
          ]  
        }
    },
    methods:{
        onClick(index){
            switch(index){
                case 0:this.$router.push('/album');break;
                case 1:this.$router.push('/phaseset');break;
                case 2:this.$router.push('/classification');break;
                case 3:this.$router.push('/setup');break;
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.center{
      border-top: 8px rgba(225, 228, 228, 0.897) solid ;   
    ul{
        width: ca;
        li{
            .Clr{
                display: flex;   
                div:first-child{
                    width: 15%;
                    height:4rem;
                    line-height: 4rem;
                    text-align: center;
                }
                div:last-child{
                    font-size:1.1rem;
                    width: 100%;
                    height:4rem;
                    line-height: 4rem;
                    padding-left: 1rem;
                    border-bottom: 1px rgba(210, 200, 200, 0.888) solid;
                     position: relative;
                    span{
                        display: block;
                        position: absolute;
                        right: 1rem;
                        top: 0;
                    }
                }
            }

        }
    }
}
</style>