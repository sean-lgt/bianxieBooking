//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        var user = new Bmob.User();
        //官方文档使用es6语法 promise，拿res.code让bmob后台换取openid
        user.loginWithWeapp(res.code).then(function(user){
          // console.log(user);
          wx.setStorage({
            key: 'openid',
            data: user.attributes.authData.weapp.openid,
          })
          // if(user){
          //   wx.setStorage({
          //     key: 'openid',
          //     data: user.get(openid)
          //   })
          // }
        })
        // console.log(res.code)
        // // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
  },

})
var Bmob = require('/utils/bmob.js');
// Application ID, REST API Key  在Bmob应用密钥里
Bmob.initialize('dff440e81b74e4a5c0328c4a51e6286f', '32a8c4f096a8116ee019af1d1549350b');