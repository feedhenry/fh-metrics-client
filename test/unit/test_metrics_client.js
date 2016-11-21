/*
 JBoss, Home of Professional Open Source
 Copyright Red Hat, Inc., and individual contributors.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

var util = require('util');
var assert = require('assert');
var proxyquire = require('proxyquire');

var undertest = '../../index';

var mock = {
  'request': function (params,cb){
    cb(undefined,{"statusCode":200},{});
  }
};

var metricsConfig = {
  "host":"127.0.0.1",
  "port":"8813",
  "protocol":"http",
  "apikey":"somekey"
};

exports.test_metrics_config_ok = function (finish){
  try {
    proxyquire(undertest, {})(metricsConfig);
  }catch(e){
    assert.fail("did not expect an exception");
  }
  finish();
};

exports.test_metrics_config_fail = function (finish){
  try {
    proxyquire(undertest, {})({"host":"host"});
  }catch(e){
    assert.ok(e,"expected an exception");
    return finish();
  }
  assert.fail("expected an exception");
};


exports.test_get_app_metrics_ok = function (finish){
  var metricsClient = proxyquire(undertest, mock)(metricsConfig);
  var args = {"metric":"appinstalldest","domain":"testing","from":new Date().getTime(),"to":new Date().getTime(),"app":"sdadsdasdsadas"};
  metricsClient.getAppMetrics(args, function (err, ok, status){
    assert.ok(! err, 'did not expect an error');
    assert.ok(ok,"expected a response");
    assert.ok(200 == status,"expected 200 status " +  status);
    finish();
  });
};


exports.test_get_app_metrics_error = function (finish){
  var metricsClient = proxyquire(undertest, mock)(metricsConfig);
  var args = {"metric":"appinstalldest","from":new Date().getTime(),"to":new Date().getTime(),"app":"sdadsdasdsadas"};
  metricsClient.getAppMetrics(args, function (err, ok, status){
    assert.ok( err, 'expected an error' + err);
    assert.ok(400 == err.code,"expected 400 code " +  err.code);
    finish();
  });
};


exports.test_get_domain_metrics_ok = function (finish){
  var metricsClient = proxyquire(undertest, mock)(metricsConfig);
  var args = {"metric":"appinstalldest","domain":"testing","from":new Date().getTime(),"to":new Date().getTime()};
  metricsClient.getDomainMetrics(args, function (err, ok, status){
    assert.ok(! err, 'did not expect an error ' + util.inspect(err));
    assert.ok(ok,"expected a response");
    assert.ok(200 == status,"expected 200 status " +  status);
    finish();
  });
};


exports.test_get_domain_metrics_error = function (finish){
  var metricsClient = proxyquire(undertest, mock)(metricsConfig);
  var args = {"metric":"appinstalldest","from":new Date().getTime(),"to":new Date().getTime()};
  metricsClient.getDomainMetrics(args, function (err, ok, status){
    assert.ok( err, 'expected an error ' + util.inspect(err));
    assert.ok(400 == err.code,"expected 400 code " +  err.code);
    finish();
  });
};


exports.test_get_domain_metrics_nan = function (finish){
  var metricsClient = proxyquire(undertest, mock)(metricsConfig);
  var args = {"metric":"appinstalldest","domain":"testing","from":"not a number","to":new Date().getTime()};
  metricsClient.getDomainMetrics(args, function (err, ok, status){
    assert.ok( err, 'expected an error ' + util.inspect(err));
    assert.ok(400 == err.code,"expected 400 code " +  err.code);
    finish();
  });
};

exports.test_get_app_metrics_nan = function (finish){
  var metricsClient = proxyquire(undertest, mock)(metricsConfig);
  var args = {"metric":"appinstalldest","domain":"testing","from":"notanumber","to":new Date().getTime()};
  metricsClient.getDomainMetrics(args, function (err, ok, status){
    assert.ok( err, 'expected an error ' + util.inspect(err));
    assert.ok(400 == err.code,"expected 400 code " +  err.code);
    finish();
  });
};


exports.test_get_all_app_metrics_ok = function (finish){
  var metricsClient = proxyquire(undertest, mock)(metricsConfig);
  var args = {"from":new Date().getTime(),"to":new Date().getTime()};
  metricsClient.getAllAppMetrics(args, function (err, ok, status){
    assert.ok(! err, 'did not expect an error');
    assert.ok(ok,"expected a response");
    assert.ok(200 == status,"expected 200 status " +  status);
    finish();
  });
};


exports.test_get_all_app_metrics_error = function (finish){
  var metricsClient = proxyquire(undertest, mock)(metricsConfig);
  var args = {"to":new Date().getTime()};
  metricsClient.getAllAppMetrics(args, function (err, ok, status){
    assert.ok( err, 'expected an error' + err);
    assert.ok(400 == err.code,"expected 400 code " +  err.code);
    finish();
  });
};

exports.test_get_all_domain_metrics_ok = function (finish){
  var metricsClient = proxyquire(undertest, mock)(metricsConfig);
  var args = {"from":new Date().getTime(),"to":new Date().getTime()};
  metricsClient.getAllDomainMetrics(args, function (err, ok, status){
    assert.ok(! err, 'did not expect an error');
    assert.ok(ok,"expected a response");
    assert.ok(200 == status,"expected 200 status " +  status);
    finish();
  });
};

exports.test_get_all_domain_metrics_error = function (finish){
  var metricsClient = proxyquire(undertest, mock)(metricsConfig);
  var args = {"from":new Date().getTime()};
  metricsClient.getAllDomainMetrics(args, function (err, ok, status){
    assert.ok( err, 'expected an error' + err);
    assert.ok(400 == err.code,"expected 400 code " +  err.code);
    finish();
  });
};




