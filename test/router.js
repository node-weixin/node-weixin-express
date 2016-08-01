'use strict';
var assert = require('assert');
var router = require('../lib/router');
var express = require('express');
var path = require('path');
var parser = require('../lib/parser');

describe('router', function () {
  var config = parser(path.resolve(__dirname, './fixtures/config.yaml'));
  it('should get init', function (done) {
    router(express(), config.template);
    done();
  });
  it('should get index', function (done) {
    router.routers.index({}, {
      send: function (html) {
        assert(html);
        done();
      }
    });
  });
});
