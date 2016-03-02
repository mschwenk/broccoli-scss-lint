# broccoli-scss-lint

> Broccoli plugin for [scss-lint](https://github.com/brigade/scss-lint).

### Dependencies

1. [Ruby](http://www.ruby-lanccg.org/en/downloads/) (Ruby 1.9.3+)
2. [scss-lint](https://github.com/brigade/scss-lint#installation)

### Installation
```shell
npm install broccoli-scss-linter --save
```

### Options

#### config
Type: `String`
Default: `''`

Specify a configuration file to use

#### bundleExec
Type: `Boolean`
Default: `false`

Use `bundle exec scss-lint` to run linter

### Example
```js
var ScssLinter = require('broccoli-scss-linter');

var broccoliTree = new ScssLinter([inputNode], {
  config: '.scss-lint.yml'
});
```
