var Plugin = require('broccoli-caching-writer');
var shell = require('shelljs');
var fs = require('fs');

require('colors').setTheme({
  info: 'grey',
  warn: 'yellow',
  error: 'red',
  debug: 'blue'
}),

ScssLinter.prototype = Object.create(Plugin.prototype);
ScssLinter.prototype.constructor = ScssLinter;
function ScssLinter(inputNodes, options) {
  if (!(this instanceof ScssLinter)) {
    return new ScssLinter(inputNodes, options);
  }

  this.options = options || {};
  Plugin.call(this, inputNodes, {
    annotation: this.options.annotation
  });
}

ScssLinter.prototype.build = function() {
  var options = this.options;
  this.inputPaths.forEach(function(inputPath) {
    if (fs.statSync(inputPath).isDirectory() && inputPath.slice(-1) !== '/') {
      inputPath += '/';
    }

    var result = shell.exec(buildCommand(inputPath, options), {silent: true});
    console.log(formatOutput(result.stdout, inputPath));

    if (result.code === 2) {
      throw new Error('There are errors in your SCSS files');
    }
  });
};

module.exports = ScssLinter;

// PRIVATE ----------------------------

function buildCommand(path, options) {
  var parts = ['scss-lint', path];

  options = options || {};

  if (options.bundleExec) {
    parts.unshift('bundle', 'exec');
  }
  delete options.bundleExec;

  Object.keys(options).forEach(function(key) {
    parts.push('--' + key);
    parts.push(options[key]);
  });

  return parts.join(' ');
}

function formatOutput(output, inputPath) {
  output = output || '';

  output = output
    .split('\n')
    .map(function(error) {
      error = error.replace(inputPath, '');
      var parts = error.match(/(.*:\d+)\s(\[\w+\])(.*)/i);
      if (parts && parts.length >= 3 && Array.isArray(parts)) {
        var message = {
          source: '[scss-lint]',
          file: parts[1].trim().info,
          description: parts[3].trim()
        };
        if (parts[2].trim() === '[W]') message.description = message.description.warn;
        if (parts[2].trim() === '[E]') message.description = message.description.error;
        return message.source + ' ' + message.file + ' - ' + message.description;
      }
    })
    .filter(function(item) {
      return !!item;
    })
    .join("\r\n");

  return output ? "\r\n" + output : '';
}
