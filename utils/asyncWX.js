/**
 * Promise 形式的 wx.getSetting({})
 */
export const getSetting = () => {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success: result => {
        resolve(result);
      },
      fail: err => {
        reject(err);
      }
    });
  });
};

/**
 * Promise 形式的 wx.chooseAddress({})
 */
export const chooseAddress = () => {
  return new Promise((resolve, reject) => {
    wx.chooseAddress({
      success: result => {
        resolve(result);
      },
      fail: err => {
        reject(err);
      }
    });
  });
};

/**
 * Promise 形式的 wx.chooseAddress({})
 */
export const openSetting = () => {
  return new Promise((resolve, reject) => {
    wx.openSetting({
      success: result => {
        resolve(result);
      },
      fail: err => {
        reject(err);
      }
    });
  });
};

/**
 * Promise 形式的 wx.showModal({})
 */
export const showModal = ({ title, content }) => {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title,
      content,
      success: res => {
        resolve(res);
      },
      fail: err => {
        reject(err);
      }
    });
  });
};

/**
 * Promise 形式的 wx.showToast({})
 */
export const showToast = ({ title }) => {
  return new Promise((resolve, reject) => {
    wx.showToast({
      title,
      icon: "none",
      success: res => {
        resolve(res);
      },
      fail: err => {
        reject(err);
      }
    });
  });
};

/**
 * Promise 形式的 wx.login({})
 */
export const login = () => {
  return new Promise((resolve, reject) => {
    wx.login({
      timeout: 10000,
      success: result => {
        resolve(result);
      },
      fail: err => {
        reject(err);
      }
    });
  });
};

/**
 * Promise 形式的 wx.requestPayment({})
 */
export const requestPayment = pay => {
  return new Promise((resolve, reject) => {
    wx.requestPayment({
      ...pay,
      success: res => {
        resolve(res);
      },
      fail: err => {
        reject(err);
      }
    });
  });
};
