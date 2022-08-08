<template>
    <div class="nav-bar">
        <div class="left"><slot name="left"></slot></div>
        <div class="center"><slot name="center"></slot></div>
        <div class="right"><slot name="right"></slot></div>
    </div>
</template>

<script>
    export default{
        name:'NavBar',
        
}
</script>

<style scoped>
    .nav-bar{
        height: 52px;
        display: flex;
        line-height: 52px;
        text-align: center;
        box-shadow: 0 2px 2px rgb(100, 100, 100,0.2);
        z-index: 19;
    }
    .left,.right{
        width: 60px;
    }
    .center{
        flex: 1;
    }
</style>