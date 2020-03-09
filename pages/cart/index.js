/**
 * 1 获取用户的收获地址
 *    1绑定点击事件
 *    2调用小程序内置api 获取用户的收货地址
 * 2 获取用户对小程序授予获取地址的权限状态scope  authSetting scope.address
 *    1假设用户点击获取收获地址的提示框确定的话
 *      scope=true 直接调用收货地址
 *    2假设用户点击获取收获地址的提示框取消的话
 *      scope=false
 *      诱导用户打开用户授权界面 当用户重新给与获取地址权限的时候
 *      直接调用收货地址
 *    3假设用户从来没有调用过 收货地址的api
 *      scope=undefined 直接调用收货地址
 * 页面加载完毕
 *      onShow
 *    1 获取本地存储中 地址数据
 *    2 把数据 设置给data中的一个变量
 *      onShow
 *        num=1;
 *        checked=true;
 *    1 获取本地存储中 购物车数组
 *    2 把购物车数据 填充到data中
 * 全选的实现 数据展示
 *   1 onShow 获取缓存中的购物车数组
 *   2 根据购物车中的商品数据 所有的商品都被选中了 checked=true 全选就被选中了
 * 总价格和总数量
 *   1 都需要商品被选中 我们才拿他 来计算
 *   2 获取购物车的数组
 *   3 遍历
 *   4 判断商品是否被选中
 *   5 总价格 +=商品的单价 * 商品的数量
 *   6 总数量 +=商品的数量
 *   7 把计算后的价格和数量 设置回data中即可
 * 商品的选中功能
 *   1 绑定change事件
 *   2 获取到被修改的商品对象
 *   3 商品对象的选中状态 取反
 *   4 重新填充回data中和缓存中
 *   5 重新计算全选.总价格 总数量...
 * 全选和反选
 *   1 全选复选框绑定事件 change
 *   2 获取data中的全选状态allCheched
 *   3 直接取反 allCheched=!allCheched
 *   4 遍历购物车数组让俩面的购物车商品选中状态跟的allCheched一起改变
 *   5 把购物车数组 和allCheched重新设置回data 把购物车 重新设置回 缓存中
 * 商品数量的编辑功能
 *   1 "+" "-" 按钮 绑定同一个点击事件区分的关键 自定义属性
 *       "+" "+1"
 *       "-" "-1"
 *   2 传递被点击的商品id goods_id
 *   3 获取到data中的购物车数组 来获取需要被修改的商品对象
 *      当购物车的数量=1同时用户点击的减号
 *      弹窗提示 询问用户是否要删除
 *      确认 执行删除
 *      取消 什么都不做
 *   4 直接修改商品对象的数量 num
 *   5 把cart数组 重新设置回 缓存和data中 this.setCart
 * 点击结算按钮
 *   1 判断有没有收货地址信息
 *   2 判断用户有没有选购商品
 *   3 经过了以上判断,跳转到支付页面
 */
import {
  getSetting,
  chooseAddress,
  openSetting,
  showModal,
  showToast
} from "../../utils/asyncWX.js";
import regeneratorRuntime from "../../lib/runtime/runtime";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    allCheched: false,
    totalPrice: 0,
    totalNum: 0
  },
  //点击获取 收货地址
  async handleChooseAddress() {
    // 获取权限状态
    try {
      const resSetting = await getSetting();
      const scopeAddress = resSetting.authSetting["scope.address"];
      //判断 权限状态
      if (scopeAddress === false) {
        //用户以前拒接过授权 诱导用户打开用户授权界面
        await openSetting();
      }
      // 重新打开收货地址
      const resAddress = await chooseAddress();
      resAddress.all =
        resAddress.provinceName +
        resAddress.cityName +
        resAddress.countyName +
        resAddress.detailInfo;
      // console.log(resAddress);
      wx.setStorageSync("address", resAddress);
    } catch (error) {
      console.log(error);
    }
  },
  //商品的选中
  handleItemChange(e) {
    // 获取被修改的商品id
    const goods_id = e.currentTarget.dataset.id;
    // 获取购物车数组
    let { cart } = this.data;
    // 找到被修改的商品对象
    let index = cart.findIndex(v => v.goods_id === goods_id);
    // 选中状态取反
    cart[index].checked = !cart[index].checked;
    // 把购物车数据重新设置回data数据中和缓存中
    this.setCart(cart);
  },
  //设置购物车状态同时重新计算底部工具栏的数据 全选 总价 购买数量
  setCart(cart) {
    let allCheched = true;
    // 总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      } else {
        allCheched = false;
      }
    });
    //判断数组是否为空
    allCheched = cart.length != 0 ? allCheched : false;
    //给data赋值
    this.setData({
      cart,
      allCheched,
      totalPrice,
      totalNum
    });
    wx.setStorageSync("cart", cart);
  },
  //商品的全选功能
  handleItemAllCheck() {
    //获取data中的数据
    let { cart, allCheched } = this.data;
    //修改值
    allCheched = !allCheched;
    //循环修改cart数组中的商品选中状态
    cart.forEach(v => (v.checked = allCheched));
    //把购物车数组 和allCheched重新设置回data 把购物车 重新设置回 缓存中
    this.setCart(cart);
  },
  //修改商品数量
  async handleItemNumEdit(e) {
    // 获取传递过来的参数
    const { operation, id } = e.currentTarget.dataset;
    // 获取购物车数组
    let { cart } = this.data;
    // 找到需要修改的商品的索引
    const index = cart.findIndex(v => v.goods_id === id);
    if (cart[index].num === 1 && operation === -1) {
      const title = "提示";
      const content = "是否执行删除操作";
      const res = await showModal({ title, content });
      if (res.confirm) {
        cart.splice(index, 1);
        this.setCart(cart);
      } else if (res.cancel) {
        console.log("取消");
      }
    } else {
      // 进行修改数量
      cart[index].num += operation;
      // 设置回缓存和data中
      this.setCart(cart);
    }
  },
  //点击结算
  async handlePay() {
    const { address, totalNum } = this.data;
    //判断有没有商品
    if (totalNum === 0) {
      let title = "您还没有选购商品";
      await showToast({ title });
      return;
    }
    // 判断收获地址
    if (!address.userName) {
      let title = "请填写收货地址";
      await showToast({ title });
      return;
    }
    //跳转到微信页面
    wx.navigateTo({
      url: "/pages/pay/index"
    });
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
    this.setCart(cart);
    this.setData({
      address
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
