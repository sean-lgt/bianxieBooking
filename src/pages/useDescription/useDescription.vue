<!--
 * @Description: 
 * @Author: lgt
 * @Date: 2021-07-17 16:09:27
 * @LastEditTime: 2021-07-17 16:18:37
 * @LastEditors: xxx
-->
<template>
    <view class="desc-wrapper">
         <text>使用说明</text>
  <view class="content">
    <view class="title"></view>
    <view class="con">记账简单来说，就是把你每天的所有收入和开支都统统记下来，记账最直接的作用就是摸清收入、支出的具体情况。在了解自己的收支状况后，能够有所警醒，调整开销，理性消费。</view>
    <view class="title"></view>
    <view class="con">便携记账本小程序有五个主要功能页面，分别是记账、明细、账单、打卡、我的。</view>
    <view class="title"></view>
    <view class="con">在使用小程序之前，需要到‘我的’界面，，点击“获取头像昵称”登录授权才能获取到你的微信名还有头像。然后点击“记账”界面，开始记账，分为支出与收入两个方面，在每个方面下可以选择类别、记账的时间、记账的金额、记账的备注内容，点击“OK”则记账成功，之后对自动跳转到“明细”界面，这个界面会渲染出用户所有记账的记录明细，包括额度、类型、时间、备注。在此界面，可以对记账数据进行删除，也可以筛选用户要查看的记账类型。</view>
    <view class="title"></view>
    <view class="con">在“账单”界面，则会显示你本月的记账支出总额、收入总额，点击“展开”则显示本月支出或者本月收入的具体信息，同时计算本月收支结余正负值。在显示本月最高支出和本月最高收入位置上点击则可显示具体内容。同时此界面也提供每月账单查询功能，在头部选择年份月份即可。</view>
    <view class="title"></view>
    <view class="con">在“打卡”界面，会显示用户本月打卡详情，每一次打卡会获得5积分，补签则会消耗3积分，不允许提前打卡，同时会显示本月积分与打卡天数，点击日历也可查看往月打卡情况，但不可以参与打卡或者补签功能。</view>
    <view class="title"></view>
    <view class="con">在“我的”界面，会显示用户个人资料，会获取用户的微信名和头像，在“个人资料”功能里，用户可以填写一些出生日期、未来计划、联系电话、个性签名等资料存储到数据库。在“使用条款”功能里，则会介绍怎么使用这款小程序；在“奖励开发者”功能里，则可以扫码支付，给予开发者一点小小的奖励；在“意见反馈”功能里，用户可以发表对这款小程序的意见或者建议，同时也可以看到其他用户发表的内容；在“设置”功能里，则是返回到记账的界面。</view>

    <view class="title"></view>
    <view class="con">注意：个人用户信息会得到保密！</view>

  </view>
    </view>
</template>

<style scoped>
.desc-wrapper{
    padding: 20rpx;
    box-sizing: border-box;
}
view text{
  width: 100vw;
  display: block;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 30rpx;
}
.content{
  font-size: 14px;
  color: gray;
}
.content .title{
  text-align: left;
  font-weight: bold;

}
.content .con{
  padding: 0 20rpx;
  line-height: 50rpx;
  text-indent: 2em;
  margin-bottom: 20rpx;
  text-align: justify;

}
</style>