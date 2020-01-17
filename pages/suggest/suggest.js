// pages/suggest/suggest.js
var util = require('../../utils/util.js');
// 引进Bmob后端云JS
var Bmob = require('../../utils/bmob.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username:"",
    list: []
  },

  /**
   * 点击编辑意见
   */
  handleEdit(){
    // console.log("aaa");
    var username = this.data.username;
    wx.navigateTo({
      url: '/pages/suggestEdit/suggestEdit?name='+username,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      // console.log(options);
      var username = options.name;
      this.setData({
        username
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
    var that = this;
    var Suggest = Bmob.Object.extend("Design_persuggest");
    var query = new Bmob.Query(Suggest);
    // 条件查询 条件为标识为ture
    query.equalTo("biaoshi", true)
    query.find({
      success: function (result) {
        // console.log(result)
        console.log("共查询到" + result.length + "条记录");
        // 反转数组 让最后加入的显示在最前面
        result.reverse();
        // 把获得的数据添加到data里面
        that.setData({
          list: result
        })
        console.log(that.data.list)
      },
      error: function (error, result) {
        console.log("查询不到")
      }
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