/**
 * 缓存中获取购物车数据 渲染到页面中
 *   这些数据checked=true
 *
 * 微信支付
 *   那些人 哪些账号 可以实现微信支付
 *    企业账号
 *    企业账号的小程序后台中 必须为开发者 添加上白名单
 *    一个appid 可以同是绑定多个开发者
 *    这些开发者就可以公用这个appid 和他的开发权限了
 * 支付按钮
 *   先判断缓存中有没有token
 *   没有 跳转到授权页面 进行获取token
 *   有token...
 *   有的话就创建订单，获取订单编号
 *   已经完成了支付
 *   手动删除缓存中被选中的商品
 *   删除后的购物车数组填充回缓存中
 *   再跳转页面
 */

import {
  getSetting,
  chooseAddress,
  openSetting,
  showModal,
  showToast,
  requestPayment
} from "../../utils/asyncWX.js";
import regeneratorRuntime from "../../lib/runtime/runtime";
import { request } from "../../request/index";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },
  //点击支付

  async handleOrderPay() {
    try {
      // 1 判断缓存中有没有token
      const token = wx.getStorageSync("token");
      // 2 判断
      if (!token) {
        wx.navigateTo({
          url: "/pages/auth/index"
        });
        return;
      }
      console.log("token存在");
      // 3创建订单
      // 创建订单 请求头参数 公共方法判断了 不用自己带token了
      // const header = { Authorization: token };
      // 请求体参数
      const order_price = this.data.totalPrice;
      const consignee_addr = this.data.address.all;
      const cart = this.data.cart;
      let goods = [];
      cart.forEach(v =>
        goods.push({
          goods_id: v.goods_id,
          goods_numder: v.num,
          goods_price: v.goods_price
        })
      );
      // 4准备发送请求 创建订单 获取订单编号
      let url = "/my/orders/create";
      const data = { order_price, consignee_addr, goods };
      // ------------------------------------------------------------------
      //const res = await request({ url, method: "POST", data});
      //订单号是这样的
      // const {order_number} = await request({ url, method: "POST", data});
      //获取订单号 ，没有权限，模拟一个订单号
      let order_number = "HMDD20200308000000001058";
      // ------------------------------------------------------------------
      // ------------------------------------------------------------------
      // 5发起预支付请求
      // let urlp = "/my/orders/req_unifiedorder";
      // const ress = await request({
      //   url: urlp,
      //   method: "POST",
      //   data: {
      //     order_number
      //   }
      // });
      // 5预支付返回信息获取pay是这样的
      // const { pay } = await request({url: urlp,method: "POST",data: {order_number}});
      //模拟一个获取到的预支付信息
      let resres = {
        order_number: "HMDD20200308000000001058",
        pay: {
          nonceStr: "U6tyNdYvm3ReKgI",
          package: "prepay_id=wx09182118356902a15c8d071931343000",
          paySign: "C514E29387794F84004C983AFFF4707F",
          signType: "MD5",
          timeStamp: "1565346079"
        }
      };
      // ------------------------------------------------------------------
      // 6发起微信支付了
      // const resp = await requestPayment(resres.pay);
      // console.log(resp);
      // 7查询后台订单状态
      // let urls = "/my/orders/chkOrder";
      // const resOrder = await request({url: urlp,method: "POST",data: {order_number}});
      //模拟支付以后
      await showToast({
        title: "模拟支付成功"
      });
      // 8 手动删除缓存中被选中的商品
      let newCart = wx.getStorageSync("cart");
      newCart = newCart.filter(v => !v.checked);
      // 9 删除后的购物车数组填充回缓存中
      wx.setStorageSync("cart", newCart);
      // 10 再跳转页面
      wx.navigateTo({
        url: "/pages/order/index"
      });
    } catch (error) {
      await showToast({
        title: "模拟支付失败"
      });
      console.log(error);
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    //获取缓存中的地址信息
    let address = wx.getStorageSync("address");
    //获取缓存中的购物车数据
    let cart = wx.getStorageSync("cart") || [];
    //计算全选 every 数组方法 会遍历 会接收一个回调函数 那么 每一个回调函数都返回true 那么every方法返回值就是true
    // 只要 有一个回调函数返回了false那么不再循环执行了,直接返回false
    // const allCheched = cart.length ? cart.every(v => v.checked) : false;

    //过滤后的购物车数组
    cart = cart.filter(v => v.checked);
    // 总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      totalPrice += v.num * v.goods_price;
      totalNum += v.num;
    });
    //给data赋值
    this.setData({
      address,
      cart,
      totalPrice,
      totalNum
    });
  },

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
