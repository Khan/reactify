var jstransform = require('jstransform');
var process = require('./index').process;
var visitors = require('react-tools/vendor/fbtransform/visitors');

function transformer(js) {
    var visitorList = visitors.getAllVisitors();
    return jstransform.transform(visitorList, js).code;
}

module.exports = function(file) {
  return process(file, true, transformer);
};
