'use strict';
module.exports = function() {
  var svn = require('svn-interface');
  var clc = require('cli-color');
  var color;
  svn.status('', {}, function(err, res){
    res.status.target.entry.forEach(function(entry) {
      var status = entry['wc-status']._attribute.item;
      switch (status) {
        case 'unversioned':
          color = clc.xterm(236);
          break;
        case 'modified':
          color = clc.xterm(227);
          break;
        default:
        console.log('dupa', status);
          color = clc.white;
          break;
      }
      console.log(color(status + ' ' + entry._attribute.path));
    });
  });

};
