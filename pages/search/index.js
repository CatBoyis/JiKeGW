/**
 * 输入框绑定事件值改变事件 input事件
 *     获取到输入框的值
 *     合法行判断
 *     检验通过了 把输入框的值 发送到后台
 *     返回的数据打印到页面上
 * 防抖(防止都抖动) 定时器  节流
 *     防抖 一般用在输入框中 防止重复输入
 *     节流 一般用作页面的下拉和上拉
 *     定义全局的定时器id
 */
import { request } from "../../request/index";
import regeneratorRuntime from "../../lib/runtime/runtime";
Page({
  data: {
    goods: [],
    // 取消的按钮时候隐藏
    isFocus: false,
    inpValue: ""
  },
  TimeId: -1,
  //输入框的值改变事件
  handleInput(e) {
    //获取输入框的值
    let { value } = e.detail;
    //合法性验证
    if (!value.trim()) {
      this.setData({
        isFocus: false,
        goods: []
      });
      return;
    }
    // 准备发送请求
    this.setData({
      isFocus: true
    });
    clearTimeout(this.TimeId);
    this.TimeId = setTimeout(() => {
      this.qsearch(value);
    }, 1000);
  },
  //发送请求获取搜索建议的数据
  async qsearch(query) {
    let url = "/goods/qsearch";
    let data = { query };
    const res = await request({ url, data });
    console.log(res);
    this.setData({
      goods: res
    });
  },
  //点击取消按钮的重置页面
  handleCancel() {
    this.setData({
      inpValue: "",
      isFocus: false,
      goods: []
    });
  }
});
