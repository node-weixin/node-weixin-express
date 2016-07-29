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
  },
  database: {
    mongodb: {
      url: process.NW_MONGODB_URI,
      host: process.NW_MONGODB_HOST || 'localhost',
      port: process.NW_MONGODB_PORT || 27017,
      name: process.NW_MONGODB_NAME,
      user: process.NW_MONGODB_USER,
      password: process.NW_MONGODB_PASSWORD
    },
    mysql: {
      adapter: 'mysql',
      host: process.env.FORIM_MYSQL_DB_HOST || '127.0.0.1',
      user: process.env.FORIM_MYSQL_DB_USER || 'forim',
      password: process.env.FORIM_MYSQL_DB_PASSWORD || 'forim',
      database: process.env.FORIM_MYSQL_DB_NAME || 'forim',
      prefix: process.env.FORIM_MYSQL_DB_PREFIX || ''
    }
  }
};
