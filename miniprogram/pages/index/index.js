//index.js
const app = getApp()

Page({
    data: {
        images: [1,2,3,4,5,6,7,8]
    },

    onLoad: function() {
        this.initImageSize();
    },

    initImageSize: function() {
        const windowWidth = wx.getSystemInfoSync().windowWidth;
        const weiboWidth = windowWidth - 40;
        //两张或四张图片的图片大小
        const twoImageSize = (weiboWidth - 2.5) / 2;
        //3张或6张图片的图片大小
        const threeImageSize = (weiboWidth - 2.5 * 2) / 3;
        this.setData({
            twoImageSize: twoImageSize,
            threeImageSize: threeImageSize
        })
        console.log(windowWidth);
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
                  }
                  
              }
            })
        } else {
            wx.navigateTo({
              url: '../login/login',
            })
        }
    }

})