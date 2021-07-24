<!--
 * @Description: 
 * @Author: lgt
 * @Date: 2021-07-17 17:19:30
 * @LastEditTime: 2021-07-17 17:45:09
 * @LastEditors: xxx
-->
<template>
    <view>
         <view class="links-wrapper" v-if="list.length > 0">
        <view class="link-box" v-for="(item,index) in list" :key="index">
            <van-cell :title="item.linkName" value="" is-link @click="goToWebView(item)" />
        </view>
    </view>
    <van-empty description="暂无数据"
                       v-if="list.length == 0" />
    </view>
   
</template>

<script>
export default {
    data(){
        return{
            list:[]
        }
    },
    onLoad(){
        this.getLinkList()
    },
    methods:{
        getLinkList(){
             const that = this;
             uni.showLoading({
                title: "加载中",
                mask: true,
            });
            const query = this.Bmob.Query("friend_links");
            // query.equalTo("biaoshi", "==", true);
            // query.equalTo("dakaYM", "==", that.currentYM);
            query.limit(1000);
            query
                .find()
                .then((res) => {
                    console.log("共查询到数据",res);
                    if(res.length != 0){
                       that.list = res
                    }
                    uni.hideLoading();
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        goToWebView(item){
            console.log("item",item)
            uni.navigateTo({
                url: '/pages/Links/Links-webview?urlname='+item.linkUrl,
            });
        }
    }
}
</script>