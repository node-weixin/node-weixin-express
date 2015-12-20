module.exports = {
  onOauth: function () {
    return function (req, res, wx) {
      console.log(req);
      console.log(res);
      console.log(wx);
      //var openId = wx.openId
      //Update you open id here
      //wx.openid
      //wx.accessToken
      //wx.refreshToken
    };
  }
};
