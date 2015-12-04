'use strict';
module.exports = function(cb) {
  var svn = require('svn-interface');
  var clc = require('cli-color');
  // var color;

  var colorLog = function(log) {
    var output = {};
    for (var key in log) {
      switch (key) {
        case '_attribute':
          output.revision = clc.white(log[key].revision);
          break;
        case 'author':
          output.author = clc.xterm(227)(log[key]._text);
          break;
      }
    }

    return output;
  };
  // Clear the screen...
  console.log('\u001b[2J\u001b[0;0H');
  // ...then ask SVN for the status (what just run `svn status`
  // behind the scene).
  svn.log('', {'limit': 10}, function(err, res) {
    if (res.log.logentry) {
      var coloredLog;
      res.log.logentry.forEach(function(singleLog) {
        coloredLog = colorLog(singleLog);
        console.log(coloredLog.revision, coloredLog.author);
      });
    } else {
      console.log('\n\n');
      console.log(clc.xterm(200)('Error accessing the log...'));
      cb();
      return;
    }
  });

};
