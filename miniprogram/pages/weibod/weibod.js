// pages/weibod/weibod.js

const db = wx.cloud.database()
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mask: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const index = options.index;
    const pages = getCurrentPages()
    const indexPage = pages[0];
    const weibos = indexPage.data.weibos;
    const weibo = weibos[index];
    this.setData({
      weibo: weibo
    });

    this.loadComments();
  },

  /**
   * 加载评论
   */
  loadComments: function(){
    const that = this;
    db.collection("comment").where({
      weiboid: that.data.weibo._id
    }).orderBy("create_time","desc").get().then(res => {
      const comments = res.data;
      comments.forEach((comment,index) => {
        comment.create_time = comment.create_time.getTime()
      })
      that.setData({
        comments: comments
      })
    })
  },

  /**
   * 获取焦点后，显示遮罩 
   */
  onFocusEvent: function(event){
    this.setData({
      mask: true
    })
  },
  /**
   * 失去焦点后，隐藏遮罩 
   */
  onBlurEvent: function(event){
    this.setData({
      mask: false
    })
  },

  /**
   * 提交
   */
  onConfirmEvent: function(event){
    const that = this;
    const content = event.detail.value;
    db.collection("comment").add({
      data: {
        content: content,
        author: app.globalData.userInfo,
        create_time: db.serverDate(),
        weiboid: that.data.weibo._id
      }
    }).then(res => {
      const comment = {
        "_id": res._id,
        "content": content,
        "author": app.globalData.userInfo,
        "create_time": (new Date()).getTime()
      }
      const comments = that.data.comments;
      comments.splice(0,0,comment);
      that.setData({
        comments: comments
      })
    })
  }
})