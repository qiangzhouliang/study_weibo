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

    onWriteWeiboTap: function(event){
        console.log(event)
    }

})