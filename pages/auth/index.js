import { request } from "../../request/index.js";
import { login } from "../../utils/asyncWX.js";
import regeneratorRuntime from "../../lib/runtime/runtime";
Page({
  async handleGetUserInfo(e) {
    try {
      //获取用户信息
      const { encryptedData, rawData, iv, signature } = e.detail;
      //获取小程序登录成功后的code
      const { code } = await login();
      const data = { encryptedData, rawData, iv, signature, code };
      //发送请求 获取用户的token
      let url = "/users/wxlogin";
      // const res = await request({ url, data, method: "post" });
      // const { token } = res;
      //没有权限获取token，先模拟一个token存在缓存中
      const token = "womeiyoutoken";
      wx.setStorageSync("token", token);
      wx.navigateBack({
        delta: 1
      });
    } catch (error) {
      console.log(error);
    }
  }
});
