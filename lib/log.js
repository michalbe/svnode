'use strict';
module.exports = function(cb) {
  var svn = require('svn-interface');
  var clc = require('cli-color');
  // var color;

  var colorLog = function(log) {
    for (var key in log) {
      switch (key) {
        case '_attribute':
          return clc.white('Revision ' + log[key].revision);
      }
    }
  };
  // Clear the screen...
  console.log('\u001b[2J\u001b[0;0H');
  // ...then ask SVN for the status (what just run `svn status`
  // behind the scene).
  svn.log('', {'limit': 10}, function(err, res) {
    if (res.log.logentry) {
      res.log.logentry.forEach(function(singleLog) {
        console.log(colorLog(singleLog));
      });
    } else {
      console.log('\n\n');
      console.log(clc.xterm(200)('Error accessing the log...'));
      cb();
      return;
    }
  });

};
