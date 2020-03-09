// 0 引用用来发送请求的方法
import { request } from "../../request/index";

//Page Object
Page({
  data: {
    //轮播图数据
    swiperList: [],
    catasList: [],
    floorList: []
  },
  //options(Object)
  //页面开始加载时就执行
  onLoad: function(options) {
    // 1 发送异步请求
    // 优化回调地域 es6 promise
    // wx.request({
    //   url,
    //   success: res => {
    //     console.log(res);
    //     this.setData({
    //       swiperList: res
    //     });
    //   },
    //   fail: err => {
    //     console.log(err);
    //   }
    // });
    // 获取轮播图数据
    this.getSwiperList();
    this.getCateList();
    this.getFloorList();
  },
  //获取轮播图数据
  getSwiperList() {
    let url = "/home/swiperdata";
    request({ url }).then(res => {
      this.setData({
        swiperList: res
      });
      console.log(res);
    });
  },
  //获取导航分类数据
  getCateList() {
    let url = "/home/catitems";
    request({ url }).then(res => {
      this.setData({
        catasList: res
      });
    });
  },
  //获取导航分类数据
  getFloorList() {
    let url = "/home/floordata";
    request({ url }).then(res => {
      this.setData({
        floorList: res
      });
    });
  },

  onReady: function() {},
  onShow: function() {},
  onHide: function() {},
  onUnload: function() {},
  onPullDownRefresh: function() {},
  onReachBottom: function() {},
  onShareAppMessage: function() {},
  onPageScroll: function() {},
  //item(index,pagePath,text)
  onTabItemTap: function(item) {}
});
