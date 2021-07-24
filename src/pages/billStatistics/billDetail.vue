<!--
 * @Description: 
 * @Author: lgt
 * @Date: 2021-07-21 20:56:32
 * @LastEditTime: 2021-07-21 21:31:08
 * @LastEditors: xxx
-->
<template>
    <div class="detail-wrapper">
        <div class="detail-header">
            {{titleName}}
        </div>
     <div class="detail-wrapper">
        <div class="bill-detail-box" v-for="(item,index) in data" :key="item.objectId">
            <div class="detail-item">
                <view class="tit">时间：</view>
                <view class="val">{{item.saveMoney_details.bookingTime}}</view>
            </div>
            <div class="detail-item">
                <view class="tit">类别：</view>
                <view class="val">{{item.saveMoney_details.expendDetail}}</view>
            </div>
            <div class="detail-item">
                <view class="tit">金额：</view>
                <view class="val">{{Math.abs(item.zhichuMoney)}}</view>
            </div>
            <div class="detail-item">
                <view class="tit">备注：</view>
                <view class="val">{{item.saveMoney_details.beizhuinputVal || '--'}}</view>
            </div>
        </div>
     </div>
    </div>
    
</template>

<script>
export default {
    data(){
        return{
            titleName:"",
            data:[]
        }
    },
    onLoad(options){
        // console.log(options)
        this.time = options.time;
    },
    onShow(){
        let lookData = uni.getStorageSync("lookBill");
        this.titleName = lookData.lookType == 'outlay' ? this.time+'支出详情':this.time+'收入详情'
        this.data = lookData.data;
    },
    onUnload(){
        //页面卸载 清空缓存
        uni.removeStorageSync("lookBill")
    }
}
</script>

<style scoped>
.detail-wrapper{
    width: 100%;
}
.detail-header {
    width: 100%;
    height: 100rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0;
    left: 0;
    z-index: 1;
    box-sizing: border-box;
    background: #ffd700;
    padding: 0 2.5%;
    font-size: 28rpx;
    font-weight: 700;
}
.bill-detail-box {
    width: 95%;
    margin-left: 2.5%;
    height: auto;
    /* height: 300rpx; */
    border-radius: 10rpx;
    background: #ffd700;
    margin-top: 20rpx;
    margin-bottom: 20rpx;
    /* display: flex; */
    /* flex-direction: column;
    justify-content: center;
    align-items: center; */
    box-sizing: border-box;
    padding: 40rpx 20rpx;
}
.bill-detail-box .detail-item{
    display: flex;
    align-items: center;
    margin-bottom: 8rpx;
    font-size: 28rpx;
    color: #696969;
    font-weight: 700;
}
</style>