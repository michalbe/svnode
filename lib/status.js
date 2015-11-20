'use strict';
module.exports = function(cb) {
  var svn = require('svn-interface');
  var clc = require('cli-color');
  var color;

  // Whats happening in here is basically adding different colors to different
  // types of files - unversioned will be gray, modified yellow, etc.
  var parseEntryLine = function(entry) {
    var status = entry['wc-status']._attribute.item;
    switch (status) {
      case 'unversioned':
        color = clc.xterm(236);
        break;
      case 'modified':
        color = clc.xterm(227);
        break;
      default:
        color = clc.white;
        break;
    }
    console.log(color(status + ' ' + entry._attribute.path));
  };

  // Clear the screen...
  console.log('\u001b[2J\u001b[0;0H');
  // ...then ask SVN for the status (what just run `svn status`
  // behind the scene).
  svn.status('', {}, function(err, res) {
    // If there is anything to display (so there is more than 0 changes
    // in the repo)...
    if (res.status.target.entry) {
      // ...display list of modified/added files...
      console.log(clc.xterm(200)('Locally modified items:'));
      if (res.status.target.entry.length) {
        res.status.target.entry.forEach(parseEntryLine);
      } else {
        // ...or a single file when there is just one change.
        parseEntryLine(res.status.target.entry);
      }
    } else {
      // If there are no changes, show the message.
      console.log(clc.xterm(200)('Nothing to commit...'));
    }
    // Display the menu.
    cb();
  });

};
