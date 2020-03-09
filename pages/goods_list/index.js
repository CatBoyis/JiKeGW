import { request } from "../../request/index";
import regeneratorRuntime from "../../lib/runtime/runtime";
/**
 * 1 用户上滑页面 滚动条触底 开始加载下一页数据
 *   找到滚动条触底事件 微信小程序官方文档
 *   判断还有没有下一页数据
 *      获取页码和总页数  只有总条数 total
 *        总页数 =Math.ceil(total/pagesize)
 *      获取当前页码 pagenum
 *      判断一下 当前的页码是否大于等于 总页数
 *        表示没有下一页数据
 *   假如没有下一页数据，就弹出提示框
 *   假如还有下一页数据，来加载下一页数据
 *       当前的页码 ++
 *       重新发送请求
 *       数据请求回来 要对data中的数组 进行拼接 而不是全部替换
 * 2 用户下拉刷新页面
 *   触发下拉刷新页面 需要在页面的JSON文件中开启一个配置项
 *   重置 数据 数组
 *   重置页码 设置为1
 *   重新发送请求
 *   数据回来了要手动关闭等待效果
 */

Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: "综合",
        isActive: true
      },
      {
        id: 1,
        value: "销量",
        isActive: false
      },
      {
        id: 2,
        value: "价格",
        isActive: false
      }
    ],
    goodsList: []
  },
  //接口要的参数
  QueryParams: {
    query: "",
    cid: "",
    pagenum: 1,
    pagesize: 10
  },
  //总页数
  totalPages: 1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.QueryParams.cid = options.cid || "";
    this.QueryParams.query = options.query || "";
    this.getGoodsList();
    wx.showLoading({
      title: "加载中"
    });

    setTimeout(function() {
      wx.hideLoading();
    }, 5000);
  },
  /**
   * 获取商品列表数据
   */
  async getGoodsList() {
    let url = "/goods/search";
    const res = await request({ url, data: this.QueryParams });
    //获取总条数
    const total = res.total;
    //计算总页数
    this.totalPages = Math.ceil(total / this.QueryParams.pagesize);
    this.setData({
      //拼接的数组
      goodsList: [...this.data.goodsList, ...res.goods]
    });
    //关闭下拉刷新的效果
    wx.stopPullDownRefresh();
  },
  /**
   * 标题的点击事件 从子组件传递过来的
   */
  handleTabsItemChange(e) {
    //1 获取被点击的标题索引
    const { index } = e.detail;
    //2 修改原数组
    const { tabs } = this.data;
    tabs.forEach((v, i) => {
      i === index ? (v.isActive = true) : (v.isActive = false);
    });
    this.setData({
      tabs
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
  onPullDownRefresh() {
    this.setData({
      goodsList: []
    });
    this.QueryParams.pagenum = 1;
    this.getGoodsList();
    console.log("刷新了");
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    //判断还有没有下一页
    if (this.QueryParams.pagenum >= this.totalPages) {
      //没有下一页数据了
      wx.showToast({
        title: "没有下一页数据了"
      });
    } else {
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});
