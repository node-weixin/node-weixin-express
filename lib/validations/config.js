module.exports = {
  port: {
    type: 'int',
    required: true
  },
  host: {
    type: 'string',
    required: true
  },
  template: {
    type: 'string'
  },
  server: {
    type: 'object',
    required: true,
    validate: {
      prefix: {
        type: 'string'
      },
      host: {
        type: 'string',
        required: true
      }
    }
  },
  app: {
    type: 'object',
    required: true,
    validate: {
      id: {
        type: 'string',
        maxLength: 64,
        required: true
      },
      secret: {
        type: 'string',
        maxLength: 64,
        required: true
      },
      token: {
        type: 'string',
        maxLength: 64,
        required: true
      }
    }
  },
  merchant: {
    type: 'object',
    validate: {
      id: {
        type: 'string',
        maxLength: 64,
        required: true
      },
      key: {
        type: 'string',
        maxLength: 64,
        required: true
      }
    }
  },
  certificate: {
    type: 'object',
    validate: {
      pfxKey: {
        type: 'string',
        maxLength: 64,
        required: true
      },
      pfx: {
        type: 'text',
        maxLength: 64,
        required: true
      }
    }
  },
  message: {
    type: 'object',
    validate: {
      aes: {
        type: 'string',
        maxLength: 64,
        required: true
      }
    }
  },
  oauth: {
    type: 'object',
    validate: {
      state: {
        type: 'string',
        maxLength: 64,
        required: true
      },
      scope: {
        type: 'int',
        required: true
      }
    }
  }
};
