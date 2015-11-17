'use strict';
module.exports = function(cb) {
  var svn = require('svn-interface');
  var clc = require('cli-color');
  var color;
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

  console.log('\u001b[2J\u001b[0;0H');
  console.log(clc.xterm(200)('Locally modified items:'));

  svn.status('', {}, function(err, res) {
    if (res.status.target.entry.length) {
      res.status.target.entry.forEach(parseEntryLine);
    } else {
      parseEntryLine(res.status.target.entry);
    }
    cb();
  });

};
