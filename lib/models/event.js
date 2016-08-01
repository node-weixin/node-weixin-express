/**
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */
module.exports = {
  connection: 'default',
  identity: 'event',
  schema: true,
  tableName: 'event',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  attributes: {
    from: {
      type: 'string',
      required: true
    },
    to: {
      type: 'string',
      required: true
    },
    event: {
      type: 'string',
      required: true
    },
    message: {
      type: 'json'
    },
    time: {
      type: 'datetime'
    }
  }
};
