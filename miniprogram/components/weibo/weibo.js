// components/weibo/weibo.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    detailurl: {
      type: String,
      value: null
    },
    weibo: {
      type: Object,
      value: {}
    },
    handle: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onImageTap: function (event) {
      const dataset = event.target.dataset;
      const index = dataset.index;
      const images = this.data.weibo.images;
      const current = images[index];
      wx.previewImage({
        urls: images,
        current: current
      })
    },

    /**
     * 点赞功能实现
     */
    onPraiseTap: function (event) {
      const that = this;
      const weibo = that.data.weibo;

      if (!weibo.isPraised) {
        //没有点赞
        wx.cloud.callFunction({
          name: 'praise',
          data: {
            weiboId: weibo._id,
            praise: true
          },
          success: res => {
            const openId = app.globalData.userInfo.openId;
            if (!weibo.praises) {
              weibo.praises = [openId];
            } else {
              weibo.praises.push(openId);
            }
            // 将weibo的是否点赞标识设置为true
            weibo.isPraised = true;
            that.setData({weibo:weibo});
          }
        })
      } else {
        //取消点赞
        wx.cloud.callFunction({
          name: 'praise',
          data: {
            weiboId: weibo._id,
            praise: false
          },
          success: res => {
            const openId = app.globalData.userInfo.openId;
            // 1 将自己的ID从点赞数组的删除
            const newPraises = [];
            weibo.praises.forEach((praise,index)=>{
              if (praise != openId) {
                newPraises.push(praise);
              }
            })
            weibo.praises = newPraises;

            // 2 将weibo的是否点赞标识设置为false
            weibo.isPraised = false;
            that.setData({weibo:weibo});
          }
        })
      }
    }
    
  },

  lifetimes: {
    attached: function(){
      const windowWidth = wx.getSystemInfoSync().windowWidth;
      const weiboWidth = windowWidth - 40;
      const twoImageSize = (weiboWidth - 2.5) / 2;
      const threeImageSize = (weiboWidth - 2.5 * 2) / 3;
      this.setData({
        twoImageSize: twoImageSize,
        threeImageSize: threeImageSize
      })
    }
  }
})
