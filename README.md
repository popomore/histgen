# histgen

[![NPM version](https://img.shields.io/npm/v/histgen.svg?style=flat)](https://npmjs.org/package/histgen)
[![Build Status](https://img.shields.io/travis/popomore/histgen.svg?style=flat)](https://travis-ci.org/popomore/histgen)
[![Build Status](https://img.shields.io/coveralls/popomore/histgen?style=flat)](https://coveralls.io/r/popomore/histgen)
[![NPM downloads](http://img.shields.io/npm/dm/histgen.svg?style=flat)](https://npmjs.org/package/histgen)

Generate history markdown from commit

---

## Install

```
$ npm install histgen -g
```

## Usage

```
var History = require('histgen');
new History()
.target('CHANGELOG.md') // default is History.md
.cwd('/path/to/dir') // default is process.cwd()
.gen(1.0.0. function(err) {
  if (err) {
    return console.error(err.message);
  } 
});
```

## Commander

```
$ histgen 1.0.0
```

## LISENCE

Copyright (c) 2015 popomore. Licensed under the MIT license.
