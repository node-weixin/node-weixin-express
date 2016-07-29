/**
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */
module.exports = {
  connection: 'default',
  identity: 'messages',
  schema: true,
  tableName: 'messages',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  attributes: {
    from: {
      type: 'string'
    },
    to: {
      type: 'string'
    },
    event: {
      type: 'string'
    },
    message: {
      type: 'json'
    },
    time: {
      type: 'datetime'
    }
  }
};
