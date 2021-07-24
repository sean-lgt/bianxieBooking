<!--
 * @Description: 
 * @Author: lgt
 * @Date: 2021-07-13 21:11:44
 * @LastEditTime: 2021-07-21 20:47:32
 * @LastEditors: xxx
-->
<template>
    <view class="clockin-wrapper">
        <view class="clockin-header">
            <view class="header-l">
                <view class="header-icon"></view>
                <view>已打卡</view>
            </view>
            <!-- <view class="header-c">
                <view>打卡获得5积分</view>
                <view>补签消耗3积分</view>
            </view> -->
            <view class="header-r">
                当前积分:<text>{{totalScore}}</text>
            </view>
        </view>
        <view class="clockin-calendar">
            <uni-calendar :selected="selectDataList"
                          :insert="true"
                          :lunar="true"
                          :start-date="'2019-3-2'"
                          :end-date="'2019-5-20'"
                          @change="change"></uni-calendar>
        </view>
        <view class="clockin-count-wrapper">
            <view>截止目前，您累计已打卡</view>
            <view class="clockin-day">
                <view class="count">{{totalDates}}</view>
                <view>天</view>
            </view>
            <view>请再接再厉,继续努力</view>
        </view>
        <view class="clockin-rank-wrapper">
            <view @click="lookRule">查看规则</view>
            <view @click="lookRank">查看排行榜</view>
        </view>

        <van-overlay :show="isshowRank"
                     @click="closeRank">
            <view class="rank-wrapper">
                <view class="rank-title">积分榜</view>
                <view class="rank-header">
                    <view>排名</view>
                    <view>用户名</view>
                    <view>打卡天数</view>
                    <view>总积分</view>
                </view>
                <view class="rank-value-box"
                      v-for="(item,index) in rankList"
                      :key="item.id">
                    <view>{{item.id}}</view>
                    <view>{{item.userName}}</view>
                    <view>{{item.clockDays}}</view>
                    <view>{{item.totalScore}}</view>
                </view>
            </view>
        </van-overlay>
    </view>

</template>

<script>
import dayjs from "dayjs";
import { uniCalendar } from "@dcloudio/uni-ui";
export default {
    components: { uniCalendar },
    data() {
        return {
            userId: "",
            currentYM: "",
            currentYMD: "",
            totalDates: 0,
            selectDataList: [],
            selectDataListCopy: [],
            totalScore: "--",
            clockBtnFlag: true,
            isshowRank: false,
            rankList: [
                {
                    id: 1,
                    userName: "SalenXuYu",
                    clockDays: "261",
                    totalScore: "1305",
                },
                {
                    id: 2,
                    userName: "boxue0606",
                    clockDays: "253",
                    totalScore: "1256",
                },
                {
                    id: 3,
                    userName: "布力",
                    clockDays: "250",
                    totalScore: "1245",
                },
                {
                    id: 4,
                    userName: "菜小妹",
                    clockDays: "242",
                    totalScore: "1205",
                },
                {
                    id: 5,
                    userName: "Zhss9907",
                    clockDays: "222",
                    totalScore: "1105",
                },
                {
                    id: 6,
                    userName: "sensekeen",
                    clockDays: "202",
                    totalScore: "1083",
                },
                {
                    id: 7,
                    userName: "扯淡的疯子",
                    clockDays: "196",
                    totalScore: "1010",
                },
                {
                    id: 8,
                    userName: "橙.",
                    clockDays: "187",
                    totalScore: "963",
                },
                {
                    id: 9,
                    userName: "!丹琳",
                    clockDays: "182",
                    totalScore: "943",
                },
                {
                    id: 10,
                    userName: "da优十",
                    clockDays: "180",
                    totalScore: "935",
                },
            ],
        };
    },
    onShow() {
        // 获取用户的openid
        this.userId = uni.getStorageSync("userId") || "";
        this.currentYM = dayjs().format("YYYY-MM");
        this.currentYMD = dayjs().format("YYYY-MM-DD");
        // console.log("今天",dayjs().date())
        // this.getWXLoginCode();
        this.getUserClockData();
    },
    methods: {
        change(e) {
            console.log("e", e);
            //首先判断是否授权登录了
            let userInfo = uni.getStorageSync("wxUserInfo") || '';
            if(userInfo == ''){
                //授权登录
                this.getUserInfo(e);
                return false;
            }
            // return;
            const that = this;
            if (this.selectDataListCopy.includes(e.fulldate)) {
                uni.showToast({
                    title: "您已经打过卡了",
                    mask: true,
                    duration: 1500,
                    icon: "none",
                });
                return false;
            }
            //判断是否是补卡操作
            let currentday = dayjs(this.currentYMD).valueOf();
            if (currentday > dayjs(e.fulldate).valueOf()) {
                //补签行为
                // 判断当前积分是否足够 -3
                // that.totalScore = 0;
                if (that.totalScore < 4) {
                    uni.showToast({
                        title: "积分不足，无法补签",
                        mask: true,
                        duration: 1500,
                        icon: "none",
                    });
                    return false;
                }
                uni.showModal({
                    title: "补卡提示",
                    content: "你确认补签打卡吗",
                    success: (res) => {
                        if (res.confirm) {
                            that.addClockData("patch", e.fulldate);
                        }
                    },
                });
            } else {
                that.addClockData("add", e.fulldate);
            }
        },
        getUserInfo(e){
            const that = this;
             uni.getUserProfile({
                    desc: "weixin",
                    success: (res) => {
                        console.log(res, "授权成功", res);
                        uni.setStorageSync("wxUserInfo", res.userInfo);
                        //重新调用打卡
                        that.change(e)
                    },
                    fail: (err) => {
                        console.log(err, "失败授权");
                    },
                });
        },
        addClockData(type, time) {
            // patch 补签
            if (!this.clockBtnFlag) {
                return false;
            }
            this.clockBtnFlag = false;
            const that = this;
            const score = type == "patch" ? -3 : 5;
            const query = that.Bmob.Query("Design_personalTodo");
            query.set("dakaYM", dayjs(time).format("YYYY-MM"));
            query.set("dakaDay", dayjs(time).date().toString());
            query.set("userID", that.userId);
            query.set("score", score);
            query
                .save()
                .then((res) => {
                    console.log(res);
                    console.log("新增成功");
                    wx.showToast({
                        title: "打卡成功",
                        duration: 1500,
                    });
                    setTimeout(() => {
                        that.clockBtnFlag = true;
                        that.getUserClockData();
                    }, 1500);
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        getUserClockData() {
            uni.showLoading({
                title: "加载中",
                mask: true,
            });
            const that = this;
            const query = this.Bmob.Query("Design_personalTodo");
            query.equalTo("userID", "==", that.userId);
            // query.equalTo("dakaYM", "==", that.currentYM);
            query.limit(1000);
            query
                .find()
                .then((res) => {
                    console.log("共查询到数据", res);
                    that.totalDates = res && res.length;
                    let scoreNum = 0;
                    res.forEach((item, index) => {
                        let dakaDay = item.dakaDay.toString().padStart(2, "0");
                        const day = item.dakaYM + "-" + dakaDay;
                        that.selectDataList.push({ date: day });
                        that.selectDataListCopy.push(day);
                        scoreNum += item.score;
                    });
                    that.totalScore = scoreNum;
                    uni.hideLoading();
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        lookRule() {
            uni.showToast({
                title: "打卡获得5积分,补卡消耗3积分",
                mask: true,
                duration: 3000,
                icon: "none",
            });
        },
        //查看排行榜
        lookRank() {
            console.log("查看排行榜");
            this.isshowRank = true;
        },
        closeRank() {
            this.isshowRank = false;
        },
    },
};
</script>
<style scoped>
.clockin-calendar {
    width: 100vw;
    font-size: 28rpx;
    /* height: 500rpx; */
}

/deep/ .uni-calendar-item--checked {
    background-color: #ffd700 !important;
    color: #333 !important;
}
view /deep/ .uni-calendar-item__weeks-box-circle {
    width: 16rpx;
    height: 16rpx;
    background: green !important;
}
/deep/ .uni-calendar__backtoday {
    background-color: #ffd700 !important;
}
view /deep/ .uni-calendar-item--isDay {
    background-color: #ffd700 !important;
    color: #333 !important;
}
view /deep/ .uni-calendar__header-btn {
    border-left-color: #ffd700;
    border-top-color: #ffd700;
}
view /deep/ .uni-calendar__backtoday{
    display: none !important;
}
.clockin-header {
    width: 100%;
    height: 100rpx;
    box-sizing: border-box;
    padding: 0 2.5%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #ffd700;
    font-size: 28rpx;
}
.clockin-header .header-l {
    display: flex;
    align-items: center;
}
.clockin-header .header-l .header-icon {
    width: 28rpx;
    height: 28rpx;
    background: green;
    border-radius: 50%;
    margin-right: 10rpx;
}
.header-r {
    display: flex;
    align-items: center;
}
.header-r text {
    font-size: 32rpx;
    margin-left: 8rpx;
    font-weight: 700;
}
.clockin-count-wrapper {
    width: 95%;
    height: 300rpx;
    border-radius: 20rpx;
    margin-left: 2.5%;
    background: #ffd700;
    margin-top: 20rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 32rpx;
}
.clockin-count-wrapper .clockin-day {
    display: flex;
    align-items: center;
}
.clockin-count-wrapper .count {
    color: red;
    font-size: 60rpx;
    background: #fff;
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20rpx;
}
.clockin-rank-wrapper {
    margin: 10rpx 2.5% 40rpx 2.5%;
    width: 95%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 28rpx;
    /* padding-bottom: 40rpx; */
}
.clockin-rank-wrapper view {
    border-bottom: 4rpx solid #ffd700;
}
.rank-wrapper {
    width: 80%;
    margin-top: 10%;
    margin-left: 10%;
    height: auto;
    background: #fff;
    padding: 20rpx 10rpx;
    font-size: 28rpx;
}
.rank-wrapper .rank-title {
    font-size: 32rpx;
    font-weight: 700;
    text-align: center;
    margin-bottom: 10rpx;
}
.rank-wrapper .rank-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2rpx solid #ffd700;
}
.rank-wrapper .rank-header view {
    width: 23%;
    text-align: center;
}
.rank-value-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2rpx solid #eee;
}
.rank-wrapper .rank-value-box view {
    width: 23%;
    text-align: center;
    height: 60rpx;
    line-height: 60rpx;
}
</style>