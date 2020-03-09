import { request } from "../../request/index";
import regeneratorRuntime from "../../lib/runtime/runtime";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //左侧的菜单数据
    leftMenuList: [],
    //右侧的商品数据
    rightContent: [],
    //被点击的左侧菜单索引
    indexs: 0,
    //右侧内容的滚动条距离顶部的距离
    topnum: 0
  },
  //接口的返回数据
  Cates: [],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    /*
    1 先判断一下本地存储中有没有旧的数据
    2 没有旧数据 直接发送新请求
    3 有旧的数据 同时 旧的数据也没有过期 就使用 本地存储中旧的数据      
    */
    //  获取本地存储
    const Cates = wx.getStorageSync("cates");
    if (!Cates) {
      //不村在 发送数据请求
      this.getCates();
    } else {
      //有旧数据的 定义过期时间 10s 改成 5分钟
      if (Date.now() - Cates.time > 1000 * 60 * 5) {
        //重新发送请求
        this.getCates();
      } else {
        // console.log("haixyi");
        this.Cates = Cates.data;
        let leftMenuList = this.Cates.map(v => {
          // console.log(v);
          return v.cat_name;
        });
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        });
      }
    }
  },
  //获取分类数据
  async getCates() {
    let url = "/categories";
    // es6 的处理异步
    // request({ url }).then(res => {
    //   console.log(res);
    //   this.Cates = res.data.message;
    //   //把接口的数据存入到本地存储中
    //   wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });
    //   //构造左边的大菜单数据
    //   let leftMenuList = this.Cates.map(v => {
    //     // console.log(v);
    //     return v.cat_name;
    //   });
    //   let rightContent = this.Cates[0].children;
    //   this.setData({
    //     leftMenuList,
    //     rightContent
    //   });
    // });
    // 1 使用es7的async await 来发送请求
    const res = await request({ url });
    // console.log(res);
    this.Cates = res;
    //把接口的数据存入到本地存储中
    wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });
    //构造左边的大菜单数据
    let leftMenuList = this.Cates.map(v => {
      // console.log(v);
      return v.cat_name;
    });
    let rightContent = this.Cates[0].children;
    this.setData({
      leftMenuList,
      rightContent
    });
  },
  handleItemTap(event) {
    /*
    获取selindex 在赋值给indexs
    更具不同的索引渲染右侧的商品类容
    */
    const indexs = event.currentTarget.dataset.selindex;
    let rightContent = this.Cates[indexs].children;
    this.setData({
      indexs,
      rightContent,
      //重新设置滚动条置顶
      topnum: 0
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});
