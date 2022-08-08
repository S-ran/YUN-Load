<template>
  <div id="tab-bar-item" @click="itemClick">
    <div class="item-icon" v-show="!isActive">
      <slot name="icon"></slot>
      </div>
    <div class="item-active-icon" v-show="isActive">
      <slot name="active-icon"></slot>
      </div>
    <div class="item-text" :style="activeStyle">
      <slot name="text"></slot>
      </div>
  </div>
</template>

<script>
	export default {
		name: "TabBarItem",
    data(){
      return {
        flage:false
      }
    },
    props: {
			link: {
				type: String,
        default:''
      },
      flageData:{
				type: Array,
        default:[]
      }
    },
    computed: {
			isActive() {
				return this.$route.path.indexOf(this.link) !== -1
      },
      activeStyle() {
				return this.isActive ? {'color': 'red'} : {}
      },
    },
    watch:{
      activeStyle(val){
        this.flageData.push(val);
        if(this.flageData.length == 5){
            for(let i of this.flageData){
                if(i.color){
                  this.flage = true;
                  break;
                }else{
                  this.flage = false;
                }
            }
          this.$emit('sendBarShow',this.flage)      
        }

      }
    },
    methods: {
			itemClick() {
				this.$router.replace(this.link)
      }
    },
	}
</script>

<style scoped>
  #tab-bar-item {
    flex: 1;
  }

  .item-icon img, .item-active-icon img {
    width: 24px;
    height: 24px;
    margin-top: 5px;
    vertical-align: middle;
  }

  .item-text {
    font-size: 12px;
    margin-top: 3px;
    color: #333;
  }
</style>