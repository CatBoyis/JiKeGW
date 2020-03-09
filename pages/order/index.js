/**
 * 1 页面被打开的时候 onshow
 *   onshow 不同于onload无法在形式参数上接受options
 *   先判断缓存中是否又token
 *     没有就先去授权
 *   获取url上的参数type
 *   根据type值来确认页面标题哪个被激活选中
 *   根据type值去发送请求获取订单数据
 *   渲染页面
 * 点击不同的标题也要重新发送请求获取和渲染数据
 */
import { request } from "../../request/index";
import regeneratorRuntime from "../../lib/runtime/runtime";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    orders: [],
    tabs: [
      {
        id: 0,
        value: "全部",
        isActive: true
      },
      {
        id: 1,
        value: "待付款",
        isActive: false
      },
      {
        id: 2,
        value: "代发货",
        isActive: false
      },
      {
        id: 3,
        value: "退款/退货",
        isActive: false
      }
    ]
  },
  MNorders1: [
    {
      orders_id: 1104,
      user_id: 23,
      order_number: "HMDD201905060000001104",
      order_price: 13618,
      create_time: 1565616985,
      update_time: 1565616985
    },
    {
      orders_id: 1104,
      user_id: 23,
      order_number: "HMDD201905060000001104",
      order_price: 13618,
      create_time: 1565616985,
      update_time: 1565616985
    },
    {
      orders_id: 1104,
      user_id: 23,
      order_number: "HMDD201905060000001104",
      order_price: 13618,
      create_time: 1565616985,
      update_time: 1565616985
    },
    {
      orders_id: 1104,
      user_id: 23,
      order_number: "HMDD201905060000001104",
      order_price: 13618,
      create_time: 1565616985,
      update_time: 1565616985
    },
    {
      orders_id: 1104,
      user_id: 23,
      order_number: "HMDD201905060000001104",
      order_price: 13618,
      create_time: 1565616985,
      update_time: 1565616985
    },
    {
      orders_id: 1104,
      user_id: 23,
      order_number: "HMDD201905060000001104",
      order_price: 13618,
      create_time: 1565616985,
      update_time: 1565616985
    }
  ],
  MNorders2: [
    {
      orders_id: 1104,
      user_id: 23,
      order_number: "HMDD201905060000001105",
      order_price: 13618,
      create_time: 1565616985,
      update_time: 1565616985
    },
    {
      orders_id: 1104,
      user_id: 23,
      order_number: "HMDD201905060000001104",
      order_price: 13618,
      create_time: 1565616985,
      update_time: 1565616985
    },
    {
      orders_id: 1104,
      user_id: 23,
      order_number: "HMDD201905060000001104",
      order_price: 13618,
      create_time: 1565616985,
      update_time: 1565616985
    },
    {
      orders_id: 1104,
      user_id: 23,
      order_number: "HMDD201905060000001104",
      order_price: 13618,
      create_time: 1565616985,
      update_time: 1565616985
    },
    {
      orders_id: 1104,
      user_id: 23,
      order_number: "HMDD201905060000001104",
      order_price: 13618,
      create_time: 1565616985,
      update_time: 1565616985
    },
    {
      orders_id: 1104,
      user_id: 23,
      order_number: "HMDD201905060000001104",
      order_price: 13618,
      create_time: 1565616985,
      update_time: 1565616985
    }
  ],
  MNorders3: [
    {
      orders_id: 1104,
      user_id: 23,
      order_number: "HMDD201905060000001106",
      order_price: 13618,
      create_time: 1565616985,
      update_time: 1565616985
    },
    {
      orders_id: 1104,
      user_id: 23,
      order_number: "HMDD201905060000001104",
      order_price: 13618,
      create_time: 1565616985,
      update_time: 1565616985
    },
    {
      orders_id: 1104,
      user_id: 23,
      order_number: "HMDD201905060000001104",
      order_price: 13618,
      create_time: 1565616985,
      update_time: 1565616985
    },
    {
      orders_id: 1104,
      user_id: 23,
      order_number: "HMDD201905060000001104",
      order_price: 13618,
      create_time: 1565616985,
      update_time: 1565616985
    },
    {
      orders_id: 1104,
      user_id: 23,
      order_number: "HMDD201905060000001104",
      order_price: 13618,
      create_time: 1565616985,
      update_time: 1565616985
    },
    {
      orders_id: 1104,
      user_id: 23,
      order_number: "HMDD201905060000001104",
      order_price: 13618,
      create_time: 1565616985,
      update_time: 1565616985
    }
  ],
  MNorders4: [
    {
      orders_id: 1104,
      user_id: 23,
      order_number: "HMDD201905060000001107",
      order_price: 13618,
      create_time: 1565616985,
      update_time: 1565616985
    },
    {
      orders_id: 1104,
      user_id: 23,
      order_number: "HMDD201905060000001104",
      order_price: 13618,
      create_time: 1565616985,
      update_time: 1565616985
    },
    {
      orders_id: 1104,
      user_id: 23,
      order_number: "HMDD201905060000001104",
      order_price: 13618,
      create_time: 1565616985,
      update_time: 1565616985
    },
    {
      orders_id: 1104,
      user_id: 23,
      order_number: "HMDD201905060000001104",
      order_price: 13618,
      create_time: 1565616985,
      update_time: 1565616985
    },
    {
      orders_id: 1104,
      user_id: 23,
      order_number: "HMDD201905060000001104",
      order_price: 13618,
      create_time: 1565616985,
      update_time: 1565616985
    },
    {
      orders_id: 1104,
      user_id: 23,
      order_number: "HMDD201905060000001104",
      order_price: 13618,
      create_time: 1565616985,
      update_time: 1565616985
    }
  ],
  //页面打开
  onShow(options) {
    const token = wx.getStorageSync("token");
    if (!token) {
      wx.navigateTo({
        url: "/pages/auth/index"
      });
      return;
    }
    //获取当前小程序的页面栈-数组 长度最大10个页面
    //数组中索引最大的就是当前页面了
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    const { type } = currentPage.options;
    // 激活选中页面标题
    this.changeTitleByIndex(type - 1);
    this.getOrders(type);
  },
  //根据标题索引来激活选中标题数组
  changeTitleByIndex(index) {
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
   * 标题的点击事件 从子组件传递过来的
   */
  handleTabsItemChange(e) {
    //1 获取被点击的标题索引
    const { index } = e.detail;
    this.changeTitleByIndex(index);
    //2 重新发送请求 type=1 的时候 index=0
    this.getOrders(index + 1);
  },
  //获取订单列表的方法
  async getOrders(type) {
    let url = "/my/orders/all";
    let data = {
      type
    };
    // -----------------------------------------
    // const res = await request({ url, data });
    // console.log(res);
    // this.setData({
    //   orders: res.orders
    // });
    // -----------------------------------------
    //模拟
    this.setData({
      orders: this[`MNorders${type}`].map(v => {
        return {
          ...v,
          create_time_cn: new Date(v.create_time * 1000).toLocaleString()
        };
      })
    });
  }
});
