import { request } from "../../request/index";
import regeneratorRuntime from "../../lib/runtime/runtime";
/**
 * 点击轮播图 预览大图
 *    1 为轮播图添加点击事件
 *    2 调用小程序的api previewImage
 */
/**
 * 点击加入购物车
 *   先绑定点击事件
 *   获取缓存中的购物车数据 数组格式
 *   先判断 当前的商品是否已经存在于购物车里
 *   已经存在 修改商品数据 执行购物车数量++ 重新把购物车数组填充回缓存中
 *   不存在于购物车的数组中 直接为购物车数组添加一个新元素 带上 购买数量属性 num 重新把购物车数组 填充回缓冲中
 *   弹框提示
 * 商品收藏
 *   页面onshow的时候 加载缓存中的商品收藏的数据
 *   判断当前商品是否收藏
 *      是的话 改变页面收藏图标
 *      不是
 * 点击商品收藏按钮的时候
 *      判断该商品时候存在于缓存的数组中
 *      已经存在就把该商品删除掉
 *      没有存在就添加到收藏数组中 存入存入缓存中
 */
Page({
  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {},
    //商品是否被收藏
    isCollect: false
  },
  // 商品对象
  GoodsInfo: {},
  /**
   * 生命周期函数--监听页面加载
   */
  onShow(options) {
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    const { goods_id } = currentPage.options;
    this.getGoodsDetail(goods_id);
  },
  //获取商品的详情数据
  async getGoodsDetail(goods_id) {
    let url = "/goods/detail";
    let goodsObj = await request({ url, data: { goods_id } });
    this.GoodsInfo = goodsObj;
    //获取缓存中的商品收藏的数组
    let collect = wx.getStorageSync("collect") || [];
    //判断当前商品是否收藏
    let isCollect = collect.some(v => v.goods_id === this.GoodsInfo.goods_id);

    this.setData({
      goodsObj: {
        goods_price: goodsObj.goods_price,
        goods_name: goodsObj.goods_name,
        //iphone部分手机不识别webp图片格式
        //最好找到后台  让他进行修改
        //临时自己改 确保后台存在 1.webp=>1.jpg
        goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, ".jpg"),
        pics: goodsObj.pics
      },
      isCollect
    });
  },
  /**
   * 点击预览大图
   */
  handlePreviewImage(e) {
    // 1 先构造要预览的图片数组
    const urls = this.GoodsInfo.pics.map(v => v.pics_mid);
    // 2 接受点击传递过来的图片地址
    const { current } = e.currentTarget.dataset;
    wx.previewImage({
      current,
      urls
    });
  },
  //点击加入购物车
  handleCatAdd() {
    console.log("点击加入购物车");
    let cart = wx.getStorageSync("cart") || [];
    //商品对象是否纯在于购物车
    let index = cart.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
    if (index === -1) {
      //不存在 是第一次加入购物车的
      this.GoodsInfo.num = 1;
      this.GoodsInfo.checked = true;
      cart.push(this.GoodsInfo);
    } else {
      cart[index].num++;
      //已经存在了 就执行num++
    }
    //重新把购物车数组 填充回缓冲中
    wx.setStorageSync("cart", cart);
    wx.showToast({
      title: "加入成功",
      icon: "success",
      mask: true
    });
  },
  //点击搜藏
  handleCollect() {
    let isCollect = false;
    //拿到缓存中 的商品收藏数组
    let collect = wx.getStorageSync("collect") || [];
    //判断该商品 是否被收藏过
    let index = collect.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
    // 当index!=-1的话就已经收藏过了
    if (index !== -1) {
      //能找到 已经收藏过了
      collect.splice(index, 1);
      isCollect = false;
      wx.showToast({
        title: "取消成功",
        icon: "success",
        mask: true
      });
    } else {
      collect.push(this.GoodsInfo);
      isCollect = true;
      wx.showToast({
        title: "收藏成功",
        icon: "success",
        mask: true
      });
    }
    // 把数组存入缓存中
    wx.setStorageSync("collect", collect);
    // 修改data中isCollect的属性
    this.setData({
      isCollect
    });
  }
});
