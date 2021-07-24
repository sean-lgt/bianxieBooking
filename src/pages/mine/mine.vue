<!--
 * @Description: 
 * @Author: lgt
 * @Date: 2021-07-13 21:10:06
 * @LastEditTime: 2021-07-18 13:10:57
 * @LastEditors: xxx
-->
<template>
    <view class="mine-wrapper">
        <view class="mine-info">
            <view class="mine-avatar">
                <image :src="userInfo.avatarUrl" @click="getUserInfo"></image>
            </view>
            <view class="mine-name" @click="getUserInfo">{{userInfo.nickName}}</view>
        </view>
        <van-cell-group class="v-cc">
  <van-cell title="个人资料" value="" is-link link-type="navigateTo"
  url="/pages/userInfo/userInfo"/>
</van-cell-group>
<van-cell-group>
  <van-cell title="使用说明" value="" is-link link-type="navigateTo"
  url="/pages/useDescription/useDescription" />
  <van-cell title="意见反馈" value="" is-link link-type="navigateTo"
  url="/pages/feedback/feedback"/>
  <!-- contact -->
  <van-cell title="联系开发者" value="" is-link link-type="navigateTo"
  url="/pages/contact/contact"/>
</van-cell-group>
<van-cell-group>
  <van-cell title="友情链接" value="" is-link link-type="navigateTo"
  url="/pages/Links/Links"/>
</van-cell-group>

    </view>
</template>
<script>
export default {
    data(){
        return{
            userInfo:{
                avatarUrl:'https://z3.ax1x.com/2021/07/18/W3Yx3t.png',
                nickName:'点击登录'
            },
        }
    },
    onShow(){
        console.log("",uni.getStorageSync("wxUserInfo"))
        if(uni.getStorageSync("wxUserInfo")){
            this.userInfo = uni.getStorageSync("wxUserInfo");
        }
        
    },
    onLoad(){

    },
    methods:{
        //获取用户信息
        getUserInfo(){
            const that= this;
            if(uni.getStorageSync("wxUserInfo") == ''){
                uni.getUserProfile({
                    desc: "weixin",
                    success: (res) => {
                        console.log(res, "授权成功", res);
                        uni.setStorageSync("wxUserInfo", res.userInfo);
                        that.userInfo = res.userInfo;
                    },
                    fail: (err) => {
                        console.log(err, "失败授权");
                    },
                });
            }else{
                console.log("无须授权")
            }
        }
    },
}
</script>

<style scoped>
.mine-wrapper{
    width:100%;
    min-height:100vh;
    background:#f2f2f2;
}
.mine-info{
    width: 100%;
    height: 300rpx;
    background: #ffd700;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.mine-info .mine-avatar{

}
.mine-info .mine-avatar image{
    width: 150rpx;
    height: 150rpx;
    /* border: 1px solid #ccc; */
    background: #fff;
    border-radius: 50%;
    box-shadow: 0 0 4px 5px #fff;
}
.mine-name{
    font-size: 40rpx;
    font-weight: 700;
}

view /deep/ .van-cell-group{
    margin-top: 30rpx;
}

</style>