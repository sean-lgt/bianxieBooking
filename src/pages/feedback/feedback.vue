<!--
 * @Description: 
 * @Author: lgt
 * @Date: 2021-07-17 16:20:43
 * @LastEditTime: 2021-07-17 18:32:03
 * @LastEditors: xxx
-->
<template>
    <view class="feed-back-wrapper">
        <view class="feed-header">
            <view class="right" @click="toEdit">
                <van-icon name="setting-o" />
                <text>编辑意见</text>
            </view>
            
        </view>
        <view class="feed-content">
            <view class="contain">
<view class="top">意见反馈</view>
  <view class="item" v-for="(item,index) in list" :key="index">
    <view class="name">{{item.username}}</view>
    <view class="sug">{{item.suggestContent}}</view>
  </view>
</view>
        </view>
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
    },
    onShow(){
        this.getList();

    },
    methods:{
        getList(){
            const that = this;
             uni.showLoading({
                title: "加载中",
                mask: true,
            });
            const query = this.Bmob.Query("Design_persuggest");
            query.equalTo("biaoshi", "==", true);
            // query.equalTo("dakaYM", "==", that.currentYM);
            query.limit(1000);
            query
                .find()
                .then((res) => {
                    console.log("共查询到数据",res);
                    that.list = res
                    uni.hideLoading();
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        toEdit(){
            uni.navigateTo({
                url:"/pages/feedback/editFeed"
            })
        }
    }
}
</script>

<style scoped>
.feed-back-wrapper{
    width: 100%;
}
.feed-header{
    width: 100%;
    height: 100rpx;
    display: flex;
    justify-content: flex-end;
    top: 0;
    left: 0;
    z-index: 1;
    box-sizing: border-box;
    background: #ffd700;
    padding: 0 2.5%;
}
.feed-header .right{
    display: flex;
    align-items: center;
    font-size: 40rpx;
}
.feed-header .right text{
    font-size: 28rpx;
    margin-left: 8rpx;
    
}
.contain{
  width: 100vw;
  min-height: 100vh;
  /* margin: 120rpx 30rpx 30rpx 30rpx; */

}
.contain .top{
  text-align:  center;
  font-weight: bold;
  font-size: 20px;
  margin: 20rpx 0;
}
.contain .item{
  /* width: vw; */
  width: 90%;
  margin: 30rpx 5%;
  padding: 20rpx;
  background-color: #f2f2f2;
  box-sizing: border-box;
  border-radius: 8rpx;
}
.contain .item .name{
  font-weight: bold;
  text-align: left;
  margin-bottom: 20rpx;
}
.contain .item .sug{
  text-indent: 3em;
  margin: 20rpx 0;
}
</style>