<!--
 * @Description: 
 * @Author: lgt
 * @Date: 2021-07-17 16:20:56
 * @LastEditTime: 2021-07-17 23:38:14
 * @LastEditors: xxx
-->
<template>
    <view class="feed-wrapper">
        <view class="feed-title">意见编辑</view>
        <view class="feed-contain">
           <textarea class="textarea" v-model="txt"></textarea>

        </view>
          <view class="submit-btn" @click="handleSubmit">确定</view>
    </view>
</template>

<script>
// import {uniCalendar} from '@dcloudio/uni-ui'
export default {
    data(){
        return{
            txt:'',
            userInfo:{},
            userId:'',
        }
    },
    onLoad(){
        this.userInfo = uni.getStorageSync("wxUserInfo") || '';
        this.userId = uni.getStorageSync("userId") || "";
    },
    methods:{
        handleSubmit(){
           const that = this;
           if(this.txt == ''){
              uni.showToast({
                    title: "请输入意见反馈",
                    mask: true,
                    duration: 1000,
                    icon: "none",
                });
                return false;
           }
           if(this.userInfo == "" || this.userId == ""){
                uni.showToast({
                    title: "请先到授权登录后才提交",
                    mask: true,
                    duration: 1000,
                    icon: "none",
                });
                return false;
           }
             const query = that.Bmob.Query("Design_personal");
            query.set("userID", that.userId);
            query.set("username",  that.userInfo.nickName);
            query.set("suggestContent",that.txt);
            query.set("biaoshi",true);
            query
                .save()
                .then((res) => {
                    console.log(res);
                    // console.log("新增成功")
                    uni.showToast({
                        title:'提交成功',
                        duration:2000
                    })
                    setTimeout(()=>{
                     uni.navigateBack()
                    },2000)
                   
                })
                .catch((err) => {
                    console.log(err);
                });

        }
        
    }
}
</script>

<style scoped>
.feed-wrapper{
    width: 100%;
    min-height: 100vh;
    /* background: #f2f2f2; */
}
.feed-title{
text-align:  center;
  font-weight: bold;
  font-size: 40rpx;
  margin: 20rpx 0;
}
.feed-contain{
    width: 90%;
    margin-left: 5%;
}
.feed-contain textarea{
    width: 100%;
    height: 400rpx;
    box-sizing: border-box;
    border: 2rpx solid #ffd700;
    padding: 20rpx 20rpx;
}
.submit-btn{
    width: 90%;
    margin-left: 5%;
    height: 70rpx;
    background-color: #ffd700;
    line-height: 70rpx;
    text-align: center;
    color: #333;
    border-radius: 70rpx;
    margin-top: 40rpx;
    margin-bottom: 20rpx;
}

</style>