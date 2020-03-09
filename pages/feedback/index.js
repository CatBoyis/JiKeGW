/**
 * 点击+触发tap点击事件
 *   调用小程序内置的选择图片的api
 *   获取图片的路劲 数组格式
 *   把这些图片路径都存入data的变量中
 *   页面就可以根据 图片数组 进行循环显示
 * 点删除图片组件
 *   获取被点击的元素组件
 *   获取data中的图片数组
 *   根据索引 删除数组中对应的元素
 *   把数组重新设置回data中
 * 点击提交按钮
 *   获取文本域内容
 *     在data中定义变量 表示文本域内容
 *      文本域 绑定 输入事件 事件触发的时候 把输入框的值 输入到变量中
 *   对这些内容做合法验证
 *   验证通过 用户选择的图片 上转到专门的图片服务器 返回图片外网链接
 *      遍历图片数组
 *      挨个上传
 *      自己再维护图片数组 存放 图片上传后的外网的链接
 *   文本域和外网的图片的路径 一起提交到服务器中 前端模拟一下
 *   清空当前页面
 *   返回上一页
 */
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: "体验问题",
        isActive: true
      },
      {
        id: 1,
        value: "商品,商家投诉",
        isActive: false
      }
    ],
    //被选中的图片路径数组
    chooseImgs: [],
    //文本域的内容
    textVal: ""
  },
  UpLoadImgs: [],
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
  // 点击+触发tap点击事件
  handleChoodeImg() {
    // 调用小程序内置选择图片api
    wx.chooseImage({
      // 同时选中的图片张数
      count: 4,
      //图片格式 原图 压缩
      sizeType: ["original", "compressed"],
      //图片的来源 相册照相机
      sourceType: ["album", "camera"],
      success: result => {
        this.setData({
          chooseImgs: [...this.data.chooseImgs, ...result.tempFilePaths]
        });
      },
      fail: err => {
        console.log(err);
      }
    });
  },
  //点击删除图片
  handleRemoveImg(e) {
    const { index } = e.currentTarget.dataset;
    let { chooseImgs } = this.data;
    chooseImgs.splice(index, 1);
    this.setData({
      chooseImgs
    });
  },
  //文本域的输入事件
  handleTextInput(e) {
    this.setData({
      textVal: e.detail.value
    });
  },
  //提交按钮的点击事件
  handleFormSubmit() {
    //获取文本域内容 获取图片数组
    const { textVal, chooseImgs } = this.data;
    //合法性的验证
    if (!textVal.trim()) {
      wx.showToast({
        title: "输入不合法",
        icon: "none",
        mask: true
      });
      return;
    }
    //准备上传图片到专门的服务器
    //上传文件的api 不支持 多个文件同时上传 便利数组挨个上传
    //显示正在上传中
    wx.showLoading({
      title: "正在上传中",
      mask: true
    });
    //判断有没有上传的图片数组
    if (chooseImgs.length !== 0) {
      chooseImgs.forEach((v, i) => {
        wx.cloud.uploadFile({
          cloudPath: `data${new Date().valueOf()}.png`,
          filePath: v,
          success: res => {
            let { fileID } = res;
            let url = this.insertStr(
              fileID,
              res.fileID.lastIndexOf("/"),
              ".tcb.qcloud.la"
            );
            this.UpLoadImgs.push(url);
            if (i === chooseImgs.length - 1) {
              wx.hideLoading();
              console.log(this.UpLoadImgs);
              console.log("把文本的内容和外网的数组提交到后台中");
              //提交都成功了
              //重置页面
              this.setData({
                textVal: "",
                chooseImgs: []
              });
              //返回上一个页面
              wx.navigateBack({
                delta: 1
              });
            }
          },
          fail(res) {
            console.log(res);
          }
        });
      });
    } else {
      wx.hideLoading();
      this.setData({
        textVal: ""
      });
      //返回上一个页面
      wx.navigateBack({
        delta: 1
      });
      console.log("只是提交了文本");
    }
  },
  //处理图片路径
  insertStr(soure, start, newStr) {
    let url = soure.slice(0, start) + newStr + soure.slice(start);
    return url.replace("cloud://weblw1998-wgiri.", "https://");
  }
});
