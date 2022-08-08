<template>
    <div>
         <nav-bar class="nav-bar">
            <div slot="left" class="font icon-fanhui" @click="$router.back()"></div>
            <div slot="center" style="font-size:16px;">
                <i>用户设置没写</i>
            </div>
        </nav-bar> 

        <h2></h2>
    </div>
</template>

<script>
import NavBar from '@/components/common/NavBar'

export default {
    components:{
        NavBar
    },        
}
</script>

<style lang="scss" scoped>

</style>