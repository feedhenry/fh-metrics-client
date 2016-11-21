# fh-metrics-client
### Install

```shell
npm install fh-metrics-client --save
```

### Usage

Import the module, pass the configuration for metrics

```javascript

var fhMetrics = require('fh-metrics')(metricsConfig)


fhMetrics.getAppMetrics(params,cb);

//params is an object:

{
  "metric":"apprequestdest",
  "from": timestamp,
  "to":timestamp,
  "app":<appguid>
}

fhMetrics.getDomainMetrics(params,cb);

//params is an object:

{
  "metric":"apprequestdest",
  "from": timestamp,
  "to":timestamp,
  "domain":<domain>
}


```

###Versioning

Bump version numbers in 

* npm-shrinkwrap.json
* package.json
* sonar-project.properties