export default {
  generate: function generate(baseUrl, prefix) {
    return {
      auth: {
        ack: baseUrl + prefix + '/auth/ack'
      },
      jssdk: {
        config: baseUrl + prefix + '/jssdk/config',
        main: baseUrl + 'pages/jssdk'
      },
      oauth: {
        access: baseUrl + prefix + '/oauth/access',
        success: baseUrl + prefix + '/oauth/success',
        redirect: baseUrl + 'pages/oauth'
      },
      pay: {
        callback: baseUrl + prefix + '/pay/callback',
        success: baseUrl + 'pages/pay',
        main: baseUrl + 'pages/pay',
        error: baseUrl + 'error/pay',
        redirect: baseUrl + 'pages/pay'
      }
    };
  },
  base: function(host, id) {
    return 'http://' + host + '/' + id + '/';
  }
};
