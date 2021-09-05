var initTracer = require('jaeger-client').initTracer;

var config = {
  serviceName: 'my-awesome-service',
};
var options = {
  tags: {
    'my-awesome-service.version': '1.1.2',
  },
  metrics: metrics,
  logger: logger,
};


var tracer = initTracer(config, options);