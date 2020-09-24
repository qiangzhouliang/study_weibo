// pages/wweibo/wweibo.js
import {getUUID,getExt} from "../../utils/util"
const app = getApp();
const db = wx.cloud.database();
Page({
  data: {
    location: null,
    tempImages: []
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initImageSize();
    //获取选中类型
    const type = options.type;
    const pages = getCurrentPages();
    const indexPage = pages[0];
    const tempImages = indexPage.data.tempImages;
    this.setData({tempImages:tempImages,type:type});
  },

  initImageSize: function () {
    //获取手机的宽度
    const windowWidth = wx.getSystemInfoSync().windowWidth;
    const containWidth = windowWidth - 60;
    const imageSize = (containWidth - 2.5*3)/3;
    this.setData({
      imageSize:imageSize
    })
  },
  openLocationPage: function(){
    const that = this;
    wx.chooseLocation({
      success: res => {
        if (res.name) {
          delete res['errMsg'];
          that.setData({
            location: res
          })
        }
      }
    })
  },
  onLocationTap: function () {
    const that = this;
    wx.getSetting({
      withSubscriptions: true,
      success: res => {
        const isLocation = res.authSetting['scope.userLocation'];
        if(isLocation){
          that.openLocationPage();
        } else {
          //授权
          wx.authorize({
            scope: 'scope.userLocation',
            success: res => {
              that.openLocationPage();
            }
          })
        }
      }
    })
  },

  onSubmitEvent: function(event) {
    const that = this;
    //获取内容
    const content = event.detail.value.content;
    //获取位置信息
    const location = this.data.location;
    //获取用户信息
    const author = app.globalData.userInfo;
    const weibo = {
      content: content,
      location: location,
      author: author
    }
    //加载进度条
    wx.showLoading({
      title: '正在发表中...',
    })
    //1 上传图片到服务器
    //保存上传完文件的文件ID
    const fileIdList = [];
    if(this.data.tempImages && this.data.tempImages.length > 0){
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth()+1;
      const day = today.getDate();
      
      this.data.tempImages.forEach((value,index) =>{
        //上传文件路径
        const cloudPath="weibos/"+year+"/"+month+"/"+day+"/"+getUUID()+"."+getExt(value);
        wx.cloud.uploadFile({
          cloudPath: cloudPath,
          filePath: value,
          success: res => {
            fileIdList.push(res.fileID);
            //判断所有的图片是否上传完成
            if(fileIdList.length == that.data.tempImages.length){
              weibo.images = fileIdList;
              //接下来 发布微博
              that.publicWeibo(weibo);
            }
          }
        })
      })
    } else {
      that.publicWeibo(weibo);
    }
    
  },

  //发布微博
  publicWeibo: function(weibo){
    wx.cloud.callFunction({
      name:'wweibo',
      data: weibo,
      success: res => {
        wx.hideLoading();
        const _id = res.result._id;
        if(_id){
          wx.showToast({
            title: '发布完成',
          })
        } else {
          wx.showToast({
            title: res.result.errMsg,
          })
        }
      }
    })
  },
  //添加照片
  onAddImageTap: function(event) {
    const that = this;
    wx.chooseImage({
      success: res => {
        const tempImages = res.tempFilePaths;
        const oldImages = that.data.tempImages;
        const newImages = oldImages.concat(tempImages);
        that.setData({
          tempImages:newImages
        })
      }
    })
  },

  //删除照片
  onRemoveBtnTap: function(event) {
    const index = event.target.dataset.index;
    const tempImages = this.data.tempImages;
    //删除元素
    tempImages.splice(index,1);
    this.setData({
      tempImages:tempImages
    })
  }
})