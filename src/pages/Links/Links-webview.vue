<!--
 * @Description: 
 * @Author: lgt
 * @Date: 2021-07-17 17:20:53
 * @LastEditTime: 2021-07-17 17:34:59
 * @LastEditors: xxx
-->
<template>
        <web-view :src="url" v-if="url.length"></web-view>
</template>

<script>
export default {
    data(){
        return{
            url:'',
        }
    },
    onLoad(options){
        console.log("页面传递过来的参数",options)
        this.url = options.urlname || '';
    }

}
</script>