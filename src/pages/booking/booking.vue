<!--
 * @Description: 
 * @Author: lgt
 * @Date: 2021-07-13 21:24:02
 * @LastEditTime: 2021-07-18 10:49:43
 * @LastEditors: xxx
-->
<template>
    <view class="booking-wrap">
        <view class="booking-header">
            <view class="header-box">
                <view :class="tabActived == 'outlay'?'header-item actived':'header-item'"
                      @click="changeTab('outlay')">支出</view>
                <view :class="tabActived == 'income'?'header-item actived':'header-item'"
                      @click="changeTab('income')">收入</view>
            </view>
        </view>

        <view class="booking-container">
            <swiper class="swiper"
                    :autoplay="autoplay"
                    :interval="interval"
                    :duration="duration"
                    :current="currentSwiper"
                    @change="changeSwiper">
                <swiper-item>
                    <view class="swpier-item outlay">
                        <view class="booking-item">
                            <view class="item-tit">类别</view>
                            <van-field :value="outlayData.accountClass"
                                       placeholder="请点击以下类别"
                                       border="false"
                                       readonly />
                        </view>
                        <view class="booking-item">
                            <view class="item-tit">金额</view>
                            <van-field :value="outlayData.zhichuMoney"
                                       placeholder="请输入支出金额"
                                       border="false"
                                       type="digit"
                                       maxlength="10"
                                       @change="changeOutlayMoney" />
                        </view>
                        <view class="booking-item">
                            <view class="item-tit">时间</view>
                            <van-field :value="outlayData.bookingTime"
                                       placeholder="请选择时间"
                                       border="false"
                                       readonly
                                       @click-input="showTimeSelect('outlay')" />
                        </view>
                        <view class="booking-item">
                            <view class="item-tit">备注</view>

                            <van-field :value="outlayData.zhichubeizhu"
                                       placeholder="如需备注,请填写"
                                       border="false"
                                       maxlength="30" 
                                       @change="changeOutlayBeizhu"/>
                        </view>
                        <view class="booking-btn"
                              @click="handleBooking(1)">
                            记一笔
                        </view>
                        <view class="type-icon-box">
                            <view :class="item.id == currentExpendId?'type-item actived':'type-item'"
                                  v-for="(item,index) in expendClassify"
                                  :key="item.id"
                                  @click="selectExpendType(item)">
                                <image :src="item.img"></image>
                                <view class="type-name">{{item.text}}</view>
                            </view>

                        </view>
                    </view>
                </swiper-item>
                <swiper-item>
                    <view class="swpier-item outlay">
                        <view class="booking-item">
                            <view class="item-tit">类别</view>
                            <van-field :value="incomeData.accountClass"
                                       placeholder="请点击以下类别"
                                       border="false"
                                       readonly />
                        </view>
                        <view class="booking-item">
                            <view class="item-tit">金额</view>
                            <van-field :value="incomeData.zhichuMoney"
                                       placeholder="请输入收入金额"
                                       border="false"
                                       type="digit"
                                       maxlength="10" 
                                       @change="changeIncomeMoney"/>
                        </view>
                        <view class="booking-item">
                            <view class="item-tit">时间</view>
                            <van-field :value="incomeData.bookingTime"
                                       placeholder="请选择时间"
                                       border="false"
                                       readonly
                                       @click-input="showTimeSelect('income')" />
                        </view>
                        <view class="booking-item">
                            <view class="item-tit">备注</view>

                            <van-field :value="incomeData.zhichubeizhu"
                                       placeholder="如需备注,请填写"
                                       border="false"
                                       maxlength="30" 
                                       @change="changeIncomeBeizhu"/>
                        </view>
                        <view class="booking-btn"
                              @click="handleBooking(2)">
                            记一笔
                        </view>
                        <view class="type-icon-box">
                            <view :class="item.id == currentIncomeId?'type-item actived':'type-item'"
                                  v-for="(item,index) in incomeClassify"
                                  :key="item.id"
                                  @click="selectIncomeType(item)">
                                <image :src="item.img"></image>
                                <view class="type-name">{{item.text}}</view>
                            </view>

                        </view>
                    </view>
                </swiper-item>
                <swiper-item>

                </swiper-item>
            </swiper>
        </view>
        <!-- 时间组件 -->
        <van-action-sheet :show="isShowTimeSelect">
            <van-datetime-picker type="date"
                                 :value="currentDate"
                                 :min-date="minDate"
                                 :formatter="formatter"
                                 @confirm="onConfirmTime"
                                 @cancel="cancelTime" />
        </van-action-sheet>

    </view>

</template>

<script>
// import moment from 'moment';  //体积过大
import dayjs from "dayjs";
export default {
    data() {
        return {
            userId: "",
            tabActived: "outlay", //income,
            background: ["color1", "color2", "color3"],
            indicatorDots: true,
            autoplay: false,
            interval: 2000,
            duration: 500,
            currentSwiper: 0,
            isShowTimeSelect: false,
            currentExpendId: 0,
            currentIncomeId: 0,
            currentTimeSelect: "",
            // 支出分类 用数组对象存着
            expendClassify: [
                {
                    id: 1,
                    img: "https://z3.ax1x.com/2021/07/18/W3kBS1.png",
                    text: "餐饮",
                },
                {
                    id: 2,
                    img: "https://z3.ax1x.com/2021/07/18/W3kdY9.png",
                    text: "购物",
                },
                {
                    id: 3,
                    img: "https://z3.ax1x.com/2021/07/18/W3kwWR.png",
                    text: "日用",
                },
                {
                    id: 4,
                    img: "https://z3.ax1x.com/2021/07/18/W3kaFJ.png",
                    text: "交通",
                },
                {
                    id: 5,
                    img: "https://z3.ax1x.com/2021/07/18/W3kNo4.png",
                    text: "买菜",
                },
                {
                    id: 6,
                    img: "https://z3.ax1x.com/2021/07/18/W3kz60.png",
                    text: "水果",
                },
                {
                    id: 7,
                    img: "https://z3.ax1x.com/2021/07/18/W3AC0U.png",
                    text: "零食",
                },
                {
                    id: 8,
                    img: "https://z3.ax1x.com/2021/07/18/W3AP7F.png",
                    text: "运动",
                },
                {
                    id: 9,
                    img: "https://z3.ax1x.com/2021/07/18/W3kvpn.png",
                    text: "娱乐",
                },
                {
                    id: 10,
                    img: "https://z3.ax1x.com/2021/07/18/W3ASXV.png",
                    text: "通讯",
                },
                {
                    id: 11,
                    img: "https://z3.ax1x.com/2021/07/18/W3A9mT.png",
                    text: "服饰",
                },
                {
                    id: 12,
                    img: "https://z3.ax1x.com/2021/07/18/W3kxlq.png",
                    text: "住房",
                },
                {
                    id: 13,
                    img: "https://z3.ax1x.com/2021/07/18/W3ADhj.png",
                    text: "医疗",
                },
                {
                    id: 14,
                    img: "https://z3.ax1x.com/2021/07/18/W3A0Ag.png",
                    text: "孩子",
                },
                {
                    id: 15,
                    img: "https://z3.ax1x.com/2021/07/18/W3Ay3n.png",
                    text: "社交",
                },
                {
                    id: 16,
                    img: "https://z3.ax1x.com/2021/07/18/W3As9s.png",
                    text: "旅行",
                },
                {
                    id: 17,
                    img: "https://z3.ax1x.com/2021/07/18/W3EFDf.png",
                    text: "学习",
                },
                {
                    id: 18,
                    img: "https://z3.ax1x.com/2021/07/18/W3A6cq.png",
                    text: "长辈",
                },
                {
                    id: 19,
                    img: "https://z3.ax1x.com/2021/07/18/W3AdHS.png",
                    text: "数码",
                },
                {
                    id: 20,
                    img: "https://z3.ax1x.com/2021/07/18/W3ABNQ.png",
                    text: "美容",
                },
            ],
            // 收入分类，用数组对象存在
            incomeClassify: [
                {
                    id: 1,
                    img: "https://z3.ax1x.com/2021/07/18/W3En8s.png",
                    text: "工资",
                },
                {
                    id: 2,
                    img: "https://z3.ax1x.com/2021/07/18/W3EZ5Q.png",
                    text: "兼职",
                },
                {
                    id: 3,
                    img: "https://z3.ax1x.com/2021/07/18/W3EVUg.png",
                    text: "理财",
                },
                {
                    id: 4,
                    img: "https://z3.ax1x.com/2021/07/18/W3Ekb8.png",
                    text: "礼金",
                },
                {
                    id: 5,
                    img: "https://z3.ax1x.com/2021/07/18/W3EEVS.png",
                    text: "其他",
                },
            ],
            outlayData: {
                zhichuMoney: "",
                accountClass: "",
                bookingTime: "",
                zhichubeizhu: "",
            },
            incomeData: {
                zhichuMoney: "",
                accountClass: "",
                bookingTime: "",
                zhichubeizhu: "",
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
        };
    },
    onLoad() {
        // 获取用户的openid
        this.userId = uni.getStorageSync("userId") || "";
        // this.getWXLoginCode();
    },
    methods: {
        // tab栏的切换
        changeTab(type) {
            const that = this;
            that.tabActived = type;
            that.currentSwiper = type == "outlay" ? 0 : 1;
        },
        //swiper 改变
        changeSwiper(event) {
            const that = this;
            that.currentSwiper = event.detail.current;
            that.tabActived = event.detail.current == 0 ? "outlay" : "income";
        },
        //展示时间选择组件
        showTimeSelect(type) {
            console.log("展示时间选择组件");
            this.isShowTimeSelect = true;
            this.currentTimeSelect = type;
        },
        // 点击支出类型
        selectExpendType(item) {
            console.log("支出类型", item);
            this.currentExpendId = item.id;
            this.outlayData.accountClass = item.text;
        },
        selectIncomeType(item) {
            this.currentIncomeId = item.id;
            this.incomeData.accountClass = item.text;
        },
        onConfirmTime(e) {
            console.log("e", e);
            this.currentDate = e.detail;
            if (this.currentTimeSelect == "outlay") {
                this.outlayData.bookingTime = dayjs(e.detail).format(
                    "YYYY-MM-DD"
                );
            } else {
                this.incomeData.bookingTime = dayjs(e.detail).format(
                    "YYYY-MM-DD"
                );
            }

            this.isShowTimeSelect = false;
        },
        cancelTime() {
            this.isShowTimeSelect = false;
        },
        handleBooking(type) {
            const that = this;
            let isHasUserInfo = uni.getStorageSync("wxUserInfo") || false;
            if (!isHasUserInfo) {
                uni.getUserProfile({
                    desc: "weixin",
                    success: (res) => {
                        console.log(res, "授权成功", res);
                        uni.setStorageSync("wxUserInfo", res.userInfo);
                        // 可以走其他逻辑
                        that.submitOutlayBooking();
                    },
                    fail: (err) => {
                        console.log(err, "失败授权");
                    },
                });
            } else {
                console.log("aaaa");
                type == 1?that.submitOutlayBooking():that.submitIncomeBooking();
            }
        },
        submitOutlayBooking() {
            const that = this;
            if (that.outlayData.accountClass == "") {
                uni.showToast({
                    title: "请先点击支出类型",
                    mask: true,
                    duration: 1000,
                    icon: "none",
                });
                return false;
            } else if (that.outlayData.bookingTime == "") {
                uni.showToast({
                    title: "请选择时间",
                    mask: true,
                    duration: 1000,
                    icon: "none",
                });
                return false;
            } else if (that.outlayData.zhichuMoney == "") {
                uni.showToast({
                    title: "请输入金额",
                    mask: true,
                    duration: 1000,
                    icon: "none",
                });
                return false;
            }
            // 符合条件 组装数据
            const saveMoneyDetail = {
                zhichuMoney: Number(-(that.outlayData.zhichuMoney)),
                accountClass: 0,
                expendDetail: that.outlayData.accountClass,
                bookingTime: that.outlayData.bookingTime,
                beizhuinputVal: that.outlayData.zhichubeizhu,
            };
            const selectTimeJiequ = that.outlayData.bookingTime.substring(0, 7);

            //提交数据到bmob
            const query = that.Bmob.Query("Design_accMessages");
            query.set("userID", that.userId);
            query.set("booking_time", that.outlayData.bookingTime);
            query.set("account_class", 0);
            query.set("saveMoney_details", saveMoneyDetail);
            query.set("zhichuMoney", Number(-(that.outlayData.zhichuMoney)));
            query.set("btYearAndMonth", selectTimeJiequ);
            query
                .save()
                .then((res) => {
                    console.log(res);
                    console.log("新增成功")
                    uni.showToast({
                        title:'记账成功',
                        duration:2000
                    })
                    setTimeout(()=>{
                        // 跳转到 tabBar 页面只能使用 switchTab 跳转
                         uni.switchTab({
                           url: '/pages/index/index'
                        });
                    },2000)
                   
                })
                .catch((err) => {
                    console.log(err);
                });

            console.log("条件符合");
        },
        submitIncomeBooking() {
            const that = this;
            if (that.incomeData.accountClass == "") {
                uni.showToast({
                    title: "请先点击支出类型",
                    mask: true,
                    duration: 1000,
                    icon: "none",
                });
                return false;
            } else if (that.incomeData.bookingTime == "") {
                uni.showToast({
                    title: "请选择时间",
                    mask: true,
                    duration: 1000,
                    icon: "none",
                });
                return false;
            } else if (that.incomeData.zhichuMoney == "") {
                uni.showToast({
                    title: "请输入金额",
                    mask: true,
                    duration: 1000,
                    icon: "none",
                });
                return false;
            }
            // 符合条件 组装数据
            const saveMoneyDetail = {
                shouruinputVal: Number(that.incomeData.zhichuMoney),
                accountClass: 1,
                expendDetail: that.incomeData.accountClass,
                bookingTime: that.incomeData.bookingTime,
                beizhuinputVal: that.incomeData.zhichubeizhu,
            };
            const selectTimeJiequ = that.incomeData.bookingTime.substring(0, 7);
            //提交数据到bmob
            const query = that.Bmob.Query("Design_accMessages");
            query.set("userID", that.userId);
            query.set("booking_time", that.incomeData.bookingTime);
            query.set("account_class", 1);
            query.set("saveMoney_details", saveMoneyDetail);
            query.set("zhichuMoney", Number(that.incomeData.zhichuMoney));
            query.set("btYearAndMonth", selectTimeJiequ);
            query
                .save()
                .then((res) => {
                    console.log(res);
                    console.log("新增成功")
                    uni.showToast({
                        title:'记账成功',
                        duration:2000
                    })
                    setTimeout(()=>{
                        // 跳转到 tabBar 页面只能使用 switchTab 跳转
                         uni.switchTab({
                           url: '/pages/index/index'
                        });
                    },2000)
                   
                })
                .catch((err) => {
                    console.log(err);
                });

            console.log("条件符合");
        },
        changeOutlayMoney(e) {
            this.outlayData.zhichuMoney = e.detail;
        },
        changeOutlayBeizhu(e){
            this.outlayData.zhichubeizhu = e.detail;
        },
        changeIncomeMoney(e) {
            this.incomeData.zhichuMoney = e.detail;
        },
        changeIncomeBeizhu(e){
            this.incomeData.zhichubeizhu = e.detail;
        }
    },
};
</script>
<style scoped>
.booking-wrap {
    width: 100%;
    height: 100%;
    font-size: 28rpx;
}
.booking-header {
    width: 100%;
    height: 100rpx;
    background-color: #ffd700;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
}
.booking-header .header-box {
    width: 80%;
    height: 70rpx;
    display: flex;
    justify-content: space-around;
    border: 1px solid #000;
    box-sizing: border-box;
    border-radius: 20rpx;
    overflow: hidden;
}
.booking-header .header-box .header-item {
    width: 50%;
    box-sizing: border-box;
    text-align: center;
    line-height: 70rpx;
    color: #fff;
    font-size: 32rpx;
    font-weight: 700;
}
.booking-header .header-box .header-item.actived {
    background: #343233;
}
.booking-container {
    width: 100%;
    height: auto;
    height: calc(100vh - 100rpx);
}
.booking-container .swiper {
    /* height: auto; */
    height: calc(100vh - 100rpx);
    box-sizing: border-box;
    /* padding: 20rpx 40rpx 20rpx 40rpx; */
    overflow-y: auto;
    /* overflow: hidden; */
}
.booking-container .swpier-item {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 100rpx);
    /* align-items: center; */
}
swiper-item {
    overflow-y: auto !important;
    box-sizing: border-box;
    padding: 20rpx 40rpx 20rpx 40rpx;
}
swiper-item::-webkit-scrollbar {
    display: none;
}
.booking-item {
    display: flex;
    align-items: center;
}
.booking-item .item-tit {
    height: 70rpx;
    width: 120rpx;
    line-height: 70rpx;
    color: #696969;
    border-radius: 20rpx;
    background-color: #ffd700;
    text-align: center;
    font-size: 28rpx;
}
van-field {
    flex: 1;
}
.booking-btn {
    width: 100%;
    height: 70rpx;
    background-color: #ffd700;
    line-height: 70rpx;
    text-align: center;
    color: #696969;
    border-radius: 70rpx;
    margin-top: 10rpx;
    margin-bottom: 20rpx;
}
.booking-btn .van-button {
    width: 100%;
    height: 70rpx;
    background-color: #ffd700;
    line-height: 70rpx;
    text-align: center;
    color: #fff;
}

.booking-container .swpier-item .type-icon-box {
    display: flex;
    flex-wrap: wrap;
}
.booking-container .type-icon-box .type-item {
    width: 19%;
    height: 150rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-right: 6rpx;
    margin-bottom: 6rpx;
    background-color: #f6f6f6;
    border-radius: 70rpx;
}
.booking-container .type-icon-box .type-item.actived {
    background-color: #ffd700;
}
.booking-container .type-icon-box .type-item image {
    width: 50rpx;
    height: 50rpx;
}
.booking-container .type-icon-box .type-item .type-name {
    font-size: 28rpx;
    /* color: #333; */
    /* color: #696969; */
}
</style>