<!--
 * @Description: 
 * @Author: lgt
 * @Date: 2021-07-13 21:11:03
 * @LastEditTime: 2021-08-22 13:36:35
 * @LastEditors: xxx
-->
<template>
    <view class="bill-wrapper">
        <view class="bill-header">
            <view @click="handleSelectTime">{{selectMonth}}</view>
            <van-icon name="arrow-down" />
        </view>
        <view class="bill-balance-wrapper">
            <view class="bill-top">
                <view>{{monthBalance.balance}}</view>
                <view class="bill-title">本月结余正负值</view>
            </view>
            <view class="bill-con">
                <view class="bill-con-l">
                    <view class="bill-value">{{monthBalance.outlay}}</view>
                    <view class="bill-title">本月支出</view>
                    <view class="bill-look" @click="lookBill('outlay')">查看</view>
                </view>
                <view class="bill-con-r">
                    <view class="bill-value">{{monthBalance.income}}</view>
                    <view class="bill-title">本月收入</view>
                    <view class="bill-look" @click="lookBill('income')">查看</view>
                </view>
            </view>
        </view>
        <view class="charts-box box1">
            <view class="charts-title"><text></text>每日统计</view>
            <view class="is-no-show" v-if="!isShowDailychartData">暂无统计数据……</view>
            <qiun-data-charts type="column"
                              :chartData="DailychartData"
                              background="none"
                              :ontouch="true" 
                              :canvas2d="true" 
                              canvasId="Dailychart"
                              :reshow="isShowDailychartData"
                              v-if="isShowDailychartData"/>
        </view>
        <view class="charts-box box2">
            <view class="charts-title"><text></text>支出统计</view>
             <view class="is-no-show" v-if="!isShowPieExpendData">暂无统计数据……</view>
            <qiun-data-charts type="pie"
                              :chartData="PieExpendchartData"
                              background="none"
                              :canvas2d="true" 
                              canvasId="PieExpend"
                               :reshow="isShowPieExpendData"
                              v-if="isShowPieExpendData" />
        </view>
        <view class="charts-box box3">
            <view class="charts-title"><text></text>收入统计</view>
             <view class="is-no-show" v-if="!isShowPieInComeData">暂无统计数据……</view>
            <qiun-data-charts type="pie"
                              :chartData="PieInComechartData"
                              background="none"
                              :canvas2d="true" 
                              canvasId="PieInCome"
                              :reshow="isShowPieInComeData"
                              v-if="isShowPieInComeData"
                             />
        </view>

        <!-- <qiun-data-charts type="column"
                          :chartData="chartData" /> -->

        <van-action-sheet :show="isShowTimeSelect">
            <van-datetime-picker type="year-month"
                                 :value="currentDate"
                                 :min-date="minDate"
                                 :formatter="formatter"
                                 @confirm="onConfirmTime"
                                 @cancel="cancelTime" />
        </van-action-sheet>
    </view>
</template>

<script>
import dayjs from "dayjs";
export default {
    data() {
        return {
            userId: "",
            isShowTimeSelect: false,
            selectMonth: "2021年07月",
            currentDate: new Date().getTime(),
            minDate: dayjs("1971-01-01").valueOf(),
            formatter(type, value) {
                // console.log("type")
                if (type === "year") {
                    return `${value}年`;
                }
                if (type === "month") {
                    return `${value}月`;
                }
                return value;
            },
            chartData: {
                categories: ["2016", "2017", "2018", "2019", "2020", "2021"],
                series: [
                    {
                        name: "目标值",
                        data: [35, 36, 31, 33, 13, 34],
                    },
                    {
                        name: "完成量",
                        data: [18, 27, 21, 24, 6, 28],
                    },
                ],
            },
            monthBalance: {
                balance: "0",
                outlay: "0",
                income: "0",
            },
            originData: [],
            arrExpend: [],
            arrIncome: [],
            isShowPieExpendData:false,
            PieExpendchartData: {
                categories: [],
                series: [
                    {
                        data: [
                            {
                                name: "一班",
                                value: 50,
                            },
                            {
                                name: "二班",
                                value: 30,
                            },
                            {
                                name: "三班",
                                value: 20,
                            },
                        ],
                    },
                ],
            },
            isShowPieInComeData:false,
            PieInComechartData: {
                categories: [],
                series: [
                    {
                        data: [],
                    },
                ],
            },
            isShowDailychartData:false,
            DailychartData: {
                categories: [
                  
                ],
                series: [
                    {
                        name: "支出",
                        data: [
                          
                        ],
                    },
                    {
                        name: "收入",
                        data: [
                           
                        ],
                    },
                ],
            },
            thirtyOneMonth:['01','03','05','07','08',10,12],
            thirtyMonth:['04','06','09',11],
            twentyEightMonth:['02'],
        };
    },
    onShow() {
        this.selectMonth = dayjs().format("YYYY年MM月");
        this.querySelectMonth = dayjs().format("YYYY-MM");
        this.userId = uni.getStorageSync("userId") || "";
        this.getMonthData();
    },
    methods: {
        getMonthData() {
            uni.showLoading({
                title: "加载中",
                mask: true,
            });
            const that = this;
            const query = this.Bmob.Query("Design_accMessages");
            query.equalTo("userID", "==", that.userId);
            query.equalTo("btYearAndMonth", "==", that.querySelectMonth);
            query.limit(1000);
            query
                .find()
                .then((res) => {
                    console.log("共查询到数据", res);
                    that.originData = res;
                    let zhengfuResult = 0;
                    let expendResult = 0;
                    let incomeResult = 0;
                    let arrExpend = [];
                    let arrIncome = [];
                    if (that.originData.length != 0) {
                        that.originData.forEach((item, index) => {
                            if (item.account_class == 1) {
                                //收入
                                arrIncome.push(item);
                                incomeResult += item.zhichuMoney;
                            } else {
                                arrExpend.push(item);
                                expendResult += item.zhichuMoney;
                            }
                        });
                    }
                    zhengfuResult = expendResult + incomeResult;

                    that.monthBalance.balance = zhengfuResult.toFixed(2); // 保留两位小数
                    that.monthBalance.outlay = Math.abs(expendResult);
                    that.monthBalance.income = incomeResult;
                    that.arrIncome = arrIncome;
                    that.arrExpend = arrExpend;

                    //处理统计报表
                    that.handleDailyEchartData()
                    that.handlePieExpendData();
                    that.handlePieInComeData();
                    uni.hideLoading();
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        //处理支出饼状图
        handlePieExpendData() {
            const that = this;
            let data = JSON.parse(JSON.stringify(that.arrExpend));
            console.log("支出的饼状图", data);
            if (data.length == 0) {
                this.isShowPieExpendData = false;
                return false;
            }
            let sortArr = [];
            let sortArrDetail = [];
            data.forEach((item, index) => {
                if (!sortArr.includes(item.saveMoney_details.expendDetail)) {
                    sortArr.push(item.saveMoney_details.expendDetail);
                    sortArrDetail.push({
                        name: item.saveMoney_details.expendDetail,
                        value: Math.abs(item.saveMoney_details.zhichuMoney),
                    });
                } else {
                    sortArrDetail[sortArrDetail.length - 1].value += Math.abs(
                        item.saveMoney_details.zhichuMoney
                    );
                }
            });
            if (sortArrDetail.length <= 6) {
                that.PieExpendchartData.series[0].data = sortArrDetail;
            } else {
                //数组对象 重新排序 取出前5大 + 其他
            }
            that.isShowPieExpendData = true;
            console.log("sortArr", sortArr);
            console.log("sortArr", sortArrDetail);
        },
        handlePieInComeData() {
            const that = this;
            let data = JSON.parse(JSON.stringify(that.arrIncome));
            console.log("支出的饼状图", data);
            if (data.length == 0) {
                this.isShowPieInComeData = false;
                return false;
            }
            let sortArr = [];
            let sortArrDetail = [];
            data.forEach((item, index) => {
                if (!sortArr.includes(item.saveMoney_details.expendDetail)) {
                    sortArr.push(item.saveMoney_details.expendDetail);
                    sortArrDetail.push({
                        name: item.saveMoney_details.expendDetail,
                        value: item.saveMoney_details.shouruinputVal,
                    });
                } else {
               
                    let findIndex = sortArr.indexOf(item.saveMoney_details.expendDetail)
                    sortArrDetail[findIndex].value +=  item.saveMoney_details.shouruinputVal

                    // sortArrDetail[sortArrDetail.length - 1].value += 
                    //     item.saveMoney_details.zhichuMoney
                    // ;
                }
            });
            if (sortArrDetail.length <= 6) {
                that.PieInComechartData.series[0].data = sortArrDetail;
            } else {
                //数组对象 重新排序 取出前5大 + 其他
            }
            that.isShowPieInComeData =true;
            console.log("income-sortArr1122", sortArr);
            console.log("income-sortArr", sortArrDetail);
        },
        handleDailyEchartData(){
            const that = this;
            const orgData = JSON.parse(JSON.stringify(that.originData))
             if (orgData.length == 0) {
                this.isShowDailychartData = false;
                return false;
            }
            let month = this.querySelectMonth.substring(5);
            let categoriesData = [];
            let outlaydata = [];
            let incomedata = []; 
            let count = 0;
            if(this.thirtyOneMonth.includes(month)){
                count = 31;
            }else if(this.thirtyMonth.includes(month)){
                count = 30
            }else{
                count = 28;
            }
            // 遍历生成数组
            for(let i = 1;i <= count;i++){
                categoriesData.push(i);
                outlaydata.push(0);
                incomedata.push(0)
            }

            //赋值
            that.DailychartData.categories = categoriesData;
            that.DailychartData.series[0].data=outlaydata;
            that.DailychartData.series[1].data=incomedata;

            
            orgData.forEach((item,index)=>{
                if(item.account_class == 1){
                    //收入的操作
                    const dateNum = dayjs(item.booking_time).get('date')
                    // console.log("dataNum",dateNum)
                    that.DailychartData.series[1].data[dateNum - 1] += Math.abs(item.zhichuMoney)
                }else{
                     const dateNum = dayjs(item.booking_time).get('date')
                    // console.log("dataNum",dateNum)
                    that.DailychartData.series[0].data[dateNum - 1] += Math.abs(item.zhichuMoney)
                }
            })
            that.isShowDailychartData = true;
        },
        handleSelectTime() {
            this.isShowTimeSelect = true;
        },
        onConfirmTime(e) {
            const that = this;
            // console.log("e",dayjs(e.detail).format("YYYY年MM月"))
            this.selectMonth = dayjs(e.detail).format("YYYY年MM月");
            this.querySelectMonth = dayjs(e.detail).format("YYYY-MM");
            //重新请求数据 先清空

            that.getMonthData();
            this.isShowTimeSelect = false;
        },
        cancelTime() {
            this.isShowTimeSelect = false;
        },
        //查看详情
        lookBill(type){
            console.log("点击查看详情")
            let dataJson = {};
            if(type == 'outlay'){
                dataJson = {
                    lookType:'outlay',
                    data: this.arrExpend
                }
            }else{
                dataJson = {
                    lookType:'income',
                    data: this.arrIncome
                }
            }

            uni.setStorageSync('lookBill',dataJson);
            uni.navigateTo({
                url:'/pages/billStatistics/billDetail?time='+this.selectMonth
            })

        }
    },
};
</script>

<style scoped>
.bill-wrapper {
    width: 100%;
    min-height: 100%;
}
.bill-header {
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
}

.bill-balance-wrapper {
    width: 95%;
    margin-left: 2.5%;
    height: 300rpx;
    border-radius: 10rpx;
    background: #ffd700;
    margin-top: 20rpx;
    margin-bottom: 20rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.bill-balance-wrapper .bill-title {
    font-size: 28rpx;
    color: #696969;
    font-weight: 700;
}
.bill-balance-wrapper .bill-top {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 20rpx;
    font-weight: 700;
    font-size: 32rpx;
}
.bill-balance-wrapper .bill-con {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 28rpx;
}
.bill-balance-wrapper .bill-con .bill-con-l {
    width: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.bill-con .bill-con-l .bill-value {
    font-weight: 700;
    font-size: 32rpx;
    color: red;
}
.bill-balance-wrapper .bill-con .bill-con-r {
    width: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.bill-con .bill-con-r .bill-value {
    font-weight: 700;
    font-size: 32rpx;
    color: #3ba234;
}
.charts-box .charts-title {
    padding-left: 2.5%;
    font-size: 32rpx;
    margin-bottom: 20rpx;
}
.charts-box .charts-title text {
    display: inline-block;
    width: 10rpx;
    height: 32rpx;
    background: #ffd700;
    margin-right: 8rpx;
    /* margin-top: -4rpx; */
}
.charts-box .is-no-show{
    font-size: 28rpx;
    color: #696969;
    text-align: center;
    margin-bottom: 20rpx;
}
</style>