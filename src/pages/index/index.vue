<template>
    <view class="index-wrapper">
        <view class="index-top-wrapper">
            <view class="index-top-left"
                  @click="handleLookType"
                  v-if="!isShowOperating">
                <view>类型:</view>
                <view class="look-type">{{lookType}}</view>

            </view>
            <view class="index-top-left"
                  v-if="isShowOperating">
                <van-checkbox checked-color="#696969"
                              :value="isAllCheck"
                              @change="allCheckChange()">全选</van-checkbox>
            </view>
            <view class="index-top-center"
                  v-if="isShowOperating"
                  @click="deleteItem">
                <van-icon name="delete-o" /><text>删除</text>
            </view>
            <view class="index-top-right"
                  @click="isShowOperating = !isShowOperating">

                <van-icon name="setting-o" /><text>{{!isShowOperating?'操作':'完成'}}</text>
            </view>
        </view>
        <view class="index-content">
            <!-- 骨架屏幕 -->
            <!-- <van-skeleton title row="3" /> -->
            <view v-if="bookingDetailsList.length > 0">
                <view class="booking-item"
                      v-for="(item,index) in bookingDetailsList"
                      :key="item.objectId">
                    <view class="detail-l-icon"
                          v-show="isShowOperating">
                        <van-checkbox checked-color="#696969"
                                      :value="item.isCheck"
                                      @change="oncheckboxChange(item)"></van-checkbox>
                    </view>
                    <view class="detail-l">
                        <view class="detail-l-time">{{item.booking_time}}</view>
                        <view class="detail-l-titBg">{{item.saveMoney_details.expendDetail}}</view>
                    </view>
                    <view class="detail-c">{{item.saveMoney_details.beizhuinputVal}}</view>
                    <view :class="item.zhichuMoney > 0?'green detail-r ':'detail-r'">{{item.zhichuMoney}}</view>
                </view>
            </view>

            <!-- </van-skeleton> -->
            <van-empty description="暂无数据"
                       v-if="bookingDetailsList.length == 0" />
        </view>

        <van-action-sheet :show="showSelectType">
            <van-picker show-toolbar
                        :columns="columns"
                        @cancel="onCancel"
                        @confirm="onConfirm" />
        </van-action-sheet>
        <!-- <van-loading size="24px" vertical>加载中...</van-loading> -->
    </view>

</template>

<script>
export default {
    data() {
        return {
            title: "Hellosssss",
            openId: "",
            columns: ["杭州", "宁波", "温州", "嘉兴", "湖州"],
            lookType: "全部",
            showSelectType: false,
            bookingDetailsList: [],
            checked: "",
            isAllCheck: "",
            isShowOperating: false,
        };
    },
    onShow() {
        this.getWXLoginCode();
    },
    methods: {
        // 点击类型 筛选查看内容
        handleLookType() {
            this.showSelectType = true;
        },
        // 点击类型-弹窗-取消事件
        onCancel() {
            console.log("取消");
            this.showSelectType = false;
        },
        // 点击类型-弹窗-确定
        onConfirm(e) {
            this.lookType = e.detail.value;
            this.showSelectType = false;
        },
        // 全选操作
        allCheckChange(event) {
            this.isAllCheck = event.detail;
            this.bookingDetailsList.forEach((item, index) => {
                item.isCheck = event.detail;
            });
        },
        //复选框选中状态
        oncheckboxChange(currentItem) {
            console.log("currentItem", currentItem);
            let flag = true; //反正法  判断全选  假设所有按钮都选中了
            this.bookingDetailsList.forEach((item, index) => {
                if (item.objectId == currentItem.objectId) {
                    console.log("item");
                    item.isCheck = !item.isCheck;
                }
                //如果有未选中的 则反正失败
                if (!item.isCheck) {
                    flag = false;
                }
            });
            this.isAllCheck = flag;
            this.$forceUpdate();
            // this.checked = event.detail
        },
        getWXLoginCode() {
            const that = this;
            uni.showLoading({
                title: "加载中",
                mask: true,
            });
            uni.login({
                provider: "weixin",
                success: function (loginRes) {
                    console.log("登录code", loginRes);
                    // 获取用户信息
                    that.Bmob.User.loginWithWeapp(loginRes.code).then(function (
                        user
                    ) {
                        //o9Dy55SOyX7I85d_KFCT1DMuDxDk
                        // 可以拿到openid
                        console.log(
                            "获取用户的openid",
                            user.authData.weapp.openid
                        );
                        uni.setStorageSync("userId",user.authData.weapp.openid)
                        that.openId = user.authData.weapp.openid;
                        that.getList();
                    });
                },
            });
        },
        getList() {
            uni.showLoading({
                title: "加载中",
                mask: true,
            });
            const that = this;
            const query = this.Bmob.Query("Design_accMessages");
            query.equalTo("userID", "==", that.openId);
            query.limit(1000);
            query
                .find()
                .then((res) => {
                    console.log("共查询到" + res.length + "条记录");
                    console.log("记账数据", res);
                    this.bookingDetailsList = res.reverse();
                    this.bookingDetailsList.forEach((item, index) => {
                        item.isCheck = false;
                    });
                    uni.hideLoading();
                })
                .catch((err) => {
                    console.log(err);
                });
            // query.count().then((res) => {
            //     console.log(`共有${res}条记录`);
            //     uni.hideLoading();
            // });
        },
        //删除操作
        deleteItem() {
            const that = this;
            uni.showModal({
                title: "删除提示",
                content: "您确认删除所选内容吗?",
                success: function (res) {
                    if (res.confirm) {
                        const objectIdArr = [];
                        that.bookingDetailsList.forEach((item, index) => {
                            if (item.isCheck) {
                                objectIdArr.push(item.objectId);
                            }
                        });
                        const query = that.Bmob.Query("Design_accMessages");
                        query.containedIn("objectId", objectIdArr);
                        query.find().then((res) => {
                            res.destroyAll()
                                .then((res) => {
                                    // 成功批量修改
                                    console.log(res, "ok");
                                    that.getList();
                                    that.isShowOperating = false;
                                    uni.pageScrollTo({
                                        scrollTop: 0,
                                        duration: 300,
                                    });
                                })
                                .catch((err) => {
                                    console.log(err);
                                });
                        });
                    }
                },
            });
        },
    },
};
</script>

<style scoped>
.index-top-wrapper {
    width: 100vw;
    height: 90rpx;
    background-color: #ffd700;
    box-sizing: border-box;
    padding: 0 2.5%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 28rpx;
    color: #333;
    position: fixed;
    top: 0;
    box-sizing: border-box;
    z-index: 99;
}
.index-top-wrapper .index-top-left {
    height: 90rpx;
    display: flex;
    align-items: center;
    /* justify-content: ; */
}
.index-top-wrapper .index-top-right {
    font-size: 40rpx;
    display: flex;
    align-items: center;
}
.index-top-wrapper .index-top-right text {
    font-size: 28rpx;
    /* line-height: 40rpx; */
    /* height: 40rpx; */
    margin-left: 4rpx;
}
.index-top-wrapper .index-top-center {
    font-size: 40rpx;
    display: flex;
    align-items: center;
}
.index-top-wrapper .index-top-center text {
    font-size: 28rpx;
    /* line-height: 40rpx; */
    /* height: 40rpx; */
    margin-left: 4rpx;
}
.index-top-wrapper .index-top-left .look-type {
    margin: 0 10rpx;
}
.action-sheet-top {
    display: flex;
    height: 80rpx;
    padding: 0 10%;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
}
.index-content {
    margin-top: 100rpx;
    padding: 0 10rpx;
}
.booking-item {
    display: flex;
    align-items: center;
    /* justify-content: space-between; */
    width: 100%;
    border-top: 1px solid #dcdcdc;
    border-bottom: 1px solid #dcdcdc;
    margin-top: 20rpx;
    height: 110rpx;
    box-sizing: border-box;
}
.booking-item .detail-l-icon {
    margin: 0 20rpx;
}
.booking-item .detail-l {
    margin: 0 20rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    /* flex: 1; */
}
.booking-item .detail-l .detail-l-time {
    color: #696969;
    font-size: 20rpx;
}
.booking-item .detail-l .detail-l-titBg {
    width: 120rpx;
    height: 60rpx;
    background-color: #ffd700;
    border-radius: 25rpx;
    line-height: 60rpx;
    text-align: center;
    color: #696969;
    font-weight: bold;
}
.booking-item .detail-c {
    flex: 1;
    min-width: 0;
    text-align: center;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
    color: #696969;
}
.booking-item .detail-r {
    margin: 0 20rpx;
    color: red;
    font-size: 32rpx;
}
.booking-item .detail-r.green {
    color: #3ba234;
}
</style>
