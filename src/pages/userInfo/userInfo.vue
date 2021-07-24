<!--
 * @Description: 
 * @Author: lgt
 * @Date: 2021-07-17 14:43:30
 * @LastEditTime: 2021-07-18 17:13:52
 * @LastEditors: xxx
-->
<template>
    <div class="user-info-wrapper">
         <view class="mine-info">
            <view class="mine-avatar">
                <image :src="userInfo.avatarUrl" @click="getUserInfo"></image>
            </view>
            <view class="mine-name" @click="getUserInfo">{{userInfo.nickName}}</view>
        </view>
        <van-cell-group>
  <van-field
    :value="userInfoDetail.brithday"
    center
    clearable
    label="出生日期"
    placeholder="请选择出生日期"
    border="false"
    readonly
    @click-input="showTimeSelect"
  >
  </van-field>
</van-cell-group>
<van-cell-group>
  <van-field
    center
    clearable
    label="联系电话"
    placeholder="请输入联系电话"
    type="number"
    maxlength="11" 
    border="false"
    :value="userInfoDetail.phone"
    @change="changePhone"
  >

  </van-field>
</van-cell-group>
    <van-cell-group>
  <van-field
    :value="userInfoDetail.plan"
    center
    clearable
    label="未来计划"
    placeholder="请输入记账计划"
    border="false"
     @change="changePlan"
      maxlength="40" 
  >
  </van-field>
</van-cell-group>
<van-cell-group>
  <van-field
    :value="userInfoDetail.personalQM"
    center
    clearable
    label="个性签名"
    placeholder="请输入个性签名"
    border="false"
    @change="changePersonalQM"
    maxlength="40" 
  >
  </van-field>
</van-cell-group>
    
    <view class="submit-btn" @click="handleSubmit">确定</view>


     <van-action-sheet :show="isShowTimeSelect">
            <van-datetime-picker type="date"
                                 :value="currentDate"
                                 :min-date="minDate"
                                 :formatter="formatter"
                                 @confirm="onConfirmTime"
                                 @cancel="cancelTime" />
        </van-action-sheet>
    </div>
</template>

<script>
import dayjs from "dayjs";
export default {
    data(){
        return{
            userInfo:{
                avatarUrl:'https://z3.ax1x.com/2021/07/18/W3Yx3t.png',
                nickName:'点击登录'
            },
            userInfoDetail:{
                userName:'',
                userAvatar:'',
                personalQM:'',
                phone:'',
                brithday:'',
                plan:'',
            },
            currentDate: new Date().getTime(),
            minDate: dayjs('1971-01-01').valueOf(),
            formatter(type, value) {
                if (type === "year") {
                    return `${value}年`;
                }
                if (type === "month") {
                    return `${value}月`;
                }
                return value;
            },
            isShowTimeSelect:false,
            submitType:'add',
            isHasWXUserInfo:false,
        }
    },
    onShow(){
        console.log("",uni.getStorageSync("wxUserInfo"))
        if(uni.getStorageSync("wxUserInfo")){
            this.userInfo = uni.getStorageSync("wxUserInfo");
            this.getUserInfoDetail();
            this.isHasWXUserInfo = true;
        }
        
    },
    onLoad(){
        this.userId = uni.getStorageSync("userId") || "";
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
        },
        getUserInfoDetail(){
            uni.showLoading({
                title: "加载中",
                mask: true,
            });
            const that = this;
            const query = this.Bmob.Query("Design_personal");
            query.equalTo("userID", "==", that.userId);
            // query.equalTo("dakaYM", "==", that.currentYM);
            query.limit(1000);
            query
                .find()
                .then((res) => {
                    console.log("共查询到数据",res);
                    if(res.length == 0){
                        //代表是新增
                        that.submitType = 'add'
                    }else{
                        that.submitType = 'update'
                        that.userInfoDetail = res[0];
                    }
                    uni.hideLoading();
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        showTimeSelect(){
this.isShowTimeSelect = true;
        },
        onConfirmTime(e) {
            this.userInfoDetail.brithday = dayjs(e.detail).format(
                    "YYYY-MM-DD"
                );
            this.isShowTimeSelect = false;
        },
        cancelTime() {
            this.isShowTimeSelect = false;
        },
        changePhone(e){
            this.userInfoDetail.phone = e.detail;
        },
        changePlan(e){
            this.userInfoDetail.plan = e.detail;
        },
        changePersonalQM(e){
             this.userInfoDetail.personalQM = e.detail;
        },
        handleSubmit(){
            //判断是否授权
            const that = this;
            if(!this.isHasWXUserInfo){
                 uni.showToast({
                    title: "请先授权登录",
                    mask: true,
                    duration: 1000,
                    icon: "none",
                });
                return false;
            }
            const phonereg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
            if (this.userInfoDetail.phone && !phonereg.test(this.userInfoDetail.phone)) {
                  uni.showToast({
                    title: "请输入正确的手机号",
                    mask: true,
                    duration: 1000,
                    icon: "none",
                });
               return false;
            }
            this.userInfoDetail.userAvatar = this.userInfo.avatarUrl;
            this.userInfoDetail.userName = this.userInfo.nickName;
            console.log("需要提交的数据",this.userInfoDetail)
            if(this.submitType == 'add'){
                const query = that.Bmob.Query("Design_personal");
            query.set("userID", that.userId);
            query.set("userName",  this.userInfoDetail.userName);
            query.set("userAvatar", this.userInfoDetail.userAvatar);
            query.set("brithday", this.userInfoDetail.brithday);
            query.set("personalQM", this.userInfoDetail.personalQM);
            if(that.userInfoDetail.phone != ''){
            query.set("phone", Number(this.userInfoDetail.phone));
            }
            query.set("plan", this.userInfoDetail.plan);
            query
                .save()
                .then((res) => {
                    console.log(res);
                    // console.log("新增成功")
                    uni.showToast({
                        title:'提交成功',
                        duration:2000
                    })
                    
                   
                })
                .catch((err) => {
                    console.log(err);
                });
            }else{
                //修改操作
                const query = that.Bmob.Query('Design_personal');
query.get(that.userInfoDetail.objectId).then(res => {
  res.set("userName",  that.userInfoDetail.userName);
            res.set("userAvatar", that.userInfoDetail.userAvatar);
            res.set("brithday", that.userInfoDetail.brithday);
            res.set("personalQM", that.userInfoDetail.personalQM);
            if(that.userInfoDetail.phone){
                // console.log("s")
               res.set("phone", Number(that.userInfoDetail.phone));
            }
            res.set("plan", that.userInfoDetail.plan);
  res.save()
   uni.showToast({
                        title:'提交成功',
                        duration:2000
                    })
}).catch(err => {
  console.log(err)
})
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
/deep/ .van-button--primary{
    background: #ffd700 !important;
    border:none !important;
    color: #333 !important;
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