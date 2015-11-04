'use strict';
var svnode = function() {

  var svn = require('svn-interface');
  var exec = require('child_process').exec;
  var path = process.cwd();

  svn.status('', {}, function(err, res){
    console.log(res.status.target.entry.map(function(entry){
      return entry['wc-status']._attribute.item + ' - ' + entry._attribute.path;
    }));
  });
}();
