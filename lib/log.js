'use strict';
module.exports = function(cb) {
  var svn = require('svn-interface');
  var clc = require('cli-color');
  var color;

  // Clear the screen...
  console.log('\u001b[2J\u001b[0;0H');
  // ...then ask SVN for the status (what just run `svn status`
  // behind the scene).
  svn.log('', {"limit": 10}, function(err, res) {
    // If there is anything to display (so there is more than 0 changes
    // in the repo)...
    console.log(res.log.logentry);
    // Display the menu.
    cb();
  });

};
