// pages/perData/perData.js
var util = require('../../utils/util.js');
// 引进Bmob后端云JS
var Bmob = require('../../utils/bmob.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lookAndmodify:'查看',
    openid:'',
    birthday : "请选择日期",
    // headpic:"",
    selectTime: "",
    name: "",
    picPath: "",
    inputValue1: "",
    inputValue2: "",
    inputValue3: "",
    // inputValue3: "",
    textphnoe: "修改",
    textQM: "修改",
    // 个人资料全部
    personalAll:[]
    // text2:"修改"

  },
  repair1(e) {
    // console.log(e);
    var time = e.detail.value;
    this.setData({
      birthday: time,
    })
  },
  
  /**
   * 出生日期确认提交
   */
  bri_determine(){
    var that = this;
    var brithday = that.data.birthday;
    // console.log(that.data.openid);
    var openid = that.data.openid;
    // console.log(openid);
    // 连接数据库  获取数据
    var Personal = Bmob.Object.extend("Design_personal");
    var query = new Bmob.Query(Personal);
    //条件查询 openid
    query.equalTo("userID",openid)
    query.find({
      success:function(result) {
        // console.log("aaa");
        // console.log("共查询到" + result.length + "条记录");
        console.log(result);
        if(result){
          var id = result[0].id;
          // console.log(id);

          // 修改要找到主键  objectID
          query.get(id, {
            success: function (res) {
              // console.log("lalalala");
              res.set("brithday", brithday);
              res.save();
              wx.showToast({
                title: '确认成功',
                duration: 2000
              })
            }
          })
        }
      //如果查询结果为0  则创建一个新的用户
      if(result.length == 0){
        var newUser = new Personal();
        newUser.set("userID", openid);
        newUser.set("brithday", brithday);
        newUser.save(null, {
          success: function (res) {
            // console.log("提交成功");
            wx.showToast({
              title: '确认成功',
              duration: 2000
            })
          }
        });
      } 
      } 
    });
  },

/**
 * 未来计划部分  内容
 */
  inputValue1(e) {
    // console.log(e.detail.value)
    this.setData({
      inputValue1: e.detail.value
    })

  },

  /**
   * 查看未来计划
   */
  repair2(e) {
    // console.log(123)
    var that = this;
    if(that.data.lookAndmodify=='查看'){
      wx.showModal({
        title: '查看内容',
        content: this.data.inputValue1,
        cancelText: '修改',
        confirmText: '查看完成',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            // console.log('用户点击取消')
            that.setData({
              lookAndmodify: '修改'
            })
          }
        }
      })
    }
   

    if (that.data.lookAndmodify== '修改'){
      var plan = that.data.inputValue1;
      // console.log(that.data.openid);
      var openid = that.data.openid;
      // 连接数据库  获取数据
      var Personal = Bmob.Object.extend("Design_personal");
      var query = new Bmob.Query(Personal);
      //条件查询 openid
      query.equalTo("userID", openid)
      query.find({
        success: function (result) {
          // console.log("共查询到" + result.length + "条记录");
          // console.log(result);
        if(result.length == 1){
          var id = result[0].id;
          // console.log(id);

          // 修改要找到主键  objectID
          query.get(id, {
            success: function (res) {
              // console.log("lalalala");
              res.set("plan", plan);
              res.save();
              wx.showToast({
                title: '修改成功',
                duration: 2000
              })
              that.setData({
                lookAndmodify: '查看'
              })

              that.onShow();
            }
          })
        }
          //如果查询结果为0  则创建一个新的用户
          if (result.length == 0) {
            var newUser = new Personal();
            newUser.set("userID", openid);
            newUser.set("plan", plan);
            newUser.save(null, {
              success: function (res) {
                // console.log("提交成功");
                wx.showToast({
                  title: '修改成功',
                  duration: 2000
                })
                that.setData({
                  lookAndmodify: '查看'
                })

                that.onShow();
              }
            });
          }
        }
      });
    }
   

  },




  //电话具体值
  inputValue2(e) {
    this.setData({
      inputValue2: e.detail.value
    })
  },


  /**
   * 电话操作函数
   */
  repair3(e) {
    var that= this;
    if(that.data.textphnoe == '修改'){
      that.setData({
        textphnoe: "完成"
      })
      return;
    }


     if(that.data.textphnoe == "完成"){
       

       var phone = Number(that.data.inputValue2) ;
       //运用正则表达式判断手机号码格式是否正确
       if (!(/^((13[0-9])|(14[0-9])|(15[0-9])|(17[0-9])|(18[0-9]))\d{8}$/.test(phone))) {
         wx.showToast({
           title: '手机号码有误',
           duration: 2000,
           icon: 'none'
         });
         return;
       }
       // console.log(that.data.openid);
       var openid = that.data.openid;
       // 连接数据库  获取数据
       var Personal = Bmob.Object.extend("Design_personal");
       var query = new Bmob.Query(Personal);
       //条件查询 openid
       query.equalTo("userID", openid)
       query.find({
         success: function (result) {
           // console.log("共查询到" + result.length + "条记录");
           // console.log(result);
           if (result.length == 1){
            var id = result[0].id;
            // console.log(id);

            // 修改要找到主键  objectID
            query.get(id, {
              success: function (res) {
                // console.log("lalalala");
                res.set("phone", phone);
                res.save();
                wx.showToast({
                  title: '修改成功',
                  duration: 2000
                })
                that.setData({
                  textphnoe: '修改'
                })
                that.onShow();
              }
            })
          }
           //如果查询结果为0  则创建一个新的用户
           if (result.length == 0) {
             var newUser = new Personal();
             newUser.set("userID", openid);
             newUser.set("phone", phone);
             newUser.save(null, {
               success: function (res) {
                 // console.log("提交成功");
                 wx.showToast({
                   title: '修改成功',
                   duration: 2000
                 })
                 that.setData({
                   textphnoe: '修改'
                 })
                 that.onShow();
               }
             });
           }
         }
       });
     }



 
  },


//个性签名具体值
  inputValue3(e){
    this.setData({
      inputValue3: e.detail.value
    })
  },

  /**
   * 个性签名修改操作
   */
  repair4(){
    var that = this;
    if (that.data.textQM == '修改') {
      that.setData({
        textQM: "完成"
      })
      return;
    }


    if (that.data.textQM == "完成") {
      var personalQM = that.data.inputValue3;
      // console.log(that.data.openid);
      var openid = that.data.openid;
      // 连接数据库  获取数据
      var Personal = Bmob.Object.extend("Design_personal");
      var query = new Bmob.Query(Personal);
      //条件查询 openid
      query.equalTo("userID", openid)
      query.find({
        success: function (result) {
          // console.log("共查询到" + result.length + "条记录");
          // console.log(result);
          if (result.length == 1){
            var id = result[0].id;
            // console.log(id);

            // 修改要找到主键  objectID
            query.get(id, {
              success: function (res) {
                // console.log("lalalala");
                res.set("personalQM", personalQM);
                res.save();
                wx.showToast({
                  title: '修改成功',
                  duration: 2000
                })
                that.setData({
                  textphnoe: '修改'
                })
                that.onShow();
              }
            })
          }
          //如果查询结果为0  则创建一个新的用户
          if (result.length == 0) {
            var newUser = new Personal();
            newUser.set("userID", openid);
            newUser.set("personalQM", personalQM);
            newUser.save(null, {
              success: function (res) {
                // console.log("提交成功");
                wx.showToast({
                  title: '修改成功',
                  duration: 2000
                })
                that.setData({
                  textphnoe: '修改'
                })
                that.onShow();
              }
            });
          }
        }
      });
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(options)
    var that = this;
    that.setData({
      name: options.name,
      picPath: options.picPath
    })
    wx.getStorage({
      key: 'openid',
      success: function(res) {
        // console.log(res);
        that.setData({
          openid:res.data
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    // var openID = "";
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        console.log(res)
        that.setData({
          openid: res.data
        });
        // console.log(that.data.openid);
        var openID = that.data.openid;
        // console.log(openID)
        // 获取数据库的数据
        // 连接数据库创建类
        var Personal = Bmob.Object.extend("Design_personal");
        var query = new Bmob.Query(Personal);
        // 条件查询 条件为用户名等于当前用户名
        query.equalTo("userID", openID)
        query.find({
          success: function (result) {
            console.log(result)
            if (result.length == 1){
              that.setData({
                birthday: result[0].attributes.brithday,
                inputValue1: result[0].attributes.plan,
                inputValue2: result[0].attributes.phone,
                inputValue3: result[0].attributes.personalQM
              })
            }
            
            
          },
          error: function (error, result) {
            console.log("查询不到")
          }
        })

      },
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