'use strict';
module.exports = function(cb) {
  var svn = require('svn-interface');
  var clc = require('cli-color');

  // How many revisions the list should be limited to.
  // This should be handled in smarter way than just hardcoding.
  // XXX: Maybe something like https://github.com/michalbe/svnode/issues/43 ?
  var NUMBER_OF_LOGS = 5;

  // Add colors to the parsed log parts
  var colorLog = function(log) {
    var output = {};
    for (var key in log) {
      switch (key) {
        // Revision number
        case '_attribute':
          output.revision = clc.white(log[key].revision);
          break;
        case 'author':
          output.author = clc.xterm(227)(log[key]._text);
          break;
        case 'date':
          log[key]._text = new Date(log[key]._text);
          output.date = clc.xterm(236)(log[key]._text);
          break;
        case 'msg':
          // Commit message
          output.msg = clc.xterm(200)(log[key]._text);
          break;
      }
    }

    return output;
  };
  // Clear the screen...
  console.log('\u001b[2J\u001b[0;0H');
  // ...then ask SVN for the log (what just run `svn log`
  // behind the scene).
  svn.log('', {'limit': NUMBER_OF_LOGS}, function(err, res) {
    if (res.log.logentry) {
      var coloredLog;
      // For each log in the log list...
      res.log.logentry.forEach(function(singleLog) {
        // ... add colors to it's elements
        coloredLog = colorLog(singleLog);
        console.log('Revision: ' + coloredLog.revision +
                    ' from ' + coloredLog.date);
        console.log('By: ' + coloredLog.author);
        console.log('Message: ' + coloredLog.msg + '\n');
      });
      cb();
    } else {
      console.log('\n\n');
      console.log(clc.xterm(200)('Error accessing the log...'));
      cb();
      return;
    }
  });

};
