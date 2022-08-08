<template>
    <div class="logo">
        <div class="logo_font" data-text='Yun相册'>
            Yun相册
        </div>
    </div>
</template>

<script>
export default{
   data(){
       return{
           
       }
   }
}
</script>

<style lang="scss" scoped>
.logo{
    width: 59%;
    height: 5rem;
    position: fixed;
    top: 0;left: 53%;
    transform: translate(-50%,0);
    background: linear-gradient(0deg,#3498db 50%, rgb(233, 232, 232,.1) 0%);
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.logo_font{
    text-transform: uppercase;
    font-size: 2rem;
    font-weight: 800;
    letter-spacing: 6px;
    color: #ffffff40;
    transform: translateY(0);
    animation: fl1 3s infinite linear;
}
.logo_font::before{
    content: attr(data-text);
    position: absolute;
    color: rgb(236, 15, 85);
    clip-path: polygon(0 0,100% 0,100% 50% ,0 50%);
    animation: fl2 3s infinite linear;
}
@keyframes fl1 {
    30%{
        transform: translateY(10%) rotate(4deg);
    }
    70%{
        transform: translateY(10%) rotate(-4deg);
    }
}
@keyframes fl2 {
    30%{
       clip-path: polygon(0 0,100% 0,100% 24% ,0 56%);
    }
    70%{
       clip-path: polygon(0 0,100% 0,100% 56% ,0 24%);
    }
}
</style>