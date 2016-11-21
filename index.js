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

var request = require('request');
var util = require('util');
var _ = require('underscore');
var moment = require('moment');

module.exports = function (config){

  const API_KEY_HEADER = 'x-feedhenry-metricsapikey';
  const CONF_API_KEY_KEY = "apikey";
  const CONF_METRICS_HOST = "host";
  const CONF_METRICS_PORT = "port";
  const CONF_METRICS_PROTOCOL = "protocol";

  const MISSING_CONFIG_KEY_ERROR = "Missing required config key %s";
  const MISSING_CONFIG_ERROR = "Missing config. No config passed to metrics client";
  if(! config){
    throw new Error(MISSING_CONFIG_ERROR);
  }

  function checkConfigKeys(keys){
    _.each(keys, function(k){
      if(! config.hasOwnProperty(k)){
        throw new Error(util.format(MISSING_CONFIG_KEY_ERROR,k));
      }
    });
  }
  checkConfigKeys([CONF_API_KEY_KEY,CONF_METRICS_HOST,CONF_METRICS_PORT,CONF_METRICS_PROTOCOL]);


  function appendCommonMetricsHeaders(toAdd){
    var headers = {};
    headers[API_KEY_HEADER] = config.apiKey;
    if(toAdd) {
      _.extend(headers, toAdd);
    }
    return headers;
  }
  
  function log(message){
    if(config.debug){
      console.log("fh-metrics-client: ", message);
    }
  }

  function parseDate(date){
    return{
      "date": Number(date.format("DD")),
      "month": Number(date.format("MM")),
      "year": Number(date.format("YYYY"))
    };
  }

  function getMetricsUrl(path){
    return config[CONF_METRICS_PROTOCOL] + "://" + config[CONF_METRICS_HOST] + ":" + config[CONF_METRICS_PORT] + path;
  }

  function requestCallback(cb){
    return function (err,response,body){
      return cb(err,body,response.statusCode);
    }
  }

  function validateParamsHasProperties(expected, actual){
    var missing = _.filter(expected,function(e){
      if(actual && ! actual.hasOwnProperty(e)){
        return e;
      }
    });
    if(missing && missing.length > 0){
      return {"error":"missing params","missing":missing,"code":400};
    }

  }
  
  function getAllMetrics(metric,from,to,cb){
    from = Number(from);
    to = Number(to);
    if(isNaN(from) || isNaN(to)){
      return cb({"message":"invalid date passed to getAllMetrics from: " + from + " to " + to ,"code":400});
    }
    var url = getMetricsUrl("/metric/" + metric);
    url+="?from=" + from + "&to=" + to;
    log("url for metrics " + url);
    request({"url":url,"method":"get","json":true,headers:appendCommonMetricsHeaders()},requestCallback(cb));
  }


  return{
    "getDomainMetrics": function (params, cb){
      log("calling getDomainMetrics" + util.inspect(params));
      var err = validateParamsHasProperties(["metric","domain","from","to"],params);
      if(err)return cb(err);

      var metric = params["metric"];
      var domain = params["domain"];
      var from = Number(params["from"]);
      var to = Number(params["to"]);

      if(isNaN(from) || isNaN(to)){
        return cb({"message":"invalid date passed to getAppMetrics","code":400});
      }

      var fMoment = parseDate(moment(from));
      var tMoment = parseDate(moment(to));
      var url = getMetricsUrl("/metric/"+metric);
      var body = {
        "_id":domain,
        "from":fMoment,
        "to":tMoment
      };
      request({"url":url,method:"POST","json":body,headers:appendCommonMetricsHeaders()},requestCallback(cb));

    },
    "getAppMetrics" : function getAppMetrics(params,cb){
      log("calling getAppMetrics" + util.inspect(params));
      var err = validateParamsHasProperties(["metric","domain","from","to","app"],params);
      if(err)return cb(err);

      var metric = params["metric"];
      var domain = params["domain"];
      var from = Number(params["from"]);
      var to = Number(params["to"]);
      var app = params["app"];

      if(isNaN(from) || isNaN(to)){
        return cb({"message":"invalid date passed to getAppMetrics","code":400});
      }
      var fMoment = parseDate(moment(from));
      var tMoment = parseDate(moment(to));
      var url = getMetricsUrl("/metric/" + metric);

      var body = {
        "_id": app,
        "metric":metric,
        "from":fMoment,
        "to":tMoment
      };

      request({"url":url,method:"POST","json":body,headers:appendCommonMetricsHeaders()},requestCallback(cb));

    },
    "getAllDomainMetrics" : function (params, cb){
      log("calling getAllDomainMetrics" + util.inspect(params));
      getAllMetrics("domain",params.from,params.to,cb);
    },
    "getAllAppMetrics" : function (params,cb){
      log("calling getAllAppMetrics" + util.inspect(params));
      getAllMetrics("app",params.from,params.to,cb);
    }
  };
};
