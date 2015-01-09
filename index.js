'use strict';

var path = require('path');
var resolve = path.resolve;
var fs = require('fs');
var exists = require('fs').existsSync;
var cp = require('child_process');
var format = require('util').format;
var mkdirp = require('mkdirp');

module.exports = History;

function History() {
  this._target = resolve('History.md');
  this._cwd = process.cwd();
}

var proto = History.prototype;

proto.cwd = function(cwd) {
  if (cwd) {
    this._cwd = resolve(cwd);
  }
  return this;
};

proto.target = function(target) {
  if (target) {
    this._target = resolve(target);
  }
  return this;
};

proto.gen = function(tag, cb) {
  if (typeof tag !== 'string') {
    cb = tag;
    tag = undefined;
  }
  cb || (cb = function() {});
  if (!tag) {
    return cb(new Error('tag not found'));
  }

  var target = this._target;
  var self = this;
  cp.exec('git log --no-merges --pretty="format:- %s" $(git rev-list --tags --max-count=1)..',
    function (err, commits) {
      if (err) return cb.call(self, err);
      var body = exists(target) ? fs.readFileSync(target).toString() : '';
      var dir = path.dirname(target);
      if (!exists(dir)) mkdirp.sync(dir);
      fs.writeFileSync(target, getContent(tag, commits) + body);
      cb.call(self, null, commits);
    }
  );
};

function getContent(tag, commits) {
  var template = process.env.HISTORY_TEMPLATE || '## %s / %s\n\n%s\n\n';
  var date = formattedDate();
  return format(template, tag, date, commits);
}

function formattedDate (date) {
  date || (date = new Date());
  function pad (n) { return n < 10 ? '0' + n : n }
  return [date.getUTCFullYear(), pad(date.getUTCMonth()+1), pad(date.getUTCDate())].join('-');
}
