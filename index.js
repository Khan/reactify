var docblock     = require('jstransform/src/docblock');
var jstransform  = require('jstransform');
var jsxtransform = require('react-tools').transform;
var through      = require('through');
var visitors     = require('react-tools/vendor/fbtransform/visitors');

var isJSXExtensionRe = /^.+\.jsx$/;

function parsePragma(data) {
  return docblock.parseAsObject(docblock.extract(data));
}

function es6transformer(js) {
    var visitorList = visitors.getAllVisitors();
    return jstransform.transform(visitorList, js).code;
}

function process(file, isJSXFile, transformer) {
  var data = '';
  function write(chunk) {
    return data += chunk;
  }

  function compile() {
    var isJSXPragma = parsePragma(data).jsx != null;

    if (isJSXFile || isJSXPragma) {
      if (!isJSXPragma) {
        data = '/** @jsx React.DOM */' + data;
      }
      try {
        var transformed = transformer(data);
        this.queue(transformed);
      } catch (error) {
        this.emit('error', 'Error reactifying ' + file + ': ' + error);
      }
    } else {
      this.queue(data);
    }
    return this.queue(null);
  }

  return through(write, compile);
}

function getExtensionsMatcher(extensions) {
  return new RegExp('.(' + extensions.join('|') + ')$');
}

module.exports = function(file, options) {
  options = options || {};
  var extensions = ['jsx']
    .concat(options.extension)
    .concat(options.x)
    .filter(Boolean)
    .map(function(ext) { return ext[0] === '.' ? ext.slice(1) : ext; });
  var isJSXFile = getExtensionsMatcher(extensions);

  var transformer = options.withoutes6 ? jsxtransform : es6transformer;
  return process(file, isJSXFile.exec(file), transformer);
};
module.exports.process = process;
module.exports.isJSXExtensionRe = isJSXExtensionRe;
