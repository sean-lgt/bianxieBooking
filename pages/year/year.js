// page/index/index.js
// 引进日期js
var util = require('../../utils/util.js');
// 引进Bmob后端云JS
var Bmob = require('../../utils/bmob.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {

    year:"1970",
    month:"01",
    dayStyle: [
      { month: 'current', day: new Date().getDate(), color: 'white', background: '#AAD4F5' },
      { month: 'current', day: new Date().getDate(), color: 'white', background: '#AAD4F5' }
    ],
    // 用户唯一标识
    openid: '',
    // 打卡的年月
    dakaYM: '',
    // 当前时间
    curday: '',

    //打卡积分
    int: 0,
    // 打卡天数
    signday: 0,
    //转换月份禁止打卡
    flag: "dayClick",
    //已经打卡的具体日期
    dakaed:[]
  },

  //todo 方法 给点击的日期设置一个背景颜色
  dayClick: function (event) {
    // if (event.detail.day)
    // let changeDay = `dayStyle[1].day`;
    // let changeBg = `dayStyle[1].background`;
    // that.setData({
    //   [changeDay]: clickDay,
    //   [changeBg]: "#ffd700"
    // });
    var that = this;
    console.log(event);
    // 当前点击时间
    var clickDay = event.detail.day;
    // 把获取到的时间  内容  结合openid 存到数据库  
    var dakaYM = that.data.dakaYM;
    var openid = that.data.openid;
    var curday = that.data.curday;
    var dakaed = that.data.dakaed;
    if (event.detail.background == "green!important"){
      wx.showToast({
        title: '你已经打卡过了！',
        icon: 'none',
        duration: 2000
      })
    }
    else if(clickDay > curday) {
      wx.showToast({
        title: '时间未到，不能打卡',
        icon: 'none',
        duration: 2000
      })
    } else if (openid.length == 0){
      wx.showToast({
        title: '你还没有登录呢',
        icon: 'none',
        duration: 2000
      })
    } else if (clickDay < curday) {    //补签
        //当前点击的具体日期
        wx.showModal({
          title: '打卡提示',
          content: '你确认补签打卡吗',
          success: function (res) {
            if (that.data.int < 4) {
              wx.showToast({
                title: '补签失败，积分不足',
                icon: 'none',
                duration: 2000
              })
              return;
            }
            // 点击确定
            if (res.confirm) {
              // 连接数据库  添加数据
              var Daka = Bmob.Object.extend("Design_personalTodo");
              // 创建实例对象
              var daka = new Daka();
              daka.set("dakaYM", String(dakaYM));
              daka.set("dakaDay", String(clickDay));
              daka.set("userID", openid);
              daka.set("score", -3);
              daka.save(null, {
                success: function (result) {
                  wx.showToast({
                    title: '打卡成功',
                    duration: 2000
                  });
                  that.onShow();
                },
                error: function (error) {
                  wx.showToast({
                    title: '打卡失败，请重新打卡',
                    icon: 'none',
                    duration: 2000
                  })
                  that.onShow();
                }
              });
            }
            // 点击取消

          }
        })
    } else {
      //当前点击的具体日期
      wx.showModal({
        title: '打卡提示',
        content: '你确认今日打卡了吗',
        success: function (res) {
          // 点击确定
          if (res.confirm) {
            // 连接数据库  添加数据
            var Daka = Bmob.Object.extend("Design_personalTodo");
            // 创建实例对象
            var daka = new Daka();
            daka.set("dakaYM", String(dakaYM));
            daka.set("dakaDay", String(clickDay));
            daka.set("userID", openid);
            daka.set("score", 5);
            daka.save(null, {
              success: function (result) {
                wx.showToast({
                  title: '打卡成功',
                  duration: 2000
                });
                that.onShow();
              },
              error: function (error) {
                wx.showToast({
                  title: '打卡失败，请重新打卡',
                  icon: 'none',
                  duration: 2000
                })
                that.onShow();
              }
            });
          }
          // 点击取消

        }
      })
    }


  },


  /**
   * 下一个月的按钮
   */
  next: function (event) {
    // console.log(event);
    var that = this;
    var year = event.detail.currentYear;
    var month = event.detail.currentMonth;
    if(month<10){
      month = "0" + month;
    }
    that.setData({
      dayStyle: [
        
      ],

      int: 0,
      signday: 0
    });

    
    var nextYM = year + "-" + month;
    console.log(nextYM);
    var openid = that.data.openid;
    // console.log(openid);
    var daysyle = that.data.dayStyle;  //拿到插件天数样式数组对象
    //打卡积分
    var int = that.data.int;
    // 打卡天数
    var signday = that.data.signday;
    //定义一个空数组  存放已经打卡的天数
    var newdaka = [];
    //连接数据库
    var Daka = Bmob.Object.extend("Design_personalTodo");
    var query = new Bmob.Query(Daka);
    query.equalTo("userID", openid);
    query.find({
      success: function (result) {
        result.forEach(function (v, i) {
          if (v.attributes.dakaYM == nextYM) {
            newdaka.push(v);
          }
        });

        that.setData({
          signday: newdaka.length
        });
        console.log(newdaka);

        newdaka.forEach(function (j, k) {
          daysyle.push({ month: 'current', day: j.attributes.dakaDay, color: 'white', background: 'green' });
          // 计算总积分
          int += j.attributes.score;
        });
        that.setData({
          dayStyle: daysyle,
          int
        })
      }

    });


    // console.log(nextYM);
    if (nextYM == String(that.data.dakaYM)) {
      that.onShow();
      that.setData({
        flag: "dayClick"
      })
      that.onShow();
    } else {
      that.setData({
        flag: "notallowDaka"
      })
    }

  },


  /**
   * 上一个月的按钮
   */
  prev: function (event) {
    console.log(event);
    var that = this;
    var year = event.detail.currentYear;
    var month = event.detail.currentMonth;
    if (month < 10) {
      month = "0" + month;
    }
    that.setData({
      dayStyle: [
        
      ],
      int: 0,
      signday: 0
    });

    var prevYM = year + "-" + month;
    console.log(prevYM);
    var openid = that.data.openid;
    // console.log(openid);

    var daysyle = that.data.dayStyle;  //拿到插件天数样式数组对象
    //打卡积分
    var int = that.data.int;
    // 打卡天数
    var signday = that.data.signday;
    //定义一个空数组  存放已经打卡的天数
    var newdaka = [];
    //连接数据库
    var Daka = Bmob.Object.extend("Design_personalTodo");
    var query = new Bmob.Query(Daka);
    query.equalTo("userID", openid);
    query.find({
      success: function (result) {
        result.forEach(function (v, i) {
          if (v.attributes.dakaYM == prevYM) {
            newdaka.push(v);
          }
        });

        that.setData({
          signday: newdaka.length
        });
        console.log(newdaka);

        newdaka.forEach(function (j, k) {
          daysyle.push({ month: 'current', day: j.attributes.dakaDay, color: 'white', background: 'green' });
          // 计算总积分
          int += j.attributes.score;
        });
        that.setData({
          dayStyle: daysyle,
          int
        })
      }

    });


    // console.log(prevYM);
    if (prevYM == String(that.data.dakaYM)) {
      that.setData({
        flag: "dayClick"
      })
      that.onShow();
    } else {
      that.setData({
        flag: "notallowDaka"
      })
    }
  },

  /**
   * 已经不是本月 不能打卡
   */
  notallowDaka() {
    wx.showToast({
      title: '不是本月，不能打卡',
      icon: 'none',
      duration: 2000
    })
  },
  /**
   * onshow  方法
   */
  onShow: function () {
    var that = this;
    // 将微信本身自带的时间获取
    //  var timer = util.formatTime(new Data());
    var time = util.formatTime(new Date());
    console.log(time)
    var year = time.substring(0, 4);
    var month = time.substring(5, 7);
    var curday = time.substring(8, 10);
    var dakaYM = year + "-" + month;
    that.setData({
      year:year,
      month:month,
      dakaYM: dakaYM,
      curday: curday,
      dayStyle: [
        { month: 'current', day: new Date().getDate(), color: 'white', background: '#AAD4F5' },
        { month: 'current', day: new Date().getDate(), color: 'white', background: '#AAD4F5' }
      ]
    });


    that.setData({
      int:0,
      signday:0
    })
    wx.getStorage({
      key: 'openid',
      success: function (res) {   //成功获取到openid

        var openid = res.data
        // 把获取到的时间  内容  结合openid 存到数据库  
        var dakaYM = that.data.dakaYM;
        // console.log(dakaYM);
        var daysyle = that.data.dayStyle;  //拿到插件天数样式数组对象
        //打卡积分
        var int = that.data.int;
        // 打卡天数
        var signday = that.data.signday;
        //定义一个空数组  存放已经打卡的天数
        var newdaka = [];
        //已经打卡的具体日期
        var dakaed = that.data.dakaed;
        //连接数据库
        var Daka = Bmob.Object.extend("Design_personalTodo");
        var query = new Bmob.Query(Daka);
        query.equalTo("userID", openid);
        query.find({
          success: function (result) {
            result.forEach(function (v, i) {
              if (v.attributes.dakaYM == that.data.dakaYM) {
                newdaka.push(v);
              }
            });

            that.setData({
              signday: newdaka.length
            });
            console.log(newdaka);

            newdaka.forEach(function (j, k) {
              daysyle.push({ month: 'current', day: j.attributes.dakaDay, color: 'white', background: 'green' });
              // 计算总积分
              int += j.attributes.score;
              dakaed.push(j.attributes.dakaDay);
            });
            that.setData({
              dayStyle: daysyle,
              dakaed:dakaed,
              int
            })
          }

        });
      },
    });


  },

  /**
   * onload
   */
  onLoad: function (options) {
    var that = this;

    // console.log(that.data.dayStyle);
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        console.log(res);
        that.setData({
          openid: res.data
        })
      },
    });
    // 将微信本身自带的时间获取
    //  var timer = util.formatTime(new Data());
    var time = util.formatTime(new Date());
    console.log(time)
    var year = time.substring(0, 4);
    var month = time.substring(5, 7);
    var curday = time.substring(8, 10);
    var dakaYM = year + "-" + month;
    that.setData({
      dakaYM: dakaYM,
      curday: curday
    });
  },

})