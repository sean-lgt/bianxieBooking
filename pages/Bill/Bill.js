// pages/Bill/Bill.js
const app = getApp()
var util = require('../../utils/util.js')
// 引进Bmob后端云JS
var Bmob = require('../../utils/bmob.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //获取用户唯一标识 openid
    openid:"",
    // 用户名
    userName: "Sean涛",
    // 定义时间
    year: '',
    month: '',
    day: '',
    end: '',
    selectYM: '',
    // 存储本月数据
    monthList: [],
    // 资金正负值
    zhengfuResult: 0,
    // 本月支出
    expendResultMonth: 0,
    incomeResultMonth: 0,
    Shoutext: "展开",
    Zhitext: "展开",
    left: 'none',
    right: 'none',
    lWid: '50vw',
    rWid: '50vw',
    list: [],

    // 本月最大支出
    arrExpend: [],
    arrIncome: [],
    expendMax: 0,
    incomeMax: 0,
    expendMaxDetail:[],
    incomeMaxDetail:[]
  },

  showZhi(e) {
    let Zhitext = this.data.Zhitext
    if (this.data.Shoutext == "展开") {
      if (Zhitext == "展开") {
        // Zhitext = "收起"
        this.setData({
          Zhitext: "收起",
          left: '',
          lWid: '100vw',
          // rWid: '0vw',
          // right: "none"
        })
      } else {
        // Zhitext = "展开"
        this.setData({
          Zhitext: "展开",
          left: 'none',
          lWid: '0vw',
        })
      }
    } else {
      if (Zhitext == "展开") {
        // Zhitext = "收起"
        this.setData({
          Zhitext: "收起",
          left: '',
          lWid: '50vw',
          rWid: '50vw'
        })
      } else {
        // Zhitext = "展开"
        this.setData({
          Zhitext: "展开",
          left: 'none',
          lWid: '0vw',
        })
      }
    }
  },

  showShou() {
    let Shoutext = this.data.Shoutext
    if (this.data.Zhitext == "展开") {
      if (Shoutext == "展开") {
        // Shoutext = "收起"
        this.setData({
          Shoutext: "收起",
          right: '',
          rWid: '100vw',
          // lWid: '0vw',
          // left: "none"
        })
      } else {
        // Shoutext = "展开"
        this.setData({
          Shoutext: "展开",
          right: 'none',
          rWid: '0vw',
        })
      }
    } else {
      if (Shoutext == "展开") {
        // Shoutext = "收起"
        this.setData({
          Shoutext: "收起",
          right: '',
          rWid: '50vw',
          lWid: '50vw'
        })
      } else {
        // Shoutext = "展开"
        this.setData({
          Shoutext: "展开",
          right: 'none',
          rWid: '0vw',
        })
      }
    }
  },


/**
 * 解决小bug  若本月查询数据为0  则全部为0
 * 一点击picker就清空钱 变为0
 */
  bindChangeMoneny(){
    this.setData({
      zhengfuResult: 0,
      // 本月支出
      expendResultMonth: 0,
      incomeResultMonth: 0,
      expendMax:0,
      incomeMax:0,
    })
  },

  /**
   * 用户自定义选择时间
   */
  bindDateChange(e) {
    
    var time = e.detail.value
    // console.log(time)
    var year = time.substring(0, 4);
    var selectYM = time.substring(0, 7)
    var month = time.substring(time.length - 2);
    // console.log(month);
    this.setData({
      year,
      month,
      selectYM
    })
    console.log(this.data.selectYM)
    this.onShow();
  },

  /**
   * 本月最高支出详情
   */
  handleExpendMax(){
    if (this.data.expendMaxDetail.length == 0) {
      return;
    }
    console.log(this.data.expendMaxDetail);
    var expendMaxDetail = this.data.expendMaxDetail;
    var time = expendMaxDetail.attributes.booking_time;
    var leixing = expendMaxDetail.attributes.saveMoney_details.expendDetail;
    var beizhu = expendMaxDetail.attributes.saveMoney_details.beizhuinputVal;
    var money = Math.abs(expendMaxDetail.attributes.saveMoney_details.zhichuMoney);


    wx.showModal({
      title: '查看详情',
      content: "时间："+time+"   "+"类型："+leixing+"   "+"支出："+money+"   "+"备注："+beizhu,
      showCancel:false,
      confirmText: '查看完成',
      success(res) {
        if (res.confirm) {
          // console.log('用户点击确定')
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
    
  },
  
  /**
   * 本月最高收入详情
   */
  handleIncomeMax(){
    if (this.data.incomeMaxDetail.length == 0){
      return;
    }
    console.log(this.data.incomeMaxDetail);
    var incomeMaxDetail = this.data.incomeMaxDetail;
    var time = incomeMaxDetail.attributes.booking_time;
    var leixing = incomeMaxDetail.attributes.saveMoney_details.expendDetail;
    var beizhu = incomeMaxDetail.attributes.saveMoney_details.beizhuinputVal;
    var money = incomeMaxDetail.attributes.zhichuMoney;


    wx.showModal({
      title: '查看详情',
      content: "时间：" + time + "   " + "类型：" + leixing + "   " + "支出：" + money + "   " + "备注：" + beizhu,
      showCancel: false,
      confirmText: '查看完成',
      success(res) {
        if (res.confirm) {
          // console.log('用户点击确定')
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 将微信本身自带的时间获取
    //  var timer = util.formatTime(new Data());
    var time = util.formatTime(new Date());
    console.log(time)
    var year = time.substring(0, 4);
    var month = time.substring(5, 7);
    var day = time.substring(8, 10);
    var selectYM = year + "-" + month
    this.setData({
      year,
      month,
      day,
      selectYM
    })
// console.log(selectYM)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        // console.log(res)
        that.setData({
          openid: res.data
        });
        var openID = that.data.openid;
        var newArr = [];
        // 本月最高支出 最高收入
        var expendMax = 0;
        var incomeMax = 0;
        var arrExpend = [];
        var arrIncome = [];
        // 连接数据库 获取数据
        var Booking = Bmob.Object.extend("Design_accMessages");
        var query = new Bmob.Query(Booking);
        query.equalTo("userID", openID);
        query.find({
          success: function (result) {
            console.log("共查询到" + result.length + "条记录")
            console.log(result)
            result.forEach(function (v, i) {
              if (v.attributes.btYearAndMonth == that.data.selectYM) {

                newArr.push(v)
                that.setData({
                  newArr,
                  list: newArr
                })
                var zhengfuResult = 0;
                var expendResult = 0;
                var incomeResult = 0;
                for (var i = 0; i < newArr.length; i++) {
                  if (newArr[i].attributes.zhichuMoney < 0) {
                    expendResult += newArr[i].attributes.zhichuMoney;
                    //math.abs  绝对值  本月支出最大值
                    arrExpend.push(Math.abs(newArr[i].attributes.zhichuMoney));
                    expendMax = Math.max(...arrExpend);     
                  }
                  if (newArr[i].attributes.zhichuMoney > 0) {
                    incomeResult += newArr[i].attributes.zhichuMoney;
                    // 本月收入最大值
                    arrIncome.push(newArr[i].attributes.zhichuMoney);
                    incomeMax = Math.max(...arrIncome);
                  }
                }


                zhengfuResult = expendResult + incomeResult;
                // 因为js浮点计算有Bug  二进制计算   
                // 通过toFixed保留小数后几位
                zhengfuResult = zhengfuResult.toFixed(2);
                // console.log(zhengfuResult)
                

                that.setData({
                  zhengfuResult,
                  expendResultMonth: expendResult,
                  incomeResultMonth: incomeResult,
                  expendMax,
                  incomeMax,
                })

                that.data.newArr.forEach((v,i)=>{
                  if (v.attributes.zhichuMoney == -(that.data.expendMax)){
                    // console.log(v);
                    that.setData({
                      expendMaxDetail: v
                    })
                  }
                })

                that.data.newArr.forEach((v, i) => {
                  if (v.attributes.zhichuMoney == that.data.incomeMax) {
                    // console.log(v);
                    that.setData({
                      incomeMaxDetail: v
                    })
                  }
                })

              }
            })
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})