/*
 * @Author: your name
 * @Date: 2019-10-30 13:05:53
 * @LastEditTime: 2019-10-30 14:43:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \Convenient Bookkeeping\pages\Booking\Booking.js
 */
// pages/Booking/Booking.js

// 引进日期js
var util = require('../../utils/util.js');
// 引进Bmob后端云JS
var Bmob = require('../../utils/bmob.js')

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    colorid: "-1",
    colorid2: "-1",
    openid:"",
    // 顶部左右支出和收入的切换
    currentTab: 0,
    // 获取支出金额input输入的值
    zhichuinputValue:'',
    shouruinputValue:'',
    // 获取选择时间的值
    selectTime:"请选择时间",
    // 支出备注内容
    expendDetail:"类别",
    // 收入备注内容
    incomeDetail:"类别",
    // 支出分类 用数组对象存着
    expendClassify: [{
        id: 1,
        img: '../../icons/eat.png',
        text: '餐饮'
      },
      {
        id: 2,
        img: '../../icons/shopping.png',
        text: '购物'
      },
      {
        id: 3,
        img: '../../icons/commodity.png',
        text: '日用'
      },
      {
        id: 4,
        img: '../../icons/traffic.png',
        text: '交通'
      },
      {
        id: 5,
        img: '../../icons/vegetables.png',
        text: '买菜'
      },
      {
        id: 6,
        img: '../../icons/fruits.png',
        text: '水果'
      },
      {
        id: 7,
        img: '../../icons/snacks.png',
        text: '零食'
      },
      {
        id: 8,
        img: '../../icons/sport.png',
        text: '运动'
      },
      {
        id: 9,
        img: '../../icons/play.png',
        text: '娱乐'
      },
      {
        id: 10,
        img: '../../icons/call.png',
        text: '通讯'
      },
      {
        id: 11,
        img: '../../icons/costume.png',
        text: '服饰',
      },
      {
        id: 12,
        img: '../../icons/house.png',
        text: '住房'
      },
      {
        id: 13,
        img: '../../icons/medical.png',
        text: '医疗'
      },
      {
        id: 14,
        img: '../../icons/child.png',
        text: '孩子'
      },
      {
        id: 15,
        img: '../../icons/friend.png',
        text: '社交'
      },
      {
        id: 16,
        img: '../../icons/travel.png',
        text: '旅行'
      },
      {
        id: 17,
        img: '../../icons/study.png',
        text: '学习'
      },
      {
        id: 18,
        img: '../../icons/elders.png',
        text: '长辈'
      },
      {
        id: 19,
        img: '../../icons/digital.png',
        text: '数码'
      },
      {
        id: 20,
        img: '../../icons/beauty.png',
        text: '美容'
      },
    ],
    // 收入分类，用数组对象存在
    incomeClassify: [{
        id: 1,
        img: '../../icons/wage.png',
        text: '工资'
      },
      {
        id: 2,
        img: '../../icons/partTime.png',
        text: '兼职'
      },
      {
        id: 3,
        img: '../../icons/financial.png',
        text: '理财'
      },
      {
        id: 4,
        img: '../../icons/amounts.png',
        text: '礼金'
      },
      {
        id: 5,
        img: '../../icons/other.png',
        text: '其他'
      },
    ],
    // 选择日期
    time:'',
    // 支出备注文本框
    zhichubeizhuInputVall:'',
    // zhichubeizhuInputVal:'',
    shourubeizhuInputVal:''
  },

  /**
   * 点击支出保存OK
   */
  zhichuSave(e){
    // console.log(this.data.zhichubeizhuInputVal)
    if(this.data.zhichuinputValue==''){
      wx.showToast({
        title: '请输入金额',
        icon:'none',
        duration:1000
      })
    } else if (this.data.selectTime == "请选择时间"){
      wx.showToast({
        title: '请选择时间',
        icon: 'none',
        duration: 1000
      })
    } else if (this.data.expendDetail == '类别'){
      wx.showToast({
        title: '请选择下面支出类别',
        icon: 'none',
        duration: 1000
      })
    } else if (this.data.openid==''){
      wx.showToast({
        title: '您还没有登陆呢，请点击我的',
        icon: 'none',
        duration: 3000
      })
    }
    else{
      // 运行到这儿  说明所有条件已经符合提交了
      // 引入Bmob
      // 创建类
      var that = this;
      var userID = that.data.openid;
      var accountClass = that.data.currentTab;
      var expendDetail = that.data.expendDetail;
      var bookingTime = that.data.selectTime;
      var beizhuinputVal = that.data.zhichubeizhuInputVall;
      var zhichuinputVal = Number(-(that.data.zhichuinputValue))
      // var userName = that.data.userName;
      var selectTimeJiequ = that.data.selectTime.substring(0,7);
      // console.log(accountClass)
      // console.log(expendDetail)
      // console.log(bookingTime)
      // console.log(beizhuinputVal)
      // console.log(inputVal)
      var saveMoneyDetail = {
        zhichuMoney: zhichuinputVal,
        accountClass: accountClass,
        expendDetail: expendDetail,
        bookingTime: bookingTime,
        beizhuinputVal: beizhuinputVal
      }
      // // console.log(saveMoneyDetail)
     var Booking = Bmob.Object.extend("Design_accMessages");
     var booking = new Booking();
     booking.set("userID",userID)
     booking.set("booking_time", bookingTime)
      booking.set("account_class", accountClass)
      booking.set("saveMoney_details", saveMoneyDetail)
      booking.set("zhichuMoney", zhichuinputVal)
      // booking.set("usersNames", userName)
      booking.set("btYearAndMonth",selectTimeJiequ)
     booking.save(null,{
       success:function(result){
         console.log("提交成功")
         wx.showToast({
            title: '提交成功',
            duration: 2000
          })
          // 用setTimeout定时跳转到明细页面
         // 跳转回备忘录页面   用定时器 提交成功显示后2秒  因为是tabBar navto不能跳到
         setTimeout(function () {
           wx.switchTab({
             url: '../../pages/Detailed/Detailed',
           })
         }, 2000)
         that.setData({
           // 获取input输入的值
           zhichuinputValue: '',
           // 获取选择时间的值
           selectTime: "请选择时间",
           // 支出备注内容
           expendDetail: "类别",
           // 收入备注内容
           incomeDetail: "类别",
           zhichubeizhuInputVall:'',
          //  shourubeizhuInputVal:'',
           colorid: "-1",
           colorid2: "-1"
         })
       },
       error:function(error){
         console.log("提交失败")
         wx.showToast({
           title: '提交失败',
           icon:'none',
           duration: 2000
         })
       }
     })

    }
  },

  /**
   * 点击收入保存OK
   */
  shouruSave(e){
    // console.log(this.data.inputValue)
    if (this.data.shouruinputValue == '') {
      wx.showToast({
        title: '请输入金额',
        icon: 'none',
        duration: 1000
      })
    } else if (this.data.selectTime == "请选择时间") {
      wx.showToast({
        title: '请选择时间',
        icon: 'none',
        duration: 1000
      })
    } else if (this.data.incomeDetail == '类别') {
      wx.showToast({
        title: '请选择下面收入类别',
        icon: 'none',
        duration: 1000
      })
    } else if (this.data.openid == '') {
      wx.showToast({
        title: '您还没有登陆呢，请点击我的',
        icon: 'none',
        duration: 3000
      })
    }
    else {
      // 运行到这儿  说明所有条件已经符合提交了
      // 引入Bmob
      // 创建类
      // console.log("hah");
      var that = this;
      var userID = that.data.openid;
      var accountClass = that.data.currentTab;
      var expendDetail = that.data.incomeDetail;
      var bookingTime = that.data.selectTime;
      var beizhuinputVal = that.data.shourubeizhuInputVall;
      var shouruinputVal = Number(that.data.shouruinputValue);
      var userName = that.data.userName;
      var selectTimeJiequ = that.data.selectTime.substring(0, 7);
      var saveMoneyDetail = {
        shouruinputVal: shouruinputVal,
        accountClass: accountClass,
        expendDetail: expendDetail,
        bookingTime: bookingTime,
        beizhuinputVal: beizhuinputVal
      }

      var Booking = Bmob.Object.extend("Design_accMessages");
      var booking = new Booking();
      booking.set("userID",userID)
      booking.set("booking_time", bookingTime)
      booking.set("account_class", accountClass)
      booking.set("saveMoney_details", saveMoneyDetail)
      // booking.set("usersNames", userName)
      booking.set("zhichuMoney", shouruinputVal)
      booking.set("btYearAndMonth", selectTimeJiequ)
      booking.save(null, {
        success: function (result) {
          console.log("提交成功")
          wx.showToast({
            title: '提交成功',
            duration: 2000
          })
          // 用setTimeout定时跳转到明细页面
          // 跳转回备忘录页面   用定时器 提交成功显示后2秒  因为是tabBar navto不能跳到
          setTimeout(function () {
            wx.switchTab({
              url: '../../pages/Detailed/Detailed',
            })
          }, 2000)
          that.setData({
            // 获取input输入的值
            inputValue: null,
            // 获取选择时间的值
            selectTime: "请选择时间",
            // 支出备注内容
            expendDetail: "类别",
            // 收入备注内容
            incomeDetail: "类别",
            shouruinputValue:'',
            beizhuInputVal: '',
            shourubeizhuInputVall:'',
            colorid: "-1",
            colorid2: "-1"
          })
        },
        error: function (error) {
          console.log("提交失败")
          wx.showToast({
            title: '提交失败',
            icon: 'none',
            duration: 2000
          })
        }
      })
    }
  },

  /**
   * 获取支出和收入备注文本框的内容
   */
  zhichubeizhuInputVal(e){
    console.log(e);
    this.setData({
      zhichubeizhuInputVall: e.detail.value
    })
  },
  shourubeizhuInputVal(e){
    this.setData({
      shourubeizhuInputVall:e.detail.value
    })
  },

  /**
   * 选择记账时间
   */
  bindDateChange(e){
    console.log(e);
    var time = e.detail.value;
    this.setData({
      selectTime:time,
    })
    // var selectTimeJiequ = this.data.selectTime.substring(0,7);
    // console.log(selectTimeJiequ)
  },

  /**
   * 获取点前点击支出项目里面的分类
   */
  expensesClick(e){
    // console.log(e)
    var id = e.currentTarget.dataset.id;

    var colorid = id-1;
    // console.log(id)
    var sort = ''
    switch (id) {
      case 1:
        sort = '餐饮'
        break;
      case 2:
        sort = '购物'
        break;
      case 3:
        sort = '日用'
        break;
      case 4:
        sort = '交通'
        break;
      case 5:
        sort = '买菜'
        break;
      case 6:
        sort = '水果'
        break;
      case 7:
        sort = '零食'
        break;
      case 8:
        sort = '运动'
        break;
      case 9:
        sort = '娱乐'
        break;
      case 10:
        sort = '通讯'
        break;
      case 11:
        sort = '服饰'
        break;
      case 12:
        sort = '住房'
        break;
      case 13:
        sort = '医疗'
        break;
      case 14:
        sort = '孩子'
        break;
      case 15:
        sort = '社交'
        break;
      case 16:
        sort = '旅行'
        break;
      case 17:
        sort = '学习'
        break;
      case 18:
        sort = '长辈'
        break;
      case 19:
        sort = '数码'
        break;
      case 20:
        sort = '美容'
        break;
    }
    // console.log(sort)

    this.setData({
      expendDetail: sort,
      colorid: colorid
    })
  },

  /**
   * 获取当前点击收入项目里面的分类
   */
  incomeClick(e){
    var id = e.currentTarget.dataset.id

    var colorid2 = id - 1;
    // console.log(id)
    var sort = ''
    switch (id) {
      case 1:
        sort = '工资'
        break;
      case 2:
        sort = '兼职'
        break;
      case 3:
        sort = '理财'
        break;
      case 4:
        sort = '礼金'
        break;
      case 5:
        sort = '其他'
        break;
    }
    this.setData({
      incomeDetail:sort,
      colorid2
    })
  },

  /**
   * 获取inputvalue输入的值 金额
   */
  zhichuinputValue(e){
    // console.log(e);
    this.setData({
      zhichuinputValue:e.detail.value
    })
  },
  // 收入金额
  shouruinputValue(e){
    this.setData({
      shouruinputValue: e.detail.value
    })
  },

  /**
   * 切换顶部 支出与收入模块方法
   */
  headerNav(e){
    // console.log(e)
    this.setData({
      currentTab: e.currentTarget.dataset.current
    })
  },
  /**
   * 解决在swiper滑动 收入与支出没有跟着改变的Bug
   */
  bindchangeSwiper(e){
    this.setData({
      currentTab: e.detail.current
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'openid',
      success: function(res) {
        // console.log(res)
        that.setData({
          openid: res.data
        })
        console.log(that.data.openid)
      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // console.log(this.data.zhichubeizhuInputVal);
    var that = this;
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        // console.log(res)
        that.setData({
          openid: res.data
        })
        console.log(that.data.openid)
      },
    })
    that.setData({
      colorid: "-1",
      colorid2: "-1",
      // 顶部左右支出和收入的切换
      currentTab: 0,
      // 获取支出金额input输入的值
      zhichuinputValue: '',
      // 获取选择时间的值
      selectTime: "请选择时间",
      // 支出备注内容
      expendDetail: "类别",
      // 收入备注内容
      incomeDetail: "类别",
      // 选择日期
      time: '',
      // 支出备注文本框
      zhichubeizhuInputVall:'',
      shourubeizhuInputVall: ''
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})