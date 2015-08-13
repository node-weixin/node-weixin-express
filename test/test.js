'use strict';
var nodeWeixinExpress = require('../');

var request = require('supertest');

describe('node-weixin-express node module', function (done) {
  it('must have at least one test', function () {
    var server = nodeWeixinExpress({}, {});
    request(server).post('/weixin/ack').expect(200).end(done);
    //assert(false, 'I was too lazy to write any tests. Shame on me.');
  });
});
