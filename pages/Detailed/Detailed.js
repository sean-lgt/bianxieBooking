/*
 * @Author: your name
 * @Date: 2019-10-30 13:05:53
 * @LastEditTime: 2019-10-31 17:20:52
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \Convenient Bookkeeping\pages\Detailed\Detailed.js
 */
// pages/Detailed/Detailed.js
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
    // 获取用户唯一表示openid
    openid:"",
    // 获取全局app里的用户名
    // userName: 'Sean涛',
    // 获得数据库传过来的记账数据
    bookingDetailsList: [],
    // 顶部编辑与删除的切换
    editText: "编辑",
    // radioCheck: false
    // 全选按钮
    allChecked:false,

    //顶部类型选择部分
    select: '全部',
    array: ['全部', '餐饮', '购物', '日用', '交通', '买菜', '水果', '零食', '运动', '娱乐', '通讯', '服饰', '住房', '医疗', '孩子', '社交', '旅行', '学习', '长辈', '数码', '美容', '工资', '兼职', '理财', '礼金', '其他'],
    index: 0
  },


  /**
   * 顶部选择部分
   */
  bindPickerChange(e){
    var that = this;
    console.log(e)
    var arrayName = this.data.array[e.detail.value]
    // console.log(this.data.array[e.detail.value])
    that.setData({
      index: e.detail.value
    })
    // console.log(arrayName)
    // console.log(this.data.openid)
    var openID = that.data.openid;
    
    //连接数据库创建实例
    var Booking = Bmob.Object.extend("Design_accMessages");
    var query = new Bmob.Query(Booking);
    // 多条件查询
    query.equalTo("userID",openID);
    query.find({
      success: function (result) {
        var newResult = [];
        var result = result;
        result.forEach((v,i)=>{
          if (v.attributes.saveMoney_details.expendDetail == arrayName){
            newResult.push(v);   
          }     
        })
        // console.log(newResult)
        that.setData({
          bookingDetailsList: newResult
        })
        wx.showToast({
          title: '筛选成功',
          icon: 'none',
          duration:1000
        })
        if (arrayName == '全部') {
          that.onShow();
          wx.showToast({
            title: '筛选成功',
            icon: 'none',
            duration: 1000
          })
        }
      },
      error: function (error, result) {
        console.log("查询不到")
      }
    })





    //版本1   有BUG  //
    // // this.onShow();
    // wx.showToast({
    //   title: '晒选成功，要再次筛选则需要先选择全部',
    //   icon:'none'
    // })
    // console.log(e)
    // var arrayName = this.data.array[e.detail.value]
    // // console.log(this.data.array[e.detail.value])
    // this.setData({
    //   index: e.detail.value
    // })
    // // console.log(arrayName)
    // // 从获取到的bookingDetailsList中筛选出用户所选择的类型
    // var bdList = this.data.bookingDetailsList;
    // var newBookingDetailList = []
    // bdList.forEach((v,i)=>{
    //   if (v.attributes.saveMoney_details.expendDetail == arrayName){
    //     // console.log(v)
    //     newBookingDetailList.push(v)
    //   }
    // })
    // console.log(newBookingDetailList)
    // this.setData({
    //   bookingDetailsList:newBookingDetailList
    // })
    // wx.showToast({
    //   title: '晒选成功，要再次筛选则需要先选择全部',
    //   icon: 'none'
    // })
    // if (arrayName == '全部'){
    //   this.onShow();
    //   wx.showToast({
    //     title: '晒选成功',
    //     icon: 'none'
    //   })
    // }
    // // this.onShow();


  },


  // change(e){
  //   console.log(123)
  //   wx.showActionSheet({
  //     itemList: this.data.arr,
  //     success: (res)=>{
  //       // console.log(this.data.arr[0])
  //       this.setData({
  //         select: this.data.arr[res.tapIndex]
  //       })
  //     },
  //     fail: function (res) {
  //       console.log(res.errMsg)
  //     }
  //   })  

  // },

  
  /**
   * 单选按钮
   */
  delDetail(e) {
    console.log(e)
    var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id
    var arr = this.data.bookingDetailsList;
    // console.log(arr)
    arr[index].radio = !arr[index].radio
    this.setData({
      bookingDetailsList: arr
    })
    console.log(arr);

    // 反正法  判断全选 
    // 假设所有单选按钮都选中了
    var flag =true;
    // // 验证假设 判断数组
    arr.forEach((v,i)=>{
      if(v.radio != true){
        flag = false;
        return
      }
    })
    this.setData({
      allChecked: flag
    })

  },

  /**
   * 删除按钮
   */
  btnDelete(e) {
    // 遍历数组中的内容 如果有被选中的就存到新的数组 如果没有则弹框显示还没选择要删除的内容
    var arr = this.data.bookingDetailsList;
    var that = this;
    // var newArr = []
    wx.showModal({
      title: '删除提示',
      content: '你确认删除所选内容吗',
      success: function(res) {
        if (res.confirm) {
          arr.forEach((v, i) => {
            if (v.radio == true) {
              
              var Booking = Bmob.Object.extend("Design_accMessages");
              var query = new Bmob.Query(Booking);
              query.get(v.id, {
                success: function(obj) {
                  obj.destroy({
                    success: function(del) {
                      console.log("删除成功");
                      that.onShow();
                      that.setData({
                        editText:"编辑"
                      })
                    },
                    error: function(obj, error) {
                      console.log("删除失败");
                    }
                  });
                },
                error: function(obj, error) {
                  console.log("查询不到")
                }
              })
            }
          })
        }
      }
    })



    // 版本1
    // if (v.radio == true) {
    //   if (newArr.length > 0) {
    //     var that = this;
    //     var Booking = Bmob.Object.extend("Design_accMessages");
    //     var query = new Bmob.Query(Booking);
    //     wx.showModal({
    //       title: '删除提示',
    //       content: '确定要删除选中的吗',
    //       success: function (res) {
    //         if (res.confirm) {
    //           newArr.forEach((v, i) => {
    //             console.log(v.id)
    //             query.get(v.id, {
    //               success: function (obj) {
    //                 obj.destroy({
    //                   success: function (del) {
    //                     console.log("删除成功");
    //                   },
    //                   error: function (obj, error) {
    //                     console.log("删除失败");
    //                   }
    //                 });
    //               },
    //               error: function (obj, error) {
    //                 console.log("查询不到")
    //               }
    //             })
    //           })
    //         }
    //       }
    //     })
    //   }
    //   else {
    //     wx.showToast({
    //       title: '对不起，您还没有选择要删除的内容！',
    //       icon: 'none'
    //     })
    //   }
    // }

  },

/**
 * 全选按钮
 */
handleAllCheck(){
  var allChecked = !this.data.allChecked
  this.setData({
    allChecked
  })
  // 修改所有记账明细前面的按钮状态
  var arr  = this.data.bookingDetailsList;
  arr.forEach((v,i)=>{
    v.radio = allChecked
  })
  this.setData({
    bookingDetailsList:arr
  })
},

  /**
   * 顶部编辑切换
   */
  handleEdit() {
    var txt = this.data.editText == "编辑" ? "完成" : "编辑"
    this.setData({
      editText: txt
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        // console.log(res)
        that.setData({
          openid: res.data
        })
      },
    });
    
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    // wx.startPullDownRefresh()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // console.log(this.data.openid)
    var that = this;
    // var openID = "";
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        // console.log(res)
        that.setData({
          openid: res.data
        });
        // console.log(that.data.openid);
        var openID = that.data.openid;
        // console.log(openID)
        // 获取数据库的数据
        // 连接数据库创建类
        var Booking = Bmob.Object.extend("Design_accMessages");
        var query = new Bmob.Query(Booking);
        // 条件查询 条件为用户名等于当前用户名
        query.equalTo("userID", openID)
        query.find({
          success: function (result) {
            // console.log(result)
            console.log("共查询到" + result.length + "条记录");
            // 反转数组 让最后加入的显示在最前面
            result.reverse();
            // 把获得的数据添加到data里面
            that.setData({
              bookingDetailsList: result
            })
            console.log(that.data.bookingDetailsList)
          },
          error: function (error, result) {
            console.log("查询不到")
          }
        })

      },
    })
    
    // console.log(that.data.userName)
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