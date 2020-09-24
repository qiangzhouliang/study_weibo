//index.js
const app = getApp()
const db = wx.cloud.database();

Page({
    data: {
        weibos:[],
        hasmore:true
    },

    onLoad: function() {
      
    },
    // 页面显示就会加载
    onShow: function () {
      this.loadWeibos();
    },

    //页面滚动到最底部
    onReachBottom: function() {
      this.loadWeibos(this.data.weibos.length);
    },

    //页面滚动到顶部
    onPullDownRefresh: function () {
      this.loadWeibos(0);
    },
    /**
     * 加载首页微博数据,上拉刷新，下拉加载更多
     */
    loadWeibos: function (start = 0) {
      const that = this;
      wx.cloud.callFunction({
        name: 'weibos',
        data: {
          start:start
        }
      }).then(res => {
        const weibos = res.result.weibos;
        let hasmore = true;
        if(weibos.length == 0){
          hasmore = false;
        }
        let newWeibos = [];
        if(start > 0){
          newWeibos = that.data.weibos.concat(weibos);
        } else {
          newWeibos = weibos;
        }
        that.setData({ weibos: newWeibos ,hasmore:hasmore})
      })
    },

    //写微博
    onWriteWeiboTap: function(event){
        const that = this;
        //判断用户是否授权
        if (app.is_login()) {
            //调起选择提示框
            wx.showActionSheet({
              itemList: ['文字','照片','视频'],
              success: res => {
                  const tapIndex = res.tapIndex;
                  if(tapIndex == 0){
                    wx.navigateTo({url: '../wweibo/wweibo?type='+tapIndex,})
                  }else if(tapIndex == 1){
                    wx.chooseImage({
                        success: res => {
                          const tempImages = res.tempFilePaths;
                          that.setData({
                            tempImages:tempImages
                          })
                          wx.navigateTo({url: '../wweibo/wweibo?type='+tapIndex,})
                        }
                      })
                  } else if(tapIndex == 2){
                    //选择视频
                    wx.chooseVideo({
                      success: res => {
                        const tempVideo = res.tempFilePaths;
                          that.setData({
                            tempVideo:tempVideo
                          })
                          wx.navigateTo({url: '../wweibo/wweibo?type='+tapIndex,})
                      },
                    })
                  }
                  
              }
            })
        } else {
            wx.navigateTo({
              url: '../login/login',
            })
        }
    },
})