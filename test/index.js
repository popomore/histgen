'use strict';

var should = require('should');
var join = require('path').join;
var resolve = require('path').resolve;
var fs = require('fs');
var exists = fs.existsSync;
var cp = require('child_process');
var mm = require('mm');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');
var History = require('..');

describe('histgen', function() {

  describe('.target', function() {
    it('should base on current directory by default', function() {
      new History()._target.should.eql(join(process.cwd(), 'History.md'));
    });

    it('should set target by method', function() {
      new History()
      .target('CHANGELOG.md')
      ._target.should.eql(resolve('CHANGELOG.md'));
    });

    it('should not set target when arguments not exists', function() {
      new History()
      .target('')
      ._target.should.eql(join(process.cwd(), 'History.md'));
    });
  });

  describe('.cwd', function() {
    it('should be current directory by default', function() {
      new History()._cwd.should.eql(process.cwd());
    });

    it('should set cwd by method', function() {
      new History()
      .cwd('work')
      ._cwd.should.eql(resolve('work'));
    });

    it('should not set target when arguments not exists', function() {
      new History()
      .cwd('')
      ._cwd.should.eql(process.cwd());
    });
  });

  describe('.gen', function() {
    afterEach(mm.restore);
    afterEach(function(done) {
      rimraf(join(__dirname, 'tmp'), done);
    });

    it('should generate history', function(done) {
      mm(cp, 'exec', function(cmd, cb) {
        cb(null, '- line1\n- line2');
      });
      var target = join(__dirname, 'tmp', 'history.md');
      new History()
      .target(target)
      .gen('1.0.0', function(err) {
        should.not.exists(err);
        exists(target).should.be.true;
        fs.readFileSync(target).toString().should.match(/## 1.0.0 \/ \d{4}-\d{2}-\d{2}\n\n- line1\n- line2\n\n/);
        done();
      });
    });

    it('should generate history when history.md exists', function(done) {
      mm(cp, 'exec', function(cmd, cb) {
        cb(null, '- line1\n- line2');
      });
      var target = join(__dirname, 'tmp', 'history.md');
      mkdirp.sync(join(__dirname, 'tmp'));
      fs.writeFileSync(target, 'target');
      new History()
      .target(target)
      .gen('1.0.0', function(err) {
        should.not.exists(err);
        exists(target).should.be.true;
        fs.readFileSync(target).toString().should.match(/## 1.0.0 \/ \d{4}-\d{2}-\d{2}\n\n- line1\n- line2\n\ntarget/);
        done();
      });
    });

    it('should get error when exec throw', function(done) {
      mm.error(cp, 'exec', 'command error');
      var target = join(__dirname, 'tmp', 'history.md');
      new History()
      .target(target)
      .gen('1.0.0', function(err) {
        err.message.should.eql('command error');
        done();
      });
    });

    it('should throw', function(done) {
      mm(cp, 'exec', function(cmd, cb) {
        cb(null, '- line1\n- line2');
      });
      var target = join(__dirname, 'tmp', 'history.md');
      new History()
      .target(target)
      .gen(function(err) {
        should.exists(err);
        err.message = 'tag not found';
        done();
      });
    });
  });
});
