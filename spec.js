var ok = require('assert').ok,
    browserify = require('browserify'),
    reactiscriptsixify = require('./index'),
    undoubted = require('./undoubted'),
    coffeeify = require('coffeeify');

describe('reactiscriptsixify', function() {
  var bundle = function(entry, cb) {
    return browserify(entry)
      .transform(coffeeify)
      .transform(reactiscriptsixify)
      .bundle(cb);
  };

  it('works for *.js with pragma', function(done) {
    return bundle('./fixtures/main.js', function(err, result) {
      ok(!err);
      ok(result);
      return done();
    });
  });

  it('works for *.jsx', function(done) {
    return bundle('./fixtures/main.jsx', function(err, result) {
      ok(!err);
      ok(result);
      return done();
    });
  });

  it('works for plain *.js', function(done) {
    return bundle('./fixtures/simple.js', function(err, result) {
      ok(!err);
      ok(result);
      return done();
    });
  });

  it('works for *.coffee', function(done) {
    return bundle('./fixtures/coffee.coffee', function(err, result) {
      ok(!err);
      ok(result);
      return done();
    });
  });

  it('returns error on invalid JSX', function(done) {
    return bundle('./fixtures/invalid.js', function(err, result) {
      ok(err);
      ok(!result);
      return done();
    });
  });

  it('works for *.js without pragma when we ask it so', function(done) {
    return browserify('./fixtures/main.jsnox')
      .transform({extension: 'jsnox'}, reactiscriptsixify)
      .bundle(function(err, result) {
        ok(!err);
        ok(result);
        return done();
      });
  });

  return it('works for ecmascript 6 files', function(done) {
      return browserify('./fixtures/es6.jsx')
        .transform(reactiscriptsixify)
        .bundle(function(err, result) {
          ok(!err);
          ok(result);
          return done();
      });
  });
});
