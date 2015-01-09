#!/usr/bin/env node

'use strict';

var join = require('path').join;
var program = require('commander');
var History = require('./index');

program
  .version(require(join(__dirname, 'package.json')).version)
  .usage('tag')
  .parse(process.argv);

new History()
.gen(program.args[0], function(err) {
  if (err) {
    console.error(err.message);
  } else {
    console.info('generate ' + this._taraget);
  }
});
