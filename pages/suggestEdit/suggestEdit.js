// pages/suggestEdit/suggestEdit.js
var util = require('../../utils/util.js');
// 引进Bmob后端云JS
var Bmob = require('../../utils/bmob.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    txtarea:'',
    username:'',
    openid:''
  },

/**
 * 文本框的值
 */
  txtarea(e){
    var txtarea = e.detail.value;
    this.setData({
      txtarea
    })
  },

/**
 * 提交按钮
 */
  submit(){
    var that = this;
    var suggestContent = that.data.txtarea;
    var openid = that.data.openid;
    var username= that.data.username;
    if(suggestContent == ""){
      wx.showToast({
        title: '请编辑意见',
        icon:'none',
        duration:2000
      })
      
    } else if (username.length == 0 || username == "undefined"){
      wx.showToast({
        title: '请重新登录',
        icon: 'none',
        duration: 2000
      })
    }else{
      var Suggest = Bmob.Object.extend("Design_persuggest");
      var suggest = new Suggest();
      suggest.set("userID",openid);
      suggest.set("suggestContent",suggestContent);
      suggest.set("biaoshi",true);
      suggest.set("username",username);
      suggest.save(null,{
        success:function(result){
          wx.showToast({
            title: '提交成功',
            duration:2000
          })
          // 用setTimeout定时跳转到意见反馈页面
          setTimeout(function () {
            wx.navigateTo({
              url: '/pages/suggest/suggest',
            })
          }, 2000)
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options);
    var that = this;
    wx.getStorage({
      key: 'username',
      success: function(res) {
        that.setData({
          username :res.data
        })
      },
    })
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        // console.log(res);
        that.setData({
          openid: res.data
        })
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