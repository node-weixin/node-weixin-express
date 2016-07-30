module.exports = {
  port: process.NW_PORT || 2048,
  host: process.NW_HOST || 'localhost',
  template: process.NW_TEMPLATE_DIR || './views',
  weixin: {
    server: {
      host: process.NW_WEIXIN_HOST || 'localhost',
      prefix: process.NW_WEIXIN_PREFIX || '/weixin/api'
    },
    app: {
      id: process.NW_WEIXIN_APP_ID,
      secret: process.NW_WEIXIN_APP_TOKEN
    },
    message: {
      aes: process.NW_WEIXIN_MESSAGE_AES || 'aes'
    },
    oauth: {
      state: process.NW_WEIXIN_OAUTH_STATE || 'STATE',
      scope: process.NW_WEIXIN_OAUTH_SCOPE || '0'
    },
    merchant: {
      id: process.NW_WEIXIN_MERCHANT_ID,
      key: process.NW_WEIXIN_MERCHANT_KEY
    },
    certificate: {
      pfxKey: process.NW_WEIXIN_CERTIFICATE_PFXKEY,
      pfx: process.NW_WEIXIN_CERTIFICATE_PFX
    }
  }
};
