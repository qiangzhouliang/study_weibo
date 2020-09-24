// pages/login/login.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  //接收返回授权信息
  onGetUserInfo: function(event) {
    const userInfo = event.detail.userInfo;
    if(userInfo){
      app.setUserInfo(userInfo);
      wx.showToast({title: '恭喜授权成功',});
      setTimeout(() => {
        wx.navigateBack();
      }, 2000);
    }
  }
  
})